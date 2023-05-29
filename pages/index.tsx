import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { Backdrop, CircularProgress } from "@mui/material";
import { Product, Dependency, WalletSection } from "../components";
import Gallery from "../components/Gallery";
import {
  ACTIVE_CHAINS,
  COMPENSATION_ARRAY,
  COREUM_PAYMENT_COINS,
  DEFAULT_BULK_MINT_PREVIEW_IMAGE,
  FILE_TYPE,
  HOMMIS_COLLECTION,
  MAX_DISPLAY_NuMBER_OF_ARCH_SWIPER,
  MINTING_PRICE_LIST,
  PINATA_GATEWAY,
  PLATFORM_NETWORKS,
  chainName,
  config,
} from "../config";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { TbBrandTwitter } from "react-icons/tb";
import { RxDiscordLogo } from "react-icons/rx";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { AiOutlineMinusCircle } from "react-icons/ai";
import coreNetworkLogo from "../public/images/icons/core.png";
import ethNetworkLogo from "../public/images/icons/eth.png";
import bscNetworkLogo from "../public/images/icons/bsc.png";
import polygonNetworkLogo from "../public/images/icons/polygon.png";
import avaxNetworkLogo from "../public/images/icons/avax.png";
import nearNetworkLogo from "../public/images/icons/near.png";
import xrpNetworkLogo from "../public/images/icons/xrp.png";
import cosmosNetworkLogo from "../public/images/icons/atom.png";
import solanaNetworkLogo from "../public/images/icons/solana.png";
import hederaNetworkLogo from "../public/images/icons/hedera.png";
import tezosNetworkLogo from "../public/images/icons/tezos.png";
import ModalUploadingFiles from "../components/UploadFilesModal";
import ModalUploadingWL from "../components/UploadWLModal";
import GifForSplash from "../public/images/Homie-Spinner.gif";
import Logo from "../components/Logo";
import ButtonPrimary from "../components/ButtonPrimary";
import NetworkLogo from "../components/NetworkLogo";
import RizeSwiper from "../components/RizeSwiper";
import BG_image from "../public/images/lines_bg.png";
import Web3 from "web3";
import Web3Modal from "web3modal";
import md5 from "md5";
import axios from "axios";
import { providerOptions } from "../config/providerOptions";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import {
  changeNetwork,
  isSupportedEVMNetwork,
  payBulkMintingPriceWithNativeCurrency,
} from "../utils/web3interact";
import { collectionConfig, batchMint } from "../utils/cosmwasm";
import { getFIleType } from "../components/RizeSwiper";
import { useChain, useWalletClient } from "@cosmos-kit/react";
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import BigNumber from "bignumber.js";
import { cosmos } from "juno-network";
import { ExtendedHttpEndpoint } from "@cosmos-kit/core";
import { Asset, AssetList } from "@chain-registry/types";
import { assets } from "chain-registry";

const socials = [
  { name: "Twitter", icon: <TbBrandTwitter color={"#33FF00"} />, href: "#" },
  { name: "Discord", icon: <RxDiscordLogo color={"#33FF00"} />, href: "#" },
];

const chainassets: AssetList = assets.find(
  (chain) => chain.chain_name === chainName
) as AssetList;

const coin: Asset = chainassets.assets.find(
  (asset) => asset.base === "core"
) as Asset;

