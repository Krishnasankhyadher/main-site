import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
import Shopcontextprovider from './context/Shopcontext.jsx'

createRoot(document.getElementById('root')).render(
  <HashRouter>
  <Shopcontextprovider>

    <App />
  </Shopcontextprovider>
  </HashRouter>,
)
