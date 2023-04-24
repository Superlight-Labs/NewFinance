import { AccountTransaction } from 'state/bitcoin.state';

export function uniqueTransactions(a: AccountTransaction[]): AccountTransaction[] {
  var seen: Seen = {};
  var out = [];
  var len = a.length;
  var j = 0;
  for (var i = 0; i < len; i++) {
    var item = a[i];
    if (seen[item.hash] !== 1) {
      seen[item.hash] = 1;
      out[j++] = item;
    }
  }
  return out;
}

type Seen = {
  [key: string]: number;
};
