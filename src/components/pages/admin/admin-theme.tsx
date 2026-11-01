import { createTheme } from "@mui/material/styles";

export const adminTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#39a0ed",
      dark: "#2187d0",
      light: "#75baf2",
      contrastText: "#071521",
    },
    secondary: {
      main: "#df896c",
      dark: "#b8614a",
      light: "#f0ad91",
      contrastText: "#20100b",
    },
    background: { default: "#0c141c", paper: "#131e28" },
    text: { primary: "#e6f0f8", secondary: "#9fb3c3" },
    divider: "#293b4b",
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
      styleOverrides: { body: { backgroundColor: "#0c141c" } },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#111b24",
          color: "#e6f0f8",
          boxShadow: "none",
          borderBottom: "1px solid #293b4b",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#111b24",
          borderRight: "1px solid #293b4b",
          backgroundImage: "none",
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
          border: "1px solid #293b4b",
        },
      },
    },
    MuiButton: {
      styleOverrides: { root: { borderRadius: 6, fontWeight: 600 } },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(even)": { backgroundColor: "#172431" },
          "&:hover": { backgroundColor: "#1b3042" },
        },
      },
    },
    MuiTableCell: { styleOverrides: { root: { borderColor: "#293b4b" } } },
  },
});
