'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var TEST_IMAGES_BASE64 = {
  lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
  lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
  alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
  animation: 'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA'
}; // ========== 配置

var STORAGE_KEY = '_webPCheckResult';

var localStorageSupported = function () {
  try {
    var str = "test".concat(new Date().getTime());
    localStorage.setItem(str, str);
    localStorage.removeItem(str);
    return true;
  } catch (e) {
    return false;
  }
}(); // ========== 常用函数


function isType(s, typeString) {
  return {}.toString.call(s) === "[object ".concat(typeString, "]");
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

  var img = new Image();

  img.onload = function () {
    cb(caseItemName, img.width > 0 && img.height > 0);
    img.onload = null;
    img.onerror = null;
    img = null;
  };

  img.onerror = function () {
    cb(caseItemName, false);
    img.onload = null;
    img.onerror = null;
    img = null;
  };

  img.src = "data:image/webp;base64,".concat(TEST_IMAGES_BASE64[caseItemName]);
}

var WebPCheckResultDetail = null;
var WebPCheckResult = null;
var WebPCheckState = null;
function clean() {
  WebPCheckResultDetail = null;
  WebPCheckResult = null;
  WebPCheckState = null;
  storageRemoveItem();
}
function result() {
  if (localStorageSupported) {
    return JSON.parse(storageGetItem());
  }

  if (localStorageSupported === false && isObject(WebPCheckResultDetail)) {
    return WebPCheckResultDetail;
  }

  return false;
}
function state() {
  return WebPCheckState;
} // ========== 检查流程

function WebPCheck() {
  if (isNull(WebPCheckResult)) {
    var storageResult = result();

    if (isObject(storageResult)) {
      WebPCheckState = 'done';
      WebPCheckResult = storageResult.lossy || storageResult.lossless || storageResult.alpha || storageResult.animation;
    } else if (isNull(WebPCheckState) && isNull(WebPCheckResultDetail)) {
      WebPCheckResultDetail = {};
      WebPCheckState = 'checking';
      var testCases = ['lossy', 'lossless', 'alpha', 'animation']; // let caseItemName;

      var totalCheck = testCases.length;
      var currentCheck = 0;
      testCases.forEach(function (caseItemName) {
        load(caseItemName, function (name, response) {
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

function check() {
  return WebPCheck();
}

if (typeof window !== 'undefined') {
  WebPCheck();
}

exports.check = check;
exports.clean = clean;
exports.result = result;
exports.state = state;
