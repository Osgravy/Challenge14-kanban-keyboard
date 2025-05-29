import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Auth from '../utils/auth';
import { login } from "../api/authAPI";

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!loginData.username.trim() || !loginData.password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await login(loginData);
      Auth.login(data.token);
      navigate('/'); // Redirect to home page after successful login
    } catch (err) {
      console.error('Login failed:', err);
      setError(err instanceof Error ? err.message : 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <form className='form' onSubmit={handleSubmit}>
        <h1>Login</h1>
        
        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            id="username"
            type='text'
            name='username'
            value={loginData.username}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            id="password"
            type='password'
            name='password'
            value={loginData.password}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <button 
          type='submit' 
          disabled={loading || !loginData.username || !loginData.password}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;