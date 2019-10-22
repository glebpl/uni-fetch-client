"use strict";
import {parseJSON} from "./utils";

export class TransportError {
    constructor(response) {
        this._response = response;
        this._responseText = "";
    }

    get name() {
        return "TransportError";
    }

    get code() {
        return this._response ? this._response.status : 0;
    }

    get status() {
        return this.code;
    }

    get message() {
        return this._response ? this._response.statusText : "";
    }

    get statusText() {
        return this.message;
    }

    /**
     * Response text
     * @return {string}
     */
    get responseText() {
        return this._responseText;
    }

    /**
     * @param {string} s
     */
    set responseText(s) {
        this._responseText = s;
    }

    /**
     * Response headers as simple Object
     * If you need raw Headers instance use err.response.headers
     * @return {Object}
     */
    get responseHeaders() {
        if(this.response) {
            const headers = {};
            [...this.response.headers.keys()].forEach(key => {
                headers[key] = this.response.headers.get(key);
            });
            return headers;
        }
        return {};
    }

    /**
     * Parses response text as json
     * @return {Object|Array|null}
     */
    get responseJson() {
        return parseJSON(this.responseText);
    }

    /**
     * Raw response
     * @return {Response}
     */
    get response() {
        return this._response;
    }
}