"use strict";

import {makeUrl} from "./utils";
import {FetchClient} from "./FetchClient";
import {ParseError as _ParseError} from "./ParseError";
import {TransportError as _TransportError} from "./TransportError";
import * as C from "./constants";

export {
    METHOD_GET
    , METHOD_POST
    , MODE_CORS
    , MODE_NO_CORS
    , ERROR_PARSE_JSON_RESPONSE
    , ERROR_PARSE_XML_RESPONSE
} from "./constants";

export const url = makeUrl;
export const create = options => new FetchClient(options);
export const createAbortController = () => new AbortController();
export {ParseError} from "./ParseError";
export {TransportError} from "./TransportError";

const lib = {
    url
    , create
    , createAbortController
    , ParseError: _ParseError
    , TransportError: _TransportError
    , ...C
};

export default lib;