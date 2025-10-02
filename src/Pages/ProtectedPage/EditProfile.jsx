import { useState } from 'react';
import { X, Camera, Upload } from 'lucide-react';

export default function EditProfileModal({ isOpen, onClose, currentProfile }) {
  const [formData, setFormData] = useState({
    name: currentProfile?.name || '',
    username: currentProfile?.username || '',
    bio: currentProfile?.bio || '',
    location: currentProfile?.location || '',
    website: currentProfile?.website || '',
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
    // Here you would send formData to your API
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
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="overflow-y-auto flex-1">
          <div className="p-6">
            
            {/* Cover Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Cover Image
              </label>
              <div className="relative h-40 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg overflow-hidden group">
                {coverPreview && (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="text-center text-white">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-sm font-medium">Upload Cover Image</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Recommended: 1500x500px (JPG, PNG, GIF)
              </p>
            </div>

            {/* Avatar Upload */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={avatarPreview || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                    alt="Avatar preview"
                    className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-slate-700 object-cover"
                  />
                  <label className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <p className="font-medium">Upload a new photo</p>
                  <p className="text-xs">JPG, PNG or GIF. Max 2MB</p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Your full name"
              />
            </div>

            {/* Username */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                  @
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-8 pr-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="username"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                maxLength="160"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="Tell us about yourself..."
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Brief description for your profile
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formData.bio.length}/160
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="e.g. Lagos, Nigeria"
              />
            </div>

            {/* Website */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Website
              </label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="yourwebsite.com"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                No need for https://
              </p>
            </div>

          </div>
        </div>

        {/* Footer - Action Buttons */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-slate-700 dark:text-slate-300 font-semibold rounded-lg border-2 border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm hover:shadow-md"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// Demo usage
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
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

