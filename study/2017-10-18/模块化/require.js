function require(path){
    let code='function add(a+b){return a+b}; module.exports=add'
    //封装成闭包
    code=`(function(module){${code}})(context)`

    let context={}

    const run=new Function('context',code)

    run(context,code)
}