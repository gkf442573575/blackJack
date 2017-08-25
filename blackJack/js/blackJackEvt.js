/**
 * Created by gkfonline on 2017/4/1.
 */
$(document).ready(function () {

    // 按钮定义
    var $ruleBtn = $("#iconRule");
    var $ruleWin = $("#ruleWindow");
    var $revokeBtn = $("#revokeBtn");
    var $letGo = $("#letGo");
    $ruleBtn.click(function () {
        $ruleWin.show();
    });
    $("#returnGame").click(function () {
        $ruleWin.hide();
    });
    (function () {
        $("#revokeBtn,#letGo").attr("disabled", true);//游戏初始禁止两个按钮
        BlackJackFuc.isAndroidIOS();
        // GameAjax.initAjax();
        // GameAjax.getSlidAjax();//TODO:请求接口
        AppFunction.appInitGame();
        if(BlackJackFuc.isAndroid){
            var bodyHeight = document.documentElement.offsetHeight;
            var headHeight = $("#head").get(0).offsetHeight;
            var footHeight = $("#foot").get(0).offsetHeight;
            var maxHeight;
            if (bodyHeight < 520) {
                maxHeight = "13.56rem";
                $(".popWindow").css({
                    height:maxHeight
                });
            } else {
                maxHeight = ((bodyHeight - headHeight - footHeight)) + "px"
            }
            $("#blackJack").css({
                height: maxHeight
            });
        }
        $("style").remove();
        $("iframe").remove();
        $("iframe").remove();
        $("#_yn_g_g,#BAIDU_DUP_fp_wrapper").remove();
    })();
    /**
     * 投注事件
     * firstSub 第一枚筹码投的数量
     * secondSub 第二枚筹码投的数量
     * thirdSub 第三枚筹码投的数量
     * betNum  投注总数
     */
        // 第一个投注总数，第二个投注总数，第三个投注总数
    var betSub = 0, firstIndex = 0, lastIndex = 0;
    var betNum = 0;// 投注数量
    var timerIndex = 0;
    $("#chipList .chipNum").click(function () {
        $revokeBtn.removeAttr("disabled");//移除撤销按钮的禁止属性
        $letGo.removeAttr("disabled");//移除撤销按钮的禁止属性
        var index = $(this).index(); // 获取当前点击的属性
        firstIndex = lastIndex;
        lastIndex = index;
        var chipNum = parseInt(GameMain.vpbeltchip[index]);
        var betImgSrc = commonVariable.url + "/chip60_" + (index + 1) + ".png"  // 显示投注图片的地址
        $("#betImg img").attr("src", betImgSrc);
        var showText = chipNum >= 10000 ? (chipNum / 10000) + "W" : chipNum;
        $("#betImg span").text(showText);
        betNum += chipNum;
        var userGoldBean = GameMain.userGoldBean - betNum;
        if (userGoldBean >= 0) {
            $("#BeansNum").html(userGoldBean); //玩家金豆显示减少
            $("#betNum span").html(betNum);
            $("#bet").animate({    // 字体动画
                fontSize: "0.9rem"
            }, 200, "ease", function () {
                $(this).animate({
                    fontSize: "0.67rem"
                }, 300, "ease");
            });
            if (firstIndex === lastIndex) {
                betSub++;
            } else {
                betSub = 1;
            }
            $("#bet").html(betSub);
        } else {
            //TODO:提示金豆余额不足
            $("#noEnough").show();
        }
        clearTimeout(timerIndex);
        var timerID = setTimeout(function () {
            betSub = 0;
            $("#showBet").css({
                "-webkit-transform": "translateX(-4rem)",
                "-moz-transform": "translateX(-4rem)",
                "-ms-transform": "translateX(-4rem)",
                "-o-transform": "translateX(-4rem)",
                transform: "translateX(-4rem)"
            });
        }, 3000);
        timerIndex = timerID;
        $("#showBet").animate({
            "-webkit-transform": "translateX(0)",
            "-moz-transform": "translateX(0)",
            "-ms-transform": "translateX(0)",
            "-o-transform": "translateX(0)",
            transform: "translateX(0)"
        }, 300, "ease");
        //投注动画
        // var defaultX = 200,defaultY = 100;
        // var randLeft = parseInt(Math.random() * (defaultX - defaultY + 1) + defaultY);
        // console.log(randLeft);
        // var randTop = Math.random()*(0.5)+1.5;
        // console.log(randTop);
        // var imgIndex = $("#floatImg").find("img").length;
        // $("#floatImg").append("<img src=''>");
        // $("#floatImg img").eq(imgIndex).attr("src",betImgSrc);
        // $("#floatImg img").eq(imgIndex).animate({
        //     bottom:randTop+"rem",
        //     left:randLeft,
        // },1000,"linear",function () {
        //
        // });
    });
    /**
     * 撤销按钮事件:
     * 1.撤销所有的投注
     * 2.重新禁用投注按钮
     * 3.返还用户金豆
     */
    $revokeBtn.click(function () {
        betSub = 0;
        $("#bet").html(betSub);
        $("#BeansNum").html(GameMain.userGoldBean);// 返还用户金豆
        $revokeBtn.attr("disabled", true);
        $letGo.attr("disabled", true);
        betNum = 0;// 投注数量清零
        $("#betNum span").html(betNum);
        BlackJackFuc.hideShowBet();
    });
    /**
     * 开始
     * 1.减去用户金豆
     * 2.禁用撤销(防止数据请求时间过长的话)
     */
    $letGo.click(function () {//TODO:请求接口
        $revokeBtn.attr("disabled", true);
        $letGo.attr("disabled", true);
        BlackJackFuc.hideShowBet();
        // GameAjax.beginGameAjax(betNum);
        AppFunction.appBeginGame(betNum);
        $("#playerPoint,#bankerPoint").show();
    });

    /**
     * 要牌
     * 1.请求要牌接口
     * TODO:APP 请求要牌的方法
     */
    $("#getNext").click(function () {
        // GameAjax.getPokerAjax();
        AppFunction.appGetPoker();
    });
    /**
     * 停牌
     * 1.请求停牌接口
     * 2.停掉计时器
     */
    $("#stopGet").click(function () {
        // GameAjax.stopGetPokerAjax();
        AppFunction.appStopGetPoker();
    });
    // 分享的关闭按钮
    $("#closeShare").click(function () {
        $("#shareWindow").hide();
        //TODO:关闭是延时1秒app刷新当前页面
        setTimeout(function () {
            AppFunction.appToAnother();
        }, 1000);
    });

    //分享的继续
    $("#anotherGame").click(function () {
        $("#shareWindow").hide();
        //TODO:直接刷新当场页面
        AppFunction.appToAnother();
    });

    $("#shareBtn").click(function () {
        //TODO:app分享
        AppFunction.appToShare();
    });

    $("#cancel").click(function () {
        $("#maxBeans").hide();
        $revokeBtn.removeAttr("disabled");// 移除撤销按钮的禁用
    });
    $("#makeSure").click(function () {
        $("#maxBeans").hide();
        betSub = 0;
        $("#BeansNum").html(GameMain.userGoldBean);// 返还用户金豆
        $revokeBtn.attr("disabled", true);
        $letGo.attr("disabled", true);
        betNum = 0;// 投注数量清零
        $("#betNum span").html(betNum);
    });
    // 充值弹窗的取消
    $("#cancelRecharge").click(function () {
        $("#noEnough").hide();
        betSub = 0;
        BlackJackFuc.hideShowBet();
        $("#BeansNum").html(GameMain.userGoldBean);// 返还用户金豆
        $revokeBtn.attr("disabled", true);
        $letGo.attr("disabled", true);
        betNum = 0;// 投注数量清零
        $("#betNum span").html(betNum);
    });
    // 充值弹窗的充值
    $("#ToUpBeans").click(function () {
        $("#noEnough").hide();
        betSub = 0;
        BlackJackFuc.hideShowBet();
        $("#BeansNum").html(GameMain.userGoldBean);// 返还用户金豆
        $revokeBtn.attr("disabled", true);
        $letGo.attr("disabled", true);
        betNum = 0;// 投注数量清零
        $("#betNum span").html(betNum);
        //TODO:app充值接口
        AppFunction.appToAdd();
    });
    // 用户头像处的充值
    $("#addBeans").click(function () {
        AppFunction.appToAdd();
    });
    // 弹窗退出游戏
    $("#exitGame").click(function () {
        $("#exitWindow").hide();
        //TODO:app游戏退出
        AppFunction.appExitGame();
    });
    // 退出中的返回按钮
    $("#goBackGame").click(function () {
        $("#exitWindow").hide();
    });

    //请求记录页
    $("#iconRecord").click(function () {
        var url = window.location.href;
        window.location.href = url.substring(0, url.lastIndexOf("/")) + "/toblackJack_record.html";
    });

});