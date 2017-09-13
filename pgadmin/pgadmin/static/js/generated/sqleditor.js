define(["translations","pgadmin.browser.endpoints","pgadmin.browser.utils","pgadmin.browser.messages"], function(__WEBPACK_EXTERNAL_MODULE_44__, __WEBPACK_EXTERNAL_MODULE_45__, __WEBPACK_EXTERNAL_MODULE_77__, __WEBPACK_EXTERNAL_MODULE_96__) { return webpackJsonp([1,3],{

/***/ 156:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

//////////////////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2017, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////////////////

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, _, S) {

  var check_node_visibility = function check_node_visibility(pgBrowser, node_type) {
    if (_.isUndefined(node_type) || _.isNull(node_type)) {
      return true;
    }

    // Target actual node instead of collection.
    // If node is disabled then there is no meaning of
    // adding collection node menu
    if (S.startsWith(node_type, "coll-")) {
      node_type = node_type.replace("coll-", "");
    }

    // Exclude non-applicable nodes
    var nodes_not_supported = ["server_group", "server", "catalog_object_column"];
    if (_.indexOf(nodes_not_supported, node_type) >= 0) {
      return true;
    }

    var preference = pgBrowser.get_preference("browser", 'show_node_' + node_type);

    if (preference) {
      return preference.value;
    } else {
      return true;
    }
  };

  return check_node_visibility;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 161:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

//////////////////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2017, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////////////////
// This file contains common utilities functions used in sqleditor modules

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($) {
  var sqlEditorUtils = {
    /* Reference link http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
     * Modified as per requirement.
     */
    epicRandomString: function epicRandomString(length) {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      // bits 12-15 of the time_hi_and_version field to 0010
      s[14] = "4";
      // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[19] = hexDigits.substr(s[19] & 0x3 | 0x8, 1);
      s[8] = s[13] = s[18] = s[23] = "-";

      var uuid = s.join("");
      return uuid.replace(/-/g, '').substr(0, length);
    },

    // Returns a unique hash for input string
    getHash: function getHash(input) {
      var hash = 0,
          len = input.length;
      for (var i = 0; i < len; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
        hash |= 0; // to 32bit integer
      }
      return hash;
    },
    calculateColumnWidth: function calculateColumnWidth(text) {
      // Calculate column header width based on column name or type
      // Create a temporary element with given label, append to body
      // calculate its width and remove the element.
      $('body').append('<span id="pg_text" style="visibility: hidden;">' + text + '</span>');
      var width = $('#pg_text').width() + 23;
      $('#pg_text').remove(); // remove element

      return width;
    },
    capitalizeFirstLetter: function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  };
  return sqlEditorUtils;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 162:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2), __webpack_require__(8)], __WEBPACK_AMD_DEFINE_RESULT__ = function (gettext, alertify) {
  var clipboard = {
    copyTextToClipboard: function copyTextToClipboard(text) {
      var textArea = document.createElement('textarea');

      //
      // *** This styling is an extra step which is likely not required. ***
      //
      // Why is it here? To ensure:
      // 1. the element is able to have focus and selection.
      // 2. if element was to flash render it has minimal visual impact.
      // 3. less flakyness with selection and copying which **might** occur if
      //    the textarea element is not visible.
      //
      // The likelihood is the element won't even render, not even a flash,
      // so some of these are just precautions. However in IE the element
      // is visible whilst the popup box asking the user for permission for
      // the web page to copy to the clipboard.
      //

      // Place in top-left corner of screen regardless of scroll position.
      textArea.style.position = 'fixed';
      textArea.style.top = 0;
      textArea.style.left = 0;

      // Ensure it has a small width and height. Setting to 1px / 1em
      // doesn't work as this gives a negative w/h on some browsers.
      textArea.style.width = '2em';
      textArea.style.height = '2em';

      // We don't need padding, reducing the size if it does flash render.
      textArea.style.padding = 0;

      // Clean up any borders.
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';

      // Avoid flash of white box if rendered for any reason.
      textArea.style.background = 'transparent';

      document.body.appendChild(textArea);

      textArea.select();

      var copyTextToClipboardHandler = function copyTextToClipboardHandler(e) {
        /* Remove oncopy event listener from document as we add listener for
         * oncopy event on each copy operation.
         * Also we don't want this listener to be persistent; Otherwise it'll get
         * called for each copy operation performed on any input/textarea from
         * this document.
         */
        document.removeEventListener('copy', copyTextToClipboardHandler);
        var clipboardData = e.clipboardData || window.clipboardData;

        if (clipboardData) {
          clipboardData.setData('text', text);
          // We want our data, not data from any selection, to be written to the clipboard
          e.preventDefault();
        }
      };

      document.addEventListener('copy', copyTextToClipboardHandler);

      try {
        // just perform copy on empty textarea so that copy event will be
        // triggered on document and then we can set clipboardData.
        document.execCommand('copy');
      } catch (err) {
        alertify.alert(gettext('Error'), gettext('Oops, unable to copy to clipboard'));
      }

      document.body.removeChild(textArea);
    }
  };
  return clipboard;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(44)], __WEBPACK_AMD_DEFINE_RESULT__ = function (translations) {

  /***
   * This method behaves as a drop-in replacement for flask translation rendering.
   * It uses the same translation file under the hood and uses flask to determine the language.
   *
   * ex. translate("some %(adjective)s text", {adjective: "cool"})
   *
   * @param {String} text
   * @param {Object} substitutions
   */
  return function gettext(text, substitutions) {

    var rawTranslation = translations[text] ? translations[text] : text;

    // captures things of the form %(substitutionName)s
    var substitutionGroupsRegExp = /([^%]*)%\(([^\)]+)\)s(.*)/;
    var matchFound;

    var interpolated = rawTranslation;
    do {
      matchFound = false;
      interpolated = interpolated.replace(substitutionGroupsRegExp, function (_, textBeginning, substitutionName, textEnd) {
        matchFound = true;
        return textBeginning + substitutions[substitutionName] + textEnd;
      });
    } while (matchFound);

    return interpolated;
  };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 200:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1), __webpack_require__(162), __webpack_require__(32), __webpack_require__(331)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, _, clipboard, RangeSelectionHelper, rangeBoundaryNavigator) {
  var copyData = function copyData() {
    var self = this || window;

    var grid = self.slickgrid;
    var columnDefinitions = grid.getColumns();
    var selectedRanges = grid.getSelectionModel().getSelectedRanges();
    var dataView = grid.getData();
    var rows = grid.getSelectedRows();

    if (RangeSelectionHelper.areAllRangesCompleteRows(grid, selectedRanges)) {
      self.copied_rows = rows.map(function (rowIndex) {
        return grid.getDataItem(rowIndex);
      });
      setPasteRowButtonEnablement(self.can_edit, true);
    } else {
      self.copied_rows = [];
      setPasteRowButtonEnablement(self.can_edit, false);
    }
    var csvText = rangeBoundaryNavigator.rangesToCsv(dataView.getItems(), columnDefinitions, selectedRanges);
    if (csvText) {
      clipboard.copyTextToClipboard(csvText);
    }
  };

  var setPasteRowButtonEnablement = function setPasteRowButtonEnablement(canEditFlag, isEnabled) {
    if (canEditFlag) {
      $('#btn-paste-row').prop('disabled', !isEnabled);
    }
  };
  return copyData;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

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

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (factory) {
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = factory();
  } else {
    // Browser globals
    factory();
  }
})(function () {
  var pgAdmin = window.pgAdmin = window.pgAdmin || {};

  // Reference:
  // https://github.com/heygrady/Units/blob/master/Length.min.js
  // Changed it to save the function in pgAdmin object.
  (function (t, e, o) {
    "use strict";
    function r(t, e, r, p) {
      r = r || "width";var n,
          l,
          m,
          c = (e.match(s) || [])[2],
          f = "px" === c ? 1 : d[c + "toPx"],
          u = /r?em/i;if (f || u.test(c) && !p) t = f ? t : "rem" === c ? i : "fontSize" === r ? t.parentNode || t : t, f = f || parseFloat(a(t, "fontSize")), m = parseFloat(e) * f;else {
        n = t.style, l = n[r];try {
          n[r] = e;
        } catch (x) {
          return 0;
        }m = n[r] ? parseFloat(a(t, r)) : 0, n[r] = l !== o ? l : null;
      }return m;
    }function a(t, e) {
      var o,
          n,
          i,
          l,
          d,
          c = /^top|bottom/,
          f = ["paddingTop", "paddingBottom", "borderTop", "borderBottom"],
          u = 4;if (o = m ? m(t)[e] : (n = t.style["pixel" + e.charAt(0).toUpperCase() + e.slice(1)]) ? n + "px" : "fontSize" === e ? r(t, "1em", "left", 1) + "px" : t.currentStyle[e], i = (o.match(s) || [])[2], "%" === i && p) {
        if (c.test(e)) {
          for (l = (d = t.parentNode || t).offsetHeight; u--;) {
            l -= parseFloat(a(d, f[u]));
          }o = parseFloat(o) / 100 * l + "px";
        } else o = r(t, o);
      } else ("auto" === o || i && "px" !== i) && m ? o = 0 : i && "px" !== i && !m && (o = r(t, o) + "px");return o;
    }var p,
        n = e.createElement("test"),
        i = e.documentElement,
        l = e.defaultView,
        m = l && l.getComputedStyle,
        s = /^(-?[\d+\.\-]+)([a-z]+|%)$/i,
        d = {},
        c = [1 / 25.4, 1 / 2.54, 1 / 72, 1 / 6],
        f = ["mm", "cm", "pt", "pc", "in", "mozmm"],
        u = 6;for (i.appendChild(n), m && (n.style.marginTop = "1%", p = "1%" === m(n).marginTop); u--;) {
      d[f[u] + "toPx"] = c[u] ? c[u] * d.inToPx : r(n, "1" + f[u]);
    }i.removeChild(n), n = o, t.toPx = r;
  })(pgAdmin, window.document);

  // Reference:
  // https://github.com/javve/natural-sort/blob/master/index.js
  // Changed it to save the function in pgAdmin object.
  pgAdmin.natural_sort = function (a, b, options) {
    var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi,
        sre = /(^[ ]*|[ ]*$)/g,
        dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
        hre = /^0x[0-9a-f]+$/i,
        ore = /^0/,
        options = options || {},
        i = function i(s) {
      return options.insensitive && ('' + s).toLowerCase() || '' + s;
    },

    // convert all to strings strip whitespace
    x = i(a).replace(sre, '') || '',
        y = i(b).replace(sre, '') || '',

    // chunk/tokenize
    xN = x.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
        yN = y.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),

    // numeric, hex or date detection
    xD = parseInt(x.match(hre)) || xN.length !== 1 && x.match(dre) && Date.parse(x),
        yD = parseInt(y.match(hre)) || xD && y.match(dre) && Date.parse(y) || null,
        oFxNcL,
        oFyNcL,
        mult = options.desc ? -1 : 1;

    // first try and sort Hex codes or Dates
    if (yD) if (xD < yD) return -1 * mult;else if (xD > yD) return 1 * mult;

    // natural sorting through split numeric strings and default strings
    for (var cLoc = 0, numS = Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
      // find floats not starting with '0', string or 0 if not defined (Clint Priest)
      oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
      oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
      // handle numeric vs string comparison - number < string - (Kyle Adams)
      if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
        return (isNaN(oFxNcL) ? 1 : -1) * mult;
      }
      // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
      else if ((typeof oFxNcL === 'undefined' ? 'undefined' : _typeof(oFxNcL)) !== (typeof oFyNcL === 'undefined' ? 'undefined' : _typeof(oFyNcL))) {
          oFxNcL += '';
          oFyNcL += '';
        }
      if (oFxNcL < oFyNcL) return -1 * mult;
      if (oFxNcL > oFyNcL) return 1 * mult;
    }
    return 0;
  };

  return pgAdmin;
});

/***/ }),

/***/ 32:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(78)], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
  var Slick = window.Slick;

  var isSameRange = function isSameRange(range, otherRange) {
    return range.fromCell == otherRange.fromCell && range.toCell == otherRange.toCell && range.fromRow == otherRange.fromRow && range.toRow == otherRange.toRow;
  };

  var isRangeSelected = function isRangeSelected(selectedRanges, range) {
    return _.any(selectedRanges, function (selectedRange) {
      return isSameRange(selectedRange, range);
    });
  };

  var isAnyCellOfColumnSelected = function isAnyCellOfColumnSelected(selectedRanges, column) {
    return _.any(selectedRanges, function (selectedRange) {
      return selectedRange.fromCell <= column && selectedRange.toCell >= column;
    });
  };

  var isAnyCellOfRowSelected = function isAnyCellOfRowSelected(selectedRanges, row) {
    return _.any(selectedRanges, function (selectedRange) {
      return selectedRange.fromRow <= row && selectedRange.toRow >= row;
    });
  };

  var isRangeEntirelyWithinSelectedRanges = function isRangeEntirelyWithinSelectedRanges(selectedRanges, range) {
    return _.any(selectedRanges, function (selectedRange) {
      return selectedRange.fromCell <= range.fromCell && selectedRange.toCell >= range.toCell && selectedRange.fromRow <= range.fromRow && selectedRange.toRow >= range.toRow;
    });
  };

  var removeRange = function removeRange(selectedRanges, range) {
    return _.filter(selectedRanges, function (selectedRange) {
      return !isSameRange(selectedRange, range);
    });
  };

  var addRange = function addRange(ranges, range) {
    ranges.push(range);
    return ranges;
  };

  var areAllRangesSingleRows = function areAllRangesSingleRows(ranges, grid) {
    return _.every(ranges, function (range) {
      return range.fromRow == range.toRow && rangeHasCompleteRows(grid, range);
    });
  };

  var areAllRangesSingleColumns = function areAllRangesSingleColumns(ranges, grid) {
    return _.every(ranges, isRangeAColumn.bind(this, grid));
  };

  var rangeForRow = function rangeForRow(grid, rowId) {
    var columnDefinitions = grid.getColumns();
    if (isFirstColumnData(columnDefinitions)) {
      return new Slick.Range(rowId, 0, rowId, grid.getColumns().length - 1);
    }
    return new Slick.Range(rowId, 1, rowId, grid.getColumns().length - 1);
  };

  var rangeForColumn = function rangeForColumn(grid, columnIndex) {
    return new Slick.Range(0, columnIndex, grid.getDataLength() - 1, columnIndex);
  };

  var getRangeOfWholeGrid = function getRangeOfWholeGrid(grid) {
    return new Slick.Range(0, 1, grid.getDataLength() - 1, grid.getColumns().length - 1);
  };

  var isEntireGridSelected = function isEntireGridSelected(grid) {
    var selectionModel = grid.getSelectionModel();
    var selectedRanges = selectionModel.getSelectedRanges();
    return selectedRanges.length == 1 && isSameRange(selectedRanges[0], getRangeOfWholeGrid(grid));
  };

  var isFirstColumnData = function isFirstColumnData(columnDefinitions) {
    return !_.isUndefined(columnDefinitions[0].pos);
  };

  var areAllRangesCompleteColumns = function areAllRangesCompleteColumns(grid, ranges) {
    return _.every(ranges, function (range) {
      return rangeHasCompleteColumns(grid, range);
    });
  };

  var areAllRangesCompleteRows = function areAllRangesCompleteRows(grid, ranges) {
    return _.every(ranges, function (range) {
      return rangeHasCompleteRows(grid, range);
    });
  };

  var getIndexesOfCompleteRows = function getIndexesOfCompleteRows(grid, ranges) {
    var indexArray = [];
    ranges.forEach(function (range) {
      if (rangeHasCompleteRows(grid, range)) indexArray = indexArray.concat(_.range(range.fromRow, range.toRow + 1));
    });

    return indexArray;
  };

  var isRangeAColumn = function isRangeAColumn(grid, range) {
    return range.fromCell == range.toCell && range.fromRow == 0 && range.toRow == grid.getDataLength() - 1;
  };

  var rangeHasCompleteColumns = function rangeHasCompleteColumns(grid, range) {
    return range.fromRow === 0 && range.toRow === grid.getDataLength() - 1;
  };

  var rangeHasCompleteRows = function rangeHasCompleteRows(grid, range) {
    return range.fromCell === getFirstDataColumnIndex(grid) && range.toCell === getLastDataColumnIndex(grid);
  };

  function getFirstDataColumnIndex(grid) {
    return _.findIndex(grid.getColumns(), function (columnDefinition) {
      var pos = columnDefinition.pos;

      return !_.isUndefined(pos) && isSelectable(columnDefinition);
    });
  }

  function getLastDataColumnIndex(grid) {
    return _.findLastIndex(grid.getColumns(), isSelectable);
  }

  function isSelectable(columnDefinition) {
    return _.isUndefined(columnDefinition.selectable) || columnDefinition.selectable === true;
  }

  function selectAll(grid) {
    var range = getRangeOfWholeGrid(grid);
    var selectionModel = grid.getSelectionModel();

    selectionModel.setSelectedRanges([range]);
  }

  return {
    addRange: addRange,
    removeRange: removeRange,
    isRangeSelected: isRangeSelected,
    areAllRangesSingleRows: areAllRangesSingleRows,
    areAllRangesSingleColumns: areAllRangesSingleColumns,
    areAllRangesCompleteRows: areAllRangesCompleteRows,
    areAllRangesCompleteColumns: areAllRangesCompleteColumns,
    rangeForRow: rangeForRow,
    rangeForColumn: rangeForColumn,
    isEntireGridSelected: isEntireGridSelected,
    getRangeOfWholeGrid: getRangeOfWholeGrid,
    isFirstColumnData: isFirstColumnData,
    getIndexesOfCompleteRows: getIndexesOfCompleteRows,
    selectAll: selectAll,
    isRangeAColumn: isRangeAColumn,
    rangeHasCompleteColumns: rangeHasCompleteColumns,
    rangeHasCompleteRows: rangeHasCompleteRows,
    isAnyCellOfColumnSelected: isAnyCellOfColumnSelected,
    isRangeEntirelyWithinSelectedRanges: isRangeEntirelyWithinSelectedRanges,
    isAnyCellOfRowSelected: isAnyCellOfRowSelected
  };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),

