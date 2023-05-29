import { assets, chains, ibc } from "chain-registry";

const assetList = assets.find(({ chain_name }) => chain_name === "coreum");
const chain = chains.find(({ chain_name }) => chain_name === "coreum");
console.log(chain);

export const chainName = "coreum";

const devnet = false;
export const config = {
  bunnyURL: "https://storage.bunnycdn.com/ ",
  ipfsGateway: "https://cloudflare-ipfs.com/ipfs/",
  socketUrl: "https://rize2day.com",
  baseUrl: "https://rize2day.com/api/",
  API_URL: "https://rize2day.com/",
  RPC_URL: devnet
    ? "https://rize2day.com/cosmwasm/"
    : "https://rize2day.com/cosmwasm/", //'https://rpc-test.coreum.hexskrt.net/',
  REST_URL: devnet
    ? "https://rize2day.com/cosmwasm-rest/"
    : // : "https://full-node.mainnet-1.coreum.dev:1317/",
      "https://rize2day.com/rest",
  DATA_LAYER: devnet ? "" : "",
  FAUCET_URL: "",
  CHAIN_ID: devnet ? "coreum-devnet-1" : "coreum-mainnet-1",
  CHAIN_NAME: devnet ? "Coreum Devnet 1" : "Coreum Mainnet",
  COIN_DENOM: devnet ? "DCORE" : "CORE",
  COIN_MINIMAL_DENOM: devnet ? "ducore" : "ucore",
  COIN_TYPE: devnet ? 990 : 990,
  COIN_DECIMALS: 6,
  COIN_GECKOID: devnet ? "coreum" : "coreum",
  PREFIX: devnet ? "devcore" : "core",
  AVG_GAS_STEP: 0.005,
  MAXIMUM_UPLOAD: 100,

  MARKETPLACE: devnet
    ? "devcore1xryveqc63z0l2q6h4a3h0c02ftscwdlm0f2elhngczgau9lefpmqzn69lq"
    : "core1f6jlx7d9y408tlzue7r2qcf79plp549n30yzqjajjud8vm7m4vds94pr8n",
  CW721_CONTRACT: "devcore...",
  CW721_OWNER: "devcore...",
  CW20_CONTRACT: devnet
    ? "devcore143gjvxqvea69v0hqp2p6wtz386hhgdn06uw7xntyhleahaunjkqs0jx6pc"
    : "core1qg5ega6dykkxc307y25pecuufrjkxkaggkkxh7nad0vhyhtuhw3slwumn4",
  COLLECTION_CODE_ID: devnet ? 42 : 31,
  CW721_CODE_ID: devnet ? 41 : 4,
  COINGECKO_URL: "https://api.coingecko.com/api/v3",
};

export const PINATA_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxYTY2NTdhMi1jYmYzLTQzOGEtODI4Yy02ZTg1Y2U3MzBiNmUiLCJlbWFpbCI6InN1cHBvcnRAcml6ZTJkYXkuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjFkZWUxYTYzMDAwMzA3NTUyYjEyIiwic2NvcGVkS2V5U2VjcmV0IjoiYzMwNjg5YjViM2U1MmM1MTFlYTc5ZGRkODdhNmExODJlNzUyMWY1ZTRmMTA5ZjU5OTMxMTg0Mzk3OGY0YmUwNiIsImlhdCI6MTY3ODI3NTIxN30.N4WqxO0FsBz_m-zsAlbVzN2ZoXktiTFisFHXtgyDw38";

