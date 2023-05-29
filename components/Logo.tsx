import React from "react";
import Link from "next/link";
import Image from "next/image";
import logoImg from "../public/logo.png";
import logoLightImg from "../public/logo-light.png";

export interface LogoProps {
  img?: string;
  imgLight?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  img = logoImg,
  imgLight = undefined,
  className = "",
}) => {
  return (
    <Link href="/">
      <div className={`ttnc-logo inline-block text-primary-6000 ${className}`}>
        {img ? (
          <Image
            className={`block ${imgLight ? "dark:hidden" : ""}`}
            src={img}
            alt="Logo"
            width={100}
            height={50}
          />
        ) : (
          "Logo Here"
        )}
        {imgLight && (
          <Image
            className="hidden dark:block"
            src={imgLight}
            alt="Logo-Light"
            width={50}
            height={50}
          />
        )}
      </div>
    </Link>
  );
};

export default Logo;
