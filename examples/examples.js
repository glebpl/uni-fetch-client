const $useHhr = document.querySelector("input[name=useXhr]");
const $form = document.getElementById("request");
const $host = document.querySelector("input[name=host]");
const $port = document.querySelector("input[name=port]");
const $path = document.querySelector("input[name=path]");
const $secure = document.querySelector("input[name=secure]");
const $response = document.getElementById("response");

$host.value = localStorage.getItem("host") || "";
$port.value = localStorage.getItem("port") || 80;
$path.value = localStorage.getItem("path") || "";
$secure.checked = localStorage.getItem("secure") === "true";
$useHhr.checked = localStorage.getItem("useXhr") === "true";

const {FetchClient = null} = window;

if(FetchClient) {

    const {create, createAbortController, ParseError, TransportError} = FetchClient;

    $form.addEventListener("submit", e => {
        e.preventDefault();
        const host = $host.value;
        const port = Number($port.value);
        const path = $path.value;
        const secure = $secure.checked;

        const useXhr = $useHhr.checked;
        localStorage.setItem("host", host);
        localStorage.setItem("port", port);
        localStorage.setItem("path", path);
        localStorage.setItem("useXhr", useXhr);
        localStorage.setItem("secure", secure);

        const httpClient = create({
            host
            , port
            , secure
            , xhr: $useHhr.checked
            , mode: FetchClient.MODE_CORS
        });

        const abortController = createAbortController();

        httpClient.postJson(path, {
            signal: abortController.signal
        }).then(json => {
            $response.innerHTML = `${Date.now()}: ${JSON.stringify(json)}`;
        }, err => {
            let msg = "Unknown error";

            if(err instanceof ParseError) {
                msg = `Got ParseError ${err.code}: ${err.message}`;
            } else if(err instanceof TransportError) {
                // On non-cors request err will contain response object with true status
                msg = `
                Got TransportError ${err.code}: ${err.message}: ${err.responseText}: ${JSON.stringify(err.responseHeaders)}
                `;
            } else if(err instanceof DOMException) {
                if(err.name === "AbortError") {
                    msg = `Request aborted ${Date.now()}`;
                } else {
                    console.error(err);
                }
            } else if(err instanceof TypeError) {
                // Also will happen on cors requests when 404 status comes
                // mode of fetch has no effect at this case
                msg = `Request failed due to network error ${Date.now()}`;
            }

            $response.innerHTML = msg;
        });

        // abortController.abort();
    });

}