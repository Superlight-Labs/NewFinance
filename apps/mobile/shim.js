var Buffer = require('buffer');
var crypto = require('expo-crypto');
var TextDecoder = require('text-encoder-lite').TextDecoderLite;
var TextEncoder = require('text-encoder-lite').TextEncoderLite;

global.crypto = crypto;
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
global.Buffer = Buffer;
