import React, { useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";

import { ptBR } from "@material-ui/core/locale";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import ColorModeContext from "./layout/themeContext";

import Routes from "./routes";

const queryClient = new QueryClient();

const App = () => {
    const [locale, setLocale] = useState();

    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const preferredTheme = window.localStorage.getItem("preferredTheme");
    const [mode, setMode] = useState(preferredTheme ? preferredTheme : prefersDarkMode ? "dark" : "light");

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
            },
        }),
        []
    );

    const theme = createTheme(
        {
            scrollbarStyles: {
                "&::-webkit-scrollbar": {
                    width: '8px',
                    height: '8px',
                },
                "&::-webkit-scrollbar-thumb": {
                    boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
                    backgroundColor: "#e8e8e8",
                },
            },
            scrollbarStylesSoft: {
                "&::-webkit-scrollbar": {
                    width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: mode === "light" ? "#FFFFFF" : "#0F1B20",
                },
            },
             palette: {
                type: mode,
                primary: { main: mode === "light" ? "#34DD3B" : "#34DD3B" },
                secondary: { main: mode === "light" ? "#34DD3B" : "#34DD3B" },
                textPrimary: mode === "light" ? "#0F1B20" : "#FFFFFF",
                background: {
                    default: mode === "light" ? "#FFFFFF" : "#0F1B20",
                    paper: mode === "light" ? "#FFFFFF" : "#1C2E36",
                },
                
                borderPrimary: mode === "light" ? "#34DD3B" : "#FFFFFF",
                dark: { main: mode === "light" ? "#1C2E36" : "#FFFFFF" },
                light: { main: mode === "light" ? "#FFFFFF" : "#1C2E36" },
                tabHeaderBackground: mode === "light" ? "#FFFFFF" : "#1C2E36", 
                optionsBackground: mode === "light" ? "#F1F5F5" : "#0F1B20", 
                options: mode === "light" ? "#FFFFFF" : "#1C2E36", 
                fontecor: mode === "light" ? "#0F1B20" : "#FFFFFF",
                fancyBackground: mode === "light" ? "#F1F5F5" : "#0F1B20", 
                bordabox: mode === "light" ? "#F1F5F5" : "#0F1B20", 
                newmessagebox: mode === "light" ? "#F1F5F5" : "#0F1B20", 
                inputdigita: mode === "light" ? "#FFFFFF" : "#1C2E36", 
                contactdrawer: mode === "light" ? "#FFFFFF" : "#1C2E36", 
                announcements: mode === "light" ? "#FFFFFF" : "#1C2E36", 
                login: mode === "light" ? "#FFFFF" : "#1C1C1C",
                announcementspopover: mode === "light" ? "#FFFFFF" : "#1C2E36", 
                chatlist: mode === "light" ? "#1C2E36" : "#1C2E36", //
                boxlist: mode === "light" ? "#E7ECEE" : "#2E4C59",
                boxchatlist: mode === "light" ? "#ededed" : "#1C2E36", 
                total: mode === "light" ? "#fff" : "#222",
                messageIcons: mode === "light" ? "ff0378" : "#F3F3F3",
                inputBackground: mode === "light" ? "#FFFFFF" : "#1C2E36", 
                barraSuperior: mode === "light" ? "linear-gradient(to right, #0F1B20, #1C2E36, #2E4C59)" : "linear-gradient(to right, #0F1B20, #1C2E36, #2E4C59)", //Barra Horizontal
                boxticket: mode === "light" ? "#1C2E36" : "#1C2E36", 
                listaInterno: mode === "light" ? "#E7ECEE" : "#2E4C59",
                campaigntab: mode === "light" ? "#FFFFFF" : "#1C2E36",
                fundoBackground: mode === "light" ? "#FFFFFF" : "#1C2E36", 
                corIconespaginas: mode === "light" ? "#34DD3B" : "#34DD3B",
                corIconesbarra: mode === "light" ? "#1C2E36" : "#34DD3B",
                corTextobarra: mode === "light" ? "#0F1B20" : "#FFFFFF",
                corTextosuporte: mode === "light" ? "#0F1B20" : "#FFFFFF",
                fundologoLateral: mode === "light" ? "linear-gradient(to right, #0F1B20, #0F1B20, #0F1B20)" : "linear-gradient(to right, #0F1B20, #0F1B20, #0F1B20)", 
                barraLateral: mode === "light" ? "linear-gradient(to right, #F1F5F5, #FFFFFF, #F1F5F5)" : "linear-gradient(to right, #0F1B20, #0F1B20, #0F1B20)", 
            },
            mode,
        },
        locale
    );

    useEffect(() => {
        const i18nlocale = localStorage.getItem("i18nextLng");
        const browserLocale =
            i18nlocale.substring(0, 2) + i18nlocale.substring(3, 5);

        if (browserLocale === "ptBR") {
            setLocale(ptBR);
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem("preferredTheme", mode);
    }, [mode]);


    return (
        <ColorModeContext.Provider value={{ colorMode }}>
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <Routes />
                </QueryClientProvider>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default App;
