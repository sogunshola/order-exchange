const { placeOrder, queryOrderBook } = require("./test-client");

placeOrder("BTC/ETH", 50, 10, "buy");

placeOrder("BTC/ETH", 55, 5, "sell");

queryOrderBook();
