"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const url_1 = require("url");
function getFetchUrl(settings) {
    assert.ok(settings.repositoryOwner, 'settings.repositoryOwner must be defined');
    assert.ok(settings.repositoryName, 'settings.repositoryName must be defined');
    const serviceUrl = getServerUrl();
    const encodedOwner = encodeURIComponent(settings.repositoryOwner);
    const encodedName = encodeURIComponent(settings.repositoryName);
    if (settings.sshKey) {
        return `git@${serviceUrl.hostname}:${encodedOwner}/${encodedName}.git`;
    }
    // "origin" is SCHEME://HOSTNAME[:PORT]
    return `${serviceUrl.origin}/${encodedOwner}/${encodedName}`;
}
exports.getFetchUrl = getFetchUrl;
function getServerUrl() {
    // todo: remove GITHUB_URL after support for GHES Alpha is no longer needed
    return new url_1.URL(process.env['GITHUB_SERVER_URL'] ||
        process.env['GITHUB_URL'] ||
        'https://github.com');
}
exports.getServerUrl = getServerUrl;
