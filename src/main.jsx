import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import store from "./redux/store.jsx";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <React.StrictMode>
            <GoogleOAuthProvider
                clientId="587663293191-doosfu353ecu95jivrl4t0gas0dqf4sj.apps.googleusercontent.com"
                clientSecret="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"
                callbackURL="/api/oauth/callback/google"
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
 
                <App />
            </LocalizationProvider>
            </GoogleOAuthProvider>
        </React.StrictMode>
    </Provider>
);
