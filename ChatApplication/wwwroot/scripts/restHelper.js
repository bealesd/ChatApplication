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
            }

        };
    }
    return main();
}