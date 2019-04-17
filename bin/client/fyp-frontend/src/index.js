import React from "react"
import ReactDOM from "react-dom"
import './styles/styles.css'
import App from "./App.js"

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : false;