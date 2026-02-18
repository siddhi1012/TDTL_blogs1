import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [editingPost, setEditingPost] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts/');
      // Ensure response.data is an array
      const postsData = Array.isArray(response.data) ? response.data : response.data.results || [];
      setPosts(postsData);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts');
      setPosts([]); // Ensure posts is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      setError('Title and content are required');
      return;
    }
    
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post('/api/posts/', newPost);
      setPosts([response.data, ...posts]);
      setNewPost({ title: '', content: '' });
      setShowCreateForm(false);
      setSuccess('Post created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.detail || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePost = async (postId, updatedData) => {
    try {
      const response = await axios.put(`/api/posts/${postId}/`, updatedData);
      if (Array.isArray(posts)) {
        setPosts(posts.map(post => post.id === postId ? response.data : post));
      }
      setEditingPost(null);
    } catch (err) {
      setError('Failed to update post');
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`/api/posts/${postId}/`);
        if (Array.isArray(posts)) {
          setPosts(posts.filter(post => post.id !== postId));
        }
      } catch (err) {
        setError('Failed to delete post');
      }
    }
  };

  if (loading) return <div className="loading">Loading posts...</div>;

  return (
    <div>
      <h1>Blog Posts</h1>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      {user && (
        <div style={{ marginBottom: '20px' }}>
          {!showCreateForm ? (
            <button 
              className="btn" 
              onClick={() => setShowCreateForm(true)}
            >
              Create New Post
            </button>
          ) : (
            <div className="card">
              <h3>Create New Post</h3>
              <form onSubmit={handleCreatePost}>
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Content:</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Post'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewPost({ title: '', content: '' });
                    setError('');
                  }}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {!Array.isArray(posts) || posts.length === 0 ? (
        <div className="card">
          <p>No posts found. Be the first to create one!</p>
        </div>
      ) : (
        posts.map(post => (
          <div key={post.id} className="card">
            {editingPost === post.id ? (
              <div>
                <h3>Edit Post</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdatePost(post.id, {
                    title: e.target.title.value,
                    content: e.target.content.value
                  });
                }}>
                  <div className="form-group">
                    <label>Title:</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={post.title}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Content:</label>
                    <textarea
                      name="content"
                      defaultValue={post.content}
                      required
                    />
                  </div>
                  <button type="submit" className="btn">Update</button>
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={() => setEditingPost(null)}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <h2>{post.title}</h2>
                <div className="post-meta">
                  By {post.author} | {new Date(post.created_at).toLocaleDateString()}
                </div>
                <p>{post.content}</p>
                {user && user.id === post.author_id && (
                  <div className="post-actions">
                    <button 
                      className="btn"
                      onClick={() => setEditingPost(post.id)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
