const cacheName = `chatCache_v1`;

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll([
                    `/`,
                    './scripts/chatMain.js',
                    './scripts/chatHelper.js',
                    './scripts/coreHelper.js',
                    './scripts/messageRepo.js',
                    './scripts/resthelper.js',
                    './css/style.css',
                    './images/esther512.png',
                    './images/esther192.png',
                    './manifest.json'
                ])
                    .then(() =>
                        self.skipWaiting());
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheKeeplist = [cacheName];
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (cacheKeeplist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);
    if (url.origin === location.origin) {
        cacheFirst(event);
    }
    else if (url.pathname.toLowerCase() === "/getmessages") {
        cacheFirst(event);
    }
    else if (url.pathname.toLowerCase() === "/genewmessages") {
        const emptyJsonResponse = new Response(JSON.stringify([]), {
            headers: { 'Content-Type': 'application/json' }
        });
        const id = url.searchParams.get("lastId");
        if (id === undefined || id === null || id === '') {
            console.log(`Last id was not defined.`)
            event.respondWith(emptyJsonResponse);
        }

        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    return response;
                }).catch((e) => {
                    console.log(`Network Error, could not request resource: ${e.message}.`)
                    return emptyJsonResponse;
                })
        )

    }
})

function cacheFirst(event) {
    event.respondWith(
        caches.open(cacheName)
            .then(cache =>
                cache.match(event.request, { ignoreSearch: true }))
            .then(response => {
                if (response) {
                    return response;
                }
                else {
                    return fetch(event.request)
                        .then((response) => {
                            return caches.open(cacheName)
                                .then((cache) => {
                                    cache.put(event.request, response.clone());
                                    return response;
                                })
                        }).catch((e) => {
                            console.log(`Network Error, could not request resource: ${e.message}`)
                        })
                }
            })
    );
}