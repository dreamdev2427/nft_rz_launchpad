import { useState, useEffect } from "react";
import SwiperCore, { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-cards";
import { PINATA_GATEWAY, FILE_TYPE } from "../config";
import { getFIleType } from "./RizeSwiper";

export default function Gallery({ items, className }) {
  const [itemsToDisplay, setItemsToDisplay] = useState([]);

  useEffect(() => {
    setItemsToDisplay(items);
  }, [items]);

  const getFullLogoURL = (item) => {
    if (item?.fileType === FILE_TYPE.IMAGE) {
      return `${PINATA_GATEWAY}${item?.logoURL}`;
    } else {
      return `${PINATA_GATEWAY}${item?.musicURL}`;
    }
  };

  SwiperCore.use([Autoplay]);
  return (
    <div className="w-9/12 flex items-center">
      <Swiper
        spaceBetween={10}
        slidesPerView={3}
        navigation={false}
        duration={800}
        className="mySwiper"
        autoplay={true}
        loop
        style={{ width: "100%", height: "100%" }}
      >
        {itemsToDisplay &&
          itemsToDisplay.length > 0 &&
          itemsToDisplay.map((item, index) => (
            <SwiperSlide key={index}>
              {item?.fileType === FILE_TYPE.VIDEO && (
                <div className="video-container video--border">
                  <video
                    autoPlay={true}
                    muted={true}
                    loop={true}
                    controls={false}
                    className="w-sm-100 "
                    width="100%"
                  >
                    {getFullLogoURL(item)
                      .toString()
                      .toLowerCase()
                      .includes("webm") === true ? (
                      <source
                        src={getFullLogoURL(item) || ""}
                        type="video/webm"
                      />
                    ) : (
                      <source
                        src={getFullLogoURL(item) || ""}
                        type="video/mp4"
                      />
                    )}
                  </video>
                </div>
              )}
              {item?.fileType === FILE_TYPE.IMAGE && (
                <div className="video-container video--border">
                  <img
                    src={getFullLogoURL(item) || ""}
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
