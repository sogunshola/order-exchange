# Simplified Distributed Exchange Documentation

## Introduction
This documentation provides an overview of a simplified distributed exchange system implemented using JavaScript and Grenache. The system allows multiple clients to maintain their own order books, submit orders to their order books, and distribute orders to other clients. If a client's order matches with another order, any remainder is added to the order book.

## System Requirements

- Each client must have its own instance of the order book.
- Clients can submit orders to their own order book.
- Orders submitted by clients are distributed to other instances.
- If an order matches with another order, any remaining portion must be added to the order book.

## Code Implementation

### Server-Side (`server.js`)

- The server initializes Grenache for communication between nodes.
- It defines an `OrderBook` class to manage order books for individual clients.
- The server handles RPC requests using the `handleRPCRequest` function.
- Clients can send `distribute_order` requests to the server.
- The server identifies the client based on the `clientId` and adds the order to the client's specific order book.
- The server broadcasts the order to other instances.
- The `handleDistributedOrder` function in the `OrderBook` class processes distributed orders.

### Client-Side (`test-client.js`)

- Clients initiate Grenache and send `distribute_order` requests to the server.
- Each client has a unique `clientId` to identify itself.
- Clients define order data, including `tradingPair`, `type` (buy or sell), `price`, and `quantity`.
- Orders are sent to the server for distribution.
- Clients receive confirmation messages from the server.

## Usage

1. Start the Grape servers for communication:

```
  grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
  grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
```

2. Start the server:

```
  node server.js
```

3. Start the clients (one or more):

```
  node test-client.js
```


4. Clients can submit orders using the `test-client.js` script. Each client has a unique `clientId`.

## Limitations

- This implementation is a simplified version of a distributed exchange and may not cover all edge cases and production requirements.
- It does not include advanced order matching algorithms.
- Error handling is basic and should be enhanced for production use.

