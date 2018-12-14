# Description
Simple JavaScript HTTP client using fetch API with possibility to force using XHR.

Has possibility to abort requests with AbortController (polyfill inside).

# Installation
`npm install --save uni-fetch-client`

# Examples
## Create client
```
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