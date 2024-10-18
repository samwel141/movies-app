
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  
import { useAppContext } from '../../context/appContext';
import { toast } from 'react-toastify';  
import apiClient from '../../api/apiClient';

const GoogleCallback = () => {
    const navigate = useNavigate(); 
    const { setRefresh } = useAppContext(); 

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error');

        if (error) {
            toast.error('Google authentication failed.');
            return;
        }

        if (code) {
            apiClient.post('/auth/google/callback', { code })
                .then(response => {
                    const { token, refreshToken, user } = response.data;

                    localStorage.setItem('mov-token', token);
                    localStorage.setItem('refreshToken', refreshToken);
                    localStorage.setItem('mov-user', JSON.stringify(user));
                    setRefresh(true);
                    navigate('/'); 
                    

                    toast.success('Logged in successfully!');

                })
                .catch(error => {
                    
                    console.error('Error exchanging code:', error);
                    setRefresh(true);
                    navigate('/'); 
                });
        }
    }, []);

    return (
        <div>
            <h1>Logging in...</h1>
        </div>
    );
};

export default GoogleCallback;
