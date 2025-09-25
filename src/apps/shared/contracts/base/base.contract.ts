import { ethers, providers, Signer } from "ethers";
import { Address, TransactionReceipt } from "viem";

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

  protected async callContract({
    functionName,
    functionParams,
    throwError = true,
    shouldReturnResultFirst = false,
  }: ICallContractParams): Promise<{
    txHash?: string;
    receipt?: TransactionReceipt;
    result?: any;
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
