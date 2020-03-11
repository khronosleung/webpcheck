# WebP Check

webp兼容性检查，检查过程一次性，不依赖网络

## 安装

```shell
npm install --save webpcheck
```


## 用例

```js
import { check, result, clean } from 'webpcheck';

if (check()) {
    console.log('support');
} else {
    console.log('not support');
}

// 获取判断的缓存结果
result();

// 清除判断的缓存结果
clean();
```
