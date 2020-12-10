const HDWalletProvider = require('@truffle/hdwallet-provider');

const constants = require('./constants');

const { REACT_APP_INFURA_KEY, MNEMONIC } = constants;

module.exports = {
  networks: {
    development: {
     host: "127.0.0.1",
     port: 7545,
     network_id: "*",
    },
    ropsten: {
      provider: () => (
        new HDWalletProvider(MNEMONIC, `wss://ropsten.infura.io/ws/v3/${REACT_APP_INFURA_KEY}`)
      ),
      network_id: 3,
      gas: 700000,
      gasPrice: 40000000000,
      confirmations: 2,
      timeoutBlocks: 1000,
      skipDryRun: true,
      networkCheckTimeout: 30000
    },
    mainnet: {
      provider: () => (
        new HDWalletProvider(MNEMONIC, `wss://mainnet.infura.io/ws/v3/${REACT_APP_INFURA_KEY}`)
      ),
      network_id: 1,
      gas: 700000,
      gasPrice: 40000000000,
      timeoutBlocks: 1000,
      confirmations: 2,
      skipDryRun: true,
      networkCheckTimeout: 30000
    }
  },

  mocha: {},
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',

  compilers: {
    solc: {
      version: '0.7.5',
      settings: {
       optimizer: {
         enabled: true,
         runs: 200
       },
      }
    }
  }
};
