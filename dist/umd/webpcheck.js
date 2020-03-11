!function(A,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((A=A||self).WebPCheck={})}(this,(function(A){"use strict"
var e={lossy:"UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",lossless:"UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",alpha:"UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",animation:"UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"},n=function(){try{var A="test".concat((new Date).getTime())
return localStorage.setItem(A,A),localStorage.removeItem(A),!0}catch(A){return!1}}()
function t(A,e){return{}.toString.call(A)==="[object ".concat(e,"]")}function o(A){return t(A,"Object")}function l(A){return t(A,"Null")}var r=null,a=null,c=null
function u(){return n?JSON.parse(!!n&&localStorage.getItem("_webPCheckResult")):!(!1!==n||!o(r))&&r}function i(){if(l(a)){var A=u()
if(o(A))c="done",a=A.lossy||A.lossless||A.alpha||A.animation
else if(l(c)&&l(r)){r={},c="checking"
var t=["lossy","lossless","alpha","animation"],i=t.length,s=0
t.forEach((function(A){!function(A,n){if(e[A]){var t=new Image
t.onload=function(){n(A,t.width>0&&t.height>0),t.onload=null,t.onerror=null,t=null},t.onerror=function(){n(A,!1),t.onload=null,t.onerror=null,t=null},t.src="data:image/webp;base64,".concat(e[A])}}(A,(function(A,e){var t
s+=1,r[A]=e,i===s&&(t=JSON.stringify(r),n&&localStorage.setItem("_webPCheckResult",t),c="done")}))}))}}return!!a}"undefined"!=typeof window&&i(),A.check=function(){return i()},A.clean=function(){r=null,a=null,c=null,n&&localStorage.removeItem("_webPCheckResult")},A.result=u,A.state=function(){return c},Object.defineProperty(A,"__esModule",{value:!0})}))
//# sourceMappingURL=webpcheck.js.map
