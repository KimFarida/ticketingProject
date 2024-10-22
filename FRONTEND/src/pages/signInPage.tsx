import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignInPage() {
  const [loginIdOrEmail, setLoginIdOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const signInData = {
      email_or_login_id: loginIdOrEmail,
      password: password,
    };

    try {
      // Clear previous error messages
      setError("");

      // Make the sign-in request
      const response = await axios.post(
        "/api/account/login/",
        signInData
      );

      if (response.status === 200) {
        console.log(response.data); // Log the response data for debugging
        setSuccess("User signed in successfully!");

        // Store authentication tokens or user data
        const token = response.data.token;
        if (!token) {
          setError("Token not provided in the response.");
          return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("currentUserId", response.data.user_id);
        localStorage.setItem("userRole", response.data.user_role);

        // Set the default Authorization header for future requests
        axios.defaults.headers.common["Authorization"] = `Token ${token}`;

        // Navigate after a successful login
        setTimeout(() => {
          navigate("/agent");
        }, 2000);
      } else {
        setError("Failed to sign in. Please check your credentials.");
        setSuccess("");
      }
    } catch (err) {
      // Handle Axios errors and other errors
      if (axios.isAxiosError(err)) {
        console.error("Axios error response:", err.response?.data);
        setError(
          "There was an error signing in: " +
            (err.response?.data?.message || err.message)
        );
      } else if (err instanceof Error) {
        setError("There was an error: " + err.message);
      } else {
        setError("An unknown error occurred during sign-in.");
      }
      setSuccess(""); // Clear any success message in case of an error
    }
  };

  return (
    <>
      <div>
        <div className="header">
          <h1>
            <span>X</span> Cash
          </h1>
        </div>
        <div className="container">
          <form onSubmit={handleSignIn} className="form">
            <h1>Sign In</h1>

            {/* Combined Login ID or Email Input */}
            <div className="form-group">
              <label htmlFor="loginIdOrEmail">Enter Login ID or Email</label>
              <input
                type="text"
                id="loginIdOrEmail"
                value={loginIdOrEmail}
                onChange={(e) => setLoginIdOrEmail(e.target.value)}
                placeholder="Enter your login ID or email"
                required
                className="input"
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="input"
              />
            </div>

            {/* Error and Success Messages */}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            {/* Submit Button */}
            <button type="submit" className="btn">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignInPage;
