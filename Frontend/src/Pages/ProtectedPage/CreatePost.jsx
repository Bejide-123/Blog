import { useTheme } from "../../Context/themeContext";
import { useState, useEffect, useRef } from "react";
import {
  X,
  ImagePlus,
  Eye,
  FileText,
  Save,
  Send,
  Tag,
  Hash,
  Clock,
  Type,
  Image as ImageIcon,
  BookOpen,
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
  Globe,
  Lock,
  Check,
  Sparkles,
  Loader2,
  FileWarning,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  AtSign,
  User,
} from "lucide-react";
import NavbarPrivate from "../../Components/Private/Navbarprivate";
import { PageLoader } from "../../Components/Private/Loader";
import { 
  createPost, 
  uploadImage, 
  getCurrentUserProfile, 
  searchUsers, 
  getRecentlyInteractedUsers,
  getUserByUsername
} from "../../Services/api";
import { useNavigate } from "react-router-dom";

export default function CreatePostPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [],
    imageFile: null,
    imageUrl: null,
    isPublic: true,
    allowComments: true,
  });
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [charCount, setCharCount] = useState({ title: 0, content: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState(0);
  const [titleScore, setTitleScore] = useState(0);
  const [lastSaved, setLastSaved] = useState(null);
  
  // Mention states
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [mentionPosition, setMentionPosition] = useState({ start: 0, end: 0 });
  const [mentionTriggered, setMentionTriggered] = useState(false);
  const [mentionLoading, setMentionLoading] = useState(false);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // State for rendered preview content with mentions
  const [renderedPreviewContent, setRenderedPreviewContent] = useState(null);

  const contentRef = useRef(null);
  const tagInputRef = useRef(null);
  const mentionDropdownRef = useRef(null);
  const mentionTimeoutRef = useRef(null);
  const userProfileCache = useRef({}); // Add userProfileCache here

  const popularTags = [
    "react",
    "javascript",
    "webdev",
    "programming",
    "technology",
    "ai",
    "design",
    "css",
    "nodejs",
    "python",
    "learning",
    "tutorial",
  ];

  useEffect(() => {
    setTimeout(() => {
      setIsPageLoading(false);
    }, 3000);

    const fetchUserProfile = async () => {
      try {
        const profile = await getCurrentUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile({
          username: "Your Name",
          full_name: "Your Name",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=preview",
        });
      }
    };

    fetchUserProfile();

    const savedDraft = sessionStorage.getItem("postDraft");
    if (savedDraft) {
      const draft = JSON.parse(savedDraft);
      setFormData(draft);
      if (draft.image) setImagePreview(draft.image);
      setLastSaved(new Date(draft.savedAt));
    }

    // Click outside to close mention dropdown
    const handleClickOutside = (event) => {
      if (
        mentionDropdownRef.current &&
        !mentionDropdownRef.current.contains(event.target) &&
        contentRef.current !== event.target
      ) {
        setShowMentions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (mentionTimeoutRef.current) {
        clearTimeout(mentionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const words = formData.content.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setReadTime(Math.ceil(words / 200));
    setCharCount({
      title: formData.title.length,
      content: formData.content.length,
    });

    analyzeTitle(formData.title);

    if (tagInput.trim()) {
      const filtered = popularTags
        .filter(
          (tag) =>
            tag.toLowerCase().includes(tagInput.toLowerCase()) &&
            !formData.tags.includes(tag),
        )
        .slice(0, 5);
      setSuggestedTags(filtered);
      setShowTagSuggestions(filtered.length > 0);
    } else {
      setShowTagSuggestions(false);
    }
  }, [formData, tagInput]);

  // Process preview content with mentions
  useEffect(() => {
    const processPreviewContent = async () => {
      if (formData.content) {
        const rendered = await renderContentWithMentions(formData.content);
        setRenderedPreviewContent(rendered);
      } else {
        setRenderedPreviewContent("Your story content will appear here...");
      }
    };

    processPreviewContent();
  }, [formData.content]);

  // Calculate dropdown position based on cursor
  const calculateDropdownPosition = () => {
    if (!contentRef.current) return;

    const textarea = contentRef.current;
    const cursorPos = textarea.selectionStart;
    
    // Get textarea bounds
    const textareaRect = textarea.getBoundingClientRect();
    
    // Create a temporary div to measure text position
    const div = document.createElement('div');
    const styles = window.getComputedStyle(textarea);
    
    // Copy relevant styles
    ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'padding', 'border'].forEach(prop => {
      div.style[prop] = styles[prop];
    });
    
    div.style.position = 'absolute';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'pre-wrap';
    div.style.wordWrap = 'break-word';
    div.style.width = textarea.clientWidth + 'px';
    
    // Get text up to cursor
    const textBeforeCursor = textarea.value.substring(0, cursorPos);
    div.textContent = textBeforeCursor;
    
    document.body.appendChild(div);
    
    // Get the height (which gives us the line position)
    const textHeight = div.offsetHeight;
    document.body.removeChild(div);
    
    // Calculate position
    const lineHeight = parseInt(styles.lineHeight);
    const paddingTop = parseInt(styles.paddingTop);
    
    // Position dropdown below the current line
    const top = textareaRect.top + paddingTop + textHeight + window.scrollY;
    const left = textareaRect.left + window.scrollX + 20; // Small offset from left
    
    setDropdownPosition({ top, left });
  };

  // Fetch mention suggestions
  const fetchMentionSuggestions = async (query) => {
    try {
      setMentionLoading(true);
      let users;
      
      if (!query || query.trim().length < 1) {
        users = await getRecentlyInteractedUsers();
      } else {
        users = await searchUsers(query);
      }
      
      setMentionSuggestions(users || []);
      setSelectedMentionIndex(0);
    } catch (error) {
      console.error("Error fetching mention suggestions:", error);
      // Fallback to dummy data for testing
      setMentionSuggestions([
        { id: 1, username: "john_doe", full_name: "John Doe", avatar_url: null },
        { id: 2, username: "jane_smith", full_name: "Jane Smith", avatar_url: null },
        { id: 3, username: "alex_wong", full_name: "Alex Wong", avatar_url: null },
      ]);
      setSelectedMentionIndex(0);
    } finally {
      setMentionLoading(false);
    }
  };

  // Handle content change with mention detection
  const handleContentChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));

    // Check for @ mention trigger
    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPos);
    const lastAtSymbol = textBeforeCursor.lastIndexOf("@");

    if (lastAtSymbol !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtSymbol);
      const spaceIndex = textAfterAt.indexOf(" ");
      const newlineIndex = textAfterAt.indexOf("\n");
      
      // Check if we're still in the mention (no space or newline after @)
      const endIndex = Math.min(
        spaceIndex === -1 ? Infinity : spaceIndex,
        newlineIndex === -1 ? Infinity : newlineIndex
      );
      
      if (endIndex === Infinity || cursorPos <= lastAtSymbol + endIndex) {
        const query = textBeforeCursor.substring(lastAtSymbol + 1, cursorPos);
        
        setShowMentions(true);
        setMentionQuery(query);
        setMentionPosition({ start: lastAtSymbol, end: cursorPos });
        setMentionTriggered(true);
        
        // Calculate dropdown position
        calculateDropdownPosition();
        
        // Debounce the search
        if (mentionTimeoutRef.current) {
          clearTimeout(mentionTimeoutRef.current);
        }
        mentionTimeoutRef.current = setTimeout(() => {
          fetchMentionSuggestions(query);
        }, 300);
      } else {
        setShowMentions(false);
        setMentionTriggered(false);
      }
    } else {
      setShowMentions(false);
      setMentionTriggered(false);
    }
  };

  // Insert mention into content
  const insertMention = (username) => {
    const before = formData.content.substring(0, mentionPosition.start);
    const after = formData.content.substring(mentionPosition.end);
    const newContent = before + "@" + username + " " + after;

    setFormData((prev) => ({
      ...prev,
      content: newContent,
    }));

    setShowMentions(false);
    setMentionQuery("");
    setMentionTriggered(false);
    setSelectedMentionIndex(0);

    // Focus back to content area
    setTimeout(() => {
      if (contentRef.current) {
        const newCursorPos = before.length + username.length + 2;
        contentRef.current.focus();
        contentRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // Handle keyboard navigation in mention dropdown
  const handleContentKeyDown = (e) => {
    if (showMentions && mentionSuggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedMentionIndex((prev) => 
          prev < mentionSuggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedMentionIndex((prev) => prev > 0 ? prev - 1 : 0);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (mentionSuggestions[selectedMentionIndex]) {
          insertMention(mentionSuggestions[selectedMentionIndex].username);
        }
      } else if (e.key === "Escape") {
        setShowMentions(false);
        setMentionTriggered(false);
      }
    }
  };

  // Handle clicking the @ button
  const handleMentionButtonClick = () => {
    const currentContent = formData.content;
    const cursorPos = contentRef.current?.selectionStart || currentContent.length;
    const newContent = currentContent.substring(0, cursorPos) + "@" + currentContent.substring(cursorPos);
    
    setFormData(prev => ({ ...prev, content: newContent }));
    
    setTimeout(() => {
      if (contentRef.current) {
        const newCursorPos = cursorPos + 1;
        contentRef.current.focus();
        contentRef.current.setSelectionRange(newCursorPos, newCursorPos);
        
        // Manually trigger mention detection
        setShowMentions(true);
        setMentionQuery("");
        setMentionPosition({ start: cursorPos, end: newCursorPos });
        setMentionTriggered(true);
        calculateDropdownPosition();
        fetchMentionSuggestions("");
      }
    }, 10);
  };

  const analyzeTitle = (title) => {
    let score = 0;
    if (title.length >= 10) score += 1;
    if (title.length >= 20) score += 1;
    if (title.length <= 80) score += 1;
    if (/[?!]/.test(title)) score += 1;
    if (/^(What|Why|How|The|A)\s/i.test(title)) score += 1;
    setTitleScore(score);
  };

  const saveDraftToSession = () => {
    const draft = {
      ...formData,
      savedAt: new Date().toISOString(),
    };
    sessionStorage.setItem("postDraft", JSON.stringify(draft));
    setLastSaved(new Date());
    alert("Draft saved!");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "title") {
      setCharCount((prev) => ({
        ...prev,
        title: value.length,
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        imageFile: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      imageFile: null,
      imageUrl: null,
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

  const preuploadImage = async () => {
    if (!formData.imageFile) return null;

    try {
      setImageUploading(true);
      const url = await uploadImage(formData.imageFile);
      return url;
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed. Continuing without image.");
      return null;
    } finally {
      setImageUploading(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      if (!formData.title.trim() || !formData.content.trim()) {
        alert("Title and content are required for draft");
        setIsLoading(false);
        return;
      }

      const imageUrl = await preuploadImage();

      const result = await createPost({
        title: formData.title,
        content: formData.content,
        tags: formData.tags,
        status: "draft",
        isPublic: formData.isPublic,
        allowComments: formData.allowComments,
        featured_image: imageUrl,
      });

      if (result.success) {
        alert("Draft saved successfully!");
        sessionStorage.removeItem("postDraft");
        setLastSaved(null);
      } else {
        alert(result.error || "Failed to save draft");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      alert(error.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Title and content are required");
      setIsLoading(false);
      return;
    }

    try {
      const imageUrl = await preuploadImage();

      const result = await createPost({
        title: formData.title,
        content: formData.content,
        tags: formData.tags,
        status: "published",
        isPublic: formData.isPublic,
        allowComments: formData.allowComments,
        featured_image: imageUrl,
      });

      if (result.success) {
        alert("Post published successfully!");
        sessionStorage.removeItem("postDraft");
        navigate("/home");
      } else {
        alert(result.error || "Failed to publish post");
      }
    } catch (error) {
      console.error("Error publishing post:", error);
      alert(error.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const estimatedReadTime = Math.ceil(
    formData.content.split(/\s+/).filter(Boolean).length / 200,
  );

  const clearDraft = () => {
    if (
      window.confirm(
        "Are you sure you want to clear this draft? This action cannot be undone.",
      )
    ) {
      setFormData({
        title: "",
        content: "",
        tags: [],
        imageFile: null,
        imageUrl: null,
        isPublic: true,
        allowComments: true,
      });
      setImagePreview(null);
      setTagInput("");
      sessionStorage.removeItem("postDraft");
      setLastSaved(null);
      setShowMentions(false);
      setMentionQuery("");
    }
  };

  // Function to render content with highlighted mentions (for preview)
  const renderContentWithMentions = async (text) => {
    if (!text) return "Your story content will appear here...";

    const parts = text.split(/(@[\w.]+)/g);

    const renderedParts = await Promise.all(parts.map(async (part, index) => {
      if (part.startsWith("@")) {
        const username = part.substring(1);

        if (!username) {
          return part;
        }

        // Check cache first
        if (userProfileCache.current[username]) {
          return (
            <span key={index} className="inline-flex items-center">
              <a
                href={`/profile/${userProfileCache.current[username]}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/profile/${userProfileCache.current[username]}`);
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
              >
                {part}
              </a>
            </span>
          );
        }

        // Fetch user data if not cached
        try {
          const userProfile = await getUserByUsername(username);
          if (userProfile && userProfile.id) {
            // Cache the user ID
            userProfileCache.current[username] = userProfile.id;
            return (
              <span key={index} className="inline-flex items-center">
                <a
                  href={`/profile/${userProfile.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/profile/${userProfile.id}`);
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                >
                  {part}
                </a>
              </span>
            );
          } else {
            // User not found, keep original username link as fallback
            return (
              <span key={index} className="text-gray-500 inline-flex items-center">
                {part}
              </span>
            );
          }
        } catch (error) {
          console.error(`Error fetching user ID for ${username}:`, error);
          // Fallback to original behavior if API fails
          return (
            <span key={index} className="text-gray-500 inline-flex items-center">
              {part}
            </span>
          );
        }
      }
      return part;
    }));

    return renderedParts;
  };

  return (
    <>
      {isPageLoading ? (
        <PageLoader />
      ) : (
        <>
          <NavbarPrivate />
          <div
            className={`min-h-screen bg-gradient-to-b ${theme === "light" ? "from-gray-50 to-white" : "from-slate-900 to-slate-950"} pt-20 md:pt-24`}
          >
            <div className="max-w-6xl mx-auto px-4 py-8">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                <div>
                  <h1
                    className={`text-3xl md:text-4xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"} mb-2`}
                  >
                    Create New Story
                  </h1>
                  <p
                    className={`${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
                  >
                    Share your knowledge and ideas with the world
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {lastSaved && (
                    <div
                      className={`hidden md:flex items-center gap-2 px-3 py-1.5 ${theme === "light" ? "bg-green-50 text-green-700" : "bg-green-900/20 text-green-400"} rounded-lg text-sm`}
                    >
                      <Check className="w-4 h-4" />
                      <span>
                        Saved{" "}
                        {lastSaved.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                      showPreview
                        ? `${theme === "light" ? "bg-purple-100 text-purple-700" : "bg-purple-900/30 text-purple-400"}`
                        : `${theme === "light" ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-slate-800 text-gray-300 hover:bg-slate-700"}`
                    }`}
                  >
                    {showPreview ? (
                      <>
                        <FileText className="w-5 h-5" />
                        <span>Edit Mode</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-5 h-5" />
                        <span>Preview Mode</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {!showPreview ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Main Editor */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Title Input */}
                    <div
                      className={`${theme === "light" ? "bg-white" : "bg-slate-800"} rounded-2xl border ${theme === "light" ? "border-gray-200" : "border-slate-700"} p-6 shadow-sm`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <label
                          className={`flex items-center gap-2 text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}
                        >
                          <Type className="w-4 h-4" />
                          Story Title
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          {titleScore >= 3 && (
                            <span
                              className={`flex items-center gap-1 text-xs ${theme === "light" ? "text-green-600" : "text-green-400"}`}
                            >
                              <Sparkles className="w-3 h-3" />
                              Good title
                            </span>
                          )}
                          <span
                            className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}
                          >
                            {charCount.title}/100
                          </span>
                        </div>
                      </div>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        maxLength={100}
                        placeholder="Write a compelling title that captures attention..."
                        className={`w-full text-2xl md:text-3xl font-bold bg-transparent border-none ${theme === "light" ? "text-gray-900 placeholder:text-gray-400" : "text-white placeholder:text-slate-500"} focus:outline-none`}
                      />
                      <p
                        className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"} mt-2`}
                      >
                        Tip: Include keywords and keep it under 80 characters
                        for best results
                      </p>
                    </div>

                    {/* Content Editor with Mentions */}
                    <div className="relative">
                      <div
                        className={`${theme === "light" ? "bg-white" : "bg-slate-800"} rounded-2xl border ${theme === "light" ? "border-gray-200" : "border-slate-700"} shadow-sm overflow-hidden`}
                      >
                        {/* Toolbar */}
                        <div
                          className={`flex flex-wrap items-center gap-2 p-4 border-b ${theme === "light" ? "border-gray-200 bg-gray-50" : "border-slate-700 bg-slate-900/50"}`}
                        >
                          <span
                            className={`text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} mr-2`}
                          >
                            Formatting:
                          </span>
                          {[
                            {
                              icon: <Bold className="w-4 h-4" />,
                              cmd: "bold",
                              label: "Bold",
                            },
                            {
                              icon: <Italic className="w-4 h-4" />,
                              cmd: "italic",
                              label: "Italic",
                            },
                            {
                              icon: <Link className="w-4 h-4" />,
                              cmd: "link",
                              label: "Link",
                            },
                            {
                              icon: <List className="w-4 h-4" />,
                              cmd: "list",
                              label: "List",
                            },
                            {
                              icon: <ListOrdered className="w-4 h-4" />,
                              cmd: "numbered",
                              label: "Numbered List",
                            },
                            {
                              icon: <Quote className="w-4 h-4" />,
                              cmd: "quote",
                              label: "Quote",
                            },
                            {
                              icon: <Code className="w-4 h-4" />,
                              cmd: "code",
                              label: "Code Block",
                            },
                            {
                              icon: <AtSign className="w-4 h-4" />,
                              cmd: "mention",
                              label: "Mention User",
                              onClick: handleMentionButtonClick,
                            },
                          ].map((item) => (
                            <button
                              key={item.cmd}
                              className={`p-2 ${theme === "light" ? "text-gray-600 hover:text-gray-900 hover:bg-gray-200" : "text-gray-400 hover:text-white hover:bg-slate-700"} rounded-lg transition-colors`}
                              title={item.label}
                              onClick={item.onClick}
                              type="button"
                            >
                              {item.icon}
                            </button>
                          ))}
                        </div>

                        {/* Textarea with Mention Support */}
                        <div className="relative p-6">
                          <textarea
                            ref={contentRef}
                            name="content"
                            value={formData.content}
                            onChange={handleContentChange}
                            onKeyDown={handleContentKeyDown}
                            rows={15}
                            placeholder="Start writing your story here... Use @ to mention other users. You can use Markdown for formatting. Share your insights, experiences, and knowledge with the community!"
                            className={`w-full bg-transparent border-none ${theme === "light" ? "text-gray-700 placeholder:text-gray-400" : "text-gray-300 placeholder:text-slate-500"} focus:outline-none resize-none leading-relaxed min-h-[400px] font-mono text-sm`}
                          />
                        </div>

                        {/* Stats Bar */}
                        <div
                          className={`flex flex-wrap items-center justify-between gap-4 p-4 border-t ${theme === "light" ? "border-gray-200 bg-gray-50" : "border-slate-700 bg-slate-900/50"}`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex items-center gap-2 text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
                            >
                              <BookOpen className="w-4 h-4" />
                              <span>{wordCount} words</span>
                            </div>
                            <div
                              className={`flex items-center gap-2 text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
                            >
                              <Clock className="w-4 h-4" />
                              <span>~{readTime} min read</span>
                            </div>
                            <div
                              className={`flex items-center gap-2 text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
                            >
                              <Hash className="w-4 h-4" />
                              <span>{charCount.content} characters</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {mentionTriggered && (
                              <span className={`text-xs ${theme === "light" ? "text-blue-600" : "text-blue-400"} flex items-center gap-1`}>
                                <AtSign className="w-3 h-3" />
                                Type username
                              </span>
                            )}
                            <button
                              onClick={() => contentRef.current?.focus()}
                              className={`text-sm ${theme === "light" ? "text-blue-600 hover:text-blue-700" : "text-blue-400 hover:text-blue-300"} font-medium`}
                              type="button"
                            >
                              Focus writing
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Settings */}
                  <div className="space-y-6">
                    {/* Image Upload */}
                    <div
                      className={`${theme === "light" ? "bg-white" : "bg-slate-800"} rounded-2xl border ${theme === "light" ? "border-gray-200" : "border-slate-700"} p-6 shadow-sm`}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <ImageIcon
                          className={`w-5 h-5 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
                        />
                        <label
                          className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}
                        >
                          Featured Image
                        </label>
                      </div>

                      {imagePreview ? (
                        <div className="relative group">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-xl"
                          />

                          {imageUploading && (
                            <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center text-white flex-col gap-2">
                              <Loader2 className="w-6 h-6 animate-spin" />
                              <span className="text-sm">
                                Uploading image...
                              </span>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                            <button
                              onClick={removeImage}
                              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                              type="button"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label
                          className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed ${theme === "light" ? "border-gray-300 hover:border-blue-500" : "border-slate-600 hover:border-blue-400"} rounded-xl cursor-pointer transition-colors group`}
                        >
                          <div className="flex flex-col items-center justify-center text-center p-4">
                            <ImagePlus
                              className={`w-10 h-10 ${theme === "light" ? "text-gray-400 group-hover:text-blue-500" : "text-slate-500 group-hover:text-blue-400"} mb-3`}
                            />
                            <p
                              className={`text-sm font-semibold ${theme === "light" ? "text-gray-700" : "text-gray-300"} mb-1`}
                            >
                              Upload Image
                            </p>
                            <p
                              className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}
                            >
                              Drag & drop or click to upload
                            </p>
                            <p
                              className={`text-xs ${theme === "light" ? "text-gray-400" : "text-slate-500"} mt-2`}
                            >
                              Recommended: 1200×630px
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

                    {/* Tags */}
                    <div
                      className={`${theme === "light" ? "bg-white" : "bg-slate-800"} rounded-2xl border ${theme === "light" ? "border-gray-200" : "border-slate-700"} p-6 shadow-sm`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Tag
                            className={`w-5 h-5 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
                          />
                          <label
                            className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}
                          >
                            Topics
                          </label>
                        </div>
                        <span
                          className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}
                        >
                          {formData.tags.length}/5
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${theme === "light" ? "from-blue-100 to-purple-100 text-blue-700" : "from-blue-900/30 to-purple-900/30 text-blue-300"} text-sm font-medium rounded-full`}
                          >
                            #{tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className={`${theme === "light" ? "hover:text-blue-900" : "hover:text-blue-100"}`}
                              type="button"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="relative">
                        <input
                          ref={tagInputRef}
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleAddTag}
                          placeholder="Add topics..."
                          disabled={formData.tags.length >= 5}
                          className={`w-full px-4 py-2.5 ${theme === "light" ? "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400" : "bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"} border rounded-lg focus:outline-none focus:ring-2 ${theme === "light" ? "focus:ring-blue-500 focus:border-transparent" : "focus:ring-blue-400 focus:border-transparent"} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                        />

                        {/* Tag Suggestions */}
                        {showTagSuggestions && (
                          <div
                            className={`absolute top-full left-0 right-0 mt-1 z-50 ${theme === "light" ? "bg-white" : "bg-slate-800"} border ${theme === "light" ? "border-gray-200" : "border-slate-700"} rounded-lg shadow-lg`}
                          >
                            {suggestedTags.map((tag) => (
                              <button
                                key={tag}
                                onClick={() => {
                                  const tagToAdd = tagInput
                                    .trim()
                                    .toLowerCase();
                                  if (
                                    tagToAdd &&
                                    !formData.tags.includes(tagToAdd) &&
                                    formData.tags.length < 5
                                  ) {
                                    setFormData((prev) => ({
                                      ...prev,
                                      tags: [...prev.tags, tagToAdd],
                                    }));
                                    setTagInput("");
                                  }
                                }}
                                className={`w-full text-left px-4 py-2 ${theme === "light" ? "hover:bg-gray-50 text-gray-700" : "hover:bg-slate-700 text-gray-300"} text-sm transition-colors`}
                                type="button"
                              >
                                #{tag}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <p
                        className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"} mt-2`}
                      >
                        Add relevant topics to help readers find your story
                      </p>

                      {/* Popular Tags */}
                      <div className="mt-4">
                        <p
                          className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"} mb-2`}
                        >
                          Popular topics:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {popularTags.slice(0, 8).map((tag) => (
                            <button
                              key={tag}
                              onClick={() => {
                                const tagToAdd = tag.trim().toLowerCase();
                                if (
                                  tagToAdd &&
                                  !formData.tags.includes(tagToAdd) &&
                                  formData.tags.length < 5
                                ) {
                                  setFormData((prev) => ({
                                    ...prev,
                                    tags: [...prev.tags, tagToAdd],
                                  }));
                                }
                              }}
                              disabled={
                                formData.tags.includes(tag) ||
                                formData.tags.length >= 5
                              }
                              className={`px-2 py-1 text-xs ${theme === "light" ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-slate-700 text-gray-400 hover:bg-slate-600"} rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                              type="button"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Publishing Options */}
                    <div
                      className={`${theme === "light" ? "bg-white" : "bg-slate-800"} rounded-2xl border ${theme === "light" ? "border-gray-200" : "border-slate-700"} p-6 shadow-sm`}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Send
                          className={`w-5 h-5 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
                        />
                        <label
                          className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}
                        >
                          Publishing Options
                        </label>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-green-500" />
                            <div>
                              <p
                                className={`font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}
                              >
                                Public
                              </p>
                              <p
                                className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}
                              >
                                Anyone can see this
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                isPublic: true,
                              }))
                            }
                            className={`w-10 h-6 rounded-full transition-all flex items-center px-1 ${
                              formData.isPublic
                                ? "bg-green-500 justify-end"
                                : `${theme === "light" ? "bg-gray-300" : "bg-slate-600"} justify-start`
                            }`}
                            type="button"
                          >
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-gray-500" />
                            <div>
                              <p
                                className={`font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}
                              >
                                Private
                              </p>
                              <p
                                className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}
                              >
                                Only you can see this
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                isPublic: false,
                              }))
                            }
                            className={`w-10 h-6 rounded-full transition-all flex items-center px-1 ${
                              !formData.isPublic
                                ? "bg-blue-500 justify-end"
                                : `${theme === "light" ? "bg-gray-300" : "bg-slate-600"} justify-start`
                            }`}
                            type="button"
                          >
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                          </button>
                        </div>

                        <div
                          className={`pt-4 border-t ${theme === "light" ? "border-gray-200" : "border-slate-700"}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <label
                              className={`font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}
                            >
                              Allow Comments
                            </label>
                            <button
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  allowComments: !prev.allowComments,
                                }))
                              }
                              className={`w-10 h-6 rounded-full transition-all flex items-center px-1 ${
                                formData.allowComments
                                  ? "bg-blue-500 justify-end"
                                  : `${theme === "light" ? "bg-gray-300" : "bg-slate-600"} justify-start`
                            }`}
                            type="button"
                          >
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                          </button>
                        </div>
                          <p
                            className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}
                          >
                            Readers can comment on your story
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="sticky top-24 space-y-3">
                      <button
                        onClick={handlePublish}
                        disabled={
                          isLoading ||
                          imageUploading ||
                          !formData.title.trim() ||
                          !formData.content.trim()
                        }
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        type="button"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Publish Story
                          </>
                        )}
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={handleSaveDraft}
                          disabled={isLoading || imageUploading}
                          className={`py-3 px-4 ${theme === "light" ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-slate-800 text-gray-300 hover:bg-slate-700"} font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2`}
                          type="button"
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Save Draft
                            </>
                          )}
                        </button>

                        <button
                          onClick={clearDraft}
                          disabled={isLoading || imageUploading}
                          className={`py-3 px-4 ${theme === "light" ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-red-900/20 text-red-400 hover:bg-red-900/30"} font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2`}
                          type="button"
                        >
                          <FileWarning className="w-4 h-4" />
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Preview Mode */
                <div
                  className={`${theme === "light" ? "bg-white" : "bg-slate-800"} rounded-2xl border ${theme === "light" ? "border-gray-200" : "border-slate-700"} shadow-xl overflow-hidden`}
                >
                  {/* Preview Header */}
                  <div
                    className={`p-8 border-b ${theme === "light" ? "border-gray-200" : "border-slate-700"}`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            userProfile?.avatar_url ||
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=author"
                          }
                          alt="Author"
                          className={`w-12 h-12 rounded-xl border-2 ${theme === "light" ? "border-white" : "border-slate-800"} shadow-sm`}
                        />
                        <div>
                          <p
                            className={`font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}
                          >
                            {userProfile?.full_name ||
                              userProfile?.username ||
                              "Your Name"}
                          </p>
                          <div
                            className={`flex items-center gap-3 text-sm ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}
                          >
                            <span>Just now</span>
                            <span>·</span>
                            <span>~{estimatedReadTime} min read</span>
                            {!formData.isPublic && (
                              <>
                                <span>·</span>
                                <span className="flex items-center gap-1 text-blue-500">
                                  <Lock className="w-3 h-3" />
                                  Private
                                </span>
                              </>
                            )}
                            {!formData.allowComments && (
                              <>
                                <span>·</span>
                                <span className="flex items-center gap-1 text-gray-500">
                                  <MessageCircle className="w-3 h-3" />
                                  Comments off
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <h1
                      className={`text-3xl md:text-4xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"} mb-4`}
                    >
                      {formData.title || "Your Story Title"}
                    </h1>

                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-3 py-1.5 bg-gradient-to-r ${theme === "light" ? "from-blue-100 to-purple-100 text-blue-700" : "from-blue-900/30 to-purple-900/30 text-blue-300"} text-sm font-medium rounded-lg`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Preview Content */}
                  <div className="p-8">
                    {imagePreview && (
                      <div className="mb-8 overflow-hidden rounded-xl">
                        <img
                          src={imagePreview}
                          alt="Featured"
                          className="w-full h-auto rounded-xl shadow-lg"
                        />
                      </div>
                    )}

                    <div
                      className={`prose ${theme === "dark" ? "prose-invert" : ""} max-w-none`}
                    >
                      <div
                        className={`whitespace-pre-wrap font-sans ${theme === "light" ? "text-gray-700" : "text-gray-300"} leading-relaxed text-lg`}
                      >
                        {renderedPreviewContent || formData.content}
                      </div>
                    </div>

                    {/* Preview Footer */}
                    <div
                      className={`mt-12 pt-8 border-t ${theme === "light" ? "border-gray-200" : "border-slate-700"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            className={`flex items-center gap-2 ${theme === "light" ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`}
                            type="button"
                          >
                            <Heart className="w-5 h-5" />
                            <span>Like</span>
                          </button>
                          {formData.allowComments && (
                            <button
                              className={`flex items-center gap-2 ${theme === "light" ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`}
                              type="button"
                            >
                              <MessageCircle className="w-5 h-5" />
                              <span>Comment</span>
                            </button>
                          )}
                          <button
                            className={`flex items-center gap-2 ${theme === "light" ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`}
                            type="button"
                          >
                            <Share2 className="w-5 h-5" />
                            <span>Share</span>
                          </button>
                        </div>

                        <button
                          className={`${theme === "light" ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-slate-700 text-gray-300 hover:bg-slate-600"} px-4 py-2 rounded-lg transition-colors`}
                          type="button"
                        >
                          <Bookmark className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mention Suggestions Dropdown - PORTAL STYLE */}
          {showMentions && (
            <div
              ref={mentionDropdownRef}
              className={`fixed z-[10000] w-72 ${theme === "light" ? "bg-white border-gray-200" : "bg-slate-800 border-slate-700"} border rounded-xl shadow-2xl max-h-80 overflow-y-auto`}
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
              }}
            >
              {mentionLoading ? (
                <div className={`p-4 text-center ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                  <Loader2 className="w-5 h-5 mx-auto mb-2 animate-spin" />
                  <p className="text-sm">Loading users...</p>
                </div>
              ) : mentionSuggestions.length > 0 ? (
                <div className="py-2">
                  {mentionSuggestions.map((user, index) => (
                    <button
                      key={user.id}
                      onClick={() => insertMention(user.username)}
                      className={`w-full p-3 flex items-center gap-3 text-left transition-colors ${
                        index === selectedMentionIndex
                          ? `${theme === "light" ? "bg-blue-50" : "bg-slate-700"}`
                          : `${theme === "light" ? "hover:bg-gray-50" : "hover:bg-slate-700/50"}`
                      } ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                      type="button"
                      onMouseEnter={() => setSelectedMentionIndex(index)}
                    >
                      <img
                        src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                        alt={user.username}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">@{user.username}</div>
                        {user.full_name && (
                          <div className={`text-xs truncate ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                            {user.full_name}
                          </div>
                        )}
                      </div>
                      {index === selectedMentionIndex && (
                        <Check className={`w-4 h-4 flex-shrink-0 ${theme === "light" ? "text-blue-600" : "text-blue-400"}`} />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className={`p-6 text-center ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                  <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">No users found</p>
                  <p className="text-xs mt-1">
                    {mentionQuery ? `No users match "${mentionQuery}"` : "Start typing to search users"}
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}