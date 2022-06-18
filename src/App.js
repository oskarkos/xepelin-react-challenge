import "./App.css";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

function App() {
  const [user, setUser] = useState({});

  function handleCallbackRepsonse(response) {
    const userObject = jwt_decode(response.credential);
    setUser(userObject);
    document.getElementById("google-sign-in").hidden = true;
  }

  function handleSignOut(event) {
    setUser({});
    document.getElementById("google-sign-in").hidden = false;
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCallbackRepsonse,
    });
    google.accounts.id.renderButton(document.getElementById("google-sign-in"), {
      theme: "outline",
      size: "large",
    });
    google.accounts.id.prompt();
  }, []);

  return (
    <div className="App">
      <div id="google-sign-in"></div>
      {Object.keys(user).length !== 0 && (
        <button onClick={(e) => handleSignOut(e)}>Sign Out</button>
      )}
      {user ? (
        <div>
          <img
            src={user.picture}
            alt={Object.keys(user).length > 0 ? `${user.name} image` : ""}
          ></img>
          <h3>{user.name}</h3>
        </div>
      ) : null}
    </div>
  );
}

export default App;
