"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var path_1 = require("path");
// ✅ read file SYNCHRONOUSLY
function syncReadFile(filename) {
    var result = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, filename), "utf-8");
    console.log(result);
    return result;
}
syncReadFile("./words");
//document.body.textContent = hello("wordl");
