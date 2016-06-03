'use strict';
function hasOwn (obj, prop) {
    return obj && obj.hasOwnProperty(prop)
}
var undef = void(0)
module.exports = {
    type: function (obj) {
        if (obj === null) return 'null'
        else if (obj === undef) return 'undefined'
        var m = /\[object (\w+)\]/.exec(Object.prototype.toString.call(obj))
        return m ? m[1].toLowerCase() : ''
    },
    objEach: function (obj, fn) {
        if (!obj) return
        for(var key in obj) {
            if (hasOwn(obj, key)) {
                if(fn(key, obj[key]) === false) break
            }
        }
    },
    patch: function (obj, prop, defValue) {
        !obj[prop] && (obj[prop] = defValue)
    },
    diff: function (next, pre, _t) {
        var that = this
        // defult max 4 level        
        _t = _t === undefined ? 4 : _t

        if (_t <= 0) return next !== pre

        if (this.type(next) == 'array' && this.type(pre) == 'array') {
            if (next.length !== pre.length) return true
            return next.some(function(item, index) {
                return that.diff(item, pre[index], _t - 1)
            })
        } else if (this.type(next) == 'object' && this.type(pre) == 'object') {
            var nkeys = Object.keys(next)
            var pkeys = Object.keys(pre)
            if (nkeys.length != pkeys.length) return true

            return nkeys.some(function(k) {
                return (!~pkeys.indexOf(k)) || that.diff(next[k], pre[k], _t - 1)
            })
        }
        return next !== pre
    },
    copyArray: function (arr) {
        var len = arr.length
        var nArr = new Array(len)
        while(len --) {
            nArr[len] = arr[len]
        }
        return nArr
    },
    copyObject: function (obj) {
        var cObj = {}
        this.objEach(obj, function (k, v) {
            cObj[k] = v
        })
        return cObj
    },
    copyValue: function (v) {
        var t = this.type(v)
        switch(t) {
            case 'object': return this.copyObject(v)
            case 'array': return this.copyArray(v)
            default: return v
        }
    },
    def: function () {
        return Object.defineProperty.apply(Object, arguments)
    },
    indexOf: function (a, b) {
        return ~a.indexOf(b)
    },
    merge: function (to, from) {
        if (!from) return to
        this.objEach(from, function (k, v) {
            to[k] = v
        })
        return to
    },
    hasOwn: hasOwn
}