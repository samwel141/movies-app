import React, { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';
import { toast } from 'react-toastify';

const Settings = () => {
    const [user, setUser] = useState({ username: '', email: '', password: '', genres: [] });
    const [genres, setGenres] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false); 

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('mov-token'); 
            try {
                const response = await apiClient.get('/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser({ ...response.data.user, password: '' });
            } catch (err) {
                console.log('Failed to fetch user profile');
            } finally {
                setLoading(false);
            }
        };

        const fetchGenres = async () => {
            try {
                const response = await apiClient.get('/genres');
                setGenres(response.data.genres);
            } catch (err) {
                setError('Failed to fetch genres');
            }
        };

        fetchProfile();
        fetchGenres();
    }, []);

    const handleGenreChange = async (e) => {
        const token = localStorage.getItem('token');
        const genreId = parseInt(e.target.value);
        const isChecked = e.target.checked;
        console.log(user);

        try {
            if (isChecked) {
                await apiClient.post(`/user/${user._id}/genres`, { genreId }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(prev => ({ ...prev, genres: [...prev.genres, genreId] }));
            } else {
                await apiClient.delete(`/user/${user._id}/genres`, {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { genreId }
                });
                setUser(prev => ({ ...prev, genres: prev.genres.filter(id => id !== genreId) }));
            }
            toast(`Genre ${isChecked ? 'added' : 'removed'} successfully`);
        } catch (err) {
            setError(`Failed to ${isChecked ? 'add' : 'remove'} genre`);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            await apiClient.put(`/user/${user._id}`, user, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast('User information updated successfully');
            setSuccess('Information updated');
            setShowForm(false);
        } catch (err) {
            setError('Failed to update user information');
        }
    };

    const handleUpdateClick = () => {
        setShowForm(true); 
    };
    const genresMap = genres.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
    }, {});

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    return (
        <div className="settings-container" style={styles.container}>
            <h2 style={styles.header}>Settings</h2>
            
            {!showForm ? (
                <>
                    <div style={styles.section}>
                        <h3 style={styles.subHeader}>User Information</h3>
                        <p style={styles.infoText}><strong>Username:</strong> {user.username}</p>
                        <p style={styles.infoText}><strong>Email:</strong> {user.email}</p>
                        <p style={styles.infoText}>
                            <strong>Your Favourite Genres: </strong> 
                           {user.genres.length > 0 
                                ? user.genres.map((genreId) => genresMap[genreId]).join(', ') 
                                : 'No genres selected'}
                        </p>
                        <button onClick={handleUpdateClick} style={styles.button}>Update</button>
                    </div>
                </>
            ) : (
                <>
                    <div style={styles.section}>
                        <h3 style={styles.subHeader}>Update Information</h3>
                        {error && <div style={styles.error}>{error}</div>}
                        {success && <div style={styles.success}>{success}</div>}
                        <form onSubmit={handleSubmit} style={styles.form}>
                            <div>
                                <label style={styles.label}>Username:</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={user.username}
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                            </div>
                            <div>
                                <label style={styles.label}>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    style={styles.input}
                                    disabled 
                                />
                            </div>
                            <div>
                                <label style={styles.label}>Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={user.password}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div style={styles.genreSection}>
                                <h4 style={styles.genreHeader}>Select Your Genres</h4>
                                {genres.map(genre => (
                                    <div key={genre.id} style={styles.genreItem}>
                                        <input
                                            type="checkbox"
                                            value={genre.id}
                                            checked={user.genres.includes(genre.id)}
                                            onChange={handleGenreChange}
                                        />
                                        <label style={styles.genreLabel}>{genre.name}</label>
                                    </div>
                                ))}
                            </div>

                            <button type="submit" style={styles.button}>Save</button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#141414', 
        color: '#ffffff',
        padding: '40px',
        borderRadius: '8px',
        maxWidth: '600px', 
        margin: 'auto',
    },
    header: {
        color: '#e50914', 
        textAlign: 'center',
        fontSize: '32px',
    },
    section: {
        marginBottom: '30px',
    },
    subHeader: {
        fontSize: '24px',
        color: '#e50914',
        marginBottom: '15px',
    },
    infoText: {
        fontSize: '18px', 
        marginBottom: '10px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '5px',
        fontSize: '16px',
    },
    input: {
        marginBottom: '15px',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #333',
        backgroundColor: '#222',
        color: '#fff',
        fontSize: '16px',
    },
    genreSection: {
        marginTop: '20px',
    },
    genreHeader: {
        fontSize: '20px',
        color: '#e50914',
        marginBottom: '10px',
    },
    genreItem: {
        marginBottom: '10px',
    },
    genreLabel: {
        marginLeft: '8px',
        fontSize: '16px',
    },
    button: {
        padding: '12px',
        backgroundColor: '#e50914',
        color: '#ffffff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    error: {
        color: 'red',
        textAlign: 'center',
    },
    success: {
        color: 'green',
        textAlign: 'center',
    },
    loading: {
        color: '#fff',
        textAlign: 'center',
    },
};

export default Settings;