export const chainConfig = {
  chainId: config.CHAIN_ID,
  chainName: config.CHAIN_NAME,
  rpc: config.RPC_URL,
  rest: config.REST_URL,
  stakeCurrency: {
    coinDenom: config.COIN_DENOM,
    coinMinimalDenom: config.COIN_MINIMAL_DENOM,
    coinDecimals: config.COIN_DECIMALS,
    coinGeckoId: config.COIN_GECKOID,
  },
  bip44: {
    coinType: config.COIN_TYPE,
  },
  bech32Config: {
    bech32PrefixAccAddr: `${config.PREFIX}`,
    bech32PrefixAccPub: `${config.PREFIX}pub`,
    bech32PrefixValAddr: `${config.PREFIX}valoper`,
    bech32PrefixValPub: `${config.PREFIX}valoperpub`,
    bech32PrefixConsAddr: `${config.PREFIX}valcons`,
    bech32PrefixConsPub: `${config.PREFIX}valconspub`,
  },
  currencies: [
    {
      coinDenom: config.COIN_DENOM,
      coinMinimalDenom: config.COIN_MINIMAL_DENOM,
      coinDecimals: config.COIN_DECIMALS,
      coinGeckoId: config.COIN_GECKOID,
    },
  ],
  feeCurrencies: [
    {
      coinDenom: config.COIN_DENOM,
      coinMinimalDenom: config.COIN_MINIMAL_DENOM,
      coinDecimals: config.COIN_DECIMALS,
      coinGeckoId: config.COIN_GECKOID,
      gasPriceStep: {
        low: 0.0625,
        average: 0.1,
        high: 62.5,
      },
      features: ["cosmwasm"],
    },
  ],
  gasPriceStep: {
    low: 0.0625,
    average: 0.1,
    high: 62.5,
  },
  features: ["cosmwasm"],
  coinType: config.COIN_TYPE,
  beta: true,
};

export const PLATFORM_NETWORKS = {
  COREUM: 1,
  ETHEREUM: 2,
  BSC: 3,
  POLYGON: 4,
  AVALANCHE: 5,
  NEAR: 6,
  XRPL: 7,
  COSMOS: 8,
  SOLANA: 9,
  HEDERA: 10,
  TEZOS: 11,
};

export const FILE_TYPE = {
  ALL: 0,
  IMAGE: 1,
  AUDIO: 2,
  VIDEO: 3,
  THREED: 4,
};

export const COREUM_PAYMENT_COINS = {
  CORE: 0,
  RIZE: 1,
};

export const CATEGORIES = [
  { value: 1, text: "Arts" },
  { value: 2, text: "Games" },
  { value: 3, text: "Sports" },
  { value: 4, text: "Audio" },
  { value: 5, text: "Video" },
  { value: 6, text: "3D NFTs" },
  { value: 7, text: "Photography" },
];

export const PROPERTY_TYPES = [
  { value: 1, text: "string" },
  { value: 2, text: "boolean" },
  { value: 3, text: "number" },
  { value: 4, text: "textarea" },
];

export const PROFILE_TABS = {
  COLLECTIBLES: 0,
  CREATED: 1,
  LIKED: 2,
  FOLLOWING: 3,
  FOLLOWERS: 4,
  COLLECTIONS: 5,
};

export const INFURA_KEY = "1b4c44fdf5a0404b91ee1a85db0aed9a";

export const ipfsUrl = "ipfs://";
export const platformContractAbi = require("./RizeNFTFactory.json");
export const nftContractAbi = require("./nftContract-abi.json");

