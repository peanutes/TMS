"use strict";
function searchAllAutoCase() {
    var treeObj=$.fn.zTree.getZTreeObj("searchModuleNodeTree")
    var nodes="";
    try {
        nodes=treeObj.getSelectedNodes(true)
    }catch (e){
        $('#warning2').click();
        return false
    }
    if(nodes.length==0){
        $('#warning2').click();
        return false
    }
    var node=nodes[0].cid
    for(var i=1;i<nodes.length;i++){
        node=node+","+nodes[i].cid
    }
    $('#searchA').html('正在查询...')
    searchAutoCase(String(node),function (res) {
        $('#searchA').html('查询')
        if(res.code==1){
            var result=res.result
            var data=new Array()
            for(var i=0;i<result.length;i++){
                var autoCaseHelper=result[i]
                var autoCase={}
                autoCase['id']='<input type="checkbox" class="uniform">'
                autoCase['true_id']=autoCaseHelper.id
                autoCase['用例id']=autoCaseHelper.caseId
                autoCase['用例描述']=autoCaseHelper.describe
                autoCase['子模块']=autoCaseHelper.node
                autoCase['操作']='<a href="/autoCaseRepertory/lookAutoCase.do?id='+autoCaseHelper.id+'" class="btn btn-xs bs-tooltip" title="Search" target="_blank"> <i class="icon-search"> </i> </a>'
                data.push(autoCase)
            }
            $('#autoCaseTable').dataTable().fnClearTable();   //将数据清除
            if(result.length>0){
                $('#autoCaseTable').dataTable().fnAddData(data,true);
            }
        }else {
            $('#warning4').click();
            console.error(res.message)
        }
    })
}
function checkFilesJS() {
    var multipartFiles = document.getElementById("multipartFiles");
    if(!multipartFiles.value){
        return;
    }
    for(var i=0;i<multipartFiles.files.length;i++){
        var file = multipartFiles.files[i];
        if(!file.name.endsWith(".js")){
            bootbox.alert("GVML用例文件必须为js格式！")
            multipartFiles.value = "";
            return;
        }
    }
}
function checkFilesJSON() {
    var multipartFiles = document.getElementById("multipartFiles");
    if(!multipartFiles.value){
        return;
    }
    for(var i=0;i<multipartFiles.files.length;i++){
        var file = multipartFiles.files[i];
        if(!file.name.endsWith(".json")){
            bootbox.alert("postman用例文件必须为json格式！")
            multipartFiles.value = "";
            return;
        }
    }
}
function validatePlanNode() {
    if($('#moduleNodeTree').html()=="找不到数据!"){
        $('#warning1').click()
        return false;
    }else {
        var treeObj=$.fn.zTree.getZTreeObj("moduleNodeTree")
        var nodes=treeObj.getSelectedNodes(true)
        if(nodes.length==0||nodes[0].pid==0){
            $('#warning3').click()
            return false;
        }
        return true;
    }
}
$(document).ready(function(){

    var multipartFiles = document.getElementById("multipartFiles"),
        envFile = document.getElementById("envFile");
    envFile.addEventListener('change',function(){
        if(!envFile.value){
            return;
        }
        if(!envFile.value.endsWith(".json")) {
            bootbox.alert("环境变量文件必须为json格式！")
            envFile.value = "";
            return;
        }
    })
    multipartFiles.addEventListener('change',checkFilesJS);
    $('.form-horizontal.row-border .form-group').eq(4).change(function () {
        var multipartFiles = document.getElementById("multipartFiles");
        multipartFiles.value="";
        if($(this).find('option:selected').val()==1){
            multipartFiles.removeEventListener("change",checkFilesJS);
            multipartFiles.addEventListener('change',checkFilesJSON);
            $('.form-horizontal.row-border .form-group').eq(2).removeClass('hide')
            $('.form-horizontal.row-border .form-group').eq(3).removeClass('hide')
        }else if($(this).find('option:selected').val()==2){
            multipartFiles.removeEventListener("change",checkFilesJSON);
            multipartFiles.addEventListener('change',checkFilesJS);
            document.getElementById("envFile").value="";
            document.getElementById("readMeFile").value="";
            $('.form-horizontal.row-border .form-group').eq(2).addClass('hide')
            $('.form-horizontal.row-border .form-group').eq(3).addClass('hide')
        }
    })
    $('#autoCaseTable').DataTable({
        language:{
            sProcessing : "处理中...",
            sLengthMenu : "显示 _MENU_ 项结果",
            sZeroRecords : "没有匹配结果",
            sInfo : "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
            sInfoEmpty : "显示第 0 至 0 项结果，共 0 项",
            sInfoFiltered : "(由 _MAX_ 项结果过滤)",
            sInfoPostFix : "",
            sSearch : "",
            searchPlaceholder : "关键字搜索",
            sUrl : "",
            sEmptyTable : "表中数据为空",
            sLoadingRecords : "载入中...",
            sInfoThousands : ",",
            oPaginate : {
                sFirst : "首页",
                sPrevious : "上页",
                sNext : "下页",
                sLast : "末页"
            },
            oAria : {
                sSortAscending : ": 以升序排列此列",
                sSortDescending : ": 以降序排列此列"
            }
        },
        order : [],
        columns: [
            {data:'id',className : "checkbox-column",orderable : false},
            {data: "true_id",visible:false},
            {data: "用例id"},
            {data: "用例描述"},
            {data: "子模块"},
            {data: "操作"}
        ]
    });
    $('#searchModuleNodeTree').append('正在加载...')
    $('#moduleNodeTree').append('正在加载...')
    getProjectTree(function (res) {
        if(res.code==1){
            var nodeTree=[];
            nodeTree.push(res.result)
            var setting = {
                view:{
                    selectedMulti:false
                },
                callback: {
                    onClick: function (event, treeId, treeNode) {
                        $('#node').val(treeNode.cid);
                    }
                }
            };
            $.fn.zTree.init($("#moduleNodeTree"), setting, nodeTree);
            setting = {};
            $.fn.zTree.init($("#searchModuleNodeTree"), setting, nodeTree);
        }else {
            $('#searchModuleNodeTree').empty()
            $('#moduleNodeTree').empty()
            $('#searchModuleNodeTree').append('找不到数据！')
            $('#moduleNodeTree').append('找不到数据！')
        }
    })
    $('#execA').click(function () {
        var table=$('#autoCaseTable').dataTable()
        var nTrs=table.fnGetNodes()
        var ids=[]
        for(var i = 0; i < nTrs.length; i++){
            if($(nTrs[i]).find('.checked').length==1){
                ids.push(table.fnGetData(nTrs[i]).true_id)
            }
        }
        if(ids.length>0){
            window.open("/autoCaseRepertory/prepareExecute.do?ids="+JSON.stringify(ids))
        }else {
            $('#warning5').click()
            return false
        }
    })
    $('#deleteA').click(function () {
        var table=$('#autoCaseTable').dataTable()
        var nTrs=table.fnGetNodes()
        var ids=[]
        for(var i = 0; i < nTrs.length; i++){
            if($(nTrs[i]).find('.checked').length==1){
                ids.push(table.fnGetData(nTrs[i]).true_id)
            }
        }
        if(ids.length>0){
            $('#deleteA').html('正在删除...')
            deleteAutoCase(JSON.stringify(ids),function (res) {
                $('#deleteA').html('删除')
                if(res.code==1){
                    $('#alert2 .alert-success').removeClass("hide-default")
                    $('#alert2 .alert-success span').empty()
                    $('#alert2 .alert-success span').append("用例删除成功！")
                    searchAllAutoCase()
                }else{
                    $('#alert2 .alert-danger').removeClass("hide-default")
                    $('#alert2 .alert-danger span').empty()
                    $('#alert2 .alert-danger span').append("删除失败，失败原因为："+res.message)
                }
            })
        }else {
            $('#warning5').click()
            return false
        }
    })
    $('#moveA').click(function () {
        var table=$('#autoCaseTable').dataTable()
        var nTrs=table.fnGetNodes()
        var ids=[]
        for(var i = 0; i < nTrs.length; i++){
            if($(nTrs[i]).find('.checked').length==1){
                ids.push(table.fnGetData(nTrs[i]).true_id)
            }
        }
        var treeObj=$.fn.zTree.getZTreeObj("searchModuleNodeTree")
        var nodes="";
        try {
            nodes=treeObj.getSelectedNodes(true)
        }catch (e){
            $('#warning2').click();
            return false
        }
        if(nodes.length==0){
            $('#warning2').click();
            return false
        }
        if(ids.length>0 && nodes.length===1){
            $('#moveA').html('正在移动...')
           moveAutoCase(JSON.stringify(ids),nodes[0].cid,function (res) {
               $('#moveA').html('移动')
                if(res.code==1){
                    $('#alert2 .alert-success').removeClass("hide-default")
                    $('#alert2 .alert-success span').empty()
                    $('#alert2 .alert-success span').append("用例移动成功！")
                    searchAllAutoCase()
                }else{
                    $('#alert2 .alert-danger').removeClass("hide-default")
                    $('#alert2 .alert-danger span').empty()
                    $('#alert2 .alert-danger span').append("删除移动，失败原因为："+res.message)
                }
            })
        }else {
            $('#warning5').click()
            return false
        }
    })


    $.extend($.validator.defaults,{invalidHandler:function(c,a){var d=a.numberOfInvalids();if(d){var b=d==1?"你有一个必填项未填写内容！":"你有"+d+" 个必填项未填写内容！";noty({text:b,type:"error",timeout:2000})}}});$("#validate-1").validate();$("#validate-2").validate();$("#validate-3").validate();$("#validate-4").validate()});