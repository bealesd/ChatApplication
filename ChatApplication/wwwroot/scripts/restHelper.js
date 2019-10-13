import { CoreHelper } from './coreHelper.js';

export class RestHelper {
    constructor(urlPrefex) {
        this.urlPrefex = urlPrefex;
    }

    get(suffix) {
        let getChatsUrl = this.urlPrefex + suffix;
        var xhttp = new XMLHttpRequest();
        xhttp.open('GET', getChatsUrl, true);
        xhttp.timeout = 30000;
        xhttp.send();
        return this.getResults(xhttp);
    }

    postJson(suffix, json) {
        let chatsUrl = this.urlPrefex + suffix;
        let xhttp = new XMLHttpRequest();
        xhttp.open('POST', chatsUrl, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.timeout = 30000;
        xhttp.send(JSON.stringify(json));
        return this.getResults(xhttp);
    }

    getResults(xhttp) {
        return new Promise(function (res, rej) {
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && (this.status === 200 || this.status === 201)) {
                    return res(CoreHelper.isJsonString(this.responseText) ? JSON.parse(this.responseText) : this.responseText);
                }
                if (this.readyState === 4 && (this.status !== 200 || this.status !== 201))
                    return rej();
            };
        }.bind(this));
    }
}