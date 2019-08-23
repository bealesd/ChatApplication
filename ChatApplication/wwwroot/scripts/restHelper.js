function RestHelper() {
    function main() {
        return {
            get: function (suffix) {
                var getChatsUrl = window.location.origin + '/' + suffix;
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
                let chatsUrl = window.location.origin + '/Chat/PostMessage';
                let xhttp = new XMLHttpRequest();
                xhttp.open('POST', chatsUrl, true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.timeout = 30000;
                var json = {
                    'Message': `${chatMessage}`,
                    'Username': `${username}`
                };
                xhttp.send(JSON.stringify(json));
                return new Promise(function (res, rej) {
                    xhttp.onreadystatechange = function () {
                        if (this.readyState === 4 && (this.status === 200 || this.status === 201))
                            return res(JSON.parse(this.responseText));
                        if (this.readyState === 4 && (this.status !== 200 || this.status !== 201))
                            return rej();
                    };
                }.bind(this));
            }
        };
    }
    return main();
}