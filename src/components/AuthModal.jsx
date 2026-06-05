import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { loginApi, signupApi, googleAuthApi, updateProfileApi } from '../api';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const emptySignup = { name: "", phone: "", email: "", password: "" };
const emptyLogin = { email: "", password: "" };

export default function AuthModal() {
  const { currentAccount, showSignup, setShowSignup, showAccount, setShowAccount, accountMode, setAccountMode, saveAccount, logout, setView } = useAppContext();
  
  const [signup, setSignup] = useState(emptySignup);
  const [login, setLogin] = useState(emptyLogin);
  const [profile, setProfile] = useState({ name: "", phone: "", address: "" });

  React.useEffect(() => {
    if (currentAccount) {
      setProfile({
        name: currentAccount.name || "",
        phone: currentAccount.phone || "",
        address: currentAccount.address || "",
      });
    }
  }, [currentAccount]);

  async function submitProfile(event) {
    event.preventDefault();
    await toast.promise(
      updateProfileApi(profile, currentAccount.id || currentAccount.email).then(updated => {
        saveAccount(updated);
      }),
      {
        loading: 'Updating profile...',
        success: 'Profile updated successfully.',
        error: (err) => err.message,
      }
    );
  }

  function closeSignup() {
    setShowSignup(false);
  }

  async function handleGoogleSuccess(credentialResponse) {
    await toast.promise(
      googleAuthApi(credentialResponse.credential).then(account => {
        saveAccount(account);
        setShowSignup(false);
        setShowAccount(false);
      }),
      {
        loading: 'Logging in with Google...',
        success: 'Google login successful.',
        error: (err) => err.message,
      }
    );
  }

  function handleGoogleError() {
    toast.error("Google Sign-In failed or was cancelled.");
  }

  async function submitSignup(event) {
    event.preventDefault();
    await toast.promise(
      signupApi(signup).then(account => {
        saveAccount(account);
        setSignup(emptySignup);
        closeSignup();
        setShowAccount(false);
      }),
      {
        loading: 'Creating account...',
        success: 'User account created.',
        error: (err) => err.message,
      }
    );
  }

  async function submitLogin(event) {
    event.preventDefault();
    await toast.promise(
      loginApi(login.email, login.password).then(account => {
        saveAccount(account);
        if (account.role === "admin") window.adminPassword = login.password;
        setLogin(emptyLogin);
        setShowAccount(false);
        setShowSignup(false);
        return account;
      }),
      {
        loading: 'Logging in...',
        success: (account) => `${account.role === "admin" ? "Admin" : "User"} login successful.`,
        error: (err) => err.message,
      }
    );
  }

  if (showSignup) {
    return (
      <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="signup-title">
        <div className="signup-modal">
          <button type="button" className="modal-close" onClick={closeSignup} aria-label="Close signup">x</button>
          <div className="section-heading compact">
            <h2 id="signup-title">Welcome to Nilavalayam</h2>
          </div>
          <form className="account-form" onSubmit={submitSignup}>
            <label>Name<input required value={signup.name} onChange={(e) => setSignup({ ...signup, name: e.target.value })} placeholder="Your name" /></label>
            <label>Phone<input required value={signup.phone} onChange={(e) => setSignup({ ...signup, phone: e.target.value })} placeholder="WhatsApp number" /></label>
            <label>Email<input required type="email" value={signup.email} onChange={(e) => setSignup({ ...signup, email: e.target.value })} placeholder="you@example.com" /></label>
            <label>Password<input required minLength="6" type="password" value={signup.password} onChange={(e) => setSignup({ ...signup, password: e.target.value })} placeholder="Create password" /></label>
            <button type="submit" className="checkout-button">Create User Account</button>
          </form>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
          </div>
          <button type="button" className="skip-button" onClick={() => { closeSignup(); setShowAccount(true); setAccountMode("login"); }}>Already have account</button>
          <button type="button" className="skip-button" onClick={closeSignup}>Skip for now</button>
        </div>
      </div>
    );
  }

  if (showAccount) {
    return (
      <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="account-title">
        <div className="signup-modal">
          <button type="button" className="modal-close" onClick={() => setShowAccount(false)} aria-label="Close account">x</button>
          <div className="section-heading compact">
            <p>{currentAccount ? currentAccount.role : "Account"}</p>
            <h2 id="account-title">{currentAccount ? currentAccount.name : "Login or Signup"}</h2>
          </div>

          {currentAccount ? (
            <>
              <form className="account-form" onSubmit={submitProfile}>
                <label className="wide-field">Email<input disabled value={currentAccount.email} style={{ opacity: 0.7 }} /></label>
                <label>Name<input required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></label>
                <label>Phone<input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="WhatsApp number" /></label>
                <label className="wide-field">Address<textarea rows="3" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} placeholder="Shipping address" /></label>
                <button type="submit" className="checkout-button">Save Profile</button>
              </form>
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {currentAccount.role === "admin" && (
                  <button type="button" className="google-button" onClick={() => { setShowAccount(false); setView("admin"); }}>Open Upload Panel</button>
                )}
                <button type="button" className="skip-button" onClick={logout}>Logout</button>
              </div>
            </>
          ) : accountMode === "login" ? (
            <>
              <form className="account-form" onSubmit={submitLogin}>
                <label>Email<input required type="email" value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} placeholder="Email" /></label>
                <label>Password<input required minLength="6" type="password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} placeholder="Password" /></label>
                <button type="submit" className="checkout-button">Login</button>
              </form>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
              </div>
              <button type="button" className="skip-button" onClick={() => setAccountMode("signup")}>Create user account</button>
            </>
          ) : (
            <>
              <form className="account-form" onSubmit={submitSignup}>
                <label>Name<input required value={signup.name} onChange={(e) => setSignup({ ...signup, name: e.target.value })} placeholder="Your name" /></label>
                <label>Phone<input required value={signup.phone} onChange={(e) => setSignup({ ...signup, phone: e.target.value })} placeholder="WhatsApp number" /></label>
                <label>Email<input required type="email" value={signup.email} onChange={(e) => setSignup({ ...signup, email: e.target.value })} placeholder="you@example.com" /></label>
                <label>Password<input required minLength="6" type="password" value={signup.password} onChange={(e) => setSignup({ ...signup, password: e.target.value })} placeholder="Create password" /></label>
                <button type="submit" className="checkout-button">Create User Account</button>
              </form>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', marginBottom: '1rem' }}>
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
              </div>
              <button type="button" className="skip-button" onClick={() => setAccountMode("login")}>Back to login</button>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}
