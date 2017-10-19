
;(function(){
  $('html').css('font-size', window.innerWidth/320*20 + 'px')
  //沉浸式

  // 通用事件
  mui(document).on('change', '[name="protocal-agreed"]', function(e){
    var $el = $(e.target),
        methodName = $el.prop('checked') ? 'addClass' : 'removeClass';
    $($el.attr('ref'))[methodName]('active')
  })
  $('.player').on('tap',function(){
    var e = e || window.event;
    var elem = e.target || e.srcElement;
    while (elem) {
                if (elem.id && elem.id ==='player_box') {
                    return
                }
                elem = elem.parentNode;
            }
            $('.player').hide()
  })
  var ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) {
      $('i.foot-checkbox').css('line-height','')
  } else if (/android/.test(ua)) {
    $('i.foot-checkbox').css('line-height','inherit')
      $('.data-empty').css('padding-bottom','100px')
  }
  mui(document).on('touchstart', 'button.m.active', function(e){
    $(this).css('opacity', '.5').removeClass('shadow')
  })

  mui(document).on('touchend', 'button.m.active', function(e){
    $(this).css('opacity', 1).addClass('shadow')
  })

  mui(document).on('tap', '.span-code.active', function(){
    var $this = $(this)


    var _data = app.validate({
      loginname: {
        type : 'PHONE',
        value: $($this.data('for')).val()
      },
      smsType:{
        value:$this.attr('data-type')
      }
    })
    if(_data) {
      _data.type = $this.data('type')
    } else {
      return
    }
    $this.removeClass('active').addClass('loading').html('获取中....')
    app.ajax({
      url: 'member/sendSms',
      data:_data,
      showLoading: false,
      callback : function(data){
        $this.removeClass('loading')
        if(data.msg === 'ok') {
          var count = 60;
          $this.html(count + 's后重新获取');
          var cl = setInterval(function(){
              if(--count > 0) {
                  $this.text(count + 's后重新获取');
              } else {
                $this.addClass('active').html('获取验证码');
                clearInterval(cl);
              }
          }, 1000);
        } else {
          $this.addClass('active').html('获取验证码');
          app.toast(data.msg);
        }
      }
    })
  })

  // 认证失败 跳到登陆页
  $(document).on('authFailed', function(){
    api.openWin({
        name: 'page-login',
        url: '../../html/login-frames/login.html',
        rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: api.winHeight
        },
        bounces: false,
        vScrollBarEnabled: false,
        hScrollBarEnabled: false
    })
  })
  // 图片报错
  // mui(document).on('error', 'img', function(){
  //   console.log(this)
  // })
  // document.addEventListener('error', function(e){
  //   if(e.target.tagName.toLowerCase() === 'img') {
  //     e.target.src = '../image/ic-tui'
  //     e.target.onerror = null
  //   }
  // })

  // 清除input聚焦事件
  // mui(document).on('tap', ':not(.mui-input-clear):not(input):not(textarea)', function(){
  //   document.activeElement.blur()
  // })

  mui('#header').on('tap', '.mui-pull-left', function(){
    if($(this).hasClass('close-frame')) {
      api.closeFrame()
    } else {
      api.closeWin()
    }
  })
  // 更新购物车商品 数量
  window.refreshAllCartItemcount = function(num){
    $api.setStorage('cartItemcount', num);
    ['root', 'product-detail'].forEach(function(name){
      api.execScript({
          name: name,
          script: 'refreshCartItemcount(' + num + ')'
      })
    })
  }
  window.refreshCartItemcount = function(num){
    if(num>0){
      $('.icon-bag').html('<span class="mui-badge">' + num + '</span>')
    }else{
      $('.icon-bag').html('')
    }
  }
  window.app = {
    //微信分享略缩图
    wxImg : 'widget://image/6666.png',
    // 头部高度
    headerHeight: 45,
    // 搜索框 高度
    searchBarHeight: 50,

    server  : 'http://119.23.144.5:8080/open/api/',
    fxUrl:'http://119.23.144.5/',
    // server: 'http://www.cmyigou.com/cmadmin/open/api/',
    // fxUrl:'http://www.cmyigou.com/',
//
    memberId: $api.getStorage('memberId'),
    token   : $api.getStorage('token'),
    // 需要调用到api的方法或属性的一些公共操作
    ready : function(){
      // 全局的加载控件
        window.loading = api.require('UILoading')
        app.windowHeight = api.winHeight
    },
    // toast 提示``
    toast: function(msg){
      api.toast({
          msg: msg,
          duration: 1200,
          location: 'middle'
      })
    },
    // confirm 确定
    confirm: function(msg, sureCb, cancleCb){
      api.confirm({
          title: '提示',
          msg: msg,
          buttons: ['确定', '取消']
      }, function(ret, err){
          if( ret ){
               sureCb && sureCb()
          }else{
               cancleCb && cancleCb()
          }
      })
    },
    // ajax请求封装
    ajax: function(params){
      // 需要登陆认证的接口
      // if(['caritem/addCaritem'].indexOf(params.url) !== -1 && !app.memberId&&!app.token) {
      //   $(document).trigger('authFailed')
      //   return
      // }
      $.ajax({
        type: params.type || 'POST',
        url :  app.server + params.url,
        data: params.data,
        // headers: {
        //   token: app.token
        // },
        dataType: 'json',
        timeout: params.timeout || 10000,
        async:false,
        beforeSend: function(){
          // request.setRequestHeader('origin',app.token);
          if(params.showLoading !== false) {
            app.loading()

          }else{
            // api.removeEventListener({
            //   name: 'scrolltobottom'
            // });

          }
        },
        success: function(data){
          if(params.callback) {
            params.callback(data)
          } else if(params.success){
            app.closeLoading(function(){
              // 请求正常
              if(data.code == 0) {
                params.success(data)
              } else {
                app.toast(data.msg)
                app.closeLoading()
                api.refreshHeaderLoadDone()
                if(data.code == -1 || data.code == -2) {
                  $(document).trigger('authFailed') // 触发认证失败事件
                }
              }
            })
          }
        },
        error: function(xhr, type){
          app.closeLoading()
          api.refreshHeaderLoadDone()
          app.toast('网络异常!')
        }
      })
    },
    // ajax请求 加载更多
    ajaxWithLoadMore: function(params) {
      var _params
      var fn = function(){
          if(fn.status !== 'NOMORE') {
            app.ajax(_params)
          }
      }
      fn.init = function(){
        _params   = $.extend({}, params)
        fn.status = 'REFRESH'
        if(!_params.data) _params.data = {}
        _params.data.pageSize = 10
        _params.data.pageNum  = 1
        $(".load-moreLz").css("text-align","center");
        $(".load-moreLz").css("padding","10px");
        $(".load-moreLz").css('display','none')
        $('.load-moreLz').html('<span style="background:url(../../../../image/loading.gif) no-repeat; width:22px;height:22px;background-size:22px;vertical-align:middle;display:inline-block;margin-right:5px;"></span>加载更多...')
        $('.load-more').html('<span style="background:url(../../image/loading.gif) no-repeat; width:22px;height:22px;background-size:22px;vertical-align:middle;display:inline-block;margin-right:5px;"></span>加载更多...')
        $('.load-moreTG').html('<span style="background:url(../../../image/loading.gif) no-repeat; width:22px;height:22px;background-size:22px;vertical-align:middle;display:inline-block;margin-right:5px;"></span>加载更多...')
        $('.load-moreTG').css("text-align","center");
        $(".load-moreTG").css("padding","10px");
        $(".load-moreTG").css("display","none");
        // $('.load-more').html('加载更多...')
        if(params.success) {
          _params.success = function(rst){
            params.success(rst)
            _params.data.pageNum++
            console.log('rst.data.length='+rst.data.length)
            console.log('_params.data.pageSize='+_params.data.pageSize)
            if(rst.data.length < _params.data.pageSize) {
              fn.status = 'NOMORE'

              $('.load-more').text('暂无更多数据')
               $('.load-moreLz').text('暂无更多数据')
               $(".load-moreTG").text('暂无更多数据')
            } else {
              fn.status = "DATA"
            }
          }
        }
        return fn
      }
      fn.init()
      return fn
    },
   // ajax请求 加载更多
   ajaxWithLoadMorePush: function(params) {
     var _params
     var fn = function(){
         if(fn.status !== 'NOMORE') {
           app.ajax(_params)
         }
     }
     fn.init = function(){
       _params   = $.extend({}, params)
       fn.status = 'REFRESH'
       if(!_params.data) _params.data = {}
       _params.data.pageSize = 10
       _params.data.pageNum  = 1
       $('.load-more').html('<span style="background:url(../../image/loading.gif) no-repeat; width:22px;height:22px;background-size:22px;vertical-align:middle;display:inline-block;margin-right:5px;"></span>加载更多...')
       // $('.load-more').html('加载更多...')
       if(params.success) {
         _params.success = function(rst){
           params.success(rst)
           _params.data.pageNum++
           console.log('--------------rst.data.length='+rst.data.length)
           console.log('---------------_params.data.pageSize='+_params.data.pageSize)
           if(rst.data.data.length < _params.data.pageSize) {
             fn.status = 'NOMORE'
             $('.load-more').text('暂无更多数据')
           } else {
             fn.status = "DATA"
           }
         }
       }
       return fn
     }
     fn.init()
     return fn
   },

    // 打开加载样式
    loading : function(){
      this.loading.timeStamp = Date.now()
      window.loading && window.loading.status !== 'active' && window.loading.keyFrame({
          rect: {
              w: 80,
              h: 80
          },
          styles: {
              bg: 'rgba(0,0,0,0.5)',
              corner: 5,
              interval: 60,
              frame: {
                  w: 80,
                  h: 80
              }
          }
      }, function(ret) {
        window.loading.status = 'active'
      })
    },
    // 关闭加载样式
    closeLoading : function(cb){
      setTimeout(function(){
        if(window.loading){
          window.loading.closeKeyFrame()
          window.loading.status = ''
        }
        cb && cb()
      }, app.loading.timeStamp - Date.now() + 500);
    },
    // 数据校验
    validate: function(param) {
      var res = {}
      for(var i in param){
        if(param.hasOwnProperty(i)) {
          var p = param[i],
              flag = true
        p.value = p.value.trim()
        if(p.type){
          switch (p.type.toUpperCase()) {
            case 'PHONE':
              if(!p.value.length) {
                app.toast('手机号码不能为空')
              } else if(p.value.length < 11) {
                app.toast('手机号码长度不正确')
              } else if(!/^1[3578]+\d{9}$/.test(p.value)){
                app.toast('手机号码格式不正确')
              } else {
                flag = true
              }
              break;
            case 'PASSWORD':
              if(!p.value.length) {
                // app.toast('密码不能为空')
              } else if(p.value.length < 6) {
                // app.toast('密码长度不小于6位')
              } else {
                flag = true
              }
              break;
            case 'CODE':
              if(!p.value.length) {
                app.toast('验证码不能为空')
              } else if(!/\d{5}/.test(p.value)){
                app.toast('验证码不正确')
              } else {
                flag = true
              }
             default:;
          }
        }
          if(!flag) return;
          else res[i] = p.value
        }
      }
      return res;
    },
    shops:function(){
       app.ajax({
          url:'member/getMyInfo',
          data:{
            memberId:$api.getStorage('memberId'),
            token: $api.getStorage('token')
          },
          success:function(data){
             console.log(JSON.stringify(data.data))
          }
       })
    },
    tgNum:function(ids,title){
        app.ajax({
           url:'member/getMyInfo',
           data:{
             memberId:$api.getStorage('memberId'),
             token: $api.getStorage('token')
           },
           success:function(data){
               var datas=data.data.memberAccout
               console.log(JSON.stringify(datas.memberId))
               var info={
                 list:datas
               }
               var text=template(ids,info)
               $(title).append(text)
           }
        })
    },
    details:function(list,goodsid,productid,ids,ids2,ids3){
      mui('body').on('tap', list, function(e) {
        var e = e || window.event;
        var elem = e.target || e.srcElement;
        var $that = $(this)
        while (elem) {
                    if (elem.id && elem.id === ids||elem.id && elem.id === ids2||elem.id && elem.id === ids3) {
                        return
                    }
                    elem = elem.parentNode;
                }
        api.openWin({
          name: 'product-detail',
          url: './../shop-frames/product-detail.html',
          reload: true,
          pageParam: {
            goodsId: $that.attr(goodsid),
            productId: $that.attr(productid)
          },
          animation: {
            type: 'movein',
            duration: 200
          }
        })
      })
    },
    players:function(player,box){
        mui('body').on('tap',player,function(e){
          var e = e || window.event;
          var elem = e.target || e.srcElement;
          while (elem) {
                      if (elem.id && elem.id ===box) {
                          return
                      }
                      elem = elem.parentNode;
                  }
            $(player).hide()
        })
    },
    //转换时间戳  年月日分秒
    times:function(text){
      var date = new Date(text);
          Y = date.getFullYear() + '-';
          M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          D = (date.getDate()< 10 ? '0'+(date.getDate()) : date.getDate())+ ' ';
          h = (date.getHours()< 10 ? '0'+(date.getHours()) : date.getHours())+ ':';
          m = (date.getMinutes()< 10 ? '0'+(date.getMinutes()) : date.getMinutes())+ ':';
          s = (date.getSeconds()< 10 ? '0'+(date.getSeconds()) : date.getSeconds());
          console.log(Y+M+D+h+m+s);
           fanst=Y+M+D+h+m+s
           return fanst
    },
    //只有日期
    times_day:function(text){
      var date = new Date(text);
          Y = date.getFullYear() + '-';
          M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          D = (date.getDate()< 10 ? '0'+(date.getDate()) : date.getDate())+ ' ';
          h = (date.getHours()< 10 ? '0'+(date.getHours()) : date.getHours())+ ':';
          m = (date.getMinutes()< 10 ? '0'+(date.getMinutes()) : date.getMinutes())+ ':';
          s = (date.getSeconds()< 10 ? '0'+(date.getSeconds()) : date.getSeconds());
          console.log(Y+M+D+h+m+s);
           fanst=Y+M+D
           return fanst
    },

    //转换几分钟前，几天前
    formatMsgTime:function(timespan){
      var dateTime = new Date(timespan); //收到消息时的时间戳
      var year = dateTime.getFullYear();
      var month = dateTime.getMonth() + 1;
      var day = dateTime.getDate();
      var hour = dateTime.getHours();
      var minute = dateTime.getMinutes();
      var second = dateTime.getSeconds();
      // var now = new Date();
      var now_new = Date.parse(new Date());  //转换当前时间时间戳
      var milliseconds = 0;
      var timeSpanStr;
      milliseconds = now_new - timespan;
      if (milliseconds <= 1000 * 60 * 1) {
         timeSpanStr = '刚刚';
      }
      else if(1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
         timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
      }
      else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
         timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
      }
      else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 30) {
         timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
      }
      else if (1000 * 60 * 60 * 24 * 30 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 30 * 12) {
         timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24 * 30)) + '月前';
      } else {
      // else if (milliseconds > 1000 * 60 * 60 * 24 * 30 && year == dateTime.getFullYear()) {
      //    timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
      // } else {
         timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
      }
         return timeSpanStr;
    },
    // 您的购物车暂无商品 赶紧去购物吧
    // 没有数据 样式

    dataNull: function(container, cls,n){
        $(container).html('<div class="data-null ' + (cls ? cls : '') + '">'+n+'</div>')
    },
    // 页面模板
    template: {
      slider: function(list){
        var _html = ''

        _html += '<div id="' + list.id + '" class="mui-slider"><div class="mui-slider-group mui-slider-loop">'
        // if(list.data.length > 1) {
          _html += ('<div class="mui-slider-item mui-slider-item-duplicate">' +
                      '<a {{data-id:id}}>' +
                        '<img {{src: picurl}}>' +
                      '</a>' +
                    '</div>').templateParse(list.data[list.data.length - 1])
        // }
        list.data.forEach(function(i, index){
            _html += ('<div class="mui-slider-item">' +
              					'<a {{data-id:id}}>' +
              						'<img {{src: picurl}}>' +
              					'</a>' +
              				'</div>').templateParse(i)
        })
        // if(list.data.length > 1) {
          _html += ('<div class="mui-slider-item mui-slider-item-duplicate">' +
                      '<a {{data-id:id}}>' +
                        '<img {{src: picurl}}>' +
                      '</a>' +
                    '</div>').templateParse(list.data[0])
        // }
        _html += '</div>'

        _html += '<div class="mui-slider-indicator">'
        for(var i = 0; i < list.data.length; i++) {
          if(i === 0) _html += '<div class="mui-indicator mui-active"></div>'
          else        _html += '<div class="mui-indicator"></div>'
        }
        _html += '</div>'

        return _html += '</div>'
      }
    },