/***/ 324:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(187), __webpack_require__(2), __webpack_require__(5), __webpack_require__(0), __webpack_require__(1), __webpack_require__(4), __webpack_require__(17), __webpack_require__(3), __webpack_require__(10), __webpack_require__(29), __webpack_require__(325), __webpack_require__(327), __webpack_require__(330), __webpack_require__(162), __webpack_require__(200), __webpack_require__(32), __webpack_require__(495), __webpack_require__(332), __webpack_require__(333), __webpack_require__(161), __webpack_require__(334), __webpack_require__(336), __webpack_require__(23), __webpack_require__(99), __webpack_require__(480), __webpack_require__(481), __webpack_require__(482), __webpack_require__(191), __webpack_require__(492), __webpack_require__(493), __webpack_require__(494), __webpack_require__(6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (babelPollyfill, gettext, url_for, $, _, S, alertify, pgAdmin, Backbone, codemirror, pgExplain, GridSelector, ActiveCellCapture, clipboard, copyData, RangeSelectionHelper, handleQueryOutputKeyboardEvent, XCellSelectionModel, setStagedRows, SqlEditorUtils, HistoryBundle, queryHistory, React, ReactDOM, keyboardShortcuts, queryToolActions) {
  /* Return back, this has been called more than once */
  if (pgAdmin.SqlEditor) return pgAdmin.SqlEditor;

  // Some scripts do export their object in the window only.
  // Generally the one, which do no have AMD support.
  var wcDocker = window.wcDocker,
      pgBrowser = pgAdmin.Browser,
      CodeMirror = codemirror.default,
      Slick = window.Slick;

  var is_query_running = false;

  // Defining Backbone view for the sql grid.
  var SQLEditorView = Backbone.View.extend({
    initialize: function initialize(opts) {
      this.$el = opts.el;
      this.handler = opts.handler;
      this.handler['col_size'] = {};
    },

    // Bind all the events
    events: {
      "click .btn-load-file": "on_file_load",
      "click #btn-save": "on_save",
      "click #btn-file-menu-save": "on_save",
      "click #btn-file-menu-save-as": "on_save_as",
      "click #btn-find": "on_find",
      "click #btn-find-menu-find": "on_find",
      "click #btn-find-menu-find-next": "on_find_next",
      "click #btn-find-menu-find-previous": "on_find_previous",
      "click #btn-find-menu-replace": "on_replace",
      "click #btn-find-menu-replace-all": "on_replace_all",
      "click #btn-find-menu-find-persistent": "on_find_persistent",
      "click #btn-find-menu-jump": "on_jump",
      "click #btn-delete-row": "on_delete",
      "click #btn-filter": "on_show_filter",
      "click #btn-filter-menu": "on_show_filter",
      "click #btn-include-filter": "on_include_filter",
      "click #btn-exclude-filter": "on_exclude_filter",
      "click #btn-remove-filter": "on_remove_filter",
      "click #btn-apply": "on_apply",
      "click #btn-cancel": "on_cancel",
      "click #btn-copy-row": "on_copy_row",
      "click #btn-paste-row": "on_paste_row",
      "click #btn-flash": "on_flash",
      "click #btn-flash-menu": "on_flash",
      "click #btn-cancel-query": "on_cancel_query",
      "click #btn-download": "on_download",
      "click #btn-edit": "on_clear",
      "click #btn-clear": "on_clear",
      "click #btn-auto-commit": "on_auto_commit",
      "click #btn-auto-rollback": "on_auto_rollback",
      "click #btn-clear-history": "on_clear_history",
      "click .noclose": 'do_not_close_menu',
      "click #btn-explain": "on_explain",
      "click #btn-explain-analyze": "on_explain_analyze",
      "click #btn-explain-verbose": "on_explain_verbose",
      "click #btn-explain-costs": "on_explain_costs",
      "click #btn-explain-buffers": "on_explain_buffers",
      "click #btn-explain-timing": "on_explain_timing",
      "change .limit": "on_limit_change",
      "keydown": "keyAction",
      // Comment options
      "click #btn-comment-code": "on_toggle_comment_block_code",
      "click #btn-toggle-comment-block": "on_toggle_comment_block_code",
      "click #btn-comment-line": "on_comment_line_code",
      "click #btn-uncomment-line": "on_uncomment_line_code",
      // Indentation options
      "click #btn-indent-code": "on_indent_code",
      "click #btn-unindent-code": "on_unindent_code"
    },

    // This function is used to render the template.
    render: function render() {
      var self = this,
          filter = self.$el.find('#sql_filter');

      $('.editor-title').text(_.unescape(self.editor_title));
      self.filter_obj = CodeMirror.fromTextArea(filter.get(0), {
        lineNumbers: true,
        indentUnit: 4,
        mode: self.handler.server_type === "gpdb" ? "text/x-gpsql" : "text/x-pgsql",
        foldOptions: {
          widget: '\u2026'
        },
        foldGutter: {
          rangeFinder: CodeMirror.fold.combine(CodeMirror.pgadminBeginRangeFinder, CodeMirror.pgadminIfRangeFinder, CodeMirror.pgadminLoopRangeFinder, CodeMirror.pgadminCaseRangeFinder)
        },
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        extraKeys: pgBrowser.editor_shortcut_keys,
        tabSize: pgAdmin.Browser.editor_options.tabSize,
        lineWrapping: pgAdmin.Browser.editor_options.wrapCode,
        autoCloseBrackets: pgAdmin.Browser.editor_options.insert_pair_brackets,
        matchBrackets: pgAdmin.Browser.editor_options.brace_matching
      });

      // Create main wcDocker instance
      var main_docker = new wcDocker('#editor-panel', {
        allowContextMenu: false,
        allowCollapse: false,
        themePath: url_for('static', { 'filename': 'css' }),
        theme: 'webcabin.overrides.css'
      });

      var sql_panel = new pgAdmin.Browser.Panel({
        name: 'sql_panel',
        title: false,
        width: '100%',
        height: '20%',
        isCloseable: false,
        isPrivate: true
      });

      sql_panel.load(main_docker);
      var sql_panel_obj = main_docker.addPanel('sql_panel', wcDocker.DOCK.TOP);

      var text_container = $('<textarea id="sql_query_tool"></textarea>');
      var output_container = $('<div id="output-panel"></div>').append(text_container);
      sql_panel_obj.$container.find('.pg-panel-content').append(output_container);

      self.query_tool_obj = CodeMirror.fromTextArea(text_container.get(0), {
        lineNumbers: true,
        indentUnit: 4,
        styleSelectedText: true,
        mode: self.handler.server_type === "gpdb" ? "text/x-gpsql" : "text/x-pgsql",
        foldOptions: {
          widget: '\u2026'
        },
        foldGutter: {
          rangeFinder: CodeMirror.fold.combine(CodeMirror.pgadminBeginRangeFinder, CodeMirror.pgadminIfRangeFinder, CodeMirror.pgadminLoopRangeFinder, CodeMirror.pgadminCaseRangeFinder)
        },
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        extraKeys: pgBrowser.editor_shortcut_keys,
        tabSize: pgAdmin.Browser.editor_options.tabSize,
        lineWrapping: pgAdmin.Browser.editor_options.wrapCode,
        scrollbarStyle: 'simple',
        autoCloseBrackets: pgAdmin.Browser.editor_options.insert_pair_brackets,
        matchBrackets: pgAdmin.Browser.editor_options.brace_matching
      });

      // Refresh Code mirror on SQL panel resize to
      // display its value properly
      sql_panel_obj.on(wcDocker.EVENT.RESIZE_ENDED, function () {
        setTimeout(function () {
          if (self && self.query_tool_obj) {
            self.query_tool_obj.refresh();
          }
        }, 200);
      });

      // Create panels for 'Data Output', 'Explain', 'Messages' and 'History'
      var data_output = new pgAdmin.Browser.Panel({
        name: 'data_output',
        title: gettext("Data Output"),
        width: '100%',
        height: '100%',
        isCloseable: false,
        isPrivate: true,
        content: '<div id ="datagrid" class="sql-editor-grid-container text-12"></div>'
      });

      var explain = new pgAdmin.Browser.Panel({
        name: 'explain',
        title: gettext("Explain"),
        width: '100%',
        height: '100%',
        isCloseable: false,
        isPrivate: true,
        content: '<div class="sql-editor-explain"></div>'
      });

      var messages = new pgAdmin.Browser.Panel({
        name: 'messages',
        title: gettext("Messages"),
        width: '100%',
        height: '100%',
        isCloseable: false,
        isPrivate: true,
        content: '<div class="sql-editor-message"></div>'
      });

      var history = new pgAdmin.Browser.Panel({
        name: 'history',
        title: gettext("Query History"),
        width: '100%',
        height: '100%',
        isCloseable: false,
        isPrivate: true,
        content: '<div id ="history_grid" class="sql-editor-history-container"></div>'
      });

      // Load all the created panels
      data_output.load(main_docker);
      explain.load(main_docker);
      messages.load(main_docker);
      history.load(main_docker);

      // Add all the panels to the docker
      self.data_output_panel = main_docker.addPanel('data_output', wcDocker.DOCK.BOTTOM, sql_panel_obj);
      self.explain_panel = main_docker.addPanel('explain', wcDocker.DOCK.STACKED, self.data_output_panel);
      self.messages_panel = main_docker.addPanel('messages', wcDocker.DOCK.STACKED, self.data_output_panel);
      self.history_panel = main_docker.addPanel('history', wcDocker.DOCK.STACKED, self.data_output_panel);

      self.render_history_grid();

      if (!self.handler.is_new_browser_tab) {
        // Listen on the panel closed event and notify user to save modifications.
        _.each(window.top.pgAdmin.Browser.docker.findPanels('frm_datagrid'), function (p) {
          if (p.isVisible()) {
            p.on(wcDocker.EVENT.CLOSING, function () {
              // Only if we can edit data then perform this check
              var notify = false,
                  msg;
              if (self.handler.can_edit) {
                var data_store = self.handler.data_store;
                if (data_store && (_.size(data_store.added) || _.size(data_store.updated))) {
                  msg = gettext("The data has changed. Do you want to save changes?");
                  notify = true;
                }
              } else if (self.handler.is_query_tool && self.handler.is_query_changed) {
                msg = gettext("The text has changed. Do you want to save changes?");
                notify = true;
              }
              if (notify) {
                return self.user_confirmation(p, msg);
              }
              return true;
            });
            // Set focus on query tool of active panel
            p.on(wcDocker.EVENT.GAIN_FOCUS, function () {
              if (!$(p.$container).hasClass('wcPanelTabContentHidden')) {
                setTimeout(function () {
                  self.handler.gridView.query_tool_obj.focus();
                }, 200);
              }
            });
          }
        });
      }

      // set focus on query tool once loaded
      setTimeout(function () {
        self.query_tool_obj.focus();
      }, 500);

      /* We have override/register the hint function of CodeMirror
       * to provide our own hint logic.
       */
      CodeMirror.registerHelper("hint", "sql", function (editor, options) {
        var data = [],
            doc = editor.getDoc(),
            cur = doc.getCursor(),

        // Get the current cursor position
        current_cur = cur.ch,

        // function context
        ctx = {
          editor: editor,
          // URL for auto-complete
          url: url_for('sqleditor.autocomplete', { 'trans_id': self.transId }),
          data: data,
          // Get the line number in the cursor position
          current_line: cur.line,
          /*
           * Render function for hint to add our own class
           * and icon as per the object type.
           */
          hint_render: function hint_render(elt, data, cur) {
            var el = document.createElement('span');

            switch (cur.type) {
              case 'database':
                el.className = 'sqleditor-hint pg-icon-' + cur.type;
                break;
              case 'datatype':
                el.className = 'sqleditor-hint icon-type';
                break;
              case 'keyword':
                el.className = 'fa fa-key';
                break;
              case 'table alias':
                el.className = 'fa fa-at';
                break;
              default:
                el.className = 'sqleditor-hint icon-' + cur.type;
            }

            el.appendChild(document.createTextNode(cur.text));
            elt.appendChild(el);
          }
        };

        data.push(doc.getValue());
        // Get the text from start to the current cursor position.
        data.push(doc.getRange({ line: 0, ch: 0 }, { line: ctx.current_line, ch: current_cur }));

        return {
          then: function (cb) {
            var self = this;
            // Make ajax call to find the autocomplete data
            $.ajax({
              url: self.url,
              method: 'POST',
              contentType: "application/json",
              data: JSON.stringify(self.data),
              success: function success(res) {
                var result = [];

                _.each(res.data.result, function (obj, key) {
                  result.push({
                    text: key, type: obj.object_type,
                    render: self.hint_render
                  });
                });

                // Sort function to sort the suggestion's alphabetically.
                result.sort(function (a, b) {
                  var textA = a.text.toLowerCase(),
                      textB = b.text.toLowerCase();
                  if (textA < textB) //sort string ascending
                    return -1;
                  if (textA > textB) return 1;
                  return 0; //default return value (no sorting)
                });

                /*
                 * Below logic find the start and end point
                 * to replace the selected auto complete suggestion.
                 */
                var token = self.editor.getTokenAt(cur),
                    start,
                    end,
                    search;
                if (token.end > cur.ch) {
                  token.end = cur.ch;
                  token.string = token.string.slice(0, cur.ch - token.start);
                }

                if (token.string.match(/^[.`\w@]\w*$/)) {
                  search = token.string;
                  start = token.start;
                  end = token.end;
                } else {
                  start = end = cur.ch;
                  search = "";
                }

                /*
                 * Added 1 in the start position if search string
                 * started with "." or "`" else auto complete of code mirror
                 * will remove the "." when user select any suggestion.
                 */
                if (search.charAt(0) == "." || search.charAt(0) == "``") start += 1;

                cb({
                  list: result,
                  from: { line: self.current_line, ch: start },
                  to: { line: self.current_line, ch: end }
                });
              }
            });
          }.bind(ctx)
        };
      });
    },

    /* To prompt user for unsaved changes */
    user_confirmation: function user_confirmation(panel, msg) {
      // If there is anything to save then prompt user
      var that = this;

      alertify.confirmSave || alertify.dialog('confirmSave', function () {
        return {
          main: function main(title, message) {
            var content = '<div class="ajs-content">' + gettext('The text has changed. Do you want to save changes?') + '</div>';
            this.setHeader(title);
            this.setContent(message);
          },
          setup: function setup() {
            return {
              buttons: [{
                text: gettext('Save'),
                className: 'btn btn-primary'
              }, {
                text: gettext('Don\'t save'),
                className: 'btn btn-danger'
              }, {
                text: gettext('Cancel'),
                key: 27, // ESC
                invokeOnClose: true,
                className: 'btn btn-warning'
              }],
              focus: {
                element: 0,
                select: false
              },
              options: {
                maximizable: false,
                resizable: false
              }
            };
          },
          callback: function callback(closeEvent) {
            switch (closeEvent.index) {
              case 0:
                // Save
                that.handler.close_on_save = true;
                that.handler._save(that, that.handler);
                break;
              case 1:
                // Don't Save
                that.handler.close_on_save = false;
                that.handler.close();
                break;
              case 2:
                //Cancel
                //Do nothing.
                break;
            }
          }
        };
      });
      alertify.confirmSave(gettext("Save changes?"), msg);
      return false;
    },

    /* Regarding SlickGrid usage in render_grid function.
      SlickGrid Plugins:
     ------------------
     1) Slick.AutoTooltips
     - This plugin is useful for displaying cell data as tooltip when
     user hover mouse on cell if data is large
     2) Slick.CheckboxSelectColumn
     - This plugin is useful for selecting rows using checkbox
     3) RowSelectionModel
     - This plugin is needed by CheckboxSelectColumn plugin to select rows
      Grid Options:
     -------------
     1) editable
     - This option allow us to make grid editable
     2) enableAddRow
     - This option allow us to add new rows at the end of grid
     3) enableCellNavigation
     - This option allow us to navigate cells using keyboard
     4) enableColumnReorder
     - This option allow us to record column
     5) asyncEditorLoading
     - This option allow us to open editor async
     6) autoEdit
     - This option allow us to enter in edit mode directly when user clicks on it
     otherwise user have to double click or manually press enter on cell to go
     in cell edit mode
      Handling of data:
     -----------------
     We are doing data handling manually,what user adds/updates/deletes etc
     we will use `data_store` object to store everything user does within grid data
      - updated:
     This will hold all the data which user updates in grid
     - added:
     This will hold all the new row(s) data which user adds in grid
     - staged_rows:
     This will hold all the data which user copies/pastes/deletes in grid
     - deleted:
     This will hold all the data which user deletes in grid
      Events handling:
     ----------------
     1) onCellChange
     - We are using this event to listen to changes on individual cell.
     2) onAddNewRow
     - We are using this event to listen to new row adding functionality.
     3) onSelectedRangesChanged
     - We are using this event to listen when user selects rows for copy/delete operation.
     4) onBeforeEditCell
     - We are using this event to save the data before users modified them
     5) onKeyDown
     - We are using this event for Copy operation on grid
     */

    // This function is responsible to create and render the SlickGrid.
    render_grid: function render_grid(collection, columns, is_editable, client_primary_key, rows_affected) {
      var self = this;

      // This will work as data store and holds all the
      // inserted/updated/deleted data from grid
      self.handler.data_store = {
        updated: {},
        added: {},
        staged_rows: {},
        deleted: {},
        updated_index: {},
        added_index: {}
      };

      // To store primary keys before they gets changed
      self.handler.primary_keys_data = {};

      self.client_primary_key = client_primary_key;

      self.client_primary_key_counter = 0;

      // Remove any existing grid first
      if (self.handler.slickgrid) {
        self.handler.slickgrid.destroy();
      }

      if (!_.isArray(collection) || !_.size(collection)) {
        collection = [];
      }

      var grid_columns = [],
          table_name;
      var column_size = self.handler['col_size'],
          query = self.handler.query,

      // Extract table name from query
      table_list = query.match(/select.*from\s+\w+\.*(\w+)/i);

      if (!table_list) {
        table_name = SqlEditorUtils.getHash(query);
      } else {
        table_name = table_list[1];
      }

      self.handler['table_name'] = table_name;
      column_size[table_name] = column_size[table_name] || {};

      var grid_width = $($('#editor-panel').find('.wcFrame')[1]).width();
      _.each(columns, function (c) {
        var options = {
          id: c.name,
          pos: c.pos,
          field: c.name,
          name: c.label,
          display_name: c.display_name,
          column_type: c.column_type,
          column_type_internal: c.column_type_internal,
          not_null: c.not_null,
          has_default_val: c.has_default_val
        };

        // Get the columns width based on longer string among data type or
        // column name.
        var column_type = c.column_type.trim();
        var label = c.name.length > column_type.length ? c.name : column_type;

        if (_.isUndefined(column_size[table_name][c.name])) {
          options['width'] = SqlEditorUtils.calculateColumnWidth(label);
          column_size[table_name][c.name] = options['width'];
        } else {
          options['width'] = column_size[table_name][c.name];
        }

        // If grid is editable then add editor else make it readonly
        if (c.cell == 'Json') {
          options['editor'] = is_editable ? Slick.Editors.JsonText : Slick.Editors.ReadOnlyJsonText;
          options['formatter'] = Slick.Formatters.JsonString;
        } else if (c.cell == 'number' || $.inArray(c.type, ['oid', 'xid', 'real']) !== -1) {
          options['editor'] = is_editable ? Slick.Editors.CustomNumber : Slick.Editors.ReadOnlyText;
          options['formatter'] = Slick.Formatters.Numbers;
        } else if (c.cell == 'boolean') {
          options['editor'] = is_editable ? Slick.Editors.Checkbox : Slick.Editors.ReadOnlyCheckbox;
          options['formatter'] = Slick.Formatters.Checkmark;
        } else {
          options['editor'] = is_editable ? Slick.Editors.pgText : Slick.Editors.ReadOnlypgText;
          options['formatter'] = Slick.Formatters.Text;
        }

        grid_columns.push(options);
      });

      var gridSelector = new GridSelector();
      grid_columns = self.grid_columns = gridSelector.getColumnDefinitions(grid_columns);

      if (rows_affected) {
        // calculate with for header row column.
        grid_columns[0]['width'] = SqlEditorUtils.calculateColumnWidth(rows_affected);
      }

      var grid_options = {
        editable: true,
        enableAddRow: is_editable,
        enableCellNavigation: true,
        enableColumnReorder: false,
        asyncEditorLoading: false,
        autoEdit: false
      };

      var $data_grid = self.$el.find('#datagrid');
      // Calculate height based on panel size at runtime & set it
      var grid_height = $($('#editor-panel').find('.wcFrame')[1]).height() - 35;
      $data_grid.height(grid_height);

      var dataView = self.dataView = new Slick.Data.DataView(),
          grid = self.grid = new Slick.Grid($data_grid, dataView, grid_columns, grid_options);

      // Add-on function which allow us to identify the faulty row after insert/update
      // and apply css accordingly

      dataView.getItemMetadata = function (i) {
        var res = {},
            cssClass = '',
            data_store = self.handler.data_store;

        if (_.has(self.handler, 'data_store')) {
          if (i in data_store.added_index && data_store.added_index[i] in data_store.added) {
            cssClass = 'new_row';
            if (data_store.added[data_store.added_index[i]].err) {
              cssClass += ' error';
            }
          } else if (i in data_store.updated_index && i in data_store.updated) {
            cssClass = 'updated_row';
            if (data_store.updated[data_store.updated_index[i]].err) {
              cssClass += ' error';
            }
          }
        }
        // Disable rows having default values
        if (!_.isUndefined(self.handler.rows_to_disable) && _.indexOf(self.handler.rows_to_disable, i) !== -1) {
          cssClass += ' disabled_row';
        }
        return { 'cssClasses': cssClass };
      };

      grid.registerPlugin(new Slick.AutoTooltips({ enableForHeaderCells: false }));
      grid.registerPlugin(new ActiveCellCapture());
      grid.setSelectionModel(new XCellSelectionModel());
      grid.registerPlugin(gridSelector);

      var editor_data = {
        keys: self.handler.primary_keys,
        vals: collection,
        columns: columns,
        grid: grid,
        selection: grid.getSelectionModel(),
        editor: self,
        client_primary_key: self.client_primary_key
      };

      self.handler.slickgrid = grid;

      // Listener function to watch selected rows from grid
      if (editor_data.selection) {
        editor_data.selection.onSelectedRangesChanged.subscribe(setStagedRows.bind(editor_data));
      }

      grid.onColumnsResized.subscribe(function (e, args) {
        var columns = this.getColumns();
        _.each(columns, function (col, key) {
          var column_size = self.handler['col_size'];
          column_size[self.handler['table_name']][col['id']] = col['width'];
        });
      });

      gridSelector.onBeforeGridSelectAll.subscribe(function (e, args) {
        if (self.handler.has_more_rows) {
          // this will prevent selection un-till we load all data
          e.stopImmediatePropagation();
          self.fetch_next_all(function () {
            // since we've stopped event propagation we need to
            // trigger onGridSelectAll manually with new event data.
            gridSelector.onGridSelectAll.notify(args, new Slick.EventData());
          });
        }
      });

      gridSelector.onBeforeGridColumnSelectAll.subscribe(function (e, args) {
        if (self.handler.has_more_rows) {
          // this will prevent selection un-till we load all data
          e.stopImmediatePropagation();
          self.fetch_next_all(function () {
            // since we've stopped event propagation we need to
            // trigger onGridColumnSelectAll manually with new event data.
            gridSelector.onGridColumnSelectAll.notify(args, new Slick.EventData());
          });
        }
      });

      // listen for row count change.
      dataView.onRowCountChanged.subscribe(function (e, args) {
        grid.updateRowCount();
        grid.render();
      });

      // listen for rows change.
      dataView.onRowsChanged.subscribe(function (e, args) {
        grid.invalidateRows(args.rows);
        grid.render();
      });

      // Listener function which will be called before user updates existing cell
      // This will be used to collect primary key for that row
      grid.onBeforeEditCell.subscribe(function (e, args) {
        if (args.column.column_type_internal == 'bytea' || args.column.column_type_internal == 'bytea[]') {
          return false;
        }

        var before_data = args.item;

        // If newly added row is saved but grid is not refreshed,
        // then disable cell editing for that row
        if (self.handler.rows_to_disable && _.contains(self.handler.rows_to_disable, args.row)) {
          return false;
        }

        if (self.handler.can_edit && before_data && self.client_primary_key in before_data) {
          var _pk = before_data[self.client_primary_key],
              _keys = self.handler.primary_keys,
              current_pk = {},
              each_pk_key = {};

          // If already have primary key data then no need to go ahead
          if (_pk in self.handler.primary_keys_data) {
            return;
          }

          // Fetch primary keys for the row before they gets modified
          var _columns = self.handler.columns;
          _.each(_keys, function (value, key) {
            current_pk[key] = before_data[key];
          });
          // Place it in main variable for later use
          self.handler.primary_keys_data[_pk] = current_pk;
        }
      });

      grid.onKeyDown.subscribe(function (event, args) {
        var KEY_A = 65;
        var modifiedKey = event.keyCode;
        var isModifierDown = event.ctrlKey || event.metaKey;
        // Intercept Ctrl/Cmd + A key board event.
        // As we might want to load all rows before selecting all.
        if (isModifierDown && modifiedKey == KEY_A && self.handler.has_more_rows) {
          self.fetch_next_all(function () {
            handleQueryOutputKeyboardEvent(event, args);
          });
        } else {
          handleQueryOutputKeyboardEvent(event, args);
        }
      });

      // Listener function which will be called when user updates existing rows
      grid.onCellChange.subscribe(function (e, args) {
        // self.handler.data_store.updated will holds all the updated data
        var changed_column = args.grid.getColumns()[args.cell].field,
            updated_data = args.item[changed_column],
            // New value for current field
        _pk = args.item[self.client_primary_key] || null,
            // Unique key to identify row
        column_data = {},
            _type;

        // Access to row/cell value after a cell is changed.
        // The purpose is to remove row_id from temp_new_row
        // if new row has primary key instead of [default_value]
        // so that cell edit is enabled for that row.
        var grid = args.grid,
            row_data = grid.getDataItem(args.row),
            is_primary_key = _.all(_.values(_.pick(row_data, self.primary_keys)), function (val) {
          return val != undefined;
        });

        // temp_new_rows is available only for view data.
        if (is_primary_key && self.handler.temp_new_rows) {
          var index = self.handler.temp_new_rows.indexOf(args.row);
          if (index > -1) {
            self.handler.temp_new_rows.splice(index, 1);
          }
        }

        column_data[changed_column] = updated_data;

        if (_pk) {
          // Check if it is in newly added row by user?
          if (_pk in self.handler.data_store.added) {
            _.extend(self.handler.data_store.added[_pk]['data'], column_data);
            //Find type for current column
            self.handler.data_store.added[_pk]['err'] = false;
            // Check if it is updated data from existing rows?
          } else if (_pk in self.handler.data_store.updated) {
            _.extend(self.handler.data_store.updated[_pk]['data'], column_data);
            self.handler.data_store.updated[_pk]['err'] = false;
          } else {
            // First updated data for this primary key
            self.handler.data_store.updated[_pk] = {
              'err': false, 'data': column_data,
              'primary_keys': self.handler.primary_keys_data[_pk]
            };
            self.handler.data_store.updated_index[args.row] = _pk;
          }
        }
        // Enable save button
        $("#btn-save").prop('disabled', false);
      }.bind(editor_data));

      // Listener function which will be called when user adds new rows
      grid.onAddNewRow.subscribe(function (e, args) {
        // self.handler.data_store.added will holds all the newly added rows/data
        var column = args.column,
            item = args.item,
            data_length = this.grid.getDataLength(),
            _key = (self.client_primary_key_counter++).toString(),
            dataView = this.grid.getData();

        // Add new row in list to keep track of it
        if (_.isUndefined(item[0])) {
          self.handler.temp_new_rows.push(data_length);
        }

        // If copied item has already primary key, use it.
        if (item) {
          item[self.client_primary_key] = _key;
        }

        dataView.addItem(item);
        self.handler.data_store.added[_key] = { 'err': false, 'data': item };
        self.handler.data_store.added_index[data_length] = _key;
        // Fetch data type & add it for the column
        var temp = {};
        temp[column.name] = _.where(this.columns, { pos: column.pos })[0]['type'];
        grid.updateRowCount();
        grid.render();

        // Enable save button
        $("#btn-save").prop('disabled', false);
      }.bind(editor_data));

      // Listen grid viewportChanged event to load next chunk of data.
      grid.onViewportChanged.subscribe(function (e, args) {
        var rendered_range = args.grid.getRenderedRange(),
            data_len = args.grid.getDataLength();
        // start fetching next batch of records before reaching to bottom.
        if (self.handler.has_more_rows && !self.handler.fetching_rows && rendered_range.bottom > data_len - 100) {
          // fetch asynchronous
          setTimeout(self.fetch_next.bind(self));
        }
      });
      // Resize SlickGrid when window resize
      $(window).resize(function () {
        // Resize grid only when 'Data Output' panel is visible.
        if (self.data_output_panel.isVisible()) {
          self.grid_resize(grid);
        }
      });

      // Resize SlickGrid when output Panel resize
      self.data_output_panel.on(wcDocker.EVENT.RESIZE_ENDED, function () {
        // Resize grid only when 'Data Output' panel is visible.
        if (self.data_output_panel.isVisible()) {
          self.grid_resize(grid);
        }
      });

      // Resize SlickGrid when output Panel gets focus
      self.data_output_panel.on(wcDocker.EVENT.VISIBILITY_CHANGED, function () {
        // Resize grid only if output panel is visible
        if (self.data_output_panel.isVisible()) self.grid_resize(grid);
      });

      for (var i = 0; i < collection.length; i++) {
        // Convert to dict from 2darray
        var item = {};
        for (var j = 1; j < grid_columns.length; j++) {
          item[grid_columns[j]['field']] = collection[i][grid_columns[j]['pos']];
        }

        item[self.client_primary_key] = (self.client_primary_key_counter++).toString();
        collection[i] = item;
      }
      dataView.setItems(collection, self.client_primary_key);
    },
    fetch_next_all: function fetch_next_all(cb) {
      this.fetch_next(true, cb);
    },
    fetch_next: function fetch_next(fetch_all, cb) {
      var self = this,
          url = '';

      // This will prevent fetch operation if previous fetch operation is
      // already in progress.
      self.handler.fetching_rows = true;

      $("#btn-flash").prop('disabled', true);

      if (fetch_all) {
        self.handler.trigger('pgadmin-sqleditor:loading-icon:show', gettext('Fetching all records...'));
        url = url_for('sqleditor.fetch_all', { 'trans_id': self.transId, 'fetch_all': 1 });
      } else {
        url = url = url_for('sqleditor.fetch', { 'trans_id': self.transId });
      }

      $.ajax({
        url: url,
        method: 'GET',
        success: function success(res) {
          self.handler.has_more_rows = res.data.has_more_rows;
          $("#btn-flash").prop('disabled', false);
          self.handler.trigger('pgadmin-sqleditor:loading-icon:hide');
          self.update_grid_data(res.data.result);
          self.handler.fetching_rows = false;
          if (typeof cb == "function") {
            cb();
          }
        },
        error: function error(e) {
          $("#btn-flash").prop('disabled', false);
          self.handler.trigger('pgadmin-sqleditor:loading-icon:hide');
          self.handler.has_more_rows = false;
          self.handler.fetching_rows = false;
          if (typeof cb == "function") {
            cb();
          }
          if (e.readyState == 0) {
            self.update_msg_history(false, gettext('Not connected to the server or the connection to the server has been closed.'));
            return;
          }
        }
      });
    },

    update_grid_data: function update_grid_data(data) {
      this.dataView.beginUpdate();

      for (var i = 0; i < data.length; i++) {
        // Convert 2darray to dict.
        var item = {};
        for (var j = 1; j < this.grid_columns.length; j++) {
          item[this.grid_columns[j]['field']] = data[i][this.grid_columns[j]['pos']];
        }

        item[this.client_primary_key] = (this.client_primary_key_counter++).toString();
        this.dataView.addItem(item);
      }

      this.dataView.endUpdate();
    },

    /* This function is responsible to render output grid */
    grid_resize: function grid_resize(grid) {
      var h = $($('#editor-panel').find('.wcFrame')[1]).height() - 35;
      $('#datagrid').css({ 'height': h + 'px' });
      grid.resizeCanvas();
    },

    /* This function is responsible to create and render the
     * new backgrid for the history tab.
     */
    render_history_grid: function render_history_grid() {
      var self = this;

      self.history_collection = new HistoryBundle.HistoryCollection([]);

      var historyComponent;
      var historyCollectionReactElement = React.createElement(queryHistory.QueryHistory, {
        historyCollection: self.history_collection,
        ref: function ref(component) {
          historyComponent = component;
        }
      });
      ReactDOM.render(historyCollectionReactElement, $('#history_grid')[0]);

      self.history_panel.on(wcDocker.EVENT.VISIBILITY_CHANGED, function () {
        historyComponent.refocus();
      });
    },

    // Callback function for Add New Row button click.
    on_delete: function on_delete() {
      var self = this;

      // Trigger the addrow signal to the SqlEditorController class
      self.handler.trigger('pgadmin-sqleditor:button:deleterow', self, self.handler);
    },

    _stopEventPropogation: function _stopEventPropogation(ev) {
      ev = ev || window.event;
      ev.cancelBubble = true;
      ev.stopPropagation();
      ev.stopImmediatePropagation();
      ev.preventDefault();
    },

    _closeDropDown: function _closeDropDown(ev) {
      var target = ev && (ev.currentTarget || ev.target);
      if (target) {
        $(target).closest('.open').removeClass('open').find('.dropdown-backdrop').remove();
      }
    },

    // Callback function for Save button click.
    on_save: function on_save(ev) {
      var self = this;

      this._stopEventPropogation(ev);
      this._closeDropDown(ev);

      self.handler.close_on_save = false;
      // Trigger the save signal to the SqlEditorController class
      self.handler.trigger('pgadmin-sqleditor:button:save', self, self.handler);
    },

    // Callback function for Save button click.
    on_save_as: function on_save_as(ev) {
      var self = this;

      this._stopEventPropogation(ev);
      this._closeDropDown(ev);

      self.handler.close_on_save = false;
      // Trigger the save signal to the SqlEditorController class
      self.handler.trigger('pgadmin-sqleditor:button:save', self, self.handler, true);
    },

    // Callback function for the find button click.
    on_find: function on_find(ev) {
      var self = this,
          sql;
      this._stopEventPropogation(ev);
      this._closeDropDown(ev);

      self.query_tool_obj.execCommand("find");
    },

    // Callback function for the find next button click.
    on_find_next: function on_find_next(ev) {
      var self = this,
          sql;
      this._stopEventPropogation(ev);
      this._closeDropDown(ev);

      self.query_tool_obj.execCommand("findNext");
    },

    // Callback function for the find previous button click.
    on_find_previous: function on_find_previous(ev) {
      var self = this,
          sql;
      this._stopEventPropogation(ev);
      this._closeDropDown(ev);

      self.query_tool_obj.execCommand("findPrev");
    },

    // Callback function for the replace button click.
    on_replace: function on_replace(ev) {
      var self = this,
          sql;
      this._stopEventPropogation(ev);
      this._closeDropDown(ev);

      self.query_tool_obj.execCommand("replace");
    },

    // Callback function for the replace all button click.
    on_replace_all: function on_replace_all(ev) {
      var self = this,
          sql;
      this._stopEventPropogation(ev);
      this._closeDropDown(ev);

      self.query_tool_obj.execCommand("replaceAll");
    },

    // Callback function for the find persistent button click.
    on_find_persistent: function on_find_persistent(ev) {
      var self = this,
          sql;
      this._stopEventPropogation(ev);
      this._closeDropDown(ev);

      self.query_tool_obj.execCommand("findPersistent");
    },

    // Callback function for the jump button click.
    on_jump: function on_jump(ev) {
      var self = this,
          sql;
      this._stopEventPropogation(ev);
      this._closeDropDown(ev);

      self.query_tool_obj.execCommand("jumpToLine");
    },

    // Callback function for filter button click.
    on_show_filter: function on_show_filter() {
      var self = this;

      // Trigger the show_filter signal to the SqlEditorController class
      self.handler.trigger('pgadmin-sqleditor:button:show_filter', self, self.handler);
    },

    // Callback function for include filter button click.
    on_include_filter: function on_include_filter(ev) {
      var self = this;

      this._stopEventPropogation(ev);
      this._closeDropDown(ev);

      // Trigger the include_filter signal to the SqlEditorController class
      self.handler.trigger('pgadmin-sqleditor:button:include_filter', self, self.handler);
    },

    // Callback function for exclude filter button click.
    on_exclude_filter: function on_exclude_filter(ev) {
      var self = this;

      this._stopEventPropogation(ev);
      this._closeDropDown(ev);

      // Trigger the exclude_filter signal to the SqlEditorController class
      self.handler.trigger('pgadmin-sqleditor:button:exclude_filter', self, self.handler);
    },

    // Callback function for remove filter button click.
    on_remove_filter: function on_remove_filter(ev) {
      var self = this;

      this._stopEventPropogation(ev);
      this._closeDropDown(ev);

      // Trigger the remove_filter signal to the SqlEditorController class
      self.handler.trigger('pgadmin-sqleditor:button:remove_filter', self, self.handler);
    },

    // Callback function for ok button click.
    on_apply: function on_apply() {
      var self = this;

      // Trigger the apply_filter signal to the SqlEditorController class
      self.handler.trigger('pgadmin-sqleditor:button:apply_filter', self, self.handler);
    },

    // Callback function for cancel button click.
    on_cancel: function on_cancel() {
      $('#filter').addClass('hidden');
      $('#editor-panel').removeClass('sql-editor-busy-fetching');
    },

    // Callback function for copy button click.
    on_copy_row: function on_copy_row() {
      var self = this;

      // Trigger the copy signal to the SqlEditorController class
      self.handler.trigger('pgadmin-sqleditor:button:copy_row', self, self.handler);
    },

    // Callback function for paste button click.
    on_paste_row: function on_paste_row() {
      var self = this;

      // Trigger the paste signal to the SqlEditorController class
      self.handler.trigger('pgadmin-sqleditor:button:paste_row', self, self.handler);
    },

    // Callback function for the change event of combo box
    on_limit_change: function on_limit_change() {
      var self = this;

      // Trigger the limit signal to the SqlEditorController class
      self.handler.trigger('pgadmin-sqleditor:button:limit', self, self.handler);
    },

    // Callback function for the flash button click.
    on_flash: function on_flash() {
      queryToolActions.executeQuery(this.handler);
    },

    // Callback function for the cancel query button click.
    on_cancel_query: function on_cancel_query() {
      var self = this;

      // Trigger the cancel-query signal to the SqlEditorController class
      self.handler.trigger('pgadmin-sqleditor:button:cancel-query', self, self.handler);
    },

    // Callback function for the line comment code
    on_comment_line_code: function on_comment_line_code() {
      queryToolActions.commentLineCode(this.handler);
    },

    // Callback function for the line uncomment code
    on_uncomment_line_code: function on_uncomment_line_code() {
      queryToolActions.uncommentLineCode(this.handler);
    },

    // Callback function for the block comment/uncomment code
    on_toggle_comment_block_code: function on_toggle_comment_block_code() {
      queryToolActions.commentBlockCode(this.handler);
    },

    on_indent_code: function on_indent_code() {
      var self = this;
      // Trigger the comment signal to the SqlEditorController class
      self.handler.trigger('pgadmin-sqleditor:indent_selected_code', self, self.handler);
    },

    on_unindent_code: function on_unindent_code() {
      var self = this;
      // Trigger the comment signal to the SqlEditorController class
      self.handler.trigger('pgadmin-sqleditor:unindent_selected_code', self, self.handler);
    },

    // Callback function for the clear button click.
    on_clear: function on_clear(ev) {
      var self = this,
          sql;
      this._stopEventPropogation(ev);
      this._closeDropDown(ev);

      /* If is_query_changed flag is set to false then no need to
       * confirm with the user for unsaved changes.
       */
      if (self.handler.is_query_changed) {
        alertify.confirm(gettext("Unsaved changes"), gettext("Are you sure you wish to discard the current changes?"), function () {
          // Do nothing as user do not want to save, just continue
          self.query_tool_obj.setValue('');
        }, function () {
          return true;
        }).set('labels', { ok: 'Yes', cancel: 'No' });
      } else {
        self.query_tool_obj.setValue('');
      }
    },

    // Callback function for the clear history button click.
    on_clear_history: function on_clear_history(ev) {
      var self = this;
      this._stopEventPropogation(ev);
      this._closeDropDown(ev);
      // ask for confirmation only if anything to clear
      if (!self.history_collection.length()) {
        return;
      }

      alertify.confirm(gettext("Clear history"), gettext("Are you sure you wish to clear the history?"), function () {
        if (self.history_collection) {
          self.history_collection.reset();
        }
      }, function () {
        return true;
      }).set('labels', { ok: 'Yes', cancel: 'No' });
    },

    // Callback function for the auto commit button click.
    on_auto_commit: function on_auto_commit(ev) {
      var self = this;

      this._stopEventPropogation(ev);

      // Trigger the auto-commit signal to the SqlEditorController class
      self.handler.trigger('pgadmin-sqleditor:button:auto_commit', self, self.handler);
    },

    // Callback function for the auto rollback button click.
    on_auto_rollback: function on_auto_rollback(ev) {
      var self = this;

      this._stopEventPropogation(ev);

      // Trigger the download signal to the SqlEditorController class
      self.handler.trigger('pgadmin-sqleditor:button:auto_rollback', self, self.handler);
    },

    // Callback function for explain button click.
    on_explain: function on_explain(event) {
      this._stopEventPropogation(event);
      this._closeDropDown(event);

      queryToolActions.explain(this.handler);
    },

    // Callback function for explain analyze button click.
    on_explain_analyze: function on_explain_analyze(event) {
      this._stopEventPropogation(event);
      this._closeDropDown(event);

      queryToolActions.explainAnalyze(this.handler);
    },

    // Callback function for explain option "verbose" button click
    on_explain_verbose: function on_explain_verbose(ev) {
      var self = this;

      this._stopEventPropogation(ev);

      // Trigger the explain "verbose" signal to the SqlEditorController class
      self.handler.trigger('pgadmin-sqleditor:button:explain-verbose', self, self.handler);
    },

    // Callback function for explain option "costs" button click
    on_explain_costs: function on_explain_costs(ev) {
      var self = this;

      this._stopEventPropogation(ev);

      // Trigger the explain "costs" signal to the SqlEditorController class
      self.handler.trigger('pgadmin-sqleditor:button:explain-costs', self, self.handler);
    },

    // Callback function for explain option "buffers" button click
    on_explain_buffers: function on_explain_buffers(ev) {
      var self = this;

      this._stopEventPropogation(ev);

      // Trigger the explain "buffers" signal to the SqlEditorController class
      self.handler.trigger('pgadmin-sqleditor:button:explain-buffers', self, self.handler);
    },

    // Callback function for explain option "timing" button click
    on_explain_timing: function on_explain_timing(ev) {
      var self = this;

      this._stopEventPropogation(ev);

      // Trigger the explain "timing" signal to the SqlEditorController class
      self.handler.trigger('pgadmin-sqleditor:button:explain-timing', self, self.handler);
    },

    do_not_close_menu: function do_not_close_menu(ev) {
      ev.stopPropagation();
    },

    // callback function for load file button click.
    on_file_load: function on_file_load(ev) {
      var self = this;

      this._stopEventPropogation(ev);
      this._closeDropDown(ev);

      // Trigger the save signal to the SqlEditorController class
      self.handler.trigger('pgadmin-sqleditor:button:load_file', self, self.handler);
    },

    on_download: function on_download() {
      queryToolActions.download(this.handler);
    },

    keyAction: function keyAction(event) {
      keyboardShortcuts.processEvent(this.handler, queryToolActions, event);
    }
  });

  /* Defining controller class for data grid, which actually
   * perform the operations like executing the sql query, poll the result,
   * render the data in the grid, Save/Refresh the data etc...
   */
  var SqlEditorController = function SqlEditorController(container, options) {
    this.initialize.apply(this, arguments);
  };

  _.extend(SqlEditorController.prototype, Backbone.Events, {
    initialize: function initialize(container, opts) {
      this.container = container;
    },

    /* This function is used to create instance of SQLEditorView,
     * call the render method of the grid view to render the backgrid
     * header and loading icon and start execution of the sql query.
     */
    start: function start(is_query_tool, editor_title, script_sql, is_new_browser_tab, server_type) {
      var self = this;

      self.is_query_tool = is_query_tool;
      self.rows_affected = 0;
      self.marked_line_no = 0;
      self.explain_verbose = false;
      self.explain_costs = false;
      self.explain_buffers = false;
      self.explain_timing = false;
      self.is_new_browser_tab = is_new_browser_tab;
      self.has_more_rows = false;
      self.fetching_rows = false;
      self.close_on_save = false;
      self.server_type = server_type;

      // We do not allow to call the start multiple times.
      if (self.gridView) return;

      self.gridView = new SQLEditorView({
        el: self.container,
        handler: self
      });
      self.transId = self.gridView.transId = self.container.data('transId');

      self.gridView.editor_title = _.unescape(editor_title);
      self.gridView.current_file = undefined;

      // Render the header
      self.gridView.render();

      // Listen to the file manager button events
      pgAdmin.Browser.Events.on('pgadmin-storage:finish_btn:select_file', self._select_file_handler, self);
      pgAdmin.Browser.Events.on('pgadmin-storage:finish_btn:create_file', self._save_file_handler, self);

      // Listen to the codemirror on text change event
      // only in query editor tool
      if (self.is_query_tool) {
        self.get_preferences();
        self.gridView.query_tool_obj.on('change', self._on_query_change.bind(self));
      }

      // Listen on events come from SQLEditorView for the button clicked.
      self.on('pgadmin-sqleditor:button:load_file', self._load_file, self);
      self.on('pgadmin-sqleditor:button:save', self._save, self);
      self.on('pgadmin-sqleditor:button:deleterow', self._delete, self);
      self.on('pgadmin-sqleditor:button:show_filter', self._show_filter, self);
      self.on('pgadmin-sqleditor:button:include_filter', self._include_filter, self);
      self.on('pgadmin-sqleditor:button:exclude_filter', self._exclude_filter, self);
      self.on('pgadmin-sqleditor:button:remove_filter', self._remove_filter, self);
      self.on('pgadmin-sqleditor:button:apply_filter', self._apply_filter, self);
      self.on('pgadmin-sqleditor:button:copy_row', self._copy_row, self);
      self.on('pgadmin-sqleditor:button:paste_row', self._paste_row, self);
      self.on('pgadmin-sqleditor:button:limit', self._set_limit, self);
      self.on('pgadmin-sqleditor:button:cancel-query', self._cancel_query, self);
      self.on('pgadmin-sqleditor:button:auto_rollback', self._auto_rollback, self);
      self.on('pgadmin-sqleditor:button:auto_commit', self._auto_commit, self);
      self.on('pgadmin-sqleditor:button:explain-verbose', self._explain_verbose, self);
      self.on('pgadmin-sqleditor:button:explain-costs', self._explain_costs, self);
      self.on('pgadmin-sqleditor:button:explain-buffers', self._explain_buffers, self);
      self.on('pgadmin-sqleditor:button:explain-timing', self._explain_timing, self);
      // Indentation related
      self.on('pgadmin-sqleditor:indent_selected_code', self._indent_selected_code, self);
      self.on('pgadmin-sqleditor:unindent_selected_code', self._unindent_selected_code, self);

      if (self.is_query_tool) {
        self.gridView.query_tool_obj.refresh();
        if (script_sql && script_sql !== '') {
          self.gridView.query_tool_obj.setValue(script_sql);
        }
      } else {
        // Disable codemirror by setting cursor to nocursor and background to dark.
        self.gridView.query_tool_obj.setOption("readOnly", 'nocursor');
        var cm = self.gridView.query_tool_obj.getWrapperElement();
        if (cm) {
          cm.className += ' bg-gray-1 opacity-5';
        }
        self.disable_tool_buttons(true);
        self.execute_data_query();
      }
    },

    // This function checks if there is any dirty data in the grid before
    // it executes the sql query
    execute_data_query: function execute_data_query() {
      var self = this;

      // Check if the data grid has any changes before running query
      if (_.has(self, 'data_store') && (_.size(self.data_store.added) || _.size(self.data_store.updated) || _.size(self.data_store.deleted))) {
        alertify.confirm(gettext("Unsaved changes"), gettext("The data has been modified, but not saved. Are you sure you wish to discard the changes?"), function () {
          // Do nothing as user do not want to save, just continue
          self._run_query();
        }, function () {
          // Stop, User wants to save
          return true;
        }).set('labels', { ok: 'Yes', cancel: 'No' });
      } else {
        self._run_query();
      }
    },

    // This function makes the ajax call to execute the sql query.
    _run_query: function _run_query() {
      var self = this;
      self.query_start_time = new Date();
      self.rows_affected = 0;
      self._init_polling_flags();
      // keep track of newly added rows
      self.rows_to_disable = new Array();
      // Temporarily hold new rows added
      self.temp_new_rows = new Array();
      self.has_more_rows = false;
      self.fetching_rows = false;

      self.trigger('pgadmin-sqleditor:loading-icon:show', gettext("Initializing query execution."));

      $("#btn-flash").prop('disabled', true);

      self.trigger('pgadmin-sqleditor:loading-icon:message', gettext("Waiting for the query execution to complete..."));

      $.ajax({
        url: url_for('sqleditor.view_data_start', { 'trans_id': self.transId }),
        method: 'GET',
        success: function success(res) {
          if (res.data.status) {

            self.can_edit = res.data.can_edit;
            self.can_filter = res.data.can_filter;
            self.info_notifier_timeout = res.data.info_notifier_timeout;

            // Set the sql query to the SQL panel
            self.gridView.query_tool_obj.setValue(res.data.sql);
            self.query = res.data.sql;

            /* If filter is applied then remove class 'btn-default'
             * and add 'btn-warning' to change the colour of the button.
             */
            if (self.can_filter && res.data.filter_applied) {
              $('#btn-filter').removeClass('btn-default');
              $('#btn-filter-dropdown').removeClass('btn-default');
              $('#btn-filter').addClass('btn-warning');
              $('#btn-filter-dropdown').addClass('btn-warning');
            } else {
              $('#btn-filter').removeClass('btn-warning');
              $('#btn-filter-dropdown').removeClass('btn-warning');
              $('#btn-filter').addClass('btn-default');
              $('#btn-filter-dropdown').addClass('btn-default');
            }
            $("#btn-save").prop('disabled', true);
            $("#btn-file-menu-dropdown").prop('disabled', true);
            $("#btn-copy-row").prop('disabled', true);
            $("#btn-paste-row").prop('disabled', true);

            // Set the combo box value
            $(".limit").val(res.data.limit);

            // If status is True then poll the result.
            self._poll();
          } else {
            self.trigger('pgadmin-sqleditor:loading-icon:hide');
            self.update_msg_history(false, res.data.result);
          }
        },
        error: function error(e) {
          self.trigger('pgadmin-sqleditor:loading-icon:hide');
          if (e.readyState == 0) {
            self.update_msg_history(false, gettext("Not connected to the server or the connection to the server has been closed."));
            return;
          }

          var msg = e.responseText;
          if (e.responseJSON != undefined && e.responseJSON.errormsg != undefined) msg = e.responseJSON.errormsg;

          self.update_msg_history(false, msg);
        }
      });
    },

    // This is a wrapper to call_render function
    // We need this because we have separated columns route & result route
    // We need to combine both result here in wrapper before rendering grid
    call_render_after_poll: function call_render_after_poll(res) {
      var self = this;
      self.query_end_time = new Date();
      self.rows_affected = res.rows_affected, self.has_more_rows = res.has_more_rows;

      /* If no column information is available it means query
         runs successfully with no result to display. In this
         case no need to call render function.
      */
      if (res.colinfo != null) self._render(res);else {
        // Show message in message and history tab in case of query tool
        self.total_time = self.get_query_run_time(self.query_start_time, self.query_end_time);
        var msg = S(gettext("Query returned successfully in %s.")).sprintf(self.total_time).value();
        res.result += "\n\n" + msg;
        self.update_msg_history(true, res.result, false);
        // Display the notifier if the timeout is set to >= 0
        if (self.info_notifier_timeout >= 0) {
          alertify.success(msg, self.info_notifier_timeout);
        }
      }

      // Enable/Disable query tool button only if is_query_tool is true.
      if (self.is_query_tool) {
        self.disable_tool_buttons(false);
        $("#btn-cancel-query").prop('disabled', true);
      }
      is_query_running = false;
      self.trigger('pgadmin-sqleditor:loading-icon:hide');
    },

    /* This function makes the ajax call to poll the result,
     * if status is Busy then recursively call the poll function
     * till the status is 'Success' or 'NotConnected'. If status is
     * 'Success' then call the render method to render the data.
     */
    _poll: function _poll() {
      var self = this;

      setTimeout(function () {
        $.ajax({
          url: url_for('sqleditor.poll', { 'trans_id': self.transId }),
          method: 'GET',
          success: function success(res) {
            if (res.data.status === 'Success') {
              self.trigger('pgadmin-sqleditor:loading-icon:message', gettext("Loading data from the database server and rendering..."));

              self.call_render_after_poll(res.data);
            } else if (res.data.status === 'Busy') {
              // If status is Busy then poll the result by recursive call to the poll function
              self._poll();
              is_query_running = true;
              if (res.data.result) {
                self.update_msg_history(res.data.status, res.data.result, false);
              }
            } else if (res.data.status === 'NotConnected') {
              self.trigger('pgadmin-sqleditor:loading-icon:hide');
              // Enable/Disable query tool button only if is_query_tool is true.
              if (self.is_query_tool) {
                self.disable_tool_buttons(false);
                $("#btn-cancel-query").prop('disabled', true);
              }
              self.update_msg_history(false, res.data.result, true);
            } else if (res.data.status === 'Cancel') {
              self.trigger('pgadmin-sqleditor:loading-icon:hide');
              self.update_msg_history(false, "Execution Cancelled!", true);
            }
          },
          error: function error(e) {
            // Enable/Disable query tool button only if is_query_tool is true.
            self.resetQueryHistoryObject(self);
            self.trigger('pgadmin-sqleditor:loading-icon:hide');
            if (self.is_query_tool) {
              self.disable_tool_buttons(false);
              $("#btn-cancel-query").prop('disabled', true);
            }

            if (e.readyState == 0) {
              self.update_msg_history(false, gettext("Not connected to the server or the connection to the server has been closed."));
              return;
            }

            var msg = e.responseText;
            if (e.responseJSON != undefined && e.responseJSON.errormsg != undefined) msg = e.responseJSON.errormsg;

            self.update_msg_history(false, msg);
            // Highlight the error in the sql panel
            self._highlight_error(msg);
          }
        });
      }, self.POLL_FALLBACK_TIME());
    },

    /* This function is used to create the backgrid columns,
     * create the Backbone PageableCollection and finally render
     * the data in the backgrid.
     */
    _render: function _render(data) {
      var self = this;
      self.colinfo = data.col_info;
      self.primary_keys = data.primary_keys;
      self.client_primary_key = data.client_primary_key;
      self.cell_selected = false;
      self.selected_model = null;
      self.changedModels = [];
      $('.sql-editor-explain').empty();

      /* If object don't have primary keys then set the
       * can_edit flag to false.
       */
      if (self.primary_keys === null || self.primary_keys === undefined || _.size(self.primary_keys) === 0) self.can_edit = false;else self.can_edit = true;

      /* If user can filter the data then we should enabled
       * Filter and Limit buttons.
       */
      if (self.can_filter) {
        $(".limit").prop('disabled', false);
        $(".limit").addClass('limit-enabled');
        $("#btn-filter").prop('disabled', false);
        $("#btn-filter-dropdown").prop('disabled', false);
      }

      // Initial settings for delete row, copy row and paste row buttons.
      $("#btn-delete-row").prop('disabled', true);
      // Do not disable save button in query tool
      if (!self.is_query_tool && !self.can_edit) {
        $("#btn-save").prop('disabled', true);
        $("#btn-file-menu-dropdown").prop('disabled', true);
      }
      if (!self.can_edit) {
        $("#btn-delete-row").prop('disabled', true);
        $("#btn-copy-row").prop('disabled', true);
        $("#btn-paste-row").prop('disabled', true);
      }

      // Fetch the columns metadata
      self._fetch_column_metadata.call(self, data, function () {
        var self = this;

        self.trigger('pgadmin-sqleditor:loading-icon:message', gettext("Loading data from the database server and rendering..."), self);

        // Show message in message and history tab in case of query tool
        self.total_time = self.get_query_run_time(self.query_start_time, self.query_end_time);
        var msg1 = S(gettext("Successfully run. Total query runtime: %s.")).sprintf(self.total_time).value();
        var msg2 = S(gettext("%s rows affected.")).sprintf(self.rows_affected).value();

        // Display the notifier if the timeout is set to >= 0
        if (self.info_notifier_timeout >= 0) {
          alertify.success(msg1 + ' ' + msg2, self.info_notifier_timeout);
        }

        var _msg = msg1 + '\n' + msg2;

        // If there is additional messages from server then add it to message
        if (!_.isNull(data.additional_messages) && !_.isUndefined(data.additional_messages)) {
          _msg = data.additional_messages + '\n' + _msg;
        }

        self.update_msg_history(true, _msg, false);

        /* Add the data to the collection and render the grid.
         * In case of Explain draw the graph on explain panel
         * and add json formatted data to collection and render.
         */
        var explain_data_array = [];
        if (data.result && data.result.length >= 1 && data.result[0] && data.result[0][0] && data.result[0][0][0] && data.result[0][0][0].hasOwnProperty('Plan') && _.isObject(data.result[0][0][0]['Plan'])) {
          var explain_data = [JSON.stringify(data.result[0][0], null, 2)];
          explain_data_array.push(explain_data);
          // Make sure - the 'Data Output' panel is visible, before - we
          // start rendering the grid.
          self.gridView.data_output_panel.focus();
          setTimeout(function () {
            self.gridView.render_grid(explain_data_array, self.columns, self.can_edit, self.client_primary_key);
            // Make sure - the 'Explain' panel is visible, before - we
            // start rendering the grid.
            self.gridView.explain_panel.focus();
            pgExplain.DrawJSONPlan($('.sql-editor-explain'), data.result[0][0]);
          }, 10);
        } else {
          // Make sure - the 'Data Output' panel is visible, before - we
          // start rendering the grid.
          self.gridView.data_output_panel.focus();
          setTimeout(function () {
            self.gridView.render_grid(data.result, self.columns, self.can_edit, self.client_primary_key, data.rows_affected);
          }, 10);
        }

        // Hide the loading icon
        self.trigger('pgadmin-sqleditor:loading-icon:hide');
        $("#btn-flash").prop('disabled', false);
      }.bind(self));
    },

    // This function creates the columns as required by the backgrid
    _fetch_column_metadata: function _fetch_column_metadata(data, cb) {
      var colinfo = data.colinfo,
          primary_keys = data.primary_keys,
          result = data.result,
          columns = [],
          self = this;
      // Store pg_types in an array
      var pg_types = new Array();
      _.each(data.types, function (r) {
        pg_types[r.oid] = [r.typname];
      });

      // Create columns required by slick grid to render
      _.each(colinfo, function (c) {
        var is_primary_key = false;

        // Check whether table have primary key
        if (_.size(primary_keys) > 0) {
          _.each(primary_keys, function (value, key) {
            if (key === c.name) is_primary_key = true;
          });
        }

        // To show column label and data type in multiline,
        // The elements should be put inside the div.
        // Create column label and type.
        var col_type = '',
            column_label = '',
            col_cell;
        var type = pg_types[c.type_code] ? pg_types[c.type_code][0] :
        // This is the case where user might
        // have use casting so we will use type
        // returned by cast function
        pg_types[pg_types.length - 1][0] ? pg_types[pg_types.length - 1][0] : 'unknown';

        if (!is_primary_key) col_type += type;else col_type += '[PK] ' + type;

        if (c.precision && c.precision >= 0 && c.precision != 65535) {
          col_type += ' (' + c.precision;
          col_type += c.scale && c.scale != 65535 ? ',' + c.scale + ')' : ')';
        }

        // Identify cell type of column.
        switch (type) {
          case "json":
          case "json[]":
          case "jsonb":
          case "jsonb[]":
            col_cell = 'Json';
            break;
          case "smallint":
          case "integer":
          case "bigint":
          case "decimal":
          case "numeric":
          case "real":
          case "double precision":
            col_cell = 'number';
            break;
          case "boolean":
            col_cell = 'boolean';
            break;
          case "character":
          case "character[]":
          case "character varying":
          case "character varying[]":
            if (c.internal_size && c.internal_size >= 0 && c.internal_size != 65535) {
              // Update column type to display length on column header
              col_type += ' (' + c.internal_size + ')';
            }
            col_cell = 'string';
            break;
          default:
            col_cell = 'string';
        }

        column_label = c.display_name + '<br>' + col_type;

        var col = {
          'name': c.name,
          'display_name': c.display_name,
          'column_type': col_type,
          'column_type_internal': type,
          'pos': c.pos,
          'label': column_label,
          'cell': col_cell,
          'can_edit': self.can_edit,
          'type': type,
          'not_null': c.not_null,
          'has_default_val': c.has_default_val
        };
        columns.push(col);
      });

      self.columns = columns;
      if (cb && typeof cb == 'function') {
        cb();
      }
    },

    resetQueryHistoryObject: function resetQueryHistoryObject(history) {
      history.total_time = '-';
    },

    // This function is used to raise appropriate message.
    update_msg_history: function update_msg_history(status, msg, clear_grid) {
      var self = this;
      if (clear_grid === undefined) clear_grid = true;

      self.gridView.messages_panel.focus();

      if (clear_grid) {
        // Delete grid
        if (self.gridView.handler.slickgrid) {
          self.gridView.handler.slickgrid.destroy();
        }
        // Misc cleaning
        self.columns = undefined;
        self.collection = undefined;

        $('.sql-editor-message').text(msg);
      } else {
        $('.sql-editor-message').append(_.escape(msg));
      }

      // Scroll automatically when msgs appends to element
      setTimeout(function () {
        $(".sql-editor-message").scrollTop($(".sql-editor-message")[0].scrollHeight);
        ;
      }, 10);

      if (status != 'Busy') {
        $("#btn-flash").prop('disabled', false);
        self.trigger('pgadmin-sqleditor:loading-icon:hide');
        self.gridView.history_collection.add({
          'status': status,
          'start_time': self.query_start_time,
          'query': self.query,
          'row_affected': self.rows_affected,
          'total_time': self.total_time,
          'message': msg
        });
      }
    },

    // This function will return the total query execution Time.
    get_query_run_time: function get_query_run_time(start_time, end_time) {
      var self = this;

      // Calculate the difference in milliseconds
      var difference_ms, miliseconds;
      difference_ms = miliseconds = end_time.getTime() - start_time.getTime();
      //take out milliseconds
      difference_ms = difference_ms / 1000;
      var seconds = Math.floor(difference_ms % 60);
      difference_ms = difference_ms / 60;
      var minutes = Math.floor(difference_ms % 60);

      if (minutes > 0) return minutes + ' min';else if (seconds > 0) {
        return seconds + ' secs';
      } else return miliseconds + ' msec';
    },

    /* This function is used to check whether cell
     * is editable or not depending on primary keys
     * and staged_rows flag
     */
    is_editable: function is_editable(obj) {
      var self = this;
      if (obj instanceof Backbone.Collection) return false;
      return self.get('can_edit');
    },

    rows_to_delete: function rows_to_delete(data) {
      var self = this,
          tmp_keys = self.primary_keys;

      // re-calculate rows with no primary keys
      self.temp_new_rows = [];
      data.forEach(function (d, idx) {
        var p_keys_list = _.pick(d, tmp_keys),
            is_primary_key = Object.keys(p_keys_list).length ? p_keys_list[0] : undefined;

        if (!is_primary_key) {
          self.temp_new_rows.push(idx);
        }
      });
      self.rows_to_disable = _.clone(self.temp_new_rows);
    },

    // This function will delete selected row.
    _delete: function _delete() {
      var self = this,
          deleted_keys = [],
          dgrid = document.getElementById("datagrid"),
          is_added = _.size(self.data_store.added),
          is_updated = _.size(self.data_store.updated);

      // Remove newly added rows from staged rows as we don't want to send them on server
      if (is_added) {
        _.each(self.data_store.added, function (val, key) {
          if (key in self.data_store.staged_rows) {
            // Remove the row from data store so that we do not send it on server
            deleted_keys.push(key);
            delete self.data_store.staged_rows[key];
            delete self.data_store.added[key];
            delete self.data_store.added_index[key];
          }
        });
      }
      // If only newly rows to delete and no data is there to send on server
      // then just re-render the grid
      if (_.size(self.data_store.staged_rows) == 0) {
        var grid = self.slickgrid,
            dataView = grid.getData(),
            data = dataView.getItems(),
            idx = 0;

        grid.resetActiveCell();

        dataView.beginUpdate();
        for (var i = 0; i < deleted_keys.length; i++) {
          dataView.deleteItem(deleted_keys[i]);
        }
        dataView.endUpdate();
        self.rows_to_delete.apply(self, [dataView.getItems()]);
        grid.resetActiveCell();
        grid.setSelectedRows([]);
        grid.invalidate();

        // Nothing to copy or delete here
        $("#btn-delete-row").prop('disabled', true);
        $("#btn-copy-row").prop('disabled', true);
        if (_.size(self.data_store.added) || is_updated) {
          // Do not disable save button if there are
          // any other changes present in grid data
          $("#btn-save").prop('disabled', false);
        } else {
          $("#btn-save").prop('disabled', true);
        }
        alertify.success(gettext("Row(s) deleted"));
      } else {
        // There are other data to needs to be updated on server
        if (is_updated) {
          alertify.alert(gettext("Operation failed"), gettext("There are unsaved changes in grid, Please save them first to avoid inconsistency in data"));
          return;
        }
        alertify.confirm(gettext("Delete Row(s)"), gettext("Are you sure you wish to delete selected row(s)?"), function () {
          $("#btn-delete-row").prop('disabled', true);
          $("#btn-copy-row").prop('disabled', true);
          // Change the state
          self.data_store.deleted = self.data_store.staged_rows;
          self.data_store.staged_rows = {};
          // Save the changes on server
          self._save();
        }, function () {
          // Do nothing as user canceled the operation.
        }).set('labels', { ok: gettext("Yes"), cancel: gettext("No") });
      }
    },

    /* This function will fetch the list of changed models and make
     * the ajax call to save the data into the database server.
     * and will open save file dialog conditionally.
     */
    _save: function _save(view, controller, save_as) {
      var self = this,
          data = [],
          save_data = true;

      // Open save file dialog if query tool
      if (self.is_query_tool) {
        var current_file = self.gridView.current_file;
        if (!_.isUndefined(current_file) && !save_as) {
          self._save_file_handler(current_file);
        } else {
          // provide custom option to save file dialog
          var params = {
            'supported_types': ["*", "sql"],
            'dialog_type': 'create_file',
            'dialog_title': 'Save File',
            'btn_primary': 'Save'
          };
          pgAdmin.FileManager.init();
          pgAdmin.FileManager.show_dialog(params);
        }
        return;
      }
      $("#btn-save").prop('disabled', true);
      $("#btn-file-menu-dropdown").prop('disabled', true);

      var is_added = _.size(self.data_store.added),
          is_updated = _.size(self.data_store.updated),
          is_deleted = _.size(self.data_store.deleted),
          is_primary_error = false;

      if (!is_added && !is_updated && !is_deleted) {
        return; // Nothing to save here
      }

      if (save_data) {

        self.trigger('pgadmin-sqleditor:loading-icon:show', gettext("Saving the updated data..."));

        // Add the columns to the data so the server can remap the data
        var req_data = self.data_store;
        req_data.columns = view ? view.handler.columns : self.columns;

        // Make ajax call to save the data
        $.ajax({
          url: url_for('sqleditor.save', { 'trans_id': self.transId }),
          method: 'POST',
          contentType: "application/json",
          data: JSON.stringify(req_data),
          success: function success(res) {
            var grid = self.slickgrid,
                dataView = grid.getData(),
                data_length = dataView.getLength(),
                data = [];
            if (res.data.status) {
              // Remove flag is_row_copied from copied rows
              _.each(data, function (row, idx) {
                if (row.is_row_copied) {
                  delete row.is_row_copied;
                }
              });

              // Remove 2d copied_rows array
              if (grid.copied_rows) {
                delete grid.copied_rows;
              }

              // Remove deleted rows from client as well
              if (is_deleted) {
                var rows = grid.getSelectedRows();
                if (data_length == rows.length) {
                  // This means all the rows are selected, clear all data
                  data = [];
                  dataView.setItems(data, self.client_primary_key);
                } else {
                  dataView.beginUpdate();
                  for (var i = 0; i < rows.length; i++) {
                    var item = grid.getDataItem(rows[i]);
                    data.push(item);
                    dataView.deleteItem(item[self.client_primary_key]);
                  }
                  dataView.endUpdate();
                }
                self.rows_to_delete.apply(self, [data]);
                grid.setSelectedRows([]);
              }

              // whether a cell is editable or not is decided in
              // grid.onBeforeEditCell function (on cell click)
              // but this function should do its job after save
              // operation. So assign list of added rows to original
              // rows_to_disable array.
              if (is_added) {
                self.rows_to_disable = _.clone(self.temp_new_rows);
              }

              grid.setSelectedRows([]);
              // Reset data store
              self.data_store = {
                'added': {},
                'updated': {},
                'deleted': {},
                'added_index': {},
                'updated_index': {}

                // Reset old primary key data now
              };self.primary_keys_data = {};

              // Clear msgs after successful save
              $('.sql-editor-message').html('');
            } else {
              // Something went wrong while saving data on the db server
              $("#btn-flash").prop('disabled', false);
              $('.sql-editor-message').text(res.data.result);
              var err_msg = S(gettext("%s.")).sprintf(res.data.result).value();
              alertify.error(err_msg, 20);
              grid.setSelectedRows([]);
              // To highlight the row at fault
              if (_.has(res.data, '_rowid') && (!_.isUndefined(res.data._rowid) || !_.isNull(res.data._rowid))) {
                var _row_index = self._find_rowindex(res.data._rowid);
                if (_row_index in self.data_store.added_index) {
                  // Remove new row index from temp_list if save operation
                  // fails
                  var index = self.handler.temp_new_rows.indexOf(res.data._rowid);
                  if (index > -1) {
                    self.handler.temp_new_rows.splice(index, 1);
                  }
                  self.data_store.added[self.data_store.added_index[_row_index]].err = true;
                } else if (_row_index in self.data_store.updated_index) {
                  self.data_store.updated[self.data_store.updated_index[_row_index]].err = true;
                }
              }
              grid.gotoCell(_row_index, 1);
            }

            // Update the sql results in history tab
            _.each(res.data.query_result, function (r) {
              self.gridView.history_collection.add({
                'status': r.status,
                'start_time': self.query_start_time,
                'query': r.sql,
                'row_affected': r.rows_affected,
                'total_time': self.total_time,
                'message': r.result
              });
            });
            self.trigger('pgadmin-sqleditor:loading-icon:hide');

            grid.invalidate();
            alertify.success(gettext("Data saved successfully."));
            if (self.close_on_save) {
              self.close();
            }
          },
          error: function error(e) {
            if (e.readyState == 0) {
              self.update_msg_history(false, gettext("Not connected to the server or the connection to the server has been closed."));
              return;
            }

            var msg = e.responseText;
            if (e.responseJSON != undefined && e.responseJSON.errormsg != undefined) msg = e.responseJSON.errormsg;

            self.update_msg_history(false, msg);
          }
        });
      }
    },

    // Find index of row at fault from grid data
    _find_rowindex: function _find_rowindex(rowid) {
      var self = this,
          grid = self.slickgrid,
          dataView = grid.getData(),
          data = dataView.getItems(),
          _rowid,
          count = 0,
          _idx = -1;

      // If _rowid is object then it's update/delete operation
      if (_.isObject(rowid)) {
        _rowid = rowid;
      } else if (_.isString(rowid)) {
        // Insert operation
        var rowid = {};
        rowid[self.client_primary_key] = rowid;
        _rowid = rowid;
      } else {
        // Something is wrong with unique id
        return _idx;
      }

      _.find(data, function (d) {
        // search for unique id in row data if found than its the row
        // which error out on server side
        var tmp = []; //_.findWhere needs array of object to work
        tmp.push(d);
        if (_.findWhere(tmp, _rowid)) {
          _idx = count;
          // Now exit the loop by returning true
          return true;
        }
        count++;
      });

      // Not able to find in grid Data
      return _idx;
    },

    // Save as
    _save_as: function _save_as() {
      return this._save(true);
    },

    // Set panel title.
    setTitle: function setTitle(title) {
      var self = this;

      if (self.is_new_browser_tab) {
        window.document.title = title;
      } else {
        _.each(window.top.pgAdmin.Browser.docker.findPanels('frm_datagrid'), function (p) {
          if (p.isVisible()) {
            p.title(decodeURIComponent(title));
          }
        });
      }
    },

    // load select file dialog
    _load_file: function _load_file() {
      var self = this;

      /* If is_query_changed flag is set to false then no need to
       * confirm with the user for unsaved changes.
       */
      if (self.is_query_changed) {
        alertify.confirm(gettext("Unsaved changes"), gettext("Are you sure you wish to discard the current changes?"), function () {
          // User do not want to save, just continue
          self._open_select_file_manager();
        }, function () {
          return true;
        }).set('labels', { ok: 'Yes', cancel: 'No' });
      } else {
        self._open_select_file_manager();
      }
    },

    // Open FileManager
    _open_select_file_manager: function _open_select_file_manager() {
      var params = {
        'supported_types': ["sql"], // file types allowed
        'dialog_type': 'select_file' // open select file dialog
      };
      pgAdmin.FileManager.init();
      pgAdmin.FileManager.show_dialog(params);
    },

    // read file data and return as response
    _select_file_handler: function _select_file_handler(e) {
      var self = this,
          data = {
        'file_name': decodeURI(e)
      };

      self.trigger('pgadmin-sqleditor:loading-icon:show', gettext("Loading the file..."));
      // set cursor to progress before file load
      var $busy_icon_div = $('.sql-editor-busy-fetching');
      $busy_icon_div.addClass('show_progress');

      // Make ajax call to load the data from file
      $.ajax({
        url: url_for('sqleditor.load_file'),
        method: 'POST',
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function success(res) {
          self.gridView.query_tool_obj.setValue(res);
          self.gridView.current_file = e;
          self.setTitle(self.gridView.current_file.split('\\').pop().split('/').pop());
          self.trigger('pgadmin-sqleditor:loading-icon:hide');
          // hide cursor
          $busy_icon_div.removeClass('show_progress');

          // disable save button on file save
          $("#btn-save").prop('disabled', true);
          $("#btn-file-menu-save").css('display', 'none');

          // Update the flag as new content is just loaded.
          self.is_query_changed = false;
        },
        error: function error(e) {
          var errmsg = $.parseJSON(e.responseText).errormsg;
          alertify.error(errmsg);
          self.trigger('pgadmin-sqleditor:loading-icon:hide');
          // hide cursor
          $busy_icon_div.removeClass('show_progress');
        }
      });
    },

    // read data from codemirror and write to file
    _save_file_handler: function _save_file_handler(e) {
      var self = this,
          data = {
        'file_name': decodeURI(e),
        'file_content': self.gridView.query_tool_obj.getValue()
      };
      self.trigger('pgadmin-sqleditor:loading-icon:show', gettext("Saving the queries in the file..."));

      // Make ajax call to save the data to file
      $.ajax({
        url: url_for('sqleditor.save_file'),
        method: 'POST',
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function success(res) {
          if (res.data.status) {
            alertify.success(gettext("File saved successfully."));
            self.gridView.current_file = e;
            self.setTitle(self.gridView.current_file.replace(/^.*[\\\/]/g, ''));
            // disable save button on file save
            $("#btn-save").prop('disabled', true);
            $("#btn-file-menu-save").css('display', 'none');

            // Update the flag as query is already saved.
            self.is_query_changed = false;
          }
          self.trigger('pgadmin-sqleditor:loading-icon:hide');
          if (self.close_on_save) {
            self.close();
          }
        },
        error: function error(e) {
          self.trigger('pgadmin-sqleditor:loading-icon:hide');

          var errmsg = $.parseJSON(e.responseText).errormsg;
          setTimeout(function () {
            alertify.error(errmsg);
          }, 10);
        }
      });
    },

    // codemirror text change event
    _on_query_change: function _on_query_change(query_tool_obj) {
      var self = this;

      if (!self.is_query_changed) {
        // Update the flag as query is going to changed.
        self.is_query_changed = true;

        if (self.gridView.current_file) {
          var title = self.gridView.current_file.replace(/^.*[\\\/]/g, '') + ' *';
          self.setTitle(title);
        } else {
          var title = '';

          if (self.is_new_browser_tab) {
            title = window.document.title + ' *';
          } else {
            // Find the title of the visible panel
            _.each(window.top.pgAdmin.Browser.docker.findPanels('frm_datagrid'), function (p) {
              if (p.isVisible()) {
                self.gridView.panel_title = p._title;
              }
            });

            title = self.gridView.panel_title + ' *';
          }
          self.setTitle(title);
        }

        $("#btn-save").prop('disabled', false);
        $("#btn-file-menu-save").css('display', 'block');
        $("#btn-file-menu-dropdown").prop('disabled', false);
      }
    },

    // This function will set the required flag for polling response data
    _init_polling_flags: function _init_polling_flags() {
      var self = this;

      // To get a timeout for polling fallback timer in seconds in
      // regards to elapsed time
      self.POLL_FALLBACK_TIME = function () {
        var seconds = parseInt((Date.now() - self.query_start_time.getTime()) / 1000);
        // calculate & return fall back polling timeout
        if (seconds >= 10 && seconds < 30) {
          return 500;
        } else if (seconds >= 30 && seconds < 60) {
          return 1000;
        } else if (seconds >= 60 && seconds < 90) {
          return 2000;
        } else if (seconds >= 90) {
          return 5000;
        } else return 1;
      };
    },

    // This function will show the filter in the text area.
    _show_filter: function _show_filter() {
      var self = this;

      self.trigger('pgadmin-sqleditor:loading-icon:show', gettext("Loading the existing filter options..."));
      $.ajax({
        url: url_for('sqleditor.get_filter', { 'trans_id': self.transId }),
        method: 'GET',
        success: function success(res) {
          self.trigger('pgadmin-sqleditor:loading-icon:hide');
          if (res.data.status) {
            $('#filter').removeClass('hidden');
            $('#editor-panel').addClass('sql-editor-busy-fetching');
            self.gridView.filter_obj.refresh();

            if (res.data.result == null) self.gridView.filter_obj.setValue('');else self.gridView.filter_obj.setValue(res.data.result);
          } else {
            setTimeout(function () {
              alertify.alert('Get Filter Error', res.data.result);
            }, 10);
          }
        },
        error: function error(e) {
          self.trigger('pgadmin-sqleditor:loading-icon:hide');

          var msg;
          if (e.readyState == 0) {
            msg = gettext("Not connected to the server or the connection to the server has been closed.");
          } else {
            msg = e.responseText;
            if (e.responseJSON != undefined && e.responseJSON.errormsg != undefined) msg = e.responseJSON.errormsg;
          }
          setTimeout(function () {
            alertify.alert('Get Filter Error', msg);
          }, 10);
        }
      });
    },

    // This function will include the filter by selection.
    _include_filter: function _include_filter() {
      var self = this,
          data = {},
          grid,
          active_column,
          column_info,
          _values;

      grid = self.slickgrid;
      active_column = grid.getActiveCell();

      // If no cell is selected then return from the function
      if (_.isNull(active_column) || _.isUndefined(active_column)) return;

      column_info = grid.getColumns()[active_column.cell];

      // Fetch current row data from grid
      _values = grid.getDataItem(active_column.row, active_column.cell);
      if (_.isNull(_values) || _.isUndefined(_values)) return;

      // Add column position and it's value to data
      data[column_info.field] = _values[column_info.field] || '';

      self.trigger('pgadmin-sqleditor:loading-icon:show', gettext("Applying the new filter..."));

      // Make ajax call to include the filter by selection
      $.ajax({
        url: url_for('sqleditor.inclusive_filter', { 'trans_id': self.transId }),
        method: 'POST',
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function success(res) {
          self.trigger('pgadmin-sqleditor:loading-icon:hide');
          setTimeout(function () {
            if (res.data.status) {
              // Refresh the sql grid
              queryToolActions.executeQuery(self);
            } else {
              alertify.alert('Filter By Selection Error', res.data.result);
            }
          });
        },
        error: function error(e) {
          self.trigger('pgadmin-sqleditor:loading-icon:hide');
          setTimeout(function () {
            if (e.readyState == 0) {
              alertify.alert('Filter By Selection Error', gettext("Not connected to the server or the connection to the server has been closed."));
              return;
            }

            var msg = e.responseText;
            if (e.responseJSON != undefined && e.responseJSON.errormsg != undefined) msg = e.responseJSON.errormsg;

            alertify.alert('Filter By Selection Error', msg);
          }, 10);
        }
      });
    },

    // This function will exclude the filter by selection.
    _exclude_filter: function _exclude_filter() {
      var self = this,
          data = {},
          grid,
          active_column,
          column_info,
          _values;

      grid = self.slickgrid;
      active_column = grid.getActiveCell();

      // If no cell is selected then return from the function
      if (_.isNull(active_column) || _.isUndefined(active_column)) return;

      column_info = grid.getColumns()[active_column.cell];

      // Fetch current row data from grid
      _values = grid.getDataItem(active_column.row, active_column.cell);
      if (_.isNull(_values) || _.isUndefined(_values)) return;

      // Add column position and it's value to data
      data[column_info.field] = _values[column_info.field] || '';

      self.trigger('pgadmin-sqleditor:loading-icon:show', gettext("Applying the new filter..."));

      // Make ajax call to exclude the filter by selection.
      $.ajax({
        url: url_for('sqleditor.exclusive_filter', { 'trans_id': self.transId }),
        method: 'POST',
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function success(res) {
          self.trigger('pgadmin-sqleditor:loading-icon:hide');
          setTimeout(function () {
            if (res.data.status) {
              // Refresh the sql grid
              queryToolActions.executeQuery(self);
            } else {
              alertify.alert('Filter Exclude Selection Error', res.data.result);
            }
          }, 10);
        },
        error: function error(e) {
          self.trigger('pgadmin-sqleditor:loading-icon:hide');

          setTimeout(function () {
            if (e.readyState == 0) {
              alertify.alert('Filter Exclude Selection Error', gettext("Not connected to the server or the connection to the server has been closed."));
              return;
            }

            var msg = e.responseText;
            if (e.responseJSON != undefined && e.responseJSON.errormsg != undefined) msg = e.responseJSON.errormsg;

            alertify.alert('Filter Exclude Selection Error', msg);
          }, 10);
        }
      });
    },

    // This function will remove the filter.
    _remove_filter: function _remove_filter() {
      var self = this;

      self.trigger('pgadmin-sqleditor:loading-icon:show', gettext("Removing the filter..."));

      // Make ajax call to exclude the filter by selection.
      $.ajax({
        url: url_for('sqleditor.remove_filter', { 'trans_id': self.transId }),
        method: 'POST',
        success: function success(res) {
          self.trigger('pgadmin-sqleditor:loading-icon:hide');
          setTimeout(function () {
            if (res.data.status) {
              // Refresh the sql grid
              queryToolActions.executeQuery(self);
            } else {
              alertify.alert('Remove Filter Error', res.data.result);
            }
          });
        },
        error: function error(e) {
          self.trigger('pgadmin-sqleditor:loading-icon:hide');
          setTimeout(function () {
            if (e.readyState == 0) {
              alertify.alert('Remove Filter Error', gettext("Not connected to the server or the connection to the server has been closed."));
              return;
            }

            var msg = e.responseText;
            if (e.responseJSON != undefined && e.responseJSON.errormsg != undefined) msg = e.responseJSON.errormsg;

            alertify.alert('Remove Filter Error', msg);
          });
        }
      });
    },

    // This function will apply the filter.
    _apply_filter: function _apply_filter() {
      var self = this,
          sql = self.gridView.filter_obj.getValue();

      self.trigger('pgadmin-sqleditor:loading-icon:show', gettext("Applying the filter..."));

      // Make ajax call to include the filter by selection
      $.ajax({
        url: url_for('sqleditor.apply_filter', { 'trans_id': self.transId }),
        method: 'POST',
        contentType: "application/json",
        data: JSON.stringify(sql),
        success: function success(res) {
          self.trigger('pgadmin-sqleditor:loading-icon:hide');
          setTimeout(function () {
            if (res.data.status) {
              $('#filter').addClass('hidden');
              $('#editor-panel').removeClass('sql-editor-busy-fetching');
              // Refresh the sql grid
              queryToolActions.executeQuery(self);
            } else {
              alertify.alert('Apply Filter Error', res.data.result);
            }
          }, 10);
        },
        error: function error(e) {
          self.trigger('pgadmin-sqleditor:loading-icon:hide');
          setTimeout(function () {
            if (e.readyState == 0) {
              alertify.alert('Apply Filter Error', gettext("Not connected to the server or the connection to the server has been closed."));
              return;
            }

            var msg = e.responseText;
            if (e.responseJSON != undefined && e.responseJSON.errormsg != undefined) msg = e.responseJSON.errormsg;

            alertify.alert('Apply Filter Error', msg);
          }, 10);
        }
      });
    },

    // This function will copy the selected row.
    _copy_row: copyData,

    // This function will paste the selected row.
    _paste_row: function _paste_row() {
      var self = this,
          col_info = {},
          grid = self.slickgrid,
          dataView = grid.getData(),
          data = dataView.getItems(),
          count = dataView.getLength(),
          rows = grid.getSelectedRows().sort(function (a, b) {
        return a - b;
      }),
          copied_rows = rows.map(function (rowIndex) {
        return data[rowIndex];
      });

      rows = rows.length == 0 ? self.last_copied_rows : rows;

      self.last_copied_rows = rows;

      // If there are rows to paste?
      if (copied_rows.length > 0) {
        // Enable save button so that user can
        // save newly pasted rows on server
        $("#btn-save").prop('disabled', false);

        var arr_to_object = function arr_to_object(arr) {
          var obj = {},
              count = (typeof arr === 'undefined' ? 'undefined' : _typeof(arr)) == 'object' ? Object.keys(arr).length : arr.length;

          _.each(arr, function (val, i) {
            if (arr[i] !== undefined) {
              if (_.isObject(arr[i])) {
                obj[String(i)] = JSON.stringify(arr[i]);
              } else {
                obj[String(i)] = arr[i];
              }
            }
          });
          return obj;
        };

        // Generate Unique key for each pasted row(s)
        // Convert array values to object to send to server
        // Add flag is_row_copied to handle [default] and [null]
        // for copied rows.
        // Add index of copied row into temp_new_rows
        // Trigger grid.onAddNewRow when a row is copied
        // Reset selection

        dataView.beginUpdate();
        _.each(copied_rows, function (row) {
          var new_row = arr_to_object(row),
              _key = (self.gridView.client_primary_key_counter++).toString();
          new_row.is_row_copied = true;
          self.temp_new_rows.push(count);
          new_row[self.client_primary_key] = _key;
          dataView.addItem(new_row);
          self.data_store.added[_key] = { 'err': false, 'data': new_row };
          self.data_store.added_index[count] = _key;
          count++;
        });
        dataView.endUpdate();
        grid.updateRowCount();
        // Pasted row/s always append so bring last row in view port.
        grid.scrollRowIntoView(dataView.getLength());
        grid.setSelectedRows([]);
      }
    },

    // This function will set the limit for SQL query
    _set_limit: function _set_limit() {
      var self = this,
          limit = parseInt($(".limit").val());

      self.trigger('pgadmin-sqleditor:loading-icon:show', gettext("Setting the limit on the result..."));
      // Make ajax call to change the limit
      $.ajax({
        url: url_for('sqleditor.set_limit', { 'trans_id': self.transId }),
        method: 'POST',
        contentType: "application/json",
        data: JSON.stringify(limit),
        success: function success(res) {
          self.trigger('pgadmin-sqleditor:loading-icon:hide');
          setTimeout(function () {
            if (res.data.status) {
              // Refresh the sql grid
              queryToolActions.executeQuery(self);
            } else alertify.alert('Change limit Error', res.data.result);
          }, 10);
        },
        error: function error(e) {
          self.trigger('pgadmin-sqleditor:loading-icon:hide');
          setTimeout(function () {
            if (e.readyState == 0) {
              alertify.alert('Change limit Error', gettext("Not connected to the server or the connection to the server has been closed."));
              return;
            }

            var msg = e.responseText;
            if (e.responseJSON != undefined && e.responseJSON.errormsg != undefined) msg = e.responseJSON.errormsg;

            alertify.alert('Change limit Error', msg);
          }, 10);
        }
      });
    },

    // This function is used to enable/disable buttons
    disable_tool_buttons: function disable_tool_buttons(disabled) {
      $("#btn-clear").prop('disabled', disabled);
      $("#btn-query-dropdown").prop('disabled', disabled);
      $("#btn-edit-dropdown").prop('disabled', disabled);
      $("#btn-edit").prop('disabled', disabled);
      $('#btn-load-file').prop('disabled', disabled);
    },

    // This function will fetch the sql query from the text box
    // and execute the query.
    execute: function execute(explain_prefix) {
      var self = this,
          sql = '',
          history_msg = '';

      self.has_more_rows = false;
      self.fetching_rows = false;

      /* If code is selected in the code mirror then execute
       * the selected part else execute the complete code.
       */
      var selected_code = self.gridView.query_tool_obj.getSelection();
      if (selected_code.length > 0) sql = selected_code;else sql = self.gridView.query_tool_obj.getValue();

      // If it is an empty query, do nothing.
      if (sql.length <= 0) return;

      self.trigger('pgadmin-sqleditor:loading-icon:show', gettext("Initializing the query execution!"));

      $("#btn-flash").prop('disabled', true);

      if (explain_prefix != undefined && !S.startsWith(sql.trim().toUpperCase(), "EXPLAIN")) {
        sql = explain_prefix + ' ' + sql;
      }

      self.query_start_time = new Date();
      self.query = sql;
      self.rows_affected = 0;
      self._init_polling_flags();
      self.disable_tool_buttons(true);
      $("#btn-cancel-query").prop('disabled', false);

      $.ajax({
        url: url_for('sqleditor.query_tool_start', { 'trans_id': self.transId }),
        method: 'POST',
        contentType: "application/json",
        data: JSON.stringify(sql),
        success: function success(res) {
          // Remove marker
          if (self.gridView.marker) {
            self.gridView.marker.clear();
            delete self.gridView.marker;
            self.gridView.marker = null;

            // Remove already existing marker
            self.gridView.query_tool_obj.removeLineClass(self.marked_line_no, 'wrap', 'CodeMirror-activeline-background');
          }

          if (res.data.status) {
            self.trigger('pgadmin-sqleditor:loading-icon:message', gettext("Waiting for the query execution to complete..."));

            self.can_edit = res.data.can_edit;
            self.can_filter = res.data.can_filter;
            self.info_notifier_timeout = res.data.info_notifier_timeout;

            // If status is True then poll the result.
            self._poll();
          } else {
            self.trigger('pgadmin-sqleditor:loading-icon:hide');
            self.disable_tool_buttons(false);
            $("#btn-cancel-query").prop('disabled', true);
            self.update_msg_history(false, res.data.result);

            // Highlight the error in the sql panel
            self._highlight_error(res.data.result);
          }
        },
        error: function error(e) {
          self.trigger('pgadmin-sqleditor:loading-icon:hide');
          self.disable_tool_buttons(false);
          $("#btn-cancel-query").prop('disabled', true);

          if (e.readyState == 0) {
            self.update_msg_history(false, gettext("Not connected to the server or the connection to the server has been closed."));
            return;
          }

          var msg = e.responseText;
          if (e.responseJSON != undefined && e.responseJSON.errormsg != undefined) msg = e.responseJSON.errormsg;

          self.update_msg_history(false, msg);
        }
      });
    },

    /* This function is used to highlight the error line and
     * underlining for the error word.
     */
    _highlight_error: function _highlight_error(result) {
      var self = this,
          error_line_no = 0,
          start_marker = 0,
          end_marker = 0,
          selected_line_no = 0;

      // Remove already existing marker
      self.gridView.query_tool_obj.removeLineClass(self.marked_line_no, 'wrap', 'CodeMirror-activeline-background');

      // In case of selection we need to find the actual line no
      if (self.gridView.query_tool_obj.getSelection().length > 0) selected_line_no = self.gridView.query_tool_obj.getCursor(true).line;

      // Fetch the LINE string using regex from the result
      var line = /LINE (\d+)/.exec(result),

      // Fetch the Character string using regex from the result
      char = /Character: (\d+)/.exec(result);

      // If line and character is null then no need to mark
      if (line != null && char != null) {
        error_line_no = self.marked_line_no = parseInt(line[1]) - 1 + selected_line_no;
        var error_char_no = parseInt(char[1]) - 1;

        /* We need to loop through each line till the error line and
         * count the total no of character to figure out the actual
         * starting/ending marker point for the individual line. We
         * have also added 1 per line for the "\n" character.
         */
        var prev_line_chars = 0;
        var loop_index = selected_line_no > 0 ? selected_line_no : 0;
        for (var i = loop_index; i < error_line_no; i++) {
          prev_line_chars += self.gridView.query_tool_obj.getLine(i).length + 1;
        } /* Marker starting point for the individual line is
           * equal to error character index minus total no of
           * character till the error line starts.
           */
        start_marker = error_char_no - prev_line_chars;

        // Find the next space from the character or end of line
        var error_line = self.gridView.query_tool_obj.getLine(error_line_no);
        end_marker = error_line.indexOf(' ', start_marker);
        if (end_marker < 0) end_marker = error_line.length;

        // Mark the error text
        self.gridView.marker = self.gridView.query_tool_obj.markText({ line: error_line_no, ch: start_marker }, { line: error_line_no, ch: end_marker }, { className: "sql-editor-mark" });

        self.gridView.query_tool_obj.addLineClass(self.marked_line_no, 'wrap', 'CodeMirror-activeline-background');
      }
    },

    // This function will cancel the running query.
    _cancel_query: function _cancel_query() {
      var self = this;

      $("#btn-cancel-query").prop('disabled', true);
      $.ajax({
        url: url_for('sqleditor.cancel_transaction', { 'trans_id': self.transId }),
        method: 'POST',
        contentType: "application/json",
        success: function success(res) {
          if (res.data.status) {
            self.disable_tool_buttons(false);
          } else {
            self.disable_tool_buttons(false);
            alertify.alert('Cancel Query Error', res.data.result);
          }
        },
        error: function error(e) {
          self.disable_tool_buttons(false);

          if (e.readyState == 0) {
            alertify.alert('Cancel Query Error', gettext("Not connected to the server or the connection to the server has been closed."));
            return;
          }

          var msg = e.responseText;
          if (e.responseJSON != undefined && e.responseJSON.errormsg != undefined) msg = e.responseJSON.errormsg;

          alertify.alert('Cancel Query Error', msg);
        }
      });
    },

    // Trigger query result download to csv.
    trigger_csv_download: function trigger_csv_download(query, filename) {
      var self = this,
          link = $(this.container).find("#download-csv"),
          url = url_for('sqleditor.query_tool_download', { 'trans_id': self.transId });

      url += "?" + $.param({ query: query, filename: filename });
      link.attr("src", url);
    },

    _auto_rollback: function _auto_rollback() {
      var self = this,
          auto_rollback = true;

      if ($('.auto-rollback').hasClass('visibility-hidden') === true) $('.auto-rollback').removeClass('visibility-hidden');else {
        $('.auto-rollback').addClass('visibility-hidden');
        auto_rollback = false;
      }

      // Make ajax call to change the limit
      $.ajax({
        url: url_for('sqleditor.auto_rollback', { 'trans_id': self.transId }),
        method: 'POST',
        contentType: "application/json",
        data: JSON.stringify(auto_rollback),
        success: function success(res) {
          if (!res.data.status) alertify.alert('Auto Rollback Error', res.data.result);
        },
        error: function error(e) {
          if (e.readyState == 0) {
            alertify.alert('Auto Rollback Error', gettext("Not connected to the server or the connection to the server has been closed."));
            return;
          }

          var msg = e.responseText;
          if (e.responseJSON != undefined && e.responseJSON.errormsg != undefined) msg = e.responseJSON.errormsg;

          alertify.alert('Auto Rollback Error', msg);
        }
      });
    },

    _auto_commit: function _auto_commit() {
      var self = this,
          auto_commit = true;

      if ($('.auto-commit').hasClass('visibility-hidden') === true) $('.auto-commit').removeClass('visibility-hidden');else {
        $('.auto-commit').addClass('visibility-hidden');
        auto_commit = false;
      }

      // Make ajax call to change the limit
      $.ajax({
        url: url_for('sqleditor.auto_commit', { 'trans_id': self.transId }),
        method: 'POST',
        contentType: "application/json",
        data: JSON.stringify(auto_commit),
        success: function success(res) {
          if (!res.data.status) alertify.alert('Auto Commit Error', res.data.result);
        },
        error: function error(e) {
          if (e.readyState == 0) {
            alertify.alert('Auto Commit Error', gettext("Not connected to the server or the connection to the server has been closed."));
            return;
          }

          var msg = e.responseText;
          if (e.responseJSON != undefined && e.responseJSON.errormsg != undefined) msg = e.responseJSON.errormsg;

          alertify.alert('Auto Commit Error', msg);
        }
      });
    },

    // This function will toggle "verbose" option in explain
    _explain_verbose: function _explain_verbose() {
      var self = this;
      if ($('.explain-verbose').hasClass('visibility-hidden') === true) {
        $('.explain-verbose').removeClass('visibility-hidden');
        self.explain_verbose = true;
      } else {
        $('.explain-verbose').addClass('visibility-hidden');
        self.explain_verbose = false;
      }

      // Set this option in preferences
      var data = {
        'explain_verbose': self.explain_verbose
      };

      $.ajax({
        url: url_for('sqleditor.query_tool_preferences', { 'trans_id': self.transId }),
        method: 'PUT',
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function success(res) {
          if (res.success == undefined || !res.success) {
            alertify.alert('Explain options error', gettext("Error occurred while setting verbose option in explain"));
          }
        },
        error: function error(e) {
          alertify.alert('Explain options error', gettext("Error occurred while setting verbose option in explain"));
          return;
        }
      });
    },

    // This function will toggle "costs" option in explain
    _explain_costs: function _explain_costs() {
      var self = this;
      if ($('.explain-costs').hasClass('visibility-hidden') === true) {
        $('.explain-costs').removeClass('visibility-hidden');
        self.explain_costs = true;
      } else {
        $('.explain-costs').addClass('visibility-hidden');
        self.explain_costs = false;
      }

      // Set this option in preferences
      var data = {
        'explain_costs': self.explain_costs
      };

      $.ajax({
        url: url_for('sqleditor.query_tool_preferences', { 'trans_id': self.transId }),
        method: 'PUT',
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function success(res) {
          if (res.success == undefined || !res.success) {
            alertify.alert('Explain options error', gettext("Error occurred while setting costs option in explain"));
          }
        },
        error: function error(e) {
          alertify.alert('Explain options error', gettext("Error occurred while setting costs option in explain"));
        }
      });
    },

    // This function will toggle "buffers" option in explain
    _explain_buffers: function _explain_buffers() {
      var self = this;
      if ($('.explain-buffers').hasClass('visibility-hidden') === true) {
        $('.explain-buffers').removeClass('visibility-hidden');
        self.explain_buffers = true;
      } else {
        $('.explain-buffers').addClass('visibility-hidden');
        self.explain_buffers = false;
      }

      // Set this option in preferences
      var data = {
        'explain_buffers': self.explain_buffers
      };

      $.ajax({
        url: url_for('sqleditor.query_tool_preferences', { 'trans_id': self.transId }),
        method: 'PUT',
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function success(res) {
          if (res.success == undefined || !res.success) {
            alertify.alert('Explain options error', gettext("Error occurred while setting buffers option in explain"));
          }
        },
        error: function error(e) {
          alertify.alert('Explain options error', gettext("Error occurred while setting buffers option in explain"));
        }
      });
    },

    // This function will toggle "timing" option in explain
    _explain_timing: function _explain_timing() {
      var self = this;
      if ($('.explain-timing').hasClass('visibility-hidden') === true) {
        $('.explain-timing').removeClass('visibility-hidden');
        self.explain_timing = true;
      } else {
        $('.explain-timing').addClass('visibility-hidden');
        self.explain_timing = false;
      }
      // Set this option in preferences
      var data = {
        'explain_timing': self.explain_timing
      };

      $.ajax({
        url: url_for('sqleditor.query_tool_preferences', { 'trans_id': self.transId }),
        method: 'PUT',
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function success(res) {
          if (res.success == undefined || !res.success) {
            alertify.alert('Explain options error', gettext("Error occurred while setting timing option in explain"));
          }
        },
        error: function error(e) {
          alertify.alert('Explain options error', gettext("Error occurred while setting timing option in explain"));
        }
      });
    },

    /*
     * This function will indent selected code
     */
    _indent_selected_code: function _indent_selected_code() {
      var self = this,
          editor = self.gridView.query_tool_obj;
      editor.execCommand("indentMore");
    },

    /*
     * This function will unindent selected code
     */
    _unindent_selected_code: function _unindent_selected_code() {
      var self = this,
          editor = self.gridView.query_tool_obj;
      editor.execCommand("indentLess");
    },

    isQueryRunning: function isQueryRunning() {
      return is_query_running;
    },

    /*
     * This function get explain options and auto rollback/auto commit
     * values from preferences
     */
    get_preferences: function get_preferences() {
      var self = this,
          explain_verbose = false,
          explain_costs = false,
          explain_buffers = false,
          explain_timing = false,
          auto_commit = true,
          auto_rollback = false,
          updateUI = function updateUI() {
        // Set Auto-commit and auto-rollback on query editor
        if (auto_commit && $('.auto-commit').hasClass('visibility-hidden') === true) $('.auto-commit').removeClass('visibility-hidden');else {
          $('.auto-commit').addClass('visibility-hidden');
        }
        if (auto_rollback && $('.auto-rollback').hasClass('visibility-hidden') === true) $('.auto-rollback').removeClass('visibility-hidden');else {
          $('.auto-rollback').addClass('visibility-hidden');
        }

        // Set explain options on query editor
        if (explain_verbose && $('.explain-verbose').hasClass('visibility-hidden') === true) $('.explain-verbose').removeClass('visibility-hidden');else {
          $('.explain-verbose').addClass('visibility-hidden');
        }
        if (explain_costs && $('.explain-costs').hasClass('visibility-hidden') === true) $('.explain-costs').removeClass('visibility-hidden');else {
          $('.explain-costs').addClass('visibility-hidden');
        }
        if (explain_buffers && $('.explain-buffers').hasClass('visibility-hidden') === true) $('.explain-buffers').removeClass('visibility-hidden');else {
          $('.explain-buffers').addClass('visibility-hidden');
        }
        if (explain_timing && $('.explain-timing').hasClass('visibility-hidden') === true) $('.explain-timing').removeClass('visibility-hidden');else {
          $('.explain-timing').addClass('visibility-hidden');
        }
      };

      $.ajax({
        url: url_for('sqleditor.query_tool_preferences', { 'trans_id': self.transId }),
        method: 'GET',
        success: function success(res) {
          if (res.data) {
            explain_verbose = res.data.explain_verbose;
            explain_costs = res.data.explain_costs;
            explain_buffers = res.data.explain_buffers;
            explain_timing = res.data.explain_timing;
            auto_commit = res.data.auto_commit;
            auto_rollback = res.data.auto_rollback;

            updateUI();
          }
        },
        error: function error(e) {
          updateUI();
          alertify.alert('Get Preferences error', gettext("Error occurred while getting query tool options "));
        }
      });
    },
    close: function close() {
      var self = this;
      _.each(window.top.pgAdmin.Browser.docker.findPanels('frm_datagrid'), function (panel) {
        if (panel.isVisible()) {
          window.onbeforeunload = null;
          panel.off(wcDocker.EVENT.CLOSING);
          // remove col_size object on panel close
          if (!_.isUndefined(self.col_size)) {
            delete self.col_size;
          }
          window.top.pgAdmin.Browser.docker.removePanel(panel);
        }
      });
    }
  });

  pgAdmin.SqlEditor = {
    // This function is used to create and return the object of grid controller.
    create: function create(container) {
      return new SqlEditorController(container);
    },
    jquery: $,
    S: S
  };

  return pgAdmin.SqlEditor;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 325:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(5), __webpack_require__(0), __webpack_require__(1), __webpack_require__(4), __webpack_require__(3), __webpack_require__(10), __webpack_require__(326)], __WEBPACK_AMD_DEFINE_RESULT__ = function (url_for, $, _, S, pgAdmin, Backbone, Snap) {

  pgAdmin = pgAdmin || window.pgAdmin || {};
  var pgExplain = pgAdmin.Explain;

  // Snap.svg plug-in to write multitext as image name
  Snap.plugin(function (Snap, Element, Paper, glob) {
    Paper.prototype.multitext = function (x, y, txt, max_width, attributes) {
      var svg = Snap(),
          abc = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
          isWordBroken = false,
          temp = svg.text(0, 0, abc);

      temp.attr(attributes);

      /*
       * Find letter width in pixels and
       * index from where the text should be broken
       */
      var letter_width = temp.getBBox().width / abc.length,
          word_break_index = Math.round(max_width / letter_width) - 1;

      svg.remove();

      var words = txt.split(" "),
          width_so_far = 0,
          lines = [],
          curr_line = '',

      /*
       * Function to divide string into multiple lines
       * and store them in an array if it size crosses
       * the max-width boundary.
       */
      splitTextInMultiLine = function splitTextInMultiLine(leading, so_far, line) {
        var l = line.length,
            res = [];

        if (l == 0) return res;

        if (so_far && so_far + l * letter_width > max_width) {
          res.push(leading);
          res = res.concat(splitTextInMultiLine('', 0, line));
        } else if (so_far) {
          res.push(leading + ' ' + line);
        } else {
          if (leading) res.push(leading);
          if (line.length > word_break_index + 1) res.push(line.slice(0, word_break_index) + '-');else res.push(line);
          res = res.concat(splitTextInMultiLine('', 0, line.slice(word_break_index)));
        }

        return res;
      };

      for (var i = 0; i < words.length; i++) {
        var tmpArr = splitTextInMultiLine(curr_line, width_so_far, words[i]);

        if (curr_line) {
          lines = lines.slice(0, lines.length - 2);
        }
        lines = lines.concat(tmpArr);
        curr_line = lines[lines.length - 1];
        width_so_far = curr_line.length * letter_width;
      }

      // Create multiple tspan for each string in array
      var t = this.text(x, y, lines).attr(attributes);
      t.selectAll("tspan:nth-child(n+2)").attr({
        dy: "1.2em",
        x: x
      });
      return t;
    };
  });

  if (pgAdmin.Explain) return pgAdmin.Explain;

  var pgExplain = pgAdmin.Explain = {
    // Prefix path where images are stored
    prefix: url_for('misc.index') + 'static/explain/img/'
  };

  /*
   * A map which is used to fetch the image to be drawn and
   * text which will appear below it
   */
  var imageMapper = {
    "Aggregate": {
      "image": "ex_aggregate.png", "image_text": "Aggregate"
    },
    'Append': {
      "image": "ex_append.png", "image_text": "Append"
    },
    "Bitmap Index Scan": function BitmapIndexScan(data) {
      return {
        "image": "ex_bmp_index.png", "image_text": data['Index Name']
      };
    },
    "Bitmap Heap Scan": function BitmapHeapScan(data) {
      return { "image": "ex_bmp_heap.png", "image_text": data['Relation Name'] };
    },
    "BitmapAnd": { "image": "ex_bmp_and.png", "image_text": "Bitmap AND" },
    "BitmapOr": { "image": "ex_bmp_or.png", "image_text": "Bitmap OR" },
    "CTE Scan": { "image": "ex_cte_scan.png", "image_text": "CTE Scan" },
    "Function Scan": { "image": "ex_result.png", "image_text": "Function Scan" },
    "Foreign Scan": { "image": "ex_foreign_scan.png", "image_text": "Foreign Scan" },
    "Gather": { "image": "ex_gather_motion.png", "image_text": "Gather" },
    "Group": { "image": "ex_group.png", "image_text": "Group" },
    "GroupAggregate": { "image": "ex_aggregate.png", "image_text": "Group Aggregate" },
    "Hash": { "image": "ex_hash.png", "image_text": "Hash" },
    "Hash Join": function HashJoin(data) {
      if (!data['Join Type']) return { "image": "ex_join.png", "image_text": "Join" };
      switch (data['Join Type']) {
        case 'Anti':
          return { "image": "ex_hash_anti_join.png", "image_text": "Hash Anti Join" };
        case 'Semi':
          return { "image": "ex_hash_semi_join.png", "image_text": "Hash Semi Join" };
        default:
          return { "image": "ex_hash.png", "image_text": String("Hash " + data['Join Type'] + " Join") };
      }
    },
    "HashAggregate": { "image": "ex_aggregate.png", "image_text": "Hash Aggregate" },
    "Index Only Scan": function IndexOnlyScan(data) {
      return { "image": "ex_index_only_scan.png", "image_text": data['Index Name'] };
    },
    "Index Scan": function IndexScan(data) {
      return { "image": "ex_index_scan.png", "image_text": data['Index Name'] };
    },
    "Index Scan Backword": { "image": "ex_index_scan.png", "image_text": "Index Backward Scan" },
    "Limit": { "image": "ex_limit.png", "image_text": "Limit" },
    "LockRows": { "image": "ex_lock_rows.png", "image_text": "Lock Rows" },
    "Materialize": { "image": "ex_materialize.png", "image_text": "Materialize" },
    "Merge Append": { "image": "ex_merge_append.png", "image_text": "Merge Append" },
    "Merge Join": function MergeJoin(data) {
      switch (data['Join Type']) {
        case 'Anti':
          return { "image": "ex_merge_anti_join.png", "image_text": "Merge Anti Join" };
        case 'Semi':
          return { "image": "ex_merge_semi_join.png", "image_text": "Merge Semi Join" };
        default:
          return { "image": "ex_merge.png", "image_text": String("Merge " + data['Join Type'] + " Join") };
      }
    },
    "ModifyTable": function ModifyTable(data) {
      switch (data['Operation']) {
        case "Insert":
          return { "image": "ex_insert.png",
            "image_text": "Insert"
          };
        case "Update":
          return { "image": "ex_update.png", "image_text": "Update" };
        case "Delete":
          return { "image": "ex_delete.png", "image_text": "Delete" };
      }
    },
    'Nested Loop': function NestedLoop(data) {
      switch (data['Join Type']) {
        case 'Anti':
          return { "image": "ex_nested_loop_anti_join.png", "image_text": "Nested Loop Anti Join" };
        case 'Semi':
          return { "image": "ex_nested_loop_semi_join.png", "image_text": "Nested Loop Semi Join" };
        default:
          return { "image": "ex_nested.png", "image_text": "Nested Loop " + data['Join Type'] + " Join" };
      }
    },
    "Recursive Union": { "image": "ex_recursive_union.png", "image_text": "Recursive Union" },
    "Result": { "image": "ex_result.png", "image_text": "Result" },
    "Sample Scan": { "image": "ex_scan.png", "image_text": "Sample Scan" },
    "Scan": { "image": "ex_scan.png", "image_text": "Scan" },
    "Seek": { "image": "ex_seek.png", "image_text": "Seek" },
    "SetOp": function SetOp(data) {
      var strategy = data['Strategy'],
          command = data['Command'];

      if (strategy == "Hashed") {
        if (S.startsWith(command, "Intersect")) {
          if (command == "Intersect All") return { "image": "ex_hash_setop_intersect_all.png", "image_text": "Hashed Intersect All" };
          return { "image": "ex_hash_setop_intersect.png", "image_text": "Hashed Intersect" };
        } else if (S.startsWith(command, "Except")) {
          if (command == "Except All") return { "image": "ex_hash_setop_except_all.png", "image_text": "Hashed Except All" };
          return { "image": "ex_hash_setop_except.png", "image_text": "Hash Except" };
        }
        return { "image": "ex_hash_setop_unknown.png", "image_text": "Hashed SetOp Unknown" };
      }
      return { "image": "ex_setop.png", "image_text": "SetOp" };
    },
    "Seq Scan": function SeqScan(data) {
      return { "image": "ex_scan.png", "image_text": data['Relation Name'] };
    },
    "Subquery Scan": { "image": "ex_subplan.png", "image_text": "SubQuery Scan" },
    "Sort": { "image": "ex_sort.png", "image_text": "Sort" },
    "Tid Scan": { "image": "ex_tid_scan.png", "image_text": "Tid Scan" },
    "Unique": { "image": "ex_unique.png", "image_text": "Unique" },
    "Values Scan": { "image": "ex_values_scan.png", "image_text": "Values Scan" },
    "WindowAgg": { "image": "ex_window_aggregate.png", "image_text": "Window Aggregate" },
    "WorkTable Scan": { "image": "ex_worktable_scan.png", "image_text": "WorkTable Scan" },
    "Undefined": { "image": "ex_unknown.png", "image_text": "Undefined" }

    // Some predefined constants used to calculate image location and its border
  };var pWIDTH = 100.;
  var pHEIGHT = 100.;
  var IMAGE_WIDTH = 50;
  var IMAGE_HEIGHT = 50;
  var offsetX = 200,
      offsetY = 60;
  var ARROW_WIDTH = 10,
      ARROW_HEIGHT = 10,
      DEFAULT_ARROW_SIZE = 2;
  var TXT_ALLIGN = 5,
      TXT_SIZE = "15px";
  var TOTAL_WIDTH = undefined,
      TOTAL_HEIGHT = undefined;
  var xMargin = 25,
      yMargin = 25;
  var MIN_ZOOM_FACTOR = 0.01,
      MAX_ZOOM_FACTOR = 2,
      INIT_ZOOM_FACTOR = 1;
  var ZOOM_RATIO = 0.05;

  // Backbone model for each plan property of input JSON object
  var PlanModel = Backbone.Model.extend({
    defaults: {
      "Plans": [],
      level: [],
      "image": undefined,
      "image_text": undefined,
      xpos: undefined,
      ypos: undefined,
      width: pWIDTH,
      height: pHEIGHT
    },
    parse: function parse(data) {
      var idx = 1,
          lvl = data.level = data.level || [idx],
          plans = [],
          node_type = data['Node Type'],

      // Calculating relative xpos of current node from top node
      xpos = data.xpos = data.xpos - pWIDTH,

      // Calculating relative ypos of current node from top node
      ypos = data.ypos,
          maxChildWidth = 0;

      data['width'] = pWIDTH;
      data['height'] = pHEIGHT;

      /*
       * calculating xpos, ypos, width and height if current node is a subplan
       */
      if (data['Parent Relationship'] === "SubPlan") {
        data['width'] += xMargin * 2 + xMargin / 2;
        data['height'] += yMargin * 2;
        data['ypos'] += yMargin;
        xpos -= xMargin;
        ypos += yMargin;
      }

      if (S.startsWith(node_type, "(slice")) node_type = node_type.substring(0, 7);

      // Get the image information for current node
      var mapperObj = _.isFunction(imageMapper[node_type]) && imageMapper[node_type].apply(undefined, [data]) || imageMapper[node_type] || 'Undefined';

      data["image"] = mapperObj["image"];
      data["image_text"] = mapperObj["image_text"];

      // Start calculating xpos, ypos, width and height for child plans if any
      if ('Plans' in data) {

        data['width'] += offsetX;

        _.each(data['Plans'], function (p) {
          var level = _.clone(lvl),
              plan = new PlanModel();

          level.push(idx);
          plan.set(plan.parse(_.extend(p, {
            "level": level,
            xpos: xpos - offsetX,
            ypos: ypos
          })));

          if (maxChildWidth < plan.get('width')) {
            maxChildWidth = plan.get('width');
          }

          var childHeight = plan.get('height');

          if (idx !== 1) {
            data['height'] = data['height'] + childHeight + offsetY;
          } else if (childHeight > data['height']) {
            data['height'] = childHeight;
          }
          ypos += childHeight + offsetY;

          plans.push(plan);
          idx++;
        });
      }

      // Final Width and Height of current node
      data['width'] += maxChildWidth;
      data['Plans'] = plans;

      return data;
    },

    /*
     * Required to parse and include non-default params of
     * plan into backbone model
     */
    toJSON: function toJSON(non_recursive) {
      var res = Backbone.Model.prototype.toJSON.apply(this, arguments);

      if (non_recursive) {
        delete res['Plans'];
      } else {
        var plans = [];
        _.each(res['Plans'], function (p) {
          plans.push(p.toJSON());
        });
        res['Plans'] = plans;
      }
      return res;
    },

    // Draw an arrow to parent node
    drawPolyLine: function drawPolyLine(g, startX, startY, endX, endY, opts, arrowOpts) {
      // Calculate end point of first starting straight line (startx1, starty1)
      // Calculate start point of 2nd straight line (endx1, endy1)
      var midX1 = startX + (endX - startX) / 3,
          midX2 = startX + 2 * ((endX - startX) / 3);

      //create arrow head
      var arrow = g.polygon([0, ARROW_HEIGHT, ARROW_WIDTH / 2, ARROW_HEIGHT, ARROW_HEIGHT / 4, 0, 0, ARROW_WIDTH]).transform("r90");
      var marker = arrow.marker(0, 0, ARROW_WIDTH, ARROW_HEIGHT, 0, ARROW_WIDTH / 2).attr(arrowOpts);

      // First straight line
      g.line(startX, startY, midX1, startY).attr(opts);

      // Diagonal line
      g.line(midX1 - 1, startY, midX2, endY).attr(opts);

      // Last straight line
      var line = g.line(midX2, endY, endX, endY).attr(opts);
      line.attr({ markerEnd: marker });
    },

    // Draw image, its name and its tooltip
    draw: function draw(s, xpos, ypos, pXpos, pYpos, graphContainer, toolTipContainer) {
      var g = s.g();
      var currentXpos = xpos + this.get('xpos'),
          currentYpos = ypos + this.get('ypos'),
          isSubPlan = this.get('Parent Relationship') === "SubPlan";

      // Draw the subplan rectangle
      if (isSubPlan) {
        g.rect(currentXpos - this.get('width') + pWIDTH + xMargin, currentYpos - yMargin, this.get('width') - xMargin, this.get('height'), 5).attr({
          stroke: '#444444',
          'strokeWidth': 1.2,
          fill: 'gray',
          fillOpacity: 0.2
        });

        //provide subplan name
        var text = g.text(currentXpos + pWIDTH - this.get('width') / 2 - xMargin, currentYpos + pHEIGHT - this.get('height') / 2 - yMargin, this.get('Subplan Name')).attr({
          fontSize: TXT_SIZE, "text-anchor": "start",
          fill: 'red'
        });
      }

      // Draw the actual image for current node
      var image = g.image(pgExplain.prefix + this.get('image'), currentXpos + (pWIDTH - IMAGE_WIDTH) / 2, currentYpos + (pHEIGHT - IMAGE_HEIGHT) / 2, IMAGE_WIDTH, IMAGE_HEIGHT);

      // Draw tooltip
      var image_data = this.toJSON();
      image.mouseover(function (evt) {

        // Empty the tooltip content if it has any and add new data
        toolTipContainer.empty();
        var tooltip = $('<table></table>', {
          class: "pgadmin-tooltip-table"
        }).appendTo(toolTipContainer);
        _.each(image_data, function (value, key) {
          if (key !== 'image' && key !== 'Plans' && key !== 'level' && key !== 'image' && key !== 'image_text' && key !== 'xpos' && key !== 'ypos' && key !== 'width' && key !== 'height') {
            tooltip.append('<tr><td class="label explain-tooltip">' + key + '</td><td class="label explain-tooltip-val">' + value + '</td></tr>');
          };
        });

        var zoomFactor = graphContainer.data('zoom-factor');

        // Calculate co-ordinates for tooltip
        var toolTipX = (currentXpos + pWIDTH) * zoomFactor - graphContainer.scrollLeft();
        var toolTipY = (currentYpos + pHEIGHT) * zoomFactor - graphContainer.scrollTop();

        // Recalculate x.y if tooltip is going out of screen
        if (graphContainer.width() < toolTipX + toolTipContainer[0].clientWidth) toolTipX -= toolTipContainer[0].clientWidth + pWIDTH * zoomFactor;
        //if(document.children[0].clientHeight < (toolTipY + toolTipContainer[0].clientHeight))
        if (graphContainer.height() < toolTipY + toolTipContainer[0].clientHeight) toolTipY -= toolTipContainer[0].clientHeight + pHEIGHT / 2 * zoomFactor;

        toolTipX = toolTipX < 0 ? 0 : toolTipX;
        toolTipY = toolTipY < 0 ? 0 : toolTipY;

        // Show toolTip at respective x,y coordinates
        toolTipContainer.css({ 'opacity': '0.8' });
        toolTipContainer.css('left', toolTipX);
        toolTipContainer.css('top', toolTipY);
      });

      // Remove tooltip when mouse is out from node's area
      image.mouseout(function () {
        toolTipContainer.empty();
        toolTipContainer.css({ 'opacity': '0' });
        toolTipContainer.css('left', 0);
        toolTipContainer.css('top', 0);
      });

      // Draw text below the node
      var node_label = this.get('Schema') == undefined ? this.get('image_text') : this.get('Schema') + "." + this.get('image_text');
      var label = g.g();
      g.multitext(currentXpos + pWIDTH / 2, currentYpos + pHEIGHT - TXT_ALLIGN, node_label, 150, { "font-size": TXT_SIZE, "text-anchor": "middle" });

      // Draw Arrow to parent only its not the first node
      if (!_.isUndefined(pYpos)) {
        var startx = currentXpos + pWIDTH;
        var starty = currentYpos + pHEIGHT / 2;
        var endx = pXpos - ARROW_WIDTH;
        var endy = pYpos + pHEIGHT / 2;
        var start_cost = this.get("Startup Cost"),
            total_cost = this.get("Total Cost");
        var arrow_size = DEFAULT_ARROW_SIZE;
        // Calculate arrow width according to cost of a particular plan
        if (start_cost != undefined && total_cost != undefined) {
          var arrow_size = Math.round(Math.log((start_cost + total_cost) / 2 + start_cost));
          arrow_size = arrow_size < 1 ? 1 : arrow_size > 10 ? 10 : arrow_size;
        }

        var arrow_view_box = [0, 0, 2 * ARROW_WIDTH, 2 * ARROW_HEIGHT];
        var opts = { stroke: "#000000", strokeWidth: arrow_size + 1 },
            subplanOpts = { stroke: "#866486", strokeWidth: arrow_size + 1 },
            arrowOpts = { viewBox: arrow_view_box.join(" ") };

        // Draw an arrow from current node to its parent
        this.drawPolyLine(g, startx, starty, endx, endy, isSubPlan ? subplanOpts : opts, arrowOpts);
      }

      var plans = this.get('Plans');

      // Draw nodes for current plan's children
      _.each(plans, function (p) {
        p.draw(s, xpos, ypos, currentXpos, currentYpos, graphContainer, toolTipContainer);
      });
    }
  });

  // Main backbone model to store JSON object
  var MainPlanModel = Backbone.Model.extend({
    defaults: {
      "Plan": undefined,
      xpos: 0,
      ypos: 0
    },
    initialize: function initialize() {
      this.set("Plan", new PlanModel());
    },

    // Parse the JSON data and fetch its children plans
    parse: function parse(data) {
      if (data && 'Plan' in data) {
        var plan = this.get("Plan");
        plan.set(plan.parse(_.extend(data['Plan'], {
          xpos: 0,
          ypos: 0
        })));

        data['xpos'] = 0;
        data['ypos'] = 0;
        data['width'] = plan.get('width') + xMargin * 2;
        data['height'] = plan.get('height') + yMargin * 2;

        delete data['Plan'];
      }

      return data;
    },
    toJSON: function toJSON() {
      var res = Backbone.Model.prototype.toJSON.apply(this, arguments);

      if (res.Plan) {
        res.Plan = res.Plan.toJSON();
      }

      return res;
    },
    draw: function draw(s, xpos, ypos, graphContainer, toolTipContainer) {
      var g = s.g();

      //draw the border
      g.rect(0, 0, this.get('width') - 10, this.get('height') - 10, 5).attr({
        fill: '#FFF'
      });

      //Fetch total width, height
      TOTAL_WIDTH = this.get('width');
      TOTAL_HEIGHT = this.get('height');
      var plan = this.get('Plan');

      //Draw explain graph
      plan.draw(g, xpos, ypos, undefined, undefined, graphContainer, toolTipContainer);
    }
  });

  // Parse and draw full graphical explain
  _.extend(pgExplain, {
    // Assumption container is a jQuery object
    DrawJSONPlan: function DrawJSONPlan(container, plan) {
      var my_plans = [];
      container.empty();
      var curr_zoom_factor = 1.0;

      var zoomArea = $('<div></div>', {
        class: 'pg-explain-zoom-area btn-group',
        role: 'group'
      }).appendTo(container),
          zoomInBtn = $('<button></button>', {
        class: 'btn pg-explain-zoom-btn badge',
        title: 'Zoom in'
      }).appendTo(zoomArea).append($('<i></i>', {
        class: 'fa fa-search-plus'
      })),
          zoomToNormal = $('<button></button>', {
        class: 'btn pg-explain-zoom-btn badge',
        title: 'Zoom to original'
      }).appendTo(zoomArea).append($('<i></i>', {
        class: 'fa fa-arrows-alt'
      })),
          zoomOutBtn = $('<button></button>', {
        class: 'btn pg-explain-zoom-btn badge',
        title: 'Zoom out'
      }).appendTo(zoomArea).append($('<i></i>', {
        class: 'fa fa-search-minus'
      }));

      // Main div to be drawn all images on
      var planDiv = $('<div></div>', { class: "pgadmin-explain-container" }).appendTo(container),

      // Div to draw tool-tip on
      toolTip = $('<div></div>', { id: "toolTip",
        class: "pgadmin-explain-tooltip"
      }).appendTo(container);
      toolTip.empty();
      planDiv.data('zoom-factor', curr_zoom_factor);

      var w = 0,
          h = 0,
          x = xMargin,
          h = yMargin;

      _.each(plan, function (p) {
        var main_plan = new MainPlanModel();

        // Parse JSON data to backbone model
        main_plan.set(main_plan.parse(p));
        w = main_plan.get('width');
        h = main_plan.get('height');

        var s = Snap(w, h),
            $svg = $(s.node).detach();
        planDiv.append($svg);
        main_plan.draw(s, w - xMargin, yMargin, planDiv, toolTip);

        var initPanelWidth = planDiv.width(),
            initPanelHeight = planDiv.height();

        /*
         * Scale graph in case its width is bigger than panel width
         * in which the graph is displayed
         */
        if (initPanelWidth < w) {
          var width_ratio = initPanelWidth / w;

          curr_zoom_factor = width_ratio;
          curr_zoom_factor = curr_zoom_factor < MIN_ZOOM_FACTOR ? MIN_ZOOM_FACTOR : curr_zoom_factor;
          curr_zoom_factor = curr_zoom_factor > INIT_ZOOM_FACTOR ? INIT_ZOOM_FACTOR : curr_zoom_factor;

          var zoomInMatrix = new Snap.matrix();
          zoomInMatrix.scale(curr_zoom_factor, curr_zoom_factor);

          $svg.find('g').first().attr({ transform: zoomInMatrix });
          $svg.attr({ 'width': w * curr_zoom_factor, 'height': h * curr_zoom_factor });
          planDiv.data('zoom-factor', curr_zoom_factor);
        }

        zoomInBtn.on('click', function (e) {
          curr_zoom_factor = curr_zoom_factor + ZOOM_RATIO > MAX_ZOOM_FACTOR ? MAX_ZOOM_FACTOR : curr_zoom_factor + ZOOM_RATIO;
          var zoomInMatrix = new Snap.matrix();
          zoomInMatrix.scale(curr_zoom_factor, curr_zoom_factor);

          $svg.find('g').first().attr({ transform: zoomInMatrix });
          $svg.attr({ 'width': w * curr_zoom_factor, 'height': h * curr_zoom_factor });
          planDiv.data('zoom-factor', curr_zoom_factor);
          zoomInBtn.blur();
        });

        zoomOutBtn.on('click', function (e) {
          curr_zoom_factor = curr_zoom_factor - ZOOM_RATIO < MIN_ZOOM_FACTOR ? MIN_ZOOM_FACTOR : curr_zoom_factor - ZOOM_RATIO;
          var zoomInMatrix = new Snap.matrix();
          zoomInMatrix.scale(curr_zoom_factor, curr_zoom_factor);

          $svg.find('g').first().attr({ transform: zoomInMatrix });
          $svg.attr({ 'width': w * curr_zoom_factor, 'height': h * curr_zoom_factor });
          planDiv.data('zoom-factor', curr_zoom_factor);
          zoomOutBtn.blur();
        });

        zoomToNormal.on('click', function (e) {
          curr_zoom_factor = INIT_ZOOM_FACTOR;
          var zoomInMatrix = new Snap.matrix();
          zoomInMatrix.scale(curr_zoom_factor, curr_zoom_factor);

          $svg.find('g').first().attr({ transform: zoomInMatrix });
          $svg.attr({ 'width': w * curr_zoom_factor, 'height': h * curr_zoom_factor });
          planDiv.data('zoom-factor', curr_zoom_factor);
          zoomToNormal.blur();
        });
      });
    }
  });

  return pgExplain;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 327:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(2), __webpack_require__(328), __webpack_require__(329), __webpack_require__(32), __webpack_require__(5)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, gettext, ColumnSelector, RowSelector, RangeSelectionHelper, url_for) {
  var GridSelector = function GridSelector(columnDefinitions) {
    var Slick = window.Slick,
        rowSelector = new RowSelector(columnDefinitions),
        columnSelector = new ColumnSelector(columnDefinitions),
        onBeforeGridSelectAll = new Slick.Event(),
        onGridSelectAll = new Slick.Event(),
        onBeforeGridColumnSelectAll = columnSelector.onBeforeColumnSelectAll,
        onGridColumnSelectAll = columnSelector.onColumnSelectAll;

    var init = function init(grid) {
      this.grid = grid;
      grid.onHeaderClick.subscribe(function (event, eventArguments) {
        if (eventArguments.column.selectAllOnClick && !$(event.target).hasClass('slick-resizable-handle')) {
          toggleSelectAll(grid, event, eventArguments);
        }
      });

      grid.getSelectionModel().onSelectedRangesChanged.subscribe(handleSelectedRangesChanged.bind(null, grid));

      grid.registerPlugin(rowSelector);
      grid.registerPlugin(columnSelector);

      onGridSelectAll.subscribe(function (e, args) {
        RangeSelectionHelper.selectAll(args.grid);
      });
    };

    var getColumnDefinitions = function getColumnDefinitions(columnDefinitions) {
      columnDefinitions = columnSelector.getColumnDefinitions(columnDefinitions);
      columnDefinitions = rowSelector.getColumnDefinitions(columnDefinitions);

      columnDefinitions[0].selectAllOnClick = true;
      columnDefinitions[0].name = '<span data-id="select-all" ' + 'title="' + gettext('Select/Deselect All') + '">' + '<br>' + columnDefinitions[0].name + '<img class="select-all-icon" src="' + url_for('static', { 'filename': 'img/select-all-icon.png' }) + '"></img>';
      '</span>';
      return columnDefinitions;
    };

    function handleSelectedRangesChanged(grid) {
      if (RangeSelectionHelper.isEntireGridSelected(grid)) {
        $('[data-id=\'select-all\']').addClass('selected');
      } else {
        $('[data-id=\'select-all\']').removeClass('selected');
      }
    }

    function toggleSelectAll(grid, event, eventArguments) {
      if (RangeSelectionHelper.isEntireGridSelected(grid)) {
        selectNone(grid);
      } else {
        onBeforeGridSelectAll.notify(eventArguments, event);
        if (!(event.isPropagationStopped() || event.isImmediatePropagationStopped())) {
          RangeSelectionHelper.selectAll(grid);
        }
      }
    }

    function selectNone(grid) {
      var selectionModel = grid.getSelectionModel();
      selectionModel.setSelectedRanges([]);
    }

    $.extend(this, {
      'init': init,
      'getColumnDefinitions': getColumnDefinitions,
      'onBeforeGridSelectAll': onBeforeGridSelectAll,
      'onGridSelectAll': onGridSelectAll,
      'onBeforeGridColumnSelectAll': onBeforeGridColumnSelectAll,
      'onGridColumnSelectAll': onGridColumnSelectAll
    });
  };

  return GridSelector;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 328:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(32), __webpack_require__(78)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, RangeSelectionHelper) {
  var ColumnSelector = function ColumnSelector() {
    var Slick = window.Slick,
        gridEventBus = new Slick.EventHandler(),
        onBeforeColumnSelectAll = new Slick.Event(),
        onColumnSelectAll = new Slick.Event();

    var init = function init(grid) {
      gridEventBus.subscribe(grid.onHeaderClick, handleHeaderClick.bind(null, grid));
      grid.getSelectionModel().onSelectedRangesChanged.subscribe(handleSelectedRangesChanged.bind(null, grid));
      onColumnSelectAll.subscribe(function (e, args) {
        updateRanges(args.grid, args.column.id);
      });
    };

    var handleHeaderClick = function handleHeaderClick(grid, event, args) {
      var columnDefinition = args.column;

      grid.focus();

      if (isColumnSelectable(columnDefinition)) {
        var $columnHeader = $(event.target);
        if (hasClickedChildOfColumnHeader(event)) {
          if ($(event.target).hasClass('slick-resizable-handle')) {
            return;
          }
          $columnHeader = $(event.target).parents('.slick-header-column');
        }
        $columnHeader.toggleClass('selected');

        if ($columnHeader.hasClass('selected')) {
          onBeforeColumnSelectAll.notify(args, event);
        }

        if (!(event.isPropagationStopped() || event.isImmediatePropagationStopped())) {
          updateRanges(grid, columnDefinition.id);
        }
      }
    };

    var handleSelectedRangesChanged = function handleSelectedRangesChanged(grid, event, selectedRanges) {
      $('.slick-header-column').each(function (index, columnHeader) {
        var $spanHeaderColumn = $(columnHeader).find('[data-cell-type="column-header-row"]');
        var columnIndex = grid.getColumnIndex($spanHeaderColumn.data('column-id'));

        if (isColumnSelected(grid, selectedRanges, columnIndex)) {
          $(columnHeader).addClass('selected');
        } else {
          $(columnHeader).removeClass('selected');
        }
      });
    };

    var updateRanges = function updateRanges(grid, columnId) {
      var selectionModel = grid.getSelectionModel();
      var ranges = selectionModel.getSelectedRanges();

      var columnIndex = grid.getColumnIndex(columnId);

      var columnRange = RangeSelectionHelper.rangeForColumn(grid, columnIndex);
      var newRanges;
      if (RangeSelectionHelper.isRangeSelected(ranges, columnRange)) {
        newRanges = RangeSelectionHelper.removeRange(ranges, columnRange);
      } else {
        if (RangeSelectionHelper.areAllRangesSingleColumns(ranges, grid)) {
          newRanges = RangeSelectionHelper.addRange(ranges, columnRange);
        } else {
          newRanges = [columnRange];
        }
      }
      selectionModel.setSelectedRanges(newRanges);
    };

    var hasClickedChildOfColumnHeader = function hasClickedChildOfColumnHeader(event) {
      return !$(event.target).hasClass('slick-header-column');
    };

    var isColumnSelectable = function isColumnSelectable(columnDefinition) {
      return columnDefinition.selectable !== false;
    };

    var isColumnSelected = function isColumnSelected(grid, selectedRanges, columnIndex) {
      var allRangesAreRows = RangeSelectionHelper.areAllRangesCompleteRows(grid, selectedRanges);
      return isAnyCellSelectedInColumn(grid, selectedRanges, columnIndex) && !allRangesAreRows;
    };

    var isAnyCellSelectedInColumn = function isAnyCellSelectedInColumn(grid, selectedRanges, columnIndex) {
      var isStillSelected = RangeSelectionHelper.isRangeEntirelyWithinSelectedRanges(selectedRanges, RangeSelectionHelper.rangeForColumn(grid, columnIndex));
      var cellSelectedInColumn = RangeSelectionHelper.isAnyCellOfColumnSelected(selectedRanges, columnIndex);

      return isStillSelected || cellSelectedInColumn;
    };

    var getColumnDefinitions = function getColumnDefinitions(columnDefinitions) {
      return _.map(columnDefinitions, function (columnDefinition) {
        if (isColumnSelectable(columnDefinition)) {
          var name = '<span data-cell-type=\'column-header-row\' ' + '       data-test=\'output-column-header\'' + '       data-column-id=\'' + columnDefinition.id + '\'>' + '  <span class=\'column-description\'>' + '    <span class=\'column-name\'>' + columnDefinition.display_name + '</span>' + '    <span class=\'column-type\'>' + columnDefinition.column_type + '</span>' + '  </span>' + '</span>';
          return _.extend(columnDefinition, {
            name: name
          });
        } else {
          return columnDefinition;
        }
      });
    };

    $.extend(this, {
      'init': init,
      'getColumnDefinitions': getColumnDefinitions,
      'onBeforeColumnSelectAll': onBeforeColumnSelectAll,
      'onColumnSelectAll': onColumnSelectAll
    });
  };
  return ColumnSelector;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),

/***/ 329:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(32), __webpack_require__(78)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, RangeSelectionHelper) {
  var RowSelector = function RowSelector() {
    var Slick = window.Slick;

    var gridEventBus = new Slick.EventHandler();

    var init = function init(grid) {
      grid.getSelectionModel().onSelectedRangesChanged.subscribe(handleSelectedRangesChanged.bind(null, grid));
      gridEventBus.subscribe(grid.onClick, handleClick.bind(null, grid));
    };

    var handleClick = function handleClick(grid, event, args) {
      if (grid.getColumns()[args.cell].id === 'row-header-column') {
        var $rowHeaderSpan = $(event.target);

        if ($rowHeaderSpan.data('cell-type') != 'row-header-selector') {
          $rowHeaderSpan = $(event.target).find('[data-cell-type="row-header-selector"]');
        }

        $rowHeaderSpan.parent().toggleClass('selected');
        updateRanges(grid, args.row);
      }
    };

    var handleSelectedRangesChanged = function handleSelectedRangesChanged(grid, event, selectedRanges) {
      $('[data-cell-type="row-header-selector"]').each(function (index, rowHeaderSpan) {
        var $rowHeaderSpan = $(rowHeaderSpan);
        var row = parseInt($rowHeaderSpan.data('row'));

        if (isRowSelected(grid, selectedRanges, row)) {
          $rowHeaderSpan.parent().addClass('selected');
        } else {
          $rowHeaderSpan.parent().removeClass('selected');
        }
      });
    };

    var updateRanges = function updateRanges(grid, rowId) {
      var selectionModel = grid.getSelectionModel();
      var ranges = selectionModel.getSelectedRanges();

      var rowRange = RangeSelectionHelper.rangeForRow(grid, rowId);

      var newRanges;
      if (RangeSelectionHelper.isRangeSelected(ranges, rowRange)) {
        newRanges = RangeSelectionHelper.removeRange(ranges, rowRange);
      } else {
        if (RangeSelectionHelper.areAllRangesSingleRows(ranges, grid)) {
          newRanges = RangeSelectionHelper.addRange(ranges, rowRange);
        } else {
          newRanges = [rowRange];
        }
      }
      selectionModel.setSelectedRanges(newRanges);
    };

    var isAnyCellSelectedInRow = function isAnyCellSelectedInRow(grid, selectedRanges, row) {
      var isStillSelected = RangeSelectionHelper.isRangeEntirelyWithinSelectedRanges(selectedRanges, RangeSelectionHelper.rangeForRow(grid, row));
      var cellSelectedInRow = RangeSelectionHelper.isAnyCellOfRowSelected(selectedRanges, row);

      return isStillSelected || cellSelectedInRow;
    };

    var isRowSelected = function isRowSelected(grid, selectedRanges, row) {
      var allRangesAreColumns = RangeSelectionHelper.areAllRangesCompleteColumns(grid, selectedRanges);
      return isAnyCellSelectedInRow(grid, selectedRanges, row) && !allRangesAreColumns;
    };

    var getColumnDefinitions = function getColumnDefinitions(columnDefinitions) {
      columnDefinitions.unshift({
        id: 'row-header-column',
        name: '',
        selectable: false,
        focusable: false,
        formatter: function formatter(rowIndex) {
          return '<span ' + 'data-row="' + rowIndex + '" ' + 'data-cell-type="row-header-selector">' + (rowIndex + 1) + '</span>';
        },
        width: 30
      });
      return columnDefinitions;
    };

    $.extend(this, {
      'init': init,
      'getColumnDefinitions': getColumnDefinitions
    });
  };

  return RowSelector;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 330:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(32)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, RangeSelectionHelper) {

  var ActiveCellCapture = function ActiveCellCapture() {
    var KEY_RIGHT = 39;
    var KEY_LEFT = 37;
    var KEY_UP = 38;
    var KEY_DOWN = 40;

    var bypassDefaultActiveCellRangeChange = false;
    var isColumnsResized = false;
    var isMouseInHeader = false;
    var grid;

    var init = function init(slickGrid) {
      grid = slickGrid;
      grid.onDragEnd.subscribe(onDragEndHandler);
      grid.onHeaderClick.subscribe(onHeaderClickHandler);
      grid.onClick.subscribe(onClickHandler);
      grid.onActiveCellChanged.subscribe(onActiveCellChangedHandler);
      grid.onKeyDown.subscribe(onKeyDownHandler);
      grid.onHeaderMouseEnter.subscribe(onHeaderMouseEnterHandler);
      grid.onHeaderMouseLeave.subscribe(onHeaderMouseLeaveHandler);
      grid.onColumnsResized.subscribe(onColumnsResizedHandler);
    };

    var destroy = function destroy() {
      grid.onDragEnd.unsubscribe(onDragEndHandler);
      grid.onHeaderClick.unsubscribe(onHeaderClickHandler);
      grid.onActiveCellChanged.unsubscribe(onActiveCellChangedHandler);
      grid.onKeyDown.unsubscribe(onKeyDownHandler);
      grid.onHeaderMouseEnter.unsubscribe(onHeaderMouseEnterHandler);
      grid.onHeaderMouseLeave.unsubscribe(onHeaderMouseLeaveHandler);
      grid.onColumnsResized.unsubscribe(onColumnsResizedHandler);
    };

    $.extend(this, {
      'init': init,
      'destroy': destroy
    });

    function onDragEndHandler(event, dragData) {
      bypassDefaultActiveCellRangeChange = true;
      grid.setActiveCell(dragData.range.start.row, dragData.range.start.cell);
    }

    function onHeaderClickHandler(event, args) {
      if (isColumnsResizedAndCurrentlyInHeader()) {
        isColumnsResized = false;
        event.stopPropagation();
        return;
      }

      bypassDefaultActiveCellRangeChange = true;

      var clickedColumn = args.column.pos + 1;
      if (isClickingLastClickedHeader(0, clickedColumn)) {
        if (isSingleRangeSelected()) {
          grid.resetActiveCell();
        } else {
          grid.setActiveCell(0, retrievePreviousSelectedRange().fromCell);
        }
      } else if (!isClickingInSelectedColumn(clickedColumn)) {
        grid.setActiveCell(0, clickedColumn);
      }
    }

    function isEditableNewRow(row) {
      return row >= grid.getDataLength();
    }

    function onHeaderMouseLeaveHandler() {
      isMouseInHeader = false;
    }

    function onHeaderMouseEnterHandler() {
      isMouseInHeader = true;
      isColumnsResized = false;
    }

    function onColumnsResizedHandler() {
      isColumnsResized = true;
    }

    function onClickHandler(event, args) {
      if (isRowHeader(args.cell)) {
        bypassDefaultActiveCellRangeChange = true;
        var rowClicked = args.row;

        if (isEditableNewRow(rowClicked)) {
          return;
        }

        if (isClickingLastClickedHeader(rowClicked, 1)) {
          if (isSingleRangeSelected()) {
            grid.resetActiveCell();
          } else {
            grid.setActiveCell(retrievePreviousSelectedRange().fromRow, 1);
          }
        } else if (!isClickingInSelectedRow(rowClicked)) {
          grid.setActiveCell(rowClicked, 1);
        }
      }
    }

    function onActiveCellChangedHandler(event) {
      if (bypassDefaultActiveCellRangeChange) {
        bypassDefaultActiveCellRangeChange = false;
        event.stopPropagation();
      }
    }

    function onKeyDownHandler(event) {
      if (hasActiveCell() && isShiftArrowKey(event)) {
        selectOnlyRangeOfActiveCell();
      }
    }

    function isColumnsResizedAndCurrentlyInHeader() {
      return isMouseInHeader && isColumnsResized;
    }

    function isClickingLastClickedHeader(clickedRow, clickedColumn) {
      return hasActiveCell() && grid.getActiveCell().row === clickedRow && grid.getActiveCell().cell === clickedColumn;
    }

    function isClickingInSelectedColumn(clickedColumn) {
      var column = RangeSelectionHelper.rangeForColumn(grid, clickedColumn);
      var cellSelectionModel = grid.getSelectionModel();
      var ranges = cellSelectionModel.getSelectedRanges();
      return RangeSelectionHelper.isRangeSelected(ranges, column);
    }

    function isRowHeader(cellClicked) {
      return grid.getColumns()[cellClicked].id === 'row-header-column';
    }

    function isClickingInSelectedRow(rowClicked) {
      var row = RangeSelectionHelper.rangeForRow(grid, rowClicked);
      var cellSelectionModel = grid.getSelectionModel();
      var ranges = cellSelectionModel.getSelectedRanges();
      return RangeSelectionHelper.isRangeSelected(ranges, row);
    }

    function isSingleRangeSelected() {
      var cellSelectionModel = grid.getSelectionModel();
      var ranges = cellSelectionModel.getSelectedRanges();
      return ranges.length === 1;
    }

    function retrievePreviousSelectedRange() {
      var cellSelectionModel = grid.getSelectionModel();
      var ranges = cellSelectionModel.getSelectedRanges();
      return ranges[ranges.length - 2];
    }

    function isArrowKey(event) {
      return event.which === KEY_RIGHT || event.which === KEY_UP || event.which === KEY_LEFT || event.which === KEY_DOWN;
    }

    function isModifiedByShiftOnly(event) {
      return event.shiftKey && !event.ctrlKey && !event.altKey;
    }

    function isShiftArrowKey(event) {
      return isModifiedByShiftOnly(event) && isArrowKey(event);
    }

    function hasActiveCell() {
      return !!grid.getActiveCell();
    }

    function selectOnlyRangeOfActiveCell() {
      var cellSelectionModel = grid.getSelectionModel();
      var ranges = cellSelectionModel.getSelectedRanges();

      if (ranges.length > 1) {
        cellSelectionModel.setSelectedRanges([ranges.pop()]);
      }
    }
  };

  return ActiveCellCapture;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 331:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(32)], __WEBPACK_AMD_DEFINE_RESULT__ = function (RangeSelectionHelper) {
  return {
    getUnion: function getUnion(allRanges) {
      if (_.isEmpty(allRanges)) {
        return [];
      }

      allRanges.sort(firstElementNumberComparator);
      var unionedRanges = [allRanges[0]];

      allRanges.forEach(function (range) {
        var maxBeginningOfRange = _.last(unionedRanges);
        if (isStartInsideRange(range, maxBeginningOfRange)) {
          if (!isEndInsideRange(range, maxBeginningOfRange)) {
            maxBeginningOfRange[1] = range[1];
          }
        } else {
          unionedRanges.push(range);
        }
      });

      return unionedRanges;

      function firstElementNumberComparator(a, b) {
        return a[0] - b[0];
      }

      function isStartInsideRange(range, surroundingRange) {
        return range[0] <= surroundingRange[1] + 1;
      }

      function isEndInsideRange(range, surroundingRange) {
        return range[1] <= surroundingRange[1];
      }
    },

    mapDimensionBoundaryUnion: function mapDimensionBoundaryUnion(unionedDimensionBoundaries, iteratee) {
      var mapResult = [];
      unionedDimensionBoundaries.forEach(function (subrange) {
        for (var index = subrange[0]; index <= subrange[1]; index += 1) {
          mapResult.push(iteratee(index));
        }
      });
      return mapResult;
    },

    mapOver2DArray: function mapOver2DArray(rowRangeBounds, colRangeBounds, processCell, rowCollector) {
      var unionedRowRanges = this.getUnion(rowRangeBounds);
      var unionedColRanges = this.getUnion(colRangeBounds);

      return this.mapDimensionBoundaryUnion(unionedRowRanges, function (rowId) {
        var rowData = this.mapDimensionBoundaryUnion(unionedColRanges, function (colId) {
          return processCell(rowId, colId);
        });
        return rowCollector(rowData);
      }.bind(this));
    },

    rangesToCsv: function rangesToCsv(data, columnDefinitions, selectedRanges) {

      var rowRangeBounds = selectedRanges.map(function (range) {
        return [range.fromRow, range.toRow];
      });
      var colRangeBounds = selectedRanges.map(function (range) {
        return [range.fromCell, range.toCell];
      });

      if (!RangeSelectionHelper.isFirstColumnData(columnDefinitions)) {
        colRangeBounds = this.removeFirstColumn(colRangeBounds);
      }

      var csvRows = this.mapOver2DArray(rowRangeBounds, colRangeBounds, this.csvCell.bind(this, data, columnDefinitions), function (rowData) {
        return rowData.join(',');
      });

      return csvRows.join('\n');
    },

    removeFirstColumn: function removeFirstColumn(colRangeBounds) {
      var unionedColRanges = this.getUnion(colRangeBounds);

      if (unionedColRanges.length == 0) {
        return [];
      }

      var firstSubrangeStartsAt0 = function firstSubrangeStartsAt0() {
        return unionedColRanges[0][0] == 0;
      };

      function firstSubrangeIsJustFirstColumn() {
        return unionedColRanges[0][1] == 0;
      }

      if (firstSubrangeStartsAt0()) {
        if (firstSubrangeIsJustFirstColumn()) {
          unionedColRanges.shift();
        } else {
          unionedColRanges[0][0] = 1;
        }
      }
      return unionedColRanges;
    },

    csvCell: function csvCell(data, columnDefinitions, rowId, colId) {
      var val = data[rowId][columnDefinitions[colId].field];

      if (val && _.isObject(val)) {
        val = '\'' + JSON.stringify(val) + '\'';
      } else if (val && typeof val != 'number' && typeof val != 'boolean') {
        val = '\'' + val.toString() + '\'';
      } else if (_.isNull(val) || _.isUndefined(val)) {
        val = '';
      }
      return val;
    }
  };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),

/***/ 332:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1), __webpack_require__(32), __webpack_require__(78)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, _, RangeSelectionHelper) {
  var XCellSelectionModel = function XCellSelectionModel(options) {

    var KEY_ARROW_RIGHT = 39;
    var KEY_ARROW_LEFT = 37;
    var KEY_ARROW_UP = 38;
    var KEY_ARROW_DOWN = 40;

    var Slick = window.Slick;
    var _grid;
    var _ranges = [];
    var _self = this;
    var _selector = new Slick.CellRangeSelector({
      selectionCss: {
        border: '2px solid black'
      },
      offset: {
        top: 0,
        left: -1,
        height: 2,
        width: 1
      }
    });
    var _options;
    var _defaults = {
      selectActiveCell: true
    };

    function init(grid) {
      _options = $.extend(true, {}, _defaults, options);
      _grid = grid;
      _grid.onActiveCellChanged.subscribe(handleActiveCellChange);
      _grid.onKeyDown.subscribe(handleKeyDown);
      grid.registerPlugin(_selector);
      _selector.onCellRangeSelected.subscribe(handleCellRangeSelected);
      _selector.onBeforeCellRangeSelected.subscribe(handleBeforeCellRangeSelected);
      $(window.parent).mouseup(handleWindowMouseUp);
    }

    function destroy() {
      _grid.onActiveCellChanged.unsubscribe(handleActiveCellChange);
      _grid.onKeyDown.unsubscribe(handleKeyDown);
      _selector.onCellRangeSelected.unsubscribe(handleCellRangeSelected);
      _selector.onBeforeCellRangeSelected.unsubscribe(handleBeforeCellRangeSelected);
      _grid.unregisterPlugin(_selector);
      $(window.parent).off('mouseup', handleWindowMouseUp);
    }

    function removeInvalidRanges(ranges) {
      var result = [];

      for (var i = 0; i < ranges.length; i++) {
        var r = ranges[i];
        if (_grid.canCellBeSelected(r.fromRow, r.fromCell) && _grid.canCellBeSelected(r.toRow, r.toCell)) {
          result.push(r);
        }
      }

      return result;
    }

    function setSelectedRanges(ranges) {
      // simple check for: empty selection didn't change, prevent firing onSelectedRangesChanged
      if ((!_ranges || _ranges.length === 0) && (!ranges || ranges.length === 0)) {
        return;
      }

      _ranges = removeInvalidRanges(ranges);
      _self.onSelectedRangesChanged.notify(_ranges);
    }

    function getSelectedRanges() {
      return _ranges;
    }

    function setSelectedRows(rows) {
      _ranges = [];

      for (var i = 0; i < rows.length; i++) {
        _ranges.push(RangeSelectionHelper.rangeForRow(_grid, rows[i]));
      }
    }

    function handleBeforeCellRangeSelected(e) {
      if (_grid.getEditorLock().isActive()) {
        e.stopPropagation();
        return false;
      }
    }

    function handleCellRangeSelected(e, args) {
      setSelectedRanges([args.range]);
    }

    function handleActiveCellChange(e, args) {
      if (_options.selectActiveCell && args.row != null && args.cell != null) {
        setSelectedRanges([new Slick.Range(args.row, args.cell)]);
      }
    }

    function arrowKeyPressed(event) {
      return event.which == KEY_ARROW_RIGHT || event.which == KEY_ARROW_LEFT || event.which == KEY_ARROW_UP || event.which == KEY_ARROW_DOWN;
    }

    function shiftArrowKeyPressed(event) {
      return event.shiftKey && !event.ctrlKey && !event.altKey && arrowKeyPressed(event);
    }

    function needUpdateRange(newRange) {
      return removeInvalidRanges([newRange]).length;
    }

    function handleKeyDown(e) {
      var ranges;
      var lastSelectedRange;
      var anchorActiveCell = _grid.getActiveCell();

      function isKey(key) {
        return e.which === key;
      }

      function getKeycode() {
        return e.which;
      }

      function shouldScrollToBottommostRow() {
        return anchorActiveCell.row === newSelectedRange.fromRow;
      }

      function shouldScrollToRightmostColumn() {
        return anchorActiveCell.cell === newSelectedRange.fromCell;
      }

      function getMobileCellFromRange(range, activeCell) {
        var mobileCell = {};

        mobileCell.row = range.fromRow === activeCell.row ? range.toRow : range.fromRow;
        mobileCell.cell = range.fromCell === activeCell.cell ? range.toCell : range.fromCell;

        return mobileCell;
      }

      function getNewRange(rangeCorner, oppositeCorner) {
        var newFromCell = rangeCorner.cell <= oppositeCorner.cell ? rangeCorner.cell : oppositeCorner.cell;
        var newToCell = rangeCorner.cell <= oppositeCorner.cell ? oppositeCorner.cell : rangeCorner.cell;

        var newFromRow = rangeCorner.row <= oppositeCorner.row ? rangeCorner.row : oppositeCorner.row;
        var newToRow = rangeCorner.row <= oppositeCorner.row ? oppositeCorner.row : rangeCorner.row;

        return new Slick.Range(newFromRow, newFromCell, newToRow, newToCell);
      }

      if (anchorActiveCell && shiftArrowKeyPressed(e)) {
        ranges = getSelectedRanges();
        if (!ranges.length) {
          ranges.push(new Slick.Range(anchorActiveCell.row, anchorActiveCell.cell));
        }

        // keyboard can work with last range only
        lastSelectedRange = ranges.pop();

        // can't handle selection out of active cell
        if (!lastSelectedRange.contains(anchorActiveCell.row, anchorActiveCell.cell)) {
          lastSelectedRange = new Slick.Range(anchorActiveCell.row, anchorActiveCell.cell);
        }

        var mobileCell = getMobileCellFromRange(lastSelectedRange, anchorActiveCell);

        switch (getKeycode()) {
          case KEY_ARROW_LEFT:
            mobileCell.cell -= 1;
            break;
          case KEY_ARROW_RIGHT:
            mobileCell.cell += 1;
            break;
          case KEY_ARROW_UP:
            mobileCell.row -= 1;
            break;
          case KEY_ARROW_DOWN:
            mobileCell.row += 1;
            break;
        }

        var newSelectedRange = getNewRange(anchorActiveCell, mobileCell);

        if (needUpdateRange(newSelectedRange)) {
          var rowToView = shouldScrollToBottommostRow() ? newSelectedRange.toRow : newSelectedRange.fromRow;
          var columnToView = shouldScrollToRightmostColumn() ? newSelectedRange.toCell : newSelectedRange.fromCell;

          if (isKey(KEY_ARROW_RIGHT) || isKey(KEY_ARROW_LEFT)) {
            _grid.scrollColumnIntoView(columnToView);
          } else if (isKey(KEY_ARROW_UP) || isKey(KEY_ARROW_DOWN)) {
            _grid.scrollRowIntoView(rowToView);
          }
          ranges.push(newSelectedRange);
        } else {
          ranges.push(lastSelectedRange);
        }

        setSelectedRanges(ranges);

        e.preventDefault();
        e.stopPropagation();
      }
    }

    function handleWindowMouseUp() {
      var selectedRange = _selector.getCurrentRange();
      if (!_.isUndefined(selectedRange)) {
        _grid.onDragEnd.notify({ range: selectedRange });
      }
    }

    $.extend(this, {
      'getSelectedRanges': getSelectedRanges,
      'setSelectedRanges': setSelectedRanges,
      'setSelectedRows': setSelectedRows,

      'init': init,
      'destroy': destroy,

      'onSelectedRangesChanged': new Slick.Event()
    });
  };
  return XCellSelectionModel;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 333:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

/////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2017, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(1), __webpack_require__(32)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, _, RangeSelectionHelper) {
  function disableButton(selector) {
    $(selector).prop('disabled', true);
  }

  function enableButton(selector) {
    $(selector).prop('disabled', false);
  }

  function getRowPrimaryKeyValuesToStage(selectedRows, primaryKeys, dataView, client_primary_key) {
    return _.reduce(selectedRows, function (primaryKeyValuesToStage, dataGridRowIndex) {
      var gridRow = dataView.getItem(dataGridRowIndex);
      if (isRowMissingPrimaryKeys(gridRow, primaryKeys)) {
        return primaryKeyValuesToStage;
      }
      var tempPK = gridRow[client_primary_key];
      primaryKeyValuesToStage[tempPK] = getSingleRowPrimaryKeyValueToStage(primaryKeys, gridRow);
      return primaryKeyValuesToStage;
    }, {});
  }

  function isRowMissingPrimaryKeys(gridRow, primaryKeys) {
    if (_.isUndefined(gridRow)) {
      return true;
    }

    return !_.isUndefined(_.find(primaryKeys, function (pk) {
      return _.isUndefined(gridRow[pk]);
    }));
  }

  function getSingleRowPrimaryKeyValueToStage(primaryKeys, gridRow) {
    var rowToStage = {};
    if (primaryKeys && primaryKeys.length) {
      _.each(_.keys(gridRow), function (columnNames) {
        if (_.contains(primaryKeys, columnNames)) rowToStage[columnNames] = gridRow[columnNames];
      });
    }
    return rowToStage;
  }

  function getPrimaryKeysForSelectedRows(self, selectedRows) {
    var dataView = self.grid.getData();
    var stagedRows = getRowPrimaryKeyValuesToStage(selectedRows, _.keys(self.keys), dataView, self.client_primary_key);
    return stagedRows;
  }

  var setStagedRows = function setStagedRows() {
    var self = this;

    function setStagedRows(rowsToStage) {
      self.editor.handler.data_store.staged_rows = rowsToStage;
    }

    function isEditMode() {
      return self.editor.handler.can_edit;
    }

    disableButton('#btn-delete-row');
    disableButton('#btn-copy-row');

    function areAllSelectionsEntireRows() {
      return RangeSelectionHelper.areAllRangesCompleteRows(self.grid, self.selection.getSelectedRanges());
    }

    var selectedRanges = this.selection.getSelectedRanges();

    if (selectedRanges.length > 0) {
      enableButton('#btn-copy-row');
    }

    if (areAllSelectionsEntireRows()) {
      var selectedRows = RangeSelectionHelper.getIndexesOfCompleteRows(this.grid, this.selection.getSelectedRanges());
      var stagedRows = getPrimaryKeysForSelectedRows(self, selectedRows);
      setStagedRows(stagedRows);
      if (_.isEmpty(stagedRows)) {
        this.selection.setSelectedRows([]);
      }

      if (isEditMode()) {
        enableButton('#btn-delete-row');
      }
    } else {
      setStagedRows({});
    }
  };
  return setStagedRows;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 334:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HistoryCollection = undefined;

var _history_collection = __webpack_require__(335);

var _history_collection2 = _interopRequireDefault(_history_collection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.HistoryCollection = _history_collection2.default; /////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2017, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////

/***/ }),

/***/ 335:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2017, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////

var HistoryCollection = function () {
  function HistoryCollection(history_model) {
    _classCallCheck(this, HistoryCollection);

    this.historyList = history_model;
    this.onChange(function () {});
  }

  _createClass(HistoryCollection, [{
    key: "length",
    value: function length() {
      return this.historyList.length;
    }
  }, {
    key: "add",
    value: function add(object) {
      this.historyList.push(object);
      this.onChangeHandler(this.historyList);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.historyList = [];
      this.onResetHandler(this.historyList);
    }
  }, {
    key: "onChange",
    value: function onChange(onChangeHandler) {
      this.onChangeHandler = onChangeHandler;
    }
  }, {
    key: "onReset",
    value: function onReset(onResetHandler) {
      this.onResetHandler = onResetHandler;
    }
  }]);

  return HistoryCollection;
}();

exports.default = HistoryCollection;

/***/ }),

