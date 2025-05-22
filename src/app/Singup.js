import React from 'react';

const Signup = () => {
    return (
        <div id="container" className="signup-container">
        <div className="signup-header">
            <h2>SIGN UP</h2>
        </div>
        <div className="signup-content">
            <form>
            <input type="email" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <input type="password" placeholder="Confirm Password" />
            <button type="submit">Submit</button>
            </form>
        </div>
        </div>
    );
}

export default Signup;