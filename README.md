# WebP Check

webp兼容性检查，检查过程一次性，不依赖网络

## 安装

```shell
npm install --save webpcheck
```


## 用例

```js
import WebPCheck from 'webpcheck';

if (webPCheck()) {
    console.log('support');
} else {
    console.log('not support');
}
```
