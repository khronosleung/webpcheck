# WebP Check

webp兼容性检查，检查过程一次性，不依赖网络

## 安装

```shell
npm install --save webpcheck
```


## 用例

```js
import WebPCheck from 'webpcheck';

if (WebPCheck()) {
    console.log('support');
} else {
    console.log('not support');
}

// 获取判断的缓存结果
WebPCheck.result();

// 清除判断的缓存结果
WebPCheck.clean();
```
