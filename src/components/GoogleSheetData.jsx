import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const GoogleSheetData = () => {
  const [sheetData, setSheetData] = useState([]);

  const fetchData = async () => {
    const data = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${process.env.REACT_APP_GOOGLE_SHEETS_ID}/values/Hoja%201?key=${process.env.REACT_APP_GOOGLE_API_KEY}`
    );
    const json = await data.json();
    const keys = json.values[0];
    const result = json.values.slice(2).map(function (a) {
      var temp = {};
      keys.forEach(function (k, i) {
        temp[k] = a[i];
      });
      return temp;
    });
    return result;
  };

  useEffect(() => {
    const data = fetchData().catch(console.error);
    data.then((data) => setSheetData(data));
  }, []);

  function getUpdatedData() {
    const data = fetchData().catch(console.error);
    data.then((data) => {
      console.log("newData", data);
      console.log("oldData", sheetData);
      if (data !== sheetData) {
        console.log(" hay algo difernte");
      } else {
        console.log("no hay nada diferente");
      }
    });
  }

  return (
    <div>
      <div className="grid grid-cols-3 grid-rows-1 mb-2 justify-around w-full h-4 font-bold">
        <p>ID</p>
        <p>Tasa</p>
        <p>Email</p>
      </div>
      {sheetData.length > 0 &&
        sheetData.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-3 mt-1 mb-1 grid-rows-1 justify-around w-full h-4"
          >
            <p>{row.id}</p>
            <p>{row.rate}</p>
            <p>{row.email}</p>
          </div>
        ))}

      <button className="mt-5" onClick={getUpdatedData}>
        Revisión de datos
        <FontAwesomeIcon className="ml-2" icon="fa-solid fa-magnifying-glass" />
      </button>
    </div>
  );
};

export default GoogleSheetData;
