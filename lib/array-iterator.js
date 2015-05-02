module.exports = function (arr) {
    var len = arr && arr.length;
    var i = 0;
    return {
        next: function () {
            if (i < len) {
                return { done: false, value: arr[i++] };
            }
            return { done: true };
        }
    };
}


