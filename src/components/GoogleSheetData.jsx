import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import _ from "lodash";

const GoogleSheetData = () => {
  const [sheetData, setSheetData] = useState([]);

  const fetchData = async () => {
    const data = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${process.env.REACT_APP_GOOGLE_SHEETS_ID}/values/Hoja%201?key=${process.env.REACT_APP_GOOGLE_API_KEY}`
    );
    const json = await data.json();
    const keys = json.values[0];
    const result = json.values.slice(1).map(function (a) {
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
    data.then((newData) => {
      const isEqual = _.isEqual(sheetData, newData);
      if (isEqual) {
        alert("No hemos detectado cambios de tasa en ninguna de las cuentas");
        setSheetData(newData);
      } else {
        const difItems = _.differenceWith(newData, sheetData, _.isEqual);
        difItems.map(async (item) => {
          item.rate = item.rate.replace(/,/g, ".");
          await sendEmail({
            idOp: Number(item.id),
            tasa: Number(item.rate),
            email: item.email,
          });
          alert(`Hemos enviado un correo a ${item.email} confirmando el cambio de tasa`);
        });
        setSheetData(newData);
      }
    });
  }

  async function sendEmail(data) {
    await fetch("https://hooks.zapier.com/hooks/catch/6872019/oahrt5g/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  return (
    <div>
      <p className="font-medium text-xl my-7">
        Estos son tus datos actuales de tus clientes{" "}
      </p>
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

      <button
        className="my-5 p-5 border-solid border-2 border-gray-600 rounded-md hover:bg-slate-500 hover:border-white hover:text-white"
        onClick={getUpdatedData}
      >
        Si hiciste un cambio de Tasa, actualiza los datos aquí
        <FontAwesomeIcon className="ml-2" icon="fa-solid fa-magnifying-glass" />
      </button>
    </div>
  );
};

export default GoogleSheetData;
