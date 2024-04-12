'use client';

import { createTheme } from "@mui/material/styles";
import { Roboto } from "next/font/google";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { Colors } from "./colors";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

declare module "@mui/material/styles" {
  interface Components {}
}

export const theme = createTheme({
  palette: {
    mode: "light",
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {},
});
