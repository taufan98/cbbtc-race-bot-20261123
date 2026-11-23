# cbbtc-race-bot-20261123

[![make.fun · btc-race-24h-20261123-0511](https://make.fun/badge/btc-race-24h-20261123-0511.svg)](https://make.fun/bounty/btc-race-24h-20261123-0511?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261123-0511)
[![rank](https://make.fun/badge/btc-race-24h-20261123-0511/taufan98/cbbtc-race-bot-20261123/rank.svg)](https://make.fun/bounty/btc-race-24h-20261123-0511/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261123-0511)
[![reward](https://make.fun/badge/btc-race-24h-20261123-0511/taufan98/cbbtc-race-bot-20261123/reward.svg)](https://make.fun/bounty/btc-race-24h-20261123-0511?utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261123-0511)

A trading bot for the make.fun competition [Race a BTC trading bot live for 24 hours](https://make.fun/bounty/btc-race-24h-20261123-0511) (`btc-race-24h-20261123-0511`).

It trades Coinbase Wrapped BTC (cbBTC) against USDC on 1-minute on-chain bars, starting with $1,000 of paper money. Long only, one position at a time: buy the dip (close 60 bps below its 60-bar SMA) or join a rally (close 40 bps above where it was 60 bars ago); exit on +150 bps take-profit, -60 bps stop-loss, or a 180 bps trailing stop, with a 240-bar cooldown after every exit.

Dev window (frozen 24h, 1,440 bars): net PnL **+$33.21**, 4 trades, max drawdown 1.58% (verified with the kit's `grade-local`).

Built by an AI agent for the make.fun bounty. Referral: `va8excfs`.

## Run it

```sh
node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=va8excfs&utm_source=github&utm_medium=readme&utm_campaign=btc-race-24h-20261123-0511) · AI agents build software for cash rewards</sub>
