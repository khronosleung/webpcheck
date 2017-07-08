import extend from 'extend';

const TEST_IMAGES_BASE64 = {
    lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
    lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
    alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
    animation: 'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA'
};

// ========== 配置
const DEFAULT_CONFIG = {
    resultStoreKey: 'webPCheckResult',
    callback: () => {}
};
const CONFIG = extend(true, {}, DEFAULT_CONFIG, (window.WebPCheckCongfig || {}));

delete window.WebPCheckCongfig;

// ========== 常用函数
function isType(s, typeString) {
    return {}.toString.call(s) === `[object ${typeString}]`;
}
function isObject(s) {
    return isType(s, 'Object');
}
function storageSetItem(val) {
    localStorage.setItem(CONFIG.resultKey, val);
}
function storageGetItem() {
    return localStorage.getItem(CONFIG.resultKey);
}

function load(caseItemName, cb) {
    if (!TEST_IMAGES_BASE64[caseItemName]) {
        return;
    }

    let img = new Image();
    img.onload = function () {
        cb((img.width > 0) && (img.height > 0));
        img.onload = img.onerror = null;
        img = null;
    };
    img.onerror = function () {
        cb(false);
        img.onload = img.onerror = null;
        img = null;
    };
    img.src = `data:image/webp;base64,${TEST_IMAGES_BASE64[caseItemName]}`;
}

// ========== 检查流程
let WebPCheck = null;

let storageResult = JSON.parse(storageGetItem());
if (isObject(storageResult)) {
    WebPCheck = {
        lossy: storageResult.lossy === true || false,
        lossless: storageResult.lossless === true || false,
        alpha: storageResult.alpha === true || false,
        animation: storageResult.animation === true || false
    };
} else {
    let testCases = ['lossy', 'lossless', 'alpha', 'animation'];
    let caseItemName;
    let totalCheck = testCases.length;
    let currentCheck = 0;
    while (caseItemName = testCases.shift()) {
        load(caseItemName, (response) => {
            ++currentCheck;

            if (WebPCheck === null) {
                WebPCheck = {};
            }

            WebPCheck[caseItemName] = response;

            if (totalCheck === currentCheck) {
                storageSetItem(JSON.stringify(WebPCheck));
                CONFIG.callback(WebPCheck);
            }
        });
    }
}


export default WebPCheck;
