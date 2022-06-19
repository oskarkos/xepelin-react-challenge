import "./App.css";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFileExcel,
  faMagnifyingGlass,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GoogleSheetData from "./components/GoogleSheetData";

library.add(faFileExcel, faMagnifyingGlass, faArrowRightFromBracket);

function App() {
  const [user, setUser] = useState({});
  const [showsheet, setShowSheet] = useState(false);

  function handleCallbackRepsonse(response) {
    const userObject = jwt_decode(response.credential);
    setUser(userObject);
    document.getElementById("login-wrapper").style.display = "none";
    document.getElementById("google-sign-in").hidden = true;
  }

  function handleSignOut(event) {
    setUser({});
    document.getElementById("login-wrapper").style.display = "flex";
    document.getElementById("google-sign-in").hidden = false;
  }

  function handleSheet(event) {
    setShowSheet(!showsheet);
  }

  useEffect(() => {
    setUser({});
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCallbackRepsonse,
    });
    google.accounts.id.renderButton(document.getElementById("google-sign-in"), {
      size: "large",
      height: 80,
      longtitle: true,
      theme: "dark",
    });
    google.accounts.id.prompt();
  }, []);

  return (
    <div className="App">
      <div
        className="w-full bg-slate-500 h-screen flex flex-col justify-center items-center"
        id="login-wrapper"
      >
        <div className="py-5">
          <p className="font-medium text-3xl text-white">Para Acceder</p>
          <p className="font-medium text-xl text-white">
            Inicia Sesión con Google
          </p>
        </div>
        <div id="google-sign-in"></div>
      </div>
      {Object.keys(user).length !== 0 && (
        <div>
          <div className="flex justify-around w-full h-20 bg-slate-600">
            <div className="flex items-center">
              <img
                className="rounded-full w-14 h-14 border-white border-2"
                src={user.picture}
                alt={Object.keys(user).length > 0 ? `${user.name} image` : ""}
              ></img>
              <h3 className="text-2xl ml-3 font-bold text-white">
                {user.name}
              </h3>
            </div>
            <button
              className="text-white hover:underline my-auto"
              onClick={(e) => handleSignOut(e)}
            >
              Cerrar Sesión
              <FontAwesomeIcon
                className="ml-2"
                icon="fa-solid fa-arrow-right-from-bracket"
              />
            </button>
          </div>

          <GoogleSheetData />

          <div className="flex w-full justify-center items-center gap-6">
            <button onClick={handleSheet}>
              {showsheet ? "Ocultar" : "Abrir"} Google Sheets
              <FontAwesomeIcon className="ml-2" icon="fa-solid fa-file-excel" />
            </button>
          </div>

          {showsheet && (
            <iframe
              className="w-full h-screen"
              title="google-sheets-iframe"
              src="https://docs.google.com/spreadsheets/d/1gnhPiohITz8EdUq65Rp_KkNfIRbouij5wKLZhRmmeAc/edit?usp=sharing?widget=true&amp;headers=false"
              as="iframe"
            ></iframe>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
