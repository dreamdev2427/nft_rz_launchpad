import { useState, useEffect } from "react";
import folderShapeSVG from "../public/images/folder-svgrepo-com.svg";
import {
  UPLOADING_FILE_TYPES,
  pinDirectoryToPinata,
  pinUpdatedJSONDirectoryToPinata,
} from "../utils/pinatasdk";
import NcModal from "./NcModal";
import { toast } from "react-toastify";
import ButtonPrimary from "./ButtonPrimary";
import { Backdrop, CircularProgress } from "@mui/material";

const UploadItems = ({
  show,
  onOk,
  onCloseModal,
  isInMintingWL,
  globalProvider,
  isCommunityMember,
  currentNetworkSymbol,
  currentUser,
  currentConsideringCollId,
}) => {
  const [imageFileList, setImageFileList] = useState([]);
  const [jsonFileList, setJsonFileList] = useState([]);
  const [working, setWorking] = useState(false);
  const [imageExtension, setImageExtension] = useState("");

  useEffect(() => {
    setImageFileList([]);
    setJsonFileList([]);
  }, [show]);

  const handleClickSubmitForm = () => {
    onOk();
  };

  const handleSelectImagesFolder = (filelist) => {
    setImageFileList(filelist);
    let splitedArr = filelist[0]?.name.toString().split(".") || "";
    var imageExt = splitedArr[splitedArr.length - 1] || "";
    setImageExtension(imageExt);
  };

  const updateJson = (json, replsceImgStr) => {
    let updated = json;
    updated["image"] = replsceImgStr;
    return updated;
  };

  const handleSelectJsonsFolder = async (filelist) => {
    let updatingJSONList = [];
    for (let i = 0; i < filelist.length; i++) {
      const file = filelist[i];

      // Read the file
      const fileContent = await file.text();

      updatingJSONList.push(fileContent);
    }
    setJsonFileList(updatingJSONList);
  };

  const handleClickUploadImages = async () => {
    if (!consideringCollId || consideringCollId.toString().length !== 24) {
      toast.warn("Please select a collection and try again.", "Warning", 5000);
      setWorking(false);
      return;
    }
    if (imageFileList?.length > 0) {
      setWorking(true);
      let cid = await pinDirectoryToPinata(
        imageFileList,
        UPLOADING_FILE_TYPES.OTHERS
      );
      if (cid !== null) {
        toast.success(
          <div>
            {`You 've uploaded a folder of images to Rize2Day Pindata store.\n \n
            You need to replace the value of 'image' property of each JSON file with new CID 
            before upload the JSON files folder.`}
          </div>,
          "Uploading is succeed",
          20000
        );
      }
      setImageFileList([]);
      setWorking(false);
    }
  };

  const handleClickUploadJsons = async () => {
    if (!consideringCollId || consideringCollId.toString().length !== 24) {
      toast.warn("Please select a collection and try again.", "Warning", 5000);
      setWorking(false);
      return;
    }
    if (jsonFileList?.length > 0) {
      setWorking(true);
      let cid = await pinUpdatedJSONDirectoryToPinata(
        jsonFileList,
        UPLOADING_FILE_TYPES.JSON
      );
      if (cid !== null) {
        toast.success(
          <div>
            {`You 've uploaded a folder of json files to Rize2Day Pindata store.\n
             You can go on minting with new CID.`}
          </div>,
          "Uploading is succeed",
          20000
        );
        setTimeout(() => {
          onOk(cid);
        }, 200);
      }
      setJsonFileList([]);
      setWorking(false);
    }
  };

  const handleUploadAll = async () => {
    if (!consideringCollId || consideringCollId.toString().length !== 24) {
      toast.warn("Please select a collection and try again.", "Warning", 5000);
      setWorking(false);
      return;
    }
    if (imageFileList?.length > 0 && jsonFileList?.length > 0) {
      if (imageFileList?.length !== jsonFileList?.length) {
        toast.error("Number of image files and json files should be equal");
        return;
      }
    }
    if (imageFileList?.length > 0) {
      setWorking(true);

      let cid = await pinDirectoryToPinata(
        imageFileList,
        UPLOADING_FILE_TYPES.OTHERS
      );
      if (cid !== null) {
        const imagesFolderCid = cid;
        var updatedJsonList = [];
        for (let idx = 0; idx < jsonFileList.length; idx++) {
          const json = JSON.parse(jsonFileList[idx]);
          const updatedJson = updateJson(
            json,
            `ipfs://${imagesFolderCid}/${idx}.${imageExtension}`
          );
          const updatedFileContent = JSON.stringify(updatedJson);
          updatedJsonList.push(updatedFileContent);
        }
        if (jsonFileList?.length > 0) {
          setWorking(true);
          let cidOfJsonFolder = await pinUpdatedJSONDirectoryToPinata(
            jsonFileList,
            UPLOADING_FILE_TYPES.JSON
          );
          if (cidOfJsonFolder !== null) {
            toast.success(
              <div>
                {`You 've uploaded a folder of json files to Rize2Day Pindata store.\n
             You can go on minting with new CID.`}
              </div>,
              "Uploading is succeed",
              20000
            );
            setTimeout(() => {
              onOk(cidOfJsonFolder);
            }, 200);
          }
          setJsonFileList([]);
          setWorking(false);
        }
      }
      setImageFileList([]);
      setWorking(false);
    }
  };

  const renderContent = () => {
    return (
      <div className="flex flex-col items-center">
        <div className="flex">
          <div className="w-5/12 flex flex-col items-center ">
            <div className="space-y-1 text-center z-5 relative w-full">
              <img
                className="w-12 h-12 mx-auto text-neutral-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
                src={folderShapeSVG}
                alt="folder"
              />
              <div className="flex justify-center text-sm text-neutral-6000 dark:text-neutral-300 w-full">
                <span className="text-green-500">
                  Select a folder of image files
                </span>
                <label
                  htmlFor="image_upload"
                  className=" font-medium rounded-md cursor-pointer text-primary-6000 transition hover:text-primary-500  absolute top-0 left-25 z-5 w-[100px] h-[100px]"
                >
                  <input
                    id="image_upload"
                    type="file"
                    webkitdirectory="true"
                    mozdirectory="true"
                    msdirectory="true"
                    odirectory="true"
                    directory="true"
                    multiple="true"
                    className="z-0 hidden"
                    onChange={(e) => handleSelectImagesFolder(e.target.files)}
                  />
                </label>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {`${imageFileList?.length || 0} files in the folder`}
              </p>
            </div>
            {/* <div className="my-5 text-[#afafaf]  flex relative">
              {cidOfImagesFolder !== "" && (
                <>
                  CID: {cidOfImagesFolder}
                  <CopyToClipboard
                    text={cidOfImagesFolder}
                    className="w-5 h-5 cursor-pointer absolute z-10"
                  >
                    <img
                      src={copyBtnPNg}
                      className="w-5 h-5 absolute z-10"
                      alt="copy"
                    />
                  </CopyToClipboard>
                </>
              )}
            </div> */}
          </div>
          <div className="w-2/12 flex flex-col items-center "></div>
          <div className="w-5/12 flex flex-col items-center ">
            <div className="space-y-1 text-center z-5 relative w-full">
              <img
                className="w-12 h-12 mx-auto text-neutral-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
                src={folderShapeSVG}
                alt="folder"
              />
              <div className="flex justify-center text-sm text-neutral-6000 dark:text-neutral-300 w-full">
                <span className="text-green-500">
                  Select a folder of json files
                </span>
                <label
                  htmlFor="json_upload"
                  className="font-medium rounded-md cursor-pointer text-primary-6000 transition hover:text-primary-500  absolute top-0 left-10 z-5  w-[100px] h-[100px]"
                >
                  <input
                    id="json_upload"
                    type="file"
                    webkitdirectory="true"
                    mozdirectory="true"
                    msdirectory="true"
                    odirectory="true"
                    directory="true"
                    multiple="true"
                    className="z-0 hidden"
                    onChange={(e) => handleSelectJsonsFolder(e.target.files)}
                  />
                </label>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {`${jsonFileList?.length || 0} files in the folder`}
              </p>
            </div>
            {/* <div className="my-5 text-[#afafaf] flex relative">
              {cidOfJsonsFolder !== "" && (
                <>
                  CID: {cidOfJsonsFolder}
                  <CopyToClipboard
                    text={cidOfJsonsFolder}
                    className="w-5 h-5 cursor-pointer absolute z-10"
                  >
                    <img
                      src={copyBtnPNg}
                      className="w-5 h-5 absolute z-10"
                      alt="copy"
                    />
                  </CopyToClipboard>
                </>
              )}
            </div> */}
          </div>
        </div>
        <ButtonPrimary
          className="w-1/3 mt-2 max-h-[30px] "
          onClick={() => {
            handleUploadAll();
          }}
        >
          Upload
        </ButtonPrimary>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={working}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  };

  const renderTrigger = () => {
    return null;
  };

  return (
    <NcModal
      isOpenProp={show}
      onCloseModal={onCloseModal}
      contentExtraClass="max-w-screen-sm"
      renderContent={renderContent}
      renderTrigger={renderTrigger}
      modalTitle="Upload folders of images and json files."
    />
  );
};

export default UploadItems;
