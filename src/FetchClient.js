"use strict";

import {fetch as xhr} from "whatwg-fetch";// fetch polyfill
import {makeUrl, serializeObject as serialize} from "./utils";
import {arrayBuffer, statusCheck, text, json} from "./parsers";

const _global = (1, eval)("this");

export const {
    METHOD_GET
    , METHOD_POST
    , METHOD_PUT
    , METHOD_DELETE
    , MODE_CORS
    , MODE_NO_CORS
    , ERROR_PARSE_JSON_RESPONSE
    , ERROR_PARSE_XML_RESPONSE
} = require("./constants");

const _options = {
    secure: false
    , host: ""
    , port: 80
    // https://developer.mozilla.org/ru/docs/Web/API/Request/mode
    // no-cors — Prevents the method from being anything other than HEAD, GET or POST,
    // and the headers from being anything other than simple headers.
    // cors — Allows cross-origin requests, for example to access various APIs offered by 3rd party vendors.
    // These are expected to adhere to the CORS protocol.
    // Only a limited set of headers are exposed in the Response, but the body is readable.
    , mode: MODE_NO_CORS
    , headers: {}
    , xhr: false
};

export class FetchClient {
    constructor(options = {}) {
        this.options = {..._options, ...options};
    }

    getTransport() {
        return this.getOption("xhr") ? xhr : _global.fetch;
    }

    getOption(key, def = null) {
        return key in this.options ? this.options[key] : def;
    }

    getRequestOption (options, key, def = null) {
        return key in options ? options[key] : this.getOption(key, def);
    }

    url(path) {
        const {secure, host, port} = this.options;
        return makeUrl(host, path, port, secure);
    }

    /**
     * Raw fetch
     * @param {string} path
     * @param {Object} options
     * @return
     */
    fetch(path, options = {}) {
        const transport = this.getTransport();
        const finalOptions = {...options};
        const {method = METHOD_GET} = options;
        let {data = ""} = options;
        let url = this.url(path);

        if(method === METHOD_POST || method === METHOD_PUT) {
            finalOptions.body = "string" === typeof data ? data : JSON.stringify(data);
        } else {
            if("object" === typeof data) {
                data = serialize(data);
            }
            url += data.length ? `?${data}` : "";
        }

        finalOptions.mode = finalOptions.mode || this.getOption("mode");

        return transport(url, finalOptions).then(statusCheck);
    }

    fetchText(path, options = {}) {
        return this.fetch(path, {
            ...options
            , headers: {
                "Accept": "text/plain, *!/!*"
                , ...this.getRequestOption(options, "headers", {})
            }
        }).then(text);
    }

    /**
     * Forces GET method in request
     * @param {string} path
     * @param {Object} options
     * @return {Promise}
     */
    getText(path, options = {}) {
        return this.fetchText(path, {...options, method: METHOD_GET});
    }

    /**
     * Forces POST method in request
     * @param {string} path
     * @param {Object} options
     * @return {Promise}
     */
    postText(path, options = {}) {
        return this.fetchText(path, {...options, method: METHOD_POST});
    }

    /**
     * @param {string} path
     * @param {Object} options
     * @return {Promise}
     */
    fetchJson(path, options = {}) {
        return this.fetch(path, {
            ...options
            , headers: {
                "Accept": "application/json, text/plain, */*"
                , "Content-Type": "application/json; charset=UTF-8"
                , ...this.getRequestOption(options, "headers", {})
            }
        }).then(json);
    }

    /**
     * Forces GET method in request
     * Resolves with parsed json
     * @param {string} path
     * @param {Object} options
     * @return {Promise}
     */
    getJson(path, options = {}) {
        return this.fetchJson(path, {...options, method: METHOD_GET});
    }

    /**
     * Forces POST method in request
     * Resolves with parsed json
     * @param {string} path
     * @param {Object} options
     * @return {Promise}
     */
    postJson(path, options = {}) {
        return this.fetchJson(path, {...options, method: METHOD_POST});
    }

    /**
     * Forces PUT method in request
     * Resolves with parsed json
     * @param {string} path
     * @param {Object} options
     * @return {Promise}
     */
    putJson(path, options = {}) {
        return this.fetchJson(path, {...options, method: METHOD_PUT});
    }

    /**
     * @param {string} path
     * @param {Object} options
     * @return {Promise}
     */
    getBinary(path, options = {}) {
        return this.fetch(path, {
            ...options
            , method: METHOD_GET
            , headers: {
                "Accept": "application/octet-stream"
                , ...this.getRequestOption(options, "headers", {})
            }
        }).then(arrayBuffer);
    }

    delete(path, options = {}) {
        return this.fetch(path, {
            ...options
            , method: METHOD_DELETE
            , headers: this.getRequestOption(options, "headers", {})
        });
    }
}