import React from "react";
import { ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { theme } from "styles";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { TaskProvider } from "./contexts";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <SnackbarProvider
    maxSnack={3}
    autoHideDuration={2000}
    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
  >
    <TaskProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </TaskProvider>
  </SnackbarProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
