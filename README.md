#gulp-muti-page

## gulp工作流使用
    *1.npm i

    特别注意：
        less编译插件计算calc有误差。
        js打包插件会执行严格模式。

    update

    *1.npm run config 首次pull需要从proxy.template.js中拷贝代理配置到proxy.config.js
        copy后可以修改proxy.config.js来配置代理
        如果远程配置更新了，为了不覆盖原先配置，可以pull后手动选择复制粘贴
        在push时，proxy.template.js不会提交，只供本地环境使用，不与远端代码冲突
        
    2.npm start 启动服务，默认不开启mock数据支持，如需要可用 npm run start:mock
        如果proxy.config.js不存在将报错，mock目录下的代码报错将终止运行

    3.在mock文件夹下可以部署每个页面的mock数据，mock下所有文件将被打包成一个文件，因为暂没有很好的作用域分离的方式，在编写mock时
        建议写在自执行函数里 (function () { /* doSomething */ })()

    update
    *1.新增typescript编译,可在src/js里编写ts代码逻辑

## mock服务 参照跟目录mock.js文档。

    Mock.mock(/system\/adminUser\/list/, function(options) {

    })

    /**
         * 参数解析
         * rurl, [rtype],[function( options )]
         * rurl       请求url
         * rtype      可选参数，指定请求类型。不写get,post都匹配
         * function   记录用于生成响应数据的函数。当拦截到匹配 rurl 和 rtype 的 Ajax 请求时，函数 function(options) 将被执行，并把执行结果作为响应数据返回。
    */


    /**
        * options参数解析
        * url    ajax请求url
        * type   ajax请求方法
        * body   ajax请求方法如果是post,值在body里
        * {
              "url": "/system/adminUser/list/?foo=1&bar=2&faz=3",
              "type": "GET",
              "body": null
          }
          {
              "url": "/system/adminUser/list/",
              "type": "GET",
              "body": null
          }
          {
              "url": "/system/adminUser/list/",
              "type": "POST",
              "body": "foo=1&bar=2&faz=3"
          }
    */  
### 新增eslint配置，遵循标准代码编写配置，与其不一致的配置详见.eslintrc.js
