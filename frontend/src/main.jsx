import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { HashRouter } from "react-router-dom";
//use hash router to avoid 404 error on refresh

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
<HashRouter>
  <App />
</HashRouter>
  </React.StrictMode>,
)
