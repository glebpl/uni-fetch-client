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

    get responseText() {
        return this._responseText;
    }

    set responseText(s) {
        this._responseText = s;
    }

    get responseJson() {
        return parseJSON(this.responseText);
    }
}