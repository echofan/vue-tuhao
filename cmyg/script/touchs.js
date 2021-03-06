
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
                  if (X - x > 10) { //右滑
                      event.preventDefault();
                      this.className = ""; //右滑收起
                  }
                  if (x - X > 10) { //左滑
                      event.preventDefault();
                      this.className = "swipeleft"; //左滑展开
                      expansion = this;
                  }
                  swipeY = false;
              }
              // 上下滑动
              if (swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
                  swipeX = false;
              }
          });
      }

      // var items=$('.boxs li')
      // for(var i=0;i<items.length;i++){
      //    $(items[i]).find('.delet').on('tap',function(event){
      //      var _this=$(this)
      //       api.confirm({
      //           title: '提示',
      //           msg: '确定删除改产品吗?',
      //       }, function(ret, err){
      //           if( ret.buttonIndex===2 ){
      //             _this.parents('li').remove()
      //           }else{
      //               //  alert( JSON.stringify( err ) );
      //           }
      //       });
      //      event.stopPropagation();
      //    })
      // }
