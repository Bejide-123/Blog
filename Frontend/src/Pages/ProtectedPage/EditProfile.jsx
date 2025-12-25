import { useState } from 'react';
import { X, Camera, Upload, Image, User, MapPin, Link2, Globe } from 'lucide-react';

export default function EditProfileModal({ isOpen, onClose, currentProfile }) {
  const [formData, setFormData] = useState({
    name: currentProfile?.name || '',
    username: currentProfile?.username || '',
    bio: currentProfile?.bio || '',
    location: currentProfile?.location || '',
    // website: currentProfile?.website || '',
    avatar: currentProfile?.avatar || '',
    coverImage: '' // You can add a default cover if needed
  });

  const [avatarPreview, setAvatarPreview] = useState(currentProfile?.avatar || '');
  const [coverPreview, setCoverPreview] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          coverImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Saving profile:', formData);
    alert('Profile updated! (This would save to backend)');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200/50 dark:border-slate-700/50">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
              <User className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Edit Profile
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Update your profile information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="p-6">
            
            {/* Cover Image Upload */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Image className="w-4 h-4 text-blue-500" />
                Cover Image
              </label>
              <div className="relative h-40 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 dark:from-blue-700 dark:via-blue-600 dark:to-purple-700 rounded-xl overflow-hidden group border-2 border-gray-300/50 dark:border-slate-600/50 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300">
                {coverPreview && (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                )}
                <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-3">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white">Upload Cover Image</span>
                  <span className="text-xs text-white/70 mt-1">1500x500px recommended</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="hidden"
                  />
                </label>
                {!coverPreview && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60">
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm">Click to upload cover</span>
                  </div>
                )}
              </div>
            </div>

            {/* Avatar Upload */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-500" />
                Profile Picture
              </label>
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="relative w-24 h-24 rounded-2xl border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 p-1">
                    <img
                      src={avatarPreview || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                      alt="Avatar preview"
                      className="w-full h-full rounded-xl object-cover"
                    />
                  </div>
                  <label className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                    <div className="text-center">
                      <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-2">
                        <Camera className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs text-white font-medium">Change</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </div>
                  </label>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Upload a new photo
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    JPG, PNG or GIF • Max 2MB
                  </p>
                  <button
                    type="button"
                    onClick={() => document.querySelector('input[type="file"]').click()}
                    className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Choose File
                  </button>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  placeholder="Your full name"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500">
                    @
                  </span>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    placeholder="username"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  maxLength="160"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Tell us about yourself..."
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Brief description for your profile
                  </p>
                  <div className={`text-xs px-2 py-1 rounded-full ${formData.bio.length > 150 ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
                    {formData.bio.length}/160
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  placeholder="e.g. Lagos, Nigeria"
                />
              </div>

              {/* Website */}
              {/* <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-blue-500" />
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    placeholder="yourwebsite.com"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  No need for https://
                </p>
              </div> */}
            </div>
          </div>

          {/* Footer - Action Buttons */}
          <div className="sticky bottom-0 flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Demo usage - Remove this if not needed
function ProfilePageDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentProfile = {
    name: 'John Doe',
    username: 'johndoe',
    bio: 'Full-stack developer passionate about React, Node.js, and building cool stuff.',
    location: 'Lagos, Nigeria',
    website: 'johndoe.dev',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        Open Edit Profile Modal
      </button>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentProfile={currentProfile}
      />
    </div>
  );
}