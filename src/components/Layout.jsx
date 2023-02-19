import React from 'react'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import Header from './Header';
import { Outlet } from 'react-router-dom';
const theme = createTheme({
    palette:{
        mode:"light",
    }
});
function Layout() {
  return (
    <ThemeProvider theme={theme}>
        {/* CSS Baseline fixes some inconsistencies across browsers and devices while providing resets that are better tailored to fit Material UI than alternative global style sheets like normalize.css */}
        <CssBaseline/>
        <Header/>
        <main><Outlet/></main>
        <footer></footer>
    </ThemeProvider>
  )
}

export default Layout