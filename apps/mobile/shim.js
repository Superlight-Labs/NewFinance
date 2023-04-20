import { Buffer } from 'buffer';

import * as crypto from 'expo-crypto';

var TextDecoder = require('text-encoder-lite').TextDecoderLite;
var TextEncoder = require('text-encoder-lite').TextEncoderLite;

global.crypto = crypto;
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
global.Buffer = Buffer;