//推广倒计时
 addTimer:function(ids,text){
   var list = [],
     interval;

   return function(id,timeStamp){
     if(!interval){
       interval = setInterval(go,1);
     }
     list.push({ele:document.getElementById(id),time:timeStamp});
   }

   function go() {
     for (var i = 0; i < list.length; i++) {
       list[i].ele.innerHTML = changeTimeStamp(list[i].time);
       if (!list[i].time)
         list.splice(i--, 1);
     }
   }
   //传入时间戳，得到倒计时
   function changeTimeStamp(timeStamp){
     var distancetime = new Date(timeStamp*1000).getTime() - new Date().getTime();
    //  var distancetime = new Date(timeStamp*1000).getTime();
     if(distancetime > 0){
  　　　　　　　　　　　　　　//如果大于0.说明尚未到达截止时间
       var ms = Math.floor(distancetime%1000);
       var sec = Math.floor(distancetime/1000%60);
       var min = Math.floor(distancetime/1000/60%60);
       var hour =Math.floor(distancetime/1000/60/60);
       if(ms<100){
         ms = "0"+ ms;
       }
       if(sec<10){
         sec = "0"+ sec;
       }
       if(min<10){
         min = "0"+ min;
       }
       if(hour<10){
         hour = "0"+ hour;
       }

       return hour + "小时" +min + "分" +sec+'秒'
     }else{
        return "推广结算中"
     }
   }
 }(),
