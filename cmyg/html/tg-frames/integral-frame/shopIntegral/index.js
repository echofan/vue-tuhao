function formatDateTime(timeStamp) {
    var date = new Date();
    date.setTime(timeStamp * 1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};

function moreLy(ret){
    // $(".load-moreLz").hide()
    if(ret.data == '' || null){
        $(".load-moreLz").hide()
        $(".thisNull").show()
    }else{
        $(".thisNull").hide()
    }
}

function htmlNull(){
    if($(".tablesContUl").html() == '' || null){
        $(".thisNull").show()
    }else{
        $(".thisNull").hide()
    }
}

function footerFn(){
    $(".load-moreLz").show()
    $(".thisNull").hide()
    if($(".tablesContUl").html() == '' || null){
        $(".thisNull").show()
        $(".load-moreLz").hide()
    }else{
        $(".thisNull").hide()
    }
}
