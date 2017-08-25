/**
 * Created by gkfonline on 2017/4/1.
 */
var strImgSrc = $("#clock img").attr("src");
var androidPhone = true;
(function () {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1 || u.indexOf("Linux") > -1;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || u.indexOf("iPad") > -1 || u.indexOf("iPhone") > -1 || u.indexOf("Mac OS") > -1;
    if (isAndroid) {
        androidPhone = true;
    }
    if (isIOS) {
        androidPhone = false;
    }
})();

var urlStr;
if (androidPhone) {
    urlStr = "http:" + strImgSrc.substring(0, strImgSrc.lastIndexOf("/")); //资源库地址
} else {
    urlStr = "https:" + strImgSrc.substring(0, strImgSrc.lastIndexOf("/")); //资源库地址
}
var pokerUrl = urlStr + "/poker/";  //扑克图片地址
var commonVariable = {   //传递变量的作用使变量可以能被其他的js访问
    url: urlStr,
    poker: pokerUrl
};
var anyNum = 0;

var boomTimerIndex = 0; // 玩家boom的计时器

var isWinTimerIndex = 0;// 胜负计时器

var BlackJackFuc = {
    speed: 0.68, // 默认间距
    defaultDistance: 1.5, //默认距离
    defaultImgSrc: pokerUrl + "bg_poker.png",
    downTimer: null,
    pokerAreaTrance: 0.3,
    isAndroid: false,
    changeBackImg: function (gameBg) {  //TODO:背景图片地址
        $("#blackJack").css({
            "background-image": "url(" + gameBg + ")"
        });
    },
    hideShowBet: function () {
        $("#showBet").animate({
            "-webkit-transform": "translateX(-4rem)",
            "-moz-transform": "translateX(-4rem)",
            "-ms-transform": "translateX(-4rem)",
            "-o-transform": "translateX(-4rem)",
            transform: "translateX(-4rem)"
        }, 1000, "linear");
    },
    countDown: function (minute, seconds) {   // 倒计时显示 minute分钟 seconds 秒数
        $("#minute").html(this.numShow(minute));
        $("#second").html(this.numShow(seconds));
        var self = this;
        this.downTimer = setInterval(function () {
            if (minute > 0) {
                if (seconds > 0) {
                    seconds--;
                    $("#second").html(self.numShow(seconds));
                } else {
                    seconds = 60;
                    minute--;
                    $("#minute").html(self.numShow(minute));
                    $("#second").html(self.numShow(seconds));
                }
            } else {
                if (seconds > 0) {
                    seconds--;
                    $("#second").html(self.numShow(seconds));
                } else {
                    //TODO:倒计时做的处理调起庄家回合接口 禁用要牌 停牌按钮
                    AppFunction.appStopGetPoker();
                }
            }
        }, 1000);
    },
    numShow: function (num) { //秒数显示
        if (num < 10) {
            num = "0" + num
            return num;
        } else {
            return num;
        }
    },
    /**
     * @function  扑克的执行动画
     * @param el  执行的节点
     * @param imgSrc 图片的地址
     * @param duration 执行时间
     * @param delay 延时执行时间
     * @param distanceX 执行的X距离
     * @param distanceY 执行Y距离
     * @param point  点数显示
     * @param isPlayer 是不是玩家的牌局
     * @param isPlayerBoom 玩家是否爆牌 false 移除引用属性 true 不移除禁用属性  （可省略）
     * @param isUnRotate 不写参数即可旋转当前图片，TRUE即不旋转 （可省略）
     * @param arr 庄家扑克数组  （可省略）
     * @param data  判断玩家输赢的 （可省略）
     */
    pokerAni: function (el, imgSrc, duration, delay, distanceX, distanceY, point, isPlayer, isPlayerBoom, isUnRotate, arr, data) {
        $("#TakeCardBtn button").attr("disabled", true);
        var elImg = el.find("img");
        var $elParent = el.parent(".pokerArea");// 当前移动元素的父元素
        var len = $elParent.find(".poker").length;
        var elPokerPoint = $elParent.siblings(".pointText");
        var pokerAreaTrance = 0;
        if (isPlayer) {
            if (GameMain.isHasHistory) {
                if (len <= 4) {
                    pokerAreaTrance = BlackJackFuc.pokerAreaTrance * (len - 3);
                } else {
                    pokerAreaTrance = BlackJackFuc.pokerAreaTrance;
                }
            } else {
                if (len > 2 && len <= 4) {
                    pokerAreaTrance = BlackJackFuc.pokerAreaTrance * (len - 2);
                } else if (len > 4) {
                    pokerAreaTrance = 0.6;
                }
            }
            $("#playerPoker").animate({
                "-webkit-transform": "translateX(" + (-pokerAreaTrance) + "rem)",
                "-moz-transform": "translateX(" + (-pokerAreaTrance) + "rem)",
                "-ms-transform": "translateX(" + (-pokerAreaTrance) + "rem)",
                "-o-transform": "translateX(" + (-pokerAreaTrance) + "rem)",
                transform: "translateX(" + (-pokerAreaTrance) + "rem)"
            }, 1000, "ease-in-out");
        } else {
            if (len > 2 && len <= 4) {
                pokerAreaTrance = BlackJackFuc.pokerAreaTrance * (len - 2);
            } else if (len > 4) {
                pokerAreaTrance = 0.6;
            }
            $("#bankerPoker").animate({
                "-webkit-transform": "translateX(" + (-pokerAreaTrance) + "rem)",
                "-moz-transform": "translateX(" + (-pokerAreaTrance) + "rem)",
                "-ms-transform": "translateX(" + (-pokerAreaTrance) + "rem)",
                "-o-transform": "translateX(" + (-pokerAreaTrance) + "rem)",
                transform: "translateX(" + (-pokerAreaTrance) + "rem)"
            }, 1000, "ease-in-out");
        }
        el.animate({
            "-webkit-transform": "translate(" + distanceX + "rem," + distanceY + "rem)",
            "-moz-transform": "translate(" + distanceX + "rem," + distanceY + "rem)",
            "-ms-transform": "translate(" + distanceX + "rem," + distanceY + "rem)",
            "-o-transform": "translate(" + distanceX + "rem," + distanceY + "rem)",
            transform: "translate(" + distanceX + "rem," + distanceY + "rem)"
        }, {
            duration: duration,
            easing: "ease-in-out",
            complete: function () {
                if (!isUnRotate) {
                    BlackJackFuc.rotateImg(elImg, imgSrc);
                }
                elPokerPoint.html(point + "点");//显示点数
                if (isPlayer) {
                    $("#TakeCardBtn button").removeAttr("disabled");
                }
                if (isPlayerBoom) { //如果玩家爆牌，翻开庄家底牌
                    $("#playerPoint").removeClass("noBoom").addClass("boom");
                    clearTimeout(boomTimerIndex);
                    var boomID = setTimeout(function () {
                        BlackJackFuc.playerBoom(arr);
                    }, 700);
                    $("#TakeCardBtn button").attr("disabled", true);
                    boomTimerIndex = boomID;
                }
                if (data !== undefined) {
                    clearTimeout(isWinTimerIndex);
                    var isWinId = setTimeout(function () {
                        BlackJackFuc.playerWin(data);
                    }, 1400);
                    isWinTimerIndex = isWinId;
                }
            },
            delay: delay
        })
    },
    /**
     * @function 扑克翻转动画
     * @param el 节点
     * @param imgSrc  图片地址
     */
    rotateImg: function (el, imgSrc) {
        el.animate({
            "-webkit-transform": "rotateY(0)",
            "-moz-transform": "rotateY(0)",
            "-ms-transform": "rotateY(0)",
            "-o-transform": "rotateY(0)",
            transform: "rotateY(0)"
        }, 300, "linear");
        setTimeout(function () {
            el.attr("src", imgSrc);
        }, 100);
    },
    // 初始要牌
    dealInit: function (playerPokerArr, bankerPokerArr) {
        var bankerPokerSrc, playerPokerSrc;
        var delay = 0; // 延时
        var isBoom = false;// 是否爆牌
        var playerSumPoint = 0, bankerSumPoint = 0; //总点数
        var distanceX = 0;
        var isRotate = false;
        for (var i = 0; i < 2; i++) {
            $("#bankerPoker,#playerPoker").append("<div class='poker'><img src='' alt=''></div>");
            $("#bankerPoker .poker").eq(i).find("img").attr("src", this.defaultImgSrc);
            $("#playerPoker .poker").eq(i).find("img").attr("src", this.defaultImgSrc);
            delay = 700 * i;
            distanceX = this.defaultDistance + this.speed * i;
            if (i === 1) {
                bankerPokerSrc = this.defaultImgSrc;
                isRotate = true;
            } else {
                bankerPokerSrc = pokerUrl + bankerPokerArr.mark + bankerPokerArr.point + ".png";
                bankerSumPoint = bankerPokerArr.sumPoint;
                isRotate = false;
            }
            playerSumPoint = playerPokerArr[i].sumPoint
            playerPokerSrc = pokerUrl + playerPokerArr[i].mark + playerPokerArr[i].point + ".png";
            this.pokerAni($("#playerPoker .poker").eq(i), playerPokerSrc, 700, delay, distanceX, 0, playerSumPoint, true, isBoom);
            this.pokerAni($("#bankerPoker .poker").eq(i), bankerPokerSrc, 700, delay, distanceX, 0, bankerSumPoint, true, isBoom, isRotate);
        }
    },
    /**
     * 玩家要牌
     * @param mark 玩家要牌花色
     * @param point 玩家要牌点数
     * @param sumPoint 玩家总点数
     * @param isBoom 玩家是否爆牌
     */
    playerGetPoker: function (mark, point, sumPoint, isBoom, arr) {
        var pikerSrc = pokerUrl + mark + point + ".png";
        //庄家最后一张牌，如果玩家输了显示出来
        var len = $("#playerPoker .poker").length;
        $("#playerPoker").append("<div class='poker'><img src='' alt=''></div>");
        $("#playerPoker .poker").eq(len).find("img").attr("src", this.defaultImgSrc);
        var distanceX = this.defaultDistance, distanceY = 0;
        if (len <= 3) {
            distanceX = this.speed * len + this.defaultDistance;
            distanceY = 0;
        } else if (len <= 7) {
            distanceX = this.speed * (len - 4) + this.defaultDistance;
            distanceY = 0.5;
        } else {
            distanceX = this.speed * (len - 8) + this.defaultDistance;
            distanceY = 1
        }
        this.pokerAni($("#playerPoker .poker").eq(len), pikerSrc, 700, 0, distanceX, distanceY, sumPoint, true, isBoom, false, arr);
    },
    bankerGetPoker: function (data) {  // 庄家要牌
        var arr = data.bankerPokerList;   //庄家poker列表
        var coverPoker = pokerUrl + arr[1].mark + arr[1].point + ".png"; // 翻开的底牌
        this.rotateImg($("#bankerPoker .poker").eq(1).find("img"), coverPoker);
        $("#bankerPoint").html(arr[1].sumPoint + "点");
        var len = $("#bankerPoker .poker").length;
        //数组长度
        this.defaultDistance = 1.5;  //重置defaultDistance
        if (arr.length > 2) {
            var sub = arr.length - 2;
            var pokerImg;
            var distanceX = this.defaultDistance, distanceY = 0;  //X轴移动距离，Y轴移动距离
            var index = 0;
            for (var i = 0; i < sub; i++) {
                index = len + i;
                pokerImg = pokerUrl + arr[index].mark + arr[index].point + ".png";
                $("#bankerPoker").append("<div class='poker'><img src='' alt=''></div>");
                $("#bankerPoker .poker").eq(index).find("img").attr("src", this.defaultImgSrc);
                var duration = 700 * i;
                if (i >= 2 && i < 6) {
                    distanceX = this.speed * (index - 4) + this.defaultDistance;
                    distanceY = 0.5;
                } else if (i >= 6 && i < 10) {
                    distanceX = this.speed * (index - 8) + this.defaultDistance;
                    distanceY = 1;
                } else {
                    distanceX = this.speed * (index) + this.defaultDistance;
                    distanceY = 0;
                }
                this.pokerAni($("#bankerPoker .poker").eq(len + i), pokerImg, 700, duration, distanceX, distanceY, arr[len + i].sumPoint, false, false, false, [], data);
            }
        } else {
            setTimeout(function () {
                BlackJackFuc.playerWin(data);
            }, 700);
        }
    },
    //判断客户端
    isAndroidIOS: function () {   // Android返回的是true ios返回false
        var u = navigator.userAgent;
        var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1 || u.indexOf("Linux") > -1;
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || u.indexOf("iPad") > -1 || u.indexOf("iPhone") > -1 || u.indexOf("Mac OS") > -1;
        if (isAndroid) {
            this.isAndroid = true;
        }
        if (isIOS) {
            this.isAndroid = false;
        }
    },
    //创建投注的数
    createChips: function (arr) {
        var len = arr.length;
        var chip;
        for (var i = 0; i < len; i++) {
            chip = arr[i];
            if (chip >= 10000) {
                chip = Math.floor(chip / 10000) + "W";
            } else {
                chip = chip;
            }
            $("#chipList .chipNum").eq(i).find("span").html(chip);
        }
    },
    initCreatePoker: function (el, arr) {
        var translateX = 0, translateY = 0; //X轴移动距离Y轴移动距离
        var len = arr.length;
        var src;
        var rotateY = 0; //图片反转角度
        var deDistance = this.defaultDistance - this.pokerAreaTrance * (len - 2);
        for (var i = 0; i < len; i++) {
            el.append("<div class='poker'><img src='' alt=''></div>");
            var elPoker = el.find(".poker").eq(i);
            if (arr[i] === null) {
                src = this.defaultImgSrc;
                rotateY = 180;
            } else {
                src = pokerUrl + arr[i].mark + arr[i].point + ".png";
                rotateY = 0;
            }
            if (i >= 0 && i < 4) {
                translateX = deDistance + this.speed * i;
                translateY = 0;
            } else if (i >= 4 && i < 7) {
                translateX = deDistance + this.speed * (i - 4);
                translateY = 0.5;
            } else {
                translateX = deDistance + this.speed * (i - 7);
                translateY = 1;
            }
            elPoker.css({
                "-webkit-transform": "translate(" + translateX + "rem," + translateY + "rem)",
                "-moz-transform": "translate(" + translateX + "rem," + translateY + "rem)",
                "-ms-transform": "translate(" + translateX + "rem," + translateY + "rem)",
                "-o-transform": "translate(" + translateX + "rem," + translateY + "rem)",
                transform: "translate(" + translateX + "rem," + translateY + "rem)"
            });
            elPoker.find("img").attr("src", src).css({
                "-webkit-transform": "rotateY(" + rotateY + "deg)",
                "-moz-transform": "rotateY(" + rotateY + "deg)",
                "-ms-transform": "rotateY(" + rotateY + "deg)",
                "-o-transform": "rotateY(" + rotateY + "deg)",
                transform: "rotateY(" + rotateY + "deg)"
            });
        }
        this.defaultDistance = deDistance;
    },
    playerBlackJack: function () { // 玩家BlackJack
        setTimeout(function () {
            $("#blackJackWarn").show(); // 玩家出现BlackJack 进入庄家回合
        }, 1600);
        clearInterval(BlackJackFuc.downTimer);
        $("#TakeCardBtn button").attr("disabled", true);
    },
    //玩家是否boom爆牌
    playerBoom: function (lastList) {
        $("#drawWarn").show().html("你输了");  //输了动画结束，执行显示
        clearInterval(BlackJackFuc.downTimer);
        var coverPoker = pokerUrl + lastList.mark + lastList.point + ".png";
        BlackJackFuc.rotateImg($("#bankerPoker .poker").eq(1).find("img"), coverPoker);
        $("#bankerPoint").html(lastList.sumPoint + "点");
        setTimeout(function () {
            AppFunction.appToAnother();
        }, 1000);
    },
    /**
     * @function 对玩家是否获胜做出判断
     * @param isWin
     * @param isBlackJack
     * @param shareBeans
     */
    playerWin: function (data) {
        var isWin = data.isWin,
            isBlackJack = data.BlackJack,
            shareBeans = data.goldBean;
        if (isWin == 0) { //平局
            $("#drawWarn").show().html("平局");
            setTimeout(function () {
                AppFunction.appToAnother();
            }, 1000);
        } else if (isWin == 1) { //获胜
            var shareImg;
            $("#shareWindow").show();
            if (isBlackJack) {
                shareImg = urlStr + "/bg_blackJack.png";
            } else {
                shareImg = urlStr + "/bg_win.png";
            }
            $("#shareImg img").attr("src", shareImg);
            $("#shareText span").text(shareBeans);
        } else { //输
            $("#drawWarn").show().html("你输了");
            setTimeout(function () {
                AppFunction.appToAnother();
            }, 1000);
        }
    }
};


