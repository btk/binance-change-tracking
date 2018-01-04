const express = require('express')
var path = require("path")
const app = express()
const port = 8080

app.get('/', (request, res) => {
  res.sendFile(path.join(__dirname+'/site/index.html'));
});

app.get('/script.js',function(req,res){
  res.sendFile(path.join(__dirname+'/site/script.js'));
});


app.get('/api', (request, res) => {
  let lim = Number(request.url.split("=")[1]);
  if(!lim){
    lim = 5;
  }
  res.setHeader('Content-Type', 'application/json');

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
      binanceRest.klines({symbol: symbol, interval: '1m', limit: lim}, (err, data) => {
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
          coins.push({symbol: symbol, change: (changeInPercentage * 100).toFixed(2), trades, volumes: Math.ceil(volumes * Number(coin.price)), price: coin.price});
          if(dataLen == coins.length){
            printByChange();
          }
      });
    });
  });


  function printByChange(){
    coins = coins.filter((c) => (c.symbol.includes("BTC")));
    res.send(JSON.stringify(coins));
  }


});


app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
