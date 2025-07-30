import React, { useState } from 'react';

const Register = ({ onRegisterSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Validaciones básicas
    if (!email || !password || !nombre) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!email.includes("@")) {
      setError("Email inválido");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, nombre }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Error al registrar");
      }

      setSuccessMsg("✅ Registro exitoso. Ya podés iniciar sesión.");
      setTimeout(() => {
        onRegisterSuccess(); // redirige o muestra login
      }, 1500);

    } catch (err) {
      setError(err.message || "Error en el registro");
    }
  };

  return (
    <div className="bg-[#0f172a] flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm text-center space-y-8">

        {/* Logo */}
        <div className="flex justify-center">
          <svg className="w-10 h-10 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a4 4 0 014 4v2a4 4 0 01-4 4V4zm12 0a4 4 0 00-4 4v2a4 4 0 004 4V4z" />
          </svg>
        </div>

        <h2 className="text-white text-2xl font-bold">Create a new account</h2>

        {/* Mensajes */}
        {error && (
          <div className="bg-red-500 text-white py-2 px-4 rounded-md text-sm">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-500 text-white py-2 px-4 rounded-md text-sm">
            {successMsg}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-300 mb-1">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Juan Pérez"
            />
          </div>

          {/* Email */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-300 mb-1">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition duration-200"
          >
            Sign up
          </button>
        </form>

        <p className="text-sm text-gray-400">
        Already registered?{' '}
        <button
            onClick={onRegisterSuccess}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
        >
            Sign in
        </button>
        </p>

      </div>
    </div>
  );
};

// Iconos
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268
         2.943 9.542 7-1.274 4.057-5.065 7-9.542
         7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7
         1.087-2.422 3.088-4.443 5.5-5.5M9.88 4.125A10.05
         10.05 0 0112 4c5 0 9.27 3.11 11 7-.457 1.017-1.07
         1.978-1.82 2.855M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export default Register;
