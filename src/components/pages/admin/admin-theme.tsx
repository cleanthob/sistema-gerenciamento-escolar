import { createTheme } from "@mui/material/styles";

export const adminTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#174f43",
      dark: "#103d34",
      light: "#43806c",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#b65b40",
      dark: "#873f2c",
      light: "#d48768",
      contrastText: "#ffffff",
    },
    background: { default: "#f3f6ef", paper: "#ffffff" },
    text: { primary: "#203b34", secondary: "#687b71" },
    divider: "#e1e8df",
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: "var(--font-sans), sans-serif",
    button: { fontWeight: 600, textTransform: "none" },
    h1: { fontWeight: 650 },
    h2: { fontWeight: 650 },
    h3: { fontWeight: 650 },
    h4: { fontWeight: 650 },
    h5: { fontWeight: 650 },
    h6: { fontWeight: 650 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: { body: { backgroundColor: "#f3f6ef" } },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#203b34",
          boxShadow: "none",
          borderBottom: "1px solid #e1e8df",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e1e8df",
          backgroundImage: "linear-gradient(180deg, #ffffff 0%, #fbfcf9 100%)",
          boxSizing: "border-box",
          width: "min(280px, calc(100vw - 1rem))",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "none",
          border: "1px solid #e1e8df",
        },
      },
    },
    MuiButton: {
      styleOverrides: { root: { borderRadius: 6, fontWeight: 600 } },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(even)": { backgroundColor: "#fbfcf9" },
          "&:hover": { backgroundColor: "#f1f6f0" },
        },
      },
    },
    MuiTableCell: { styleOverrides: { root: { borderColor: "#e8ede7" } } },
  },
});
