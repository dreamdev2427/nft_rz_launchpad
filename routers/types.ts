import { ComponentType } from "react";

export interface LocationStates {
  "/"?: {};
  "/#"?: {};
  "/home2"?: {};
  "/home3"?: {};
  "/nft-detail/:tokenId"?: {};
  "/page-collection"?: {};
  "/page-search"?: {};
  "/page-author/:userId"?: {};
  "/page-upload-item"?: {};
  "/home-header-2"?: {};
  "/connect-wallet"?: {};
  "/account"?: {};
  "/blog"?: {};
  "/blog-single"?: {};
  "/about"?: {};
  "/contact"?: {};
  "/login"?: {};
  "/signup"?: {};
  "/forgot-pass"?: {};
  "/page404"?: {};
  "/subscription"?: {};
  "/message/:userId"?: {};
  "/message"?: {};
  "/airdrop"?: {};
  "/collectionList"?: {};
  "/collectionsOfCategory/:category"?: {};
  "/collectionItems/:collectionId"?: {};
  "/createCollection"?: {};
  "/editCollection/:collectionId"?: {};
  "/upload-single"?: {};
  "/upload-multiple"?: {};
  "/admin": {};
  "/activity": {};
}

export type PathName = keyof LocationStates;

export interface Page {
  path: PathName;
  component: ComponentType<Object>;
}
