/**
 * Created by gkfonline on 2017/4/1.
 */
var GameMain = {
    userGoldBean: 0, // 用户金豆
    vpbeltchip: [],  //注数数组
    isHasHistory: false,  //有无历史记录
    gameProcess: false,
    initGame: function (data) {  //游戏初始状态
        var bgPath = data.bgPhotoPath;
        var bgImg = commonVariable.url + bgPath.substring(bgPath.indexOf("bg") - 1);
        BlackJackFuc.changeBackImg(bgImg);
        //生成投注金额
        var chipArr = data.vpbeltchip; // 投注大小数额
        this.vpbeltchip = chipArr;
        BlackJackFuc.createChips(chipArr);
        if (data.success) {
            var userName = data.Nickname;  // 用户昵称
            $("#userId").html(userName);
            var userHeadImg;
            if (data.Userheadpath) {
                userHeadImg = commonVariable.url.substring(0, commonVariable.url.lastIndexOf("images")) + data.Userheadpath; // TODO:用户头像地址
            } else {
                userHeadImg = commonVariable.url + "/default_userHead.png";
            }

            $("#userHeadImg img").attr("src", userHeadImg);
            this.userGoldBean = data.goldAllBean;
            $("#BeansNum").html(this.userGoldBean);
            if (data.guessHistory !== null) {
                this.isHasHistory = true;
                $("#gameInit").hide();
                $("#TakeCard").show();
                // 用户投注数
                var userBet = data.guessHistory.beltGoldbean;
                $("#betNum span").html(userBet);
                //倒计时显示
                var minute = data.minute;
                var second = data.second;
                BlackJackFuc.countDown(minute, second);
                //庄家历史记录扑克
                var bankerPokerArr = data.guessHistory.bankerPokerList;
                var bankerSumPoint = bankerPokerArr[0].sumPoint + "点";// 庄家点数
                $("#bankerPoint").text(bankerSumPoint);
                BlackJackFuc.initCreatePoker($("#bankerPoker"), bankerPokerArr);
                //玩家历史记录扑克
                var playerPokerArr = data.guessHistory.playerPokerList;
                var playerSumPoint = playerPokerArr[playerPokerArr.length - 1].sumPoint + "点";
                $("#playerPoint").text(playerSumPoint);  // 用户点数
                BlackJackFuc.initCreatePoker($("#playerPoker"), playerPokerArr);
            } else {
                this.isHasHistory = false;
                $("#gameInit").show();
                $("#TakeCard").hide();
            }
            this.gameProcess = true;
        } else {
            //TODO:用户未登录
            $("#gameInit").show();
            $("#TakeCard").hide();
            if (data.userid === null) {
                $("#revokeBtn,#letGo").removeAttr("disabled");
                $("#userId").html("未登录");
                $("#BeansNum").html(0);
                $("#chipList .chipNum,#revokeBtn,#letGo").unbind("click");
                $("#userInformation,#chipList,#revokeBtn,#letGo,#chipList .chipNum").click(function () {
                    //TODO:调用app的登录方法
                    AppFunction.appToLogin();
                });
                $("#addBeans").unbind("click");
            }
            this.gameProcess = false;
        }
    },
    gameBegin: function (data) {  //投注开始
        if (data.success) {
            $("#gameInit").hide();
            $("#TakeCard").show();
            this.userGoldBean = data.goldAllBean;
            $("#BeansNum").html(this.userGoldBean);
            var minute = data.minute;
            var second = data.second;
            BlackJackFuc.countDown(minute, second);
            var playerPokerArr = data.PlayerPoker;
            var bankerPokerArr = data.bankerPoker;
            BlackJackFuc.dealInit(playerPokerArr, bankerPokerArr);
            if (data.BlackJack) {   //如果玩家BlackJack
                BlackJackFuc.playerBlackJack();
                setTimeout(function () {
                    GameMain.inBankerRound(data);
                }, 2100);
            }
        }
        else {
            // 超出最大限额的判断
            if (data.onMaxBeltBean) {
                $("#maxBeans").show();
            } else {
                $("#maxBeans").hide();
            }
            if(data.goldbeanNotEnough){
                $("#noEnough").show();
            }else {
                $("#noEnough").hide();
            }
        }
    },
    getPoker: function (data) {   //要牌
        if (data.success) {
            var nextPoker = data.nextPoker;
            var mark = nextPoker.mark;
            var point = nextPoker.point;
            var sumPoint = nextPoker.sumPoint;
            var arr = [];
            if (data.Boom) {
                var bankerPokerArr = data.bankerPokerList;
                arr = bankerPokerArr[bankerPokerArr.length - 1];
            } else {
                arr = [];
            }
            BlackJackFuc.playerGetPoker(mark, point, sumPoint, data.Boom, arr);
            if (data.nextPoker.pointInt === 21) {
                //TODO:禁用掉按钮进入庄家回合
                $("#TakeCardBtn button").attr("disabled", true);
                setTimeout(function () {
                    // GameAjax.stopGetPokerAjax();
                    AppFunction.appStopGetPoker();
                }, 700);
            }
        } else {

        }
    },
    inBankerRound: function (data) { //进入庄家回合
        this.isHasHistory = false;
        $("#stopGet,#getNext").attr("disabled", true);
        clearInterval(BlackJackFuc.downTimer);
        if (data.success) {
            BlackJackFuc.bankerGetPoker(data);
        } else {

        }
    },
    createSlideList: function (data) {
        var carouselList = data.carouselList;
        var len = carouselList.length;
        var listWidth;
        for (var i = 0; i < len; i++) {
            $("#slidList").append("<li></li>");
            $("#slidList li").eq(i).html(carouselList[i]);
            if (24 * (carouselList[i].length) <= 400) {
                listWidth = 400 + "px"
            } else {
                listWidth = (24 * (carouselList[i].length)) + "px"
            }

            $("#slidList li").eq(i).css({
                width: listWidth
            });
        }
        var self = this;
        setInterval(function () {
            self.slideTop();
        }, 5200);
    },
    slideTop: function () {
        var $list = $("#slidList");
        var firstWidth = $("#slidList li").eq(0).get(0).offsetWidth;
        var playListWidth = $("#playList").get(0).offsetWidth;
        var slideWidth;
        var slideHeight = $("#slidList li").eq(0).get(0).offsetHeight;
        if (firstWidth > playListWidth) {
            // slideWidth = (-(firstWidth - playListWidth));
            if (BlackJackFuc.isAndroid) {
                slideWidth = -200;
            } else {
                slideWidth = -300;
            }
        } else {
            slideWidth = 0;
        }
        $list.find("li").eq(0).animate({
            // "-webkit-transform": "translateX(" + slideWidth + ")",
            // "-moz-transform": "translateX(" + slideWidth + ")",
            // "-ms-transform": "translateX(" + slideWidth + ")",
            // "-o-transform": "translateX(" + slideWidth + ")",
            // transform: "translateX(" + slideWidth + ")"
            marginLeft: slideWidth
        }, 3000, "ease", function () {
            $list.animate({
                marginTop: -slideHeight
            }, {
                duration: 2000,
                easing: "ease-in-out",
                complete: function () {
                    $list.css({
                        marginTop: 0
                    }).find("li").eq(0).css({
                        // "-webkit-transform": "translateX(0)",
                        // "-moz-transform": "translateX(0)",
                        // "-ms-transform": "translateX(0)",
                        // "-o-transform": "translateX(0)",
                        // transform: "translateX(0)"
                        marginLeft: 0
                    }).appendTo($list);
                }
            });
        });
    },
    quitGame: function () {
        if (this.gameProcess) {
            $("#exitWindow").show();
        } else {
            AppFunction.appExitGame();
        }

    }
}