//暂停的倒计时时间-----------------
 changeTimeStamp:function(timeStamp){
  //  var distancetime = new Date(timeStamp*1000).getTime() - new Date().getTime();
   var distancetime = new Date(timeStamp*1000).getTime()
  //  var distancetime = new Date(timeStamp*1000).getTime();
   if(distancetime > 0){
　　　　　　　　　　　　　　//如果大于0.说明尚未到达截止时间
     var ms = Math.floor(distancetime%1000);
     var sec = Math.floor(distancetime/1000%60);
     var min = Math.floor(distancetime/1000/60%60);
     var hour =Math.floor(distancetime/1000/60/60);
     if(ms<100){
       ms = "0"+ ms;
     }
     if(sec<10){
       sec = "0"+ sec;
     }
     if(min<10){
       min = "0"+ min;
     }
     if(hour<10){
       hour = "0"+ hour;
     }
     return hour + "小时" +min + "分" +sec+'秒'
   }
 },
 //prevent multiple pull up
 throttle:function(){
   var isClear = arguments[0],fn;
   if(typeof isClear === "boolean"){
       fn=arguments[1];
       fn._throttleID && clearTimeout(fn._throttleID);
   }else{
       fn=isClear;
       param=arguments[1];
       var p={
           context:null,
           args:[],
           time:1000
       }
       arguments.callee(true,fn);
       fn._throttleID=setTimeout(function(){
           fn.apply(p.context,p.args)
       },p.time)
   }
 },
 touchs:function(){
   var expansion = null;
   var container = document.querySelectorAll('.boxs li');
   for (var i = 0; i < container.length; i++) {
       var x, y, X, Y, swipeX, swipeY;
       container[i].addEventListener('touchstart', function(event) {
           x = event.changedTouches[0].pageX;
           y = event.changedTouches[0].pageY;
           swipeX = true;
           swipeY = true;
           // event.stopPropagation();
           if (expansion) {
               expansion.className = "";
           }
       });
       container[i].addEventListener('touchmove', function(event) {
           X = event.changedTouches[0].pageX;
           Y = event.changedTouches[0].pageY;
           if (swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0) {
               event.stopPropagation();
               if (X - x > 10) {
                   event.preventDefault();
                   this.className = "";
               }
               if (x - X > 10) {
                   event.preventDefault();
                   this.className = "swipeleft";
                   expansion = this;
               }
               swipeY = false;
           }
           if (swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
               swipeX = false;
           }
       });
   }

 },
 countDown:function(maxtime){
   var timer=null //一个小时，按秒计算，自己调整!
   function autos(){
     if (maxtime >= 0) {
       minutes = Math.floor(maxtime / 60);
       seconds = Math.floor(maxtime % 60);
       msg = '0'+minutes + " : " + seconds;
       $('.downtime').html(msg)
       --maxtime;
     } else {
       clearInterval(timer);
       $('.downtime').html('已过期')
     }
   }
   timer=setInterval('autos()',1000)
 }
}

  // String类型扩展 模板解析函数
  String.prototype.templateParse = function(i) {
      // 解析属性： {{name}} {{cls: class}}
      return this.replace(/\{\s*\{\s*(.+?)\s*\}\s*\}/g, function(m, substr) {
          var prop = substr.split(':')[0].trim(),
              key  = substr.split(':')[1] && substr.split(':')[1].trim() || prop;
          return i.hasOwnProperty(key) ? prop + '=' + (typeof i[key] === 'string' ? '"' + i[key] + '"' : i[key]) : ''
      })
      // 解析 <if></if> <if-not></if-not>
      .replace(/<\s*(if-not|if)\s*:\s*([\w\d]+)\s*>(.*?)<\s*\/\s*\1\s*>/g, function(m, judgeStr, substr, htm) {
          if (judgeStr === 'if-not') {
              return i.hasOwnProperty(substr) && i[substr] ? '' : htm
          } else if (judgeStr === 'if') {
              return i.hasOwnProperty(substr) && i[substr] ? htm : ''
          }
          return m
      })
      // 解析 {$name}
      .replace(/\{\s*\$([\w\d]+?)\s*\}/g, function(m, substr) {
          return i.hasOwnProperty(substr) ? i[substr] : ''
      })
  }

})()
