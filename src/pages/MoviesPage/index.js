

import React, { useState } from 'react';
import {
    Box,
    CssBaseline,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Toolbar,
} from '@mui/material';
import Movies from '../Movies';
import Dashboard from '../Dashboard';
import Settings from '../Settings';

const drawerWidth = 240; 

const MoviesPage = () => {
    const [selectedMenu, setSelectedMenu] = useState('Movies');

    const handleMenuClick = (menu) => {
        setSelectedMenu(menu);
    };

    const renderContent = () => {
        switch (selectedMenu) {
            case 'Movies':
                return <Movies />;
            case 'Dashboard':
                return <Dashboard />;
            case 'Settings':
                return <Settings />;
            default:
                return <div variant="h6">Select a menu option</div>;
        }
    };

    return (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 155px)', justifyContent: 'center', backgroundColor: '#141414' }}>
            <CssBaseline />
            <Drawer
                variant="permanent"
                sx={{
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        height: 'calc(100vh - 155px)', 
                        backgroundColor: '#141414',
                        mt: '80px', 
                        ml: '20px', 
                    },
                }}
            >
                <List>
                    {['Movies', 'Dashboard', 'Settings'].map((text) => (
                        <ListItem 
                            button 
                            key={text} 
                            onClick={() => handleMenuClick(text)}
                            sx={{
                                backgroundColor: selectedMenu === text ? 'rgba(155, 23, 23, 0.5)' : '#141414', 
                                transition: 'background-color 0.3s ease', 
                                '&:hover': {
                                    backgroundColor: 'rgba(211, 211, 211, 0.6)',
                                },
                            }}
                            
                        >
                            <ListItemText 
                                primary={
                                    <span style={{ fontSize: '23px', fontWeight: 500 }}>
                                        {text}
                                    </span>
                                } 
                                sx={{ color: 'white' }} 
                            />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Box
            component="main"
            sx={{
                flexGrow: 1,
                bgcolor: '#808080',
                ml: `${drawerWidth}px`,
                width: `calc(100% - ${drawerWidth}px)`,
                height: '83vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                overflowY: 'auto',
                padding: '20px',
            }}
            >
            {renderContent()}
            </Box>

        </Box>
    );
};

export default MoviesPage;