export default function Home() {
  const router = useRouter();
  const [currentNetworkSymbol, setCurrentNetworkSymbol] = useState(
    PLATFORM_NETWORKS.COREUM
  );
  const [currentConsideringCollId, setCurrentConsideringCollId] = useState(
    HOMMIS_COLLECTION._id
  );
  const [currentUser, setCurrentUser] = useState(null);
  const [isCommunityMember, setIsCommunityMember] = useState(false);
  const [globalProvider, setGlobalProvider] = useState(null);
  const [isInMintingWL, setIsInMintingWL] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletStatus, setWalletStatus] = useState(false);
  const [publicMintDate, setPublicMintDate] = useState("5-1-23 12PM");
  const [newItemPrice, setNewItemPrice] = useState(0);
  const [isRizeMember, setIsRizeMember] = useState(false);
  const [showNetworkDropDown, setShowNetworkDropdown] = useState(false);
  const [showCosmosWalletsDropdown, setShowCosmosWalletsDropdown] =
    useState(false);
  const [consideringCollectionName, setConsideringCollectionName] =
    useState("");
  const [totalMintingPrice, setTotalMintingPrice] = useState(
    MINTING_PRICE_LIST[PLATFORM_NETWORKS.COREUM].PRICE
  );
  const [mintingCount, setMintingCount] = useState(1);
  const [totalMinted, setTotalMinted] = useState(0);
  const [MAX_COUNT, setMaxCount] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [collsOfCurrentNetwork, setCollsOfCurrentNetwork] = useState([]);
  const [selectedColl, setSelectedColl] = useState({
    ...HOMMIS_COLLECTION,
  });
  const [availableItemsForMint, setAvailableItemsForMint] = useState(
    Array<any>
  );
  const [myItemsOnConsideringColl, setMyItemsOnConsideringColl] = useState([]);

  const [working, setWorking] = useState(false);
  const [coreumPaymentCoin, setCoreumPaymentCoin] = useState(
    COREUM_PAYMENT_COINS.CORE
  );
  const [mintingIdxs, setMintingIdxs] = useState([]);
  const [showSplash, setShowSplash] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [freeMinted, setFreeMinted] = useState([0, 0, 0, 0]);
  const [showUploadingWLModal, setShowUploadingWLModal] = useState(false);
  const [showUploadingItemsModal, setShowUploadingItemsModal] = useState(false);
  const [detailedCollection, setDetailedCollection] = useState(null);
  const [web3Modal, setWeb3Modal] = useState(null);
  const [cosmo_getAccount, setCosmo_getAccount] = useState<
    string | undefined
  >();
  const [cosmos_signAmino, setCosmos_signAmino] = useState<
    string | undefined
  >();

  const { getSigningCosmWasmClient, address, status, getRpcEndpoint } =
    useChain(chainName);
  const [balance, setBalance] = useState(new BigNumber(0));
  const [isFetchingBalance, setFetchingBalance] = useState(false);
  const [resp, setResp] = useState("");
  const [client, setClient] = useState(null);
  const [signingClient, setSigningClient] = useState(null);

  const loadClient = async (rpc = "") => {
    try {
      const temp = await CosmWasmClient.connect(config.RPC_URL);
      setClient(temp as any);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, []);

  useEffect(() => {
    setTotalMintingPrice(
      Number(
        Number(
          mintingCount * ((detailedCollection as any)?.mintingPrice || 0)
        ).toFixed(2)
      )
    );
    refreshMintedItems();
  }, [detailedCollection]);

  useEffect(() => {
    setTimeout(() => {
      if (selectedColl._id.toString().length === 24) {
      } else {
        return;
      }
      axios
        .post(`${config.API_URL}api/collection/detail`, {
          id: selectedColl?._id || "",
        })
        .then(async (response) => {
          if (response.data.code === 0) {
            let updatedColl = response.data.data;
            setDetailedCollection(updatedColl);
          }
        })
        .catch((error) => {});
    }, 1000);
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && web3Modal === null) {
        const web3modl = new Web3Modal({
          network: "mainnet",
          cacheProvider: false,
          disableInjectedProvider: false,
          providerOptions,
        });
        setWeb3Modal(web3modl as any);
      }
      loadClient();
    } catch (error: any) {}
  }, []);

  useEffect(() => {
    let dateTimeStrInterval = setInterval(() => {
      let nowTime = new Date();
      let datetimestr = `${nowTime.getDate()}-${
        nowTime.getMonth() + 1
      }-${nowTime.getFullYear()} ${nowTime.getHours()}h GMT`;
      setPublicMintDate(datetimestr);
    }, 10000);
    return () => {
      if (dateTimeStrInterval) {
        try {
          clearInterval(dateTimeStrInterval);
        } catch (err) {}
      }
    };
  }, []);

  useEffect(() => {
    axios
      .post(`${config.API_URL}api/collection/getCollsOnANetwork`, {
        networkSymbol: currentNetworkSymbol,
      })
      .then((response) => {
        if (response.data.code === 0)
          setCollsOfCurrentNetwork(response.data.data);
      });
  }, [currentNetworkSymbol]);

  useEffect(() => {
    getSignclient();
  }, [address]);

  useEffect(() => {
    if (!isEmpty(walletAddress)) {
      setWalletStatus(true);
      Login();
    } else {
      setWalletStatus(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (!isEmpty(address || "")) {
      LoginWithCosmWallet();
    }
  }, [address]);

  useEffect(() => {
    if (selectedColl._id.toString().length === 24) {
    } else {
      return;
    }
    axios
      .post(`${config.API_URL}api/collection/detail`, {
        id: selectedColl?._id || "",
      })
      .then(async (response) => {
        if (response.data.code === 0) {
          let updatedColl = response.data.data;
          setDetailedCollection(updatedColl);
          setCurrentConsideringCollId(updatedColl?._id || null);
          setAvailableItemsForMint([]);
          setConsideringCollectionName(updatedColl?.name || "");
          //total item count of coll,
          let totalItemCount =
            Number(updatedColl?.items?.length || 0) +
            Number(updatedColl?.totalItemNumberInCID || 0) -
            Number(updatedColl?.mintedCountOfCID || 0);
          setTotalItems(totalItemCount);
          //total item count minted
          setTotalMinted(updatedColl?.items?.length || 0);
          setMaxCount(
            Number(updatedColl?.totalItemNumberInCID || 0) -
              Number(updatedColl?.mintedCountOfCID || 0)
          );
          let notMintedItems = [];

          let maxCount =
            Number(updatedColl?.totalItemNumberInCID || 0) -
            Number(updatedColl?.mintedCountOfCID || 0);
          if (maxCount > 9) maxCount = 9;
          for (let idx = 1; idx < maxCount + 1; idx++) {
            try {
              let url = `${PINATA_GATEWAY}${updatedColl.jsonFolderCID}/${
                Number(updatedColl.mintedCountOfCID) + Number(idx)
              }.json`;
              let item = await axios.get(url);
              notMintedItems.push(item.data);
            } catch (err) {
              continue;
            }
          }
          setAvailableItemsForMint(notMintedItems);
          refreshMintedItems();
        }
      })
      .catch((err) => {});
  }, [selectedColl]);

  const isSupportedNetwork = (currentNetwork: number) => {
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

  const isEmpty = (value: string) => {
    return (
      value === undefined ||
      value === null ||
      (typeof value === "object" && Object.keys(value).length === 0) ||
      (typeof value === "string" && value.trim().length === 0)
    );
  };

  const getShortAddress = (address: string) => {
    if (isEmpty(address)) return "";
    return (
      address.slice(0, 6) +
      "..." +
      address.slice(address.length - 4, address.length)
    );
  };

  const getSignclient = async () => {
    if (address) {
      try {
        let sicl = await getSigningCosmWasmClient();
        if (!sicl || !address) {
          console.error("stargateClient undefined or address undefined.");
          return;
        }
        setSigningClient(sicl as any);
        return sicl;
      } catch (error) {}
    }
  };

  const Login = () => {
    axios({
      method: "post",
      url: `${config.baseUrl}users/login`,
      data: { address: walletAddress, password: md5(walletAddress) },
    })
      .then(function (response: any) {
        if ((response as any).data.code === 0) {
          //set the token to sessionStroage
          const token = (response as any).data.token;
          localStorage.setItem("jwtToken", (response as any).data.token);
          const decoded = jwt_decode(token);
          setCurrentUser((decoded as any)._doc);

          router.push("/");
        }
      })
      .catch(function (error: any) {});
  };

  const LoginWithCosmWallet = () => {
    axios({
      method: "post",
      url: `${config.baseUrl}users/login`,
      data: { address: address || "", password: md5(walletAddress) },
    })
      .then(function (response: any) {
        if ((response as any).data.code === 0) {
          //set the token to sessionStroage
          const token = (response as any).data.token;
          localStorage.setItem("jwtToken", (response as any).data.token);
          const decoded = jwt_decode(token);
          setCurrentUser((decoded as any)._doc);

          router.push("/");
        }
      })
      .catch(function (error: any) {});
  };

  const onClickConnectEVMWallet = async () => {
    try {
      if (!web3Modal || web3Modal === null) return;
      const provider = await (web3Modal as any).connect();

      const web3 = new Web3(provider);

      const accounts = await web3.eth.getAccounts();

      setGlobalProvider(provider);

      if (accounts[0]) {
        setWalletAddress(accounts[0]);
        checkIsCommunityMember(accounts[0]);
      } else {
        setWalletAddress("");
        setIsCommunityMember(false);
      }
    } catch (error) {
      setWalletAddress("");
    }
  };

  const checkIsCommunityMember = (address: string) => {
    try {
      axios
        .post(`${config.baseUrl}users/isCommunityMember`, {
          wallet: address || "",
        })
        .then((response: any) => {
          let isM = (response as any).data.data || false;
          setIsCommunityMember(isM);
        });
      axios
        .post(`${config.baseUrl}users/isInMintingWL`, {
          wallet: address || "",
        })
        .then((response: any) => {
          let isM = (response as any).data.data || false;
          setIsCommunityMember(isM);
        });
    } catch (error) {
      setIsCommunityMember(false);
    }
  };

  const handleSelectNetwork = async (networkSymbol: number) => {
    let previousNetworkSymbol = currentNetworkSymbol;
    if (networkSymbol === PLATFORM_NETWORKS.COREUM) {
      // await connectToCoreum();
      setCurrentNetworkSymbol(PLATFORM_NETWORKS.COREUM);
    } else if (networkSymbol === PLATFORM_NETWORKS.NEAR) {
    } else {
      let switchingResult = await onClickChangeEVMNetwork(networkSymbol);

      if (
        switchingResult === false &&
        isSupportedNetwork(previousNetworkSymbol) === true
      ) {
        handleSelectNetwork(previousNetworkSymbol);
      }
      if (switchingResult === true) {
        onClickConnectEVMWallet();
      }
    }
    setShowNetworkDropdown(!showNetworkDropDown);
  };

  const onClickChangeEVMNetwork = async (networkSymbol: number) => {
    try {
      let switchingResult = false;
      let result = await changeNetwork(networkSymbol);
      if (result) {
        if (result.success === true) {
          setCurrentNetworkSymbol(networkSymbol);
          switchingResult = true;
        } else {
          toast.warn(
            "Please check your wallet. Try adding the chain to Wallet first."
          );
        }
      }
      return switchingResult;
    } catch (error) {
      return false;
    }
  };

  const handleApplyNewPrice = () => {
    if (
      !currentConsideringCollId ||
      currentConsideringCollId === null ||
      currentConsideringCollId === "" ||
      (
        typeof currentConsideringCollId === undefined &&
        currentConsideringCollId
      ).toString().length !== 24
    ) {
      toast.error("Please select a collection and try again.");
    } else {
      if (isInMintingWL === true) {
        if (newItemPrice <= 0) {
          toast.error("Please input valid price.");
          return;
        }
        //communicate with backend for new price
        let conId = currentConsideringCollId;
        axios
          .post(`${config.API_URL}api/collection/updateWithMintingPrice`, {
            collId: conId || "",
            mintingPrice: newItemPrice || 0,
          })
          .then((response: any) => {
            if ((response as any).data.code === 0) {
              toast.success("You've applied new minting price.");

              setTimeout(() => {
                axios
                  .post(`${config.API_URL}api/collection/detail`, {
                    id: conId || "",
                  })
                  .then((response1: any) => {
                    if ((response1 as any).data.code === 0) {
                      let updatedColl = (response1 as any).data.data;
                      setDetailedCollection(updatedColl);
                    }
                  })
                  .catch((err: any) => {});
                setDetailedCollection(conId);
              }, 200);
            } else toast.error("Failed in applying new minting price.");
          })
          .catch((error: any) => {
            toast.error("Failed in applying new minting price.");
          });
      } else {
        toast.error("You don't have right to mint.");
        return;
      }
    }
  };

  const handleMenuUpdateWL = () => {
    if (
      !currentConsideringCollId ||
      currentConsideringCollId === null ||
      currentConsideringCollId === "" ||
      ((currentConsideringCollId as string) || "").length !== 24
    ) {
      toast.error("Please select a collection and try again.");
    } else {
      if (isRizeMember === true) {
        setShowUploadingWLModal(true);
      } else {
        toast.error("You do not have right to update whitelist.");
        return;
      }
    }
  };

  const handleMenuUploadFiles = () => {
    if (
      !currentConsideringCollId ||
      currentConsideringCollId === null ||
      currentConsideringCollId === "" ||
      ((currentConsideringCollId as string) || "").toString().length !== 24
    ) {
      toast.error("Please select a collection and try again.");
    } else {
      if (isInMintingWL === true) {
        setShowUploadingItemsModal(true);
      } else {
        toast.error("You don't have right to mint.");
        return;
      }
    }
  };

  const handleClickApplyForMinting = async (newJsonFolderCID: string) => {
    if (showUploadingItemsModal) setShowUploadingItemsModal(false);
    if (
      mintingCount > 0 &&
      selectedColl &&
      selectedColl._id &&
      newJsonFolderCID &&
      currentUser &&
      (currentUser as any)?._id
    ) {
      if (selectedColl._id.toString().length === 24) {
      } else {
        return;
      }
      await axios
        .get(`${PINATA_GATEWAY}${newJsonFolderCID}`)
        .then((res) => {
          let fethedStr = res.data.toString();
          let itemCount = fethedStr.split("<tr>").length - 1;

          axios
            .post(`${config.API_URL}api/collection/updateWithJsonCID`, {
              collId: selectedColl?._id || "",
              jsonFolderCID: newJsonFolderCID || "",
              totalItemNumberInCID: itemCount,
            })
            .then((response) => {
              if (response.data.code === 0) {
                //fetch collection name ,

                setTimeout(() => {
                  if (selectedColl._id.toString().length === 24) {
                  } else {
                    return;
                  }
                  axios
                    .post(`${config.API_URL}api/collection/detail`, {
                      id: selectedColl?._id || "",
                    })
                    .then((response) => {
                      if (response.data.code === 0) {
                        let updatedColl = response.data.data;
                        setDetailedCollection(updatedColl);
                        setConsideringCollectionName(updatedColl?.name || "");
                        //total item count of coll,
                        let totalItemCount =
                          Number(updatedColl?.items?.length || 0) +
                          Number(updatedColl?.totalItemNumberInCID || 0) -
                          Number(updatedColl?.mintedCountOfCID || 0);
                        setTotalItems(totalItemCount);
                        setTotalMinted(updatedColl?.items?.length || 0);
                        setMaxCount(
                          Number(updatedColl?.totalItemNumberInCID || 0) -
                            Number(updatedColl?.mintedCountOfCID || 0)
                        );
                        setTimeout(() => {
                          refreshWithNotMintedItems();
                        }, 300);
                      }
                    })
                    .catch((error) => {});
                }, 100);
              }
            })
            .catch((error) => {});
        })
        .catch((error) => {});
    }
  };

  const refreshWithNotMintedItems = async () => {
    if (detailedCollection && MAX_COUNT > 0) {
      let fetchStartId = (detailedCollection as any)?.mintedCountOfCID || 0;
      let fetchCount =
        MAX_COUNT >= MAX_DISPLAY_NuMBER_OF_ARCH_SWIPER
          ? MAX_DISPLAY_NuMBER_OF_ARCH_SWIPER
          : MAX_COUNT;
      let notMintedItems = [];
      for (let idx = 1; idx < fetchCount + 1; idx++) {
        try {
          let url = `${PINATA_GATEWAY}${
            (detailedCollection as any).jsonFolderCID
          }/${Number(fetchStartId) + Number(idx)}.json`;
          let item = await axios.get(url);
          notMintedItems.push(item.data);
        } catch (err) {
          continue;
        }
      }
      setAvailableItemsForMint(notMintedItems);
      refreshMintedItems();
    }
  };

  const refreshMintedItems = () => {
    if (
      !detailedCollection ||
      !(detailedCollection as any)._id ||
      !(currentUser as any)?._id
    )
      return;

    if ((detailedCollection as any)._id.toString().length === 24) {
    } else {
      return;
    }
    axios
      .post(`${config.API_URL}api/item/getUserItemsOnAColl`, {
        collId: (detailedCollection as any)._id,
        userId: (currentUser as any)?._id || "",
      })
      .then((response) => {
        setMyItemsOnConsideringColl(response.data.data);
      })
      .catch((error) => {});
  };

  const handleClickMint = async () => {
    let fmint = false;
    let freeUser = false;

    for (let i = 0; i < COMPENSATION_ARRAY.length; i++) {
      if (COMPENSATION_ARRAY[i] === (currentUser as any)?.address) {
        freeUser = true;
        break;
      }
    }

    if (freeUser) {
      await axios
        .post(`${config.API_URL}api/users/getFreeMintStatus`, {
          addr: (currentUser as any)?.address || "",
        })
        .then((response) => {
          if (response.status === 200) {
            let status = response.data;
            if (mintingCount === status?.count && status?.freemint === false) {
              fmint = true;
            } else {
              toast.error(
                "You can only mint " + status?.count + "nfts for free now!"
              );
              return;
            }
          }
        })
        .catch((error) => {
          toast.error("You can only free mint");
          return;
        });
    }
    if (freeUser && !fmint) return;
    console.log(
      ">>>>>>>>>>>>>>> 00000 ",
      mintingCount,
      currentUser,
      selectedColl
    );
    //read mintingcount
    if (
      mintingCount > 0 &&
      currentUser &&
      (currentUser as any)._id &&
      selectedColl &&
      selectedColl._id
    ) {
      if (selectedColl._id.toString().length === 24) {
      } else {
        return;
      }
      console.log(">>>>>>>>>>>>>>> before setShowSplash");
      setShowSplash(true);
      setTimeout(async () => {
        setShowSplash(false);
        setWorking(true);
        if (currentNetworkSymbol === PLATFORM_NETWORKS.COREUM) {
        } else if (currentNetworkSymbol === PLATFORM_NETWORKS.ETHEREUM) {
          let payPrice = await payBulkMintingPriceWithNativeCurrency(
            new Web3(globalProvider),
            (currentUser as any)?.address,
            MINTING_PRICE_LIST[currentNetworkSymbol].TREASURY_WALLET,
            ((detailedCollection as any)?.mintingPrice || 0) * mintingCount,
            currentNetworkSymbol
          );
          if ((payPrice as any).success != true) {
            toast.error("Network error.");
            setWorking(false);
            return;
          }
        }
        console.log(">>>>>>>>>>>>>>> before getRandomIdsForBulkMint");
        axios
          .post(`${config.API_URL}api/collection/getRandomIdsForBulkMint`, {
            collId: selectedColl._id,
            mintingCount: mintingCount,
          })
          .then((response) => {
            console.log(
              ">>>>>>>>>>>>>>> setMintingIdxs = ",
              response.data.data
            );
            setMintingIdxs(response.data.data);
            let mintingIndexArray = response.data.data;
            if (mintingIndexArray.length > 0) {
              // read item infomations from pinata
              let notMintedItems = [] as Array<any>;
              let promisesForfetching = [] as Array<any>;
              let uris = [] as Array<any>;
              for (let idx = 0; idx < mintingIndexArray.length; idx++) {
                let url = `${PINATA_GATEWAY}${
                  (detailedCollection as any).jsonFolderCID
                }/${Number(mintingIndexArray[idx]) + Number(1)}.json`;
                uris.push(url);
                promisesForfetching.push(axios.get(url));
              }
              Promise.all(promisesForfetching)
                .then(async (responses) => {
                  for (let idx1 = 0; idx1 < responses.length; idx1++) {
                    notMintedItems.push(responses[idx1].data);
                  }
                  //read item(name, description, image, attibutes)s

                  const params = {
                    itemMusicURL: notMintedItems[0].image
                      .toString()
                      .replace("ipfs://", ""),
                    itemLogoURL:
                      getFIleType(notMintedItems[0].image) !== FILE_TYPE.IMAGE
                        ? DEFAULT_BULK_MINT_PREVIEW_IMAGE
                        : notMintedItems[0].image
                            .toString()
                            .replace("ipfs://", ""),
                    collectionId: selectedColl?._id || "",
                    creator: HOMMIS_COLLECTION.owner || "",
                    owner: currentUser?._id || "",
                    fileType: getFIleType(notMintedItems[0].image),
                    isSale: 0,
                    price: 0,
                    auctionPeriod: 0,
                    stockAmount: 1,
                    metaData: "",
                    timeLength: 0,
                    stockGroupId: new Date().getTime(),
                    chainId: currentNetworkSymbol || 1,
                    metadataURIs: uris,
                    networkSymbol: currentNetworkSymbol || 1,
                    coreumPaymentUnit: coreumPaymentCoin,
                  };
                  await saveMultipleItem(params, notMintedItems, fmint);

                  refreshWithNotMintedItems();

                  setWorking(false);
                })
                .catch((error) => {});
            } else {
              toast.warn("The collection hae no remained item for mintng.");
              return;
            }
          })
          .catch((error) => {});
      }, 5000);
    }
  };

  const getBalance = async () => {
    if (!address) {
      setBalance(new BigNumber(0));
      setFetchingBalance(false);
      return;
    }

    let rpcEndpoint = await getRpcEndpoint();

    if (!rpcEndpoint) {
      console.info("no rpc endpoint — using a fallback");
      rpcEndpoint = `https://rpc.cosmos.directory/${chainName}`;
    }

    // get RPC client
    const client = await cosmos.ClientFactory.createRPCQueryClient({
      rpcEndpoint:
        typeof rpcEndpoint === "string"
          ? rpcEndpoint
          : (rpcEndpoint as ExtendedHttpEndpoint).url,
    });

    // fetch balance
    const balance = await client.cosmos.bank.v1beta1.balance({
      address,
      denom: chainassets?.assets[0].base as string,
    });

    // Get the display exponent
    // we can get the exponent from chain registry asset denom_units
    const exp = coin.denom_units.find((unit) => unit.denom === coin.display)
      ?.exponent as number;

    // show balance in display values by exponentiating it
    const a = new BigNumber(balance.balance?.amount || 0);
    const amount = a.multipliedBy(10 ** -exp);
    setBalance(amount);
    setFetchingBalance(false);
  };

  const saveMultipleItem = async (
    params: any,
    sel_JsonFiles: Array<any>,
    fmint = false
  ) => {
    setWorking(true);
    const metas = [];
    let names = [] as Array<any>;
    let descriptions = [];
    let paths = [];
    for (let idx = 0; idx < sel_JsonFiles.length; idx++) {
      if (sel_JsonFiles.length > 0) {
        const metaList = [];
        names.push(sel_JsonFiles[idx].name);
        descriptions.push(sel_JsonFiles[idx].description);
        paths.push(sel_JsonFiles[idx].image.toString().replace("ipfs://", ""));
        const attributes = sel_JsonFiles[idx].attributes;
        for (let j = 0; j < attributes.length; j++) {
          const meta = {
            key: "",
            value: null,
          };
          const attribute = attributes[j];
          meta.key = attribute.trait_type;
          meta.value = attribute.value;
          metaList.push(meta);
        }
        metas.push(metaList);
      }
    }
    await axios
      .post(`${config.API_URL}api/item/bulkcreate522`, {
        params,
        names,
        descriptions,
        paths,
        metas,
      })
      .then(async function (response) {
        if (response.status === 200) {
          const IdArray = [...response.data];
          if (currentNetworkSymbol === PLATFORM_NETWORKS.COREUM) {
            let sicl = await getSigningCosmWasmClient();
            if (!sicl || !address) {
              console.error("stargateClient undefined or address undefined.");
              return;
            }
            var prices = [];
            for (let idx = 0; idx < IdArray.length; idx++) prices[idx] = 0;
            //do transaction
            try {
              let colllectionInfo = await collectionConfig(
                client as any,
                (selectedColl as any)?.address
              );
              console.log(
                ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  colllectionInfo ===> ",
                colllectionInfo
              );
              let startId = (colllectionInfo as any).unused_token_id;
              console.log(
                ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  params ===> ",
                sicl,
                (currentUser as any).address,
                selectedColl,
                (params as any).metadataURIs,
                names,
                ((detailedCollection as any)?.mintingPrice || 0) * mintingCount,
                fmint
              );
              let txHash = await batchMint(
                sicl as any,
                (currentUser as any).address,
                selectedColl.address,
                (params as any).metadataURIs,
                names,
                ((detailedCollection as any)?.mintingPrice || 0) * mintingCount,
                fmint
              );
              //succeed, then update all items with token ids
              if (txHash == -1) {
                toast.error("Network error.");
                axios
                  .post(`${config.API_URL}api/item/deleteManyByIds`, {
                    idArray: IdArray,
                    collId: (detailedCollection as any)?._id || "",
                  })
                  .then((response) => {})
                  .catch((error) => {});
                setWorking(false);
                return;
              } else {
                axios
                  .post(`${config.API_URL}api/item/updateTokenIds`, {
                    idArray: IdArray,
                    startTokenId: startId,
                  })
                  .then((response) => {
                    if (response.data.code === 0) {
                      toast.success("You've created NFTs sucessfully.");
                      axios
                        .post(
                          `${config.API_URL}api/collection/increaseMintedCount`,
                          {
                            collId: selectedColl._id,
                            addCount: mintingCount,
                            mintedIndexs: mintingIdxs,
                          }
                        )
                        .then((response) => {
                          setMintingIdxs([]);
                          setMintingCount(1);
                          setTimeout(() => {
                            axios
                              .post(`${config.API_URL}api/collection/detail`, {
                                id: selectedColl._id,
                              })
                              .then((response) => {
                                if (response.data.code === 0) {
                                  let updatedColl = response.data.data;

                                  setDetailedCollection(updatedColl);

                                  updateUI(updatedColl);
                                  axios
                                    .post(
                                      `${config.API_URL}api/users/setFreeMintStatus`,
                                      {
                                        addr: (currentUser as any)?.address,
                                        freemint: true,
                                      }
                                    )
                                    .then((response) => {})
                                    .catch((error) => {});
                                }
                              })
                              .catch((err) => {});
                          }, 200);
                        })
                        .catch((err) => {});
                      router.push("/page-author/" + (currentUser as any)?._id);
                    }
                  })
                  .catch((error) => {
                    toast.error("Server side error.");
                  });
              }
            } catch (error) {
              toast.error((error && (error as any).message) || "");
              //if tx fail, then delete all items on DB
              axios
                .post(`${config.API_URL}api/item/deleteManyByIds`, {
                  idArray: IdArray,
                  collId: (detailedCollection as any)?._id || "",
                })
                .then((response) => {})
                .catch((error1) => {});
              setWorking(false);
              return;
            }
          } else if (isSupportedEVMNetwork(currentNetworkSymbol) === true) {
            if (isSupportedEVMNetwork(currentNetworkSymbol)) {
              toast.success("You've created NFTs sucessfully.");

              axios
                .post(`${config.API_URL}api/collection/increaseMintedCount`, {
                  collId: selectedColl._id,
                  addCount: mintingCount,
                  mintedIndexs: mintingIdxs,
                })
                .then((response) => {
                  setMintingIdxs([]);
                  setMintingCount(1);
                  setTimeout(() => {
                    axios
                      .post(`${config.API_URL}api/collection/detail`, {
                        id: selectedColl._id,
                      })
                      .then((response) => {
                        if (response.data.code === 0) {
                          let updatedColl = response.data.data;

                          setDetailedCollection(updatedColl);
                          updatedColl(updatedColl);
                        }
                      })
                      .catch((err) => {});
                  }, 200);
                })
                .catch((err) => {});
            }
            router.push("/page-author/" + (currentUser as any)?._id);
          }
          setWorking(false);
        } else {
          setWorking(false);
          toast.error("Failed in multiple items uploading");
        }
      })
      .catch(function (error) {
        console.log("multiple uploadin error : ", error);
        setWorking(false);
        toast.error("Failed in multiple items uploading");
      });
  };

  const updateUI = async (colelctionInfo: any) => {
    let totalItemCount =
      Number(colelctionInfo?.items?.length || 0) +
      Number(colelctionInfo?.totalItemNumberInCID || 0) -
      Number(colelctionInfo?.mintedCountOfCID || 0);
    setTotalItems(totalItemCount);
    //total item count minted
    setTotalMinted(colelctionInfo?.items?.length || 0);
    setMaxCount(
      Number(colelctionInfo?.totalItemNumberInCID || 0) -
        Number(colelctionInfo?.mintedCountOfCID || 0)
    );
    let notMintedItems = [];
    let maxCount =
      Number(colelctionInfo?.totalItemNumberInCID || 0) -
      Number(colelctionInfo?.mintedCountOfCID || 0);
    if (maxCount > 9) maxCount = 9;
    for (let idx = 1; idx < maxCount + 1; idx++) {
      try {
        let url = `${PINATA_GATEWAY}${colelctionInfo.jsonFolderCID}/${
          Number(colelctionInfo.mintedCountOfCID) + Number(idx)
        }.json`;
        let item = await axios.get(url);
        notMintedItems.push(item.data);
      } catch (err) {
        continue;
      }
    }
    setAvailableItemsForMint(notMintedItems);
    refreshMintedItems();
  };

  const handleClickMax = () => {
    setMintingCount(MAX_COUNT);
    setTotalMintingPrice(
      Number(
        Number(
          MAX_COUNT * ((detailedCollection as any)?.mintingPrice || 0)
        ).toFixed(2)
      )
    );
  };

  const handleClickPlus = () => {
    if (mintingCount < MAX_COUNT) {
      let newCount = mintingCount + 1;
      setMintingCount(newCount);
      setTotalMintingPrice(
        Number(
          Number(
            newCount * ((detailedCollection as any)?.mintingPrice || 0)
          ).toFixed(2)
        )
      );
    }
  };

  const handleClickMinus = () => {
    if (mintingCount > 1) {
      let newCount = mintingCount - 1;
      setMintingCount(newCount);
      setTotalMintingPrice(
        Number(
          Number(
            newCount * ((detailedCollection as any)?.mintingPrice || 0)
          ).toFixed(2)
        )
      );
    }
  };

  return (
    <div className="lg:mx-auto">
      <div className="absolute z-10 bg-[#000000] w-full min-h-[80px] text-white flex items-center justify-between">
        <Logo className="w-[120px] ml-10" />
        <div className="flex items-center">
          {isInMintingWL === true && (
            <div className="ml-10 flex items-center gap-2">
              <div className="relative dropdown">
                <div className={`dropbtn p-2`}>
                  <div className="group py-3 px-6 h-[50px] rounded-full inline-flex items-center text-sm font-medium hover:text-opacity-100 relative !outline-none">
                    <div className="flex justify-center items-center py-3 px-5 bg-[#33ff00] rounded-xl">
                      <span className=" text-neutral-900 text-sm ml-2">
                        Creators Options
                      </span>
                    </div>
                  </div>
                </div>
                <div className="dropdown-content">
                  <div className="overflow-hidden rounded-2xl shadow-lg ring-1 bg-gray-400 border-[1px] border-[#33ff00] text-black w-[180px]">
                    <div className="relative grid  px-2 py-2 w-full">
                      <div
                        className="py-2 px-2 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-500  flex gap-2 items-center group w-full"
                        onClick={() => handleMenuUploadFiles()}
                      >
                        <span className="group-hover:text-white text-neutral-900 text-sm">
                          Upload folders
                        </span>
                      </div>
                      {isRizeMember === true && (
                        <div
                          className="py-2 px-2 mt-1  transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-500  flex gap-2 items-center group w-full"
                          onClick={() => handleMenuUpdateWL()}
                        >
                          <span className="group-hover:text-white text-neutral-900 text-sm">
                            Update Whitelist
                          </span>
                        </div>
                      )}
                      <div className="mt-3 h-8"></div>
                      <div className=" px-2 mt-1 w-full ">
                        <span className=" text-neutral-900 text-sm w-full text-center">
                          Create mint price
                        </span>
                      </div>
                      <div className=" px-2 mt-1 w-full flex ">
                        <input
                          className=" text-[#33ff00] text-sm w-1/2  p-1 bg-gray-500 rounded-lg text-center"
                          type="number"
                          min={0}
                          max={1000}
                          defaultValue={1}
                          value={newItemPrice}
                          onChange={(e) =>
                            setNewItemPrice(Number(e.target.value))
                          }
                        />
                        <span className=" text-[#33ff00] text-sm w-1/2 ml-1 p-1 bg-gray-500 rounded-lg text-center">
                          {ACTIVE_CHAINS[currentNetworkSymbol]?.currency}
                        </span>
                      </div>
                      <div className="mt-1 px-2 w-full flex ">
                        <button
                          className="w-full text-neutral-900 text-sm bg-gray-300 hover:bg-gray-600 hover:text-white py-1 rounded-lg"
                          onClick={() => handleApplyNewPrice()}
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center mt-1 items-center w-full absolute z-2">
          <div className=" text-lg text-[#33ff00] p-1 text-center rounded-lg">
            {" "}
            {!isMobile ? `Public Mint Date ${publicMintDate}` : <></>}
          </div>
        </div>
        <div className="flex items-center mr-10 ">
          <div className="relative dropdown group">
            <div
              className="dropbtn p-2"
              onClick={() => setShowNetworkDropdown(!showNetworkDropDown)}
            >
              <div className="group py-3 px-6 h-[50px] hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full inline-flex items-center text-sm font-medium hover:text-opacity-100 relative !outline-none">
                {isSupportedNetwork(currentNetworkSymbol) === false && "Chains"}
                {currentNetworkSymbol === PLATFORM_NETWORKS.COREUM && (
                  <div className="flex justify-center items-center">
                    <Image
                      src={coreNetworkLogo}
                      width={25}
                      height={25}
                      alt=""
                    ></Image>
                    <span className="dark:text-white text-neutral-900 text-sm ml-2">
                      Coreum
                    </span>
                  </div>
                )}
                {currentNetworkSymbol === PLATFORM_NETWORKS.ETHEREUM && (
                  <div className="flex justify-center items-center">
                    <Image
                      src={ethNetworkLogo}
                      width={25}
                      height={25}
                      alt=""
                    ></Image>
                    <span className="dark:text-white text-neutral-900 text-sm ml-2">
                      Ethereum
                    </span>
                  </div>
                )}
                {currentNetworkSymbol === PLATFORM_NETWORKS.BSC && (
                  <div className="flex justify-center items-center">
                    <Image
                      src={bscNetworkLogo}
                      width={25}
                      height={25}
                      alt=""
                    ></Image>
                    <span className="dark:text-white text-neutral-900 text-sm ml-2">
                      BSC
                    </span>
                  </div>
                )}
                {currentNetworkSymbol === PLATFORM_NETWORKS.POLYGON && (
                  <div className="flex justify-center items-center">
                    <Image
                      src={polygonNetworkLogo}
                      width={25}
                      height={25}
                      alt=""
                    ></Image>
                    <span className="dark:text-white text-neutral-900 text-sm ml-2">
                      Polygon
                    </span>
                  </div>
                )}
                {currentNetworkSymbol === PLATFORM_NETWORKS.AVALANCHE && (
                  <div className="flex justify-center items-center">
                    <Image
                      src={avaxNetworkLogo}
                      width={25}
                      height={25}
                      alt=""
                    ></Image>
                    <span className="dark:text-white text-neutral-900 text-sm ml-2">
                      Avalanche
                    </span>
                  </div>
                )}
                {currentNetworkSymbol === PLATFORM_NETWORKS.NEAR && (
                  <div className="flex justify-center items-center">
                    <Image
                      src={nearNetworkLogo}
                      width={25}
                      height={25}
                      alt=""
                    ></Image>
                    <span className="dark:text-white text-neutral-900 text-sm ml-2">
                      Near
                    </span>
                  </div>
                )}
                {currentNetworkSymbol === PLATFORM_NETWORKS.XRPL && (
                  <div className="flex justify-center items-center">
                    <Image
                      src={xrpNetworkLogo}
                      width={25}
                      height={25}
                      alt=""
                    ></Image>
                    <span className="dark:text-white text-neutral-900 text-sm ml-2">
                      XRPL
                    </span>
                  </div>
                )}
                {currentNetworkSymbol === PLATFORM_NETWORKS.COSMOS && (
                  <div className="flex justify-center items-center">
                    <Image
                      src={cosmosNetworkLogo}
                      width={25}
                      height={25}
                      alt=""
                    ></Image>
                    <span className="dark:text-white text-neutral-900 text-sm ml-2">
                      Cosmos
                    </span>
                  </div>
                )}
                {currentNetworkSymbol === PLATFORM_NETWORKS.SOLANA && (
                  <div className="flex justify-center items-center">
                    <Image
                      src={solanaNetworkLogo}
                      width={25}
                      height={25}
                      alt=""
                    ></Image>
                    <span className="dark:text-white text-neutral-900 text-sm ml-2">
                      Solana
                    </span>
                  </div>
                )}
                {currentNetworkSymbol === PLATFORM_NETWORKS.HEDERA && (
                  <div className="flex justify-center items-center">
                    <Image
                      src={hederaNetworkLogo}
                      width={25}
                      height={25}
                      alt=""
                    ></Image>
                    <span className="dark:text-white text-neutral-900 text-sm ml-2">
                      Hedera
                    </span>
                  </div>
                )}
                {currentNetworkSymbol === PLATFORM_NETWORKS.TEZOS && (
                  <div className="flex justify-center items-center">
                    <Image
                      src={tezosNetworkLogo}
                      width={25}
                      height={25}
                      alt=""
                    ></Image>
                    <span className="dark:text-white text-neutral-900 text-sm ml-2">
                      Tezos
                    </span>
                  </div>
                )}
              </div>
            </div>
            {showNetworkDropDown === true && (
              <div className="absolute z-30 dropdown-content ">
                <div className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative grid bg-white dark:bg-neutral-800 px-2 py-2 ">
                    <div
                      className="py-2 px-2 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 flex gap-2 items-center"
                      onClick={() =>
                        handleSelectNetwork(PLATFORM_NETWORKS.COREUM)
                      }
                    >
                      <Image
                        src={coreNetworkLogo}
                        width={25}
                        height={25}
                        alt=""
                      ></Image>
                      <span className="dark:text-white text-neutral-900 text-sm">
                        Coreum
                      </span>
                    </div>
                    <div
                      className="py-2 px-2 transition cursor-pointer duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 flex gap-2 items-center"
                      onClick={() =>
                        handleSelectNetwork(PLATFORM_NETWORKS.ETHEREUM)
                      }
                    >
                      <Image
                        src={ethNetworkLogo}
                        width={25}
                        height={25}
                        alt=""
                      ></Image>
                      <span className="dark:text-white text-neutral-900 text-sm">
                        Ethereum
                      </span>
                    </div>
                    <div
                      className="hover:bg-neutral-100 dark:hover:bg-neutral-700 py-2 px-2 transition cursor-pointer duration-150 ease-in-out rounded-lg flex gap-2 items-center"
                      onClick={() => handleSelectNetwork(PLATFORM_NETWORKS.BSC)}
                    >
                      <Image
                        src={bscNetworkLogo}
                        width={25}
                        height={25}
                        alt=""
                      ></Image>
                      <span className="dark:text-white text-neutral-900 text-sm">
                        BSC
                      </span>
                    </div>
                    <div
                      className="hover:bg-neutral-100 dark:hover:bg-neutral-700 py-2 px-2 transition cursor-pointer duration-150 ease-in-out rounded-lg flex gap-2 items-center"
                      onClick={() =>
                        handleSelectNetwork(PLATFORM_NETWORKS.POLYGON)
                      }
                    >
                      <Image
                        src={polygonNetworkLogo}
                        width={25}
                        height={25}
                        alt=""
                      ></Image>
                      <span className="dark:text-white text-neutral-900 text-sm">
                        Polygon
                      </span>
                    </div>
                    <div
                      className="hover:bg-neutral-100 dark:hover:bg-neutral-700 py-2 px-2 transition cursor-pointer duration-150 ease-in-out rounded-lg flex gap-2 items-center"
                      onClick={() =>
                        handleSelectNetwork(PLATFORM_NETWORKS.AVALANCHE)
                      }
                    >
                      <Image
                        src={avaxNetworkLogo}
                        width={25}
                        height={25}
                        alt=""
                      ></Image>
                      <span className="dark:text-white text-neutral-900 text-sm">
                        Avalanche
                      </span>
                    </div>
                    <div
                      className="hover:bg-neutral-100 dark:hover:bg-neutral-700 py-2 px-2 transition cursor-pointer duration-150 ease-in-out rounded-lg flex gap-2 items-center"
                      onClick={() =>
                        handleSelectNetwork(PLATFORM_NETWORKS.NEAR)
                      }
                    >
                      <Image
                        src={nearNetworkLogo}
                        width={25}
                        height={25}
                        alt=""
                      ></Image>
                      <span className="dark:text-white text-neutral-900 text-sm">
                        Near
                      </span>
                    </div>
                    <div
                      className="hover:bg-neutral-100 dark:hover:bg-neutral-700 py-2 px-2 transition cursor-pointer duration-150 ease-in-out rounded-lg flex gap-2 items-center"
                      onClick={() =>
                        handleSelectNetwork(PLATFORM_NETWORKS.NEAR)
                      }
                    >
                      <Image
                        src={xrpNetworkLogo}
                        width={25}
                        height={25}
                        alt=""
                      ></Image>
                      <span className="dark:text-white text-neutral-900 text-sm">
                        XRPL
                      </span>
                    </div>
                    <div
                      className="hover:bg-neutral-100 dark:hover:bg-neutral-700 py-2 px-2 transition cursor-pointer duration-150 ease-in-out rounded-lg flex gap-2 items-center"
                      onClick={() =>
                        handleSelectNetwork(PLATFORM_NETWORKS.NEAR)
                      }
                    >
                      <Image
                        src={cosmosNetworkLogo}
                        width={25}
                        height={25}
                        alt=""
                      ></Image>
                      <span className="dark:text-white text-neutral-900 text-sm">
                        Cosmos
                      </span>
                    </div>
                    <div
                      className="hover:bg-neutral-100 dark:hover:bg-neutral-700 py-2 px-2 transition cursor-pointer duration-150 ease-in-out rounded-lg flex gap-2 items-center"
                      onClick={() =>
                        handleSelectNetwork(PLATFORM_NETWORKS.NEAR)
                      }
                    >
                      <Image
                        src={solanaNetworkLogo}
                        width={25}
                        height={25}
                        alt=""
                      ></Image>
                      <span className="dark:text-white text-neutral-900 text-sm">
                        Solana
                      </span>
                    </div>
                    <div
                      className="hover:bg-neutral-100 dark:hover:bg-neutral-700 py-2 px-2 transition cursor-pointer duration-150 ease-in-out rounded-lg flex gap-2 items-center"
                      onClick={() =>
                        handleSelectNetwork(PLATFORM_NETWORKS.NEAR)
                      }
                    >
                      <Image
                        src={hederaNetworkLogo}
                        width={25}
                        height={25}
                        alt=""
                      ></Image>
                      <span className="dark:text-white text-neutral-900 text-sm">
                        Hedera
                      </span>
                    </div>
                    <div
                      className="hover:bg-neutral-100 dark:hover:bg-neutral-700 py-2 px-2 transition cursor-pointer duration-150 ease-in-out rounded-lg flex gap-2 items-center"
                      onClick={() =>
                        handleSelectNetwork(PLATFORM_NETWORKS.NEAR)
                      }
                    >
                      <Image
                        src={tezosNetworkLogo}
                        width={25}
                        height={25}
                        alt=""
                      ></Image>
                      <span className="dark:text-white text-neutral-900 text-sm">
                        Tezos
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="relative dropdown group">
            {currentNetworkSymbol === PLATFORM_NETWORKS.COREUM ? (
              <WalletSection />
            ) : (
              <ButtonPrimary
                className=" sm:px-5 my-2 py-3 px-6 h-[50px]  rounded-full "
                onClick={() => onClickConnectEVMWallet()}
              >
                {isEmpty(walletAddress) === false && walletStatus === true ? (
                  <span className="pl-2">{getShortAddress(walletAddress)}</span>
                ) : (
                  <span className="pl-2">Connect Wallet</span>
                )}
              </ButtonPrimary>
            )}
          </div>
        </div>
      </div>
      {/* <WalletSection /> */}
      <div className="relative bg-[#161616] text-white min-h-[100vh] w-full  z-2 overflow-hidden pb-10 ">
        <div className="relative bg-[#161616] text-white min-h-[100vh] w-full  z-2 overflow-hidden pb-10 ">
          <div
            className="absolute bg-[#33ff00] opacity-30 blur-[100px] w-[300px] h-[300px] rounded-full -top-[100px]
        -left-[100px] z-1"
          ></div>
          <div
            className="absolute bg-[#33ff00] opacity-30 blur-[100px] w-[300px] h-[300px] rounded-full -bottom-[100px]
        -right-[100px] z-1"
          ></div>
          <div className="absolute w-[100vw] min-h-[100vh] z-0 opacity-5 select-none ">
            <Image src={BG_image} alt="" width={1920} height={2160} />
          </div>
          <div className="flex flex-col justify-center items-center w-full">
            <div
              className={`flex flex-col items-center border-[#33ff00] border-2  w-8/12 rounded-lg 
            mt-[100px] justify-center
          `}
            >
              <img
                src={`${config.API_URL}uploads/${selectedColl?.bannerURL}`}
                className="w-full h-full"
                alt=""
              />
            </div>
          </div>
          {!isMobile ? (
            <>
              <div className="flex flex-col w-1/2 bg-[#ffffff25] min-h-[500px] rounded-lg ml-auto mr-auto m-10 ">
                <div className="flex justify-center">
                  <div className="w-9/12 bg-[#101010] border-2 border-[#33ff00] text-lg text-bold text-[#33ff00] p-1 px-5 text-center mt-5 rounded-lg flex justify-between">
                    <div>{consideringCollectionName}</div>
                    <div>
                      {totalMinted}/{totalItems}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mt-5 ">
                  <div
                    className="col-lg-6 rize-what-we-are-left f-end mb-4 mb-sm-0 order-1 order-sm-2 d-flex "
                    style={{ justifyContent: "space-between" }}
                  >
                    <RizeSwiper
                      className="bg-transparent  w-2/3 rounded-lg z-5"
                      items={availableItemsForMint}
                    />
                  </div>
                </div>
                <div className="flex w-full justify-center mt-20 gap-3">
                  <div className="w-[31%]  bg-[#101010] border-2 border-[#33ff00] text-md text-[#33ff00] p-1 text-center rounded-lg flex items-center justify-center">
                    Cost
                  </div>
                  <div className="w-5/12 flex justify-between bg-[#101010] border-2 border-[#33ff00] text-md text-[#33ff00] p-1 text-center rounded-lg  items-center">
                    <input
                      className="ml-7 w-8 text-white text-center border-none bg-transparent "
                      value={totalMintingPrice}
                      disabled={true}
                    ></input>
                    <NetworkLogo
                      networkSymbol={
                        currentNetworkSymbol || PLATFORM_NETWORKS.COREUM
                      }
                      className=""
                    />
                  </div>
                </div>
                <div className="flex w-full justify-center mt-5 gap-3 relative ">
                  <div className="w-[31%]  bg-[#101010] border-2 border-[#33ff00] text-sm text-[#33ff00] p-1 text-center rounded-lg flex items-center justify-center">
                    {`${mintingCount} of  NFT(s)`}
                  </div>
                  <div className="w-5/12 flex justify-between bg-[#101010] border-2 border-[#33ff00] text-md text-[#33ff00] p-1 text-center rounded-lg items-center relative">
                    <div className="flex justify-between w-full cursor-pointer absolute z-10">
                      <div className=" flex">
                        <AiOutlineMinusCircle
                          className="w-6 h-6 ml-1 cursor-pointer select-none "
                          onClick={() => handleClickMinus()}
                        />
                        <input
                          className="w-8 text-white text-center border-none bg-transparent "
                          value={mintingCount}
                          disabled={true}
                        ></input>
                        <AiOutlinePlusCircle
                          className="w-6 h-6 ml-1  cursor-pointer select-none "
                          onClick={() => handleClickPlus()}
                        />
                      </div>
                      <div
                        className="max-h-[30px] p-0  cursor-pointer select-none mr-2 border-[#33ff00] border-2 bg-[#33ff00] text-white rounded-md px-1"
                        onClick={() => handleClickMax()}
                      >
                        Max
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 pb-5 relative flex justify-center">
                  <ButtonPrimary
                    className="w-9/12 absolute z-1205 "
                    onClick={() => handleClickMint()}
                  >
                    Mint
                  </ButtonPrimary>
                </div>
              </div>
              <div className="flex flex-col p-2"></div>
              <div className="flex flex-col w-1/2 ml-auto mr-auto bg-[#ffffff25] min-h-[500px] rounded-lg">
                <div className="flex justify-center">
                  <div className="w-9/12 bg-[#101010] border-2 border-[#33ff00] text-lg text-bold text-[#33ff00] p-1 text-center mt-5 rounded-lg">
                    Here&apos;s your NFT(s)
                  </div>
                </div>
                <div className="flex justify-center mt-10 min-h-[300px]">
                  <Gallery
                    className="bg-transparent border-2 border-[#33ff00] p-5 w-9/12 rounded-lg z-5"
                    items={myItemsOnConsideringColl}
                  />
                </div>
                <div className="flex w-full  justify-center mt-10 relative">
                  <div className="flex w-9/12  justify-between absolute z-10">
                    <div className="w-4/12 bg-[#101010] border-2 border-[#33ff00] text-md text-[#33ff00] p-1 text-center mt-5 rounded-lg flex justify-center items-center cursor-pointer select-none z-5 ">
                      <div>{socials[0].icon}</div>
                      <div className="ml-1">Tweet it!</div>
                    </div>
                    <div className="w-4/12 ml-1  bg-[#101010] border-2 border-[#33ff00] text-md text-[#33ff00] p-1 text-center mt-5 rounded-lg flex justify-center items-center cursor-pointer select-none z-5 ">
                      <div>{socials[1].icon}</div>
                      <div className="ml-1">Share it!</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col w-full bg-[#ffffff25] min-h-[500px] rounded-lg ml-auto mr-auto m-10">
                <div className="flex justify-center">
                  <div className="w-9/12 bg-[#101010] border-2 border-[#33ff00] text-lg text-bold text-[#33ff00] p-1 px-5 text-center mt-5 rounded-lg flex justify-between">
                    <div>{consideringCollectionName}</div>
                    <div>
                      {totalMinted}/{totalItems}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mt-5 ">
                  <div
                    className="col-lg-6 rize-what-we-are-left f-end mb-4 mb-sm-0 order-1 order-sm-2 d-flex "
                    style={{ justifyContent: "space-between" }}
                  >
                    <RizeSwiper
                      className="bg-transparent  w-1/2 rounded-lg z-5"
                      items={availableItemsForMint}
                    />
                  </div>
                </div>
                <div className="flex w-full justify-center mt-20 gap-3">
                  <div className="w-[31%]  bg-[#101010] border-2 border-[#33ff00] text-md text-[#33ff00] p-1 text-center rounded-lg flex items-center justify-center">
                    Cost
                  </div>
                  <div className="w-5/12 flex justify-between bg-[#101010] border-2 border-[#33ff00] text-md text-[#33ff00] p-1 text-center rounded-lg  items-center">
                    <input
                      className="ml-7 w-8 text-white text-center border-none bg-transparent "
                      value={totalMintingPrice}
                      disabled={true}
                    ></input>
                    <NetworkLogo
                      networkSymbol={
                        currentNetworkSymbol || PLATFORM_NETWORKS.COREUM
                      }
                      className=""
                    />
                  </div>
                </div>
                <div className="flex w-full justify-center mt-5 gap-3 relative">
                  <div className="w-[31%]  bg-[#101010] border-2 border-[#33ff00] text-sm text-[#33ff00] p-1 text-center rounded-lg flex items-center justify-center">
                    {`${mintingCount} of  NFT(s)`}
                  </div>
                  <div className="w-5/12 flex justify-between bg-[#101010] border-2 border-[#33ff00] text-md text-[#33ff00] p-1 text-center rounded-lg items-center relative">
                    <div className="flex justify-between w-full cursor-pointer absolute z-10">
                      <div className=" flex">
                        <AiOutlineMinusCircle
                          className="w-6 h-6 ml-1 cursor-pointer select-none "
                          onClick={() => handleClickMinus()}
                        />
                        <input
                          className="w-8 text-white text-center border-none bg-transparent "
                          value={mintingCount}
                          disabled={true}
                        ></input>
                        <AiOutlinePlusCircle
                          className="w-6 h-6 ml-1  cursor-pointer select-none "
                          onClick={() => handleClickPlus()}
                        />
                      </div>
                      <div
                        className="max-h-[30px] p-0  cursor-pointer select-none mr-2 border-[#33ff00] border-2 bg-[#33ff00] text-white rounded-md px-1"
                        onClick={() => handleClickMax()}
                      >
                        Max
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex justify-center pb-5">
                  <ButtonPrimary
                    className="w-9/12 "
                    onClick={() => handleClickMint()}
                  >
                    Mint
                  </ButtonPrimary>
                </div>
              </div>
              <div className="flex flex-col p-2"></div>
              <div className="flex flex-col w-full ml-auto mr-auto bg-[#ffffff25] min-h-[500px] rounded-lg">
                <div className="flex justify-center">
                  <div className="w-9/12 bg-[#101010] border-2 border-[#33ff00] text-lg text-bold text-[#33ff00] p-1 text-center mt-5 rounded-lg">
                    Here&apos;s your NFT(s)
                  </div>
                </div>
                <div className="flex justify-center mt-10 min-h-[300px]">
                  <Gallery
                    className="bg-transparent border-2 border-[#33ff00] p-5 w-9/12 rounded-lg z-5"
                    items={myItemsOnConsideringColl}
                  />
                </div>
                <div className="flex w-full  justify-center mt-10 relative">
                  <div className="flex w-9/12  justify-between absolute z-10">
                    <div className="w-4/12 bg-[#101010] border-2 border-[#33ff00] text-md text-[#33ff00] p-1 text-center mt-5 rounded-lg flex justify-center items-center cursor-pointer select-none z-5 ">
                      <div>{socials[0].icon}</div>
                      <div className="ml-1">Tweet it!</div>
                    </div>
                    <div className="w-4/12 ml-1  bg-[#101010] border-2 border-[#33ff00] text-md text-[#33ff00] p-1 text-center mt-5 rounded-lg flex justify-center items-center cursor-pointer select-none z-5 ">
                      <div>{socials[1].icon}</div>
                      <div className="ml-1">Share it!</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <Backdrop
            sx={{
              color: "#ffffff3f",
              backgroundColor: "#000000cc",
              zIndex: 1000,
            }}
            open={showSplash}
          >
            {showSplash === true && (
              <Image src={GifForSplash} alt="" width={500} height={500} />
            )}
          </Backdrop>

          <Backdrop
            sx={{
              color: "#ffffff3f",
              backgroundColor: "#000000cc",
              zIndex: 1000,
            }}
            open={working}
          >
            <CircularProgress color="inherit" />
          </Backdrop>

          <ModalUploadingFiles
            show={showUploadingItemsModal}
            onOk={handleClickApplyForMinting}
            onCloseModal={() => {
              setShowUploadingItemsModal(false);
            }}
            isInMintingWL={isInMintingWL}
            globalProvider={globalProvider}
            isCommunityMember={isCommunityMember}
            currentNetworkSymbol={currentNetworkSymbol}
            currentUser={currentUser}
            currentConsideringCollId={currentConsideringCollId}
          />

          <ModalUploadingWL
            show={showUploadingWLModal}
            onOk={() => setShowUploadingWLModal(false)}
            onCloseModal={() => {
              setShowUploadingWLModal(false);
            }}
            isInMintingWL={isInMintingWL}
            globalProvider={globalProvider}
            isCommunityMember={isCommunityMember}
            currentNetworkSymbol={currentNetworkSymbol}
            currentUser={currentUser}
            currentConsideringCollId={currentConsideringCollId}
          />
        </div>
      </div>
    </div>
  );
}
