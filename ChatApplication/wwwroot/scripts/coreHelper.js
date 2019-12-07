export class CoreHelper {
    static loadLibrary() {
        Object.prototype.hasOwnPropertyLowerCase = function (prop) {
            return Object.keys(this)
                .filter(function (key) {
                    return key.toLowerCase() === prop.toLowerCase();
                }).length > 0;
        };

        Object.prototype.isString = (value) => { return Object.prototype.toString.call(value) === '[object String]'; };

        Object.prototype.isNotEmptyString = (value) => { return Object.prototype.isString(value) && value.trim() !== ""; };

        Object.prototype.isArray = (value) => { return Object.prototype.toString.call(value) === '[object Array]'; };

        Object.prototype.isObject = (value) => { return Object.prototype.toString.call(value) === '[object Object]'; };

        Object.prototype.isNumber = (value) => { return Object.prototype.toString.call(value) === '[object Number]'; };

        Object.prototype.hasProperty = (obj, property) => { return Object.prototype.hasOwnPropertyLowerCase.call(obj, property); };

        Object.prototype.mergeObjects = (obj1, obj2) => { return Object.assign(obj1, obj2); };
    }

    static isJsonString(str) {
        try { return JSON.parse(str); }
        catch (e) { return false; }
    }

    static hasProperties(object, propertiesArray) {
        for (var i = 0; i < propertiesArray.length; i++) {
            let value = propertiesArray[i];
            if (!Object.prototype.hasProperty(object, value)) return false;
        }
        return true;
    }

    static hasProperiesOfStringOrNumberOnly(object, propertiesArray) {
        if (!this.hasProperties(object, propertiesArray)) return false;
        for (var i = 0; i < propertiesArray.length; i++) {
            let value = propertiesArray[i];
            if (!Object.prototype.isNumber(object[value]) === true && !Object.prototype.isString(object[value]) === true) return false;
        }
        return true;
    }
}