// cbBTC dip-and-momentum bot for make.fun btc-race-24h-20261123-0511.
//
// Long only, one position at a time, on 1-minute cbBTC/USDC bars.
// Buy the dip (close > DIP_BPS below its SMA) or join a rally (close
// > MOM_BPS above where it was MOM_BARS ago). Exit on take-profit,
// stop-loss, or a trailing stop; a cooldown follows every exit.
// Every decision is a pure function of the bars seen so far: no clock,
// no network, no randomness, so two runs agree byte for byte.

import { runBars, type BarsState, type OrderInput } from './vendor/makefun-bars.ts';

const SYMBOL = 'CBBTC';

// Tuned on the frozen 24h dev window (1,440 1-min bars) with an offline
// replica of the replay fill math, then verified with grade-local:
// net PnL +$33.21, 4 trades, max drawdown 1.58%.
const SMA_BARS = 60;
const DIP_BPS = 60;
const MOM_BARS = 60;
const MOM_BPS = 40;
const TP_BPS = 150;
const STOP_BPS = 60;
const TRAIL_BPS = 180;
const COOL_BARS = 240;
const MAX_SLIPPAGE_BPS = 200;

/** Every close seen so far, as bigints, in batch order. */
const closes: bigint[] = [];
/** The highest close since the current position was opened (0 when flat). */
let peak = 0n;
/** No new buy before this batch seq (set on every exit). */
let coolUntil = -1;

await runBars({
  onBatch(state: BarsState, batch): OrderInput[] {
    const close = state.close(SYMBOL);
    if (close === null) return [];
    closes.push(close);

    const holding = state.positions.get(SYMBOL);
    if (holding !== undefined && holding.qty > 0n) {
      if (close > peak) peak = close;
      const value = state.value(SYMBOL, holding.qty);
      const cost = holding.cost;
      // Exit on whichever fires first: trailing stop, take-profit, stop-loss.
      // The harness flattens any open position at the last close on its own,
      // so no exit order is needed on the final batch.
      let exitTrade = false;
      if (TRAIL_BPS > 0 && peak > 0n && close * 10000n <= peak * BigInt(10000 - TRAIL_BPS)) exitTrade = true;
      if (!exitTrade && TP_BPS > 0 && value * 10000n >= cost * BigInt(10000 + TP_BPS)) exitTrade = true;
      if (!exitTrade && STOP_BPS > 0 && value * 10000n <= cost * BigInt(10000 - STOP_BPS)) exitTrade = true;
      if (exitTrade) {
        peak = 0n;
        coolUntil = batch.seq + COOL_BARS;
        return [{ side: 'sell', symbol: SYMBOL, qty: holding.qty, max_slippage_bps: MAX_SLIPPAGE_BPS }];
      }
      return [];
    }

    if (batch.seq < coolUntil) return [];
    if (closes.length < SMA_BARS) return [];
    let sum = 0n;
    for (let i = closes.length - SMA_BARS; i < closes.length; i++) sum += closes[i];
    const sma = Number(sum) / SMA_BARS;
    const dip = Number(close) * 10000 < sma * (10000 - DIP_BPS);
    let momentum = false;
    if (closes.length >= MOM_BARS + 1) {
      const then = closes[closes.length - MOM_BARS - 1];
      momentum = Number(close) * 10000 > Number(then) * (10000 + MOM_BPS);
    }
    if (!dip && !momentum) return [];
    peak = close;
    return [{ side: 'buy', symbol: SYMBOL, notional_quote_units: state.cash, max_slippage_bps: MAX_SLIPPAGE_BPS }];
  },
});
