const { PeerRPCClient } = require("grenache-nodejs-http");
const Link = require("grenache-nodejs-link");

const link = new Link({
  grape: "http://127.0.0.1:30001",
});
link.start();

const peer = new PeerRPCClient(link, {});
peer.init();

const clientId = "client1";

function placeOrder(tradingPair, price, quantity, type) {
  const order = {
    type,
    tradingPair,
    price,
    quantity,
  };

  peer.request(
    "order_matching_service",
    { action: 'distribute_order', order, clientId },
    { timeout: 10000 },
    (err, data) => {
      if (err) {
        console.error("Error placing order:", err);
      } else {
        console.log("Order placed successfully:", data);
      }
    }
  );
}


function queryOrderBook() {
  peer.request(
    "order_matching_service",
    {
      action: "get_order_book",
      clientId,
    },
    { timeout: 10000 },
    (err, data) => {
      if (err) {
        console.error("Error fetching order book:", err);
      } else {
        console.log("Order book for", clientId, ":", data);
      }
    }
  );
}

module.exports = {
  placeOrder,
  queryOrderBook,
};
