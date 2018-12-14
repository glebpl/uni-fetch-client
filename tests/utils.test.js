/*eslint-env jest*/

import {makeUrl, parseJSON, serializeObject} from "../src/utils";

describe("Utilities tests", () => {
   test("JSON parsing (parseJSON)", () => {
       expect(parseJSON("")).toBe(null);
       expect(parseJSON("-{}")).toBe(null);
       expect(parseJSON("{}")).toEqual({});
   });

   test("Data serialization (serializeObject)", () => {
       expect(serializeObject({})).toBe("");
       expect(serializeObject({
           a: 1
           , b: "2"
           , c: "Привёт"
       })).toBe("a=1&b=2&c=%D0%9F%D1%80%D0%B8%D0%B2%D1%91%D1%82");
   });

   test("URL builder (makeUrl)", () => {
        expect(makeUrl("ya.ru")).toBe("http://ya.ru");
        expect(makeUrl("ya.ru", "/path1/to/resource")).toBe("http://ya.ru/path1/to/resource");
        expect(makeUrl("ya.ru", "/path2/to/resource", 8080)).toBe("http://ya.ru:8080/path2/to/resource");
        expect(makeUrl("ya.ru", "/path3/to/resource", 80)).toBe("http://ya.ru/path3/to/resource");
        expect(makeUrl("ya.ru", "/path4/to/resource", 443)).toBe("https://ya.ru/path4/to/resource");
        expect(makeUrl("ya.ru", "/path5/to/resource", 443, false)).toBe("http://ya.ru/path5/to/resource");
        expect(makeUrl("ya.ru", "/path6/to/resource", 80, true)).toBe("https://ya.ru/path6/to/resource");
        expect(makeUrl("ya.ru", "/path7/to/resource", 8181, true)).toBe("https://ya.ru:8181/path7/to/resource");
   });
});