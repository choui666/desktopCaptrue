# 我是说明文档
  web端目前只有火狐和chrome支持桌面共享，且只限pc
 
 - 下载
 - 准备工作
 - API
 - exmaple
 
 ## 下载
 
 直接在github下载吧；在页面引入src下的index.js就可以使用了
 
 ## 准备工作
 > chrome浏览器下，先要下载chrome插件；打开你的 Chrome 浏览器，点击屏幕右上方的扩展按钮，选择 更多工具 > 扩展程序。打开开发者模式 > 加载已解压的扩展程序 > 选择 下载并解压的Chrome录屏插件

> Chrome录屏插件就在该仓库 extention 文件夹
 
 
 ## API
 
 > start
 
 参数 | 类型  
  ---|---  
  mediasource | 只能是 'screen'，'window'，'application'中一个
   calbakc | function   
   
   ```js
   示例:
   CaptureClient.start('screen',function(suc,stream){
   })
   ```
 
> stop
   ```js
   示例:
   CaptureClient.stop()
   ```

## exmaple 预览
```js
 CaptureClient.start('screen',function(suc,stream){
       video.srcObject = mediastream;
   })
```



  
  
  