/***/ 336:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueryHistory = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(23);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(99);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactSplitPane = __webpack_require__(433);

var _reactSplitPane2 = _interopRequireDefault(_reactSplitPane);

var _underscore = __webpack_require__(1);

var _underscore2 = _interopRequireDefault(_underscore);

var _query_history_detail = __webpack_require__(471);

var _query_history_detail2 = _interopRequireDefault(_query_history_detail);

var _query_history_entries = __webpack_require__(477);

var _query_history_entries2 = _interopRequireDefault(_query_history_entries);

var _react_shapes = __webpack_require__(51);

var _react_shapes2 = _interopRequireDefault(_react_shapes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2017, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////

/* eslint-disable react/no-find-dom-node */

var queryEntryListDivStyle = {
  overflowY: 'auto'
};
var queryDetailDivStyle = {
  display: 'flex'
};

var QueryHistory = function (_React$Component) {
  _inherits(QueryHistory, _React$Component);

  function QueryHistory(props) {
    _classCallCheck(this, QueryHistory);

    var _this = _possibleConstructorReturn(this, (QueryHistory.__proto__ || Object.getPrototypeOf(QueryHistory)).call(this, props));

    _this.state = {
      history: [],
      selectedEntry: 0
    };

    _this.selectHistoryEntry = _this.selectHistoryEntry.bind(_this);
    return _this;
  }

  _createClass(QueryHistory, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      this.setHistory(this.props.historyCollection.historyList);
      this.selectHistoryEntry(0);

      this.props.historyCollection.onChange(function (historyList) {
        _this2.setHistory(historyList);
        _this2.selectHistoryEntry(0);
      });

      this.props.historyCollection.onReset(function () {
        _this2.setState({
          history: [],
          currentHistoryDetail: undefined,
          selectedEntry: 0
        });
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.selectHistoryEntry(0);
    }
  }, {
    key: 'refocus',
    value: function refocus() {
      var _this3 = this;

      if (this.state.history.length > 0) {
        setTimeout(function () {
          return _this3.retrieveSelectedQuery().parentElement.focus();
        }, 0);
      }
    }
  }, {
    key: 'retrieveSelectedQuery',
    value: function retrieveSelectedQuery() {
      return _reactDom2.default.findDOMNode(this).getElementsByClassName('selected')[0];
    }
  }, {
    key: 'setHistory',
    value: function setHistory(historyList) {
      this.setState({ history: this.orderedHistory(historyList) });
    }
  }, {
    key: 'selectHistoryEntry',
    value: function selectHistoryEntry(index) {
      this.setState({
        currentHistoryDetail: this.state.history[index],
        selectedEntry: index
      });
    }
  }, {
    key: 'orderedHistory',
    value: function orderedHistory(historyList) {
      return _underscore2.default.chain(historyList).sortBy(function (historyEntry) {
        return historyEntry.start_time;
      }).reverse().value();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        _reactSplitPane2.default,
        { defaultSize: '50%', split: 'vertical', pane1Style: queryEntryListDivStyle,
          pane2Style: queryDetailDivStyle },
        _react2.default.createElement(_query_history_entries2.default, { historyEntries: this.state.history,
          selectedEntry: this.state.selectedEntry,
          onSelectEntry: this.selectHistoryEntry
        }),
        _react2.default.createElement(_query_history_detail2.default, { historyEntry: this.state.currentHistoryDetail })
      );
    }
  }]);

  return QueryHistory;
}(_react2.default.Component);

