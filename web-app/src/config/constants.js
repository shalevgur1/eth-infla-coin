// -----------------------------------
// GLOBAL CONSTANTS
// -----------------------------------

import config from './config.json';

// Amount of tokens given by the faucet service to new accounts.
export const FAUCET_AMOUNT = config.FAUCET_AMOUNT;
// Contract address on the blockchain (need to be changed every new deployment)
export const INF_CONTRACT_ADDRESS = config.INF_CONTRACT_ADDRESS;
// Ganache blockchain interface network address
export const LOCAL_NETWORK = config.LOCAL_NETWORK;