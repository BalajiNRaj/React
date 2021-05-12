"use strict";
exports.__esModule = true;
var EMPTY = "";
var INDEX_NOT_FOUND = -1;
var PAD_LIMIT = 8192;
var MAX_VALUE = 0x7fffffff;
var whiteSpaceRegEx = new RegExp(/^\s$/);
var CharUtils = {
    isAscii: function (ch) {
        return ch.charCodeAt(0) < 128;
    },
    isAsciiControl: function (ch) {
        return ch.charCodeAt(0) < 32 || ch.charCodeAt(0) == 127;
    },
    isAsciiAlpha: function (ch) {
        return (ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z');
    },
    isAsciiAlphaUpper: function (ch) {
        return ch >= 'A' && ch <= 'Z';
    },
    isAsciiAlphaLower: function (ch) {
        return ch >= 'a' && ch <= 'z';
    },
    isAsciiNumeric: function (ch) {
        return ch >= '0' && ch <= '9';
    },
    isAsciiAlphanumeric: function (ch) {
        return (ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9');
    },
    isHighSurrogate: function (ch) {
        return ('\uD800' <= ch && '\uDBFF' >= ch);
    },
    isAsciiPrintable: function (ch) {
        return ch.charCodeAt(0) >= 32 && ch.charCodeAt(0) < 127;
    },
    LF: '\n',
    CR: '\r',
    UPPERCASE_LETTER: 1,
    LOWERCASE_LETTER: 2
};
var Character = {
    isWhitespace: function (x) {
        return whiteSpaceRegEx.test(x.charAt(0));
    },
    getType: function (ch) {
        if (CharUtils.isAsciiAlphaUpper(ch))
            return 1;
        if (CharUtils.isAsciiAlphaLower(ch))
            return 2;
    },
    toTitleCase: function (s) {
        s = (s === undefined || s === null) ? '' : s;
        return s.toString().toLowerCase().replace(/\b([a-z])/g, function (ch) {
            return ch.toUpperCase();
        });
    }
};
var isEmpty = function (str) {
    return str == null || str.length == 0;
};
var isBlank = function (str) {
    var strLen;
    if (str == null || (strLen = str.length) == 0) {
        return true;
    }
    for (var i = 0; i < strLen; i++) {
        if ((Character.isWhitespace(str.charAt(i)) == false)) {
            return false;
        }
    }
    return true;
};
var trim = function (str) {
    return str == null ? null : str.trim();
};
var strip = function (str, stripChars) {
    if (isEmpty(str)) {
        return str;
    }
    str = stripStart(str, stripChars);
    return stripEnd(str, stripChars);
};
var stripStart = function (str, stripChars) {
    var strLen;
    if (str == null || (strLen = str.length) == 0) {
        return str;
    }
    var start = 0;
    if (stripChars == null) {
        while ((start != strLen) && Character.isWhitespace(str.charAt(start))) {
            start++;
        }
    }
    else if (stripChars.length == 0) {
        return str;
    }
    else {
        while ((start != strLen) && (stripChars.indexOf(str.charAt(start)) != INDEX_NOT_FOUND)) {
            start++;
        }
    }
    return str.substring(start);
};
var stripEnd = function (str, stripChars) {
    var end;
    if (str == null || (end = str.length) == 0) {
        return str;
    }
    if (stripChars == null) {
        while ((end != 0) && Character.isWhitespace(str.charAt(end - 1))) {
            end--;
        }
    }
    else if (stripChars.length == 0) {
        return str;
    }
    else {
        while ((end != 0) && (stripChars.indexOf(str.charAt(end - 1)) != INDEX_NOT_FOUND)) {
            end--;
        }
    }
    return str.substring(0, end);
};
var stripAll = function (strs, stripChars) {
    var strsLen;
    if (strs == null || (strsLen = strs.length) == 0) {
        return strs;
    }
    var newArr = [];
    for (var i = 0; i < strsLen; i++) {
        newArr[i] = strip(strs[i], stripChars);
    }
    return newArr;
};
var equalsIgnoreCase = function (str1, str2) {
    return (str1 == str2) ? true
        : (str2 != null)
            && (str2.length == str1.length)
            && regionMatches(true, str1, str2, 0, 0, str1.length);
};
var regionMatches = function (ignoreCase, value, other, toffset, ooffset, len) {
    var ta = value;
    var pa = other;
    var to = toffset;
    var po = ooffset;
    if ((ooffset < 0) || (toffset < 0)
        || (toffset > value.length - len)
        || (ooffset > other.length - len)) {
        return false;
    }
    while (len-- > 0) {
        var c1 = ta[to++];
        var c2 = pa[po++];
        if (c1 == c2) {
            continue;
        }
        if (ignoreCase) {
            var u1 = c1.toUpperCase();
            var u2 = c2.toUpperCase();
            if (u1 == u2) {
                continue;
            }
            if (u1.toLowerCase() == u2.toLowerCase()) {
                continue;
            }
        }
        return false;
    }
    return true;
};
var ordinalIndexOf = function (str, searchStr, ordinal, lastIndex) {
    if (str == null || searchStr == null || ordinal <= 0) {
        return INDEX_NOT_FOUND;
    }
    if (searchStr.length == 0) {
        return lastIndex ? str.length : 0;
    }
    var found = 0;
    var index = lastIndex ? str.length : INDEX_NOT_FOUND;
    do {
        if (lastIndex) {
            index = str.lastIndexOf(searchStr, index - 1);
        }
        else {
            index = str.indexOf(searchStr, index + 1);
        }
        if (index < 0) {
            return index;
        }
        found++;
    } while (found < ordinal);
    return index;
};
var indexOfIgnoreCase = function (str, searchStr, startPos) {
    if (str == null || searchStr == null) {
        return INDEX_NOT_FOUND;
    }
    if (startPos < 0) {
        startPos = 0;
    }
    var endLimit = (str.length - searchStr.length) + 1;
    if (startPos > endLimit) {
        return INDEX_NOT_FOUND;
    }
    if (searchStr.length == 0) {
        return startPos;
    }
    for (var i = startPos; i < endLimit; i++) {
        if (regionMatches(true, str, searchStr, i, 0, searchStr.length)) {
            return i;
        }
    }
    return INDEX_NOT_FOUND;
};
var lastIndexOfIgnoreCase = function (str, searchStr, startPos) {
    if (str == null || searchStr == null) {
        return INDEX_NOT_FOUND;
    }
    if (startPos > (str.length - searchStr.length)) {
        startPos = str.length - searchStr.length;
    }
    if (startPos < 0) {
        return INDEX_NOT_FOUND;
    }
    if (searchStr.length == 0) {
        return startPos;
    }
    for (var i = startPos; i >= 0; i--) {
        if (regionMatches(true, str, searchStr, i, 0, searchStr.length)) {
            return i;
        }
    }
    return INDEX_NOT_FOUND;
};
var indexOfAnyBut = function (str, searchChars) {
    if (isEmpty(str) || searchChars.length === 0) {
        return INDEX_NOT_FOUND;
    }
    var csLen = str.length;
    var csLast = csLen - 1;
    var searchLen = searchChars.length;
    var searchLast = searchLen - 1;
    outer: for (var i = 0; i < csLen; i++) {
        var ch = str.charAt(i);
        for (var j = 0; j < searchLen; j++) {
            if (searchChars[j] == ch) {
                if (i < csLast && j < searchLast && CharUtils.isHighSurrogate(ch)) {
                    if (searchChars[j + 1] == str.charAt(i + 1)) {
                        continue outer;
                    }
                }
                else {
                    continue outer;
                }
            }
        }
        return i;
    }
    return INDEX_NOT_FOUND;
};
var substringBetween = function (str, open, close) {
    if (str == null || open == null || close == null) {
        return null;
    }
    var start = str.indexOf(open);
    if (start != INDEX_NOT_FOUND) {
        var end = str.indexOf(close, start + open.length);
        if (end != INDEX_NOT_FOUND) {
            return str.substring(start + open.length, end);
        }
    }
    return null;
};
var substringWEnd = function (str, start, end) {
    if (str == null) {
        return null;
    }
    if (end < 0) {
        end = str.length + end;
    }
    if (start < 0) {
        start = str.length + start;
    }
    if (end > str.length) {
        end = str.length;
    }
    if (start > end) {
        return EMPTY;
    }
    if (start < 0) {
        start = 0;
    }
    if (end < 0) {
        end = 0;
    }
    return str.substring(start, end);
};
var split = function (str, separatorChars, max) {
    return splitWorkerMax(str, separatorChars, max, false);
};
var splitWorkerMax = function (str, separatorChars, max, preserveAllTokens) {
    if (str == null) {
        return null;
    }
    var len = str.length;
    if (len == 0) {
        return [];
    }
    var list = [];
    var sizePlus1 = 1;
    var i = 0, start = 0;
    var match = false;
    var lastMatch = false;
    if (separatorChars == null) {
        while (i < len) {
            if (Character.isWhitespace(str.charAt(i))) {
                if (match || preserveAllTokens) {
                    lastMatch = true;
                    if (sizePlus1++ == max) {
                        i = len;
                        lastMatch = false;
                    }
                    list.push(str.substring(start, i));
                    match = false;
                }
                start = ++i;
                continue;
            }
            lastMatch = false;
            match = true;
            i++;
        }
    }
    else if (separatorChars.length == 1) {
        var sep = separatorChars.charAt(0);
        while (i < len) {
            if (str.charAt(i) == sep) {
                if (match || preserveAllTokens) {
                    lastMatch = true;
                    if (sizePlus1++ == max) {
                        i = len;
                        lastMatch = false;
                    }
                    list.push(str.substring(start, i));
                    match = false;
                }
                start = ++i;
                continue;
            }
            lastMatch = false;
            match = true;
            i++;
        }
    }
    else {
        while (i < len) {
            if (separatorChars.indexOf(str.charAt(i)) >= 0) {
                if (match || preserveAllTokens) {
                    lastMatch = true;
                    if (sizePlus1++ == max) {
                        i = len;
                        lastMatch = false;
                    }
                    list.push(str.substring(start, i));
                    match = false;
                }
                start = ++i;
                continue;
            }
            lastMatch = false;
            match = true;
            i++;
        }
    }
    if (match || (preserveAllTokens && lastMatch)) {
        list.push(str.substring(start, i));
    }
    return list;
};
var splitByWholeSeparatorWorker = function (str, separator, max, preserveAllTokens) {
    if (str == null) {
        return null;
    }
    var len = str.length;
    if (len == 0) {
        return [];
    }
    if ((separator == null) || (EMPTY === separator)) {
        return splitWorkerMax(str, null, max, preserveAllTokens);
    }
    var separatorLength = separator.length;
    var substrings = [];
    var numberOfSubstrings = 0;
    var beg = 0;
    var end = 0;
    while (end < len) {
        end = str.indexOf(separator, beg);
        if (end > -1) {
            if (end > beg) {
                numberOfSubstrings += 1;
                if (numberOfSubstrings == max) {
                    end = len;
                    substrings.push(str.substring(beg));
                }
                else {
                    substrings.push(str.substring(beg, end));
                    beg = end + separatorLength;
                }
            }
            else {
                if (preserveAllTokens) {
                    numberOfSubstrings += 1;
                    if (numberOfSubstrings == max) {
                        end = len;
                        substrings.push(str.substring(beg));
                    }
                    else {
                        substrings.push(EMPTY);
                    }
                }
                beg = end + separatorLength;
            }
        }
        else {
            substrings.push(str.substring(beg));
            end = len;
        }
    }
    return substrings;
};
var splitByCharacterType = function (str, camelCase) {
    if (str == null) {
        return null;
    }
    if (str.length == 0) {
        return [];
    }
    var c = str;
    var list = [];
    var tokenStart = 0;
    var currentType = Character.getType(c[tokenStart]);
    for (var pos = tokenStart + 1; pos < c.length; pos++) {
        var type = Character.getType(c[pos]);
        if (type == currentType) {
            continue;
        }
        if (camelCase && type == CharUtils.LOWERCASE_LETTER && currentType == CharUtils.UPPERCASE_LETTER) {
            var newTokenStart = pos - 1;
            if (newTokenStart != tokenStart) {
                list.push(substringByCount(c, tokenStart, newTokenStart - tokenStart));
                tokenStart = newTokenStart;
            }
        }
        else {
            list.push(substringByCount(c, tokenStart, pos - tokenStart));
            tokenStart = pos;
        }
        currentType = type;
    }
    list.push(substringByCount(c, tokenStart, c.length - tokenStart));
    return list;
};
var joinBySE = function (array, separator, startIndex, endIndex) {
    if (array == null) {
        return null;
    }
    if (separator == null) {
        separator = EMPTY;
    }
    var bufSize = (endIndex - startIndex);
    if (bufSize <= 0) {
        return EMPTY;
    }
    bufSize *= ((array[startIndex] == null ? 16 : array[startIndex].length)
        + separator.length);
    var buf = '';
    for (var i = startIndex; i < endIndex; i++) {
        if (i > startIndex) {
            buf += (separator);
        }
        if (array[i] != null) {
            buf += (array[i]);
        }
    }
    return buf;
};
var joinBy = function (array, separator) {
    if (array == null) {
        return null;
    }
    return joinBySE(array, separator, 0, array.length);
};
var replaceEachRecursive = function (text, searchList, replacementList, repeat, timeToLive) {
    if (text == null || text.length == 0 || searchList == null ||
        searchList.length == 0 || replacementList == null || replacementList.length == 0) {
        return text;
    }
    var searchLength = searchList.length;
    var replacementLength = replacementList.length;
    var noMoreMatchesForReplIndex = [];
    var textIndex = -1;
    var replaceIndex = -1;
    var tempIndex = -1;
    for (var i = 0; i < searchLength; i++) {
        if (noMoreMatchesForReplIndex[i] || searchList[i] == null ||
            searchList[i].length == 0 || replacementList[i] == null) {
            continue;
        }
        tempIndex = text.indexOf(searchList[i]);
        if (tempIndex == -1) {
            noMoreMatchesForReplIndex[i] = true;
        }
        else {
            if (textIndex == -1 || tempIndex < textIndex) {
                textIndex = tempIndex;
                replaceIndex = i;
            }
        }
    }
    if (textIndex == -1) {
        return text;
    }
    var start = 0;
    var increase = 0;
    for (var i = 0; i < searchList.length; i++) {
        if (searchList[i] == null || replacementList[i] == null) {
            continue;
        }
        var greater = replacementList[i].length - searchList[i].length;
        if (greater > 0) {
            increase += 3 * greater;
        }
    }
    increase = Math.min(increase, text.length / 5);
    var buf = '';
    while (textIndex != -1) {
        for (var i = start; i < textIndex; i++) {
            buf += (text.charAt(i));
        }
        buf += (replacementList[replaceIndex]);
        start = textIndex + searchList[replaceIndex].length;
        textIndex = -1;
        replaceIndex = -1;
        tempIndex = -1;
        for (var i = 0; i < searchLength; i++) {
            if (noMoreMatchesForReplIndex[i] || searchList[i] == null ||
                searchList[i].length == 0 || replacementList[i] == null) {
                continue;
            }
            tempIndex = text.indexOf(searchList[i], start);
            if (tempIndex == -1) {
                noMoreMatchesForReplIndex[i] = true;
            }
            else {
                if (textIndex == -1 || tempIndex < textIndex) {
                    textIndex = tempIndex;
                    replaceIndex = i;
                }
            }
        }
    }
    var textLength = text.length;
    for (var i = start; i < textLength; i++) {
        buf += (text.charAt(i));
    }
    var result = buf.toString();
    if (!repeat) {
        return result;
    }
    return replaceEachRecursive(result, searchList, replacementList, repeat, timeToLive - 1);
};
var replaceMax = function (text, searchString, replacement, max) {
    if (isEmpty(text) || isEmpty(searchString) || replacement == null || max == 0) {
        return text;
    }
    var start = 0;
    var end = text.indexOf(searchString, start);
    if (end == INDEX_NOT_FOUND) {
        return text;
    }
    var replLength = searchString.length;
    var increase = replacement.length - replLength;
    increase = (increase < 0 ? 0 : increase);
    increase *= (max < 0 ? 16 : (max > 64 ? 64 : max));
    var buf = '';
    while (end != INDEX_NOT_FOUND) {
        buf += (text.substring(start, end));
        buf += (replacement);
        start = end + replLength;
        if (--max == 0) {
            break;
        }
        end = text.indexOf(searchString, start);
    }
    buf += (text.substring(start));
    return buf;
};
var repeat = function (str, repeat) {
    if (str == null) {
        return null;
    }
    if (repeat <= 0) {
        return EMPTY;
    }
    var inputLength = str.length;
    if (repeat == 1 || inputLength == 0) {
        return str;
    }
    if (inputLength == 1 && repeat <= PAD_LIMIT) {
        return padding(repeat, str.charAt(0));
    }
    var outputLength = inputLength * repeat;
    switch (inputLength) {
        case 1:
            var ch = str.charAt(0);
            var output1 = '';
            for (var i = repeat - 1; i >= 0; i--) {
                setCharAt(output1, i, ch);
            }
            return output1;
        case 2:
            var ch0 = str.charAt(0);
            var ch1 = str.charAt(1);
            var output2 = '';
            for (var i = repeat * 2 - 2; i >= 0; i--, i--) {
                setCharAt(output2, i, ch0);
                setCharAt(output2, i + 1, ch1);
            }
            return output2;
        default:
            var buf = '';
            for (var i = 0; i < repeat; i++) {
                buf += (str);
            }
            return buf;
    }
};
var padding = function (repeat, padChar) {
    var buf = '';
    for (var i = 0; i < buf.length; i++) {
        setCharAt(buf, i, padChar);
    }
    return buf;
};
var removeEnd = function (str, remove) {
    if (isEmpty(str) || isEmpty(remove)) {
        return str;
    }
    if (str.endsWith(remove)) {
        return str.substring(0, str.length - remove.length);
    }
    return str;
};
var rightPad = function (str, size, padStr) {
    if (str == null) {
        return null;
    }
    if (isEmpty(padStr)) {
        padStr = " ";
    }
    var padLen = padStr.length;
    var strLen = str.length;
    var pads = size - strLen;
    if (pads <= 0) {
        return str;
    }
    if (padLen == 1 && pads <= PAD_LIMIT) {
        return rightPad(str, size, padStr.charAt(0));
    }
    if (pads == padLen) {
        return str.concat(padStr);
    }
    else if (pads < padLen) {
        return str.concat(padStr.substring(0, pads));
    }
    else {
        var padding_1 = '';
        var padChars = padStr;
        for (var i = 0; i < pads; i++) {
            setCharAt(padding_1, i, padChars[i % padLen]);
        }
        return str.concat(padding_1);
    }
};
var leftPad = function (str, size, padStr) {
    if (str == null) {
        return null;
    }
    if (isEmpty(padStr)) {
        padStr = " ";
    }
    var padLen = padStr.length;
    var strLen = str.length;
    var pads = size - strLen;
    if (pads <= 0) {
        return str;
    }
    if (padLen == 1 && pads <= PAD_LIMIT) {
        return leftPad(str, size, padStr.charAt(0));
    }
    if (pads == padLen) {
        return padStr.concat(str);
    }
    else if (pads < padLen) {
        return padStr.substring(0, pads).concat(str);
    }
    else {
        var padding_2 = '';
        var padChars = padStr;
        for (var i = 0; i < pads; i++) {
            setCharAt(padding_2, i, padChars[i % padLen]);
        }
        return padding_2.concat(str);
    }
};
var center = function (str, size, padStr) {
    if (str == null || size <= 0) {
        return str;
    }
    if (isEmpty(padStr)) {
        padStr = " ";
    }
    var strLen = str.length;
    var pads = size - strLen;
    if (pads <= 0) {
        return str;
    }
    str = leftPad(str, strLen + pads / 2, padStr);
    str = rightPad(str, size, padStr);
    return str;
};
var substringByCount = function (value, offset, count) {
    if (offset < 0) {
        return "";
    }
    if (count <= 0) {
        if (count < 0) {
            return "";
        }
        if (offset <= value.length) {
            return "";
        }
    }
    if (offset > value.length - count) {
        return "";
    }
    return substringWEnd(value, offset, offset + count);
};
var lowerCase = function (str) {
    if (str == null) {
        return null;
    }
    return str.toLowerCase();
};
var upperCase = function (str) {
    if (str == null) {
        return null;
    }
    return str.toUpperCase();
};
var abbreviate = function (str, maxWidth) {
    return abbreviateOffset(str, 0, maxWidth);
};
var abbreviateOffset = function (str, offset, maxWidth) {
    if (str == null) {
        return null;
    }
    if (maxWidth < 4) {
        return null;
    }
    if (str.length <= maxWidth) {
        return str;
    }
    if (offset > str.length) {
        offset = str.length;
    }
    if ((str.length - offset) < (maxWidth - 3)) {
        offset = str.length - (maxWidth - 3);
    }
    if (offset <= 4) {
        return str.substring(0, maxWidth - 3) + "...";
    }
    if (maxWidth < 7) {
        return null;
    }
    if ((offset + (maxWidth - 3)) < str.length) {
        return "..." + abbreviate(str.substring(offset), maxWidth - 3);
    }
    return "..." + str.substring(str.length - (maxWidth - 3));
};
var indexOfDifference = function (strs) {
    if (strs == null || strs.length <= 1) {
        return INDEX_NOT_FOUND;
    }
    var anyStringNull = false;
    var allStringsNull = true;
    var arrayLen = strs.length;
    var shortestStrLen = MAX_VALUE;
    var longestStrLen = 0;
    for (var i = 0; i < arrayLen; i++) {
        if (strs[i] == null) {
            anyStringNull = true;
            shortestStrLen = 0;
        }
        else {
            allStringsNull = false;
            shortestStrLen = Math.min(strs[i].length, shortestStrLen);
            longestStrLen = Math.max(strs[i].length, longestStrLen);
        }
    }
    if (allStringsNull || (longestStrLen == 0 && !anyStringNull)) {
        return INDEX_NOT_FOUND;
    }
    if (shortestStrLen == 0) {
        return 0;
    }
    var firstDiff = -1;
    for (var stringPos = 0; stringPos < shortestStrLen; stringPos++) {
        var comparisonChar = strs[0].charAt(stringPos);
        for (var arrayPos = 1; arrayPos < arrayLen; arrayPos++) {
            if (strs[arrayPos].charAt(stringPos) != comparisonChar) {
                firstDiff = stringPos;
                break;
            }
        }
        if (firstDiff != -1) {
            break;
        }
    }
    if (firstDiff == -1 && shortestStrLen != longestStrLen) {
        return shortestStrLen;
    }
    return firstDiff;
};
var indexOfDifferenceBtw = function (str1, str2) {
    if (str1 == str2) {
        return INDEX_NOT_FOUND;
    }
    if (str1 == null || str2 == null) {
        return 0;
    }
    var i;
    for (i = 0; i < str1.length && i < str2.length; ++i) {
        if (str1.charAt(i) != str2.charAt(i)) {
            break;
        }
    }
    if (i < str2.length || i < str1.length) {
        return i;
    }
    return INDEX_NOT_FOUND;
};
var startsWith = function (str, prefix, ignoreCase) {
    if (str == null || prefix == null) {
        return (str == null && prefix == null);
    }
    if (prefix.length > str.length) {
        return false;
    }
    return regionMatches(ignoreCase, str, prefix, 0, 0, prefix.length);
};
var endsWith = function (str, suffix, ignoreCase) {
    if (str == null || suffix == null) {
        return (str == null && suffix == null);
    }
    if (suffix.length > str.length) {
        return false;
    }
    var strOffset = str.length - suffix.length;
    return regionMatches(ignoreCase, str, suffix, strOffset, 0, suffix.length);
};
var startsWithIgnoreCase = function (str, prefix) {
    return startsWith(str, prefix, true);
};
var endsWithIgnoreCase = function (str, suffix) {
    return endsWith(str, suffix, true);
};
function setCharAt(str, index, chr) {
    if (index > str.length - 1)
        return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}
;
var StringUtils = {
    // Empty checks
    //-----------------------------------------------------------------------
    /**
     * Checks if a String is empty `("")` or `null`.
     *
     * @example
     * StringUtils.isEmpty(null)      = true
     * StringUtils.isEmpty("")        = true
     * StringUtils.isEmpty(" ")       = false
     * StringUtils.isEmpty("bob")     = false
     * StringUtils.isEmpty("  bob  ") = false
     *
     * @param str  the String to check, may be null
     * @return `true` if the String is empty or null
     */
    isEmpty: isEmpty,
    /**
     * Checks if a String is not empty `("")` and `not null`.
     *
     * @example
     * StringUtils.isNotEmpty(null)      = false
     * StringUtils.isNotEmpty("")        = false
     * StringUtils.isNotEmpty(" ")       = true
     * StringUtils.isNotEmpty("bob")     = true
     * StringUtils.isNotEmpty("  bob  ") = true
     
     *
     * @param str  the String to check, may be null
     * @return `true` if the String is not empty and not null
     */
    isNotEmpty: function (str) {
        return !isEmpty(str);
    },
    /**
     * Checks if a String is whitespace, empty ("") or null.
     *
     * @example
     * StringUtils.isBlank(null)      = true
     * StringUtils.isBlank("")        = true
     * StringUtils.isBlank(" ")       = true
     * StringUtils.isBlank("bob")     = false
     * StringUtils.isBlank("  bob  ") = false
     
     *
     * @param str  the String to check, may be null
     * @return `true` if the String is null, empty or whitespace
     */
    isBlank: isBlank,
    /**
     * Checks if a String is not empty (""), not null and not whitespace only.
     *
     * @example
     * StringUtils.isNotBlank(null)      = false
     * StringUtils.isNotBlank("")        = false
     * StringUtils.isNotBlank(" ")       = false
     * StringUtils.isNotBlank("bob")     = true
     * StringUtils.isNotBlank("  bob  ") = true
     
     *
     * @param str  the String to check, may be null
     * @return `true` if the String is
     *  not empty and not null and not whitespace
     */
    isNotBlank: function (str) {
        return !isBlank(str);
    },
    // Trim
    //-----------------------------------------------------------------------
    /**
     * Removes control characters (char &lt;= 32) from both
     * ends of this String, handling null by returning
     * null.
     *
     * @example
     * StringUtils.trim(null)          = null
     * StringUtils.trim("")            = ""
     * StringUtils.trim("     ")       = ""
     * StringUtils.trim("abc")         = "abc"
     * StringUtils.trim("    abc    ") = "abc"
     
     *
     * @param str  the String to be trimmed, may be null
     * @return the trimmed string, null if null String input
     */
    trim: trim,
    /**
     * Removes control characters (char &lt;= 32) from both
     * ends of this String returning null if the String is
     * empty ("") after the trim or if it is null.
     *
     * @example
     * StringUtils.trimToNull(null)          = null
     * StringUtils.trimToNull("")            = null
     * StringUtils.trimToNull("     ")       = null
     * StringUtils.trimToNull("abc")         = "abc"
     * StringUtils.trimToNull("    abc    ") = "abc"
     *
     * @param str  the String to be trimmed, may be null
     * @return the trimmed String,
     *  null if only chars &lt;= 32, empty or null String input
     */
    trimToNull: function (str) {
        var ts = trim(str);
        return isEmpty(ts) ? null : ts;
    },
    /**
     * Removes control characters (char &lt;= 32) from both
     * ends of this String returning an empty String ("") if the String
     * is empty ("") after the trim or if it is null.
     *
     * @example
     * StringUtils.trimToEmpty(null)          = ""
     * StringUtils.trimToEmpty("")            = ""
     * StringUtils.trimToEmpty("     ")       = ""
     * StringUtils.trimToEmpty("abc")         = "abc"
     * StringUtils.trimToEmpty("    abc    ") = "abc"
     *
     * @param str  the String to be trimmed, may be null
     * @return the trimmed String, or an empty String if null input
     */
    trimToEmpty: function (str) {
        return str == null ? EMPTY : str.trim();
    },
    // Stripping
    //-----------------------------------------------------------------------
    /**
     * Strips whitespace from the start and end of a String.
     *
     * A null input String returns null.
     *
     * @example
     * StringUtils.strip(null)     = null
     * StringUtils.strip("")       = ""
     * StringUtils.strip("   ")    = ""
     * StringUtils.strip("abc")    = "abc"
     * StringUtils.strip("  abc")  = "abc"
     * StringUtils.strip("abc  ")  = "abc"
     * StringUtils.strip(" abc ")  = "abc"
     * StringUtils.strip(" ab c ") = "ab c"
     *
     * @param str  the String to remove whitespace from, may be null
     * @return the stripped String, null if null String input
     */
    strip: function (str) {
        return strip(str, null);
    },
    /**
     * Strips whitespace from the start and end of a String  returning
     * null if the String is empty ("") after the strip.
     *
     * @example
     * StringUtils.stripToNull(null)     = null
     * StringUtils.stripToNull("")       = null
     * StringUtils.stripToNull("   ")    = null
     * StringUtils.stripToNull("abc")    = "abc"
     * StringUtils.stripToNull("  abc")  = "abc"
     * StringUtils.stripToNull("abc  ")  = "abc"
     * StringUtils.stripToNull(" abc ")  = "abc"
     * StringUtils.stripToNull(" ab c ") = "ab c"
     *
     * @param str  the String to be stripped, may be null
     * @return the stripped String,
     *  null if whitespace, empty or null String input
     */
    stripToNull: function (str) {
        if (str == null) {
            return null;
        }
        str = strip(str, null);
        return str.length == 0 ? null : str;
    },
    /**
     * Strips whitespace from the start and end of a String  returning
     * an empty String if null input.
     *
     * @example
     * StringUtils.stripToEmpty(null)     = ""
     * StringUtils.stripToEmpty("")       = ""
     * StringUtils.stripToEmpty("   ")    = ""
     * StringUtils.stripToEmpty("abc")    = "abc"
     * StringUtils.stripToEmpty("  abc")  = "abc"
     * StringUtils.stripToEmpty("abc  ")  = "abc"
     * StringUtils.stripToEmpty(" abc ")  = "abc"
     * StringUtils.stripToEmpty(" ab c ") = "ab c"
     *
     * @param str  the String to be stripped, may be null
     * @return the trimmed String, or an empty String if null input
     */
    stripToEmpty: function (str) {
        return str == null ? EMPTY : strip(str, null);
    },
    /**
     * Strips any of a set of characters from the start and end of a String.
     *
     * A null input String returns null.
     * An empty string ("") input returns the empty string.
     *
     * @example
     * StringUtils.stripStr(null, *)          = null
     * StringUtils.stripStr("", *)            = ""
     * StringUtils.stripStr("abc", null)      = "abc"
     * StringUtils.stripStr("  abc", null)    = "abc"
     * StringUtils.stripStr("abc  ", null)    = "abc"
     * StringUtils.stripStr(" abc ", null)    = "abc"
     * StringUtils.stripStr("  abcyx", "xyz") = "  abc"
     *
     * @param str  the String to remove characters from, may be null
     * @param stripChars  the characters to remove, null treated as whitespace
     * @return the stripped String, null if null String input
     */
    stripStr: strip,
    /**
     * Strips any of a set of characters from the start of a String.
     *
     * A null input String returns null.
     * An empty string ("") input returns the empty string.
     *
     * @example
     * StringUtils.stripStart(null, *)          = null
     * StringUtils.stripStart("", *)            = ""
     * StringUtils.stripStart("abc", "")        = "abc"
     * StringUtils.stripStart("abc", null)      = "abc"
     * StringUtils.stripStart("  abc", null)    = "abc"
     * StringUtils.stripStart("abc  ", null)    = "abc  "
     * StringUtils.stripStart(" abc ", null)    = "abc "
     * StringUtils.stripStart("yxabc  ", "xyz") = "abc  "
     *
     * @param str  the String to remove characters from, may be null
     * @param stripChars  the characters to remove, null treated as whitespace
     * @return the stripped String, null if null String input
     */
    stripStart: stripStart,
    /**
     * Strips any of a set of characters from the end of a String.
     *
     * A null input String returns null.
     * An empty string ("") input returns the empty string.
     *
     * @example
     * StringUtils.stripEnd(null, *)          = null
     * StringUtils.stripEnd("", *)            = ""
     * StringUtils.stripEnd("abc", "")        = "abc"
     * StringUtils.stripEnd("abc", null)      = "abc"
     * StringUtils.stripEnd("  abc", null)    = "  abc"
     * StringUtils.stripEnd("abc  ", null)    = "abc"
     * StringUtils.stripEnd(" abc ", null)    = " abc"
     * StringUtils.stripEnd("  abcyx", "xyz") = "  abc"
     * StringUtils.stripEnd("120.00", ".0")   = "12"
     *
     * @param str  the String to remove characters from, may be null
     * @param stripChars  the set of characters to remove, null treated as whitespace
     * @return the stripped String, null if null String input
     */
    stripEnd: stripEnd,
    // StripAll
    //-----------------------------------------------------------------------
    /**
     * Strips whitespace from the start and end of every String in an array.
     *
     * A new array is returned each time, except for length zero.
     * A null array will return null.
     * An empty array will return itself.
     * A null array entry will be ignored.
     *
     * @example
     * StringUtils.stripAll(null)             = null
     * StringUtils.stripAll([])               = []
     * StringUtils.stripAll(["abc", "  abc"]) = ["abc", "abc"]
     * StringUtils.stripAll(["abc  ", null])  = ["abc", null]
     *
     * @param strs  the array to remove whitespace from, may be null
     * @return the stripped Strings, null if null array input
     */
    stripAll: function (strs) {
        return stripAll(strs, null);
    },
    /**
     * Strips any of a set of characters from the start and end of every
     * String in an array.
     *
     * A new array is returned each time, except for length zero.
     * A null array will return null.
     * An empty array will return itself.
     * A null array entry will be ignored.
     *
     * @example
     * StringUtils.stripAllStr(null, *)                = null
     * StringUtils.stripAllStr([], *)                  = []
     * StringUtils.stripAllStr(["abc", "  abc"], null) = ["abc", "abc"]
     * StringUtils.stripAllStr(["abc  ", null], null)  = ["abc", null]
     * StringUtils.stripAllStr(["abc  ", null], "yz")  = ["abc  ", null]
     * StringUtils.stripAllStr(["yabcz", null], "yz")  = ["abc", null]
     *
     * @param strs  the array to remove characters from, may be null
     * @param stripChars  the characters to remove, null treated as whitespace
     * @return the stripped Strings, null if null array input
     */
    stripAllStr: stripAll,
    // Equals
    //-----------------------------------------------------------------------
    /**
     * Compares two Strings, returning true if they are equal.
     *
     * nulls are handled without exceptions. Two null
     * references are considered to be equal. The comparison is case sensitive.
     *
     * @example
     * StringUtils.equals(null, null)   = true
     * StringUtils.equals(null, "abc")  = false
     * StringUtils.equals("abc", null)  = false
     * StringUtils.equals("abc", "abc") = true
     * StringUtils.equals("abc", "ABC") = false
     *
     * @param str1  the first String, may be null
     * @param str2  the second String, may be null
     * @return true if the Strings are equal, case sensitive, or
     *  both null
     */
    equals: function (str1, str2) {
        return str1 == null ? str2 == null : str1 == str2;
    },
    /**
     * Compares two Strings, returning true if they are equal ignoring
     * the case.
     *
     * nulls are handled without exceptions. Two null
     * references are considered equal. Comparison is case insensitive.
     *
     * @example
     * StringUtils.equalsIgnoreCase(null, null)   = true
     * StringUtils.equalsIgnoreCase(null, "abc")  = false
     * StringUtils.equalsIgnoreCase("abc", null)  = false
     * StringUtils.equalsIgnoreCase("abc", "abc") = true
     * StringUtils.equalsIgnoreCase("abc", "ABC") = true
     *
     * @param str1  the first String, may be null
     * @param str2  the second String, may be null
     * @return true if the Strings are equal, case insensitive, or
     *  both null
     */
    equalsIgnoreCase: function (str1, str2) {
        return str1 == null ? str2 == null : equalsIgnoreCase(str1, str2);
    },
    // IndexOf
    //-----------------------------------------------------------------------
    /**
     * Finds the first index within a String, handling null.
     *
     * A null or empty ("") String will return INDEX_NOT_FOUND (-1).
     *
     * @example
     * StringUtils.indexOf(null, *)         = -1
     * StringUtils.indexOf("", *)           = -1
     * StringUtils.indexOf("aabaabaa", 'a') = 0
     * StringUtils.indexOf("aabaabaa", 'b') = 2
     *
     * @param str  the String to check, may be null
     * @param searchChar  the character to find
     * @return the first index of the search character,
     *  -1 if no match or null string input
     */
    indexOf: function (str, searchChar) {
        if (isEmpty(str)) {
            return INDEX_NOT_FOUND;
        }
        return str.indexOf(searchChar);
    },
    /**
     * Finds the first index within a String from a start position,
     * handling null.
     *
     * A null or empty ("") String will return (INDEX_NOT_FOUND) -1.
     * A negative start position is treated as zero.
     * A start position greater than the string length returns -1.
     *
     * @example
     * StringUtils.indexOfStartPosition(null, *, *)          = -1
     * StringUtils.indexOfStartPosition("", *, *)            = -1
     * StringUtils.indexOfStartPosition("aabaabaa", 'b', 0)  = 2
     * StringUtils.indexOfStartPosition("aabaabaa", 'b', 3)  = 5
     * StringUtils.indexOfStartPosition("aabaabaa", 'b', 9)  = -1
     * StringUtils.indexOfStartPosition("aabaabaa", 'b', -1) = 2
     *
     * @param str  the String to check, may be null
     * @param searchChar  the character to find
     * @param startPos  the start position, negative treated as zero
     * @return the first index of the search character,
     *  -1 if no match or null string input
     */
    indexOfStartPosition: function (str, searchChar, startPos) {
        if (isEmpty(str)) {
            return INDEX_NOT_FOUND;
        }
        return str.indexOf(searchChar, startPos);
    },
    /**
     * Finds the n-th index within a String, handling null.
     *
     * A null String will return -1.
     *
     * @example
     * StringUtils.ordinalIndexOf(null, *, *)          = -1
     * StringUtils.ordinalIndexOf(*, null, *)          = -1
     * StringUtils.ordinalIndexOf("", "", *)           = 0
     * StringUtils.ordinalIndexOf("aabaabaa", "a", 1)  = 0
     * StringUtils.ordinalIndexOf("aabaabaa", "a", 2)  = 1
     * StringUtils.ordinalIndexOf("aabaabaa", "b", 1)  = 2
     * StringUtils.ordinalIndexOf("aabaabaa", "b", 2)  = 5
     * StringUtils.ordinalIndexOf("aabaabaa", "ab", 1) = 1
     * StringUtils.ordinalIndexOf("aabaabaa", "ab", 2) = 4
     * StringUtils.ordinalIndexOf("aabaabaa", "", 1)   = 0
     * StringUtils.ordinalIndexOf("aabaabaa", "", 2)   = 0
     *
     * @param str  the String to check, may be null
     * @param searchStr  the String to find, may be null
     * @param ordinal  the n-th searchStr to find
     * @return the n-th index of the search String,
     *  -1 (INDEX_NOT_FOUND) if no match or null string input
     */
    ordinalIndexOf: function (str, searchStr, ordinal) {
        return ordinalIndexOf(str, searchStr, ordinal, false);
    },
    /**
     * Finds the n-th index within a String, handling null.
     *
     * A null String will return -1.
     *
     * @param str  the String to check, may be null
     * @param searchStr  the String to find, may be null
     * @param ordinal  the n-th searchStr to find
     * @param lastIndex true if lastOrdinalIndexOf() otherwise false if ordinalIndexOf()
     * @return the n-th index of the search String,
     *  -1 (INDEX_NOT_FOUND) if no match or null string input
     */
    // Shared code between ordinalIndexOf(String,String,int) and lastOrdinalIndexOf(String,String,int)
    ordinalIndexOfLastIndex: ordinalIndexOf,
    /**
     * Case in-sensitive find of the first index within a String.
     *
     * A null String will return -1.
     * A negative start position is treated as zero.
     * An empty ("") search String always matches.
     * A start position greater than the string length only matches
     * an empty search String.
     *
     * @example
     * StringUtils.indexOfIgnoreCase(null, *)          = -1
     * StringUtils.indexOfIgnoreCase(*, null)          = -1
     * StringUtils.indexOfIgnoreCase("", "")           = 0
     * StringUtils.indexOfIgnoreCase("aabaabaa", "a")  = 0
     * StringUtils.indexOfIgnoreCase("aabaabaa", "b")  = 2
     * StringUtils.indexOfIgnoreCase("aabaabaa", "ab") = 1
     *
     * @param str  the String to check, may be null
     * @param searchStr  the String to find, may be null
     * @return the first index of the search String,
     *  -1 if no match or null string input
     */
    indexOfIgnoreCase: function (str, searchStr) {
        return indexOfIgnoreCase(str, searchStr, 0);
    },
    /**
     * Case in-sensitive find of the first index within a String
     * from the specified position.
     *
     * A null String will return -1.
     * A negative start position is treated as zero.
     * An empty ("") search String always matches.
     * A start position greater than the string length only matches
     * an empty search String.
     *
     * @example
     * StringUtils.indexOfIgnoreCaseStartPosition(null, *, *)          = -1
     * StringUtils.indexOfIgnoreCaseStartPosition(*, null, *)          = -1
     * StringUtils.indexOfIgnoreCaseStartPosition("", "", 0)           = 0
     * StringUtils.indexOfIgnoreCaseStartPosition("aabaabaa", "A", 0)  = 0
     * StringUtils.indexOfIgnoreCaseStartPosition("aabaabaa", "B", 0)  = 2
     * StringUtils.indexOfIgnoreCaseStartPosition("aabaabaa", "AB", 0) = 1
     * StringUtils.indexOfIgnoreCaseStartPosition("aabaabaa", "B", 3)  = 5
     * StringUtils.indexOfIgnoreCaseStartPosition("aabaabaa", "B", 9)  = -1
     * StringUtils.indexOfIgnoreCaseStartPosition("aabaabaa", "B", -1) = 2
     * StringUtils.indexOfIgnoreCaseStartPosition("aabaabaa", "", 2)   = 2
     * StringUtils.indexOfIgnoreCaseStartPosition("abc", "", 9)        = 3
     *
     * @param str  the String to check, may be null
     * @param searchStr  the String to find, may be null
     * @param startPos  the start position, negative treated as zero
     * @return the first index of the search String,
     *  -1 if no match or null string input
     */
    indexOfIgnoreCaseStartPosition: indexOfIgnoreCase,
    // LastIndexOf
    //-----------------------------------------------------------------------
    /**
     * Finds the last index within a String, handling null.
     *
     * A null or empty ("") String will return -1.
     *
     * @example
     * StringUtils.lastIndexOf(null, *)         = -1
     * StringUtils.lastIndexOf("", *)           = -1
     * StringUtils.lastIndexOf("aabaabaa", 'a') = 7
     * StringUtils.lastIndexOf("aabaabaa", 'b') = 5
     *
     * @param str  the String to check, may be null
     * @param searchChar  the character to find
     * @return the last index of the search character,
     *  -1 if no match or null string input
     */
    lastIndexOf: function (str, searchChar) {
        if (isEmpty(str)) {
            return INDEX_NOT_FOUND;
        }
        return str.lastIndexOf(searchChar);
    },
    /**
     * Finds the last index within a String from a start position,
     * handling null.
     *
     * A null or empty ("") String will return -1.
     * A negative start position returns -1.
     * A start position greater than the string length searches the whole string.
     *
     * @example
     * StringUtils.lastIndexOfStartPosition(null, *, *)          = -1
     * StringUtils.lastIndexOfStartPosition("", *,  *)           = -1
     * StringUtils.lastIndexOfStartPosition("aabaabaa", 'b', 8)  = 5
     * StringUtils.lastIndexOfStartPosition("aabaabaa", 'b', 4)  = 2
     * StringUtils.lastIndexOfStartPosition("aabaabaa", 'b', 0)  = -1
     * StringUtils.lastIndexOfStartPosition("aabaabaa", 'b', 9)  = 5
     * StringUtils.lastIndexOfStartPosition("aabaabaa", 'b', -1) = -1
     * StringUtils.lastIndexOfStartPosition("aabaabaa", 'a', 0)  = 0
     *
     * @param str  the String to check, may be null
     * @param searchChar  the character to find
     * @param startPos  the start position
     * @return the last index of the search character,
     *  -1 if no match or null string input
     */
    lastIndexOfStartPosition: function (str, searchChar, startPos) {
        if (isEmpty(str)) {
            return INDEX_NOT_FOUND;
        }
        return str.lastIndexOf(searchChar, startPos);
    },
    /**
     * Finds the n-th last index within a String, handling null.
     *
     * A null String will return -1.
     *
     * @example
     * StringUtils.lastOrdinalIndexOf(null, *, *)          = -1
     * StringUtils.lastOrdinalIndexOf(*, null, *)          = -1
     * StringUtils.lastOrdinalIndexOf("", "", *)           = 0
     * StringUtils.lastOrdinalIndexOf("aabaabaa", "a", 1)  = 7
     * StringUtils.lastOrdinalIndexOf("aabaabaa", "a", 2)  = 6
     * StringUtils.lastOrdinalIndexOf("aabaabaa", "b", 1)  = 5
     * StringUtils.lastOrdinalIndexOf("aabaabaa", "b", 2)  = 2
     * StringUtils.lastOrdinalIndexOf("aabaabaa", "ab", 1) = 4
     * StringUtils.lastOrdinalIndexOf("aabaabaa", "ab", 2) = 1
     * StringUtils.lastOrdinalIndexOf("aabaabaa", "", 1)   = 8
     * StringUtils.lastOrdinalIndexOf("aabaabaa", "", 2)   = 8
     *
     * @param str  the String to check, may be null
     * @param searchStr  the String to find, may be null
     * @param ordinal  the n-th last searchStr to find
     * @return the n-th last index of the search String,
     *  -1 (INDEX_NOT_FOUND) if no match or null string input
     */
    lastOrdinalIndexOf: function (str, searchStr, ordinal) {
        return ordinalIndexOf(str, searchStr, ordinal, true);
    },
    /**
     * Case in-sensitive find of the last index within a String.
     *
     * A null String will return -1.
     * A negative start position returns -1.
     * An empty ("") search String always matches unless the start position is negative.
     * A start position greater than the string length searches the whole string.
     *
     * @example
     * StringUtils.lastIndexOfIgnoreCase(null, *)          = -1
     * StringUtils.lastIndexOfIgnoreCase(*, null)          = -1
     * StringUtils.lastIndexOfIgnoreCase("aabaabaa", "A")  = 7
     * StringUtils.lastIndexOfIgnoreCase("aabaabaa", "B")  = 5
     * StringUtils.lastIndexOfIgnoreCase("aabaabaa", "AB") = 4
     *
     * @param str  the String to check, may be null
     * @param searchStr  the String to find, may be null
     * @return the first index of the search String,
     *  -1 if no match or null string input
     */
    lastIndexOfIgnoreCase: function (str, searchStr) {
        if (str == null || searchStr == null) {
            return INDEX_NOT_FOUND;
        }
        return lastIndexOfIgnoreCase(str, searchStr, str.length);
    },
    /**
     * Case in-sensitive find of the last index within a String
     * from the specified position.
     *
     * A null String will return -1.
     * A negative start position returns -1.
     * An empty ("") search String always matches unless the start position is negative.
     * A start position greater than the string length searches the whole string.
     *
     * @example
     * StringUtils.lastIndexOfIgnoreCaseStartPosition(null, *, *)          = -1
     * StringUtils.lastIndexOfIgnoreCaseStartPosition(*, null, *)          = -1
     * StringUtils.lastIndexOfIgnoreCaseStartPosition("aabaabaa", "A", 8)  = 7
     * StringUtils.lastIndexOfIgnoreCaseStartPosition("aabaabaa", "B", 8)  = 5
     * StringUtils.lastIndexOfIgnoreCaseStartPosition("aabaabaa", "AB", 8) = 4
     * StringUtils.lastIndexOfIgnoreCaseStartPosition("aabaabaa", "B", 9)  = 5
     * StringUtils.lastIndexOfIgnoreCaseStartPosition("aabaabaa", "B", -1) = -1
     * StringUtils.lastIndexOfIgnoreCaseStartPosition("aabaabaa", "A", 0)  = 0
     * StringUtils.lastIndexOfIgnoreCaseStartPosition("aabaabaa", "B", 0)  = -1
     *
     * @param str  the String to check, may be null
     * @param searchStr  the String to find, may be null
     * @param startPos  the start position
     * @return the first index of the search String,
     *  -1 if no match or null string input
     */
    lastIndexOfIgnoreCaseStartPosition: lastIndexOfIgnoreCase,
    // Contains
    //-----------------------------------------------------------------------
    /**
     * Checks if String contains a search character, handling null.
     *
     * A null or empty ("") String will return false.
     *
     * @example
     * StringUtils.contains(null, *)    = false
     * StringUtils.contains("", *)      = false
     * StringUtils.contains("abc", 'a') = true
     * StringUtils.contains("abc", 'z') = false
     *
     * @param str  the String to check, may be null
     * @param searchChar  the character to find
     * @return true if the String contains the search character,
     *  false if not or null string input
     */
    contains: function (str, searchChar) {
        if (isEmpty(str)) {
            return false;
        }
        return str.indexOf(searchChar) >= 0;
    },
    /**
     * Checks if String contains a search String irrespective of case,
     * handling null.
     *
     * A null String will return false.
     *
     * @example
     * StringUtils.containsIgnoreCase(null, *) = false
     * StringUtils.containsIgnoreCase(*, null) = false
     * StringUtils.containsIgnoreCase("", "") = true
     * StringUtils.containsIgnoreCase("abc", "") = true
     * StringUtils.containsIgnoreCase("abc", "a") = true
     * StringUtils.containsIgnoreCase("abc", "z") = false
     * StringUtils.containsIgnoreCase("abc", "A") = true
     * StringUtils.containsIgnoreCase("abc", "Z") = false
     *
     * @param str  the String to check, may be null
     * @param searchStr  the String to find, may be null
     * @return true if the String contains the search String irrespective of
     * case or false if not or null string input
     */
    containsIgnoreCase: function (str, searchStr) {
        if (str == null || searchStr == null) {
            return false;
        }
        var len = searchStr.length;
        var max = str.length - len;
        for (var i = 0; i <= max; i++) {
            if (regionMatches(true, str, searchStr, i, 0, len)) {
                return true;
            }
        }
        return false;
    },
    // IndexOfAny chars
    //-----------------------------------------------------------------------
    /**
     * Search a String to find the first index of any
     * character in the given set of characters.
     *
     * A null String will return -1.
     * A null or zero length search array will return -1.
     *
     * @example
     * StringUtils.indexOfAny(null, *)                = -1
     * StringUtils.indexOfAny("", *)                  = -1
     * StringUtils.indexOfAny(*, null)                = -1
     * StringUtils.indexOfAny(*, [])                  = -1
     * StringUtils.indexOfAny("zzabyycdxx",['z','a']) = 0
     * StringUtils.indexOfAny("zzabyycdxx",['b','y']) = 3
     * StringUtils.indexOfAny("aba", ['z'])           = -1
     *
     * @param str  the String to check, may be null
     * @param searchChars  the chars to search for, may be null
     * @return the index of any of the chars, -1 if no match or null input
     */
    indexOfAny: function (str, searchChars) {
        if (isEmpty(str) || searchChars.length === 0) {
            return INDEX_NOT_FOUND;
        }
        var csLen = str.length;
        var csLast = csLen - 1;
        var searchLen = searchChars.length;
        var searchLast = searchLen - 1;
        for (var i = 0; i < csLen; i++) {
            var ch = str.charAt(i);
            for (var j = 0; j < searchLen; j++) {
                if (searchChars[j] == ch) {
                    if (i < csLast && j < searchLast && CharUtils.isHighSurrogate(ch)) {
                        // ch is a supplementary character
                        if (searchChars[j + 1] == str.charAt(i + 1)) {
                            return i;
                        }
                    }
                    else {
                        return i;
                    }
                }
            }
        }
        return INDEX_NOT_FOUND;
    },
    // ContainsAny
    //-----------------------------------------------------------------------
    /**
     * Checks if the String contains any character in the given
     * set of characters.
     *
     * A null String will return false.
     * A null or zero length search array will return false.
     *
     * @example
     * StringUtils.containsAny(null, *)                = false
     * StringUtils.containsAny("", *)                  = false
     * StringUtils.containsAny(*, null)                = false
     * StringUtils.containsAny(*, [])                  = false
     * StringUtils.containsAny("zzabyycdxx",['z','a']) = true
     * StringUtils.containsAny("zzabyycdxx",['b','y']) = true
     * StringUtils.containsAny("aba", ['z'])           = false
     *
     * @param str  the String to check, may be null
     * @param searchChars  the chars to search for, may be null
     * @return the true if any of the chars are found,
     * false if no match or null input
     */
    containsAny: function (str, searchChars) {
        if (isEmpty(str) || searchChars.length === 0) {
            return false;
        }
        var csLength = str.length;
        var searchLength = searchChars.length;
        var csLast = csLength - 1;
        var searchLast = searchLength - 1;
        for (var i = 0; i < csLength; i++) {
            var ch = str.charAt(i);
            for (var j = 0; j < searchLength; j++) {
                if (searchChars[j] == ch) {
                    if (CharUtils.isHighSurrogate(ch)) {
                        if (j == searchLast) {
                            // missing low surrogate, fine, like String.indexOf(String)
                            return true;
                        }
                        if (i < csLast && searchChars[j + 1] == str.charAt(i + 1)) {
                            return true;
                        }
                    }
                    else {
                        // ch is in the Basic Multilingual Plane
                        return true;
                    }
                }
            }
        }
        return false;
    },
    // IndexOfAnyBut chars
    //-----------------------------------------------------------------------
    /**
     * Search a String to find the first index of any
     * character not in the given set of characters.
     *
     * A null String will return -1.
     * A null or zero length search array will return -1.
     *
     * @example
     * StringUtils.indexOfAnyBut(null, *)                              = -1
     * StringUtils.indexOfAnyBut("", *)                                = -1
     * StringUtils.indexOfAnyBut(*, null)                              = -1
     * StringUtils.indexOfAnyBut(*, [])                                = -1
     * StringUtils.indexOfAnyBut("zzabyycdxx", new char[] {'z', 'a'} ) = 3
     * StringUtils.indexOfAnyBut("aba", new char[] {'z'} )             = 0
     * StringUtils.indexOfAnyBut("aba", new char[] {'a', 'b'} )        = -1
     *
     * @param str  the String to check, may be null
     * @param searchChars  the chars to search for, may be null
     * @return the index of any of the chars, -1 if no match or null input
     */
    indexOfAnyBut: indexOfAnyBut,
    // ContainsOnly
    //-----------------------------------------------------------------------
    /**
     * Checks if the String contains only certain characters.
     *
     * A null String will return false.
     * A null valid character array will return false.
     * An empty String (length=0) always returns true.
     *
     * @example
     * StringUtils.containsOnly(null, *)       = false
     * StringUtils.containsOnly(*, null)       = false
     * StringUtils.containsOnly("", *)         = true
     * StringUtils.containsOnly("ab", '')      = false
     * StringUtils.containsOnly("abab", 'abc') = true
     * StringUtils.containsOnly("ab1", 'abc')  = false
     * StringUtils.containsOnly("abz", 'abc')  = false
     *
     * @param str  the String to check, may be null
     * @param valid  an array of valid chars, may be null
     * @return true if it only contains valid chars and is non-null
     */
    containsOnly: function (str, valid) {
        // All these pre-checks are to maintain API with an older version
        if ((valid == null) || (str == null)) {
            return false;
        }
        if (str.length == 0) {
            return true;
        }
        if (valid.length == 0) {
            return false;
        }
        return indexOfAnyBut(str, valid) == INDEX_NOT_FOUND;
    },
    // ContainsNone
    //-----------------------------------------------------------------------
    /**
     * Checks that the String does not contain certain characters.
     *
     * A null String will return true.
     * A null invalid character array will return true.
     * An empty String (length=0) always returns true.
     *
     * @example
     * StringUtils.containsNone(null, *)       = true
     * StringUtils.containsNone(*, null)       = true
     * StringUtils.containsNone("", *)         = true
     * StringUtils.containsNone("ab", '')      = true
     * StringUtils.containsNone("abab", 'xyz') = true
     * StringUtils.containsNone("ab1", 'xyz')  = true
     * StringUtils.containsNone("abz", 'xyz')  = false
     *
     * @param str  the String to check, may be null
     * @param searchChars  an array of invalid chars, may be null
     * @return true if it contains none of the invalid chars, or is null
     */
    containsNone: function (str, searchChars) {
        if (str == null || searchChars == null) {
            return true;
        }
        var csLen = str.length;
        var csLast = csLen - 1;
        var searchLen = searchChars.length;
        var searchLast = searchLen - 1;
        for (var i = 0; i < csLen; i++) {
            var ch = str.charAt(i);
            for (var j = 0; j < searchLen; j++) {
                if (searchChars[j] == ch) {
                    if (CharUtils.isHighSurrogate(ch)) {
                        if (j == searchLast) {
                            // missing low surrogate, fine, like String.indexOf(String)
                            return false;
                        }
                        if (i < csLast && searchChars[j + 1] == str.charAt(i + 1)) {
                            return false;
                        }
                    }
                    else {
                        // ch is in the Basic Multilingual Plane
                        return false;
                    }
                }
            }
        }
        return true;
    },
    // IndexOfAny strings
    //-----------------------------------------------------------------------
    /**
     * Find the first index of any of a set of potential substrings.
     *
     * A null String will return -1.
     * A null or zero length search array will return -1.
     * A null search array entry will be ignored, but a search
     * array containing "" will return 0 if str is not
     * null.
     *
     * @example
     * StringUtils.indexOfAnyStrs(null, *)                     = -1
     * StringUtils.indexOfAnyStrs(*, null)                     = -1
     * StringUtils.indexOfAnyStrs(*, [])                       = -1
     * StringUtils.indexOfAnyStrs("zzabyycdxx", ["ab","cd"])   = 2
     * StringUtils.indexOfAnyStrs("zzabyycdxx", ["cd","ab"])   = 2
     * StringUtils.indexOfAnyStrs("zzabyycdxx", ["mn","op"])   = -1
     * StringUtils.indexOfAnyStrs("zzabyycdxx", ["zab","aby"]) = 1
     * StringUtils.indexOfAnyStrs("zzabyycdxx", [""])          = 0
     * StringUtils.indexOfAnyStrs("", [""])                    = 0
     * StringUtils.indexOfAnyStrs("", ["a"])                   = -1
     *
     * @param str  the String to check, may be null
     * @param searchStrs  the Strings to search for, may be null
     * @return the first index of any of the searchStrs in str, -1 if no match
     */
    indexOfAnyStrs: function (str, searchStrs) {
        if ((str == null) || (searchStrs == null)) {
            return INDEX_NOT_FOUND;
        }
        var sz = searchStrs.length;
        // String's can't have a MAX_VALUEth index.
        var ret = MAX_VALUE;
        var tmp = 0;
        for (var i = 0; i < sz; i++) {
            var search = searchStrs[i];
            if (search == null) {
                continue;
            }
            tmp = str.indexOf(search);
            if (tmp == INDEX_NOT_FOUND) {
                continue;
            }
            if (tmp < ret) {
                ret = tmp;
            }
        }
        return (ret == MAX_VALUE) ? INDEX_NOT_FOUND : ret;
    },
    /**
     * Find the latest index of any of a set of potential substrings.
     *
     * A null String will return -1.
     * A null search array will return -1.
     * A null or zero length search array entry will be ignored,
     * but a search array containing "" will return the length of str
     * if str is not null.
     *
     * @example
     * StringUtils.lastIndexOfAny(null, *)                   = -1
     * StringUtils.lastIndexOfAny(*, null)                   = -1
     * StringUtils.lastIndexOfAny(*, [])                     = -1
     * StringUtils.lastIndexOfAny(*, [null])                 = -1
     * StringUtils.lastIndexOfAny("zzabyycdxx", ["ab","cd"]) = 6
     * StringUtils.lastIndexOfAny("zzabyycdxx", ["cd","ab"]) = 6
     * StringUtils.lastIndexOfAny("zzabyycdxx", ["mn","op"]) = -1
     * StringUtils.lastIndexOfAny("zzabyycdxx", ["mn","op"]) = -1
     * StringUtils.lastIndexOfAny("zzabyycdxx", ["mn",""])   = 10
     *
     * @param str  the String to check, may be null
     * @param searchStrs  the Strings to search for, may be null
     * @return the last index of any of the Strings, -1 if no match
     */
    lastIndexOfAny: function (str, searchStrs) {
        if ((str == null) || (searchStrs == null)) {
            return INDEX_NOT_FOUND;
        }
        var sz = searchStrs.length;
        var ret = INDEX_NOT_FOUND;
        var tmp = 0;
        for (var i = 0; i < sz; i++) {
            var search = searchStrs[i];
            if (search == null) {
                continue;
            }
            tmp = str.lastIndexOf(search);
            if (tmp > ret) {
                ret = tmp;
            }
        }
        return ret;
    },
    // Substring
    //-----------------------------------------------------------------------
    /**
     * Gets a substring from the specified String avoiding exceptions.
     *
     * A negative start position can be used to start n
     * characters from the end of the String.
     *
     * A null String will return null.
     * An empty ("") String will return "".
     *
     * @example
     * StringUtils.substring(null, *)   = null
     * StringUtils.substring("", *)     = ""
     * StringUtils.substring("abc", 0)  = "abc"
     * StringUtils.substring("abc", 2)  = "c"
     * StringUtils.substring("abc", 4)  = ""
     * StringUtils.substring("abc", -2) = "bc"
     * StringUtils.substring("abc", -4) = "abc"
     *
     * @param str  the String to get the substring from, may be null
     * @param start  the position to start from, negative means
     *  count back from the end of the String by this many characters
     * @return substring from start position, null if null String input
     */
    substring: function (str, start) {
        if (str == null) {
            return null;
        }
        if (start < 0) {
            start = str.length + start;
        }
        if (start < 0) {
            start = 0;
        }
        if (start > str.length) {
            return EMPTY;
        }
        return str.substring(start);
    },
    /**
     * Gets a substring from the specified String avoiding exceptions.
     *
     * A negative start position can be used to start/end n
     * characters from the end of the String.
     *
     * The returned substring starts with the character in the start
     * position and ends before the end position. All position counting is
     * zero-based -- i.e., to start at the beginning of the string use
     * start = 0. Negative start and end positions can be used to
     * specify offsets relative to the end of the String.
     *
     * If start is not strictly to the left of end, ""
     * is returned.
     *
     * @example
     * StringUtils.substringWEnd(null, *, *)    = null
     * StringUtils.substringWEnd("", * ,  *)    = "";
     * StringUtils.substringWEnd("abc", 0, 2)   = "ab"
     * StringUtils.substringWEnd("abc", 2, 0)   = ""
     * StringUtils.substringWEnd("abc", 2, 4)   = "c"
     * StringUtils.substringWEnd("abc", 4, 6)   = ""
     * StringUtils.substringWEnd("abc", 2, 2)   = ""
     * StringUtils.substringWEnd("abc", -2, -1) = "b"
     * StringUtils.substringWEnd("abc", -4, 2)  = "ab"
     *
     * @param str  the String to get the substring from, may be null
     * @param start  the position to start from, negative means
     *  count back from the end of the String by this many characters
     * @param end  the position to end at (exclusive), negative means
     *  count back from the end of the String by this many characters
     * @return substring from start position to end positon,
     *  null if null String input
     */
    substringWEnd: substringWEnd,
    // Left/Right/Mid
    //-----------------------------------------------------------------------
    /**
     * Gets the leftmost len characters of a String.
     *
     * If len characters are not available, or the
     * String is null, the String will be returned without
     * an exception. An empty String is returned if len is negative.
     *
     * @example
     * StringUtils.left(null, *)    = null
     * StringUtils.left(*, -ve)     = ""
     * StringUtils.left("", *)      = ""
     * StringUtils.left("abc", 0)   = ""
     * StringUtils.left("abc", 2)   = "ab"
     * StringUtils.left("abc", 4)   = "abc"
     *
     * @param str  the String to get the leftmost characters from, may be null
     * @param len  the length of the required String
     * @return the leftmost characters, null if null String input
     */
    left: function (str, len) {
        if (str == null) {
            return null;
        }
        if (len < 0) {
            return EMPTY;
        }
        if (str.length <= len) {
            return str;
        }
        return str.substring(0, len);
    },
    /**
     * Gets the rightmost len characters of a String.
     *
     * If len characters are not available, or the String
     * is null, the String will be returned without an
     * an exception. An empty String is returned if len is negative.
     *
     * @example
     * StringUtils.right(null, *)    = null
     * StringUtils.right(*, -ve)     = ""
     * StringUtils.right("", *)      = ""
     * StringUtils.right("abc", 0)   = ""
     * StringUtils.right("abc", 2)   = "bc"
     * StringUtils.right("abc", 4)   = "abc"
     *
     * @param str  the String to get the rightmost characters from, may be null
     * @param len  the length of the required String
     * @return the rightmost characters, null if null String input
     */
    right: function (str, len) {
        if (str == null) {
            return null;
        }
        if (len < 0) {
            return EMPTY;
        }
        if (str.length <= len) {
            return str;
        }
        return str.substring(str.length - len);
    },
    /**
     * Gets len characters from the middle of a String.
     *
     * If len characters are not available, the remainder
     * of the String will be returned without an exception. If the
     * String is null, null will be returned.
     * An empty String is returned if len is negative or exceeds the
     * length of str.
     *
     * @example
     * StringUtils.mid(null, *, *)    = null
     * StringUtils.mid(*, *, -ve)     = ""
     * StringUtils.mid("", 0, *)      = ""
     * StringUtils.mid("abc", 0, 2)   = "ab"
     * StringUtils.mid("abc", 0, 4)   = "abc"
     * StringUtils.mid("abc", 2, 4)   = "c"
     * StringUtils.mid("abc", 4, 2)   = ""
     * StringUtils.mid("abc", -2, 2)  = "ab"
     *
     * @param str  the String to get the characters from, may be null
     * @param pos  the position to start from, negative treated as zero
     * @param len  the length of the required String
     * @return the middle characters, null if null String input
     */
    mid: function (str, pos, len) {
        if (str == null) {
            return null;
        }
        if (len < 0 || pos > str.length) {
            return EMPTY;
        }
        if (pos < 0) {
            pos = 0;
        }
        if (str.length <= (pos + len)) {
            return str.substring(pos);
        }
        return str.substring(pos, pos + len);
    },
    // SubStringAfter/SubStringBefore
    //-----------------------------------------------------------------------
    /**
     * Gets the substring before the first occurrence of a separator.
     * The separator is not returned.
     *
     * A null string input will return null.
     * An empty ("") string input will return the empty string.
     * A null separator will return the input string.
     *
     * If nothing is found, the string input is returned.
     *
     * @example
     * StringUtils.substringBefore(null, *)      = null
     * StringUtils.substringBefore("", *)        = ""
     * StringUtils.substringBefore("abc", "a")   = ""
     * StringUtils.substringBefore("abcba", "b") = "a"
     * StringUtils.substringBefore("abc", "c")   = "ab"
     * StringUtils.substringBefore("abc", "d")   = "abc"
     * StringUtils.substringBefore("abc", "")    = ""
     * StringUtils.substringBefore("abc", null)  = "abc"
     *
     * @param str  the String to get a substring from, may be null
     * @param separator  the String to search for, may be null
     * @return the substring before the first occurrence of the separator,
     *  null if null String input
     */
    substringBefore: function (str, separator) {
        if (isEmpty(str) || separator == null) {
            return str;
        }
        if (separator.length == 0) {
            return EMPTY;
        }
        var pos = str.indexOf(separator);
        if (pos == INDEX_NOT_FOUND) {
            return str;
        }
        return str.substring(0, pos);
    },
    /**
     * Gets the substring after the first occurrence of a separator.
     * The separator is not returned.
     *
     * A null string input will return null.
     * An empty ("") string input will return the empty string.
     * A null separator will return the empty string if the
     * input string is not null.
     *
     * If nothing is found, the empty string is returned.
     *
     * @example
     * StringUtils.substringAfter(null, *)      = null
     * StringUtils.substringAfter("", *)        = ""
     * StringUtils.substringAfter(*, null)      = ""
     * StringUtils.substringAfter("abc", "a")   = "bc"
     * StringUtils.substringAfter("abcba", "b") = "cba"
     * StringUtils.substringAfter("abc", "c")   = ""
     * StringUtils.substringAfter("abc", "d")   = ""
     * StringUtils.substringAfter("abc", "")    = "abc"
     *
     * @param str  the String to get a substring from, may be null
     * @param separator  the String to search for, may be null
     * @return the substring after the first occurrence of the separator,
     *  null if null String input
     
     */
    substringAfter: function (str, separator) {
        if (isEmpty(str)) {
            return str;
        }
        if (separator == null) {
            return EMPTY;
        }
        var pos = str.indexOf(separator);
        if (pos == INDEX_NOT_FOUND) {
            return EMPTY;
        }
        return str.substring(pos + separator.length);
    },
    /**
     * Gets the substring before the last occurrence of a separator.
     * The separator is not returned.
     *
     * A null string input will return null.
     * An empty ("") string input will return the empty string.
     * An empty or null separator will return the input string.
     *
     * If nothing is found, the string input is returned.
     *
     * @example
     * StringUtils.substringBeforeLast(null, *)      = null
     * StringUtils.substringBeforeLast("", *)        = ""
     * StringUtils.substringBeforeLast("abcba", "b") = "abc"
     * StringUtils.substringBeforeLast("abc", "c")   = "ab"
     * StringUtils.substringBeforeLast("a", "a")     = ""
     * StringUtils.substringBeforeLast("a", "z")     = "a"
     * StringUtils.substringBeforeLast("a", null)    = "a"
     * StringUtils.substringBeforeLast("a", "")      = "a"
     
     *
     * @param str  the String to get a substring from, may be null
     * @param separator  the String to search for, may be null
     * @return the substring before the last occurrence of the separator,
     *  null if null String input
     
     */
    substringBeforeLast: function (str, separator) {
        if (isEmpty(str) || isEmpty(separator)) {
            return str;
        }
        var pos = str.lastIndexOf(separator);
        if (pos == INDEX_NOT_FOUND) {
            return str;
        }
        return str.substring(0, pos);
    },
    /**
     * Gets the substring after the last occurrence of a separator.
     * The separator is not returned.
     *
     * A null string input will return null.
     * An empty ("") string input will return the empty string.
     * An empty or null separator will return the empty string if
     * the input string is not null.
     *
     * If nothing is found, the empty string is returned.
     *
     * @example
     * StringUtils.substringAfterLast(null, *)      = null
     * StringUtils.substringAfterLast("", *)        = ""
     * StringUtils.substringAfterLast(*, "")        = ""
     * StringUtils.substringAfterLast(*, null)      = ""
     * StringUtils.substringAfterLast("abc", "a")   = "bc"
     * StringUtils.substringAfterLast("abcba", "b") = "a"
     * StringUtils.substringAfterLast("abc", "c")   = ""
     * StringUtils.substringAfterLast("a", "a")     = ""
     * StringUtils.substringAfterLast("a", "z")     = ""
     *
     * @param str  the String to get a substring from, may be null
     * @param separator  the String to search for, may be null
     * @return the substring after the last occurrence of the separator,
     *  null if null String input
     */
    substringAfterLast: function (str, separator) {
        if (isEmpty(str)) {
            return str;
        }
        if (isEmpty(separator)) {
            return EMPTY;
        }
        var pos = str.lastIndexOf(separator);
        if (pos == INDEX_NOT_FOUND || pos == (str.length - separator.length)) {
            return EMPTY;
        }
        return str.substring(pos + separator.length);
    },
    // Substring between
    //-----------------------------------------------------------------------
    /**
     * Gets the String that is nested in between two instances of the
     * same String.
     *
     * A null input String returns null.
     * A null tag returns null.
     *
     * @example
     * StringUtils.substringBetween(null, *)            = null
     * StringUtils.substringBetween("", "")             = ""
     * StringUtils.substringBetween("", "tag")          = null
     * StringUtils.substringBetween("tagabctag", null)  = null
     * StringUtils.substringBetween("tagabctag", "")    = ""
     * StringUtils.substringBetween("tagabctag", "tag") = "abc"
     *
     * @param str  the String containing the substring, may be null
     * @param tag  the String before and after the substring, may be null
     * @return the substring, null if no match
     */
    substringBetween: function (str, tag) {
        return substringBetween(str, tag, tag);
    },
    /**
     * Gets the String that is nested in between two Strings.
     * Only the first match is returned.
     *
     * A null input String returns null.
     * A null open/close returns null (no match).
     * An empty ("") open and close returns an empty string.
     *
     * @example
     * StringUtils.substringBetweenTwo("wx[b]yz", "[", "]") = "b"
     * StringUtils.substringBetweenTwo(null, *, *)          = null
     * StringUtils.substringBetweenTwo(*, null, *)          = null
     * StringUtils.substringBetweenTwo(*, *, null)          = null
     * StringUtils.substringBetweenTwo("", "", "")          = ""
     * StringUtils.substringBetweenTwo("", "", "]")         = null
     * StringUtils.substringBetweenTwo("", "[", "]")        = null
     * StringUtils.substringBetweenTwo("yabcz", "", "")     = ""
     * StringUtils.substringBetweenTwo("yabcz", "y", "z")   = "abc"
     * StringUtils.substringBetweenTwo("yabczyabcz", "y", "z")   = "abc"
     *
     * @param str  the String containing the substring, may be null
     * @param open  the String before the substring, may be null
     * @param close  the String after the substring, may be null
     * @return the substring, null if no match
     */
    substringBetweenTwo: substringBetween,
    /**
     * Searches a String for substrings delimited by a start and end tag,
     * returning all matching substrings in an array.
     *
     * A null input String returns null.
     * A null open/close returns null (no match).
     * An empty ("") open/close returns null (no match).
     *
     * @example
     * StringUtils.substringsBetween("[a][b][c]", "[", "]") = ["a","b","c"]
     * StringUtils.substringsBetween(null, *, *)            = null
     * StringUtils.substringsBetween(*, null, *)            = null
     * StringUtils.substringsBetween(*, *, null)            = null
     * StringUtils.substringsBetween("", "[", "]")          = []
     *
     * @param str  the String containing the substrings, null returns null, empty returns empty
     * @param open  the String identifying the start of the substring, empty returns null
     * @param close  the String identifying the end of the substring, empty returns null
     * @return a String Array of substrings, or null if no match
     */
    substringsBetween: function (str, open, close) {
        if (str == null || isEmpty(open) || isEmpty(close)) {
            return null;
        }
        var strLen = str.length;
        if (strLen == 0) {
            return [];
        }
        var closeLen = close.length;
        var openLen = open.length;
        var list = [];
        var pos = 0;
        while (pos < (strLen - closeLen)) {
            var start = str.indexOf(open, pos);
            if (start < 0) {
                break;
            }
            start += openLen;
            var end = str.indexOf(close, start);
            if (end < 0) {
                break;
            }
            list.push(str.substring(start, end));
            pos = end + closeLen;
        }
        if (!list || list.length === 0) {
            return null;
        }
        return list;
    },
    substringByCount: substringByCount,
    // Splitting
    //-----------------------------------------------------------------------
    /**
     * Splits the provided text into an array, using whitespace as the
     * separator.
     *
     * The separator is not included in the returned String array.
     * Adjacent separators are treated as one separator.
     * For more control over the split use the StrTokenizer class.
     *
     * A null input String returns null.
     *
     * @example
     * StringUtils.split(null)       = null
     * StringUtils.split("")         = []
     * StringUtils.split("abc def")  = ["abc", "def"]
     * StringUtils.split("abc  def") = ["abc", "def"]
     * StringUtils.split(" abc ")    = ["abc"]
     *
     * @param str  the String to parse, may be null
     * @return an array of parsed Strings, null if null String input
     */
    split: function (str) {
        return split(str, null, -1);
    },
    /**
     * Splits the provided text into an array, separator specified.
     * This is an alternative to using StringTokenizer.
     *
     * The separator is not included in the returned String array.
     * Adjacent separators are treated as one separator.
     * For more control over the split use the StrTokenizer class.
     *
     * A null input String returns null.
     *
     * @example
     * StringUtils.splitBy(null, *)         = null
     * StringUtils.splitBy("", *)           = []
     * StringUtils.splitBy("a.b.c", '.')    = ["a", "b", "c"]
     * StringUtils.splitBy("a..b.c", '.')   = ["a", "b", "c"]
     * StringUtils.splitBy("a:b:c", '.')    = ["a:b:c"]
     * StringUtils.splitBy("a b c", ' ')    = ["a", "b", "c"]
     *
     * @param str  the String to parse, may be null
     * @param separatorChar  the character used as the delimiter
     * @return an array of parsed Strings, null if null String input
     */
    splitBy: function (str, separatorChars) {
        return splitWorkerMax(str, separatorChars, -1, false);
    },
    /**
     * Splits the provided text into an array with a maximum length,
     * separators specified.
     *
     * The separator is not included in the returned String array.
     * Adjacent separators are treated as one separator.
     *
     * A null input String returns null.
     * A null separatorChars splits on whitespace.
     *
     * If more than max delimited substrings are found, the last
     * returned string includes all characters after the first max - 1
     * returned strings (including separator characters).
     *
     * @example
     * StringUtils.splitIntoN(null, *, *)            = null
     * StringUtils.splitIntoN("", *, *)              = []
     * StringUtils.splitIntoN("ab de fg", null, 0)   = ["ab", "cd", "ef"]
     * StringUtils.splitIntoN("ab   de fg", null, 0) = ["ab", "cd", "ef"]
     * StringUtils.splitIntoN("ab:cd:ef", ":", 0)    = ["ab", "cd", "ef"]
     * StringUtils.splitIntoN("ab:cd:ef", ":", 2)    = ["ab", "cd:ef"]
     
     *
     * @param str  the String to parse, may be null
     * @param separatorChars  the characters used as the delimiters,
     *  null splits on whitespace
     * @param max  the maximum number of elements to include in the
     *  array. A zero or negative value implies no limit
     * @return an array of parsed Strings, null if null String input
     */
    splitIntoN: split,
    /**
     * Splits the provided text into an array, separator string specified.
     *
     * The separator(s) will not be included in the returned String array.
     * Adjacent separators are treated as one separator.
     *
     * A null input String returns null.
     * A null separator splits on whitespace.
     *
     * @example
     * StringUtils.splitByWholeSeparator(null, *)               = null
     * StringUtils.splitByWholeSeparator("", *)                 = []
     * StringUtils.splitByWholeSeparator("ab de fg", null)      = ["ab", "de", "fg"]
     * StringUtils.splitByWholeSeparator("ab   de fg", null)    = ["ab", "de", "fg"]
     * StringUtils.splitByWholeSeparator("ab:cd:ef", ":")       = ["ab", "cd", "ef"]
     * StringUtils.splitByWholeSeparator("ab-!-cd-!-ef", "-!-") = ["ab", "cd", "ef"]
     *
     * @param str  the String to parse, may be null
     * @param separator  String containing the String to be used as a delimiter,
     *  null splits on whitespace
     * @return an array of parsed Strings, null if null String was input
     */
    splitByWholeSeparator: function (str, separator) {
        return splitByWholeSeparatorWorker(str, separator, -1, false);
    },
    /**
     * Splits the provided text into an array, separator string specified.
     * Returns a maximum of max substrings.
     *
     * The separator(s) will not be included in the returned String array.
     * Adjacent separators are treated as one separator.
     *
     * A null input String returns null.
     * A null separator splits on whitespace.
     *
     * @example
     * StringUtils.splitByWholeSeparatorMax(null, *, *)               = null
     * StringUtils.splitByWholeSeparatorMax("", *, *)                 = []
     * StringUtils.splitByWholeSeparatorMax("ab de fg", null, 0)      = ["ab", "de", "fg"]
     * StringUtils.splitByWholeSeparatorMax("ab   de fg", null, 0)    = ["ab", "de", "fg"]
     * StringUtils.splitByWholeSeparatorMax("ab:cd:ef", ":", 2)       = ["ab", "cd:ef"]
     * StringUtils.splitByWholeSeparatorMax("ab-!-cd-!-ef", "-!-", 5) = ["ab", "cd", "ef"]
     * StringUtils.splitByWholeSeparatorMax("ab-!-cd-!-ef", "-!-", 2) = ["ab", "cd-!-ef"]
     
     *
     * @param str  the String to parse, may be null
     * @param separator  String containing the String to be used as a delimiter,
     *  null splits on whitespace
     * @param max  the maximum number of elements to include in the returned
     *  array. A zero or negative value implies no limit.
     * @return an array of parsed Strings, null if null String was input
     */
    splitByWholeSeparatorMax: function (str, separator, max) {
        return splitByWholeSeparatorWorker(str, separator, max, false);
    },
    /**
     * Splits the provided text into an array, separator string specified.
     *
     * The separator is not included in the returned String array.
     * Adjacent separators are treated as separators for empty tokens.
     * For more control over the split use the StrTokenizer class.
     *
     * A null input String returns null.
     * A null separator splits on whitespace.
     *
     * @example
     * StringUtils.splitByWholeSeparatorPreserveAllTokens(null, *)               = null
     * StringUtils.splitByWholeSeparatorPreserveAllTokens("", *)                 = []
     * StringUtils.splitByWholeSeparatorPreserveAllTokens("ab de fg", null)      = ["ab", "de", "fg"]
     * StringUtils.splitByWholeSeparatorPreserveAllTokens("ab   de fg", null)    = ["ab", "", "", "de", "fg"]
     * StringUtils.splitByWholeSeparatorPreserveAllTokens("ab:cd:ef", ":")       = ["ab", "cd", "ef"]
     * StringUtils.splitByWholeSeparatorPreserveAllTokens("ab-!-cd-!-ef", "-!-") = ["ab", "cd", "ef"]
     *
     * @param str  the String to parse, may be null
     * @param separator  String containing the String to be used as a delimiter,
     *  null splits on whitespace
     * @return an array of parsed Strings, null if null String was input
     */
    splitByWholeSeparatorPreserveAllTokens: function (str, separator) {
        return splitByWholeSeparatorWorker(str, separator, -1, true);
    },
    /**
     * Splits the provided text into an array, separator string specified.
     * Returns a maximum of max substrings.
     *
     * The separator is not included in the returned String array.
     * Adjacent separators are treated as separators for empty tokens.
     * For more control over the split use the StrTokenizer class.
     *
     * A null input String returns null.
     * A null separator splits on whitespace.
     *
     * @example
     * StringUtils.splitByWholeSeparatorPreserveAllTokensMax(null, *, *)               = null
     * StringUtils.splitByWholeSeparatorPreserveAllTokensMax("", *, *)                 = []
     * StringUtils.splitByWholeSeparatorPreserveAllTokensMax("ab de fg", null, 0)      = ["ab", "de", "fg"]
     * StringUtils.splitByWholeSeparatorPreserveAllTokensMax("ab   de fg", null, 0)    = ["ab", "", "", "de", "fg"]
     * StringUtils.splitByWholeSeparatorPreserveAllTokensMax("ab:cd:ef", ":", 2)       = ["ab", "cd:ef"]
     * StringUtils.splitByWholeSeparatorPreserveAllTokensMax("ab-!-cd-!-ef", "-!-", 5) = ["ab", "cd", "ef"]
     * StringUtils.splitByWholeSeparatorPreserveAllTokensMax("ab-!-cd-!-ef", "-!-", 2) = ["ab", "cd-!-ef"]
     *
     * @param str  the String to parse, may be null
     * @param separator  String containing the String to be used as a delimiter,
     *  null splits on whitespace
     * @param max  the maximum number of elements to include in the returned
     *  array. A zero or negative value implies no limit.
     * @return an array of parsed Strings, null if null String was input
     */
    splitByWholeSeparatorPreserveAllTokensMax: function (str, separator, max) {
        return splitByWholeSeparatorWorker(str, separator, max, true);
    },
    /**
     * Performs the logic for the splitByWholeSeparatorPreserveAllTokens methods.
     *
     * @param str  the String to parse, may be null
     * @param separator  String containing the String to be used as a delimiter,
     *  null splits on whitespace
     * @param max  the maximum number of elements to include in the returned
     *  array. A zero or negative value implies no limit.
     * @param preserveAllTokens if true, adjacent separators are
     * treated as empty token separators; if false, adjacent
     * separators are treated as one separator.
     * @return an array of parsed Strings, null if null String input
     
     */
    splitByWholeSeparatorWorker: splitByWholeSeparatorWorker,
    /**
     * Splits the provided text into an array, using whitespace as the
     * separator, preserving all tokens, including empty tokens created by
     * adjacent separators. This is an alternative to using StringTokenizer.
     *
     * The separator is not included in the returned String array.
     * Adjacent separators are treated as separators for empty tokens.
     * For more control over the split use the StrTokenizer class.
     *
     * A null input String returns null.
     *
     * @example
     * StringUtils.splitPreserveAllTokens(null)       = null
     * StringUtils.splitPreserveAllTokens("")         = []
     * StringUtils.splitPreserveAllTokens("abc def")  = ["abc", "def"]
     * StringUtils.splitPreserveAllTokens("abc  def") = ["abc", "", "def"]
     * StringUtils.splitPreserveAllTokens(" abc ")    = ["", "abc", ""]
     *
     * @param str  the String to parse, may be null
     * @return an array of parsed Strings, null if null String input
     */
    splitPreserveAllTokens: function (str) {
        return splitWorkerMax(str, null, -1, true);
    },
    /**
     * Splits the provided text into an array, separators specified,
     * preserving all tokens, including empty tokens created by adjacent
     * separators. This is an alternative to using StringTokenizer.
     *
     * The separator is not included in the returned String array.
     * Adjacent separators are treated as separators for empty tokens.
     * For more control over the split use the StrTokenizer class.
     *
     * A null input String returns null.
     * A null separatorChars splits on whitespace.
     *
     * @example
     * StringUtils.splitPreserveAllTokensBy(null, *)           = null
     * StringUtils.splitPreserveAllTokensBy("", *)             = []
     * StringUtils.splitPreserveAllTokensBy("abc def", null)   = ["abc", "def"]
     * StringUtils.splitPreserveAllTokensBy("abc def", " ")    = ["abc", "def"]
     * StringUtils.splitPreserveAllTokensBy("abc  def", " ")   = ["abc", "", def"]
     * StringUtils.splitPreserveAllTokensBy("ab:cd:ef", ":")   = ["ab", "cd", "ef"]
     * StringUtils.splitPreserveAllTokensBy("ab:cd:ef:", ":")  = ["ab", "cd", "ef", ""]
     * StringUtils.splitPreserveAllTokensBy("ab:cd:ef::", ":") = ["ab", "cd", "ef", "", ""]
     * StringUtils.splitPreserveAllTokensBy("ab::cd:ef", ":")  = ["ab", "", cd", "ef"]
     * StringUtils.splitPreserveAllTokensBy(":cd:ef", ":")     = ["", cd", "ef"]
     * StringUtils.splitPreserveAllTokensBy("::cd:ef", ":")    = ["", "", cd", "ef"]
     * StringUtils.splitPreserveAllTokensBy(":cd:ef:", ":")    = ["", cd", "ef", ""]
     *
     * @param str  the String to parse, may be null
     * @param separatorChars  the characters used as the delimiters,
     *  null splits on whitespace
     * @return an array of parsed Strings, null if null String input
     */
    splitPreserveAllTokensBy: function (str, separatorChars) {
        return splitWorkerMax(str, separatorChars, -1, true);
    },
    /**
     * Splits the provided text into an array with a maximum length,
     * separators specified, preserving all tokens, including empty tokens
     * created by adjacent separators.
     *
     * The separator is not included in the returned String array.
     * Adjacent separators are treated as separators for empty tokens.
     * Adjacent separators are treated as one separator.
     *
     * A null input String returns null.
     * A null separatorChars splits on whitespace.
     *
     * If more than max delimited substrings are found, the last
     * returned string includes all characters after the first max - 1
     * returned strings (including separator characters).
     *
     * @example
     * StringUtils.splitPreserveAllTokensMax(null, *, *)            = null
     * StringUtils.splitPreserveAllTokensMax("", *, *)              = []
     * StringUtils.splitPreserveAllTokensMax("ab de fg", null, 0)   = ["ab", "cd", "ef"]
     * StringUtils.splitPreserveAllTokensMax("ab   de fg", null, 0) = ["ab", "cd", "ef"]
     * StringUtils.splitPreserveAllTokensMax("ab:cd:ef", ":", 0)    = ["ab", "cd", "ef"]
     * StringUtils.splitPreserveAllTokensMax("ab:cd:ef", ":", 2)    = ["ab", "cd:ef"]
     * StringUtils.splitPreserveAllTokensMax("ab   de fg", null, 2) = ["ab", "  de fg"]
     * StringUtils.splitPreserveAllTokensMax("ab   de fg", null, 3) = ["ab", "", " de fg"]
     * StringUtils.splitPreserveAllTokensMax("ab   de fg", null, 4) = ["ab", "", "", "de fg"]
     *
     * @param str  the String to parse, may be null
     * @param separatorChars  the characters used as the delimiters,
     *  null splits on whitespace
     * @param max  the maximum number of elements to include in the
     *  array. A zero or negative value implies no limit
     * @return an array of parsed Strings, null if null String input
     */
    splitPreserveAllTokensMax: function (str, separatorChars, max) {
        return splitWorkerMax(str, separatorChars, max, true);
    },
    /**
     * Performs the logic for the split and
     * splitPreserveAllTokens methods that return a maximum array
     * length.
     *
     * @param str  the String to parse, may be null
     * @param separatorChars the separate character
     * @param max  the maximum number of elements to include in the
     *  array. A zero or negative value implies no limit.
     * @param preserveAllTokens if true, adjacent separators are
     * treated as empty token separators; if false, adjacent
     * separators are treated as one separator.
     * @return an array of parsed Strings, null if null String input
     */
    splitWorkerMax: splitWorkerMax,
    /**
     * Splits a String by Character type. Groups of contiguous
     * characters of the same type are returned as complete tokens.
     *
     * @example
     * StringUtils.splitByCharacterType(null)         = null
     * StringUtils.splitByCharacterType("")           = []
     * StringUtils.splitByCharacterType("ab de fg")   = ["ab", " ", "de", " ", "fg"]
     * StringUtils.splitByCharacterType("ab   de fg") = ["ab", "   ", "de", " ", "fg"]
     * StringUtils.splitByCharacterType("ab:cd:ef")   = ["ab", ":", "cd", ":", "ef"]
     * StringUtils.splitByCharacterType("number5")    = ["number", "5"]
     * StringUtils.splitByCharacterType("fooBar")     = ["foo", "B", "ar"]
     * StringUtils.splitByCharacterType("foo200Bar")  = ["foo", "200", "B", "ar"]
     * StringUtils.splitByCharacterType("ASFRules")   = ["ASFR", "ules"]
     *
     * @param str the String to split, may be null
     * @return an array of parsed Strings, null if null String input
     */
    splitByCharacterType: function (str) {
        return splitByCharacterType(str, false);
    },
    /**
     * Splits a String by Character type. Groups of contiguous
     * characters of the same type are returned as complete tokens, with the
     * following exception: the character of type
     * Character.UPPERCASE_LETTER, if any, immediately
     * preceding a token of type Character.LOWERCASE_LETTER
     * will belong to the following token rather than to the preceding, if any,
     * Character.UPPERCASE_LETTER token.
     *
     * @example
     * StringUtils.splitByCharacterTypeCamelCase(null)         = null
     * StringUtils.splitByCharacterTypeCamelCase("")           = []
     * StringUtils.splitByCharacterTypeCamelCase("ab de fg")   = ["ab", " ", "de", " ", "fg"]
     * StringUtils.splitByCharacterTypeCamelCase("ab   de fg") = ["ab", "   ", "de", " ", "fg"]
     * StringUtils.splitByCharacterTypeCamelCase("ab:cd:ef")   = ["ab", ":", "cd", ":", "ef"]
     * StringUtils.splitByCharacterTypeCamelCase("number5")    = ["number", "5"]
     * StringUtils.splitByCharacterTypeCamelCase("fooBar")     = ["foo", "Bar"]
     * StringUtils.splitByCharacterTypeCamelCase("foo200Bar")  = ["foo", "200", "Bar"]
     * StringUtils.splitByCharacterTypeCamelCase("ASFRules")   = ["ASF", "Rules"]
     *
     * @param str the String to split, may be null
     * @return an array of parsed Strings, null if null String input
     */
    splitByCharacterTypeCamelCase: function (str) {
        return splitByCharacterType(str, true);
    },
    /**
     * Splits a String by Character type. Groups of contiguous
     * characters of the same type are returned as complete tokens, with the
     * following exception: if camelCase is true,
     * the character of type Character.UPPERCASE_LETTER, if any,
     * immediately preceding a token of type Character.LOWERCASE_LETTER
     * will belong to the following token rather than to the preceding, if any,
     * Character.UPPERCASE_LETTER token.
     *
     * @param str the String to split, may be null
     * @param camelCase whether to use so-called "camel-case" for letter types
     * @return an array of parsed Strings, null if null String input
     
     */
    splitByCharacterTypeByCase: splitByCharacterType,
    // Joining
    //-----------------------------------------------------------------------
    /**
     * Joins the elements of the provided array into a single String
     * containing the provided list of elements.
     *
     * No separator is added to the joined String.
     * Null objects or empty strings within the array are represented by
     * empty strings.
     *
     * @example
     * StringUtils.join(null)            = null
     * StringUtils.join([])              = ""
     * StringUtils.join([null])          = ""
     * StringUtils.join(["a", "b", "c"]) = "abc"
     * StringUtils.join([null, "", "a"]) = "a"
     *
     * @param array  the array of values to join together, may be null
     * @return the joined String, null if null array input
     */
    join: function (array) {
        return joinBy(array, null);
    },
    /**
     * Joins the elements of the provided array into a single String
     * containing the provided list of elements.
     *
     * No delimiter is added before or after the list.
     * A null separator is the same as an empty String ("").
     * Null objects or empty strings within the array are represented by
     * empty strings.
     *
     * @example
     * StringUtils.joinBy(null, *)                = null
     * StringUtils.joinBy([], *)                  = ""
     * StringUtils.joinBy([null], *)              = ""
     * StringUtils.joinBy(["a", "b", "c"], "--")  = "a--b--c"
     * StringUtils.joinBy(["a", "b", "c"], null)  = "abc"
     * StringUtils.joinBy(["a", "b", "c"], "")    = "abc"
     * StringUtils.joinBy([null, "", "a"], ',')   = ",,a"
     *
     * @param array  the array of values to join together, may be null
     * @param separator  the separator character to use, null treated as ""
     * @return the joined String, null if null array input
     */
    joinBy: joinBy,
    /**
     * Joins the elements of the provided array into a single String
     * containing the provided list of elements.
     *
     * No delimiter is added before or after the list.
     * A null separator is the same as an empty String ("").
     * Null objects or empty strings within the array are represented by
     * empty strings.
     *
     * @example
     * StringUtils.joinBySE(null, *)                = null
     * StringUtils.joinBySE([], *)                  = ""
     * StringUtils.joinBySE([null], *)              = ""
     * StringUtils.joinBySE(["a", "b", "c"], "--")  = "a--b--c"
     * StringUtils.joinBySE(["a", "b", "c"], null)  = "abc"
     * StringUtils.joinBySE(["a", "b", "c"], "")    = "abc"
     * StringUtils.joinBySE([null, "", "a"], ',')   = ",,a"
     *
     * @param array  the array of values to join together, may be null
     * @param separator  the separator character to use, null treated as ""
     * @param startIndex the first index to start joining from.  It is
     * an error to pass in an end index past the end of the array
     * @param endIndex the index to stop joining from (exclusive). It is
     * an error to pass in an end index past the end of the array
     * @return the joined String, null if null array input
     */
    joinBySE: joinBySE,
    // Delete
    //-----------------------------------------------------------------------
    /**
     * Deletes all whitespaces from a String.
     *
     * @example
     * StringUtils.deleteWhitespace(null)         = null
     * StringUtils.deleteWhitespace("")           = ""
     * StringUtils.deleteWhitespace("abc")        = "abc"
     * StringUtils.deleteWhitespace("   ab  c  ") = "abc"
     *
     * @param str  the String to delete whitespace from, may be null
     * @return the String without whitespaces, null if null String input
     */
    deleteWhitespace: function (str) {
        if (isEmpty(str)) {
            return str;
        }
        var sz = str.length;
        var chs = '';
        var count = 0;
        for (var i = 0; i < sz; i++) {
            if (!Character.isWhitespace(str.charAt(i))) {
                setCharAt(chs, count++, str.charAt(i));
            }
        }
        if (count == sz) {
            return str;
        }
        return substringByCount(chs, 0, count);
    },
    // Remove
    //-----------------------------------------------------------------------
    /**
     * Removes a substring only if it is at the begining of a source string,
     * otherwise returns the source string.
     *
     * A null source string will return null.
     * An empty ("") source string will return the empty string.
     * A null search string will return the source string.
     *
     * @example
     * StringUtils.removeStart(null, *)      = null
     * StringUtils.removeStart("", *)        = ""
     * StringUtils.removeStart(*, null)      = *
     * StringUtils.removeStart("www.domain.com", "www.")   = "domain.com"
     * StringUtils.removeStart("domain.com", "www.")       = "domain.com"
     * StringUtils.removeStart("www.domain.com", "domain") = "www.domain.com"
     * StringUtils.removeStart("abc", "")    = "abc"
     *
     * @param str  the source String to search, may be null
     * @param remove  the String to search for and remove, may be null
     * @return the substring with the string removed if found,
     *  null if null String input
     */
    removeStart: function (str, remove) {
        if (isEmpty(str) || isEmpty(remove)) {
            return str;
        }
        if (str.startsWith(remove)) {
            return str.substring(remove.length);
        }
        return str;
    },
    /**
     * Case insensitive removal of a substring if it is at the begining of a source string,
     * otherwise returns the source string.
     *
     * A null source string will return null.
     * An empty ("") source string will return the empty string.
     * A null search string will return the source string.
     *
     * @example
     * StringUtils.removeStartIgnoreCase(null, *)      = null
     * StringUtils.removeStartIgnoreCase("", *)        = ""
     * StringUtils.removeStartIgnoreCase(*, null)      = *
     * StringUtils.removeStartIgnoreCase("www.domain.com", "www.")   = "domain.com"
     * StringUtils.removeStartIgnoreCase("www.domain.com", "WWW.")   = "domain.com"
     * StringUtils.removeStartIgnoreCase("domain.com", "www.")       = "domain.com"
     * StringUtils.removeStartIgnoreCase("www.domain.com", "domain") = "www.domain.com"
     * StringUtils.removeStartIgnoreCase("abc", "")    = "abc"
     *
     * @param str  the source String to search, may be null
     * @param remove  the String to search for (case insensitive) and remove, may be null
     * @return the substring with the string removed if found,
     *  null if null String input
     */
    removeStartIgnoreCase: function (str, remove) {
        if (isEmpty(str) || isEmpty(remove)) {
            return str;
        }
        if (startsWithIgnoreCase(str, remove)) {
            return str.substring(remove.length);
        }
        return str;
    },
    /**
     * Removes a substring only if it is at the end of a source string,
     * otherwise returns the source string.
     *
     * A null source string will return null.
     * An empty ("") source string will return the empty string.
     * A null search string will return the source string.
     *
     * @example
     * StringUtils.removeEnd(null, *)      = null
     * StringUtils.removeEnd("", *)        = ""
     * StringUtils.removeEnd(*, null)      = *
     * StringUtils.removeEnd("www.domain.com", ".com.")  = "www.domain.com"
     * StringUtils.removeEnd("www.domain.com", ".com")   = "www.domain"
     * StringUtils.removeEnd("www.domain.com", "domain") = "www.domain.com"
     * StringUtils.removeEnd("abc", "")    = "abc"
     *
     * @param str  the source String to search, may be null
     * @param remove  the String to search for and remove, may be null
     * @return the substring with the string removed if found,
     *  null if null String input
     */
    removeEnd: removeEnd,
    /**
     * Case insensitive removal of a substring if it is at the end of a source string,
     * otherwise returns the source string.
     *
     * A null source string will return null.
     * An empty ("") source string will return the empty string.
     * A null search string will return the source string.
     *
     * @example
     * StringUtils.removeEndIgnoreCase(null, *)      = null
     * StringUtils.removeEndIgnoreCase("", *)        = ""
     * StringUtils.removeEndIgnoreCase(*, null)      = *
     * StringUtils.removeEndIgnoreCase("www.domain.com", ".com.")  = "www.domain.com"
     * StringUtils.removeEndIgnoreCase("www.domain.com", ".com")   = "www.domain"
     * StringUtils.removeEndIgnoreCase("www.domain.com", "domain") = "www.domain.com"
     * StringUtils.removeEndIgnoreCase("abc", "")    = "abc"
     * StringUtils.removeEndIgnoreCase("www.domain.com", ".COM") = "www.domain")
     * StringUtils.removeEndIgnoreCase("www.domain.COM", ".com") = "www.domain")
     *
     * @param str  the source String to search, may be null
     * @param remove  the String to search for (case insensitive) and remove, may be null
     * @return the substring with the string removed if found,
     *  null if null String input
     */
    removeEndIgnoreCase: function (str, remove) {
        if (isEmpty(str) || isEmpty(remove)) {
            return str;
        }
        if (endsWithIgnoreCase(str, remove)) {
            return str.substring(0, str.length - remove.length);
        }
        return str;
    },
    /**
     * Removes all occurrences of a substring from within the source string.
     *
     * A null source string will return null.
     * An empty ("") source string will return the empty string.
     * A null remove string will return the source string.
     * An empty ("") remove string will return the source string.
     *
     * @example
     * StringUtils.remove(null, *)        = null
     * StringUtils.remove("", *)          = ""
     * StringUtils.remove(*, null)        = *
     * StringUtils.remove(*, "")          = *
     * StringUtils.remove("queued", "ue") = "qd"
     * StringUtils.remove("queued", "zz") = "queued"
     *
     * @param str  the source String to search, may be null
     * @param remove  the String to search for and remove, may be null
     * @return the substring with the string removed if found,
     *  null if null String input
     */
    remove: function (str, remove) {
        if (isEmpty(str) || isEmpty(remove)) {
            return str;
        }
        return replaceMax(str, remove, EMPTY, -1);
    },
    // Replacing
    //-----------------------------------------------------------------------
    /**
     * Replaces a String with another String inside a larger String, once.
     *
     * A null reference passed to this method is a no-op.
     *
     * @example
     * StringUtils.replaceOnce(null, *, *)        = null
     * StringUtils.replaceOnce("", *, *)          = ""
     * StringUtils.replaceOnce("any", null, *)    = "any"
     * StringUtils.replaceOnce("any", *, null)    = "any"
     * StringUtils.replaceOnce("any", "", *)      = "any"
     * StringUtils.replaceOnce("aba", "a", null)  = "aba"
     * StringUtils.replaceOnce("aba", "a", "")    = "ba"
     * StringUtils.replaceOnce("aba", "a", "z")   = "zba"
     *
     * @param text  text to search and replace in, may be null
     * @param searchString  the String to search for, may be null
     * @param replacement  the String to replace with, may be null
     * @return the text with any replacements processed,
     *  null if null String input
     */
    replaceOnce: function (text, searchString, replacement) {
        return replaceMax(text, searchString, replacement, 1);
    },
    /**
     * Replaces all occurrences of a String within another String.
     *
     * A null reference passed to this method is a no-op.
     *
     * @example
     * StringUtils.replace(null, *, *)        = null
     * StringUtils.replace("", *, *)          = ""
     * StringUtils.replace("any", null, *)    = "any"
     * StringUtils.replace("any", *, null)    = "any"
     * StringUtils.replace("any", "", *)      = "any"
     * StringUtils.replace("aba", "a", null)  = "aba"
     * StringUtils.replace("aba", "a", "")    = "b"
     * StringUtils.replace("aba", "a", "z")   = "zbz"
     *
     * @param text  text to search and replace in, may be null
     * @param searchString  the String to search for, may be null
     * @param replacement  the String to replace it with, may be null
     * @return the text with any replacements processed,
     *  null if null String input
     */
    replace: function (text, searchString, replacement) {
        return replaceMax(text, searchString, replacement, -1);
    },
    /**
     * Replaces a String with another String inside a larger String,
     * for the first max values of the search String.
     *
     * A null reference passed to this method is a no-op.
     *
     * @example
     * StringUtils.replaceMax(null, *, *, *)         = null
     * StringUtils.replaceMax("", *, *, *)           = ""
     * StringUtils.replaceMax("any", null, *, *)     = "any"
     * StringUtils.replaceMax("any", *, null, *)     = "any"
     * StringUtils.replaceMax("any", "", *, *)       = "any"
     * StringUtils.replaceMax("any", *, *, 0)        = "any"
     * StringUtils.replaceMax("abaa", "a", null, -1) = "abaa"
     * StringUtils.replaceMax("abaa", "a", "", -1)   = "b"
     * StringUtils.replaceMax("abaa", "a", "z", 0)   = "abaa"
     * StringUtils.replaceMax("abaa", "a", "z", 1)   = "zbaa"
     * StringUtils.replaceMax("abaa", "a", "z", 2)   = "zbza"
     * StringUtils.replaceMax("abaa", "a", "z", -1)  = "zbzz"
     *
     * @param text  text to search and replace in, may be null
     * @param searchString  the String to search for, may be null
     * @param replacement  the String to replace it with, may be null
     * @param max  maximum number of values to replace, or -1 if no maximum
     * @return the text with any replacements processed,
     *  null if null String input
     */
    replaceMax: replaceMax,
    /**
     *
     * Replaces all occurrences of Strings within another String.
     *
     *
     * A null reference passed to this method is a no-op, or if
     * any "search string" or "string to replace" is null, that replace will be
     * ignored. This will not repeat. For repeating replaces, call the
     * overloaded method.
     *
     * @example
     *  StringUtils.replaceEach(null, *, *)        = null
     *  StringUtils.replaceEach("", *, *)          = ""
     *  StringUtils.replaceEach("aba", null, null) = "aba"
     *  StringUtils.replaceEach("aba", [], null) = "aba"
     *  StringUtils.replaceEach("aba", null, []) = "aba"
     *  StringUtils.replaceEach("aba", ["a"], null)  = "aba"
     *  StringUtils.replaceEach("aba", ["a"], [""])  = "b"
     *  StringUtils.replaceEach("aba", [null], ["a"])  = "aba"
     *  StringUtils.replaceEach("abcde", ["ab", "d"], ["w", "t"])  = "wcte"
     *  (example of how it does not repeat)
     *  StringUtils.replaceEach("abcde", ["ab", "d"], ["d", "t"])  = "dcte"
     *
     * @param text
     *            text to search and replace in, no-op if null
     * @param searchList
     *            the Strings to search for, no-op if null
     * @param replacementList
     *            the Strings to replace them with, no-op if null
     * @return the text with any replacements processed, null if
     *         null String input
     */
    replaceEach: function (text, searchList, replacementList) {
        return replaceEachRecursive(text, searchList, replacementList, false, 0);
    },
    /**
     *
     * Replaces all occurrences of Strings within another String.
     *
     *
     *
     * A null reference passed to this method is a no-op, or if
     * any "search string" or "string to replace" is null, that replace will be
     * ignored. This will not repeat. For repeating replaces, call the
     * overloaded method.
     *
     *
     * @example
     *  StringUtils.replaceEachRepeatedly(null, *, *, *) = null
     *  StringUtils.replaceEachRepeatedly("", *, *, *) = ""
     *  StringUtils.replaceEachRepeatedly("aba", null, null, *) = "aba"
     *  StringUtils.replaceEachRepeatedly("aba", [], null, *) = "aba"
     *  StringUtils.replaceEachRepeatedly("aba", null, [], *) = "aba"
     *  StringUtils.replaceEachRepeatedly("aba", ["a"], null, *) = "aba"
     *  StringUtils.replaceEachRepeatedly("aba", ["a"], [""], *) = "b"
     *  StringUtils.replaceEachRepeatedly("aba", [null], ["a"], *) = "aba"
     *  StringUtils.replaceEachRepeatedly("abcde", ["ab", "d"], ["w", "t"], *) = "wcte"
     *  StringUtils.replaceEachRepeatedly("abcde", ["ab", "d"], ["d", "t"], false) = "dcte"
     *  StringUtils.replaceEachRepeatedly("abcde", ["ab", "d"], ["d", "t"], true) = "tcte"
     *  StringUtils.replaceEachRepeatedly("abcde", ["ab", "d"], ["d", "ab"], true) = IllegalArgumentException
     *  StringUtils.replaceEachRepeatedly("abcde", ["ab", "d"], ["d", "ab"], false) = "dcabe"
     *
     * @param text
     *            text to search and replace in, no-op if null
     * @param searchList
     *            the Strings to search for, no-op if null
     * @param replacementList
     *            the Strings to replace them with, no-op if null
     * @return the text with any replacements processed, null if
     *         null String input
     *
     */
    replaceEachRepeatedly: function (text, searchList, replacementList) {
        // timeToLive should be 0 if not used or nothing to replace, else it's
        // the length of the replace array
        var timeToLive = searchList == null ? 0 : searchList.length;
        return replaceEachRecursive(text, searchList, replacementList, true, timeToLive);
    },
    /**
     *
     * Replaces all occurrences of Strings within another String.
     *
     *
     *
     * A null reference passed to this method is a no-op, or if
     * any "search string" or "string to replace" is null, that replace will be
     * ignored.
     *
     *
     * @example
     *  StringUtils.replaceEachRecursive(null, *, *, *) = null
     *  StringUtils.replaceEachRecursive("", *, *, *) = ""
     *  StringUtils.replaceEachRecursive("aba", null, null, *) = "aba"
     *  StringUtils.replaceEachRecursive("aba", [], null, *) = "aba"
     *  StringUtils.replaceEachRecursive("aba", null, [], *) = "aba"
     *  StringUtils.replaceEachRecursive("aba", ["a"], null, *) = "aba"
     *  StringUtils.replaceEachRecursive("aba", ["a"], [""], *) = "b"
     *  StringUtils.replaceEachRecursive("aba", [null], ["a"], *) = "aba"
     *  StringUtils.replaceEachRecursive("abcde", ["ab", "d"], ["w", "t"], *) = "wcte"
     *  (example of how it repeats)
     *  StringUtils.replaceEachRecursive("abcde", ["ab", "d"], ["d", "t"], false) = "dcte"
     *  StringUtils.replaceEachRecursive("abcde", ["ab", "d"], ["d", "t"], true) = "tcte"
     *  StringUtils.replaceEachRecursive("abcde", ["ab", "d"], ["d", "ab"], *) = IllegalArgumentException
     
     *
     * @param text
     *            text to search and replace in, no-op if null
     * @param searchList
     *            the Strings to search for, no-op if null
     * @param replacementList
     *            the Strings to replace them with, no-op if null
     * @param repeat if true, then replace repeatedly
     *       until there are no more possible replacements or timeToLive < 0
     * @param timeToLive
     *            if less than 0 then there is a circular reference and endless
     *            loop
     * @return the text with any replacements processed, null if
     *         null String input
     */
    replaceEachRecursive: replaceEachRecursive,
    /**
     * Replaces multiple characters in a String in one go.
     * This method can also be used to delete characters.
     *
     * For example:<br />
     * replaceChars(&quot;hello&quot;, &quot;ho&quot;, &quot;jy&quot;) = jelly.
     *
     * A null string input returns null.
     * An empty ("") string input returns an empty string.
     * A null or empty set of search characters returns the input string.
     *
     * The length of the search characters should normally equal the length
     * of the replace characters.
     * If the search characters is longer, then the extra search characters
     * are deleted.
     * If the search characters is shorter, then the extra replace characters
     * are ignored.
     *
     * @example
     * StringUtils.replaceChars(null, *, *)           = null
     * StringUtils.replaceChars("", *, *)             = ""
     * StringUtils.replaceChars("abc", null, *)       = "abc"
     * StringUtils.replaceChars("abc", "", *)         = "abc"
     * StringUtils.replaceChars("abc", "b", null)     = "ac"
     * StringUtils.replaceChars("abc", "b", "")       = "ac"
     * StringUtils.replaceChars("abcba", "bc", "yz")  = "ayzya"
     * StringUtils.replaceChars("abcba", "bc", "y")   = "ayya"
     * StringUtils.replaceChars("abcba", "bc", "yzx") = "ayzya"
     *
     * @param str  String to replace characters in, may be null
     * @param searchChars  a set of characters to search for, may be null
     * @param replaceChars  a set of characters to replace, may be null
     * @return modified String, null if null string input
     
     */
    replaceChars: function (str, searchChars, replaceChars) {
        if (isEmpty(str) || isEmpty(searchChars)) {
            return str;
        }
        if (replaceChars == null) {
            replaceChars = EMPTY;
        }
        var modified = false;
        var replaceCharsLength = replaceChars.length;
        var strLength = str.length;
        var buf = '';
        for (var i = 0; i < strLength; i++) {
            var ch = str.charAt(i);
            var index = searchChars.indexOf(ch);
            if (index >= 0) {
                modified = true;
                if (index < replaceCharsLength) {
                    buf += (replaceChars.charAt(index));
                }
            }
            else {
                buf += (ch);
            }
        }
        if (modified) {
            return buf.toString();
        }
        return str;
    },
    // Overlay
    //-----------------------------------------------------------------------
    /**
     * Overlays part of a String with another String.
     *
     * A null string input returns null.
     * A negative index is treated as zero.
     * An index greater than the string length is treated as the string length.
     * The start index is always the smaller of the two indices.
     *
     * @example
     * StringUtils.overlay(null, *, *, *)            = null
     * StringUtils.overlay("", "abc", 0, 0)          = "abc"
     * StringUtils.overlay("abcdef", null, 2, 4)     = "abef"
     * StringUtils.overlay("abcdef", "", 2, 4)       = "abef"
     * StringUtils.overlay("abcdef", "", 4, 2)       = "abef"
     * StringUtils.overlay("abcdef", "zzzz", 2, 4)   = "abzzzzef"
     * StringUtils.overlay("abcdef", "zzzz", 4, 2)   = "abzzzzef"
     * StringUtils.overlay("abcdef", "zzzz", -1, 4)  = "zzzzef"
     * StringUtils.overlay("abcdef", "zzzz", 2, 8)   = "abzzzz"
     * StringUtils.overlay("abcdef", "zzzz", -2, -3) = "zzzzabcdef"
     * StringUtils.overlay("abcdef", "zzzz", 8, 10)  = "abcdefzzzz"
     *
     * @param str  the String to do overlaying in, may be null
     * @param overlay  the String to overlay, may be null
     * @param start  the position to start overlaying at
     * @param end  the position to stop overlaying before
     * @return overlayed String, null if null String input
     */
    overlay: function (str, overlay, start, end) {
        if (str == null) {
            return null;
        }
        if (overlay == null) {
            overlay = EMPTY;
        }
        var len = str.length;
        if (start < 0) {
            start = 0;
        }
        if (start > len) {
            start = len;
        }
        if (end < 0) {
            end = 0;
        }
        if (end > len) {
            end = len;
        }
        if (start > end) {
            var temp = start;
            start = end;
            end = temp;
        }
        return (str.substring(0, start)) + (overlay) + (str.substring(end));
    },
    // Chomping
    //-----------------------------------------------------------------------
    /**
     * Removes one newline from end of a String if it's there,
     * otherwise leave it alone.  A newline is &quot;\n&quot;,
     * &quot;\r&quot;, or &quot;\r\n&quot;.
     *
     * NOTE: This method changed in 2.0.
     * It now more closely matches Perl chomp.
     *
     * @example
     * StringUtils.chomp(null)          = null
     * StringUtils.chomp("")            = ""
     * StringUtils.chomp("abc \r")      = "abc "
     * StringUtils.chomp("abc\n")       = "abc"
     * StringUtils.chomp("abc\r\n")     = "abc"
     * StringUtils.chomp("abc\r\n\r\n") = "abc\r\n"
     * StringUtils.chomp("abc\n\r")     = "abc\n"
     * StringUtils.chomp("abc\n\rabc")  = "abc\n\rabc"
     * StringUtils.chomp("\r")          = ""
     * StringUtils.chomp("\n")          = ""
     * StringUtils.chomp("\r\n")        = ""
     *
     * @param str  the String to chomp a newline from, may be null
     * @return String without newline, null if null String input
     */
    chomp: function (str) {
        if (isEmpty(str)) {
            return str;
        }
        if (str.length == 1) {
            var ch = str.charAt(0);
            if (ch == CharUtils.CR || ch == CharUtils.LF) {
                return EMPTY;
            }
            return str;
        }
        var lastIdx = str.length - 1;
        var last = str.charAt(lastIdx);
        if (last == CharUtils.LF) {
            if (str.charAt(lastIdx - 1) == CharUtils.CR) {
                lastIdx--;
            }
        }
        else if (last != CharUtils.CR) {
            lastIdx++;
        }
        return str.substring(0, lastIdx);
    },
    /**
     * Removes separator from the end of
     * str if it's there, otherwise leave it alone.
     *
     *@example
     * StringUtils.chompBy(null, *)         = null
     * StringUtils.chompBy("", *)           = ""
     * StringUtils.chompBy("foobar", "bar") = "foo"
     * StringUtils.chompBy("foobar", "baz") = "foobar"
     * StringUtils.chompBy("foo", "foo")    = ""
     * StringUtils.chompBy("foo ", "foo")   = "foo "
     * StringUtils.chompBy(" foo", "foo")   = " "
     * StringUtils.chompBy("foo", "foooo")  = "foo"
     * StringUtils.chompBy("foo", "")       = "foo"
     * StringUtils.chompBy("foo", null)     = "foo"
     *
     * @param str  the String to chomp from, may be null
     * @param separator  separator String, may be null
     * @return String without trailing separator, null if null String input
     */
    chompBy: function (str, separator) {
        if (isEmpty(str) || separator == null) {
            return str;
        }
        if (str.endsWith(separator)) {
            return str.substring(0, str.length - separator.length);
        }
        return str;
    },
    // Chopping
    //-----------------------------------------------------------------------
    /**
     * Remove the last character from a String.
     *
     * If the String ends in \r\n, then remove both
     * of them.
     *
     * @example
     * StringUtils.chop(null)          = null
     * StringUtils.chop("")            = ""
     * StringUtils.chop("abc \r")      = "abc "
     * StringUtils.chop("abc\n")       = "abc"
     * StringUtils.chop("abc\r\n")     = "abc"
     * StringUtils.chop("abc")         = "ab"
     * StringUtils.chop("abc\nabc")    = "abc\nab"
     * StringUtils.chop("a")           = ""
     * StringUtils.chop("\r")          = ""
     * StringUtils.chop("\n")          = ""
     * StringUtils.chop("\r\n")        = ""
     *
     * @param str  the String to chop last character from, may be null
     * @return String without last character, null if null String input
     */
    chop: function (str) {
        if (str == null) {
            return null;
        }
        var strLen = str.length;
        if (strLen < 2) {
            return EMPTY;
        }
        var lastIdx = strLen - 1;
        var ret = str.substring(0, lastIdx);
        var last = str.charAt(lastIdx);
        if (last == CharUtils.LF) {
            if (ret.charAt(lastIdx - 1) == CharUtils.CR) {
                return ret.substring(0, lastIdx - 1);
            }
        }
        return ret;
    },
    // Padding
    //-----------------------------------------------------------------------
    /**
     * Repeat a String repeat times to form a new string.
     *
     * @example
     * StringUtils.repeat(null, 2) = null
     * StringUtils.repeat("", 0)   = ""
     * StringUtils.repeat("", 2)   = ""
     * StringUtils.repeat("a", 3)  = "aaa"
     * StringUtils.repeat("ab", 2) = "abab"
     * StringUtils.repeat("a", -2) = ""
     *
     * @param str  the String to repeat, may be null
     * @param repeat  number of times to repeat str, negative treated as zero
     * @return a new string consisting of the original String repeated,
     *  null if null String input
     */
    repeat: repeat,
    /**
     * Repeat a String repeat times to form a
     * new string, with a String separator injected each time.
     *
     * @example
     * StringUtils.repeat(null, null, 2) = null
     * StringUtils.repeat(null, "x", 2)  = null
     * StringUtils.repeat("", null, 0)   = ""
     * StringUtils.repeat("", "", 2)     = ""
     * StringUtils.repeat("", "x", 3)    = "xxx"
     * StringUtils.repeat("?", ", ", 3)  = "?, ?, ?"
     *
     * @param str        the String to repeat, may be null
     * @param separator  the String to inject, may be null
     * @param repeat     number of times to repeat str, negative treated as zero
     * @return a new string consisting of the original String repeated,
     *  null if null String input
     */
    repeatBy: function (str, separator, rep) {
        if (str == null || separator == null) {
            return repeat(str, rep);
        }
        else {
            var result = repeat(str + separator, rep);
            return removeEnd(result, separator);
        }
    },
    /**
     * Returns padding using the specified delimiter repeated
     * to a given length.
     *
     * @example
     * StringUtils.padding(0, 'e')  = ""
     * StringUtils.padding(3, 'e')  = "eee"
     * StringUtils.padding(-2, 'e') = IndexOutOfBoundsException
     *
     * @param repeat  number of times to repeat delim
     * @param padChar  character to repeat
     * @return String with repeated character
     */
    padding: padding,
    /**
     * Right pad a String with spaces (' ').
     *
     * The String is padded to the size of size.
     *
     * @example
     * StringUtils.rightPad(null, *)   = null
     * StringUtils.rightPad("", 3)     = "   "
     * StringUtils.rightPad("bat", 3)  = "bat"
     * StringUtils.rightPad("bat", 5)  = "bat  "
     * StringUtils.rightPad("bat", 1)  = "bat"
     * StringUtils.rightPad("bat", -1) = "bat"
     *
     * @param str  the String to pad out, may be null
     * @param size  the size to pad to
     * @return right padded String or original String if no padding is necessary,
     *  null if null String input
     */
    rightPad: function (str, size) {
        return rightPad(str, size, ' ');
    },
    /**
     * Right pad a String with a specified String.
     *
     * The String is padded to the size of size.
     *
     * @example
     * StringUtils.rightPadBy(null, *, *)      = null
     * StringUtils.rightPadBy("", 3, "z")      = "zzz"
     * StringUtils.rightPadBy("bat", 3, "yz")  = "bat"
     * StringUtils.rightPadBy("bat", 5, "yz")  = "batyz"
     * StringUtils.rightPadBy("bat", 8, "yz")  = "batyzyzy"
     * StringUtils.rightPadBy("bat", 1, "yz")  = "bat"
     * StringUtils.rightPadBy("bat", -1, "yz") = "bat"
     * StringUtils.rightPadBy("bat", 5, null)  = "bat  "
     * StringUtils.rightPadBy("bat", 5, "")    = "bat  "
     *
     * @param str  the String to pad out, may be null
     * @param size  the size to pad to
     * @param padStr  the String to pad with, null or empty treated as single space
     * @return right padded String or original String if no padding is necessary,
     *  null if null String input
     */
    rightPadBy: rightPad,
    /**
     * Left pad a String with spaces (' ').
     *
     * The String is padded to the size of size.
     *
     * @example
     * StringUtils.leftPad(null, *)   = null
     * StringUtils.leftPad("", 3)     = "   "
     * StringUtils.leftPad("bat", 3)  = "bat"
     * StringUtils.leftPad("bat", 5)  = "  bat"
     * StringUtils.leftPad("bat", 1)  = "bat"
     * StringUtils.leftPad("bat", -1) = "bat"
     *
     * @param str  the String to pad out, may be null
     * @param size  the size to pad to
     * @return left padded String or original String if no padding is necessary,
     *  null if null String input
     */
    leftPad: function (str, size) {
        return leftPad(str, size, ' ');
    },
    /**
     * Left pad a String with a specified String.
     *
     * Pad to a size of size.
     *
     * @example
     * StringUtils.leftPadBy(null, *, *)      = null
     * StringUtils.leftPadBy("", 3, "z")      = "zzz"
     * StringUtils.leftPadBy("bat", 3, "yz")  = "bat"
     * StringUtils.leftPadBy("bat", 5, "yz")  = "yzbat"
     * StringUtils.leftPadBy("bat", 8, "yz")  = "yzyzybat"
     * StringUtils.leftPadBy("bat", 1, "yz")  = "bat"
     * StringUtils.leftPadBy("bat", -1, "yz") = "bat"
     * StringUtils.leftPadBy("bat", 5, null)  = "  bat"
     * StringUtils.leftPadBy("bat", 5, "")    = "  bat"
     *
     * @param str  the String to pad out, may be null
     * @param size  the size to pad to
     * @param padStr  the String to pad with, null or empty treated as single space
     * @return left padded String or original String if no padding is necessary,
     *  null if null String input
     */
    leftPadBy: leftPad,
    /**
     * Gets a String's length or 0 if the String is null.
     *
     * @param str
     *            a String or null
     * @return String length or 0 if the String is null.
     */
    length: function (str) {
        return str == null ? 0 : str.length;
    },
    // Centering
    //-----------------------------------------------------------------------
    /**
     * Centers a String in a larger String of size size
     * using the space character (' ').
     *
     * If the size is less than the String length, the String is returned.
     * A null String returns null.
     * A negative size is treated as zero.
     *
     * Equivalent to center(str, size, " ").
     *
     * @example
     * StringUtils.center(null, *)   = null
     * StringUtils.center("", 4)     = "    "
     * StringUtils.center("ab", -1)  = "ab"
     * StringUtils.center("ab", 4)   = " ab "
     * StringUtils.center("abcd", 2) = "abcd"
     * StringUtils.center("a", 4)    = " a  "
     *
     * @param str  the String to center, may be null
     * @param size  the int size of new string, negative treated as zero
     * @return centered String, null if null String input
     */
    center: function (str, size) {
        return center(str, size, ' ');
    },
    /**
     * Centers a String in a larger String of size size.
     * Uses a supplied String as the value to pad the String with.
     *
     * If the size is less than the String length, the String is returned.
     * A null String returns null.
     * A negative size is treated as zero.
     *
     * @example
     * StringUtils.centerBy(null, *, *)     = null
     * StringUtils.centerBy("", 4, " ")     = "    "
     * StringUtils.centerBy("ab", -1, " ")  = "ab"
     * StringUtils.centerBy("ab", 4, " ")   = " ab"
     * StringUtils.centerBy("abcd", 2, " ") = "abcd"
     * StringUtils.centerBy("a", 4, " ")    = " a  "
     * StringUtils.centerBy("a", 4, "yz")   = "yayz"
     * StringUtils.centerBy("abc", 7, null) = "  abc  "
     * StringUtils.centerBy("abc", 7, "")   = "  abc  "
     *
     * @param str  the String to center, may be null
     * @param size  the int size of new string, negative treated as zero
     * @param padStr  the String to pad the new string with, must not be null or empty
     * @return centered String, null if null String input
     */
    centerBy: center,
    // Case conversion
    //-----------------------------------------------------------------------
    /**
     * Converts a String to upper case as per {@link String#toUpperCase()}.
     *
     * A null input String returns null.
     *
     * @example
     * StringUtils.upperCase(null)  = null
     * StringUtils.upperCase("")    = ""
     * StringUtils.upperCase("aBc") = "ABC"
     *
     * @param str  the String to upper case, may be null
     * @return the upper cased String, null if null String input
     */
    upperCase: upperCase,
    /**
     * Converts a String to lower case.
     *
     * A null input String returns null.
     *
     * @example
     * StringUtils.lowerCase(null)  = null
     * StringUtils.lowerCase("")    = ""
     * StringUtils.lowerCase("aBc") = "abc"
     *
     * @param str  the String to lower case, may be null
     * @return the lower cased String, null if null String input
     */
    lowerCase: lowerCase,
    /**
     * Capitalizes a String changing the first letter to title case. No other letters are changed.
     *A null input String returns null.
     *
     * @example
     * StringUtils.capitalize(null)  = null
     * StringUtils.capitalize("")    = ""
     * StringUtils.capitalize("cat") = "Cat"
     * StringUtils.capitalize("cAt") = "CAt"
     *
     * @param str  the String to capitalize, may be null
     * @return the capitalized String, null if null String input
     */
    capitalize: function (str) {
        var strLen;
        if (str == null || (strLen = str.length) == 0) {
            return str;
        }
        return Character.toTitleCase(str.charAt(0)) + (str.substring(1));
    },
    /**
     * Uncapitalizes a String changing the first letter to title case. No other letters are changed.
     *
     * A null input String returns null.
     *
     * @example
     * StringUtils.uncapitalize(null)  = null
     * StringUtils.uncapitalize("")    = ""
     * StringUtils.uncapitalize("Cat") = "cat"
     * StringUtils.uncapitalize("CAT") = "cAT"
     *
     * @param str  the String to uncapitalize, may be null
     * @return the uncapitalized String, null if null String input
     */
    uncapitalize: function (str) {
        var strLen;
        if (str == null || (strLen = str.length) == 0) {
            return str;
        }
        return lowerCase(str.charAt(0)) + (str.substring(1));
    },
    /**
     * Swaps the case of a String changing upper and title case to
     * lower case, and lower case to upper case.
     *
     *
     *  - _Upper case character converts to Lower case_
     *  - _Title case character converts to Lower case_
     *  - _Lower case character converts to Upper case_
     *
     * A null input String returns null.
     *
     * @example
     * StringUtils.swapCase(null)                 = null
     * StringUtils.swapCase("")                   = ""
     * StringUtils.swapCase("The dog has a BONE") = "tHE DOG HAS A bone"
     *
     * @param str  the String to swap case, may be null
     * @return the changed String, null if null String input
     */
    swapCase: function (str) {
        var strLen;
        if (str == null || (strLen = str.length) == 0) {
            return str;
        }
        var buffer = '';
        var ch = '';
        for (var i = 0; i < strLen; i++) {
            ch = str.charAt(i);
            if (CharUtils.isAsciiAlphaUpper(ch)) {
                ch = lowerCase(ch);
            }
            else if (Character.isTitleCase(ch)) {
                ch = lowerCase(ch);
            }
            else if (CharUtils.isAsciiAlphaLower(ch)) {
                ch = upperCase(ch);
            }
            buffer += (ch);
        }
        return buffer;
    },
    // Count matches
    //-----------------------------------------------------------------------
    /**
     * Counts how many times the substring appears in the larger String.
     *
     * A null or empty ("") String input returns 0.
     *
     * @example
     * StringUtils.countMatches(null, *)       = 0
     * StringUtils.countMatches("", *)         = 0
     * StringUtils.countMatches("abba", null)  = 0
     * StringUtils.countMatches("abba", "")    = 0
     * StringUtils.countMatches("abba", "a")   = 2
     * StringUtils.countMatches("abba", "ab")  = 1
     * StringUtils.countMatches("abba", "xxx") = 0
     *
     * @param str  the String to check, may be null
     * @param sub  the substring to count, may be null
     * @return the number of occurrences, 0 if either String is null
     */
    countMatches: function (str, sub) {
        if (isEmpty(str) || isEmpty(sub)) {
            return 0;
        }
        var count = 0;
        var idx = 0;
        while ((idx = str.indexOf(sub, idx)) != INDEX_NOT_FOUND) {
            count++;
            idx += sub.length;
        }
        return count;
    },
    // Character Tests
    //-----------------------------------------------------------------------
    /**
     * Checks if the String contains only unicode letters.
     *
     * null will return false.
     * An empty String (length=0) will return true.
     *
     * @example
     * StringUtils.isAlpha(null)   = false
     * StringUtils.isAlpha("")     = true
     * StringUtils.isAlpha("  ")   = false
     * StringUtils.isAlpha("abc")  = true
     * StringUtils.isAlpha("ab2c") = false
     * StringUtils.isAlpha("ab-c") = false
     *
     * @param str  the String to check, may be null
     * @return true if only contains letters, and is non-null
     */
    isAlpha: function (str) {
        if (str == null) {
            return false;
        }
        var sz = str.length;
        for (var i = 0; i < sz; i++) {
            if (CharUtils.isAsciiAlpha(str.charAt(i)) == false) {
                return false;
            }
        }
        return true;
    },
    /**
     * Checks if the String contains only unicode letters and
     * space (' ').
     *
     * null will return false
     * An empty String (length=0) will return true.
     *
     * @example
     * StringUtils.isAlphaSpace(null)   = false
     * StringUtils.isAlphaSpace("")     = true
     * StringUtils.isAlphaSpace("  ")   = true
     * StringUtils.isAlphaSpace("abc")  = true
     * StringUtils.isAlphaSpace("ab c") = true
     * StringUtils.isAlphaSpace("ab2c") = false
     * StringUtils.isAlphaSpace("ab-c") = false
     *
     * @param str  the String to check, may be null
     * @return true if only contains letters and space,
     *  and is non-null
     */
    isAlphaSpace: function (str) {
        if (str == null) {
            return false;
        }
        var sz = str.length;
        for (var i = 0; i < sz; i++) {
            if ((CharUtils.isAsciiAlpha(str.charAt(i)) == false) && (str.charAt(i) != ' ')) {
                return false;
            }
        }
        return true;
    },
    /**
     * Checks if the String contains only unicode letters or digits.
     *
     * null will return false.
     * An empty String (length=0) will return true.
     *
     * @example
     * StringUtils.isAlphanumeric(null)   = false
     * StringUtils.isAlphanumeric("")     = true
     * StringUtils.isAlphanumeric("  ")   = false
     * StringUtils.isAlphanumeric("abc")  = true
     * StringUtils.isAlphanumeric("ab c") = false
     * StringUtils.isAlphanumeric("ab2c") = true
     * StringUtils.isAlphanumeric("ab-c") = false
     *
     * @param str  the String to check, may be null
     * @return true if only contains letters or digits,
     *  and is non-null
     */
    isAlphanumeric: function (str) {
        if (str == null) {
            return false;
        }
        var sz = str.length;
        for (var i = 0; i < sz; i++) {
            if (CharUtils.isAsciiAlphanumeric(str.charAt(i)) == false) {
                return false;
            }
        }
        return true;
    },
    /**
     * Checks if the String contains only unicode letters, digits
     * or space (' ').
     *
     * null will return false.
     * An empty String (length=0) will return true.
     *
     * @example
     * StringUtils.isAlphanumericSpace(null)   = false
     * StringUtils.isAlphanumericSpace("")     = true
     * StringUtils.isAlphanumericSpace("  ")   = true
     * StringUtils.isAlphanumericSpace("abc")  = true
     * StringUtils.isAlphanumericSpace("ab c") = true
     * StringUtils.isAlphanumericSpace("ab2c") = true
     * StringUtils.isAlphanumericSpace("ab-c") = false
     *
     * @param str  the String to check, may be null
     * @return true if only contains letters, digits or space,
     *  and is non-null
     */
    isAlphanumericSpace: function (str) {
        if (str == null) {
            return false;
        }
        var sz = str.length;
        for (var i = 0; i < sz; i++) {
            if ((CharUtils.isAsciiAlphanumeric(str.charAt(i)) == false) && (str.charAt(i) != ' ')) {
                return false;
            }
        }
        return true;
    },
    /**
     * Checks if the string contains only ASCII printable characters.
     *
     * null will return false.
     * An empty String (length=0) will return true.
     *
     * @example
     * StringUtils.isAsciiPrintable(null)     = false
     * StringUtils.isAsciiPrintable("")       = true
     * StringUtils.isAsciiPrintable(" ")      = true
     * StringUtils.isAsciiPrintable("Ceki")   = true
     * StringUtils.isAsciiPrintable("ab2c")   = true
     * StringUtils.isAsciiPrintable("!ab-c~") = true
     * StringUtils.isAsciiPrintable("\u0020") = true
     * StringUtils.isAsciiPrintable("\u0021") = true
     * StringUtils.isAsciiPrintable("\u007e") = true
     * StringUtils.isAsciiPrintable("\u007f") = false
     * StringUtils.isAsciiPrintable("Ceki G\u00fclc\u00fc") = false
     *
     * @param str the string to check, may be null
     * @return true if every character is in the range
     *  32 thru 126
     */
    isAsciiPrintable: function (str) {
        if (str == null) {
            return false;
        }
        var sz = str.length;
        for (var i = 0; i < sz; i++) {
            if (CharUtils.isAsciiPrintable(str.charAt(i)) == false) {
                return false;
            }
        }
        return true;
    },
    /**
     * Checks if the String contains only unicode digits.
     * A decimal polet is not a unicode digit and returns false.
     *
     * null will return false.
     * An empty String (length=0) will return true.
     *
     * @example
     * StringUtils.isNumeric(null)   = false
     * StringUtils.isNumeric("")     = true
     * StringUtils.isNumeric("  ")   = false
     * StringUtils.isNumeric("123")  = true
     * StringUtils.isNumeric("12 3") = false
     * StringUtils.isNumeric("ab2c") = false
     * StringUtils.isNumeric("12-3") = false
     * StringUtils.isNumeric("12.3") = false
     *
     * @param str  the String to check, may be null
     * @return true if only contains digits, and is non-null
     */
    isNumeric: function (str) {
        if (str == null) {
            return false;
        }
        var sz = str.length;
        for (var i = 0; i < sz; i++) {
            if (CharUtils.isAsciiNumeric(str.charAt(i)) == false) {
                return false;
            }
        }
        return true;
    },
    /**
     * Checks if the String contains only unicode digits or space
     * (' ').
     * A decimal polet is not a unicode digit and returns false.
     *
     * null will return false.
     * An empty String (length=0) will return true.
     *
     * @example
     * StringUtils.isNumericSpace(null)   = false
     * StringUtils.isNumericSpace("")     = true
     * StringUtils.isNumericSpace("  ")   = true
     * StringUtils.isNumericSpace("123")  = true
     * StringUtils.isNumericSpace("12 3") = true
     * StringUtils.isNumericSpace("ab2c") = false
     * StringUtils.isNumericSpace("12-3") = false
     * StringUtils.isNumericSpace("12.3") = false
     *
     * @param str  the String to check, may be null
     * @return true if only contains digits or space,
     *  and is non-null
     */
    isNumericSpace: function (str) {
        if (str == null) {
            return false;
        }
        var sz = str.length;
        for (var i = 0; i < sz; i++) {
            if ((CharUtils.isAsciiNumeric(str.charAt(i)) == false) && (str.charAt(i) != ' ')) {
                return false;
            }
        }
        return true;
    },
    /**
     * Checks if the String contains only whitespace.
     *
     * null will return false.
     * An empty String (length=0) will return true.
     *
     * @example
     * StringUtils.isWhitespace(null)   = false
     * StringUtils.isWhitespace("")     = true
     * StringUtils.isWhitespace("  ")   = true
     * StringUtils.isWhitespace("abc")  = false
     * StringUtils.isWhitespace("ab2c") = false
     * StringUtils.isWhitespace("ab-c") = false
     *
     * @param str  the String to check, may be null
     * @return true if only contains whitespace, and is non-null
     */
    isWhitespace: function (str) {
        if (str == null) {
            return false;
        }
        var sz = str.length;
        for (var i = 0; i < sz; i++) {
            if ((Character.isWhitespace(str.charAt(i)) == false)) {
                return false;
            }
        }
        return true;
    },
    /**
     * Checks if the String contains only lowercase characters.
     *
     * null will return false.
     * An empty String (length=0) will return false.
     *
     * @example
     * StringUtils.isAllLowerCase(null)   = false
     * StringUtils.isAllLowerCase("")     = false
     * StringUtils.isAllLowerCase("  ")   = false
     * StringUtils.isAllLowerCase("abc")  = true
     * StringUtils.isAllLowerCase("abC") = false
     *
     * @param str  the String to check, may be null
     * @return true if only contains lowercase characters, and is non-null
     
     */
    isAllLowerCase: function (str) {
        if (str == null || isEmpty(str)) {
            return false;
        }
        var sz = str.length;
        for (var i = 0; i < sz; i++) {
            if (CharUtils.isAsciiAlphaLower(str.charAt(i)) == false) {
                return false;
            }
        }
        return true;
    },
    /**
     * Checks if the String contains only uppercase characters.
     *
     * null will return false.
     * An empty String (length=0) will return false.
     *
     * @example
     * StringUtils.isAllUpperCase(null)   = false
     * StringUtils.isAllUpperCase("")     = false
     * StringUtils.isAllUpperCase("  ")   = false
     * StringUtils.isAllUpperCase("ABC")  = true
     * StringUtils.isAllUpperCase("aBC") = false
     *
     * @param str  the String to check, may be null
     * @return true if only contains uppercase characters, and is non-null
     */
    isAllUpperCase: function (str) {
        if (str == null || isEmpty(str)) {
            return false;
        }
        var sz = str.length;
        for (var i = 0; i < sz; i++) {
            if (CharUtils.isAsciiAlphaUpper(str.charAt(i)) == false) {
                return false;
            }
        }
        return true;
    },
    // Defaults
    //-----------------------------------------------------------------------
    /**
     * Returns either the passed in String,
     * or if the String is null, an empty String ("").
     *
     * @example
     * StringUtils.defaultString(null)  = ""
     * StringUtils.defaultString("")    = ""
     * StringUtils.defaultString("bat") = "bat"
     *
     * @param str  the String to check, may be null
     * @return the passed in String, or the empty String if it
     *  was null
     */
    defaultString: function (str) {
        return str == null ? EMPTY : str;
    },
    /**
     * Returns either the passed in String, or if the String is
     * null, the value of defaultStr.
     *
     * @example
     * StringUtils.getOrDefaultString(null, "NULL")  = "NULL"
     * StringUtils.getOrDefaultString("", "NULL")    = ""
     * StringUtils.getOrDefaultString("bat", "NULL") = "bat"
     *
     * @param str  the String to check, may be null
     * @param defaultStr  the default String to return
     *  if the input is null, may be null
     * @return the passed in String, or the default if it was null
     */
    getOrDefaultString: function (str, defaultStr) {
        return str == null ? defaultStr : str;
    },
    /**
     * Returns either the passed in String, or if the String is
     * whitespace, empty ("") or null, the value of defaultStr.
     *
     * @example
     * StringUtils.defaultIfBlank(null, "NULL")  = "NULL"
     * StringUtils.defaultIfBlank("", "NULL")    = "NULL"
     * StringUtils.defaultIfBlank(" ", "NULL")   = "NULL"
     * StringUtils.defaultIfBlank("bat", "NULL") = "bat"
     * StringUtils.defaultIfBlank("", null)      = null
     
     * @param str the String to check, may be null
     * @param defaultStr  the default String to return
     *  if the input is whitespace, empty ("") or null, may be null
     * @return the passed in String, or the default
     */
    defaultIfBlank: function (str, defaultStr) {
        return isBlank(str) ? defaultStr : str;
    },
    /**
     * Returns either the passed in String, or if the String is
     * empty or null, the value of defaultStr.
     *
     * @example
     * StringUtils.defaultIfEmpty(null, "NULL")  = "NULL"
     * StringUtils.defaultIfEmpty("", "NULL")    = "NULL"
     * StringUtils.defaultIfEmpty("bat", "NULL") = "bat"
     * StringUtils.defaultIfEmpty("", null)      = null
     *
     * @param str  the String to check, may be null
     * @param defaultStr  the default String to return
     *  if the input is empty ("") or null, may be null
     * @return the passed in String, or the default
     */
    defaultIfEmpty: function (str, defaultStr) {
        return isEmpty(str) ? defaultStr : str;
    },
    // Reversing
    //-----------------------------------------------------------------------
    /**
     * Reverses a String.
     *
     * A null String returns null.
     *
     * @example
     * StringUtils.reverse(null)  = null
     * StringUtils.reverse("")    = ""
     * StringUtils.reverse("bat") = "tab"
     *
     * @param str  the String to reverse, may be null
     * @return the reversed String, null if null String input
     */
    reverse: function (str) {
        if (str == null) {
            return null;
        }
        var splitString = str.split('');
        var reverseArray = splitString.reverse();
        return reverseArray.join('');
    },
    // Abbreviating
    //-----------------------------------------------------------------------
    /**
     * Abbreviates a String using ellipses. This will turn
     * "Now is the time for all good men" into "Now is the time for..."
     *
     * Specifically:
     *
     *   - _If str is less than maxWidth characters
     *       long, return it._
     *   - _Else abbreviate it to (substring(str, 0, max-3) + "...")._
     *   - _If maxWidth is less than 4, throw an
     *       IllegalArgumentException._
     *   - _In no case will it return a String of length greater than
     *       maxWidth._
     *
     *@example
     * StringUtils.abbreviate(null, *)      = null
     * StringUtils.abbreviate("", 4)        = ""
     * StringUtils.abbreviate("abcdefg", 6) = "abc..."
     * StringUtils.abbreviate("abcdefg", 7) = "abcdefg"
     * StringUtils.abbreviate("abcdefg", 8) = "abcdefg"
     * StringUtils.abbreviate("abcdefg", 4) = "a..."
     * StringUtils.abbreviate("abcdefg", 3) = IllegalArgumentException
     *
     * @param str  the String to check, may be null
     * @param maxWidth  maximum length of result String, must be at least 4
     * @return abbreviated String, null if null String input
     */
    abbreviate: abbreviate,
    /**
     * Abbreviates a String using ellipses. This will turn
     * "Now is the time for all good men" into "...is the time for..."
     *
     * Works like abbreviate(String, int), but allows you to specify
     * a "left edge" offset.  Note that this left edge is not necessarily going to
     * be the leftmost character in the result, or the first character following the
     * ellipses, but it will appear somewhere in the result.
     *
     * In no case will it return a String of length greater than
     * maxWidth.
     *
     * @example
     * StringUtils.abbreviateOffset(null, *, *)                = null
     * StringUtils.abbreviateOffset("", 0, 4)                  = ""
     * StringUtils.abbreviateOffset("abcdefghijklmno", -1, 10) = "abcdefg..."
     * StringUtils.abbreviateOffset("abcdefghijklmno", 0, 10)  = "abcdefg..."
     * StringUtils.abbreviateOffset("abcdefghijklmno", 1, 10)  = "abcdefg..."
     * StringUtils.abbreviateOffset("abcdefghijklmno", 4, 10)  = "abcdefg..."
     * StringUtils.abbreviateOffset("abcdefghijklmno", 5, 10)  = "...fghi..."
     * StringUtils.abbreviateOffset("abcdefghijklmno", 6, 10)  = "...ghij..."
     * StringUtils.abbreviateOffset("abcdefghijklmno", 8, 10)  = "...ijklmno"
     * StringUtils.abbreviateOffset("abcdefghijklmno", 10, 10) = "...ijklmno"
     * StringUtils.abbreviateOffset("abcdefghijklmno", 12, 10) = "...ijklmno"
     * StringUtils.abbreviateOffset("abcdefghij", 0, 3)        = IllegalArgumentException
     * StringUtils.abbreviateOffset("abcdefghij", 5, 6)        = IllegalArgumentException
     *
     * @param str  the String to check, may be null
     * @param offset  left edge of source String
     * @param maxWidth  maximum length of result String, must be at least 4
     * @return abbreviated String, null if null String input
     */
    abbreviateOffset: abbreviateOffset,
    /**
     * Abbreviates a String to the length passed, replacing the middle characters with the supplied
     * replacement String.
     *
     * This abbreviation only occurs if the following criteria is met:
     *
     * - _Neither the String for abbreviation nor the replacement String are null or empty _
     * - _The length to truncate to is less than the length of the supplied String_
     * - _The length to truncate to is greater than 0_
     * - _The abbreviated String will have enough room for the length supplied replacement String
     * and the first and last characters of the supplied String for abbreviation_
     *
     * Otherwise, the returned String will be the same as the supplied String for abbreviation.
     *
     * @example
     * StringUtils.abbreviateMiddle(null, null, 0)      = null
     * StringUtils.abbreviateMiddle("abc", null, 0)      = "abc"
     * StringUtils.abbreviateMiddle("abc", ".", 0)      = "abc"
     * StringUtils.abbreviateMiddle("abc", ".", 3)      = "abc"
     * StringUtils.abbreviateMiddle("abcdef", ".", 4)     = "ab.f"
     
     *
     * @param str  the String to abbreviate, may be null
     * @param middle the String to replace the middle characters with, may be null
     * @param length the length to abbreviate str to.
     * @return the abbreviated String if the above criteria is met, or the original String supplied for abbreviation.
     */
    abbreviateMiddle: function (str, middle, length) {
        if (isEmpty(str) || isEmpty(middle)) {
            return str;
        }
        if (length >= str.length || length < (middle.length + 2)) {
            return str;
        }
        var targetSting = length - middle.length;
        var startOffset = targetSting / 2 + targetSting % 2;
        var endOffset = str.length - targetSting / 2;
        var builder = '';
        builder += (str.substring(0, startOffset));
        builder += (middle);
        builder += (str.substring(endOffset));
        return builder;
    },
    // Difference
    //-----------------------------------------------------------------------
    /**
     * Compares two Strings, and returns the portion where they differ.
     * (More precisely, return the remainder of the second String,
     * starting from where it's different from the first.)
     *
     * For example,
     * difference("i am a machine", "i am a robot") -> "robot".
     *
     * @example
     * StringUtils.difference(null, null) = null
     * StringUtils.difference("", "") = ""
     * StringUtils.difference("", "abc") = "abc"
     * StringUtils.difference("abc", "") = ""
     * StringUtils.difference("abc", "abc") = ""
     * StringUtils.difference("ab", "abxyz") = "xyz"
     * StringUtils.difference("abcde", "abxyz") = "xyz"
     * StringUtils.difference("abcde", "xyz") = "xyz"
     *
     * @param str1  the first String, may be null
     * @param str2  the second String, may be null
     * @return the portion of str2 where it differs from str1; returns the
     * empty String if they are equal
     */
    difference: function (str1, str2) {
        if (str1 == null) {
            return str2;
        }
        if (str2 == null) {
            return str1;
        }
        var at = indexOfDifferenceBtw(str1, str2);
        if (at == INDEX_NOT_FOUND) {
            return EMPTY;
        }
        return str2.substring(at);
    },
    /**
     * Compares two Strings, and returns the index at which the
     * Strings begin to differ.
     *
     * For example,
     * indexOfDifferenceBtw("i am a machine", "i am a robot") -> 7
     *
     * @example
     * StringUtils.indexOfDifferenceBtw(null, null) = -1
     * StringUtils.indexOfDifferenceBtw("", "") = -1
     * StringUtils.indexOfDifferenceBtw("", "abc") = 0
     * StringUtils.indexOfDifferenceBtw("abc", "") = 0
     * StringUtils.indexOfDifferenceBtw("abc", "abc") = -1
     * StringUtils.indexOfDifferenceBtw("ab", "abxyz") = 2
     * StringUtils.indexOfDifferenceBtw("abcde", "abxyz") = 2
     * StringUtils.indexOfDifferenceBtw("abcde", "xyz") = 0
     *
     * @param str1  the first String, may be null
     * @param str2  the second String, may be null
     * @return the index where str2 and str1 begin to differ; -1 if they are equal
     */
    indexOfDifferenceBtw: indexOfDifferenceBtw,
    /**
     * Compares all Strings in an array and returns the index at which the
     * Strings begin to differ.
     *
     * For example,
     * indexOfDifference(["i am a machine", "i am a robot"]) -> 7
     *
     * @example
     * StringUtils.indexOfDifference(null) = -1
     * StringUtils.indexOfDifference([]) = -1
     * StringUtils.indexOfDifference(["abc"]) = -1
     * StringUtils.indexOfDifference([null, null]) = -1
     * StringUtils.indexOfDifference(["", ""]) = -1
     * StringUtils.indexOfDifference(["", null]) = 0
     * StringUtils.indexOfDifference(["abc", null, null]) = 0
     * StringUtils.indexOfDifference([null, null, "abc"]) = 0
     * StringUtils.indexOfDifference(["", "abc"]) = 0
     * StringUtils.indexOfDifference(["abc", ""]) = 0
     * StringUtils.indexOfDifference(["abc", "abc"]) = -1
     * StringUtils.indexOfDifference(["abc", "a"]) = 1
     * StringUtils.indexOfDifference(["ab", "abxyz"]) = 2
     * StringUtils.indexOfDifference(["abcde", "abxyz"]) = 2
     * StringUtils.indexOfDifference(["abcde", "xyz"]) = 0
     * StringUtils.indexOfDifference(["xyz", "abcde"]) = 0
     * StringUtils.indexOfDifference(["i am a machine", "i am a robot"]) = 7
     *
     * @param strs  array of strings, entries may be null
     * @return the index where the strings begin to differ; -1 if they are all equal
     */
    indexOfDifference: indexOfDifference,
    /**
     * Compares all Strings in an array and returns the initial sequence of
     * characters that is common to all of them.
     *
     * For example,
     * getCommonPrefix(["i am a machine", "i am a robot"]) -> "i am a "
     *
     * @example
     * StringUtils.getCommonPrefix(null) = ""
     * StringUtils.getCommonPrefix([]) = ""
     * StringUtils.getCommonPrefix(["abc"]) = "abc"
     * StringUtils.getCommonPrefix([null, null]) = ""
     * StringUtils.getCommonPrefix(["", ""]) = ""
     * StringUtils.getCommonPrefix(["", null]) = ""
     * StringUtils.getCommonPrefix(["abc", null, null]) = ""
     * StringUtils.getCommonPrefix([null, null, "abc"]) = ""
     * StringUtils.getCommonPrefix(["", "abc"]) = ""
     * StringUtils.getCommonPrefix(["abc", ""]) = ""
     * StringUtils.getCommonPrefix(["abc", "abc"]) = "abc"
     * StringUtils.getCommonPrefix(["abc", "a"]) = "a"
     * StringUtils.getCommonPrefix(["ab", "abxyz"]) = "ab"
     * StringUtils.getCommonPrefix(["abcde", "abxyz"]) = "ab"
     * StringUtils.getCommonPrefix(["abcde", "xyz"]) = ""
     * StringUtils.getCommonPrefix(["xyz", "abcde"]) = ""
     * StringUtils.getCommonPrefix(["i am a machine", "i am a robot"]) = "i am a "
     *
     * @param strs  array of String objects, entries may be null
     * @return the initial sequence of characters that are common to all Strings
     * in the array; empty String if the array is null, the elements are all null
     * or if there is no common prefix.
     */
    getCommonPrefix: function (strs) {
        if (strs == null || strs.length == 0) {
            return EMPTY;
        }
        var smallestIndexOfDiff = indexOfDifference(strs);
        if (smallestIndexOfDiff == INDEX_NOT_FOUND) {
            // all strings were identical
            if (strs[0] == null) {
                return EMPTY;
            }
            return strs[0];
        }
        else if (smallestIndexOfDiff == 0) {
            // there were no common initial characters
            return EMPTY;
        }
        else {
            // we found a common initial character sequence
            return strs[0].substring(0, smallestIndexOfDiff);
        }
    },
    // Misc
    //-----------------------------------------------------------------------
    /**
     * Find the Levenshtein distance between two Strings.
     *
     * This is the number of changes needed to change one String into
     * another, where each change is a single character modification (deletion,
     * insertion or substitution).
     *
     * @example
     * StringUtils.getLevenshteinDistance(null, *)             = IllegalArgumentException
     * StringUtils.getLevenshteinDistance(*, null)             = IllegalArgumentException
     * StringUtils.getLevenshteinDistance("","")               = 0
     * StringUtils.getLevenshteinDistance("","a")              = 1
     * StringUtils.getLevenshteinDistance("aaapppp", "")       = 7
     * StringUtils.getLevenshteinDistance("frog", "fog")       = 1
     * StringUtils.getLevenshteinDistance("fly", "ant")        = 3
     * StringUtils.getLevenshteinDistance("elephant", "hippo") = 7
     * StringUtils.getLevenshteinDistance("hippo", "elephant") = 7
     * StringUtils.getLevenshteinDistance("hippo", "zzzzzzzz") = 8
     * StringUtils.getLevenshteinDistance("hello", "hallo")    = 1
     *
     * @param s  the first String, must not be null
     * @param t  the second String, must not be null
     * @return result distance
     */
    getLevenshteinDistance: function (s, t) {
        /*
           The difference between this impl. and the previous is that, rather
           than creating and retaining a matrix of size s.length+1 by t.length+1,
           we maintain two single-dimensional arrays of length s.length+1.  The first, d,
           is the 'current working' distance array that maintains the newest distance cost
           counts as we iterate through the characters of String s.  Each time we increment
           the index of String t we are comparing, d is copied to p, the second int[].  Doing so
           allows us to retain the previous cost counts as required by the algorithm (taking
           the minimum of the cost count to the left, up one, and diagonally up and to the left
           of the current cost count being calculated).  (Note that the arrays aren't really
           copied anymore, just switched...this is clearly much better than cloning an array
           or doing a System.arraycopy() each time  through the outer loop.)
      
           Effectively, the difference between the two implementations is this one does not
           cause an out of memory condition when calculating the LD over two very large strings.
         */
        var n = s.length; // length of s
        var m = t.length; // length of t
        if (n == 0) {
            return m;
        }
        else if (m == 0) {
            return n;
        }
        if (n > m) {
            // swap the input strings to consume less memory
            var tmp = s;
            s = t;
            t = tmp;
            n = m;
            m = t.length;
        }
        var p = []; //'previous' cost array, horizontally
        var d = []; // cost array, horizontally
        var _d; //placeholder to assist in swapping p and d
        // indexes into strings s and t
        var i; // iterates through s
        var j; // iterates through t
        var t_j; // jth character of t
        var cost; // cost
        for (i = 0; i <= n; i++) {
            p[i] = i;
        }
        for (j = 1; j <= m; j++) {
            t_j = t.charAt(j - 1);
            d[0] = j;
            for (i = 1; i <= n; i++) {
                cost = s.charAt(i - 1) == t_j ? 0 : 1;
                // minimum of cell to the left+1, to the top+1, diagonally left and up +cost
                d[i] = Math.min(Math.min(d[i - 1] + 1, p[i] + 1), p[i - 1] + cost);
            }
            // copy current distance counts to 'previous row' distance counts
            _d = p;
            p = d;
            d = _d;
        }
        // our last action in the above loop was to switch d and p, so p now 
        // actually has the most recent cost counts
        return p[n];
    },
    // startsWith
    //-----------------------------------------------------------------------
    /**
     * Check if a String starts with a specified prefix.
     *
     * nulls are handled without exceptions. Two null
     * references are considered to be equal. The comparison is case sensitive.
     *
     * @example
     * StringUtils.startsWith(null, null)      = true
     * StringUtils.startsWith(null, "abc")     = false
     * StringUtils.startsWith("abcdef", null)  = false
     * StringUtils.startsWith("abcdef", "abc") = true
     * StringUtils.startsWith("ABCDEF", "abc") = false
     *
     * @param str  the String to check, may be null
     * @param prefix the prefix to find, may be null
     * @return true if the String starts with the prefix, case sensitive, or
     *  both null
     */
    startsWith: function (str, prefix) {
        return startsWith(str, prefix, false);
    },
    /**
     * Case insensitive check if a String starts with a specified prefix.
     *
     * nulls are handled without exceptions. Two null
     * references are considered to be equal. The comparison is case insensitive.
     *
     * @example
     * StringUtils.startsWithIgnoreCase(null, null)      = true
     * StringUtils.startsWithIgnoreCase(null, "abc")     = false
     * StringUtils.startsWithIgnoreCase("abcdef", null)  = false
     * StringUtils.startsWithIgnoreCase("abcdef", "abc") = true
     * StringUtils.startsWithIgnoreCase("ABCDEF", "abc") = true
     *
     * @param str  the String to check, may be null
     * @param prefix the prefix to find, may be null
     * @return true if the String starts with the prefix, case insensitive, or
     *  both null
     */
    startsWithIgnoreCase: startsWithIgnoreCase,
    /**
     * Check if a String starts with a specified prefix (optionally case insensitive).
     *
     * @param str  the String to check, may be null
     * @param prefix the prefix to find, may be null
     * @param ignoreCase inidicates whether the compare should ignore case
     *  (case insensitive) or not.
     * @return true if the String starts with the prefix or
     *  both null
     */
    startsWithByCase: startsWith,
    /**
     * Check if a String starts with any of an array of specified strings.
     *
     * @example
     * StringUtils.startsWithAny(null, null)      = false
     * StringUtils.startsWithAny(null, ["abc"])  = false
     * StringUtils.startsWithAny("abcxyz", null)     = false
     * StringUtils.startsWithAny("abcxyz", [""]) = false
     * StringUtils.startsWithAny("abcxyz", ["abc"]) = true
     * StringUtils.startsWithAny("abcxyz", [null, "xyz", "abc"]) = true
     *
     * @param string  the String to check, may be null
     * @param searchStrings the Strings to find, may be null or empty
     * @return true if the String starts with any of the the prefixes, case insensitive, or
     *  both null
     */
    startsWithAny: function (string, searchStrings) {
        if (isEmpty(string) || searchStrings.length === 0) {
            return false;
        }
        for (var i = 0; i < searchStrings.length; i++) {
            var searchString = searchStrings[i];
            if (startsWith(string, searchString, false)) {
                return true;
            }
        }
        return false;
    },
    // endsWith
    //-----------------------------------------------------------------------
    /**
     * Check if a String ends with a specified suffix.
     *
     * nulls are handled without exceptions. Two null
     * references are considered to be equal. The comparison is case sensitive.
     *
     * @example
     * StringUtils.endsWith(null, null)      = true
     * StringUtils.endsWith(null, "def")     = false
     * StringUtils.endsWith("abcdef", null)  = false
     * StringUtils.endsWith("abcdef", "def") = true
     * StringUtils.endsWith("ABCDEF", "def") = false
     * StringUtils.endsWith("ABCDEF", "cde") = false
     *
     * @param str  the String to check, may be null
     * @param suffix the suffix to find, may be null
     * @return true if the String ends with the suffix, case sensitive, or
     *  both null
     */
    endsWith: function (str, suffix) {
        return endsWith(str, suffix, false);
    },
    /**
     * Case insensitive check if a String ends with a specified suffix.
     *
     * nulls are handled without exceptions. Two null
     * references are considered to be equal. The comparison is case insensitive.
     *
     * @example
     * StringUtils.endsWithIgnoreCase(null, null)      = true
     * StringUtils.endsWithIgnoreCase(null, "def")     = false
     * StringUtils.endsWithIgnoreCase("abcdef", null)  = false
     * StringUtils.endsWithIgnoreCase("abcdef", "def") = true
     * StringUtils.endsWithIgnoreCase("ABCDEF", "def") = true
     * StringUtils.endsWithIgnoreCase("ABCDEF", "cde") = false
     *
     * @param str  the String to check, may be null
     * @param suffix the suffix to find, may be null
     * @return true if the String ends with the suffix, case insensitive, or
     *  both null
     */
    endsWithIgnoreCase: endsWithIgnoreCase,
    /**
     * Check if a String ends with a specified suffix (optionally case insensitive).
     *
     * @param str  the String to check, may be null
     * @param suffix the suffix to find, may be null
     * @param ignoreCase inidicates whether the compare should ignore case
     *  (case insensitive) or not.
     * @return true if the String starts with the prefix or
     *  both null
     */
    endsWithByCase: endsWith,
    /**
     *
     * The function returns the argument string with whitespace to remove leading and trailing whitespace
     * and then replacing sequences of whitespace characters by a single space.
     *
     * @param str the source String to normalize whitespaces from, may be null
     * @return the modified string with whitespace normalized, null if null String input
     *
     */
    normalizeSpace: function (str) {
        str = strip(str, null);
        if (str == null || str.length <= 2) {
            return str;
        }
        var b = '';
        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            if (Character.isWhitespace(c)) {
                if (i > 0 && !Character.isWhitespace(str.charAt(i - 1))) {
                    b += (' ');
                }
            }
            else {
                b += (c);
            }
        }
        return b;
    },
    /**
     * Check if a String ends with any of an array of specified strings.
     *
     * @example
     * StringUtils.endsWithAny(null, null)      = false
     * StringUtils.endsWithAny(null, ["abc"])  = false
     * StringUtils.endsWithAny("abcxyz", null)     = false
     * StringUtils.endsWithAny("abcxyz", [""]) = true
     * StringUtils.endsWithAny("abcxyz", ["xyz"]) = true
     * StringUtils.endsWithAny("abcxyz", [null, "xyz", "abc"]) = true
     *
     * @param string  the String to check, may be null
     * @param searchStrings the Strings to find, may be null or empty
     * @return true if the String ends with any of the the prefixes, case insensitive, or
     *  both null
     */
    endsWithAny: function (string, searchStrings) {
        if (isEmpty(string) || searchStrings.length === 0) {
            return false;
        }
        for (var i = 0; i < searchStrings.length; i++) {
            var searchString = searchStrings[i];
            if (endsWith(string, searchString, false)) {
                return true;
            }
        }
        return false;
    }
};
exports["default"] = StringUtils;
