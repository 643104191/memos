import "@github/relative-time-element";
import { CssVarsProvider } from "@mui/joy";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import gomarkWasm from "./assets/gomark.wasm?url";
import "./assets/wasm_exec.js";
import "./css/global.css";
import "./css/tailwind.css";
import "./helpers/polyfill";
import "./i18n";
import CommonContextProvider from "./layouts/CommonContextProvider";
import "./less/highlight.less";
import router from "./router";
import store from "./store";
import theme from "./theme";

(async () => {
  if (!WebAssembly.instantiateStreaming) { // polyfill
    WebAssembly.instantiateStreaming = async (resp, importObject) => {
      const source = await (await resp).arrayBuffer();
      return await WebAssembly.instantiate(source, importObject);
    };
  }

  const go = new window.Go();
  const { instance } = await WebAssembly.instantiateStreaming(fetch(gomarkWasm), go.importObject);
  go.run(instance);

  const container = document.getElementById("root");
  const root = createRoot(container as HTMLElement);
  root.render(
    <Provider store={store}>
      <CssVarsProvider theme={theme}>
        <CommonContextProvider>
          <RouterProvider router={router} />
        </CommonContextProvider>
        <Toaster position="top-right" toastOptions={{ className: "dark:bg-zinc-700 dark:text-gray-300" }} />
      </CssVarsProvider>
    </Provider>,
  );
})();
