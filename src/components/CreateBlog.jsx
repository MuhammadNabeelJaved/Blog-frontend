import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router"; // Import useNavigate for redirection
import ButtonsLoader from "./ButtonsLoader.jsx";
import { createBlog } from "../api/blog.api.js";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { blogTemplates } from "../utils/blogTemplates.js";

const CreateBlog = () => {
  const [loading, setLoading] = useState(false); // State to manage loading
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [content, setContent] = useState(""); // State for blog content
  const [title, setTitle] = useState(""); // State for blog title
  const [description, setDescription] = useState(""); // State for blog description
  const [image, setImage] = useState(null); // State for blog image
  const [previewMode, setPreviewMode] = useState(false); // State for preview mode
  const [plainTextContent, setPlainTextContent] = useState(""); // Plain text version for metrics
  const [readabilityScore, setReadabilityScore] = useState(null); // Readability score
  const [contentMetrics, setContentMetrics] = useState({ words: 0, chars: 0, readingTime: '0 min' }); // Content metrics
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false); // Grammar checking state
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  
  const navigate = useNavigate(); // Hook for navigation
  const quillRef = useRef(null);

  // Extract plain text from HTML content for metrics calculation
  useEffect(() => {
    if (content) {
      // Create a temporary element to parse HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const extractedText = tempDiv.textContent || tempDiv.innerText || '';
      setPlainTextContent(extractedText);
      
      // Calculate metrics
      calculateContentMetrics(extractedText);
    } else {
      setPlainTextContent('');
      setContentMetrics({ words: 0, chars: 0, readingTime: '0 min' });
    }
  }, [content]);

  // Calculate content metrics
  const calculateContentMetrics = (text) => {
    // Word count
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    // Character count
    const chars = text.length;
    
    // Estimated reading time (average reading speed: 200 words per minute)
    const readingTimeMinutes = Math.ceil(words / 200);
    const readingTime = `${readingTimeMinutes} min${readingTimeMinutes !== 1 ? 's' : ''}`;
    
    // Calculate readability score (simplified Flesch-Kincaid)
    calculateReadabilityScore(text, words);
    
    setContentMetrics({ words, chars, readingTime });
  };

  // Calculate readability score (simplified Flesch-Kincaid)
  const calculateReadabilityScore = (text, wordCount) => {
    if (!text || wordCount === 0) {
      setReadabilityScore(null);
      return;
    }
    
    // Count sentences (simplistic: look for periods, exclamation points, question marks)
    const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;
    
    // Count syllables (very approximate method)
    const syllableCount = countApproximateSyllables(text);
    
    // Calculate Flesch-Kincaid Grade Level (simplified)
    const score = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);
    
    // Clamp score to 0-100 range and set readability level
    const clampedScore = Math.min(100, Math.max(0, score));
    let readabilityLevel;
    
    if (clampedScore >= 90) readabilityLevel = "Very Easy";
    else if (clampedScore >= 80) readabilityLevel = "Easy";
    else if (clampedScore >= 70) readabilityLevel = "Fairly Easy";
    else if (clampedScore >= 60) readabilityLevel = "Standard";
    else if (clampedScore >= 50) readabilityLevel = "Fairly Difficult";
    else if (clampedScore >= 30) readabilityLevel = "Difficult";
    else readabilityLevel = "Very Difficult";
    
    setReadabilityScore({ score: Math.round(clampedScore), level: readabilityLevel });
  };

  // Count syllables (approximate method)
  const countApproximateSyllables = (text) => {
    // Remove non-word characters and convert to lowercase
    const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
    
    let syllableCount = 0;
    
    words.forEach(word => {
      if (!word) return;
      
      // Rule 1: Count vowel groups
      const vowelGroups = word.match(/[aeiouy]+/g);
      let count = vowelGroups ? vowelGroups.length : 0;
      
      // Rule 2: Subtract silent 'e' at the end
      if (word.length > 2 && word.endsWith('e')) {
        count--;
      }
      
      // Rule 3: Ensure each word has at least one syllable
      syllableCount += Math.max(1, count);
    });
    
    return syllableCount;
  };

  // Simulate grammar check functionality
  const checkGrammar = () => {
    if (!plainTextContent.trim()) {
      setErrorMessage("Please add some content before checking grammar");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    setIsCheckingGrammar(true);
    
    // Simulate API call to grammar check service
    setTimeout(() => {
      // In a real implementation, this would call an actual grammar checking API
      const commonIssues = findCommonGrammarIssues(plainTextContent);
      
      if (commonIssues.length === 0) {
        setSuccessMessage("Grammar check complete! No obvious issues found.");
      } else {
        setErrorMessage(`Grammar check complete. Found ${commonIssues.length} potential issue(s). Review your content for: ${commonIssues.join(', ')}`);
      }
      
      setIsCheckingGrammar(false);
      
      // Auto-clear the message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000);
    }, 1500);
  };

  // Find common grammar issues (simplified demonstration)
  const findCommonGrammarIssues = (text) => {
    const issues = [];
    
    // Check for double spaces
    if (text.includes('  ')) {
      issues.push('double spaces');
    }
    
    // Check for common redundant phrases
    const redundantPhrases = ['very unique', 'past history', 'end result', 'advance planning'];
    for (const phrase of redundantPhrases) {
      if (text.toLowerCase().includes(phrase)) {
        issues.push(`redundant phrase "${phrase}"`);
      }
    }
    
    // Check for passive voice indicators (simplified)
    const passiveIndicators = ['was made', 'were created', 'is being', 'are being', 'has been', 'have been'];
    for (const indicator of passiveIndicators) {
      if (text.toLowerCase().includes(indicator)) {
        issues.push('passive voice');
        break;
      }
    }
    
    return issues;
  };

  // Quill editor modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean'],
    ],
  };

  // Quill editor formats
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'blockquote', 'code-block',
    'link', 'image'
  ];

  // Custom CSS styles for the blog preview
  const blogPreviewStyles = {
    container: {
      fontFamily: "'Inter', sans-serif",
      lineHeight: 1.6,
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#1a202c',
    },
    description: {
      fontSize: '1.125rem',
      color: '#4a5568',
      marginBottom: '2rem',
      fontStyle: 'italic',
    },
    content: {
      fontSize: '1.125rem',
      '& h1': {
        fontSize: '2rem',
        marginTop: '2rem',
        marginBottom: '1rem',
        fontWeight: 'bold',
      },
      '& h2': {
        fontSize: '1.75rem',
        marginTop: '1.75rem',
        marginBottom: '0.875rem',
        fontWeight: 'bold',
      },
      '& h3': {
        fontSize: '1.5rem',
        marginTop: '1.5rem',
        marginBottom: '0.75rem',
        fontWeight: 'bold',
      },
      '& p': {
        marginBottom: '1.25rem',
      },
      '& ul, & ol': {
        marginLeft: '2rem',
        marginBottom: '1.25rem',
      },
      '& blockquote': {
        borderLeft: '4px solid #e2e8f0',
        paddingLeft: '1rem',
        fontStyle: 'italic',
        margin: '1.5rem 0',
      },
      '& code': {
        backgroundColor: '#f7fafc',
        padding: '0.25rem 0.5rem',
        borderRadius: '0.25rem',
        fontFamily: 'monospace',
      },
      '& pre': {
        backgroundColor: '#1a202c',
        color: '#e2e8f0',
        padding: '1rem',
        borderRadius: '0.5rem',
        overflowX: 'auto',
        marginBottom: '1.5rem',
      },
    }
  };

  const publishBlog = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Validation checks
    if (title.length > 70) {
      setErrorMessage("Title must be 70 characters or less.");
      return;
    }

    if (description.length > 300) {
      setErrorMessage("Description must be 300 characters or less.");
      return;
    }

    if (!content) {
      setErrorMessage("Content cannot be empty.");
      return;
    }

    if (!image) {
      setErrorMessage("Please upload an image.");
      return;
    }

    setLoading(true); // Set loading to true when starting the request
    setErrorMessage(""); // Clear previous error messages

    // Create form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", content);
    formData.append("image", image);

    const accessToken = localStorage.getItem("accessToken"); // Get the token from localStorage

    try {
      const response = await createBlog(formData, accessToken); // Call the createBlog function
      setSuccessMessage("Blog published successfully!"); // Set success message
      setTimeout(() => {
        navigate(`/dashboard/user/${response.data?.user}`); // Redirect to dashboard after 2 seconds
      }, 2000);
    } catch (error) {
      console.log(error);
      setSuccessMessage(""); // Clear success message on error
      setErrorMessage("Failed to publish blog."); // Set error message
    } finally {
      setLoading(false); // Set loading to false after the request is complete
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage("Please upload an image file");
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Image size should be less than 5MB");
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }

      setImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Apply a beautification preset to the content
  const applyBeautification = (preset) => {
    if (blogTemplates[preset]) {
      setContent(blogTemplates[preset]);
    }
  };

  // Quick formatting function for applying common styles
  const applyFormatting = (format) => {
    if (!quillRef.current) return;
    
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection();
    
    if (range && range.length > 0) {
      // Apply different formats based on the button clicked
      switch(format) {
        case 'highlight':
          quill.format('background', '#ffeb3b');
          break;
        case 'code':
          quill.format('code', true);
          break;
        case 'quote':
          quill.format('blockquote', true);
          break;
        case 'h1':
          quill.format('header', 1);
          break;
        case 'h2':
          quill.format('header', 2);
          break;
        case 'list-bullet':
          quill.format('list', 'bullet');
          break;
        case 'list-ordered':
          quill.format('list', 'ordered');
          break;
        case 'clear':
          quill.removeFormat(range.index, range.length);
          break;
        default:
          break;
      }
    } else {
      // If no text is selected, show a hint to the user
      setErrorMessage("Please select some text before applying formatting");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Blog Post</h1>
      
      {/* Toggle between edit and preview mode */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setPreviewMode(false)}
            className={`px-4 py-2 rounded-md ${!previewMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Edit
          </button>
          <button
            onClick={() => setPreviewMode(true)}
            className={`px-4 py-2 rounded-md ${previewMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Preview
          </button>
        </div>

        {/* Beautify options */}
        {!previewMode && (
          <div className="flex items-center space-x-2">
            <span className="text-gray-700 font-medium">Beautify as:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => applyBeautification("professional")}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm transition duration-200"
              >
                Professional
              </button>
              <button
                onClick={() => applyBeautification("creative")}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm transition duration-200"
              >
                Creative
              </button>
              <button
                onClick={() => applyBeautification("technical")}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm transition duration-200"
              >
                Technical
              </button>
              <button
                onClick={() => applyBeautification("educational")}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm transition duration-200"
              >
                Educational
              </button>
              <button
                onClick={() => applyBeautification("storytelling")}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm transition duration-200"
              >
                Storytelling
              </button>
            </div>
          </div>
        )}
      </div>

      {successMessage && ( // Show success message if it exists
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {errorMessage && ( // Show error message if it exists
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      {previewMode ? (
        // Preview mode
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg" style={blogPreviewStyles.container}>
          <h1 style={blogPreviewStyles.title}>{title || "Blog Title"}</h1>
          <p style={blogPreviewStyles.description}>{description || "Blog description will appear here..."}</p>
          
          {imagePreview && (
            <div className="mb-6">
              <img 
                src={imagePreview} 
                alt="Blog cover" 
                className="w-full h-64 object-cover rounded-md shadow-md"
              />
            </div>
          )}
          
          <div 
            className="prose prose-lg max-w-none" 
            style={blogPreviewStyles.content}
            dangerouslySetInnerHTML={{ __html: content || "<p>Your blog content will appear here...</p>" }} 
          />
        </div>
      ) : (
        // Edit mode
        <form
          onSubmit={publishBlog}
          className="max-w-3xl mx-auto"
        >
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <p className="text-sm text-gray-500 mt-1">{title.length}/70 characters</p>
          </div>
          
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 font-bold mb-2"
            >
              Description
            </label>
            <input
              id="description"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter blog description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <p className="text-sm text-gray-500 mt-1">{description.length}/300 characters</p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-gray-700 font-bold mb-2"
            >
              Featured Image
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {imagePreview && (
                <div className="relative w-32 h-32">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Recommended size: 1200x630 pixels. Max file size: 5MB
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-gray-700 font-bold mb-2"
            >
              Content
            </label>
            
            {/* Content optimization tools */}
            <div className="flex flex-wrap gap-2 mb-2 justify-between">
              <div className="flex flex-wrap gap-2 p-2 bg-gray-50 border border-gray-200 rounded-md">
                <button
                  type="button"
                  onClick={() => applyFormatting('highlight')}
                  className="px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-gray-800 rounded text-sm"
                  title="Highlight selected text"
                >
                  Highlight
                </button>
                <button
                  type="button"
                  onClick={() => applyFormatting('code')}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-sm font-mono"
                  title="Format as code"
                >
                  Code
                </button>
                <button
                  type="button"
                  onClick={() => applyFormatting('quote')}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-sm"
                  title="Format as blockquote"
                >
                  Quote
                </button>
                <button
                  type="button"
                  onClick={() => applyFormatting('h1')}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-sm font-bold"
                  title="Heading 1"
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() => applyFormatting('h2')}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-sm font-bold"
                  title="Heading 2"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => applyFormatting('list-bullet')}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-sm"
                  title="Bullet list"
                >
                  • List
                </button>
                <button
                  type="button"
                  onClick={() => applyFormatting('list-ordered')}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-sm"
                  title="Numbered list"
                >
                  1. List
                </button>
                <button
                  type="button"
                  onClick={() => applyFormatting('clear')}
                  className="px-2 py-1 bg-red-100 hover:bg-red-200 text-gray-800 rounded text-sm"
                  title="Clear formatting"
                >
                  Clear Format
                </button>
              </div>

              {/* Grammar check button */}
              <button
                type="button"
                onClick={checkGrammar}
                disabled={isCheckingGrammar}
                className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm flex items-center gap-1 transition-colors"
              >
                {isCheckingGrammar ? (
                  <>
                    <span className="animate-pulse">Checking...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Check Grammar</span>
                  </>
                )}
              </button>
            </div>
            
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              placeholder="Write your blog content here..."
              className="h-64 mb-12" // Add height and bottom margin for toolbar
            />
            
            {/* Content metrics */}
            <div className="mt-16 flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                <span>Words: <strong>{contentMetrics.words}</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Characters: <strong>{contentMetrics.chars}</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Reading time: <strong>{contentMetrics.readingTime}</strong></span>
              </div>
              {readabilityScore && (
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Readability: 
                    <strong className={`ml-1 ${
                      readabilityScore.score >= 70 
                        ? 'text-green-600' 
                        : readabilityScore.score >= 50 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                    }`}>
                      {readabilityScore.level} ({readabilityScore.score}/100)
                    </strong>
                  </span>
                </div>
              )}
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              <p>💡 <strong>Tip:</strong> Use the beautify options above to quickly apply professional formatting to your blog post.</p>
              <p>💡 <strong>Tip:</strong> Select text and use the formatting buttons to apply specific styles.</p>
              <p>💡 <strong>Tip:</strong> Aim for a readability score of 60-70 for optimal engagement.</p>
            </div>
          </div>
          
          <button
            type="submit"
            className="bg-blue-700 text-white px-6 py-2 cursor-pointer rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? <ButtonsLoader /> : "Publish Blog"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateBlog;
