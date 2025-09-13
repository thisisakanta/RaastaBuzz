import axios from 'axios'

const API_BASE = 'http://localhost:8080/api/forum'

export const getAllPosts = async () => {
  const res = await axios.get(`${API_BASE}/posts`)
  return res.data
}

export const getPostsByCategory = async (category) => {
  const res = await axios.get(`${API_BASE}/posts/category/${category}`)
  return res.data
}

export const createPost = async (post, token) => {
  const res = await axios.post(`${API_BASE}/posts`, post, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

export const likePost = async (postId, token) => {
  const res = await axios.post(`${API_BASE}/posts/${postId}/like`, null, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

export const getComments = async (postId) => {
  const res = await axios.get(`${API_BASE}/posts/${postId}/comments`)
  return res.data
}

export const addComment = async (postId, content, token) => {
  const params = new URLSearchParams()
  params.append('content', content)
  const res = await axios.post(`${API_BASE}/posts/${postId}/comments`, params, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return res.data
}


