import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/userContext";
import { useTheme } from "../../Context/themeContext";
import { Check, ChevronRight, Sparkles, Mail, Bell, PenTool, BookOpen, Heart, PartyPopper, X } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function OnboardingPage() {
  const { theme } = useTheme();
  const { user, setUser, updateOnboardingStatus } = useUser();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    bio: "",
    topics: [],
    focus: "",
    notifications: {
      weeklyEmails: true,
      followerAlerts: true
    }
  });
  
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const topicsList = [
    { id: "tech", label: "Technology", icon: "💻" },
    { id: "webdev", label: "Web Dev", icon: "🌐" },
    { id: "ai", label: "AI & ML", icon: "🤖" },
    { id: "design", label: "Design", icon: "🎨" },
    { id: "startups", label: "Startups", icon: "🚀" },
    { id: "productivity", label: "Productivity", icon: "⚡" },
    { id: "lifestyle", label: "Lifestyle", icon: "🌟" },
    { id: "health", label: "Health", icon: "💪" },
    { id: "business", label: "Business", icon: "💼" },
    { id: "finance", label: "Finance", icon: "💰" },
    { id: "education", label: "Education", icon: "📚" },
    { id: "writing", label: "Writing", icon: "✍️" },
    { id: "travel", label: "Travel", icon: "✈️" },
    { id: "food", label: "Food", icon: "🍕" },
    { id: "gaming", label: "Gaming", icon: "🎮" },
    { id: "music", label: "Music", icon: "🎵" }
  ];
  
  const focusOptions = [
    { 
      id: "write", 
      label: "Write", 
      description: "Share my stories with the world",
      icon: PenTool 
    },
    { 
      id: "read", 
      label: "Read", 
      description: "Discover amazing content",
      icon: BookOpen 
    },
    { 
      id: "both", 
      label: "Both", 
      description: "Write and explore together",
      icon: Sparkles 
    }
  ];
  
  const steps = [
    {
      title: "Welcome to Scribe",
      description: "Let's personalize your experience",
      emoji: "👋"
    },
    {
      title: "Tell Us About You",
      description: "Share your story",
      emoji: "✨"
    },
    {
      title: "Pick Your Interests",
      description: "What topics inspire you?",
      emoji: "💡"
    },
    {
      title: "Choose Your Path",
      description: "How will you use Scribe?",
      emoji: "🎯"
    },
    {
      title: "Stay Connected",
      description: "Customize notifications",
      emoji: "🔔"
    }
  ];
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = async () => {
    try {
      await saveOnboardingData({
        bio: "",
        topics: [],
        focus: "",
        notifications: formData.notifications
      });
    } catch (error) {
      console.error("Error skipping onboarding:", error);
    }
    
    navigate("/home");
  };
  
  const saveOnboardingData = async (data) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          bio: data.bio,
          interests: data.topics,
          focus: data.focus,
          notifications_preferences: data.notifications,
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      updateOnboardingStatus(true);
      
      setUser({
        ...user,
        bio: data.bio,
        onboarding_completed: true
      });
      
      return true;
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      throw error;
    }
  };
  
  const handleComplete = async () => {
    setIsSubmitting(true);
    
    try {
      await saveOnboardingData(formData);
      console.log("Onboarding completed with data:", formData);
      setShowCompletionModal(true);
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      setShowCompletionModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const toggleTopic = (topicId) => {
    setFormData(prev => {
      const topics = prev.topics.includes(topicId)
        ? prev.topics.filter(t => t !== topicId)
        : [...prev.topics, topicId];
      return { ...prev, topics };
    });
  };
  
  const setFocus = (focus) => {
    setFormData(prev => ({ ...prev, focus }));
  };
  
  const toggleNotification = (key) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };
  
  const canProceed = () => {
    if (currentStep === 2) return formData.topics.length >= 2;
    return true;
  };
  
  const handleCreatePost = () => {
    setShowCompletionModal(false);
    navigate("/create");
  };
  
  const handleExploreFeed = () => {
    setShowCompletionModal(false);
    navigate("/home");
  };
  
  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'light' ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' : 'bg-slate-900'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className={`mt-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden ${theme === 'light' ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' : 'bg-slate-900'}`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 left-10 w-72 h-72 ${theme === 'light' ? 'bg-blue-200/30' : 'bg-blue-900/10'} rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-20 right-10 w-96 h-96 ${theme === 'light' ? 'bg-purple-200/30' : 'bg-purple-900/10'} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 ${theme === 'light' ? 'bg-pink-200/20' : 'bg-pink-900/5'} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Header */}
        <div className="w-full max-w-2xl mb-8 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className={`p-3 rounded-2xl ${theme === 'light' ? 'bg-white shadow-lg' : 'bg-slate-800 shadow-xl'} border ${theme === 'light' ? 'border-blue-100' : 'border-blue-800/30'}`}>
              <Sparkles className={`w-6 h-6 sm:w-8 sm:h-8 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Scribe
            </h1>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className="relative group">
                    <button
                      onClick={() => index <= currentStep && setCurrentStep(index)}
                      disabled={index > currentStep}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                        index === currentStep
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-110 shadow-xl ring-4 ring-blue-200 dark:ring-blue-900/50'
                          : index < currentStep
                          ? `${theme === 'light' ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'} shadow-lg`
                          : `${theme === 'light' ? 'bg-white border-2 border-gray-300 text-gray-400' : 'bg-slate-800 border-2 border-slate-700 text-gray-500'}`
                      } ${index <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                    >
                      {index < currentStep ? (
                        <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <span className="text-lg">{step.emoji}</span>
                      )}
                    </button>
                    
                    {/* Tooltip */}
                    <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg ${theme === 'light' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}>
                      {step.title}
                      <div className={`absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 ${theme === 'light' ? 'bg-gray-900' : 'bg-white'} rotate-45 -mt-1`}></div>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`w-8 sm:w-12 md:w-16 h-1 mx-1 rounded-full transition-all duration-500 ${
                      index < currentStep
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                        : theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
        
        {/* Main Content Card */}
        <div className={`w-full max-w-2xl rounded-3xl ${theme === 'light' ? 'bg-white shadow-2xl' : 'bg-slate-800 shadow-2xl'} p-6 sm:p-8 md:p-10 relative z-10 border ${theme === 'light' ? 'border-gray-100' : 'border-slate-700'}`}>
          {/* Step Title */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className={`text-4xl sm:text-5xl animate-bounce`}>
                {steps[currentStep].emoji}
              </div>
            </div>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {steps[currentStep].title}
            </h2>
            <p className={`text-base sm:text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              {steps[currentStep].description}
            </p>
          </div>
          
          {/* Step Content */}
          <div className="mb-8">
            {/* Step 0: Welcome */}
            {currentStep === 0 && (
              <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h3 className={`text-2xl sm:text-3xl font-bold mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    Hey there, {user?.name || user?.username || "Writer"}! 🎉
                  </h3>
                  <p className={`text-base sm:text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} max-w-lg mx-auto`}>
                    We're excited to have you here! Let's take a quick tour to personalize your Scribe experience.
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-md mx-auto">
                  <div className="text-center space-y-3">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border-2 ${theme === 'light' ? 'border-blue-200' : 'border-blue-800/50'} shadow-lg`}>
                      <PenTool className="w-7 h-7 sm:w-9 sm:h-9 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Write</span>
                  </div>
                  <div className="text-center space-y-3">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border-2 ${theme === 'light' ? 'border-purple-200' : 'border-purple-800/50'} shadow-lg`}>
                      <BookOpen className="w-7 h-7 sm:w-9 sm:h-9 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Read</span>
                  </div>
                  <div className="text-center space-y-3">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border-2 ${theme === 'light' ? 'border-amber-200' : 'border-amber-800/50'} shadow-lg`}>
                      <Heart className="w-7 h-7 sm:w-9 sm:h-9 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className={`text-sm sm:text-base font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Connect</span>
                  </div>
                </div>

                <div className={`p-4 sm:p-5 rounded-2xl ${theme === 'light' ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100' : 'bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30'}`}>
                  <p className={`text-sm sm:text-base ${theme === 'light' ? 'text-blue-900' : 'text-blue-200'} font-medium`}>
                    ⏱️ This will only take 2 minutes
                  </p>
                </div>
              </div>
            )}
            
            {/* Step 1: Bio */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="I'm passionate about... I love writing about... My interests include..."
                  className={`w-full h-40 sm:h-48 px-4 sm:px-5 py-3 sm:py-4 ${theme === 'light' ? 'bg-gray-50 text-gray-900 placeholder-gray-400 border-2 border-gray-200 focus:border-blue-500' : 'bg-slate-900 text-white placeholder-gray-500 border-2 border-slate-700 focus:border-blue-500'} rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all resize-none text-base`}
                  maxLength={200}
                />
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${theme === 'light' ? 'bg-blue-50 text-blue-700' : 'bg-blue-900/30 text-blue-400'}`}>
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs sm:text-sm font-medium">
                      Optional - help others connect with you
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${formData.bio.length > 180 ? 'text-orange-500' : theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {formData.bio.length}/200
                  </span>
                </div>
              </div>
            )}
            
            {/* Step 2: Topics */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {topicsList.map((topic, idx) => {
                    const isSelected = formData.topics.includes(topic.id);
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => toggleTopic(topic.id)}
                        className={`group p-4 rounded-2xl border-2 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${
                          isSelected
                            ? `bg-gradient-to-br from-blue-50 to-purple-50 border-blue-400 dark:from-blue-900/30 dark:to-purple-900/30 dark:border-blue-600 scale-105 shadow-lg`
                            : `${theme === 'light' ? 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/50' : 'bg-slate-900 border-slate-700 hover:border-blue-700 hover:bg-slate-800'} hover:scale-105`
                        }`}
                        style={{ animationDelay: `${idx * 30}ms` }}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-3xl sm:text-4xl transform group-hover:scale-110 transition-transform">{topic.icon}</span>
                          <span className={`text-xs sm:text-sm font-bold ${
                            isSelected
                              ? 'text-blue-600 dark:text-blue-400'
                              : theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                          }`}>
                            {topic.label}
                          </span>
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center animate-in zoom-in duration-200">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                <div className={`p-5 rounded-2xl text-center border-2 ${
                  formData.topics.length >= 2
                    ? `bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-400 dark:from-emerald-900/20 dark:to-green-900/20 dark:border-emerald-600`
                    : `bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-700`
                }`}>
                  <p className={`text-base sm:text-lg font-bold ${
                    formData.topics.length >= 2
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-amber-700 dark:text-amber-400'
                  }`}>
                    {formData.topics.length >= 2
                      ? `✨ Perfect! ${formData.topics.length} topics selected`
                      : `Pick at least 2 topics to continue (${formData.topics.length}/2)`}
                  </p>
                </div>
              </div>
            )}
            
            {/* Step 3: Focus */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                {focusOptions.map((option, idx) => {
                  const Icon = option.icon;
                  const isSelected = formData.focus === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFocus(option.id)}
                      className={`w-full p-5 sm:p-6 rounded-2xl border-2 text-left transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${
                        isSelected
                          ? `bg-gradient-to-br from-blue-50 to-purple-50 border-blue-400 dark:from-blue-900/30 dark:to-purple-900/30 dark:border-blue-600 shadow-xl scale-105`
                          : `${theme === 'light' ? 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/50' : 'bg-slate-900 border-slate-700 hover:border-blue-700 hover:bg-slate-800'} hover:scale-102`
                      }`}
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg'
                            : theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'
                        }`}>
                          <Icon className={`w-7 h-7 sm:w-8 sm:h-8 ${
                            isSelected ? 'text-white' : theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-bold text-lg sm:text-xl mb-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            {option.label}
                          </h4>
                          <p className={`text-sm sm:text-base ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            {option.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center animate-in zoom-in duration-200">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            
            {/* Step 4: Notifications */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-4">
                  {[
                    {
                      key: 'weeklyEmails',
                      label: 'Weekly Inspiration',
                      description: 'Curated stories and writing tips every Monday',
                      icon: Mail
                    },
                    {
                      key: 'followerAlerts',
                      label: 'New Followers',
                      description: 'Get notified when someone follows you',
                      icon: Bell
                    }
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    const isEnabled = formData.notifications[item.key];
                    return (
                      <div 
                        key={item.key} 
                        className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all animate-in fade-in slide-in-from-bottom-2 ${
                          theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-900 border-slate-700'
                        }`}
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className={`p-3 rounded-xl transition-all ${
                            isEnabled
                              ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg'
                              : theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'
                          }`}>
                            <Icon className={`w-6 h-6 ${
                              isEnabled ? 'text-white' : theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-bold text-base sm:text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              {item.label}
                            </h4>
                            <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleNotification(item.key)}
                          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all flex-shrink-0 shadow-inner ${
                            isEnabled
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                              : theme === 'light' ? 'bg-gray-300' : 'bg-slate-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                              isEnabled ? 'translate-x-7' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                <div className={`p-4 rounded-2xl text-center ${theme === 'light' ? 'bg-blue-50 border border-blue-100' : 'bg-blue-900/20 border border-blue-800/30'}`}>
                  <p className={`text-sm font-medium ${theme === 'light' ? 'text-blue-800' : 'text-blue-300'}`}>
                    💡 You can update these anytime in settings
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t-2 border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className={`px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base ${theme === 'light' ? 'text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200' : 'text-gray-300 hover:text-white bg-slate-700 hover:bg-slate-600'} rounded-xl font-semibold transition-all`}
                >
                  ← Back
                </button>
              )}
              
              {currentStep < steps.length - 1 && (
                <button
                  onClick={handleSkip}
                  className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm ${theme === 'light' ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100' : 'text-gray-400 hover:text-gray-300 hover:bg-slate-700'} rounded-xl font-medium transition-all`}
                >
                  Skip for now
                </button>
              )}
            </div>
            
            <button
              onClick={currentStep === steps.length - 1 ? handleComplete : handleNext}
              disabled={!canProceed() || isSubmitting}
              className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2 transition-all ${
                canProceed() && !isSubmitting
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl hover:scale-105'
                  : theme === 'light'
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>{currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Skip All Button */}
        <button
          onClick={handleSkip}
          className={`mt-6 px-4 py-2 text-sm ${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'} font-medium transition-colors relative z-10`}
        >
          Skip onboarding →
        </button>
      </div>
      
      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className={`w-full max-w-lg rounded-3xl ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} p-8 sm:p-10 shadow-2xl animate-in zoom-in slide-in-from-bottom-4 duration-500 border ${theme === 'light' ? 'border-gray-100' : 'border-slate-700'}`}>
            <div className="text-center space-y-8">
              {/* Success Icon */}
              <div className="relative inline-block">
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-2xl animate-bounce">
                  <Check className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-xl animate-bounce" style={{ animationDelay: '0.2s' }}>
                    <PartyPopper className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Success Message */}
              <div className="space-y-3">
                <h3 className={`text-3xl sm:text-4xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  You're All Set! 🎉
                </h3>
                <p className={`text-base sm:text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} max-w-md mx-auto`}>
                  Your profile is ready! Start your writing journey or explore amazing content.
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCreatePost}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-3 text-lg"
                >
                  <PenTool className="w-6 h-6" />
                  Create Your First Post
                </button>
                
                <button
                  onClick={handleExploreFeed}
                  className={`w-full py-4 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 text-lg ${
                    theme === 'light'
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  <BookOpen className="w-6 h-6" />
                  Explore The Feed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}