import React from 'react'

function Home() {
  return (
    <div id="container" class="home-container">
        <div class="home-header">
            <h2>JOIN US</h2>
        </div>
        <div class="home-content">
            <form>
                <input type="email" placeholder="Enter your email" />
                <button type="submit">Submit</button>
            </form>
        </div>
    </div>
  )
}

export default Home