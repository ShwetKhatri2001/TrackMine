<div align="center">
  <a href="https://github.com/kailash360/TrackMine">
    <img src="https://user-images.githubusercontent.com/75155230/162634488-a86df851-81ab-41d4-9c15-d1155683a935.png" alt="Logo" width="100" height="100">
  </a>

  <h1 align="center">TrackMine</h1>
</div>

**TrackMine** is a decentralized coal supply chain management system
that allows you to efficiently manage the coal distribution
efficiently yet easily.

### Problem

- Generation of electricity from coal has been a time taking and corrupted process.
  It has not been digitalized because of the trust and transparency issues.
  But all these can be solved by involving Blockchain in the supply chain of coal from coal producing firms to electricity producing firms.

### 💫 How it works

- It begins where the coal producer registers his firm, coal type, capacity with the system. Then There will be electricity producers that can choose any coal provider and can raise a request for coal to generate electricity. When the coal is ready by the producer, It has to go through Government approval to transport via railway. Then the coal will be transfered from coal producer to electricity producer via train while tracking each and every station the train go through. The entire history of a coal is also displayed to all the parties, where they can see how the coal has been handed to electricity producer along since the coal was produced. All of these transactions are recorded in the blockchain and this makes the coal transport flow more transparent.
- The entire process is made digital which makes the operations and logistics run smoothly. Also all the financial transactions will be done via Ethereum blockchain network . This makes the entire trade and commerce more secure and safe. This can be especially useful to make the transportation of coal more quicker, transparent and uncorrupted by any middle man.

### Preview

![image](https://user-images.githubusercontent.com/56475750/230349785-a896e104-39df-431e-b437-1c669618f24b.png)

### 💻 Setting up locally

- Clone the repository and install dependencies in the client using the following command

```sh
cd client && npm install --dev
```

- Compile the contracts and deploy on **Ganache** lcoal testnet

```sh
cd contracts && truffle deploy --reset
```

- Start the client side

```
npm start
```

### 🛠️ Technology & Tools

- Solidity
- Web 3.0
- IPFS
- ReactJS
- Material UI