exports.default = QueryHistory;


QueryHistory.propTypes = {
  historyCollection: _react_shapes2.default.historyCollectionClass.isRequired
};

exports.QueryHistory = QueryHistory;

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

/***/ }),

/***/ 44:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_44__;

/***/ }),

/***/ 45:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_45__;

/***/ }),

/***/ 471:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(_) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(23);

var _react2 = _interopRequireDefault(_react);

var _history_detail_metadata = __webpack_require__(472);

var _history_detail_metadata2 = _interopRequireDefault(_history_detail_metadata);

var _history_detail_query = __webpack_require__(473);

var _history_detail_query2 = _interopRequireDefault(_history_detail_query);

var _history_detail_message = __webpack_require__(475);

var _history_detail_message2 = _interopRequireDefault(_history_detail_message);

var _history_error_message = __webpack_require__(476);

var _history_error_message2 = _interopRequireDefault(_history_error_message);

var _react_shapes = __webpack_require__(51);

var _react_shapes2 = _interopRequireDefault(_react_shapes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //////////////////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2017, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////////////////

var QueryHistoryDetail = function (_React$Component) {
  _inherits(QueryHistoryDetail, _React$Component);

  function QueryHistoryDetail() {
    _classCallCheck(this, QueryHistoryDetail);

    return _possibleConstructorReturn(this, (QueryHistoryDetail.__proto__ || Object.getPrototypeOf(QueryHistoryDetail)).apply(this, arguments));
  }

  _createClass(QueryHistoryDetail, [{
    key: 'render',
    value: function render() {
      if (!_.isUndefined(this.props.historyEntry)) {
        var historyErrorMessage = null;
        if (!this.props.historyEntry.status) {
          historyErrorMessage = _react2.default.createElement(
            'div',
            { className: 'error-message-block' },
            _react2.default.createElement(_history_error_message2.default, this.props)
          );
        }

        return _react2.default.createElement(
          'div',
          { id: 'query_detail', className: 'query-detail' },
          historyErrorMessage,
          _react2.default.createElement(
            'div',
            { className: 'metadata-block' },
            _react2.default.createElement(_history_detail_metadata2.default, this.props)
          ),
          _react2.default.createElement(
            'div',
            { className: 'query-statement-block' },
            _react2.default.createElement(_history_detail_query2.default, this.props)
          ),
          _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement('hr', { className: 'block-divider' })
          ),
          _react2.default.createElement(
            'div',
            { className: 'message-block' },
            _react2.default.createElement(_history_detail_message2.default, this.props)
          )
        );
      } else {
        return _react2.default.createElement('p', null);
      }
    }
  }]);

  return QueryHistoryDetail;
}(_react2.default.Component);

