import { Buffer } from 'buffer';

var TextDecoder = require('text-encoder-lite').TextDecoderLite;
var TextEncoder = require('text-encoder-lite').TextEncoderLite;

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
global.Buffer = Buffer;
