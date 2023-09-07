class OrderBook {
  constructor(clientId) {
    this.clientId = clientId;
    this.buyOrders = [];
    this.sellOrders = [];
  }

  addBuyOrder(order) {
    if (this.buyOrders.length === 0) {
      this.buyOrders.push(order);
    } else {
      for (let i = 0; i < this.buyOrders.length; i++) {
        if (order.price > this.buyOrders[i].price) {
          this.buyOrders.splice(i, 0, order);
          break;
        }
      }
    }
  }

  addSellOrder(order) {
    if (this.sellOrders.length === 0) {
      this.sellOrders.push(order);
    } else {
      for (let i = 0; i < this.sellOrders.length; i++) {
        if (order.price < this.sellOrders[i].price) {
          this.sellOrders.splice(i, 0, order);
          break;
        }
      }
    }
  }

  getOrderBookData() {
    return {
      buyOrders: this.buyOrders,
      sellOrders: this.sellOrders,
    };
  }

  matchOrders() {
    while (this.buyOrders.length > 0 && this.sellOrders.length > 0) {
      const buyOrder = this.buyOrders[0];
      const sellOrder = this.sellOrders[0];

      if (buyOrder.price >= sellOrder.price) {
        let tradeQuantity = Math.min(buyOrder.quantity, sellOrder.quantity);
        let price = sellOrder.price;

        console.log(`Matched ${quantity} ${this.tradingPair} @ ${price}`);

        buyOrder.quantity -= tradeQuantity;
        sellOrder.quantity -= tradeQuantity;

        // Handle fully filled orders by removing them from the order book
        if (buyOrder.quantity === 0) {
          this.buyOrders.shift();
        }

        if (sellOrder.quantity === 0) {
          this.sellOrders.shift();
        }

        // Handle partially filled orders by updating the quantity
        if (buyOrder.quantity > 0) {
          this.buyOrders.splice(0, 1, buyOrder);
        }

        if (sellOrder.quantity > 0) {
          this.sellOrders.splice(0, 1, sellOrder);
        }

        const trade = {
          price,
          quantity: tradeQuantity,
          timestamp: Date.now(),
        };

        // Store or process the trade
      } else {
        break;
      }
    }
  }

  handleDistributedOrder(order) {
    if (order.type === 'buy') {
      this.addBuyOrder(order);
    } else if (order.type === 'sell') {
      this.addSellOrder(order);
    }

    this.matchOrders();
  }
}

module.exports = OrderBook;
