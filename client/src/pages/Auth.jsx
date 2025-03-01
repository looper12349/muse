// pages/Auth.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { BackgroundBeams } from '../lib/aceternity-ui/background-beams';
import { SparklesCore } from '../lib/aceternity-ui/sparkles';

const Auth = () => {
  const [authMode, setAuthMode] = useState('login');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-black">
      <BackgroundBeams />
      
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticles"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      
      <div className="z-10 flex flex-col items-center max-w-md w-full px-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">DSA Teaching Assistant</h1>
          <p className="text-gray-300">Your AI-powered data structures and algorithms companion</p>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-xl border border-gray-800 shadow-2xl overflow-hidden"
        >
          <div className="flex w-full border-b border-gray-800">
            <button
              className={`w-1/2 py-4 text-center transition-colors ${
                authMode === 'login' ? 'text-white bg-gray-800' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setAuthMode('login')}
            >
              Login
            </button>
            <button
              className={`w-1/2 py-4 text-center transition-colors ${
                authMode === 'register' ? 'text-white bg-gray-800' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setAuthMode('register')}
            >
              Register
            </button>
          </div>
          
          <div className="p-6">
            {authMode === 'login' ? <LoginForm /> : <RegisterForm />}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;