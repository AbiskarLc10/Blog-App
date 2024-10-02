import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom'
import { store,persistor } from './redux/store.js';
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import ThemeProvider from './Components/ThemeProvider.jsx';
import { Contexts } from './Context/BlogContext.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
 <BrowserRouter>
  <React.StrictMode>
    
    <PersistGate persistor={persistor}>
    <Provider store={store}>
    <ThemeProvider>
      <Contexts>
    <App />
    </Contexts>
    </ThemeProvider>
    </Provider>
    </PersistGate>
   
  </React.StrictMode>
  </BrowserRouter>,
)