exports.default = QueryHistoryDetail;


QueryHistoryDetail.propTypes = {
  historyEntry: _react_shapes2.default.historyDetail
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),

/***/ 472:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(23);

var _react2 = _interopRequireDefault(_react);

var _moment = __webpack_require__(47);

var _moment2 = _interopRequireDefault(_moment);

var _react_shapes = __webpack_require__(51);

var _react_shapes2 = _interopRequireDefault(_react_shapes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //////////////////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2017, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////////////////

var HistoryDetailMetadata = function (_React$Component) {
  _inherits(HistoryDetailMetadata, _React$Component);

  function HistoryDetailMetadata() {
    _classCallCheck(this, HistoryDetailMetadata);

    return _possibleConstructorReturn(this, (HistoryDetailMetadata.__proto__ || Object.getPrototypeOf(HistoryDetailMetadata)).apply(this, arguments));
  }

  _createClass(HistoryDetailMetadata, [{
    key: 'formatDate',
    value: function formatDate(date) {
      return (0, _moment2.default)(date).format('M-D-YY HH:mm:ss');
    }
  }, {
    key: 'queryMetaData',
    value: function queryMetaData(data, description) {
      return _react2.default.createElement(
        'div',
        { className: 'item' },
        _react2.default.createElement(
          'span',
          { className: 'value' },
          data
        ),
        _react2.default.createElement(
          'span',
          { className: 'description' },
          description
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'metadata' },
        this.queryMetaData(this.formatDate(this.props.historyEntry.start_time), 'Date'),
        this.queryMetaData(this.props.historyEntry.row_affected.toLocaleString(), 'Rows Affected'),
        this.queryMetaData(this.props.historyEntry.total_time, 'Duration')
      );
    }
  }]);

  return HistoryDetailMetadata;
}(_react2.default.Component);

exports.default = HistoryDetailMetadata;


HistoryDetailMetadata.propTypes = {
  historyEntry: _react_shapes2.default.historyDetail
};

/***/ }),

