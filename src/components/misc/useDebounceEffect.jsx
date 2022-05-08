"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDebounceEffect = void 0;
var react_1 = require("react");
function useDebounceEffect(fn, waitTime, deps) {
  (0, react_1.useEffect)(function () {
    var t = setTimeout(function () {
      fn.apply(undefined, deps);
    }, waitTime);
    return function () {
      clearTimeout(t);
    };
  }, deps);
}
exports.useDebounceEffect = useDebounceEffect;
