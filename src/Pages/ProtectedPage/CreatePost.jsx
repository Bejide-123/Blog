import { useState, useEffect } from "react";
import { X, ImagePlus, Eye, FileText } from "lucide-react";
import NavbarPrivate from "../../Components/Private/Navbarprivate";
import { ButtonLoader } from "../../Components/Private/Loader";
import { PageLoader } from "../../Components/Private/Loader";

export default function CreatePostPage() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [],
    image: null,
  });
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [charCount, setCharCount] = useState({ title: 0, content: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsPageLoading(false);
    }, 3000);
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "title" || name === "content") {
      setCharCount((prev) => ({
        ...prev,
        [name]: value.length,
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();

      if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tag],
        }));
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSaveDraft = async () => {
    // setIsLoading(true)
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://your-api-url/posts/draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          status: "draft",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // setIsLoading(false)
        alert("Draft saved successfully!");
      } else {
        // setIsLoading(false)
        alert(data.message || "Failed to save draft");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Network error. Please try again.");
      // setIsLoading(false)
    }
  };

  const handlePublish = async (e) => {
    // setIsLoading(true)
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Title and content are required");
      return;

      // setTimeout(() => {
      //   alert("Title and content are required");
      //   setIsLoading(false);
      // }, 5000);
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://your-api-url/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          status: "published",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // setIsLoading(false)
        alert("Post published successfully!");
        window.location.href = "/feed";
      } else {
        // setIsLoading(false)
        alert(data.message || "Failed to publish post");
      }
    } catch (error) {
      console.error("Error publishing post:", error);
      alert("Network error. Please try again.");
      // setIsLoading(false)
    }
  };

  const estimatedReadTime = Math.ceil(
    formData.content.split(/\s+/).filter(Boolean).length / 200
  );

  return (
    <>
      {isPageLoading ? (
        <PageLoader />
      ) : (
        <>
          <NavbarPrivate />
          <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-16 md:pt-20 pb-8">
            <div className="max-w-4xl mx-auto px-4 py-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    Create New Post
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Share your thoughts with the world
                  </p>
                </div>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 cursor-pointer border-2 border-gray-300 dark:border-slate-600 rounded-lg hover:border-blue-600 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-500 font-semibold transition-colors"
                >
                  {showPreview ? (
                    <FileText className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                  {showPreview ? "Edit" : "Preview"}
                </button>
              </div>

              {!showPreview ? (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      maxLength={200}
                      placeholder="Enter your post title..."
                      className="w-full text-2xl md:text-3xl font-bold bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        A compelling title helps readers find your post
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {charCount.title}/200
                      </p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Featured Image (Optional)
                    </label>

                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-64 md:h-80 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-blue-600 dark:hover:border-blue-500 transition-colors group">
                        <div className="flex flex-col items-center justify-center text-center">
                          <ImagePlus className="w-12 h-12 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-500 mb-3" />
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Click to upload image
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            PNG, JPG or GIF (max. 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      required
                      rows={15}
                      placeholder="Write your post content here...&#10;&#10;You can use line breaks to structure your content.&#10;&#10;Share your insights, tutorials, stories, or anything you'd like to write about!"
                      className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none resize-none leading-relaxed"
                    />
                    <div className="flex justify-between items-center mt-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formData.content.split(/\s+/).filter(Boolean).length}{" "}
                        words · ~{estimatedReadTime} min read
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {charCount.content} characters
                      </p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Tags (Optional)
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-blue-700 dark:hover:text-blue-300"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Type a tag and press Enter (max 5 tags)"
                      disabled={formData.tags.length >= 5}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Add up to 5 tags to help readers find your post
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mb-16">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      disabled={isLoading}
                      className="w-full sm:w-auto px-6 py-3 text-slate-700 dark:text-slate-300 font-semibold rounded-lg border-2 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors hover:border-blue-600 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-500 cursor-pointer"
                    >
                      {isLoading ? <ButtonLoader /> : "Save as draft"}
                    </button>
                    <button
                      type="button"
                      onClick={handlePublish}
                      disabled={isLoading}
                      className="w-full sm:w-auto cursor-pointer px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-md hover:shadow-lg"
                    >
                      {isLoading ? <ButtonLoader /> : "Publish Post"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                  <div className="p-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                      {formData.title || "Untitled Post"}
                    </h1>

                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-slate-700">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=preview"
                        alt="Author"
                        className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-slate-700"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          Your Name
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          ~{estimatedReadTime} min read · Just now
                        </p>
                      </div>
                    </div>

                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {imagePreview && (
                      <div className="mb-6">
                        <img
                          src={imagePreview}
                          alt="Featured"
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    )}

                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {formData.content ||
                          "Your post content will appear here..."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
