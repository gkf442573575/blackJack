/**
 * Created by gkfonline on 2017/4/21.
 */

var page = 0;
(function () {
    RecordAjax(page);
})();
var Record = {
    createRecordList: function (date, time, beltCount, getBeans, isWin) { //每个列表的数据
        var listStr = $("#forRecordList").html();
        listStr = listStr.replace("{{date}}", date);
        listStr = listStr.replace("{{time}}", time);
        if (beltCount >= 10000) {
            beltCount = (((Math.floor(beltCount / 1000)) % 10) === 0 ? (Math.floor(beltCount / 1000)) / 10 + ".0" : (Math.floor(beltCount / 1000)) / 10) + "W"
        } else {
            beltCount = beltCount;
        }
        listStr = listStr.replace("{{beltCount}}", beltCount);
        if (getBeans > 0 && isWin === 1) {
            if (getBeans >= 10000) {
                getBeans = (((Math.floor(getBeans / 1000)) % 10) === 0 ? (Math.floor(getBeans / 1000)) / 10 + ".0" : (Math.floor(getBeans / 1000)) / 10) + "W"
            } else {
                getBeans = getBeans
            }
            getBeans = "获得" + getBeans + "金豆";
        } else {
            if (isWin === 0) {
                getBeans = "平局"
            } else if (isWin === 2) {
                getBeans = "失败了"
            }
        }
        listStr = listStr.replace("{{getBeans}}", getBeans);
        var $listStr = listStr;
        $("#recordList").append($listStr);
    },
    toList: function (data) {
        if (data.success) {
            var beltList = data.beltList;
            if (beltList === null) {
                $("#noRecord").show();
            } else {
                $("#noRecord").remove();
            }
            var len = beltList.length;
            var roundtime, date, time, beltCount, getBeans, isWin, bankerArr, playerArr;
            var listLen = $("#recordList .recordItem").length;
            for (var i = 0; i < len; i++) {
                roundtime = beltList[i].roundtime;
                roundtime = new Date(roundtime)
                date = roundtime.getFullYear() + "-" + (roundtime.getMonth() + 1) + "-" + (roundtime.getDate() < 10 ? "0" + roundtime.getDate() : roundtime.getDate()); //获取日期
                time = roundtime.getHours() + ":" + (roundtime.getMinutes() < 10 ? "0" + roundtime.getMinutes() : roundtime.getMinutes()); // 获取时间
                beltCount = beltList[i].beltcount; // 投入豆子
                getBeans = beltList[i].obtaincount; // 获取的豆子
                isWin = beltList[i].iswin;
                bankerArr = beltList[i].bankerPokerList;
                playerArr = beltList[i].playerPokerList;
                this.createRecordList(date, time, beltCount, getBeans, isWin);
                if (getBeans > 0 && isWin === 1) {
                    $("#recordList .recordItem").eq(listLen + i).find(".getCount").addClass("win").removeClass("lose");
                } else {
                    $("#recordList .recordItem").eq(listLen + i).find(".getCount").addClass("lose").removeClass("win");
                }
                Record.createPokerName($("#recordList .recordItem").eq(listLen + i).find(".playerPokerList"), playerArr);
                Record.createPokerName($("#recordList .recordItem").eq(listLen + i).find(".bankerPokerList"), bankerArr);
            }
        } else {
            if (data.msg == "用户未登录") {
                $("#noRecord").show();
            }
            $("#record").unbind("scroll");
        }
    },
    pokerName: function (num) {  // 根据数值创建的扑克名字
        var pokerName;
        switch (num) {
            case 1:
                pokerName = "&nbsp;A";
                break;
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
                pokerName = "&nbsp;" + num;
                break;
            case 11:
                pokerName = "&nbsp;J";
                break;
            case 12:
                pokerName = "&nbsp;Q";
                break;
            case 13:
                pokerName = "&nbsp;K";
                break;
        }
        return pokerName;
    },
    createPokerName: function (el, arr) { // 创建扑克
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            el.append("<span>" + this.pokerName(arr[i]) + "</span>");
        }
    }
};

function RecordAjax(page) {  //获取后台数据
    if (isAndroidIOS()) {
        app.BJBeltRedordList(page);
    } else {
        window.webkit.messageHandlers.BJBeltRedordList.postMessage(page);
    }
}

function isAndroidIOS() {   // Android返回的是true ios返回false
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1 || u.indexOf("Linux") > -1;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || u.indexOf("iPad") > -1 || u.indexOf("iPhone") > -1 || u.indexOf("Mac OS") > -1;
    if (isAndroid) {
        return true;
    }
    if (isIOS) {
        return false;
    }
}

$("#recordList").on("click", ".recordItem", function () {
    var $pullDown = $(this).find(".pullDown");
    if ($pullDown.hasClass("down")) {
        $pullDown.toggleClass("down").toggleClass("up");
        $(this).find(".recordMain").show();
    } else {
        $pullDown.toggleClass("down").toggleClass("up");
        $(this).find(".recordMain").hide();
    }
});
// 下拉刷新
$("#record").on("scroll", function () {
    if ($(this).scrollTop() + $(this).get(0).offsetHeight >= $(this).get(0).scrollHeight - Math.ceil(parseFloat($("#recordList .recordItem:last").css("margin-bottom")))) {
        page++;
        RecordAjax(page);
    }
});
$("#toGame").click(function () {
    var url = window.location.href;
    window.location.href = url.substring(0, url.lastIndexOf("/")) + "/toblackjack.html";
});


