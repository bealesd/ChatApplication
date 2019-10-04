﻿function RestHelper() {
    function main() {
        const live = true;
        const urlPrefex = live ? 'https://estherchatapinodeazure.azurewebsites.net/' : 'http://localhost:1337/';
        return {
            get: function (suffix) {
                let getChatsUrl = urlPrefex + suffix;
                var xhttp = new XMLHttpRequest();
                xhttp.open('GET', getChatsUrl, true);
                xhttp.timeout = 30000;
                xhttp.send();
                return new Promise(function (res, rej) {
                    xhttp.onreadystatechange = function () {
                        if (this.readyState === 4 && (this.status === 200 || this.status === 201))
                            return res(JSON.parse(this.responseText));
                        if (this.readyState === 4 && (this.status !== 200 || this.status !== 201))
                            return rej();
                    };
                }.bind(this));
            },

            postMessage: function (chatMessage, username) {
                let chatsUrl = urlPrefex + 'postMessage';
                let xhttp = new XMLHttpRequest();
                xhttp.open('POST', chatsUrl, true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.timeout = 30000;
                var json = {
                    'Message': `${chatMessage}`,
                    'Username': `${username}`
                };
                xhttp.send(JSON.stringify(json));
                document.querySelectorAll("#chatMessage")[0].value = "";
                return new Promise(function (res, rej) {
                    xhttp.onreadystatechange = function () {
                        if (this.readyState === 4 && (this.status === 200 || this.status === 201))
                            return res(this.responseText);
                        if (this.readyState === 4 && (this.status !== 200 || this.status !== 201))
                            return rej();
                    };
                }.bind(this));
            }
        };
    }
    return main();
}