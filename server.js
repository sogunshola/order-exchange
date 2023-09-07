const { PeerRPCServer } = require("grenache-nodejs-http");
const Link = require("grenache-nodejs-link");
const OrderBook = require("./orderBook");

const link = new Link({
  grape: "http://127.0.0.1:30001",
});
link.start();

const peer = new PeerRPCServer(link, {
  timeout: 300000,
});
peer.init();

peer.transport("server").listen(1337);

setInterval(function () {
  link.announce("order_matching_service", 1337, {});
}, 5000);

console.log("Order matching service listening on port 1337");

peer.transport("server").on("request", (rid, key, payload, handler) => {
  handleRPCRequest(rid, key, payload, handler);
});

const orderBooks = {};

function handleRPCRequest (rid, key, payload, handler) {
  const { action, order, clientId } = payload;

  if (!clientId) {
    handler.reply(new Error('Client ID is required'));
    return;
  }

  switch (action) {
    case 'distribute_order':
      // Handle the distributed order from the client
      if (!orderBooks[clientId]) {
        orderBooks[clientId] = new OrderBook(clientId);
      }

      const clientOrderBook = orderBooks[clientId];

      // Add the order to the client's OrderBook
      if (order.type === 'buy') {
        clientOrderBook.addBuyOrder(order);
      } else if (order.type === 'sell') {
        clientOrderBook.addSellOrder(order);
      }

      // Distribute the order to other instances (broadcast)
      for (const otherClientId of Object.keys(orderBooks)) {
        if (otherClientId !== clientId) {
          orderBooks[otherClientId].handleDistributedOrder(order);
        }
      }

      // Respond to the client with a confirmation
      handler.reply(null, { message: 'Order distributed and added to the client\'s OrderBook' });
      break;

    case 'get_order_book':
      // Handle the request for the order book from the client
      if (!orderBooks[clientId]) {
        orderBooks[clientId] = new OrderBook(clientId);
      }

      const orderBook = orderBooks[clientId];

      handler.reply(null, orderBook.getOrderBookData());

    default:
      handler.reply(new Error('Invalid action'));
      break;
  }
};

module.exports = peer;
