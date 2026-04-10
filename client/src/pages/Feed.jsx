import { useState, useEffect } from "react";
import api from "../api";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get("/posts");
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const toggleLike = async (postId) => {
    try {
      const { data } = await api.put(`/posts/${postId}/like`);
      setPosts(posts.map((p) =>
        p._id === postId
          ? { ...p, likes: Array(data.likes).fill(0), liked: data.liked }
          : p
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async (postId) => {
    const text = commentText[postId]?.trim();
    if (!text) return;
    try {
      const { data } = await api.post(`/posts/${postId}/comment`, { text });
      setPosts(posts.map((p) => (p._id === postId ? data : p)));
      setCommentText((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Feed 📸</h1>
        <p className="text-sm text-gray-500 mt-1">Travel moments from the community</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading feed...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📸</p>
          <p>No posts yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="max-w-xl mx-auto flex flex-col gap-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

              {/* Author */}
              <div className="flex items-center gap-3 p-4 pb-2">
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                  {post.author?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{post.author?.name}</p>
                  {post.location && (
                    <p className="text-xs text-gray-400">📍 {post.location}</p>
                  )}
                </div>
              </div>

              {/* Image */}
              {post.image && (
                <img src={post.image} alt="post" className="w-full object-cover max-h-80" />
              )}

              {/* Caption + actions */}
              <div className="p-4">
                <p className="text-sm text-gray-700 mb-3">{post.caption}</p>

                <div className="flex items-center gap-3 mb-4">
                  <button onClick={() => toggleLike(post._id)} className="text-xl">
                    {post.liked ? "❤️" : "🤍"}
                  </button>
                  <span className="text-xs text-gray-400">{post.likes?.length || 0} likes</span>
                </div>

                {/* Comments */}
                {post.comments?.length > 0 && (
                  <div className="mb-3 flex flex-col gap-1.5">
                    {post.comments.map((c, i) => (
                      <p key={i} className="text-xs text-gray-600">
                        <span className="font-semibold">{c.name}</span> {c.text}
                      </p>
                    ))}
                  </div>
                )}

                {/* Add comment */}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText[post._id] || ""}
                    onChange={(e) =>
                      setCommentText((prev) => ({ ...prev, [post._id]: e.target.value }))
                    }
                    onKeyDown={(e) => e.key === "Enter" && addComment(post._id)}
                    className="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <button
                    onClick={() => addComment(post._id)}
                    className="text-xs bg-indigo-600 text-white px-3 py-2 rounded-xl hover:bg-indigo-700 transition"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Feed;