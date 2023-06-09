import React, { useEffect } from "react";
import { useState } from "react";
import "./index.css";
const auth = {
    appId: "hnaya",
    webKey: "3846c3c20a9ffff973dac70d895abe966502465c",
    devMode: false,
  };
  const options = {
    webpush: {
      enabled: true,
      publicKey: "BIy5UOrkGubz9JwAK2SI78WBnQFKJjn-QVnNwsdK_4lr-b4441wxxmkSCdG1UJf7ZkridjwnikkPnWvMzMD_tio",
    },
    silent: false,
    realtime: false,
  };
let chabok;

function App() {
  const [id, setId] = useState("");
  useEffect(() => {
    const f = async () => {
      const chabokpush = (await import("chabokpush")).default;
      chabok = new chabokpush.Chabok(auth, options);
    };
    f();
  }, []);

  const loginChabok = () => {
    chabok.login(id);
    setId("")
    console.log("successful login");
  };
  const logoutChabok = () => {
    chabok.logout()
    console.log("successful logout");
  };

  return (
    <div className="app">
        <p>{"Enter id :"}</p>
      <input className="input" type="text" value={id} onChange={(e) => setId(e.target.value)} />
      <button className="btn" onClick={() => loginChabok()}>
        {"LOGIN"}
      </button>
      <button className="btn" onClick={() => logoutChabok()}>
        {"LOGOUT"}
      </button>
    </div>
  );
}

export default App;