export const EVM_MAINNETS_LIST = {
  [PLATFORM_NETWORKS.COREUM]: {
    name: "Coreum mainnet",
    id: 88888,
    currency: "CORE",
  },
  [PLATFORM_NETWORKS.ETHEREUM]: {
    name: "Ethereum Mainnet",
    id: 1,
    rpcURL: "https://rpc.ankr.com/eth",
    currency: "ETH",
    platformContractAddress: "0xc589c0f6e997f64D1710F1B8e2D7585a5Cc9b6c8",
    nftContractAddress: "0x5d3a24D949CaEcA51680A26B040F2a5Ed23A8772",
    blockScanUrl: "https://etherscan.io",
    gasPriceCandidate: {
      low: 25000000000,
      medium: 26000000000,
      high: 30000000000,
    },
  },
  [PLATFORM_NETWORKS.BSC]: {
    name: "BNB Smart Chain Mainnet",
    id: 56,
    rpcURL: "https://bsc-dataseed1.binance.org/",
    currency: "BNB",
    platformContractAddress: "0xc589c0f6e997f64D1710F1B8e2D7585a5Cc9b6c8",
    nftContractAddress: "0x5d3a24D949CaEcA51680A26B040F2a5Ed23A8772",
    blockScanUrl: "https://bscscan.com/",
    gasPriceCandidate: {
      low: 5000000000,
      medium: 5100000000,
      high: 5200000000,
    },
  },
  [PLATFORM_NETWORKS.POLYGON]: {
    name: "Polygon Mainnet",
    id: 137,
    rpcURL: "https://polygon-rpc.com/",
    currency: "MATIC",
    platformContractAddress: "0xc589c0f6e997f64D1710F1B8e2D7585a5Cc9b6c8",
    nftContractAddress: "0x5d3a24D949CaEcA51680A26B040F2a5Ed23A8772",
    blockScanUrl: "https://polygonscan.com/",
    gasPriceCandidate: {
      low: 70000000000,
      medium: 86000000000,
      high: 94000000000,
    },
  },
  [PLATFORM_NETWORKS.AVALANCHE]: {
    name: "Avalanche Network C-Chain",
    id: 43114,
    rpcURL: "https://avalanche-c-chain.publicnode.com",
    currency: "AVAX",
    platformContractAddress: "0xc589c0f6e997f64D1710F1B8e2D7585a5Cc9b6c8",
    nftContractAddress: "0x5d3a24D949CaEcA51680A26B040F2a5Ed23A8772",
    blockScanUrl: "https://snowtrace.io/",
    gasPriceCandidate: {
      low: 27000000000,
      medium: 28000000000,
      high: 29000000000,
    },
  },
};

export const EVM_TESTNETS_LIST = {
  [PLATFORM_NETWORKS.COREUM]: {
    name: "Coreum mainnet",
    id: 99999,
    currency: "CORE",
  },
  [PLATFORM_NETWORKS.ETHEREUM]: {
    name: "Arbitrum Goerli Testnet",
    id: 421613,
    rpcURL: "https://goerli-rollup.arbitrum.io/rpc",
    currency: "ETH",
    platformContractAddress: "0x4b5626425A62458aa1A5256c75bF678B5e90C2bA",
    nftContractAddress: "0xCA091f771124dF584620af06C43ddF49e0BB502D",
    blockScanUrl: "https://goerli.arbiscan.io/",
    gasPriceCandidate: {
      low: 25000000000,
      medium: 26000000000,
      high: 30000000000,
    },
  },
  [PLATFORM_NETWORKS.BSC]: {
    name: "Binance test network",
    id: 97,
    rpcURL: "https://data-seed-prebsc-1-s2.binance.org:8545/",
    currency: "tBNB",
    platformContractAddress: "0x80f164614Eaf18Ef7C26a0493fA5f7704fC28872",
    nftContractAddress: "0xE94D4b4B35D36a2312D0849F19a15206c0a60BF7",
    blockScanUrl: "https://testnet.bscscan.com/",
    gasPriceCandidate: {
      low: 5000000000,
      medium: 5100000000,
      high: 5200000000,
    },
  },
  [PLATFORM_NETWORKS.POLYGON]: {
    name: "Mumbai",
    id: 80001,
    rpcURL: "https://matic-mumbai.chainstacklabs.com",
    currency: "MATIC",
    platformContractAddress: "0xd74D56EF5d3FA684C82C02bBd0E23200698eB207",
    nftContractAddress: "0x49ce808C1F91910CCF9f570E23353e997AaEF6D2",
    blockScanUrl: "https://mumbai.polygonscan.com/",
    gasPriceCandidate: {
      low: 70000000000,
      medium: 86000000000,
      high: 94000000000,
    },
  },
  [PLATFORM_NETWORKS.AVALANCHE]: {
    name: "Avalanche Testnet",
    id: 43113,
    rpcURL: "https://api.avax-test.network/ext/bc/C/rpc",
    currency: "AVAX",
    platformContractAddress: "0x041B30E3AF9b2108f38aFCBa6d976d132B8D690C",
    nftContractAddress: "0x9d4EB3F30854cA4B46554313611F110E57104e9C",
    blockScanUrl: "https://testnet.snowtrace.io",
    gasPriceCandidate: {
      low: 27000000000,
      medium: 28000000000,
      high: 29000000000,
    },
  },
};

