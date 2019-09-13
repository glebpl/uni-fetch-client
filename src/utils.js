"use strict";

/**
 * Wrapper for JSON.parse
 * to catch exceptions
 * @param {String} s
 * @return {null|Object|Array}
 */
export const parseJSON = s => {
    try {
        return JSON.parse(s);
    } catch (ex) {
        return null;
    }
};

/**
 * Makes parameters string
 * @param {Object} data
 * @return {String}
 */
export const serializeObject = data => Object.keys(data).map(k => {
    return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
}).join("&");

/**
 * Builds url
 * @param host
 * @param path
 * @param port
 * @param secure
 * @return {string}
 */
export const makeUrl = (host, path = "/", port = 80, secure) => {
    if(host) {
        port = Number(port);

        secure = secure === true || ( port === 443 && secure !== false );

        const protocol = `http${secure ? "s" : ""}:`;
        // remove slash from host
        const hostString = host.substr(-1) === "/" ? host.slice(0, -1) : host;
        const portString = port && port !== 80 && port !== 443 ? `:${port}` : "";
        const pathString = path && path !== "/" ? ( path.substr(0, 1) === "/" ? path : `/${path}` ) : "";

        return `${protocol}//${hostString}${portString}${pathString}`;
    } else {
        return path;
    }
};

