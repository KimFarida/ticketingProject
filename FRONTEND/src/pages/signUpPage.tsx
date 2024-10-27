import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import './signUp.css';
import api from '../api/axios';
import { isAxiosError } from 'axios';
import AppLogo from '../images/profitplaylogo.png';

interface ValidationErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    gender?: string;
    address?: string;
    phoneNumber?: string;
}

function SignUpPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('+234');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const countryCodes = [
        { code: '+234', country: 'Nigeria' },
        { code: '+233', country: 'Ghana' },
        { code: '+27', country: 'South Africa' },
        { code: '+254', country: 'Kenya' },
        { code: '+256', country: 'Uganda' },
        { code: '+255', country: 'Tanzania' },
        { code: '+251', country: 'Ethiopia' },
        { code: '+20', country: 'Egypt' },
        { code: '+212', country: 'Morocco' },
        { code: '+216', country: 'Tunisia' }
    ];

    const validateForm = (): boolean => {
        const errors: ValidationErrors = {};
        let isValid = true;

        // First Name validation
        if (firstName.length < 2) {
            errors.firstName = 'First name must be at least 2 characters long';
            isValid = false;
        }

        // Last Name validation
        if (lastName.length < 2) {
            errors.lastName = 'Last name must be at least 2 characters long';
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.email = 'Please enter a valid email address';
            isValid = false;
        }

        if (password.length < 8){
             errors.password = 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character';
             isValid = false;
        }

        // Confirm Password validation
        if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        // Gender validation
        if (!gender) {
            errors.gender = 'Please select a gender';
            isValid = false;
        }

        // Address validation
        if (address.length < 5) {
            errors.address = 'Please enter a valid address';
            isValid = false;
        }

        // Phone number validation
        try {
            const fullPhoneNumber = countryCode + phoneNumber.replace(/^\+/, '');
            if (!isValidPhoneNumber(fullPhoneNumber)) {
                errors.phoneNumber = 'Please enter a valid phone number';
                isValid = false;
            }
        } catch (err) {
            errors.phoneNumber = 'Please enter a valid phone number';
            isValid = false;
        }

        setValidationErrors(errors);
        return isValid;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow numbers
        const value = e.target.value.replace(/[^\d]/g, '');
        setPhoneNumber(value);
    };

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        const fullPhoneNumber = countryCode + phoneNumber.replace(/^\+/, '');

        const signUpData = {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            gender: gender || null,
            address,
            phone_number: fullPhoneNumber,
        };

        localStorage.clear();
        try {
            const response = await api.post(
                '/api/account/register/',
                signUpData
            );

            if (response.status === 200 || response.status === 201) {
                setSuccess('User created successfully!');
                setError('');
                // Reset form
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setGender('');
                setAddress('');
                setPhoneNumber('');
                setCountryCode('+234');

                // Navigate after success
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            } else {
                setError('Unexpected response status.');
            }
        } catch (err) {
            if (isAxiosError(err)) {
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
                        {validationErrors.firstName &&
                            <span className="error-message">{validationErrors.firstName}</span>
                        }
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
                        {validationErrors.lastName &&
                            <span className="error-message">{validationErrors.lastName}</span>
                        }
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
                        {validationErrors.email &&
                            <span className="error-message">{validationErrors.email}</span>
                        }
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={8}
                            maxLength={128}
                            required
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            Show Password
                        </label>
                        {validationErrors.password &&
                            <span className="error-message">{validationErrors.password}</span>
                        }
                    </div>
                    <div>
                        <label>Confirm Password:</label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={showConfirmPassword}
                                onChange={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                            Show Password
                        </label>
                        {validationErrors.confirmPassword &&
                            <span className="error-message">{validationErrors.confirmPassword}</span>
                        }
                    </div>
                    <div>
                        <label>Gender:</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                        {validationErrors.gender &&
                            <span className="error-message">{validationErrors.gender}</span>
                        }
                    </div>
                    <div>
                        <label>Address:</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                        {validationErrors.address &&
                            <span className="error-message">{validationErrors.address}</span>
                        }
                    </div>
                    <div>
                        {/* Country Code Select */}
                        <div className="country-code-container">
                            <label>Country Code:</label>
                            <select
                                value={countryCode}
                                onChange={(e) => setCountryCode(e.target.value)}
                                className="country-code-select"
                            >
                                {countryCodes.map(country => (
                                    <option key={country.code} value={country.code}>
                                        {country.country} ({country.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Phone Number Input */}
                        <div className="phone-number-container">
                            <label>Phone Number:</label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                placeholder="Enter phone number"
                                className="phone-number-input"
                                maxLength={14}
                                required
                            />
                        </div>
                    {validationErrors.phoneNumber &&
                        <span className="error-message">{validationErrors.phoneNumber}</span>
                    }
            </div>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <button type="submit">Sign Up</button>

            <p>
                Already have an account?
                <Link to="/signin" className="signInLink"> Sign In</Link>
            </p>
        </form>
</div>
</div>
)
    ;
}

export default SignUpPage;
