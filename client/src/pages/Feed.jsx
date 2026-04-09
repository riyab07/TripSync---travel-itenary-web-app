import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import CreatePost from "../components/CreatePost";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("posts")) || [];
    setPosts(stored);
  }, []);

  const updateStorage = (updated) => {
    setPosts(updated);
    localStorage.setItem("posts", JSON.stringify(updated));
  };

  const likePost = (id) => {
    const updated = posts.map((p) =>
      p.id === id ? { ...p, likes: p.likes + 1 } : p
    );
    updateStorage(updated);
  };

  const addComment = (id) => {
    if (!commentText) return;

    const updated = posts.map((p) =>
      p.id === id
        ? { ...p, comments: [...p.comments, commentText] }
        : p
    );

    updateStorage(updated);
    setCommentText("");
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6">
          Travel Feed 🌍
        </h1>

        <CreatePost />

        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow mb-6">
            
            <img
              src={post.image}
              alt="post"
              className="w-full h-60 object-cover"
            />

            <div className="p-4">
              <h3 className="font-semibold">{post.user}</h3>
              <p>{post.caption}</p>
              <p className="text-sm text-gray-500">📍 {post.location}</p>

              <button
                onClick={() => likePost(post.id)}
                className="text-red-500 mt-2"
              >
                ❤️ {post.likes}
              </button>

              {/* Comments */}
              <div className="mt-3">
                {post.comments.map((c, i) => (
                  <p key={i} className="text-sm text-gray-700">
                    💬 {c}
                  </p>
                ))}
              </div>

              <div className="flex mt-2 gap-2">
                <input
                  type="text"
                  placeholder="Add comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 p-2 border rounded"
                />

                <button
                  onClick={() => addComment(post.id)}
                  className="bg-indigo-600 text-white px-3 rounded"
                >
                  Post
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;