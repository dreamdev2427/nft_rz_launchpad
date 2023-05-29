import Web3 from "web3";
import axios from "axios";
import { ACTIVE_CHAINS } from "../config";

import { PLATFORM_NETWORKS } from "../config";

export const changeNetwork = async (networkSymbol = 1) => {
  if (typeof window === "undefined") {
    return {
      success: false,
      message: "Window is not defined on this browser.",
    };
  }
  let defaultWeb3 = new Web3(ACTIVE_CHAINS[2].rpcURL || "");
  if (window && defaultWeb3 && window.ethereum) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          { chainId: defaultWeb3.utils.toHex(ACTIVE_CHAINS[networkSymbol].id) },
        ],
      });
      return {
        success: true,
        message: "switching succeed",
      };
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          if (window) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: defaultWeb3.utils.toHex(
                    ACTIVE_CHAINS[networkSymbol].id
                  ),
                  chainName: ACTIVE_CHAINS[networkSymbol].name,
                  rpcUrls: [ACTIVE_CHAINS[networkSymbol].rpcURL],
                },
              ],
            });

            return {
              success: true,
              message: "switching succeed",
            };
          }
        } catch (addError) {
          return {
            success: false,
            message: "Switching failed." + (addError.message || ""),
          };
        }
      } else {
        return {
          success: false,
          message: "Switching failed." + (switchError.message || ""),
        };
      }
    }
  } else {
    return {
      success: false,
      message: "Switching failed. Invalid web3",
    };
  }
};

export const signString = async (globalWeb3, data, networkSymbol = 1) => {
  var address = data;
  var msgHash = globalWeb3.utils.keccak256(data);
  var signedString = "";

  try {
    await globalWeb3.eth.personal.sign(
      globalWeb3.utils.toHex(msgHash),
      address,
      function (err, result) {
        if (err) {
          console.error(err);
          return {
            success: false,
            message: err,
          };
        }
        signedString = result;
      }
    );
    return {
      success: true,
      message: signedString,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message,
    };
  }
};

export const compareWalllet = (first, second) => {
  if (!first || !second) {
    return false;
  }
  if (first.toUpperCase() === second.toUpperCase()) {
    return true;
  }
  return false;
};

const parseErrorMsg = (errMsg) => {
  var returStr = "";
  let startPos = JSON.stringify(errMsg).search("message");
  if (startPos >= 0) {
    let subStr = errMsg.substring(startPos + 4, errMsg.length);
    let endPos = subStr.indexOf('"');
    if (endPos >= 0) {
      subStr = subStr.substring(0, endPos);
      returStr = subStr;
    }
  } else returStr = errMsg;
  return returStr;
};

export const isSupportedNetwork = (currentNetwork) => {
  if (
    currentNetwork === PLATFORM_NETWORKS.COREUM ||
    currentNetwork === PLATFORM_NETWORKS.ETHEREUM ||
    currentNetwork === PLATFORM_NETWORKS.BSC ||
    currentNetwork === PLATFORM_NETWORKS.AVALANCHE ||
    currentNetwork === PLATFORM_NETWORKS.POLYGON ||
    currentNetwork === PLATFORM_NETWORKS.NEAR
  ) {
    return true;
  } else return false;
};

export const isSuppportedEVMChain = (chainId) => {
  if (
    chainId === ACTIVE_CHAINS[PLATFORM_NETWORKS.ETHEREUM].id ||
    chainId === ACTIVE_CHAINS[PLATFORM_NETWORKS.BSC].id ||
    chainId === ACTIVE_CHAINS[PLATFORM_NETWORKS.AVALANCHE].id ||
    chainId === ACTIVE_CHAINS[PLATFORM_NETWORKS.POLYGON].id
  ) {
    return true;
  } else return false;
};

export const isSupportedEVMNetwork = (currentNetwork) => {
  if (
    currentNetwork === PLATFORM_NETWORKS.ETHEREUM ||
    currentNetwork === PLATFORM_NETWORKS.BSC ||
    currentNetwork === PLATFORM_NETWORKS.AVALANCHE ||
    currentNetwork === PLATFORM_NETWORKS.POLYGON
  ) {
    return true;
  } else return false;
};

export const getNetworkSymbolByChainId = (chainId) => {
  let keys = Object.keys(ACTIVE_CHAINS);
  return keys.find((item) => ACTIVE_CHAINS[item].id === chainId);
};

const getCurrentGasPrices = async (networkSymbol) => {
  try {
    let GAS_STATION = `https://api.debank.com/chain/gas_price_dict_v2?chain=`;
    if (networkSymbol === PLATFORM_NETWORKS.ETHEREUM) GAS_STATION += "eth";
    else if (networkSymbol === PLATFORM_NETWORKS.BSC) GAS_STATION += "bsc";
    else if (networkSymbol === PLATFORM_NETWORKS.POLYGON)
      GAS_STATION += "matic";
    else if (networkSymbol === PLATFORM_NETWORKS.AVALANCHE)
      GAS_STATION += "avax";
    var response = await axios.get(GAS_STATION);
    var prices = {
      low: Math.floor(response.data.data.slow.price),
      medium: Math.floor(response.data.data.normal.price),
      high: Math.floor(response.data.data.fast.price),
    };
    let log_str =
      "High: " +
      prices.high +
      "        medium: " +
      prices.medium +
      "        low: " +
      prices.low;
    return prices;
  } catch (error) {
    return ACTIVE_CHAINS[networkSymbol].gasPriceCandidate;
  }
};

export const payBulkMintingPriceWithNativeCurrency = (
  globalWeb3,
  currentAddr,
  treasuryAddr,
  amount,
  networkSymbol
) => {};
