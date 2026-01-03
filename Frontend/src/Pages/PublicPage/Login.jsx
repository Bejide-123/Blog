import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiFeather,
  FiGithub,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { ButtonLoader } from "../../Components/Private/Loader";
import { signUp, signIn } from "../../Services/api";
import { useUser } from "../../Context/userContext";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../../Context/themeContext";
import { toastService } from "../../Services/toastService";

const Auth = () => {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const nav = useNavigate();
  const { setUser } = useUser();

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !formData.name.trim())
      newErrors.name = "Full Name is required";

    if (!isLogin && !formData.username.trim())
      newErrors.username = "Username is required";
    else if (!isLogin && formData.username.length < 3)
      newErrors.username = "Username must be at least 3 characters";
    else if (!isLogin && !/^[a-zA-Z0-9_]+$/.test(formData.username))
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!isLogin && !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!isLogin) {
      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Please confirm your password";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // Show loading toast
    const loadingToast = toastService.loading(
      isLogin ? "Signing you in..." : "Creating your account..."
    );
    
    setIsLoading(true);

    try {
      let loggedInUser;

      if (isLogin) {
        // Login existing user
        const data = await signIn({
          email: formData.email,
          password: formData.password,
        });
        
        if (!data?.user) {
          throw new Error("Login failed: Invalid email or password");
        }

        loggedInUser = data.user;
        
        // Show success toast for login
        toastService.dismiss(loadingToast);
        toastService.success(`Welcome back! Redirecting...`);
      } else {
        // Sign up new user
        const data = await signUp({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          fullName: formData.name,
        });

        if (!data?.user) {
          throw new Error("Signup failed: Email might already be in use");
        }

        loggedInUser = data.user;
        
        // Show success toast for signup
        toastService.dismiss(loadingToast);
        toastService.success(
          `Welcome to Scribe, ${formData.name}! Account created successfully.`
        );
      }

      // Fetch profile to ensure we get correct data
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", loggedInUser.id)
        .single();

      setUser({
        id: loggedInUser.id,
        name: profileData?.full_name || "",
        email: loggedInUser.email,
        username: profileData?.username || "",
      });

      // Small delay before navigation to show toast
      setTimeout(() => {
        nav("/home");
      }, isLogin ? 1000 : 1500);
      
    } catch (err) {
      // Dismiss loading toast
      toastService.dismiss(loadingToast);
      
      // Show error toast
      toastService.error(err?.message || "Something went wrong. Please try again.");
      
      console.error("Auth error:", err);
    } finally {
      setIsLoading(false);
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
    <div className={`min-h-screen bg-gradient-to-b ${theme === 'light' ? 'from-gray-50 via-white to-white' : 'from-slate-900 via-slate-900 to-slate-950'} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <FiFeather className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Scribe
            </h1>
          </div>
          <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-2`}>
            {isLogin ? "Welcome back!" : "Join the community"}
          </h2>
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            {isLogin
              ? "Sign in to continue your journey"
              : "Create your account to get started"}
          </p>
        </div>

        {/* Auth Card */}
        <div className={`relative ${theme === 'light' ? 'bg-white/95' : 'bg-slate-800/95'} backdrop-blur-lg rounded-2xl border ${theme === 'light' ? 'border-gray-200/50' : 'border-slate-700/50'} shadow-xl p-8`}>
          {/* Toggle Tabs - Modern Design */}
          <div className={`flex items-center gap-1 mb-8 p-1 bg-gradient-to-r ${theme === 'light' ? 'from-gray-100 to-gray-50' : 'from-slate-800 to-slate-900'} rounded-2xl`}>
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                isLogin
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : `${theme === 'light' ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' : 'text-gray-300 hover:text-white hover:bg-slate-700'}`
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                !isLogin
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : `${theme === 'light' ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' : 'text-gray-300 hover:text-white hover:bg-slate-700'}`
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className={`block text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-2`}
                >
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative">
                    <FiUser className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'} w-5 h-5`} />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`w-full pl-12 pr-4 py-3.5 ${theme === 'light' ? 'bg-gray-50 text-gray-900 placeholder-gray-400' : 'bg-slate-700 text-white placeholder-gray-500'} border-0 rounded-xl focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:ring-blue-500' : 'focus:ring-blue-400'} transition-all ${
                        errors.name ? "ring-2 ring-red-500" : ""
                      }`}
                    />
                  </div>
                </div>
                {errors.name && (
                  <p className={`mt-2 text-sm ${theme === 'light' ? 'text-red-600' : 'text-red-400'} flex items-center gap-1`}>
                    <span>⚠</span> {errors.name}
                  </p>
                )}
              </div>
            )}

            {/* Username */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="username"
                  className={`block text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-2`}
                >
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative">
                    <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'} text-lg font-medium`}>
                      @
                    </span>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="johndoe"
                      className={`w-full pl-11 pr-4 py-3.5 ${theme === 'light' ? 'bg-gray-50 text-gray-900 placeholder-gray-400' : 'bg-slate-700 text-white placeholder-gray-500'} border-0 rounded-xl focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:ring-blue-500' : 'focus:ring-blue-400'} transition-all ${
                        errors.username ? "ring-2 ring-red-500" : ""
                      }`}
                    />
                  </div>
                </div>
                {errors.username && (
                  <p className={`mt-2 text-sm ${theme === 'light' ? 'text-red-600' : 'text-red-400'} flex items-center gap-1`}>
                    <span>⚠</span> {errors.username}
                  </p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-2`}
              >
                {isLogin ? "Email or Username" : "Email Address"}
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative">
                  <FiMail className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'} w-5 h-5`} />
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
                    className={`w-full pl-12 pr-4 py-3.5 ${theme === 'light' ? 'bg-gray-50 text-gray-900 placeholder-gray-400' : 'bg-slate-700 text-white placeholder-gray-500'} border-0 rounded-xl focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:ring-blue-500' : 'focus:ring-blue-400'} transition-all ${
                      errors.email ? "ring-2 ring-red-500" : ""
                    }`}
                  />
                </div>
              </div>
              {errors.email && (
                <p className={`mt-2 text-sm ${theme === 'light' ? 'text-red-600' : 'text-red-400'} flex items-center gap-1`}>
                  <span>⚠</span> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-2`}
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative">
                  <FiLock className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'} w-5 h-5`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-3.5 ${theme === 'light' ? 'bg-gray-50 text-gray-900 placeholder-gray-400' : 'bg-slate-700 text-white placeholder-gray-500'} border-0 rounded-xl focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:ring-blue-500' : 'focus:ring-blue-400'} transition-all ${
                      errors.password ? "ring-2 ring-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300'} transition-colors`}
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className={`mt-2 text-sm ${theme === 'light' ? 'text-red-600' : 'text-red-400'} flex items-center gap-1`}>
                  <span>⚠</span> {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className={`block text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-2`}
                >
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative">
                    <FiLock className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'} w-5 h-5`} />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-4 py-3.5 ${theme === 'light' ? 'bg-gray-50 text-gray-900 placeholder-gray-400' : 'bg-slate-700 text-white placeholder-gray-500'} border-0 rounded-xl focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:ring-blue-500' : 'focus:ring-blue-400'} transition-all ${
                        errors.confirmPassword ? "ring-2 ring-red-500" : ""
                      }`}
                    />
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p className={`mt-2 text-sm ${theme === 'light' ? 'text-red-600' : 'text-red-400'} flex items-center gap-1`}>
                    <span>⚠</span> {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              {isLoading ? (
                <ButtonLoader />
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className={`absolute inset-0 flex items-center`}>
              <div className={`w-full border-t ${theme === 'light' ? 'border-gray-300' : 'border-slate-700'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-4 ${theme === 'light' ? 'bg-white text-gray-500' : 'bg-slate-800 text-gray-400'}`}>
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className={`flex items-center justify-center gap-3 py-3 px-4 ${theme === 'light' ? 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700' : 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-300'} border rounded-xl transition-all duration-300 font-medium cursor-pointer group`}>
              <FcGoogle className="w-5 h-5" />
              <span>Google</span>
            </button>

            <button className={`flex items-center justify-center gap-3 py-3 px-4 ${theme === 'light' ? 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700' : 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-gray-300'} border rounded-xl transition-all duration-300 font-medium cursor-pointer group`}>
              <FiGithub className="w-5 h-5" />
              <span>GitHub</span>
            </button>
          </div>

          {/* Footer */}
          <p className={`mt-8 text-center text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleMode}
              className={`${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'} font-semibold cursor-pointer`}
            >
              {isLogin ? "Sign up now" : "Login here"}
            </button>
          </p>
        </div>

        {/* Footer Note */}
        <p className={`text-center text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Auth;