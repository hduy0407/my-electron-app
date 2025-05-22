import React from "react";

const Signin = () => {
    return (
        <div id="container" className="signin-container">
            <div className="signin-header">
                <h2>SIGN IN</h2>
            </div>
            <div className="signin-content">
                <form>
                    <input type="email" placeholder="Username" />
                    <input type="password" placeholder="Password" />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Signin;