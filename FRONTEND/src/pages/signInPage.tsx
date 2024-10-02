import React, { useState } from "react";
import axios from "axios";

function SignInPage() {
  const [loginIdOrEmail, setLoginIdOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let signInData = {
      password: password,
    };

    axios
      .post("http://your-backend-url/api/login/", signInData)
      .then((response) => {
        setSuccess("User signed in successfully!" + response);
        setError("");
      })
      .catch((err) => {
        setError("There was an error signing in: " + err.message);
        setSuccess("");
      });
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
            <div>
              <label>Enter Login ID or Email</label>
              <input
                type="text"
                value={loginIdOrEmail}
                onChange={(e) => setLoginIdOrEmail(e.target.value)}
                placeholder="Enter your login ID or email"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Error and Success Messages */}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            {/* Submit Button */}
            <button type="submit">Sign In</button>

          </form>
        </div>
      </div>
    </>
  );
}

export default SignInPage;
