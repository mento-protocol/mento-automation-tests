import {
  Address,
  createPublicClient,
  createWalletClient,
  http,
  parseAbi,
} from "viem";

import { envHelper } from "@helpers/env/env.helper";
import { loggerHelper } from "@helpers/logger/logger.helper";
import { web3Helper } from "@helpers/web3/web3.helper";

/**
 * Helper class for interacting with Anvil fork
 * Provides utilities for manipulating blockchain state during tests
 */
export class ForkHelper {
  private readonly rpcUrl: string;
  private readonly log = loggerHelper.get("ForkHelper");

  constructor() {
    this.rpcUrl = envHelper.getRpcUrl();
  }

  /**
   * Transfer ERC20 tokens from an address to another address
   * @param tokenAddress - ERC20 token contract address
   * @param fromAddress - Address to transfer from
   * @param toAddress - Address to transfer to
   * @param rawAmount - Amount to transfer in wei
   */
  async transfer(
    tokenAddress: Address,
    fromAddress: Address,
    toAddress: Address,
    rawAmount: string | number,
  ): Promise<void> {
    const publicClient = createPublicClient({
      transport: http(this.rpcUrl),
    });
    const walletClient = createWalletClient({
      account: fromAddress,
      chain: null,
      transport: http(this.rpcUrl),
    });
    const amountInWei = web3Helper.toWei(rawAmount);

    await this.setCeloBalance(fromAddress, 100);
    await this.impersonateAccount(fromAddress);

    const hash = await walletClient.writeContract({
      address: tokenAddress,
      abi: parseAbi([
        "function transfer(address to, uint256 amount) returns (bool)",
      ]),
      functionName: "transfer",
      args: [toAddress, amountInWei],
      account: fromAddress,
      chain: null,
    });

    await publicClient.waitForTransactionReceipt({ hash });
    await this.stopImpersonatingAccount(fromAddress);
  }

  /**
   * Set CELO balance for an address
   * @param address - Address to fund
   * @param rawBalance - Balance in CELO
   */
  async setCeloBalance(
    address: Address,
    rawBalance: string | number,
  ): Promise<void> {
    const weiAmount = web3Helper.toWei(rawBalance);
    const hexAmount = web3Helper.toHex(weiAmount);

    await this.rpcCall("anvil_setBalance", [address, hexAmount]);
    await this.mine();
  }

  /**
   * Impersonate an account (allows sending transactions from any address)
   * @param address - Address to impersonate
   */
  async impersonateAccount(address: Address): Promise<void> {
    await this.rpcCall("anvil_impersonateAccount", [address]);
  }

  /**
   * Stop impersonating an account
   * @param address - Address to stop impersonating
   */
  async stopImpersonatingAccount(address: Address): Promise<void> {
    await this.rpcCall("anvil_stopImpersonatingAccount", [address]);
  }

  /**
   * Mine a single block
   */
  async mine(): Promise<void> {
    await this.rpcCall("evm_mine", []);
  }

  /**
   * Makes a JSON-RPC call to the Anvil fork
   */
  private async rpcCall(
    method: string,
    params: unknown[] = [],
  ): Promise<unknown> {
    if (!envHelper.isFork()) {
      return null;
    }

    const response = await fetch(this.rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method,
        params,
        id: Date.now(),
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`RPC Error: ${data.error.message}`);
    }

    return data.result;
  }
}

export const forkHelper = new ForkHelper();
