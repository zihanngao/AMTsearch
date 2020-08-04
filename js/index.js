
    //鼠标点击的时候搜索
    function searchAction() {
        var serchId=$('#serchId').val();
        var rexq = new RegExp(serchId,"igm");
        
        $.ajax({
            type:"post",
            url:"./example_search.json",//接收json的url
            data:{"search":serchId},
            success:function (data) {
                if(data.total!=0){
                    $('#searchList').empty();
                    $.each(data.list,function (i,obj) {
                        var url=obj.url_formatted;//搜索结果的url
                        url = url.replace(rexq,"<font color='#dd4b39'>"+serchId+"</font>");
                        
                        var title=obj.title_formatted;//结果标题
                        title = title.replace(rexq,"<font color='#dd4b39'>"+serchId+"</font>");
                    
                        var abstract=obj.snippet_formatted;//结果节选
                        abstract = abstract.replace(rexq,"<font color='#dd4b39'>"+serchId+"</font>");
                        
                        var lielem='<tr>\n' +
                            '                    <td>\n' +
                            '                        <li id="resulturl"><a href="'+url+'"></li>\n' +
                            '                        <li id="resulttitle"><a href="'+title+'"></li>\n' +
                            '                        <li id="resultabstract"><a href="'+abstract+'"></li>\n' +
                            '                    </td>\n' +
                            '                </tr>';
                        $('#searchList').append(lielem);

                    })
                    //位置1  对数据进行分页
                    $('#pageination').show();
                    pagination(3,1);
                }else{
                    $('#searchList').empty();
                    var strNull='<p style="text-align: center;line-height: 50px">暂无相关搜索结果</p>' +
                        '<p style="text-align: center"><a href="index.html"><button id="btnback" type="button">返回首页</button></a></p>';
                    $('#searchList').append(strNull);
                    $('#pageination').hide();

                }


            }

        });
    }

   $('#serchId').on('keydown',function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode==13) {
            searchAction();
        }
    })


    //列表分页
    //perPage 每一页显示条数     current：当前第几页
    function pagination(perPage,current) {
        var tableData = document.getElementById("searchList");
        var totalCount=tableData.rows.length;  //总条数

        //设置表格总页数
        var totalPage=0;//列表的总页数
        var pageSize = perPage;
        if (totalCount/pageSize > parseInt(totalCount/pageSize)){
            totalPage = parseInt(totalCount/pageSize)+1;
        }else{
            totalPage = parseInt(totalCount/pageSize);
        }
        //对数据进行分页
        var currentPage=current;
        var startRow=(currentPage-1)*pageSize+1;
        var endRow=(currentPage*pageSize > totalCount ? totalCount : currentPage*pageSize);

        for(var i=1;i<(totalCount+1);i++){
            var irow = tableData.rows[i-1];
            if(i>=startRow && i<=endRow){
                irow.style.display = "block";
            }else{
                irow.style.display = "none";
            }
        }
        //位置2 生成当前的点击按钮
        createBtns(totalPage , current);
        //位置3  绑定点击事件
        bindClick(totalPage);

    }
    //生成点击按钮
    //totalPages 分页的总页数
    //current当前页
    function createBtns(totalPages , current) {
        var tempStr = "";
        /*上一页按钮*/
        if (current > 1) {
           /* tempStr += "<span class='btn first' href=\"#\"  data-page = '1'>首页</span>";*/
            tempStr += "<span class='btn prev' href=\"#\" data-page = "+(current-1)+">上一页</span>"
        }
        /*中间页码的显示*/
        /*如果总页数超出5个处理办法*/
        if(totalPages<=5){
            for(var pageIndex= 1 ; pageIndex < totalPages+1; pageIndex++){
                tempStr += "<a  class='btn page"+pageIndex+"'  data-page = "+( pageIndex )+"><span>"+ pageIndex +"</span></a>";
            }
        }else{
            if(current<5){
                for(var pageIndex= 1 ; pageIndex < 5; pageIndex++){
                    tempStr += "<a  class='btn page"+pageIndex+"'  data-page = "+( pageIndex )+"><span>"+ pageIndex +"</span></a>";
                }
                tempStr+='<span>......</span>';
                tempStr += "<a  class='btn page"+totalPages+"'  data-page = "+( totalPages )+"><span>"+ totalPages +"</span></a>";
            }else if(current>= totalPages-4){
                tempStr += "<a  class='btn page"+1+"'  data-page = "+( 1 )+"><span>"+ 1 +"</span></a>";
                tempStr+='<span>......</span>';
                for(var pageIndex= totalPages-4 ; pageIndex <= totalPages; pageIndex++){
                    tempStr += "<a  class='btn page"+pageIndex+"'  data-page = "+( pageIndex )+"><span>"+ pageIndex +"</span></a>";
                }
            }else if(current>=5 && current <totalPages-4){
                tempStr += "<a  class='btn page"+1+"'  data-page = "+( 1 )+"><span>"+ 1 +"</span></a>";
                tempStr+='<span>......</span>';
                for(var pageIndex= current ; pageIndex <= current+4; pageIndex++){
                    tempStr += "<a  class='btn page"+pageIndex+"'  data-page = "+( pageIndex )+"><span>"+ pageIndex +"</span></a>";
                }
                tempStr+='<span>......</span>';
                tempStr += "<a  class='btn page"+totalPages+"'  data-page = "+( totalPages )+"><span>"+ totalPages +"</span></a>";
            }
        }
        /*下一页按钮*/
        if (current < totalPages) {
            tempStr += "<span class='btn next' href=\"#\"  data-page = "+(current+1)+">下一页</span>";
/*            tempStr += "<span class='btn last' href=\"#\" data-page = "+ (totalPages) +">尾页</span>";*/
        }
        document.getElementById("pageination").innerHTML = tempStr;
    }
    function bindClick(totalPage) {
        // 设置首页、末页、上一页、下一页的点击事件
        var buttonArr = ['first','last','prev','next'];
        for(var k in buttonArr){
            var $dom = '.'+buttonArr[k];
            $('body').delegate( $dom , 'click' , function () {
                var data = $(this).data('page');//获取当前按钮跳转的页数
                pagination('3' , data);//对页面进行分页
                //对当前页码的样式做处理
                $('.page'+data).css({background:'#0449d4',color:'#fff'}).siblings().css({background:'#fff',color:'#999'});
            })
        }

        // 设置数码的点击事件 totalImgPage是总页数，为全局变量，在分页时被赋值
        for (var k  = 1 ;k <= totalPage ; k++){
            var $singleDom  = '.page'+k;
            $('body').delegate( $singleDom , 'click' , function () {
                var data = $(this).data('page');
                pagination('3' , data);//对页面进行分页
                //对当前页码的样式做处理
                $('.page'+data).css({background:'#0449d4',color:'#fff'}).siblings().css({background:'#fff',color:'#999'});
            })
        }
    }
    
    
  