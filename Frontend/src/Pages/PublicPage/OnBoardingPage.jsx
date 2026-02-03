import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/userContext";
import { useTheme } from "../../Context/themeContext";
import { Check, ChevronRight, Sparkles, SkipForward, Mail, Bell, PenTool, BookOpen, Heart, X, PartyPopper } from "lucide-react";
// import { updateUserProfile } from "../../Services/user";

export default function OnboardingPage() {
  const { theme } = useTheme();
  const { user } = useUser();
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
      description: "I'm here to share my stories",
      icon: PenTool 
    },
    { 
      id: "read", 
      label: "Read", 
      description: "I want to discover great content",
      icon: BookOpen 
    },
    { 
      id: "both", 
      label: "Both", 
      description: "Write and explore",
      icon: Sparkles 
    }
  ];
  
  const steps = [
    {
      title: "Welcome to Scribe",
      description: "Let's personalize your experience"
    },
    {
      title: "Your Bio",
      description: "Tell us about yourself"
    },
    {
      title: "Your Interests",
      description: "What topics inspire you?"
    },
    {
      title: "Your Focus",
      description: "How will you use Scribe?"
    },
    {
      title: "Notifications",
      description: "Stay in the loop"
    }
  ];
  
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
  
  const handleSkip = () => {
    navigate("/home");
  };
  
  const handleComplete = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call to save onboarding data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Onboarding completed with data:", formData);
      setShowCompletionModal(true);
      
    } catch (error) {
      console.error("Error saving onboarding data:", error);
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
  
  const handleCloseModal = () => {
    setShowCompletionModal(false);
    navigate("/home");
  };
  
  const handleCreatePost = () => {
    setShowCompletionModal(false);
    navigate("/create");
  };
  
  const handleExploreFeed = () => {
    setShowCompletionModal(false);
    navigate("/home");
  };
  
  return (
    <>
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 ${theme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
        {/* Header */}
        <div className="w-full max-w-xl mb-6 sm:mb-8 text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
            <div className={`p-1.5 sm:p-2 rounded-lg ${theme === 'light' ? 'bg-gradient-to-r from-blue-50 to-purple-50' : 'bg-gradient-to-r from-blue-900/30 to-purple-900/30'} border ${theme === 'light' ? 'border-blue-100' : 'border-blue-800/30'}`}>
              <Sparkles className={`w-4 h-4 sm:w-6 sm:h-6 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Scribe
            </h1>
          </div>
          
          {/* Progress Steps - FIXED for mobile */}
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <div className="flex items-center">
              {steps.map((_, index) => (
                <div key={index} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(index)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-medium transition-all text-sm sm:text-base ${
                      index === currentStep
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-110 shadow-lg'
                        : index < currentStep
                        ? `${theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-900/40 text-blue-400'}`
                        : `${theme === 'light' ? 'bg-gray-100 text-gray-400' : 'bg-slate-800 text-gray-500'}`
                    }`}
                  >
                    {index < currentStep ? <Check className="w-3 h-3 sm:w-5 sm:h-5" /> : index + 1}
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`w-4 sm:w-8 h-0.5 mx-0.5 sm:mx-1 ${
                      index < currentStep
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                        : theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
        
        {/* Main Content */}
        <div className={`w-full max-w-xl rounded-xl sm:rounded-2xl ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-800'} p-4 sm:p-6 md:p-8`}>
          {/* Step Title */}
          <div className="mb-6 sm:mb-8 text-center">
            <h2 className={`text-xl sm:text-2xl font-bold mb-1 sm:mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {steps[currentStep].title}
            </h2>
            <p className={`text-sm sm:text-base ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              {steps[currentStep].description}
            </p>
          </div>
          
          {/* Step Content */}
          <div className="mb-6 sm:mb-8">
            {/* Step 0: Welcome */}
            {currentStep === 0 && (
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500" />
                </div>
                <div>
                  <h3 className={`text-lg sm:text-xl font-semibold mb-1 sm:mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                    Welcome, {user?.name || "Writer"}!
                  </h3>
                  <p className={`text-sm sm:text-base ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    Let's set up your Scribe experience in just a few minutes.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center space-y-1 sm:space-y-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                      <PenTool className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Write</span>
                  </div>
                  <div className="text-center space-y-1 sm:space-y-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                    <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Read</span>
                  </div>
                  <div className="text-center space-y-1 sm:space-y-2">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                      <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-amber-600" />
                    </div>
                    <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Connect</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 1: Bio */}
            {currentStep === 1 && (
              <div className="space-y-3 sm:space-y-4">
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself... What do you love? What inspires you to write?"
                  className={`w-full h-32 sm:h-40 px-3 sm:px-4 py-2 sm:py-3 ${theme === 'light' ? 'bg-white text-gray-900 placeholder-gray-400 border border-gray-200' : 'bg-slate-900 text-white placeholder-gray-500 border border-slate-700'} rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-sm`}
                  maxLength={200}
                />
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Optional - helps readers connect with you
                  </span>
                  <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {formData.bio.length}/200
                  </span>
                </div>
              </div>
            )}
            
            {/* Step 2: Topics */}
            {currentStep === 2 && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {topicsList.map((topic) => {
                    const isSelected = formData.topics.includes(topic.id);
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => toggleTopic(topic.id)}
                        className={`group p-2 sm:p-3 rounded-lg border transition-all duration-200 ${
                          isSelected
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 dark:from-blue-900/30 dark:to-purple-900/30 dark:border-blue-700 scale-105 shadow-sm sm:shadow-md'
                            : `${theme === 'light' ? 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50' : 'bg-slate-900 border-slate-700 hover:border-blue-700 hover:bg-slate-800'}`
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1 sm:gap-2">
                          <span className="text-xl sm:text-2xl">{topic.icon}</span>
                          <span className={`text-xs font-medium ${
                            isSelected
                              ? 'text-blue-600 dark:text-blue-400'
                              : theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                          }`}>
                            {topic.label}
                          </span>
                          {isSelected && (
                            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mt-0.5 sm:mt-1">
                              <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className={`p-3 sm:p-4 rounded-lg text-center ${
                  formData.topics.length >= 2
                    ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20'
                    : 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20'
                }`}>
                  <p className={`text-xs sm:text-sm font-medium ${
                    formData.topics.length >= 2
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-blue-700 dark:text-blue-400'
                  }`}>
                    {formData.topics.length >= 2
                      ? `✓ Great! ${formData.topics.length} topics selected`
                      : `Select at least 2 topics (${formData.topics.length}/2)`}
                  </p>
                </div>
              </div>
            )}
            
            {/* Step 3: Focus */}
            {currentStep === 3 && (
              <div className="space-y-3 sm:space-y-4">
                {focusOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = formData.focus === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFocus(option.id)}
                      className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 dark:from-blue-900/30 dark:to-purple-900/30 dark:border-blue-700 shadow-sm sm:shadow-md'
                          : `${theme === 'light' ? 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50' : 'bg-slate-900 border-slate-700 hover:border-blue-700 hover:bg-slate-800'}`
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 sm:w-12 sm:h-12 rounded-md sm:rounded-lg flex items-center justify-center ${
                          isSelected
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                            : theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'
                        }`}>
                          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 sm:w-6 sm:h-6 ${
                            isSelected ? 'text-white' : theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-semibold text-sm sm:text-base mb-0.5 sm:mb-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            {option.label}
                          </h4>
                          <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            {option.description}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
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
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  {[
                    {
                      key: 'weeklyEmails',
                      label: 'Weekly inspiration',
                      description: 'Get curated stories and writing tips every Monday',
                      icon: Mail
                    },
                    {
                      key: 'followerAlerts',
                      label: 'New follower alerts',
                      description: 'Get notified when someone follows you',
                      icon: Bell
                    }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isEnabled = formData.notifications[item.key];
                    return (
                      <div key={item.key} className={`flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl ${
                        theme === 'light' ? 'bg-white border border-gray-200' : 'bg-slate-900 border border-slate-700'
                      }`}>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg ${
                            isEnabled
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                              : theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'
                          }`}>
                            <Icon className={`w-3 h-3 sm:w-4 h-4 sm:w-5 sm:h-5 ${
                              isEnabled ? 'text-white' : theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-medium text-sm sm:text-base ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              {item.label}
                            </h4>
                            <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleNotification(item.key)}
                          className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                            isEnabled
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                              : theme === 'light' ? 'bg-gray-300' : 'bg-slate-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                              isEnabled ? 'translate-x-4 sm:translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <p className={`text-xs sm:text-sm text-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  You can update these anytime in your settings
                </p>
              </div>
            )}
          </div>
          
          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-2 sm:gap-3">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm ${theme === 'light' ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-gray-400 hover:text-gray-300 hover:bg-slate-700'} rounded-lg font-medium transition-colors`}
                >
                  ← Back
                </button>
              )}
              
              {currentStep < steps.length - 1 && (
                <button
                  onClick={handleSkip}
                  className={`px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm ${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-400 hover:text-gray-300'} font-medium`}
                >
                  Skip
                </button>
              )}
            </div>
            
            <button
              onClick={currentStep === steps.length - 1 ? handleComplete : handleNext}
              disabled={!canProceed() || isSubmitting}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base flex items-center gap-1 sm:gap-2 transition-all ${
                canProceed() && !isSubmitting
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  : theme === 'light'
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md rounded-2xl ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} p-6 sm:p-8 shadow-2xl`}>
            <div className="text-center space-y-6">
              {/* Success Icon */}
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                  <Check className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center animate-bounce">
                    <PartyPopper className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Success Message */}
              <div className="space-y-2">
                <h3 className={`text-xl sm:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Setup Complete! 🎉
                </h3>
                <p className={`text-sm sm:text-base ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Your Scribe profile has been saved successfully. 
                  You're all set to start your writing journey!
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCreatePost}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <PenTool className="w-4 h-4 sm:w-5 sm:h-5" />
                  Create Your First Post
                </button>
                
                <button
                  onClick={handleExploreFeed}
                  className={`w-full py-3 font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                    theme === 'light'
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                  Explore The Feed
                </button>
                
                <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} pt-2`}>
                  You can always update your preferences in settings
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}