// components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { authState } from '../../recoil/atoms/authAtom';
import { registerUser } from '../../services/authService';
import Button from '../common/Button';
import Input from '../common/Input';

const RegisterForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
      const result = await registerUser(formData);
      
      if (result.success) {
        setAuth({
          isAuthenticated: true,
          isLoading: false,
          user: result.data.user,
          token: result.data.token
        });
        navigate('/');
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (error) {
      setError(error.message || 'Registration failed');
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
        type="text"
        name="name"
        label="Full Name"
        placeholder="John Doe"
        value={formData.name}
        onChange={handleChange}
        required
      />
      
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
        minLength={6}
      />
      
      <div className="flex justify-end">
        <Button type="submit" isLoading={isLoading} fullWidth>
          Create Account
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;