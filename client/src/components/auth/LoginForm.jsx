// components/auth/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { authState } from '../../recoil/atoms/authAtom';
import { loginUser } from '../../services/authService';
import Button from '../common/Button';
import Input from '../common/Input';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await loginUser(formData);
      
      if (result.success) {
        setAuth({
          isAuthenticated: true,
          isLoading: false,
          user: result.data.user,
          token: result.data.token
        });
        navigate('/');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      setError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-900/30 text-red-200 text-sm border border-red-800">
          {error}
        </div>
      )}
      
      <Input
        type="email"
        name="email"
        label="Email Address"
        placeholder="your@email.com"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      <Input
        type="password"
        name="password"
        label="Password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        required
      />
      
      <div className="flex justify-end">
        <Button type="submit" isLoading={isLoading} fullWidth>
          Login
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;