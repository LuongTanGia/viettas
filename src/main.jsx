import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import store from "./redux/store.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <React.StrictMode>
            <GoogleOAuthProvider
                clientId="1087400588139-83e46v586sifjv3v8r5lbu8152nikkk9.apps.googleusercontent.com"
                clientSecret="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"
                callbackURL="/api/oauth/callback/google"
            >
                <App />
            </GoogleOAuthProvider>
        </React.StrictMode>
    </Provider>
);