export const HOMMIS_COLLECTION = {
  address: "core1pk99xge6q94qtu3568x3qhp68zzv0mx7za4ct008ks36qhx5tvsse43urq",
  cw721address:
    "core1cduudfszcm9slm8qxlaqvnpzg2u0hkus94fe3pwt9x446dtw6eeqsht3jl",
  collectionNumber: 23,
  metaData: "",
  items: [],
  chainName: "coreum",
  networkSymbol: 1,
  isMemberCollection: false,
  jsonFolderCID: "QmcXpZF8uFvb3tA533n7UT6Qyt8ebzYRJFQaXW8irszvgZ",
  mintedCountOfCID: "0",
  totalItemNumberInCID: "1000",
  mintingPrice: "350",
  _id: "645a7501069be7750b397759",
  name: "Core Homies",
  logoURL: "a4ee88d4c581b0daaa9a77a0b206b9e5.png",
  bannerURL: "8833e210a506e1b9ab998cc62fb542e1.png",
  description:
    "Core Homies, the first NFT Project to mint on the Coreum Blockchain, is a new and innovative community driven NFT project and part of Blockchain Homies, a cross chain NFT project minting across four networks. ",
  terms: "",
  category: 1,
  price: 500,
  owner: "64581f1ed49db83d4031079f",
};

export const COMPENSATION_ARRAY = [
  "core1xle6485jdpazywlxpxxtq29396d2ckhxf70wwr",
  "core1nxvwy3cntrlmnh9l56v2hu5vw0yde88u9a7mk5",
  "core1dmxna33azqkefvlkfdyz2h2cztcpzwv0nmwyrp",
  "core1a74he4phcxnr5wp0pjyj094xlskggczdev5y6j",
  "core195ply22yw08edsk5342ajhz6gn6rn5s5667yu6",
];

export const DEFAULT_BULK_MINT_PREVIEW_IMAGE = "default.png";

export const IS_TEST = false;
export const ACTIVE_CHAINS = EVM_MAINNETS_LIST;

export const MAX_DISPLAY_NuMBER_OF_ARCH_SWIPER = 9;
export const PINATA_GATEWAY = "https://cloudflare-ipfs.com/ipfs/";
// "https://silver-rapid-shrimp-610.mypinata.cloud/ipfs/";
export const BACKEND_API_URL = "https://rize2day.com/api/";
export const MINTING_PRICE_LIST = {
  [PLATFORM_NETWORKS.COREUM]: {
    PRICE: 1,
    // TREASURY_WALLET: "core1utss0qnda5q2a0z9jzsnmvsnngw6yjerzgjjcq",
    TREASURY_WALLET: "core1xpda8kryemwvzfq2c046ukn86x3ltgm5yg98a0",
  },
  [PLATFORM_NETWORKS.ETHEREUM]: {
    price: 0.05,
    TREASURY_WALLET: "0x84361F0e0fC4B4eA94B137dB7EF69537a19aCb69",
  },
  [PLATFORM_NETWORKS.BSC]: {
    price: 0.1,
    TREASURY_WALLET: "0x84361F0e0fC4B4eA94B137dB7EF69537a19aCb69",
  },
  [PLATFORM_NETWORKS.POLYGON]: {
    price: 1,
    TREASURY_WALLET: "0x84361F0e0fC4B4eA94B137dB7EF69537a19aCb69",
  },
  [PLATFORM_NETWORKS.AVALANCHE]: {
    price: 1,
    TREASURY_WALLET: "0x84361F0e0fC4B4eA94B137dB7EF69537a19aCb69",
  },
};
export const MINTING_TREASURY_WALLET = "";
