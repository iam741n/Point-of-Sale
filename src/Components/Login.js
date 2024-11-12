import React from 'react';
import '../Styles/Login.css';
import { Link } from 'react-router-dom';

function Login() {
    return (
        <div className="login-body">
            <div className="login-container">
                <div className="login-card">
                    <h1 className="logo">Virtual Rides</h1>
                    
                    <div className="form-group">
                        <input type="text" className="form-control username-input" placeholder="Username" />
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control password-input" placeholder="Password" />
                    </div>
                    
                   <Link to="/Dashboard"><button type="button" className=" login-button">Log In</button></Link> 

                          {/* Not registered yet link */}
                          <div className="register-link">
                        Not registered yet?{' '}
                        <a
                            href="/Signup"
                            className="create-account-link"
                          
                        >
                            Create an account
                        </a>
                        </div>
                </div>
            </div>
        </div>  
    );
}

export default Login;
