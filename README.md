## 播放器Demo

使用Webpack打包，若运行失败，请直接使用dist中的文件预览。（**需部署在http协议下**）

> 注意：文件以绝对路径发布，必须部署在站点根路径，如：http://test.com/

视频播放器采用示例的样式，基于Video.js(5.20.2)，由于服务器对于视频流`.ts`文件未做跨域处理，且为了支持IE9+，目前使用Flash播放，后期可扩展条件判断，检测是否支持HTML5播放。

### 调试
```javascript
npm run dev
```

访问
```
http://localhost:8090/
```

### 构建
```javascript
npm run build
```
