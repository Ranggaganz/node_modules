"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrlInfo = void 0;
const messages_media_1 = require("./messages-media");
const THUMBNAIL_WIDTH_PX = 192;
/** Fetches an image and generates a thumbnail for it */
const getCompressedJpegThumbnail = async (url, { thumbnailWidth, timeoutMs }) => {
    const stream = await messages_media_1.getHttpStream(url, { timeout: timeoutMs });
    const result = await messages_media_1.extractImageThumb(stream, thumbnailWidth);
    return result;
};
/**
 * Given a piece of text, checks for any URL present, generates link preview for the same and returns it
 * Return undefined if the fetch failed or no URL was found
 * @param text the text containing URL
 * @returns the URL info required to generate link preview
 */
const getUrlInfo = async (text, opts = { thumbnailWidth: THUMBNAIL_WIDTH_PX, timeoutMs: 3000 }) => {
    try {
        const { getLinkPreview } = await Promise.resolve().then(() => __importStar(require('link-preview-js')));
        const info = await getLinkPreview(text, { timeout: opts.timeoutMs });
        if (info && 'title' in info) {
            const [image] = info.images;
            const jpegThumbnail = image
                ? await getCompressedJpegThumbnail(image, opts)
                : undefined;
            return {
                'canonical-url': info.url,
                'matched-text': info.url,
                title: info.title,
                description: info.description,
                jpegThumbnail
            };
        }
    }
    catch (error) {
        if (!error.message.includes('receive a valid')) {
            throw error;
        }
    }
};
exports.getUrlInfo = getUrlInfo;
