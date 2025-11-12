import { Address } from "viem";

/**
 * Sorted Oracles contract addresses and ABI
 * The Sorted Oracles contract maintains the median exchange rates for various currency pairs
 */
export const sortedOraclesAddresses = {
  mainnet: "0xefb84935239dacdecf7c5ba76d8de40b077b7b33" as Address,
  testnet: "0xfaa7Ca2B056E60F6733aE75AA0709140a6eAfD20" as Address,
} as const;

/**
 * Sorted Oracles ABI - includes functions for price reporting and retrieval
 */
export const sortedOraclesAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "rateFeedId",
        type: "address",
      },
    ],
    name: "medianRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "rateFeedId",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "lesserKey",
        type: "address",
      },
      {
        internalType: "address",
        name: "greaterKey",
        type: "address",
      },
    ],
    name: "report",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "rateFeedId",
        type: "address",
      },
    ],
    name: "numRates",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
