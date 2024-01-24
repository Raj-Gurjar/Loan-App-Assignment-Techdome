// SignUp.js
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './log.scss';
import { Link } from 'react-router-dom';
import Loader from '../Loader/Loader'; // Import the Loader component

export default function SignUp({ setIsLoggedIn, userType }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isAdmin: userType,
  });
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state

  async function signUpHandler(event) {
    event.preventDefault(); // Prevents the default form submission behavior

    // Password length validation
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    try {
      setIsLoading(true); // Set isLoading to true when signing up

      const response = await fetch('http://localhost:4000/api/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const res_data = await response.json();
        console.log("res from server", res_data);
         
        
        toast.success('Account Created Successfully 😊');
        setIsLoggedIn(true);
        localStorage.setItem("token", res_data.token);
        localStorage.setItem("user", JSON.stringify(res_data.user));
        
        navigate('/login');
      } else {
        const errorMessage = await response.json();
        toast.error(`Signup failed: ${errorMessage.message}`);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    } finally {
      setIsLoading(false); // Set isLoading to false when signup is complete or fails
    }
  }

  function changeHandler(event) {
    const { name, value, checked, type } = event.target;

    // Add password length validation
   

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: type === 'checkbox' ? checked : value,
      };
    });
  }

  return (
    <div className="log-container" data-aos="fade-right" data-dos-delay='10'>
      <h2 className='log-heading'>Sign Up</h2>

      <form className="log-form" onSubmit={signUpHandler}>
        <h4>Sign Up as {(userType === true) ? 'Admin' : 'Customer'}</h4>

        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="name"
          value={formData.name}
          onChange={changeHandler}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={changeHandler}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={changeHandler}
          required
        />

        <button type="submit">Sign Up</button>

        {/* Show the loader if isLoading is true */}
        {isLoading && (
          <div className="loader-container">
            <Loader />
          </div>
        )}

        <div>
          <h5>Already Signed Up?</h5>
          <Link to='/login'><btn className='btn'>Login as {userType ? 'Admin' : 'Customer'}</btn></Link>
        </div>
      </form>
    </div>
  );
}
