import { config } from "../config";
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { coin } from "@cosmjs/launchpad";
import { convertDenomToMicroDenom } from "../utils/utils";

export const collectionConfig = async (client, address) => {
  if (!client) return;
  try {
    const result = await client.queryContractSmart(address, {
      get_config: {},
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const checkNativeCurrencyAndTokenBalances = async (
  balances,
  tokenAmountShouldPay
) => {
  if (
    balances[config.COIN_MINIMAL_DENOM] <= 0 ||
    (tokenAmountShouldPay > 0 && balances.cw20 <= tokenAmountShouldPay)
  ) {
    return false;
  }
  return true;
};

export const batchMint = async (
  signingClient,
  sender,
  collectionContract,
  uris,
  names,
  price,
  fmint
) => {
  if (!signingClient) return -1;
  try {
    let owners = [];
    for (let idx = 0; idx < uris.length; idx++) owners.push(sender);
    const extension = [];
    let result;
    names.map((name) => {
      extension.push({
        name,
      });
    });
    if (!fmint) {
      result = await signingClient.execute(
        sender,
        "core1vfl2wl0d0msllapvm3650p0d7vsn4cvr255gwmzuw096fv056d7steyqj7",
        {
          send_payment: {
            collection_addr: collectionContract,
            uri: uris,
            extension: extension,
            owner: owners,
          },
        },
        defaultFee,
        undefined,
        [coin(convertDenomToMicroDenom(price), config.COIN_MINIMAL_DENOM)]
      );
    } else {
      result = await signingClient.execute(
        sender,
        collectionContract,
        {
          batch_mint: {
            uri: uris,
            extension: extension,
            owner: owners,
          },
        },
        defaultFee
      );
    }
    return result.transactionHash;
  } catch (error) {
    throw error;
  }
};
