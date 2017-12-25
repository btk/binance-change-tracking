# binance-change-tracking

Node server & client source code for an easier interface for binance currency market tracking with the option of last 1, 5, 10, 30 or 60 min changes.

Change the binance api key and secret respect to yours. This project only needs "Data Reading" permission.

```JS
const binanceRest = new api.BinanceRest({
    key: '', // Get this from your account on binance.com
    secret: '', // Same for this
    timeout: 15000, // Optional, defaults to 15000, is the request time out in milliseconds
    recvWindow: 10000, // Optional, defaults to 5000, increase if you're getting timestamp errors
    disableBeautification: false
});
```

Start installing requirements;

```
npm install
node index.js
```

Uses 8080 port as default so go to;

- http://localhost:8080

See api json output;

- http://localhost:8080/api?limit=5 (1/5/10/30/60min)

See the demo for a limited time at http://207.154.251.255/

Also you can use a more simple cli version of this by;

```
npm install
node index-cli.js
```

### uses

- binance (as node api wrapper) npm/binance
- angularjs (1.x)
- bootstrap for table functionality
