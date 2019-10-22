# Description
Simple JavaScript HTTP client using fetch API with possibility to force using XHR.

Has possibility to abort requests with AbortController (polyfill inside).

# Installation
`npm install --save uni-fetch-client`

# Examples
## Create client
```
import FetchClient from 'uni-fetch-client';

const client = FetchClient.create({
    host: "your.host.com"
    , secure: true
    , port: 8080
});
```

## Simple JSON request
```
client.getJson("/restapi/users").then(jsonData => {
    // process data here
}, err => {
    // process error here
});
```

## Abortable request
```
const abortController = FetchClient.createAbortController();

client.getJson("/restapi/users", {
    signal: abortController.signal
}).then(jsonData => {
    // process data here
}, err => {
    // process error here
    // Abort error is instance of DOMException and has name 'AbortError'
});

const someHandler = () => {
    abortController.abort();
};
```

## Request headers
```
client.postJson("/messages/create", {
    data: {
        message: "Some data"
    }
    , headers: {
        "Authorization": "Basic yourbase64encoded="
    }
});
```

## Error handling
```
client.getJson("/bad/resource").then(() => {}, err => {
    if(err instanceof ParseError) {
        msg = `Got ParseError ${err.code}: ${err.message}`;
    } else if(err instanceof TransportError) {
        msg = ```
            Got TransportError ${err.code}: ${err.message}: ${err.responseText}: 
            ${JSON.stringify(err.responseHeaders)}
        ```;
    } else if(err instanceof DOMException) {
        if(err.name === "AbortError") {
            // We will be here if AbortController is used (see above)
            msg = `Request aborted ${Date.now()}`;
        } else {
            console.error(err);
        }
    } else if(err instanceof TypeError) {
        // Also will happen on cors requests when 404 status comes
        // mode of fetch has no effect at this case
        msg = `Request failed due to network error ${Date.now()}`;
    }
});
```