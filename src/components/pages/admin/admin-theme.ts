import { createTheme } from "@mui/material/styles";

export const adminTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4B9FE8",
      dark: "#3184CC",
      light: "#80B9EC",
      contrastText: "#081521",
    },
    secondary: {
      main: "#D99478",
      dark: "#BD755B",
      light: "#EAB39A",
      contrastText: "#21120D",
    },
    background: {
      default: "#101923",
      paper: "#182532",
    },
    text: {
      primary: "#E8EFF5",
      secondary: "#A5B5C4",
    },
    divider: "#293B4B",
    error: {
      main: "#F08080",
    },
    success: {
      main: "#65C99A",
    },
    warning: {
      main: "#E9B96E",
    },
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
      styleOverrides: {
        body: { backgroundColor: "#101923" },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#141F2A",
          color: "#E8EFF5",
          boxShadow: "none",
          borderBottom: "1px solid #293B4B",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#141F2A",
          borderRight: "1px solid #293B4B",
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
          border: "1px solid #293B4B",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          fontWeight: 600,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: "6px" },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: { borderRadius: "6px" },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: 48,
          borderRadius: "6px",
          backgroundColor: "#141F2A",
          transition: "border-color 140ms ease, box-shadow 140ms ease",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#354B5E",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#80B9EC",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#4B9FE8",
            borderWidth: 2,
          },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F08080",
          },
          "&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
          },
        },
        input: {
          textAlign: "left",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#A5B5C4",
          fontWeight: 500,
          "&.Mui-focused": { color: "#80B9EC" },
          "&.Mui-error": { color: "#F08080" },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginRight: 0,
          lineHeight: 1.5,
          "&.Mui-error": { color: "#F08080" },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: { overflowX: "auto" },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: "background-color 140ms ease",
          "&:nth-of-type(even)": {
            backgroundColor: "#1B2A37",
          },
          "&:hover": {
            backgroundColor: "#243747",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: "#293B4B" },
        head: { borderBottom: "1px solid #40576A" },
      },
    },
  },
});
