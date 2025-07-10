import { LocalPosts } from "../../service/local.service";
import axios from "axios";

const baseUrl = process.env.REACT_APP_URL_DB || 'http://localhost:8080';
const apiUrl = `${baseUrl}/api/posts`;

// Fetch and sync all posts from server
export const requestPost = async () => {
  try {
    console.log('Attempting to fetch posts from:', apiUrl);

    const response = await axios.get(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
      }
    });

    console.log('Response from server:', response.data);

    const posts = response.data?.data?.posts || [];

    if (!Array.isArray(posts) || posts.length === 0) {
      return { success: false, error: "No posts returned from server." };
    }

    for (const post of posts) {
      const localPost = {
        id: post.id,
        user_id: post.userId,
        group_id: post.groupId,
        content: post.content,
        title: post.title,
        created_at: post.createdAt
      };

      await LocalPosts.savePost(localPost); // Save each individually
    }

    return { success: true, count: posts.length };

  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to fetch posts'
    };
  }
};



export const createPost = async (postData) => {
  try {
    const response = await axios.post(apiUrl, postData, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });

    const post = response.data?.data; 

    if (!post) {
      return {
        success: false,
        error: "No post returned from server"
      };
    }

    return {
      success: true,
      /*post: {
        id: post.id,
        user_id: post.userId,
        group_id: post.groupId,
        content: post.content,
        title: post.title,
        created_at: post.createdAt
      }*/
    };

  } catch (error) {
    console.error("createPost error:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Failed to create post"
    };
  }
};

