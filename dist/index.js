(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["WebPCheck"] = factory();
	else
		root["WebPCheck"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = __webpack_require__(1);

var _stringify2 = _interopRequireDefault(_stringify);

exports.default = WebPCheck;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TEST_IMAGES_BASE64 = {
    lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
    lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
    alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
    animation: 'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA'
};

var localStorageSupported = function () {
    try {
        var str = 'test' + new Date().getTime();
        localStorage.setItem(str, str);
        localStorage.removeItem(str);
        return true;
    } catch (e) {
        return false;
    }
}();

// ========== 常用函数
function isType(s, typeString) {
    return {}.toString.call(s) === '[object ' + typeString + ']';
}
function isObject(s) {
    return isType(s, 'Object');
}
function isNull(s) {
    return isType(s, 'Null');
}
function storageSetItem(val) {
    localStorageSupported && localStorage.setItem(STORAGE_KEY, val);
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
        img.onload = img.onerror = null;
        img = null;
    };
    img.onerror = function () {
        cb(caseItemName, false);
        img.onload = img.onerror = null;
        img = null;
    };
    img.src = 'data:image/webp;base64,' + TEST_IMAGES_BASE64[caseItemName];
}

// ========== 配置
var STORAGE_KEY = '_webPCheckResult';

// ========== 检查流程
var WebPCheckResultDetail = null;
var WebPCheckResult = null;
var WebPCheckState = null;

function WebPCheck() {
    if (isNull(WebPCheckResult)) {
        var storageResult = WebPCheck.result();
        if (isObject(storageResult)) {
            WebPCheckState = 'done';
            WebPCheckResult = storageResult.lossy || storageResult.lossless || storageResult.alpha || storageResult.animation;
        } else if (isNull(WebPCheckState) && isNull(WebPCheckResultDetail)) {
            (function () {
                WebPCheckResultDetail = {};
                WebPCheckState = 'checking';

                var testCases = ['lossy', 'lossless', 'alpha', 'animation'];
                var caseItemName = void 0;
                var totalCheck = testCases.length;
                var currentCheck = 0;
                while (caseItemName = testCases.shift()) {
                    load(caseItemName, function (name, response) {
                        ++currentCheck;

                        WebPCheckResultDetail[name] = response;

                        if (totalCheck === currentCheck) {
                            storageSetItem((0, _stringify2.default)(WebPCheckResultDetail));
                            WebPCheckState = 'done';
                        }
                    });
                }
            })();
        }
    }

    return !!WebPCheckResult;
}

WebPCheck.clean = function () {
    WebPCheckResultDetail = null;
    WebPCheckResult = null;
    WebPCheckState = null;
    storageRemoveItem();
};

WebPCheck.result = function () {
    if (localStorageSupported) {
        return JSON.parse(storageGetItem());
    } else if (localStorageSupported === false && isObject(WebPCheckResultDetail)) {
        return WebPCheckResultDetail;
    } else {
        return false;
    }
};

WebPCheck.state = function () {
    return WebPCheckState;
};
WebPCheck();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(2), __esModule: true };

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(3);
var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
module.exports = function stringify(it) { // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ })
/******/ ])["default"];
});