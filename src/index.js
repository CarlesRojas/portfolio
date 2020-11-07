import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import EventsPubSub from "./EventsPubSub";

import "./index.scss";

// Register the PubSub
window.PubSub = new EventsPubSub();

// Render React App
ReactDOM.render(<App />, document.getElementById("root"));

// Register service worker
serviceWorker.register();
