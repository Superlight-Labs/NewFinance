import { ApiSwapQuote } from '../../../base/types';
import { ZeroExSwapQuote } from './0x-ethereum-types';

export const mapZeroExSwapQuote = (swapQuote: ApiSwapQuote<ZeroExSwapQuote>): ZeroExSwapQuote => swapQuote;
