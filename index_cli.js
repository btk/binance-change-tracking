const api = require('binance');
const binanceRest = new api.BinanceRest({
    key: '', // Get this from your account on binance.com
    secret: '', // Same for this
    timeout: 15000, // Optional, defaults to 15000, is the request time out in milliseconds
    recvWindow: 10000, // Optional, defaults to 5000, increase if you're getting timestamp errors
    disableBeautification: false
});

let coins = [];

binanceRest.allPrices((err, data) => {
  console.log("Calculating...\n");
  let dataLen = data.length;
  data.forEach((coin, i) => {
    let symbol = coin.symbol;
    binanceRest.klines({symbol: symbol, interval: '1m', limit: 5}, (err, data) => {
        let startOfInterval = (Number(data[0].low) + Number(data[0].high)) / 2; // 50 / 50
        let endOfInterval = (Number(data[data.length - 1].low) + Number(data[data.length - 1].high)) / 2; // 55 / 45
        let trades = 0;
        let volumes = 0;
        data.forEach((d) => {
          trades += Number(d.trades);
          volumes += Number(d.volume);
        });
        let changeInValue = endOfInterval - startOfInterval; // 5 / -5
        let changeInPercentage = changeInValue / startOfInterval; // 10 / -10
        coins.push({symbol: symbol, change: changeInPercentage, trades, volumes: Math.ceil(volumes * Number(coin.price)), price: coin.price});
        if(dataLen == coins.length){
          printByChange();
        }
    });
  });
});


function printByChange(){
  coins = coins.filter((c) => (c.symbol.includes("BTC")));
  coins.sort(function(a, b) {
    return b.change - a.change;
  });
  let i = 0;
  while(i < 5){
    console.log((i+1) + ") "+ coins[i].symbol + " => " + (coins[i].change * 100).toFixed(2) + "%" + " (" + coins[i].volumes + " BTC Moved)");
    i++;
  }
}
