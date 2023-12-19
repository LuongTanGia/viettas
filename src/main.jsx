import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Provider } from 'react-redux'
import store from './redux/store.jsx'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <GoogleOAuthProvider
          clientId="587663293191-doosfu353ecu95jivrl4t0gas0dqf4sj.apps.googleusercontent.com"
          clientSecret="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"
          callbackURL="/api/oauth/callback/google"
        >
          <App />
        </GoogleOAuthProvider>
      </LocalizationProvider>
    </React.StrictMode>
  </Provider>,
)
