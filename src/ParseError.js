"use strict";
import {ERROR_PARSE_JSON_RESPONSE, ERROR_PARSE_XML_RESPONSE} from "./constants";

export class ParseError {
    constructor(code, message = "") {
        this._code = code;
        this._message = message;
    }

    get name() {
        return "ParseError";
    }

    get code() {
        return this._code;
    }

    get message() {
        if(this._message) {
            return this._message;
        } else {
            switch(this.code) {
                case ERROR_PARSE_JSON_RESPONSE:
                    return "Invalid JSON in response";
                case ERROR_PARSE_XML_RESPONSE:
                    return "Invalid XML in response";
                default:
                    return "Unknown parse error";
            }
        }
    }
}