var AppFunction = {
    //游戏初始，调用初始化，加轮播
    appInitGame: function () {
        // 游戏初始化
        if (BlackJackFuc.isAndroid) {
            app.BJInitGameData(anyNum);
        } else {
            window.webkit.messageHandlers.BJInitGameData.postMessage(anyNum);
        }
        //轮播
        if (BlackJackFuc.isAndroid) {
            app.BJGetCarousel(anyNum);
        } else {
            window.webkit.messageHandlers.BJGetCarousel.postMessage(anyNum);
        }

    },
    appBeginGame: function (betSum) {  // 游戏开始
        if (BlackJackFuc.isAndroid) {
            app.BJStartGame(betSum);
        } else {
            window.webkit.messageHandlers.BJStartGame.postMessage(betSum);
        }
    },
    appGetPoker: function () {  // 要牌
        if (BlackJackFuc.isAndroid) {
            app.BJGetPoker(anyNum);
        } else {
            window.webkit.messageHandlers.BJGetPoker.postMessage(anyNum);
        }
    },
    appStopGetPoker: function () {   // 停牌
        if (BlackJackFuc.isAndroid) {
            app.BJStopPokerGame(anyNum);
        } else {
            window.webkit.messageHandlers.BJStopPokerGame.postMessage(anyNum);
        }
    },
    appToLogin: function () {  //登录
        if (androidPhone) {
            app.toLoginBackRefresh();
        } else {
            window.webkit.messageHandlers.toLoginBackRefresh.postMessage(anyNum);
        }
    },
    appToShare: function () {  //分享
        var shareImgUrl = urlStr + "/share-poker.jpg";
        if (BlackJackFuc.isAndroid) {
            app.jumpSharePopupWindow(shareImgUrl);
        } else {
        window.webkit.messageHandlers.jumpSharePopupWindow.postMessage(anyNum);
    }
    },
    appToAdd: function () { //充值
        if (BlackJackFuc.isAndroid) {
            app.jumpRecharge(GameMain.userGoldBean);
        } else {
            window.webkit.messageHandlers.jumpRecharge.postMessage(GameMain.userGoldBean);
        }
    },
    appToAnother: function () { // 再来一局刷新页面
        if (BlackJackFuc.isAndroid) {
            app.OneMoreHand(anyNum);
        } else {
            window.webkit.messageHandlers.OneMoreHand.postMessage(anyNum);
        }
    },
    appExitGame: function () {  //退出游戏
        if (BlackJackFuc.isAndroid) {
            app.temporaryExit(anyNum);
        } else {
            window.webkit.messageHandlers.temporaryExit.postMessage(anyNum);
        }
    }
}

