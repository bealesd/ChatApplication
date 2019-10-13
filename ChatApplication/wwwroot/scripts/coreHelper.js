export class CoreHelper {
    static isNotEmptyString(value) {
        return this.isString(value) && value.trim() !== "";
    }

    static isString(value) {
        return Object.prototype.toString.call(value) === '[object String]';
    }

    static isArray(value) {
        return Object.prototype.toString.call(value) === "[object Array]";
    }

    static isObject(value) {
        return Object.prototype.toString.call(value) === "[object Object]";
    }

    static isNumber(value) {
        return Object.prototype.toString.call(value) === "[object Number]";
    }

    static hasProperty(obj, property) {
        return Object.prototype.hasOwnProperty.call(obj, property);
    }

    static mergeObjects(obj1, obj2) {
        return Object.assign(obj1, obj2);
    }

    static isJsonString(str) {
        try { return JSON.parse(str); }
        catch (e) { return false; }
    }

    static hasProperties(object, propertiesArray) {
        for (var i = 0; i < propertiesArray.length; i++) {
            let value = propertiesArray[i];
            if (!this.hasProperty(object, value)) return false;
        }
        return true;
    }

    static hasProperiesOfStringOrNumberOnly(object, propertiesArray) {
        if (!this.hasProperties(object, propertiesArray)) return false;
        for (var i = 0; i < propertiesArray.length; i++) {
            let value = propertiesArray[i];
            if (!this.isNumber(object[value]) === true && !this.isString(object[value]) === true) return false;
        }
        return true;
    }
}