import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-cards";

// import required modules
import { EffectCards } from "swiper";
import { PINATA_GATEWAY, FILE_TYPE } from "../config";

export const getFIleType = (fileName) => {
  if (
    fileName.toString().includes("png") ||
    fileName.toString().includes("PNG") ||
    fileName.toString().includes("jpg") ||
    fileName.toString().includes("JPG") ||
    fileName.toString().includes("gif") ||
    fileName.toString().includes("GIF") ||
    fileName.toString().includes("webp") ||
    fileName.toString().includes("WEBP") ||
    fileName.toString().includes("jpeg") ||
    fileName.toString().includes("JPEG")
  )
    return FILE_TYPE.IMAGE;
  if (
    fileName.toString().includes("mp3") ||
    fileName.toString().includes("MP3")
  )
    return FILE_TYPE.AUDIO;
  if (
    fileName.toString().includes("mp4") ||
    fileName.toString().includes("MP4") ||
    fileName.toString().includes("webm") ||
    fileName.toString().includes("WEBM")
  )
    return FILE_TYPE.VIDEO;
  if (
    fileName.toString().includes("glb") ||
    fileName.toString().includes("GLB")
  )
    return FILE_TYPE.THREED;
};

export default function RizeSwiper({ className, items }) {
  const [itemsToDisplay, setItemsToDisplay] = useState([]);

  useEffect(() => {
    setItemsToDisplay(items);
  }, [items]);

  const processIPFSstr = (fileName) => {
    if (fileName.includes("ipfs://")) {
      return fileName.replace("ipfs://", PINATA_GATEWAY);
    }
    return fileName;
  };

  return (
    <div className={className}>
      <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards]}
        className="mySwiper"
        cardsEffect={{
          rotate: true,
          perSlideRotate: 25,
          shadow: true,
          slideShadows: true,
          depth: 100,
          modifier: 1,
        }}
        initialSlide={1}
        loop={true}
      >
        {itemsToDisplay &&
          itemsToDisplay.length > 0 &&
          itemsToDisplay.map((item, index) => (
            <SwiperSlide key={index}>
              {getFIleType(item?.image || "") === FILE_TYPE.VIDEO && (
                <div className="video-container video--border">
                  <video
                    autoPlay={true}
                    muted={true}
                    loop={true}
                    controls={false}
                    className="w-sm-100 "
                    width="100%"
                  >
                    {(item?.image || "")
                      .toString()
                      .toLowerCase()
                      .includes("webm") === true ? (
                      <source
                        src={processIPFSstr(item?.image || "")}
                        type="video/webm"
                      />
                    ) : (
                      <source
                        src={processIPFSstr(item?.image || "")}
                        type="video/mp4"
                      />
                    )}
                  </video>
                </div>
              )}
              {getFIleType(item?.image || "") === FILE_TYPE.IMAGE && (
                <div className="video-container video--border">
                  <img
                    src={processIPFSstr(item?.image || "")}
                    className="w-sm-100 w-full"
                  />
                </div>
              )}
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}
