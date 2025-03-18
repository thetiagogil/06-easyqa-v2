"use client";

import { extendTheme } from "@mui/joy";

export const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          "50": "#f0fdf4",
          "100": "#dcfce7",
          "200": "#bbf7d0",
          "300": "#86efac",
          "400": "#4ade80",
          "500": "#22c55e",
          "600": "#16a34a",
          "700": "#15803d",
          "800": "#166534",
          "900": "#14532d",
        },
      },
    },
  },
  components: {
    JoyLink: {
      styleOverrides: {
        root: () => ({
          transition: "0.3s",
        }),
      },
    },
    JoyButton: {
      styleOverrides: {
        root: () => ({
          transition: "0.3s",
        }),
      },
    },
    JoySelect: {
      styleOverrides: {
        root: () => ({
          transition: "0.3s",
        }),
      },
    },
    JoyIconButton: {
      styleOverrides: {
        root: () => ({
          transition: "0.3s",
        }),
      },
    },
  },
});
