export class RestHelper {
    constructor(urlPrefex) {
        this.urlPrefex = urlPrefex;
    }

    status(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else { return Promise.reject(new Error(response.statusText)) }
    }

    json(response) { return response.json(); }

    get(suffix) {
        const url = this.urlPrefex + suffix;
        return fetch(url)
            .then(this.status)
            .then(this.json);
    }

    postJson(suffix, json) {
        const url = this.urlPrefex + suffix;
        return fetch(url, {
            method: 'post',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(json)
        })
        .then(this.json)
    }
}