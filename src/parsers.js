"use strict";
import {ParseError} from "./ParseError";
import {ERROR_PARSE_JSON_RESPONSE, ERROR_PARSE_XML_RESPONSE} from "./constants";
import {TransportError} from "./TransportError";
import {parseJSON} from "./utils";

const _logHeaders = response => {
    console.log("=== response.headers ===");
    [...response.headers.keys()].map(key => {
        console.log(`${key}: ${response.headers.get(key)}`);
    });
};

export const text = response => response.text();

export const statusCheck = response => {
    return new Promise((resolve, reject) => {
        if(response.ok) {
            return resolve(response);
        } else {
            const err = new TransportError(response);

            text(response).then(s => {
                err.responseText = s;
                reject(err);
            }).catch(() => {
                reject(err);
            });
        }
    });
};

export const arrayBuffer = response => response.arrayBuffer();

export const json = response => {
    return new Promise((resolve, reject) => {
        text(response).then(s => {
            if(s.length) {
                const json = parseJSON(s);
                if(json === null) {
                    reject(new ParseError(ERROR_PARSE_JSON_RESPONSE));
                } else {
                    resolve(json);
                }
            } else {
                resolve({});
            }
        });
    });
};

/**
 * Resolves with DOM.Document
 * @param response
 * @return {Promise}
 */
export const xml = response => {
    return new Promise((resolve, reject) => {
        text(response).then(s => {
            if(s.length) {
                try {
                    const doc = (new window.DOMParser()).parseFromString(s, "application/xml");
                    const errors = doc.getElementsByTagName("parsererror");
                    if(errors.length) {
                        reject(new ParseError(ERROR_PARSE_XML_RESPONSE, errors[0].innerText));
                    } else {
                        resolve(doc);
                    }
                } catch (ex) {
                    reject(new ParseError(ERROR_PARSE_XML_RESPONSE));
                }
            } else {
                reject(new ParseError(ERROR_PARSE_XML_RESPONSE));
            }
        });
    });
};