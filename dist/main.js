"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const coreCommand = __importStar(require("@actions/core/lib/command"));
const gitSourceProvider = __importStar(require("./git-source-provider"));
const inputHelper = __importStar(require("./input-helper"));
const path = __importStar(require("path"));
const stateHelper = __importStar(require("./state-helper"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sourceSettingsList = inputHelper.getInputs();
            try {
                // Register problem matcher
                coreCommand.issueCommand('add-matcher', {}, path.join(__dirname, 'problem-matcher.json'));
                // Get sources
                for (var sourceSettings of sourceSettingsList) {
                    yield gitSourceProvider.getSource(sourceSettings);
                }
            }
            finally {
                // Unregister problem matcher
                coreCommand.issueCommand('remove-matcher', { owner: 'checkout-git' }, '');
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
function cleanup() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield gitSourceProvider.cleanup(stateHelper.RepositoryPath);
        }
        catch (error) {
            core.warning(error.message);
        }
    });
}
// Main
if (!stateHelper.IsPost) {
    run();
}
// Post
else {
    cleanup();
}