/***/ 473:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(23);

var _react2 = _interopRequireDefault(_react);

__webpack_require__(52);

var _code_mirror = __webpack_require__(474);

var _code_mirror2 = _interopRequireDefault(_code_mirror);

var _react_shapes = __webpack_require__(51);

var _react_shapes2 = _interopRequireDefault(_react_shapes);

var _clipboard = __webpack_require__(162);

var _clipboard2 = _interopRequireDefault(_clipboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //////////////////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2017, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////////////////

var HistoryDetailQuery = function (_React$Component) {
  _inherits(HistoryDetailQuery, _React$Component);

  function HistoryDetailQuery(props) {
    _classCallCheck(this, HistoryDetailQuery);

    var _this = _possibleConstructorReturn(this, (HistoryDetailQuery.__proto__ || Object.getPrototypeOf(HistoryDetailQuery)).call(this, props));

    _this.copyAllHandler = _this.copyAllHandler.bind(_this);
    _this.state = { isCopied: false };
    _this.timeout = undefined;
    return _this;
  }

  _createClass(HistoryDetailQuery, [{
    key: 'copyAllHandler',
    value: function copyAllHandler() {
      var _this2 = this;

      _clipboard2.default.copyTextToClipboard(this.props.historyEntry.query);

      this.clearPreviousTimeout();

      this.setState({ isCopied: true });
      this.timeout = setTimeout(function () {
        _this2.setState({ isCopied: false });
      }, 1500);
    }
  }, {
    key: 'clearPreviousTimeout',
    value: function clearPreviousTimeout() {
      if (this.timeout !== undefined) {
        clearTimeout(this.timeout);
        this.timeout = undefined;
      }
    }
  }, {
    key: 'copyButtonText',
    value: function copyButtonText() {
      return this.state.isCopied ? 'Copied!' : 'Copy All';
    }
  }, {
    key: 'copyButtonClass',
    value: function copyButtonClass() {
      return this.state.isCopied ? 'was-copied' : 'copy-all';
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { id: 'history-detail-query' },
        _react2.default.createElement(
          'button',
          { className: this.copyButtonClass(),
            onClick: this.copyAllHandler },
          this.copyButtonText()
        ),
        _react2.default.createElement(_code_mirror2.default, {
          value: this.props.historyEntry.query,
          options: {
            mode: 'text/x-pgsql',
            readOnly: true
          }
        })
      );
    }
  }]);

  return HistoryDetailQuery;
}(_react2.default.Component);

