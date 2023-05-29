import { useState, useEffect } from "react";
import folderShapeSVG from "../public/images/folder-svgrepo-com.svg";
import { UPLOADING_FILE_TYPES, pinDirectoryToPinata } from "../utils/pinatasdk";
import copyBtnPNg from "../public/images/copy_btn.png";
import NcModal from "./NcModal";
import { toast } from "react-toastify";
import ButtonPrimary from "./ButtonPrimary";
import axios from "axios";
import { config } from "../config";

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
  const [cidOfImagesFolder, setCidOfImagesFolder] = useState("");
  const [cidOfJsonsFolder, setCidOfJsonsFolder] = useState("");
  const [working, setWorking] = useState(false);

  const handleClickSubmitForm = () => {
    onOk();
  };
  const [selectedMintingWLFile, setSelectedMintingWLFile] = useState(null);

  const handleSelectMintingWLFile = (files) => {
    let file = files[0];
    if (file) {
      setSelectedMintingWLFile(file);
    }
  };

  const handleClickUploadMintingWLFile = async () => {
    if (selectedMintingWLFile) {
      const formData = new FormData();
      formData.append("itemFile", selectedMintingWLFile || "");
      formData.append("authorId", "hch");
      await axios({
        method: "post",
        url: `${config.API_URL}api/utils/uploadmintingWL`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(async function (response) {
          if (response.data.code === 0)
            toast.success("You've updated WL file.");
          else toast.error("Uploading wl file failed.");
        })
        .catch(function (error) {
          toast.error("Uploading wl file failed.");
        });
    }
  };

  const renderContent = () => {
    return (
      <div className="flex items-center justify-center">
        <div className="flex flex-col text-sm text-neutral-500  dark:text-neutral-400 ">
          <div className="flex justify-center text-sm text-neutral-6000 dark:text-neutral-300 w-full">
            <span className="text-green-500 border-dotted border-2 border-[#33ff00] rounded-lg min-h-[25px] w-full text-center p-2">
              {!selectedMintingWLFile
                ? "Click here to select a minting whitelist file."
                : selectedMintingWLFile?.name}
            </span>
            <label
              htmlFor="mintingwl_upload"
              className=" font-medium rounded-md cursor-pointer text-primary-6000 transition hover:text-primary-500  absolute top-[80px] left-25 z-5 w-[200px] h-[50px]"
            >
              <input
                id="mintingwl_upload"
                type="file"
                accept=".txt"
                className="z-0 hidden"
                onChange={(e) => {
                  handleSelectMintingWLFile(e.target.files);
                }}
              />
            </label>
          </div>
          <ButtonPrimary
            className="w-full mt-5 max-h-[30px] "
            onClick={() => {
              handleClickUploadMintingWLFile();

              onOk();
            }}
          >
            Upload
          </ButtonPrimary>
        </div>
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
      modalTitle="Upload a whitelist file."
    />
  );
};

export default UploadItems;
