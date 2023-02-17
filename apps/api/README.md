## Description

Acts as second party for Cryptographic Multi Parti Actions like key generation, derivation and signature creation.
Is Powered by [Fastify](https://www.fastify.io/) and [Prisma as ORM](https://www.prisma.io/)
To be able to save Keyshares for our Users we need a Database

## Features and Routes

Following sub-path currently exist within the api. Each sub-path is there to enable a specific subset of features.

### /auth

Authentication relies on Signatures by the clients. Random nonces, sent by the api via these endpoints, are signed and sent back to the api.

### /gasless

Blockchain Transaction can be costly on the mainnet and still not for free on Layer 2. These Endpoints enable Gasless transactions and swapps by providing a paymaster.
Coins/Contracts that support the `permit`function, can be paid for directly. For everything else, there is a mechanism which sends the user the fees in advance.

### /mpc

This project relies on Multi-Party-Signatures. These endpoints provide the basis for Multi-Party communication as Websockets

### /user

Basic User related CRUD operations
