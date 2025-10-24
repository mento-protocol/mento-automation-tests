import { ethers, providers, Signer } from "ethers";
import { Address, TransactionReceipt } from "viem";
import { getTokenAddress, TokenSymbol } from "@mento-protocol/mento-sdk";

import { envHelper } from "@helpers/env/env.helper";
import { loggerHelper } from "@helpers/logger/logger.helper";

const log = loggerHelper.get("BaseContract");

export class BaseContract {
  private readonly provider: providers.Provider = null;
  private readonly signer: Signer = null;
  private readonly contractAddress: Address = null;
  private readonly contractAbi: unknown[] = null;

  private readonly rpcUrl = envHelper.getRpcUrl();
  private readonly privateKey = envHelper.getPrivateKey();

  constructor({ contractAddress, contractAbi }: IBaseContractContructorParams) {
    this.provider = new ethers.providers.JsonRpcProvider(this.rpcUrl);
    this.signer = new ethers.Wallet(this.privateKey, this.provider);
    this.contractAddress = contractAddress;
    this.contractAbi = contractAbi;
  }

  async getTokenAddress(tokenSymbol: TokenSymbol): Promise<Address> {
    try {
      const chainId = envHelper.getChainId();

      const tokenAddress = getTokenAddress(tokenSymbol, chainId);

      if (!tokenAddress) {
        const errorMessage = `Token address not found for ${tokenSymbol} on chain ${chainId}. The token might not be supported on this network.`;
        log.error(errorMessage);
        throw new Error(errorMessage);
      }

      return tokenAddress as Address;
    } catch (error) {
      log.error(`Failed to get token address from mento sdk: ${error.message}`);
      throw error;
    }
  }

  async getBalance({
    walletAddress,
    tokenSymbol,
  }: IGetBalanceParams): Promise<number> {
    const tokenAddress = await this.getTokenAddress(tokenSymbol);
    const contract = new ethers.Contract(
      tokenAddress,
      this.getErc20Abi(),
      this.provider,
    );

    try {
      const [rawBalance, decimals] = await Promise.all([
        contract.balanceOf(walletAddress),
        contract.decimals(),
      ]);
      const balance = Number(rawBalance) / 10 ** decimals;
      return balance;
    } catch (error) {
      log.warn(
        `Failed to get balance with decimals for ${tokenAddress}: ${error.message}`,
      );
      try {
        const defaultDecimals = 18;
        const rawBalance = await contract.balanceOf(walletAddress);
        const balance = Number(rawBalance) / 10 ** defaultDecimals;
        log.info(
          `Balance retrieved with default decimals: ${balance} ${tokenSymbol}`,
        );
        return balance;
      } catch (fallbackError) {
        const errorMessage = `Error in 'getBalance' method: ${fallbackError}\nError stack: ${fallbackError.stack}`;
        log.error(errorMessage);
        throw new Error(errorMessage);
      }
    }
  }

  protected async callContract({
    functionName,
    functionParams,
    throwError = true,
    shouldReturnResultFirst = false,
  }: ICallContractParams): Promise<{
    txHash?: string;
    receipt?: TransactionReceipt;
    result?: unknown;
  }> {
    let txOrResult = null;
    try {
      const contract = new ethers.Contract(
        this.contractAddress,
        this.contractAbi,
        this.signer,
      );
      // TODO: Uncomment this and put in gasLimit after the gas estimation is fixed
      // const estimatedGas = await this.estimateGas({
      //   functionName,
      //   functionParams,
      //   contract,
      // });

      txOrResult = await contract[functionName](...functionParams, {
        gasLimit: 400000,
      });

      if (shouldReturnResultFirst) {
        return { result: txOrResult };
      }

      const receipt: TransactionReceipt = await txOrResult.wait();

      if (!receipt.status || !receipt.transactionHash) {
        const errorMessage = `Contract call failed.\nTX Hash: ${receipt?.transactionHash}\nStatus: ${receipt?.status}\n`;
        log.error(errorMessage);
        if (throwError) throw new Error(errorMessage);
      }

      return { txHash: txOrResult.hash, receipt };
    } catch (error) {
      const errorMessage = `Error in 'callContract' method: ${error}\nError stack: ${error.stack}`;
      log.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  protected async estimateGas({
    functionName,
    functionParams,
    contract,
  }: IEstimateGasParams): Promise<string> {
    const estimatedGas = await this.provider.estimateGas({
      to: this.contractAddress,
      data: contract.interface.encodeFunctionData(functionName, functionParams),
    });
    return estimatedGas.toString();
  }

  private getErc20Abi() {
    return [
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [{ name: "", type: "uint8" }],
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [{ name: "", type: "string" }],
        type: "function",
      },
    ];
  }
}

export interface IGetBalanceParams {
  walletAddress: Address;
  tokenSymbol: TokenSymbol;
}

interface IEstimateGasParams {
  functionName: string;
  functionParams: unknown[];
  contract: ethers.Contract;
}

interface ICallContractParams {
  functionName: string;
  functionParams: unknown[];
  throwError?: boolean;
  shouldReturnResultFirst?: boolean;
}

interface IBaseContractContructorParams {
  contractAddress: Address;
  contractAbi: unknown[];
}
