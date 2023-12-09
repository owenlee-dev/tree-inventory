import * as XLSX from "xlsx";

const readExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.readAsArrayBuffer(file);

    fileReader.onload = (e) => {
      const bufferArray = e.target.result;

      const workbook = XLSX.read(bufferArray, { type: "buffer" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const data = XLSX.utils.sheet_to_json(worksheet);
      resolve(data);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export { readExcelFile };
