const TEST_IMAGES_BASE64 = {
  lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
  lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
  alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
  animation: 'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA',
};

// ========== 配置
const STORAGE_KEY = '_webPCheckResult';

const localStorageSupported = (() => {
  try {
    const str = `test${new Date().getTime()}`;
    localStorage.setItem(str, str);
    localStorage.removeItem(str);
    return true;
  } catch (e) {
    return false;
  }
})();

// ========== 常用函数
function isType(s, typeString) {
  return {}.toString.call(s) === `[object ${typeString}]`;
}
function isObject(s) {
  return isType(s, 'Object');
}
function isNull(s) {
  return isType(s, 'Null');
}
function storageSetItem(val) {
  if (localStorageSupported) {
    localStorage.setItem(STORAGE_KEY, val);
  }
}
function storageGetItem() {
  return localStorageSupported ? localStorage.getItem(STORAGE_KEY) : false;
}
function storageRemoveItem() {
  return localStorageSupported ? localStorage.removeItem(STORAGE_KEY) : false;
}

function load(caseItemName, cb) {
  if (!TEST_IMAGES_BASE64[caseItemName]) {
    return;
  }

  let img = new Image();
  img.onload = () => {
    cb(caseItemName, (img.width > 0) && (img.height > 0));
    img.onload = null;
    img.onerror = null;
    img = null;
  };
  img.onerror = () => {
    cb(caseItemName, false);
    img.onload = null;
    img.onerror = null;
    img = null;
  };
  img.src = `data:image/webp;base64,${TEST_IMAGES_BASE64[caseItemName]}`;
}

let WebPCheckResultDetail = null;
let WebPCheckResult = null;
let WebPCheckState = null;

export function clean() {
  WebPCheckResultDetail = null;
  WebPCheckResult = null;
  WebPCheckState = null;
  storageRemoveItem();
}

export function result() {
  if (localStorageSupported) {
    return JSON.parse(storageGetItem());
  } if (localStorageSupported === false && isObject(WebPCheckResultDetail)) {
    return WebPCheckResultDetail;
  }
  return false;
}

export function state() {
  return WebPCheckState;
}

// ========== 检查流程
/**
 * @return {boolean}
 */
function WebPCheck() {
  if (isNull(WebPCheckResult)) {
    const storageResult = result();
    if (isObject(storageResult)) {
      WebPCheckState = 'done';
      WebPCheckResult = storageResult.lossy
        || storageResult.lossless
        || storageResult.alpha
        || storageResult.animation;
    } else if (isNull(WebPCheckState) && isNull(WebPCheckResultDetail)) {
      WebPCheckResultDetail = {};
      WebPCheckState = 'checking';

      const testCases = ['lossy', 'lossless', 'alpha', 'animation'];
      const totalCheck = testCases.length;
      let currentCheck = 0;

      testCases.forEach((caseItemName) => {
        load(caseItemName, (name, response) => {
          currentCheck += 1;

          WebPCheckResultDetail[name] = response;

          if (totalCheck === currentCheck) {
            storageSetItem(JSON.stringify(WebPCheckResultDetail));
            WebPCheckState = 'done';
          }
        });
      });
    }
  }

  return !!WebPCheckResult;
}

export function check() {
  return WebPCheck();
}

/* eslint no-underscore-dangle: ["error", { "allow": ["__WebPCheckAuto"] }] */
if (typeof window !== 'undefined' && typeof window.__WebPCheckAuto !== 'undefined') {
  WebPCheck();
}
