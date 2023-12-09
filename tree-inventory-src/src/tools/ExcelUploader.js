import React, { useState } from "react";
import "./excelUploader.scss";
import { readExcelFile } from "./ExcelReader";
import fileIcon from "../assets/images/file-icon.png"; // Path to your file icon or placeholder image
import { uploadDataFile } from "../__redux/slices/AppSlice";
import { useDispatch } from "react-redux";

//Validate loaded file is excel
const ExcelUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();
  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // async function organizeData(data) {
  //   const organizedData = {};
  //   let currentCategory = "";
  //   let currentSubcategory = "";
  //   let isDirectItemUnderCategory = false;

  //   data.forEach((item) => {
  //     // Check if the item is a main category (all uppercase)
  //     if (item.Variety === item.Variety.toUpperCase()) {
  //       currentCategory = item.Variety.toLowerCase(); // Convert category to lowercase
  //       organizedData[currentCategory] = {};
  //       currentSubcategory = "";
  //       isDirectItemUnderCategory = true;
  //     } else if (currentCategory) {
  //       // Check if the item is a subcategory (not all uppercase and not a detailed item)
  //       if (
  //         item.Variety !== item.Variety.toUpperCase() &&
  //         Object.keys(item).length <= 2
  //       ) {
  //         currentSubcategory = item.Variety.toLowerCase().trim(); // Convert subcategory to lowercase and trim
  //         organizedData[currentCategory][currentSubcategory] = [];
  //         isDirectItemUnderCategory = false;
  //       } else if (currentSubcategory) {
  //         // This is an item under the current subcategory
  //         organizedData[currentCategory][currentSubcategory].push(item);
  //         isDirectItemUnderCategory = false;
  //       } else if (isDirectItemUnderCategory) {
  //         // This is a direct item under the main category without subcategories
  //         if (!Array.isArray(organizedData[currentCategory])) {
  //           organizedData[currentCategory] = [];
  //         }
  //         organizedData[currentCategory].push(item);
  //       }
  //     }
  //   });

  //   return organizedData;
  // }

  const uploadDataToStore = async (data) => {
    let curJSONDir = "";
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      let data = await readExcelFile(selectedFile);
      console.log(data);
      // let organizedData = await organizeData(data);
      // dispatch(uploadDataFile(organizedData));
      setSelectedFile(null);
    }
  };

  return (
    <div className="excel-uploader">
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="file-upload-label button-animation"
      >
        <img src={fileIcon} alt="Upload Excel" />
        <span>Select File</span>
      </label>

      {selectedFile && (
        <div className="file-info">
          <img src={fileIcon} alt="Upload Excel" />
          <p>
            File Name: TreeSales2022.xlsx
            <br />
            File Size: 52kb bytes
          </p>
          <button
            className="upload-button button-animation"
            onClick={handleFileUpload}
          >
            Upload File
          </button>
        </div>
      )}
    </div>
  );
};

export default ExcelUploader;
