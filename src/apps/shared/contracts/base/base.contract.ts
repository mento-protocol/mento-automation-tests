import { ethers, providers, Signer } from "ethers";
import { Address, TransactionReceipt } from "viem";
import { newKit } from "@celo/contractkit";
import { AbiItem } from "web3-utils";

import { envHelper } from "@helpers/env/env.helper";
import { loggerHelper } from "@helpers/logger/logger.helper";

const log = loggerHelper.get("BaseContract");

export class BaseContract {
  private readonly provider: providers.Provider = null;
  private readonly signer: Signer = null;
  private readonly contractAddress: Address = null;
  private readonly contractAbi: string[] = null;

  private readonly rpcUrl = envHelper.getRpcUrl();
  private readonly privateKey = envHelper.getPrivateKey();

  constructor({ contractAddress, contractAbi }: IBaseContractContructorParams) {
    this.provider = new ethers.providers.JsonRpcProvider(this.rpcUrl);
    this.signer = new ethers.Wallet(this.privateKey, this.provider);
    this.contractAddress = contractAddress;
    this.contractAbi = contractAbi;
  }

  async getBalance({
    walletAddress,
    tokenAddress,
  }: IGetBalanceParams): Promise<number> {
    const kit = newKit(this.rpcUrl);
    const contract = new kit.web3.eth.Contract(
      this.getErc20Abi(),
      tokenAddress,
    );
    const [rawBalance, decimals] = await Promise.all([
      contract.methods.balanceOf(walletAddress).call(),
      contract.methods.decimals().call(),
    ]);
    const balance = rawBalance / 10 ** decimals;
    return balance;
  }

  protected async callContract({
    functionName,
    functionParams,
    throwError = true,
  }: ICallContractParams): Promise<{
    txHash: string;
    receipt: TransactionReceipt;
  }> {
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
      const tx = await contract[functionName](...functionParams, {
        gasLimit: 400000,
      });

      const receipt: TransactionReceipt = await tx.wait();

      if (!receipt.status || !receipt.transactionHash) {
        const errorMessage = `Contract call failed.\nTX Hash: ${receipt?.transactionHash}\nStatus: ${receipt?.status}\n`;
        log.error(errorMessage);
        if (throwError) throw new Error(errorMessage);
      }

      return { txHash: tx.hash, receipt };
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

  private getErc20Abi(): AbiItem[] {
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
  tokenAddress: Address;
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
}

interface IBaseContractContructorParams {
  contractAddress: Address;
  contractAbi: string[];
}
