"use strict";
exports.__esModule = true;
exports.getListByKey = exports.sortStr = exports.sortArray = void 0;
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}
function descendingComparatorStr(a, b) {
    if (b < a) {
        return -1;
    }
    if (b > a) {
        return 1;
    }
    return 0;
}
function getComparator(order, orderBy) {
    return order === 'desc'
        ? function (a, b) { return descendingComparator(a, b, orderBy); }
        : function (a, b) { return -descendingComparator(a, b, orderBy); };
}
function getComparatorStr(order) {
    return order === 'desc'
        ? function (a, b) { return descendingComparatorStr(a, b); }
        : function (a, b) { return -descendingComparatorStr(a, b); };
}
function sortArray(array, order, orderBy) {
    var comparator = getComparator(order, orderBy);
    var stabilizedThis = array.map(function (el, index) { return [el, index]; });
    stabilizedThis.sort(function (a, b) {
        var order = comparator(a[0], b[0]);
        if (order !== 0)
            return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(function (el) { return el[0]; });
}
exports.sortArray = sortArray;
function sortStr(array, order) {
    var comparator = getComparatorStr(order);
    array.sort(function (a, b) {
        var order = comparator(a, b);
        if (order !== 0)
            return order;
        return a[1] - b[1];
    });
    return array;
}
exports.sortStr = sortStr;
function getListByKey(array, key) {
    return array.map(function (el, index) { return el[key]; });
}
exports.getListByKey = getListByKey;
