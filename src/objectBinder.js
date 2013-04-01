
// ObjectBinder
(function (exports, $al, $wnd, $doc) {
    var cache = {};

    function createProxy(expression, callback, oldObject, ctx) {
        var newObject = oldObject;
        if ($al.utils.isArray(oldObject)) {
            eval('with (ctx) { newObject = new ArrayProxy(function(){callback(' + expression + ')}, oldObject); }');
        } else if ($al.utils.isString(oldObject)) {
            eval('with (ctx) { newObject = new StringProxy(function(){callback(' + expression + ')}, oldObject); }');
        } else if ($al.utils.isDate(oldObject)) {
            eval('with (ctx) { newObject = new DateProxy(function(){callback(' + expression + ')}, oldObject); }');
        }
        return newObject;
    }

    function ObjectBinder() {}

    ObjectBinder.prototype.prop = function (id, getter, setter, ctx) {
        ctx = ctx || $wnd;

        Object.defineProperty(ctx, id, {
            get: getter,
            set: setter,
        });
    };

    ObjectBinder.prototype.bind = function (id, getter, setter, ctx) {
        var self = this,
            result = $al.oq.get(id),
            ns = 'ctx.' + id,
            parts = ns.split('.'),
            propObject = null,
            targetObject = null,
            isThisObj = false,
            strTargetObject = 'ctx',
            strPropObject = 'ctx',
            i;

        ctx = ctx || $wnd;

        targetObject = ctx;
        propObject = ctx;

        for (i = 1; i < parts.length; i += 1) {
            strPropObject = parts[i];
            if (i < parts.length - 1) {
                propObject = propObject[parts[i]];
                strTargetObject = parts[i];
            }
            if (i < parts.length - 2) {
                targetObject = targetObject[parts[i]];
            }
        }

        if (result !== undefined) {

            if (propObject[strPropObject] !== undefined) {
                if ($al.utils.isArray(targetObject[strTargetObject]) || $al.utils.isString(targetObject[strTargetObject]) || $al.utils.isDate(targetObject[strTargetObject])) {
                    targetObject[strTargetObject] = createProxy(id, setter, targetObject[strTargetObject], ctx);
                } else {
                    cache[strPropObject] = propObject[strPropObject];
                    isThisObj = delete propObject[strPropObject];

                    if (isThisObj) {
                        self.prop(strPropObject,
                            function () {
                                return getter(cache[strPropObject]) || cache[strPropObject];
                            },
                            function (value) {
                                cache[strPropObject] = value;
                                setter(value);
                            },
                            propObject);
                    }
                }
            } else {
                throw new Error('can\'t bind undefined object');
            }
        } else {
            throw new Error('can\'t bind undefined object');
        }
    };

    exports.AlloyJs.ob = new ObjectBinder();

}(exports, $al, $wnd, $doc));