exports.default = HistoryDetailQuery;


HistoryDetailQuery.propTypes = {
  historyEntry: _react_shapes2.default.historyDetail
};

/***/ }),

/***/ 474:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(23);

var _react2 = _interopRequireDefault(_react);

var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

var _codemirror = __webpack_require__(29);

var _codemirror2 = _interopRequireDefault(_codemirror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //////////////////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2017, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////////////////

var CodeMirror = function (_React$Component) {
  _inherits(CodeMirror, _React$Component);

  function CodeMirror(props) {
    _classCallCheck(this, CodeMirror);

    var _this = _possibleConstructorReturn(this, (CodeMirror.__proto__ || Object.getPrototypeOf(CodeMirror)).call(this, props));

    _this.state = {
      shouldHydrate: true
    };
    return _this;
  }

  _createClass(CodeMirror, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.editor = (0, _codemirror2.default)(this.container);
      this.hydrateInterval = setInterval(this.hydrateWhenBecomesVisible.bind(this), 100);
      this.hydrate(this.props);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearInterval(this.hydrateInterval);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.hydrate(nextProps);
    }
  }, {
    key: 'hydrateWhenBecomesVisible',
    value: function hydrateWhenBecomesVisible() {
      var isVisible = (0, _jquery2.default)(this.container).is(':visible');

      if (isVisible && this.state.shouldHydrate) {
        this.hydrate(this.props);
        this.setState({ shouldHydrate: false });
      } else if (!isVisible) {
        this.setState({ shouldHydrate: true });
      }
    }
  }, {
    key: 'hydrate',
    value: function hydrate(props) {
      var _this2 = this;

      Object.keys(props.options || {}).forEach(function (key) {
        return _this2.editor.setOption(key, props.options[key]);
      });

      this.editor.setValue(props.value || '');
      this.editor.refresh();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement('div', { ref: function ref(self) {
          return _this3.container = self;
        } });
    }
  }]);

  return CodeMirror;
}(_react2.default.Component);

