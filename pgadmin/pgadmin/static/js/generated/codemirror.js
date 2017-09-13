define(function() { return webpackJsonp([3],{

/***/ 29:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _codemirror = __webpack_require__(14);

var _codemirror2 = _interopRequireDefault(_codemirror);

__webpack_require__(52);

__webpack_require__(85);

__webpack_require__(86);

__webpack_require__(75);

__webpack_require__(87);

__webpack_require__(88);

__webpack_require__(89);

__webpack_require__(90);

__webpack_require__(53);

__webpack_require__(91);

__webpack_require__(76);

__webpack_require__(92);

__webpack_require__(93);

__webpack_require__(94);

__webpack_require__(95);

__webpack_require__(38);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _codemirror2.default;

/***/ }),

/***/ 38:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (mod) {
  if (( false ? "undefined" : _typeof(exports)) == "object" && ( false ? "undefined" : _typeof(module)) == "object") // CommonJS
    mod(__webpack_require__(14));else if (true) // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(14)], __WEBPACK_AMD_DEFINE_FACTORY__ = (mod),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else // Plain browser env
    mod(CodeMirror);
})(function (CodeMirror) {
  "use strict";

  CodeMirror.pgadminKeywordRangeFinder = function (cm, start, startTkn, endTkn) {
    var line = start.line,
        lineText = cm.getLine(line);
    var at = lineText.length,
        startChar,
        tokenType;
    for (; at > 0;) {
      var found = lineText.lastIndexOf(startTkn, at);
      var startToken = startTkn;
      var endToken = endTkn;
      if (found < start.ch) {
        var found = lineText.lastIndexOf("[", at);
        if (found < start.ch) break;
        var startToken = '[';
        var endToken = ']';
      }

      tokenType = cm.getTokenAt(CodeMirror.Pos(line, found + 1)).type;
      if (!/^(comment|string)/.test(tokenType)) {
        startChar = found;break;
      }
      at = found - 1;
    }
    if (startChar == null || lineText.lastIndexOf(startToken) > startChar) return;
    var count = 1,
        lastLine = cm.lineCount(),
        end,
        endCh;
    outer: for (var i = line + 1; i < lastLine; ++i) {
      var text = cm.getLine(i),
          pos = 0;
      for (;;) {
        var nextOpen = text.indexOf(startToken, pos),
            nextClose = text.indexOf(endToken, pos);
        if (nextOpen < 0) nextOpen = text.length;
        if (nextClose < 0) nextClose = text.length;
        pos = Math.min(nextOpen, nextClose);
        if (pos == text.length) break;
        if (cm.getTokenAt(CodeMirror.Pos(i, pos + 1)).type == tokenType) {
          if (pos == nextOpen) ++count;else if (! --count) {
            end = i;
            endCh = pos;
            break outer;
          }
        }
        ++pos;
      }
    }
    if (end == null || end == line + 1) return;
    return { from: CodeMirror.Pos(line, startChar + startTkn.length),
      to: CodeMirror.Pos(end, endCh) };
  };

  CodeMirror.pgadminBeginRangeFinder = function (cm, start) {
    var startToken = 'BEGIN';
    var endToken = 'END;';
    var fromToPos = CodeMirror.pgadminKeywordRangeFinder(cm, start, startToken, endToken);
    return fromToPos;
  };

  CodeMirror.pgadminIfRangeFinder = function (cm, start) {
    var startToken = 'IF';
    var endToken = 'END IF';
    var fromToPos = CodeMirror.pgadminKeywordRangeFinder(cm, start, startToken, endToken);
    return fromToPos;
  };

  CodeMirror.pgadminLoopRangeFinder = function (cm, start) {
    var startToken = 'LOOP';
    var endToken = 'END LOOP';
    var fromToPos = CodeMirror.pgadminKeywordRangeFinder(cm, start, startToken, endToken);
    return fromToPos;
  };

  CodeMirror.pgadminCaseRangeFinder = function (cm, start) {
    var startToken = 'CASE';
    var endToken = 'END CASE';
    var fromToPos = CodeMirror.pgadminKeywordRangeFinder(cm, start, startToken, endToken);
    return fromToPos;
  };
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(46)(module)))

/***/ })

},[29])["default"]});;