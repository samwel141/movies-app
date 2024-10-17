import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ClientRoutes from './routes/clientRoutes';
import Layout from './routes/layout';
import './App.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
const backgroundImageUrl = `${process.env.PUBLIC_URL}/assets/images/image.png`;
function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App"  style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
        <Layout>
        <ClientRoutes />
        </Layout>
      </div>
    </ThemeProvider>
  );
}

export default App;
