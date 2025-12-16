import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiFeather,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ButtonLoader } from "../../Components/Private/Loader";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const nav = useNavigate();

  const [isLogin, setIsLogin] = useState(mode !== "signup");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === "signup") setIsLogin(false);
    if (mode === "login") setIsLogin(true);
  }, [mode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "Name is required";
      setIsLoading(false)
    }

    // Username validation for signup
    if (!isLogin && !formData.username.trim()) {
      newErrors.username = "Username is required";
      setIsLoading(false)
    } else if (!isLogin && formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      setIsLoading(false)
    } else if (!isLogin && !/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
        setIsLoading(false)
    }

    // For login, check if either email or username is provided
    if (isLogin) {
      if (!formData.email.trim()) {
        newErrors.email = "Email or username is required";
        setIsLoading(false)
      }
    } else {
      // For signup, email is required and must be valid
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
        setIsLoading(false)
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
        setIsLoading(false)
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      setIsLoading(false)
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      setIsLoading(false)
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
        setIsLoading(false)
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        setIsLoading(false)
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();

    if (validateForm()) {
      setTimeout(() => {
        nav("/home");
        setIsLoading(false);
      }, 5000);
      // nav("/home")

      console.log("Form submitted:", formData);
      console.log("Mode:", isLogin ? "Login" : "Register");

      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <h1 className="flex items-center gap-2 text-4xl font-bold text-slate-900 mb-2">
              Scribe
              <FiFeather className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />
            </h1>
          </a>

          <p className="text-slate-600 text-lg">
            {isLogin ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Toggle Tabs */}
          <div className="flex mb-8 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 px-4 rounded-md font-semibold transition-all duration-200 ${
                isLogin
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 px-4 rounded-md font-semibold transition-all duration-200 ${
                !isLogin
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name - Signup only */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.name
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
            )}

            {/* Username - Signup only */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg font-medium">
                    @
                  </span>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="johndoe"
                    className={`w-full pl-9 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.username
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                    }`}
                  />
                </div>
                {errors.username && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.username}
                  </p>
                )}
              </div>
            )}

            {/* Email or Username/Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                {isLogin ? "Email or Username" : "Email Address"}
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type={isLogin ? "text" : "email"}
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={
                    isLogin
                      ? "email@example.com or @username"
                      : "you@example.com"
                  }
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password - Signup only */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.confirmPassword
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                    }`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Forgot Password - Login only */}
            {isLogin && (
              <div className="flex items-center justify-end">
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <ButtonLoader />
                  {isLogin ? "Logging in..." : "Creating account..."}
                </>
              ) : isLogin ? (
                "Login"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-slate-700 cursor-pointer">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-slate-700 cursor-pointer">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </button>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-center text-sm text-slate-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={toggleMode}
            className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
