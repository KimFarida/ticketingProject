import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './signUp.css';

import axios from 'axios';

function SignUpPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const signUpData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            gender: gender,
            address: address,
            phone_number: phoneNumber
        };

        axios.post('http://your-backend-url/api/register/', signUpData)
            .then(response => {
                setSuccess('User created successfully!');
                setError('');
            })
            .catch(err => {
                setError('There was an error signing up.');
                setSuccess('');
            });
    };

    return (
        <div>
            <div className='header'>
                <h1> <span>X</span> Cash</h1>
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
                            required
                        />
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label>Address:</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Phone Number:</label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
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