//ajax发送的部分
// var GameAjax = {
//     initAjax: function () {  //游戏初始接口
//         // $.ajax({
//         //     type: "get",
//         //     url: "./initgame.do",
//         //     success: function (data) {
//         //         // var data = JSON.parse(data);
//         //         console.log("初始化:::=", data);
//         //         GameMain.initGame(data);
//         //     },
//         //     error: function (err) {
//         //         console.log(err.status);
//         //     }
//         // })
//     },
//     beginGameAjax: function (betSum) {  //投注开始
//         // $.ajax({
//         //     type: "get",
//         //     url: "http://localhost:8080/VirtualGuess/myapp/vgblackjack/dealdeck.do?beltCount=" + betSum,
//         //     success: function (data) {
//         //         console.log("投注开始::=", data);
//         //         GameMain.gameBegin(data);
//         //     },
//         //     error: function (err) {
//         //         console.log(err.status);
//         //     }
//         // })
//     },
//     getPokerAjax: function () {  //要牌接口
//         // $.ajax({
//         //     type: "get",
//         //     url: "http://localhost:8080/VirtualGuess/myapp/vgblackjack/dealcard.do",
//         //     success: function (data) {
//         //         console.log("玩家要牌:::=", data);
//         //         GameMain.getPoker(data);
//         //     },
//         //     error: function (err) {
//         //         console.log(err.status);
//         //     }
//         // })
//     },
//     stopGetPokerAjax: function () {
//         // $.ajax({
//         //     type: "get",
//         //     url: "http://localhost:8080/VirtualGuess/myapp/vgblackjack/bankerDealCard.do",
//         //     success: function (data) {
//         //         console.log("庄家回合:::=", data);
//         //         GameMain.inBankerRound(data);
//         //     },
//         //     error: function (err) {
//         //         console.log(err.status);
//         //     }
//         // })
//     },
//     getSlidAjax: function () {
//         // $.ajax({
//         //     type: "get",
//         //     url: "http://localhost:8080/VirtualGuess/app/vgblackjack/carousel.do",
//         //     success: function (data) {
//         //         console.log(data);
//         //         GameMain.createSlideList(data);
//         //     },
//         //     error: function (err) {
//         //         console.log(err.status);
//         //     }
//         // })
//     }
// }
