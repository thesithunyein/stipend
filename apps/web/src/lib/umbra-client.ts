import {
  getUmbraClient,
  createSignerFromWalletAccount,
} from "@umbra-privacy/sdk";
import type { Wallet, WalletAccount } from "@wallet-standard/base";
import { NETWORK, RPC_URL, RPC_WS_URL, UMBRA_INDEXER } from "./constants";

export type UmbraClient = Awaited<ReturnType<typeof getUmbraClient>>;

export async function createUmbraClient(
  wallet: Wallet,
  account: WalletAccount
): Promise<UmbraClient> {
  const signer = createSignerFromWalletAccount(wallet, account);

  const client = await getUmbraClient({
    signer,
    network: NETWORK,
    rpcUrl: RPC_URL,
    rpcSubscriptionsUrl: RPC_WS_URL,
    indexerApiEndpoint: UMBRA_INDEXER,
  });

  return client;
}
