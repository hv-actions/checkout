"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function escape(value) {
    return value.replace(/[^a-zA-Z0-9_]/g, x => {
        return `\\${x}`;
    });
}
exports.escape = escape;
