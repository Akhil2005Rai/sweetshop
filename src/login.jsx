import './App.css';
import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import authLogo from "./assets/authimage.png";
import { PulseLoader } from "react-spinners";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [register, setRegister] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [userUid, setUserUid] = useState(null);

  //  Monitor email verification automatically
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload(); // Refresh user data
        if (user.emailVerified) {
          // Update Firestore verification status
          await updateDoc(doc(db, "users", user.uid), { emailVerified: true });
          localStorage.setItem("user", JSON.stringify(user));
          onLogin(user);
        }
      }
    });
    return () => unsubscribe();
  }, [onLogin]);

  //  Handle Login
  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError("Please verify your email before logging in.");
        await auth.signOut();
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //  Handle Register
  const handleRegister = async () => {
    if (!email || !password || !gender || !dob || !username) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username,
        email: user.email,
        gender,
        dob,
        createdAt: new Date().toISOString(),
        emailVerified: false,
      });

      setUserUid(user.uid);
      setShowVerify(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      register ? handleRegister() : handleLogin();
    }
  };

  //  Verification Screen
  if (showVerify) {
    return (
      <div className="main">
        <div className="left">
          <div className="early">
            <div className="body" id="whole">
              <div className="greet">Verify Your Email</div>
              <div className="desc">
                We’ve sent a verification link to <b>{email}</b>.<br />
                Please check your inbox (and spam folder) to verify your account.<br />
                Once verified, you’ll be automatically redirected to the app.
              </div>

              <div className="btn" onClick={() => window.location.reload()}>
                Refresh After Verification
              </div>
            </div>
          </div>
          <div className="bottom">Version 1.0.1</div>
        </div>

        <div className="right">
          <img src={authLogo} alt="Authentication Logo" className="auth-logo" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="main">
        <div className="left">
          <div className="early">
            <div className="placer">
              <div className="top">[Logo] Shree Hari Enterprises</div>
            </div>

            <div className="body">
              <div className="greet">{register ? "Create Account" : "Hello,"}</div>
              <div className="greet">{register ? "Join Us Today" : "Welcome Back"}</div>
              <div className="desc">
                {register ? "Register to continue" : "Login to continue"}
              </div>

              {/* Email */}
              <input
                type="text"
                className="inputs"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyPress}
              />

              {/* Username (Register Only) */}
              {register && (
                <input
                  type="text"
                  className="inputs"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
              )}

              {/* Password */}
              <input
                type="password"
                className="inputs"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyPress}
              />

              {/* Gender */}
              {register && (
                <select
                  className="inputs"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              )}

              {/* DOB */}
              {register && (
                <input
                  type="date"
                  className="inputs"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              )}

              {/* Error Message */}
              {error && <div className="error">{error}</div>}

              {/* Forgot Password */}
              {!register && (
                <div className="help">
                  <div className="forgot">Forgot password</div>
                </div>
              )}

              {/* Button */}
              <div className="btn" onClick={register ? handleRegister : handleLogin}>
                {loading ? (
                  <PulseLoader color="rgba(251, 250, 255, 1)" size={8} speedMultiplier={0.8} />
                ) : register ? (
                  "Register"
                ) : (
                  "Login"
                )}
              </div>

              {/* Toggle Register/Login */}
              <div className="info">
                {register ? (
                  <>
                    Already have an account?{" "}
                    <div className="reg" onClick={() => setRegister(false)}>
                      Login
                    </div>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <div className="reg" onClick={() => setRegister(true)}>
                      Register
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bottom">Version 1.0.1</div>
        </div>

        <div className="right">
          <img src={authLogo} alt="Authentication Logo" className="auth-logo" />
        </div>
      </div>
    </>
  );
}

export default Login;