exports.default = CodeMirror;

/***/ }),

/***/ 475:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(23);

var _react2 = _interopRequireDefault(_react);

var _react_shapes = __webpack_require__(51);

var _react_shapes2 = _interopRequireDefault(_react_shapes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //////////////////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2017, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////////////////

var HistoryDetailMessage = function (_React$Component) {
  _inherits(HistoryDetailMessage, _React$Component);

  function HistoryDetailMessage() {
    _classCallCheck(this, HistoryDetailMessage);

    return _possibleConstructorReturn(this, (HistoryDetailMessage.__proto__ || Object.getPrototypeOf(HistoryDetailMessage)).apply(this, arguments));
  }

  _createClass(HistoryDetailMessage, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'message' },
        _react2.default.createElement(
          'div',
          { className: 'message-header' },
          'Messages'
        ),
        _react2.default.createElement(
          'div',
          { className: 'content' },
          _react2.default.createElement(
            'pre',
            { className: 'content-value' },
            this.props.historyEntry.message
          )
        )
      );
    }
  }]);

  return HistoryDetailMessage;
}(_react2.default.Component);

exports.default = HistoryDetailMessage;


HistoryDetailMessage.propTypes = {
  historyEntry: _react_shapes2.default.historyDetail
};

/***/ }),

/***/ 476:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(23);

var _react2 = _interopRequireDefault(_react);

var _react_shapes = __webpack_require__(51);

var _react_shapes2 = _interopRequireDefault(_react_shapes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //////////////////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2017, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////////////////

var HistoryErrorMessage = function (_React$Component) {
  _inherits(HistoryErrorMessage, _React$Component);

  function HistoryErrorMessage() {
    _classCallCheck(this, HistoryErrorMessage);

    return _possibleConstructorReturn(this, (HistoryErrorMessage.__proto__ || Object.getPrototypeOf(HistoryErrorMessage)).apply(this, arguments));
  }

  _createClass(HistoryErrorMessage, [{
    key: 'parseErrorMessage',
    value: function parseErrorMessage(message) {
      return message.match(/ERROR:\s*([^\n\r]*)/i)[1];
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'history-error-text' },
        _react2.default.createElement(
          'span',
          null,
          'Error Message'
        ),
        ' ',
        this.parseErrorMessage(this.props.historyEntry.message)
      );
    }
  }]);

  return HistoryErrorMessage;
}(_react2.default.Component);

exports.default = HistoryErrorMessage;


HistoryErrorMessage.propTypes = {
  historyEntry: _react_shapes2.default.historyDetail
};

/***/ }),

/***/ 477:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(23);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(99);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _underscore = __webpack_require__(1);

var _underscore2 = _interopRequireDefault(_underscore);

var _moment = __webpack_require__(47);

var _moment2 = _interopRequireDefault(_moment);

var _query_history_entry = __webpack_require__(478);

var _query_history_entry2 = _interopRequireDefault(_query_history_entry);

var _query_history_entry_date_group = __webpack_require__(479);

var _query_history_entry_date_group2 = _interopRequireDefault(_query_history_entry_date_group);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2017, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////

/* eslint-disable react/no-find-dom-node */

var ARROWUP = 38;
var ARROWDOWN = 40;

var QueryHistoryEntries = function (_React$Component) {
  _inherits(QueryHistoryEntries, _React$Component);

  function QueryHistoryEntries(props) {
    _classCallCheck(this, QueryHistoryEntries);

    var _this = _possibleConstructorReturn(this, (QueryHistoryEntries.__proto__ || Object.getPrototypeOf(QueryHistoryEntries)).call(this, props));

    _this.navigateUpAndDown = _this.navigateUpAndDown.bind(_this);
    return _this;
  }

  _createClass(QueryHistoryEntries, [{
    key: 'navigateUpAndDown',
    value: function navigateUpAndDown(event) {
      var arrowKeys = [ARROWUP, ARROWDOWN];
      var key = event.keyCode || event.which;
      if (arrowKeys.indexOf(key) > -1) {
        event.preventDefault();
        this.onKeyDownHandler(event);
        return false;
      }
      return true;
    }
  }, {
    key: 'onKeyDownHandler',
    value: function onKeyDownHandler(event) {
      if (this.isArrowDown(event)) {
        if (!this.isLastEntry()) {
          var nextEntry = this.props.selectedEntry + 1;
          this.props.onSelectEntry(nextEntry);

          if (this.isInvisible(this.getEntryFromList(nextEntry))) {
            this.getEntryFromList(nextEntry).scrollIntoView(false);
          }
        }
      } else if (this.isArrowUp(event)) {
        if (!this.isFirstEntry()) {
          var previousEntry = this.props.selectedEntry - 1;
          this.props.onSelectEntry(previousEntry);

          if (this.isInvisible(this.getEntryFromList(previousEntry))) {
            this.getEntryFromList(previousEntry).scrollIntoView(true);
          }
        }
      }
    }
  }, {
    key: 'retrieveGroups',
    value: function retrieveGroups() {
      var _this2 = this;

      var sortableKeyFormat = 'YYYY MM DD';
      var entriesGroupedByDate = _underscore2.default.groupBy(this.props.historyEntries, function (entry) {
        return (0, _moment2.default)(entry.start_time).format(sortableKeyFormat);
      });

      var elements = this.sortDesc(entriesGroupedByDate).map(function (key, index) {
        var groupElements = _this2.retrieveDateGroup(entriesGroupedByDate, key, index);
        var keyAsDate = (0, _moment2.default)(key, sortableKeyFormat).toDate();
        groupElements.unshift(_react2.default.createElement(
          'li',
          { key: 'group-' + index },
          _react2.default.createElement(_query_history_entry_date_group2.default, { date: keyAsDate })
        ));
        return groupElements;
      });

      return _react2.default.createElement(
        'ul',
        null,
        _underscore2.default.flatten(elements).map(function (element) {
          return element;
        })
      );
    }
  }, {
    key: 'retrieveDateGroup',
    value: function retrieveDateGroup(entriesGroupedByDate, key, parentIndex) {
      var _this3 = this;

      var startingEntryIndex = _underscore2.default.reduce(_underscore2.default.first(this.sortDesc(entriesGroupedByDate), parentIndex), function (memo, key) {
        return memo + entriesGroupedByDate[key].length;
      }, 0);

      return entriesGroupedByDate[key].map(function (entry, index) {
        return _react2.default.createElement(
          'li',
          { key: 'group-' + parentIndex + '-entry-' + index,
            className: 'list-item',
            tabIndex: 0,
            onClick: function onClick() {
              return _this3.props.onSelectEntry(startingEntryIndex + index);
            },
            onKeyDown: _this3.navigateUpAndDown },
          _react2.default.createElement(_query_history_entry2.default, {
            historyEntry: entry,
            isSelected: startingEntryIndex + index === _this3.props.selectedEntry })
        );
      });
    }
  }, {
    key: 'sortDesc',
    value: function sortDesc(entriesGroupedByDate) {
      return Object.keys(entriesGroupedByDate).sort().reverse();
    }
  }, {
    key: 'isInvisible',
    value: function isInvisible(element) {
      return this.isAbovePaneTop(element) || this.isBelowPaneBottom(element);
    }
  }, {
    key: 'isArrowUp',
    value: function isArrowUp(event) {
      return (event.keyCode || event.which) === ARROWUP;
    }
  }, {
    key: 'isArrowDown',
    value: function isArrowDown(event) {
      return (event.keyCode || event.which) === ARROWDOWN;
    }
  }, {
    key: 'isFirstEntry',
    value: function isFirstEntry() {
      return this.props.selectedEntry === 0;
    }
  }, {
    key: 'isLastEntry',
    value: function isLastEntry() {
      return this.props.selectedEntry === this.props.historyEntries.length - 1;
    }
  }, {
    key: 'isAbovePaneTop',
    value: function isAbovePaneTop(element) {
      var paneElement = _reactDom2.default.findDOMNode(this).parentElement;
      return element.getBoundingClientRect().top < paneElement.getBoundingClientRect().top;
    }
  }, {
    key: 'isBelowPaneBottom',
    value: function isBelowPaneBottom(element) {
      var paneElement = _reactDom2.default.findDOMNode(this).parentElement;
      return element.getBoundingClientRect().bottom > paneElement.getBoundingClientRect().bottom;
    }
  }, {
    key: 'getEntryFromList',
    value: function getEntryFromList(entryIndex) {
      return _reactDom2.default.findDOMNode(this).getElementsByClassName('entry')[entryIndex];
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { id: 'query_list',
          className: 'query-history' },
        this.retrieveGroups()
      );
    }
  }]);

  return QueryHistoryEntries;
}(_react2.default.Component);

exports.default = QueryHistoryEntries;


QueryHistoryEntries.propTypes = {
  historyEntries: _react2.default.PropTypes.array.isRequired,
  selectedEntry: _react2.default.PropTypes.number.isRequired,
  onSelectEntry: _react2.default.PropTypes.func.isRequired
};

/***/ }),

/***/ 478:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(23);

var _react2 = _interopRequireDefault(_react);

var _react_shapes = __webpack_require__(51);

var _react_shapes2 = _interopRequireDefault(_react_shapes);

var _moment = __webpack_require__(47);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //////////////////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2017, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////////////////

var QueryHistoryEntry = function (_React$Component) {
  _inherits(QueryHistoryEntry, _React$Component);

  function QueryHistoryEntry() {
    _classCallCheck(this, QueryHistoryEntry);

    return _possibleConstructorReturn(this, (QueryHistoryEntry.__proto__ || Object.getPrototypeOf(QueryHistoryEntry)).apply(this, arguments));
  }

  _createClass(QueryHistoryEntry, [{
    key: 'formatDate',
    value: function formatDate(date) {
      return (0, _moment2.default)(date).format('HH:mm:ss');
    }
  }, {
    key: 'renderWithClasses',
    value: function renderWithClasses(outerDivStyle) {
      return _react2.default.createElement(
        'div',
        { className: 'entry ' + outerDivStyle },
        _react2.default.createElement(
          'div',
          { className: 'query' },
          this.props.historyEntry.query
        ),
        _react2.default.createElement(
          'div',
          { className: 'other-info' },
          _react2.default.createElement(
            'div',
            { className: 'timestamp' },
            this.formatDate(this.props.historyEntry.start_time)
          )
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.hasError()) {
        if (this.props.isSelected) {
          return this.renderWithClasses('error selected');
        } else {
          return this.renderWithClasses('error');
        }
      } else {
        if (this.props.isSelected) {
          return this.renderWithClasses('selected');
        } else {
          return this.renderWithClasses('');
        }
      }
    }
  }, {
    key: 'hasError',
    value: function hasError() {
      return !this.props.historyEntry.status;
    }
  }]);

  return QueryHistoryEntry;
}(_react2.default.Component);

exports.default = QueryHistoryEntry;


QueryHistoryEntry.propTypes = {
  historyEntry: _react_shapes2.default.historyDetail,
  isSelected: _react2.default.PropTypes.bool
};

/***/ }),

/***/ 479:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(23);

var _react2 = _interopRequireDefault(_react);

var _moment = __webpack_require__(47);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } //////////////////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2017, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////////////////

var QueryHistoryEntryDateGroup = function (_React$Component) {
  _inherits(QueryHistoryEntryDateGroup, _React$Component);

  function QueryHistoryEntryDateGroup() {
    _classCallCheck(this, QueryHistoryEntryDateGroup);

    return _possibleConstructorReturn(this, (QueryHistoryEntryDateGroup.__proto__ || Object.getPrototypeOf(QueryHistoryEntryDateGroup)).apply(this, arguments));
  }

  _createClass(QueryHistoryEntryDateGroup, [{
    key: 'getDatePrefix',
    value: function getDatePrefix() {
      var prefix = '';
      if (this.isDaysBefore(0)) {
        prefix = 'Today - ';
      } else if (this.isDaysBefore(1)) {
        prefix = 'Yesterday - ';
      }
      return prefix;
    }
  }, {
    key: 'getDateFormatted',
    value: function getDateFormatted(momentToFormat) {
      return momentToFormat.format(QueryHistoryEntryDateGroup.formatString);
    }
  }, {
    key: 'getDateMoment',
    value: function getDateMoment() {
      return (0, _moment2.default)(this.props.date);
    }
  }, {
    key: 'isDaysBefore',
    value: function isDaysBefore(before) {
      return this.getDateFormatted(this.getDateMoment()) === this.getDateFormatted((0, _moment2.default)().subtract(before, 'days'));
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'date-label' },
        this.getDatePrefix(),
        this.getDateFormatted(this.getDateMoment())
      );
    }
  }]);

  return QueryHistoryEntryDateGroup;
}(_react2.default.Component);

exports.default = QueryHistoryEntryDateGroup;


QueryHistoryEntryDateGroup.propTypes = {
  date: _react2.default.PropTypes.instanceOf(Date).isRequired
};

QueryHistoryEntryDateGroup.formatString = 'MMM DD YYYY';

/***/ }),

/***/ 480:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var F5_KEY = 116,
    F7_KEY = 118,
    F8_KEY = 119,
    PERIOD_KEY = 190,
    FWD_SLASH_KEY = 191;

function keyboardShortcuts(sqlEditorController, queryToolActions, event) {
  if (sqlEditorController.isQueryRunning()) {
    return;
  }

  var keyCode = event.which || event.keyCode;

  if (keyCode === F5_KEY) {
    event.preventDefault();
    queryToolActions.executeQuery(sqlEditorController);
  } else if (event.shiftKey && keyCode === F7_KEY) {
    _stopEventPropagation();
    queryToolActions.explainAnalyze(sqlEditorController);
  } else if (keyCode === F7_KEY) {
    _stopEventPropagation();
    queryToolActions.explain(sqlEditorController);
  } else if (keyCode === F8_KEY) {
    event.preventDefault();
    queryToolActions.download(sqlEditorController);
  } else if ((this.isMac() && event.metaKey || !this.isMac() && event.ctrlKey) && event.shiftKey && keyCode === FWD_SLASH_KEY) {
    _stopEventPropagation();
    queryToolActions.commentBlockCode(sqlEditorController);
  } else if ((this.isMac() && event.metaKey || !this.isMac() && event.ctrlKey) && keyCode === FWD_SLASH_KEY) {
    _stopEventPropagation();
    queryToolActions.commentLineCode(sqlEditorController);
  } else if ((this.isMac() && event.metaKey || !this.isMac() && event.ctrlKey) && keyCode === PERIOD_KEY) {
    _stopEventPropagation();
    queryToolActions.uncommentLineCode(sqlEditorController);
  }

  function _stopEventPropagation() {
    event.cancelBubble = true;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
}

function isMac() {
  return window.navigator.platform.search('Mac') != -1;
}

module.exports = {
  processEvent: keyboardShortcuts,
  isMac: isMac
};

/***/ }),

/***/ 481:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _jquery = __webpack_require__(0);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var queryToolActions = {
  _verbose: function _verbose() {
    return (0, _jquery2.default)('.explain-verbose').hasClass('visibility-hidden') ? 'OFF' : 'ON';
  },

  _costsEnabled: function _costsEnabled() {
    return (0, _jquery2.default)('.explain-costs').hasClass('visibility-hidden') ? 'OFF' : 'ON';
  },

  _buffers: function _buffers() {
    return (0, _jquery2.default)('.explain-buffers').hasClass('visibility-hidden') ? 'OFF' : 'ON';
  },

  _timing: function _timing() {
    return (0, _jquery2.default)('.explain-timing').hasClass('visibility-hidden') ? 'OFF' : 'ON';
  },

  _clearMessageTab: function _clearMessageTab() {
    (0, _jquery2.default)('.sql-editor-message').html('');
  },

  executeQuery: function executeQuery(sqlEditorController) {
    if (sqlEditorController.is_query_tool) {
      this._clearMessageTab();
      sqlEditorController.execute();
    } else {
      sqlEditorController.execute_data_query();
    }
  },

  explainAnalyze: function explainAnalyze(sqlEditorController) {
    var costEnabled = this._costsEnabled();
    var verbose = this._verbose();
    var buffers = this._buffers();
    var timing = this._timing();
    var explainAnalyzeQuery = 'EXPLAIN (FORMAT JSON, ANALYZE ON, VERBOSE ' + verbose + ', COSTS ' + costEnabled + ', BUFFERS ' + buffers + ', TIMING ' + timing + ') ';
    sqlEditorController.execute(explainAnalyzeQuery);
  },

  explain: function explain(sqlEditorController) {
    var costEnabled = this._costsEnabled();
    var verbose = this._verbose();

    var explainQuery = 'EXPLAIN (FORMAT JSON, ANALYZE OFF, VERBOSE ' + verbose + ', COSTS ' + costEnabled + ', BUFFERS OFF, TIMING OFF) ';
    sqlEditorController.execute(explainQuery);
  },

  download: function download(sqlEditorController) {
    var sqlQuery = sqlEditorController.gridView.query_tool_obj.getSelection();

    if (!sqlQuery) {
      sqlQuery = sqlEditorController.gridView.query_tool_obj.getValue();
    }

    if (!sqlQuery) return;

    var filename = 'data-' + new Date().getTime() + '.csv';

    if (!sqlEditorController.is_query_tool) {
      filename = sqlEditorController.table_name + '.csv';
    }

    sqlEditorController.trigger_csv_download(sqlQuery, filename);
  },

  commentBlockCode: function commentBlockCode(sqlEditorController) {
    var codeMirrorObj = sqlEditorController.gridView.query_tool_obj;

    if (!codeMirrorObj.getValue()) return;

    codeMirrorObj.toggleComment(codeMirrorObj.getCursor(true), codeMirrorObj.getCursor(false));
  },

  commentLineCode: function commentLineCode(sqlEditorController) {
    var codeMirrorObj = sqlEditorController.gridView.query_tool_obj;

    if (!codeMirrorObj.getValue()) return;

    codeMirrorObj.lineComment(codeMirrorObj.getCursor(true), codeMirrorObj.getCursor(false), { lineComment: '--' });
  },

  uncommentLineCode: function uncommentLineCode(sqlEditorController) {
    var codeMirrorObj = sqlEditorController.gridView.query_tool_obj;

    if (!codeMirrorObj.getValue()) return;

    codeMirrorObj.uncomment(codeMirrorObj.getCursor(true), codeMirrorObj.getCursor(false), { lineComment: '--' });
  }
};

module.exports = queryToolActions;

/***/ }),

/***/ 482:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

__webpack_require__(483);

__webpack_require__(484);

__webpack_require__(78);

__webpack_require__(485);

__webpack_require__(486);

__webpack_require__(487);

__webpack_require__(488);

__webpack_require__(489);

__webpack_require__(490);

__webpack_require__(491);

exports.default = window.Slick;

/***/ }),

/***/ 495:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(200), __webpack_require__(32)], __WEBPACK_AMD_DEFINE_RESULT__ = function (copyData, RangeSelectionHelper) {
  return function handleQueryOutputKeyboardEvent(event, args) {
    var KEY_C = 67;
    var KEY_A = 65;
    var modifiedKey = event.keyCode;
    var isModifierDown = event.ctrlKey || event.metaKey;
    var self = this || window;
    self.slickgrid = args.grid;

    if (isModifierDown && modifiedKey == KEY_C) {
      copyData.apply(self);
    }

    if (isModifierDown && modifiedKey == KEY_A) {
      RangeSelectionHelper.selectAll(self.slickgrid);
    }
  };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(45)], __WEBPACK_AMD_DEFINE_RESULT__ = function (endpoints) {
  /***
   * This method behaves as a drop-in replacement for flask url_for function.
   * It uses the exposed URLs file under the hood, and replace the substitions provided by the modules.
   *
   * ex.
   * url_for("help.static", {filename: "server_dialog.html"}) will produce the
   * output string '/help/help/server_dialog.html' from the url ->
   * '/help/help/<path:filename>'.
   *
   * @param {String} text
   * @param {Object} substitutions
   */
  return function url_for(endpoint, substitutions) {

    var rawURL = endpoints[endpoint];

    // captures things of the form <path:substitutionName>
    var substitutionGroupsRegExp = /([<])([^:^>]*:)?([^>]+)([>])/g;
    var matchFound;

    var interpolated = rawURL;

    if (!rawURL) return rawURL;

    interpolated = interpolated.replace(substitutionGroupsRegExp, function (_origin, _1, _2, substitutionName) {
      if (substitutionName in substitutions) {
        return substitutions[substitutionName];
      }
      return _origin;
    });

    return interpolated;
  };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 51:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(23);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var historyDetail = _react2.default.PropTypes.shape({
  query: _react2.default.PropTypes.string,
  start_time: _react2.default.PropTypes.instanceOf(Date),
  status: _react2.default.PropTypes.bool,
  total_time: _react2.default.PropTypes.string,
  row_affected: _react2.default.PropTypes.int,
  message: _react2.default.PropTypes.string
}); //////////////////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2017, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////////////////

var historyCollectionClass = _react2.default.PropTypes.shape({
  historyList: _react2.default.PropTypes.array.isRequired,
  onChange: _react2.default.PropTypes.func.isRequired
});

exports.default = {
  historyDetail: historyDetail,
  historyCollectionClass: historyCollectionClass
};

/***/ }),

/***/ 77:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_77__;

/***/ }),

/***/ 96:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_96__;

/***/ }),

/***/ 97:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _underscore = __webpack_require__(1);

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generate_url(baseUrl, treeInfo, actionType, nodeType, pickFunction, itemDataID) {
  var ref = '';
  _underscore2.default.each(_underscore2.default.sortBy(_underscore2.default.pick(treeInfo, pickFunction), function (treeInfoItems) {
    return treeInfoItems.priority;
  }), function (treeInfoItems) {
    ref = ref + '/' + encodeURI(treeInfoItems._id);
  });
  ref = itemDataID ? ref + '/' + itemDataID : ref + '/';

  return '' + baseUrl + nodeType + '/' + actionType + ref;
}

module.exports = {
  generate_url: generate_url
};

/***/ })

},[324])["default"]});;
//# sourceMappingURL=sqleditor.js.map