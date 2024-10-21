
import React, { useState, useEffect } from 'react';
import {
    Box,
    CssBaseline,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    List,
    ListItem,
    ListItemText,
    useMediaQuery,
} from '@mui/material';
import { toast } from 'react-toastify';
import Movies from '../Movies';
import Dashboard from '../Dashboard';
import Settings from '../Settings';
import MenuIcon from '@mui/icons-material/Menu';

const MoviesPage = () => {
    const [selectedMenu, setSelectedMenu] = useState('Movies');
    const [activeMenu, setActiveMenu] = useState('Movies');
    const [anchorEl, setAnchorEl] = useState(null);
    const isMobile = useMediaQuery('(max-width:600px)'); // Adjust this threshold as needed
    
    const handleMenuClick = (menu) => {
        setSelectedMenu(menu);
        setAnchorEl(null); // Close the menu after selection
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
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

    useEffect(() => {
        const token = localStorage.getItem('mov-token');

        if ((selectedMenu === 'Dashboard' || selectedMenu === 'Settings') && !token) {
            toast.info(`You must be logged in to access the ${selectedMenu}.`);
            setActiveMenu('Movies');
            setSelectedMenu('Movies'); 
        } else {
            setActiveMenu(selectedMenu); 
        }
    }, [selectedMenu]); 

    return (
        <Box sx={{ 
            display: 'flex', 
            height: 'calc(100vh - 155px)', 
            paddingTop: '15px',
            justifyContent: 'flex-start',
            backgroundColor: '#141414', 
            flexDirection: { xs: 'column', sm: 'row' }, 
        }}>
            <CssBaseline />
            <Toolbar  sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            paddingTop: {
                            xs: '0px',   
                            sm: '25px', 
                            }
                        }}>
                {isMobile ? (
                    <>
                        <IconButton
                            onClick={handleMenuOpen}
                            sx={{ color: 'white' }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            sx={{ mt: '40px' }} 
                        >
                            {['Movies', 'Dashboard', 'Settings'].map((text) => (
                                <MenuItem 
                                    key={text} 
                                    onClick={() => handleMenuClick(text)}
                                    sx={{
                                        backgroundColor: activeMenu === text ? 'rgba(155, 23, 23, 0.9)' : '#141414', 
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'rgba(211, 211, 211, 0.6)',
                                        },
                                    }}
                                >
                                    {text}
                                </MenuItem>
                            ))}
                        </Menu>
                    </>
                ) : (
                    <List>
                        {['Movies', 'Dashboard', 'Settings'].map((text) => (
                            <ListItem 
                                button 
                                key={text} 
                                onClick={() => handleMenuClick(text)}
                                sx={{
                                    backgroundColor: activeMenu === text ? 'rgba(155, 23, 23, 0.5)' : '#141414', 
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
                )}
            </Toolbar>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'rgb(20, 20, 20)',
                    width: '100%', 
                    height: '83vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    overflowY: 'auto',
                    padding: {
                        xs: '0px',
                        sm: '20px'
                    }
                }}
            >
                {renderContent()}
            </Box>
        </Box>
    );
};

export default MoviesPage;
