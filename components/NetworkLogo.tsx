import { PLATFORM_NETWORKS } from "../config";

const NetworkLogo = ({ networkSymbol = 0, className = "" }) => {
  return (
    <div className={`${className} min-w-[30px]`}>
      {networkSymbol === PLATFORM_NETWORKS.COREUM && (
        <div className="flex justify-center items-center">
          <img
            src="/images/icons/core.png"
            className="w-[30px] h-[30px]"
            width={30}
            height={30}
            alt=""
          ></img>
        </div>
      )}
      {networkSymbol === PLATFORM_NETWORKS.ETHEREUM && (
        <div className="flex justify-center items-center">
          <img
            src="/images/icons/eth.png"
            className="w-[30px] h-[30px]"
            width={30}
            height={30}
            alt=""
          ></img>
        </div>
      )}
      {networkSymbol === PLATFORM_NETWORKS.BSC && (
        <div className="flex justify-center items-center">
          <img
            src="/images/icons/bsc.png"
            className="w-[30px] h-[30px]"
            width={30}
            height={30}
            alt=""
          ></img>
        </div>
      )}
      {networkSymbol === PLATFORM_NETWORKS.POLYGON && (
        <div className="flex justify-center items-center">
          <img
            src="/images/icons/polygon.png"
            className="w-[30px] h-[30px]"
            width={30}
            height={30}
            alt=""
          ></img>
        </div>
      )}
      {networkSymbol === PLATFORM_NETWORKS.AVALANCHE && (
        <div className="flex justify-center items-center">
          <img
            src="/images/icons/avax.png"
            className="w-[30px] h-[30px]"
            width={30}
            height={30}
            alt=""
          ></img>
        </div>
      )}
      {networkSymbol === PLATFORM_NETWORKS.NEAR && (
        <div className="flex justify-center items-center">
          <img
            src="/images/icons/near.png"
            className="w-[30px] h-[30px]"
            width={30}
            height={30}
            alt=""
          ></img>
        </div>
      )}
    </div>
  );
};

export default NetworkLogo;
