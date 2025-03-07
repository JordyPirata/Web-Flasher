(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.sparse = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (this && this.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runWithTimeout = exports.TimeoutError = exports.runWithTimedProgress = exports.readBlobAsBuffer = exports.setDebugLevel = exports.logVerbose = exports.logDebug = exports.DebugLevel = void 0;
    var DebugLevel;
    (function (DebugLevel) {
        DebugLevel[DebugLevel["Silent"] = 0] = "Silent";
        DebugLevel[DebugLevel["Debug"] = 1] = "Debug";
        DebugLevel[DebugLevel["Verbose"] = 2] = "Verbose";
    })(DebugLevel = exports.DebugLevel || (exports.DebugLevel = {}));
    var debugLevel = DebugLevel.Silent;
    function logDebug() {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        if (debugLevel >= 1) {
            console.log.apply(console, data);
        }
    }
    exports.logDebug = logDebug;
    function logVerbose() {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        if (debugLevel >= 2) {
            console.log.apply(console, data);
        }
    }
    exports.logVerbose = logVerbose;
    /**
     * Change the debug level for the fastboot client:
     *   - 0 = silent
     *   - 1 = debug, recommended for general use
     *   - 2 = verbose, for debugging only
     *
     * @param {number} level - Debug level to use.
     */
    function setDebugLevel(level) {
        debugLevel = level;
    }
    exports.setDebugLevel = setDebugLevel;
    /**
     * Reads all of the data in the given blob and returns it as an ArrayBuffer.
     *
     * @param {Blob} blob - Blob with the data to read.
     * @returns {Promise<ArrayBuffer>} ArrayBuffer containing data from the blob.
     * @ignore
     */
    function readBlobAsBuffer(blob) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function () {
                resolve(reader.result);
            };
            reader.onerror = function () {
                reject(reader.error);
            };
            reader.readAsArrayBuffer(blob);
        });
    }
    exports.readBlobAsBuffer = readBlobAsBuffer;
    function waitForFrame() {
        return new Promise(function (resolve, _reject) {
            window.requestAnimationFrame(resolve);
        });
    }
    function runWithTimedProgress(onProgress, action, item, duration, workPromise) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, stop, progressPromise;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = new Date().getTime();
                        stop = false;
                        onProgress(action, item, 0.0);
                        progressPromise = (function () { return __awaiter(_this, void 0, void 0, function () {
                            var now, targetTime;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        targetTime = startTime + duration;
                                        _a.label = 1;
                                    case 1:
                                        now = new Date().getTime();
                                        onProgress(action, item, (now - startTime) / duration);
                                        return [4 /*yield*/, waitForFrame()];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3:
                                        if (!stop && now < targetTime) return [3 /*break*/, 1];
                                        _a.label = 4;
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); })();
                        return [4 /*yield*/, Promise.race([progressPromise, workPromise])];
                    case 1:
                        _a.sent();
                        stop = true;
                        return [4 /*yield*/, progressPromise];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, workPromise];
                    case 3:
                        _a.sent();
                        onProgress(action, item, 1.0);
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.runWithTimedProgress = runWithTimedProgress;
    /** Exception class for operations that exceeded their timeout duration. */
    var TimeoutError = /** @class */ (function (_super) {
        __extends(TimeoutError, _super);
        function TimeoutError(timeout) {
            var _this = _super.call(this, "Timeout of ".concat(timeout, " ms exceeded")) || this;
            _this.name = "TimeoutError";
            _this.timeout = timeout;
            return _this;
        }
        return TimeoutError;
    }(Error));
    exports.TimeoutError = TimeoutError;
    function runWithTimeout(promise, timeout) {
        return new Promise(function (resolve, reject) {
            // Set up timeout
            var timedOut = false;
            var tid = setTimeout(function () {
                // Set sentinel first to prevent race in promise resolving
                timedOut = true;
                reject(new TimeoutError(timeout));
            }, timeout);
            // Passthrough
            promise
                .then(function (val) {
                if (!timedOut) {
                    resolve(val);
                }
            })
                .catch(function (err) {
                if (!timedOut) {
                    reject(err);
                }
            })
                .finally(function () {
                if (!timedOut) {
                    clearTimeout(tid);
                }
            });
        });
    }
    exports.runWithTimeout = runWithTimeout;
    
    },{}],2:[function(require,module,exports){
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __generator = (this && this.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
    var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.splitBlob = exports.fromRaw = exports.parseFileHeader = exports.ChunkType = exports.ImageError = exports.FILE_HEADER_SIZE = void 0;
    var common = require("./common");
    var FILE_MAGIC = 0xed26ff3a;
    var MAJOR_VERSION = 1;
    var MINOR_VERSION = 0;
    exports.FILE_HEADER_SIZE = 28;
    var CHUNK_HEADER_SIZE = 12;
    // AOSP libsparse uses 64 MiB chunks
    var RAW_CHUNK_SIZE = 64 * 1024 * 1024;
    var ImageError = /** @class */ (function (_super) {
        __extends(ImageError, _super);
        function ImageError(message) {
            var _this = _super.call(this, message) || this;
            _this.name = "ImageError";
            return _this;
        }
        return ImageError;
    }(Error));
    exports.ImageError = ImageError;
    var ChunkType;
    (function (ChunkType) {
        ChunkType[ChunkType["Raw"] = 51905] = "Raw";
        ChunkType[ChunkType["Fill"] = 51906] = "Fill";
        ChunkType[ChunkType["Skip"] = 51907] = "Skip";
        ChunkType[ChunkType["Crc32"] = 51908] = "Crc32";
    })(ChunkType = exports.ChunkType || (exports.ChunkType = {}));
    /**
     * Returns a parsed version of the sparse image file header from the given buffer.
     *
     * @param {ArrayBuffer} buffer - Raw file header data.
     * @returns {SparseHeader} Object containing the header information.
     */
    function parseFileHeader(buffer) {
        var view = new DataView(buffer);
        var magic = view.getUint32(0, true);
        if (magic !== FILE_MAGIC) {
            return null;
        }
        // v1.0+
        var major = view.getUint16(4, true);
        var minor = view.getUint16(6, true);
        if (major !== MAJOR_VERSION || minor < MINOR_VERSION) {
            throw new ImageError("Unsupported sparse image version ".concat(major, ".").concat(minor));
        }
        var fileHdrSize = view.getUint16(8, true);
        var chunkHdrSize = view.getUint16(10, true);
        if (fileHdrSize !== exports.FILE_HEADER_SIZE ||
            chunkHdrSize !== CHUNK_HEADER_SIZE) {
            throw new ImageError("Invalid file header size ".concat(fileHdrSize, ", chunk header size ").concat(chunkHdrSize));
        }
        var blockSize = view.getUint32(12, true);
        if (blockSize % 4 !== 0) {
            throw new ImageError("Block size ".concat(blockSize, " is not a multiple of 4"));
        }
        return {
            blockSize: blockSize,
            blocks: view.getUint32(16, true),
            chunks: view.getUint32(20, true),
            crc32: view.getUint32(24, true),
        };
    }
    exports.parseFileHeader = parseFileHeader;
    function parseChunkHeader(buffer) {
        var view = new DataView(buffer);
        // This isn't the same as what createImage takes.
        // Further processing needs to be done on the chunks.
        return {
            type: view.getUint16(0, true),
            /* 2: reserved, 16 bits */
            blocks: view.getUint32(4, true),
            dataBytes: view.getUint32(8, true) - CHUNK_HEADER_SIZE,
            data: null, // to be populated by consumer
        };
    }
    function calcChunksBlockSize(chunks) {
        return chunks
            .map(function (chunk) { return chunk.blocks; })
            .reduce(function (total, c) { return total + c; }, 0);
    }
    function calcChunksDataSize(chunks) {
        return chunks
            .map(function (chunk) { return chunk.data.byteLength; })
            .reduce(function (total, c) { return total + c; }, 0);
    }
    function calcChunksSize(chunks) {
        // 28-byte file header, 12-byte chunk headers
        var overhead = exports.FILE_HEADER_SIZE + CHUNK_HEADER_SIZE * chunks.length;
        return overhead + calcChunksDataSize(chunks);
    }
    function createImage(header, chunks) {
        var buffer = new ArrayBuffer(calcChunksSize(chunks));
        var dataView = new DataView(buffer);
        var arrayView = new Uint8Array(buffer);
        dataView.setUint32(0, FILE_MAGIC, true);
        // v1.0
        dataView.setUint16(4, MAJOR_VERSION, true);
        dataView.setUint16(6, MINOR_VERSION, true);
        dataView.setUint16(8, exports.FILE_HEADER_SIZE, true);
        dataView.setUint16(10, CHUNK_HEADER_SIZE, true);
        // Match input parameters
        dataView.setUint32(12, header.blockSize, true);
        dataView.setUint32(16, header.blocks, true);
        dataView.setUint32(20, chunks.length, true);
        // We don't care about the CRC. AOSP docs specify that this should be a CRC32,
        // but AOSP libsparse always sets 0 and puts the CRC in a final undocumented
        // 0xCAC4 chunk instead.
        dataView.setUint32(24, 0, true);
        var chunkOff = exports.FILE_HEADER_SIZE;
        for (var _i = 0, chunks_1 = chunks; _i < chunks_1.length; _i++) {
            var chunk = chunks_1[_i];
            dataView.setUint16(chunkOff, chunk.type, true);
            dataView.setUint16(chunkOff + 2, 0, true); // reserved
            dataView.setUint32(chunkOff + 4, chunk.blocks, true);
            dataView.setUint32(chunkOff + 8, CHUNK_HEADER_SIZE + chunk.data.byteLength, true);
            chunkOff += CHUNK_HEADER_SIZE;
            var chunkArrayView = new Uint8Array(chunk.data);
            arrayView.set(chunkArrayView, chunkOff);
            chunkOff += chunk.data.byteLength;
        }
        return buffer;
    }
    /**
     * Creates a sparse image from buffer containing raw image data.
     *
     * @param {ArrayBuffer} rawBuffer - Buffer containing the raw image data.
     * @returns {ArrayBuffer} Buffer containing the new sparse image.
     */
    function fromRaw(rawBuffer) {
        var header = {
            blockSize: 4096,
            blocks: rawBuffer.byteLength / 4096,
            chunks: 1,
            crc32: 0,
        };
        var chunks = [];
        while (rawBuffer.byteLength > 0) {
            var chunkSize = Math.min(rawBuffer.byteLength, RAW_CHUNK_SIZE);
            chunks.push({
                type: ChunkType.Raw,
                blocks: chunkSize / header.blockSize,
                data: rawBuffer.slice(0, chunkSize),
            });
            rawBuffer = rawBuffer.slice(chunkSize);
        }
        return createImage(header, chunks);
    }
    exports.fromRaw = fromRaw;
    /**
     * Split a sparse image into smaller sparse images within the given size.
     * This takes a Blob instead of an ArrayBuffer because it may process images
     * larger than RAM.
     *
     * @param {Blob} blob - Blob containing the sparse image to split.
     * @param {number} splitSize - Maximum size per split.
     * @yields {Object} Data of the next split image and its output size in bytes.
     */
    function splitBlob(blob, splitSize) {
        return __asyncGenerator(this, arguments, function splitBlob_1() {
            var headerData, header, splitChunks, splitDataBytes, i, chunkHeaderData, chunk, _a, bytesRemaining, splitBlocks, splitImage, splitImage;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        common.logDebug("Splitting ".concat(blob.size, "-byte sparse image into ").concat(splitSize, "-byte chunks"));
                        if (!(blob.size <= splitSize)) return [3 /*break*/, 5];
                        common.logDebug("Blob fits in 1 payload, not splitting");
                        _b = {};
                        return [4 /*yield*/, __await(common.readBlobAsBuffer(blob))];
                    case 1: return [4 /*yield*/, __await.apply(void 0, [(_b.data = _c.sent(),
                                _b.bytes = blob.size,
                                _b)])];
                    case 2: return [4 /*yield*/, _c.sent()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, __await(void 0)];
                    case 4: return [2 /*return*/, _c.sent()];
                    case 5: return [4 /*yield*/, __await(common.readBlobAsBuffer(blob.slice(0, exports.FILE_HEADER_SIZE)))];
                    case 6:
                        headerData = _c.sent();
                        header = parseFileHeader(headerData);
                        if (header === null) {
                            throw new ImageError("Blob is not a sparse image");
                        }
                        // Remove CRC32 (if present), otherwise splitting will invalidate it
                        header.crc32 = 0;
                        blob = blob.slice(exports.FILE_HEADER_SIZE);
                        splitChunks = [];
                        splitDataBytes = 0;
                        i = 0;
                        _c.label = 7;
                    case 7:
                        if (!(i < header.chunks)) return [3 /*break*/, 14];
                        return [4 /*yield*/, __await(common.readBlobAsBuffer(blob.slice(0, CHUNK_HEADER_SIZE)))];
                    case 8:
                        chunkHeaderData = _c.sent();
                        chunk = parseChunkHeader(chunkHeaderData);
                        _a = chunk;
                        return [4 /*yield*/, __await(common.readBlobAsBuffer(blob.slice(CHUNK_HEADER_SIZE, CHUNK_HEADER_SIZE + chunk.dataBytes)))];
                    case 9:
                        _a.data = _c.sent();
                        blob = blob.slice(CHUNK_HEADER_SIZE + chunk.dataBytes);
                        bytesRemaining = splitSize - calcChunksSize(splitChunks);
                        common.logVerbose("  Chunk ".concat(i, ": type ").concat(chunk.type, ", ").concat(chunk.dataBytes, " bytes / ").concat(chunk.blocks, " blocks, ").concat(bytesRemaining, " bytes remaining"));
                        if (!(bytesRemaining >= chunk.dataBytes)) return [3 /*break*/, 10];
                        // Read the chunk and add it
                        common.logVerbose("    Space is available, adding chunk");
                        splitChunks.push(chunk);
                        // Track amount of data written on the output device, in bytes
                        splitDataBytes += chunk.blocks * header.blockSize;
                        return [3 /*break*/, 13];
                    case 10:
                        splitBlocks = calcChunksBlockSize(splitChunks);
                        splitChunks.push({
                            type: ChunkType.Skip,
                            blocks: header.blocks - splitBlocks,
                            data: new ArrayBuffer(0),
                            dataBytes: 0,
                        });
                        common.logVerbose("Partition is ".concat(header.blocks, " blocks, used ").concat(splitBlocks, ", padded with ").concat(header.blocks - splitBlocks, ", finishing split with ").concat(calcChunksBlockSize(splitChunks), " blocks"));
                        splitImage = createImage(header, splitChunks);
                        common.logDebug("Finished ".concat(splitImage.byteLength, "-byte split with ").concat(splitChunks.length, " chunks"));
                        return [4 /*yield*/, __await({
                                data: splitImage,
                                bytes: splitDataBytes,
                            })];
                    case 11: return [4 /*yield*/, _c.sent()];
                    case 12:
                        _c.sent();
                        // Start a new split. Every split is considered a full image by the
                        // bootloader, so we need to skip the *total* written blocks.
                        common.logVerbose("Starting new split: skipping first ".concat(splitBlocks, " blocks and adding chunk"));
                        splitChunks = [
                            {
                                type: ChunkType.Skip,
                                blocks: splitBlocks,
                                data: new ArrayBuffer(0),
                                dataBytes: 0,
                            },
                            chunk,
                        ];
                        splitDataBytes = 0;
                        _c.label = 13;
                    case 13:
                        i++;
                        return [3 /*break*/, 7];
                    case 14:
                        if (!(splitChunks.length > 0 &&
                            (splitChunks.length > 1 || splitChunks[0].type !== ChunkType.Skip))) return [3 /*break*/, 17];
                        splitImage = createImage(header, splitChunks);
                        common.logDebug("Finishing final ".concat(splitImage.byteLength, "-byte split with ").concat(splitChunks.length, " chunks"));
                        return [4 /*yield*/, __await({
                                data: splitImage,
                                bytes: splitDataBytes,
                            })];
                    case 15: return [4 /*yield*/, _c.sent()];
                    case 16:
                        _c.sent();
                        _c.label = 17;
                    case 17: return [2 /*return*/];
                }
            });
        });
    }
    exports.splitBlob = splitBlob;
    
    },{"./common":1}]},{},[2,1])(2)
    });
