import axios from "axios";
import { PINATA_JWT } from "../config";
const JWT = "Bearer " + PINATA_JWT;

export const pinFileToIPFS = async (file) => {
  let ipfsCid = "";
  try {
    const formData = new FormData();
    //   const src = "path/to/file.png";

    // const file = fs.createReadStream(src);
    formData.append("file", file);

    const metadata = JSON.stringify({
      name: "File name",
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: JWT,
        },
      }
    );
    ipfsCid = res.data.IpfsHash;
  } catch (error) {
    ipfsCid = null;
  }
  return ipfsCid;
};

export const pinJSONToIPFS = async (jsonObj) => {
  let ipfsCid = "";
  try {
    let res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      { ...jsonObj },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: JWT,
        },
      }
    );
    ipfsCid = res.data.IpfsHash;
  } catch (error) {
    ipfsCid = null;
  }
  return ipfsCid;
};

export const UPLOADING_FILE_TYPES = {
  OTHERS: 0,
  JSON: 1,
};

export const pinDirectoryToPinata = async (
  filelist,
  type = UPLOADING_FILE_TYPES.IMAGE
) => {
  let ipfsCid = "";
  try {
    if (filelist?.length <= 0) return null;
    const formData = new FormData();

    Array.from(filelist).forEach((file) => {
      formData.append("file", file);
    });

    const metadata = JSON.stringify({
      name: `${type}_${Date.now()}`,
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: JWT,
          },
        }
      );
      ipfsCid = res.data.IpfsHash;
    } catch (error) {
      ipfsCid = null;
    }
  } catch (error) {
    ipfsCid = null;
  }

  return ipfsCid;
};

export const pinUpdatedJSONDirectoryToPinata = async (
  jsonlist,
  type = UPLOADING_FILE_TYPES.IMAGE
) => {
  let ipfsCid = "";
  try {
    if (jsonlist?.length <= 0) return null;
    let formData = new FormData();
    for (let idx = 0; idx < jsonlist.length; idx++) {
      formData.append(
        "file",
        new Blob([jsonlist[idx]], { type: "application/json" }),
        `json/${idx}.json`
      );
    }

    const metadata = JSON.stringify({
      name: `${type}_${Date.now()}`,
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: JWT,
          },
        }
      );
      ipfsCid = res.data.IpfsHash;
    } catch (error) {
      ipfsCid = null;
    }
  } catch (error) {
    ipfsCid = null;
  }

  return ipfsCid;
};
