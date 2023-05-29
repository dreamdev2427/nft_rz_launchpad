import { config } from "../config";
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { coin } from "@cosmjs/launchpad";
import { convertDenomToMicroDenom } from "./utils";

const defaultFee = {
  amount: [{ denom: "ucore", amount: "500" }],
  gas: "500000",
};

export const collectionConfig = async (
  client: CosmWasmClient,
  address: string
) => {
  if (!client || !address) {
    console.error("stargateClient undefined or address undefined.");
    return;
  }
  try {
    const result = await client.queryContractSmart(address, {
      get_config: {},
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const batchMint = async (
  signingClient: SigningCosmWasmClient,
  sender: string,
  collectionContract: string,
  uris: Array<string>,
  names: Array<string>,
  price: number,
  fmint: boolean
) => {
  if (!signingClient || !sender) {
    console.error("stargateClient undefined or address undefined.");
    return -1;
  }
  try {
    let owners = [];
    for (let idx = 0; idx < uris.length; idx++) owners.push(sender);
    const extension = [] as Array<any>;
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
