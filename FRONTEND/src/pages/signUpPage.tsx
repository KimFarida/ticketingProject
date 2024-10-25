import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signUp.css';
import axios from 'axios';
import  api from '../api/axios';
import AppLogo from '../images/profitplaylogo.png'

function SignUpPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('+234');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation checks
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const signUpData = {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            gender: gender || null, 
            address,
            phone_number: phoneNumber,
        };

        try {
            const response = await api.post(
                '/api/account/register/',
                signUpData,
                {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("token")}`, 
                    },
                }
                );
            
            if (response.status === 200 || response.status === 201) {
                setSuccess('User created successfully!');
                setError('');
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setGender('');
                setAddress('');
                setPhoneNumber('+234');

                // Authisation header
                axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;

                // Navigate after success
                setTimeout(() => {
                    navigate('/agent');
                }, 2000);
            } else {
                setError('Unexpected response status.');
            }
        } catch (err) {
            
            if (axios.isAxiosError(err)) {
                setError('There was an error signing up: ' + (err.response?.data?.message || err.message));
            } else if (err instanceof Error) {
                setError('An error occurred: ' + err.message);
            } else {
                setError('An unknown error occurred during sign-up.');
            }
        }
    };

    return (
        <div>
            <div className='header'>
                <div>
                <img src={AppLogo} alt="App Logo" className="w-24" />
                </div>
            </div>
            <div className='container'>
                <form onSubmit={handleSignUp} className='form'>
                    <h1>Sign Up</h1>
                    <div>
                        <label>First Name:</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            maxLength={150}
                            required
                        />
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            maxLength={150}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            maxLength={254}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={8}
                            maxLength={128}
                            required
                        />
                    </div>
                    <div>
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Gender:</label>
                        <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                            <option value="">Select Gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>
                    <div>
                        <label>Address:</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Phone Number:</label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            maxLength={14}
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    <button type="submit">Sign Up</button>

                    <p>
                        Already have an account? 
                        <Link to="/signin" className="signInLink"> Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignUpPage;
