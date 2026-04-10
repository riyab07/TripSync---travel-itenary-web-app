import { useState, useEffect } from "react";
import CreatePost from "../components/CreatePost";
import api from "../api";

const TABS = ["My Trips", "Posts", "Saved"];

function Profile() {
  const user = localStorage.getItem("user");
  const [activeTab, setActiveTab] = useState("My Trips");
  const [trips, setTrips] = useState([]);
  const [posts, setPosts] = useState([]);
  const [savedTrips, setSavedTrips] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripsRes, postsRes] = await Promise.all([
          api.get("/trips/my"),
          api.get("/posts/my"),
        ]);
        setTrips(tripsRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // saved trips still from localStorage for now
    const saved = JSON.parse(localStorage.getItem("savedTrips")) || [];
    setSavedTrips(saved);
  }, []);

  const addPost = async (post) => {
    try {
      const { data } = await api.post("/posts", post);
      setPosts([data, ...posts]);
      setShowPostForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const deletePost = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const unsaveTrip = (id) => {
    const updated = savedTrips.filter((t) => t.id !== id);
    setSavedTrips(updated);
    localStorage.setItem("savedTrips", JSON.stringify(updated));
  };

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
          {user?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">{user}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {trips.length} trips · {posts.length} posts · {savedTrips.length} saved
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              activeTab === tab
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : (
        <>
          {/* My Trips */}
          {activeTab === "My Trips" && (
            trips.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-4xl mb-3">🗺️</p>
                <p>No trips yet. Go create one!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {trips.map((trip) => (
                  <div key={trip._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-800">{trip.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        trip.isPublic ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
                      }`}>
                        {trip.isPublic ? "🌍 Public" : "🔒 Private"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">📍 {trip.destination}</p>
                    <p className="text-sm text-gray-500">📅 {trip.date}</p>
                    <p className="text-sm text-gray-500">💰 ₹{trip.budget}</p>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Posts */}
          {activeTab === "Posts" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500">{posts.length} posts</p>
                <button
                  onClick={() => setShowPostForm(!showPostForm)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
                >
                  {showPostForm ? "✕ Cancel" : "+ New Post"}
                </button>
              </div>

              {showPostForm && (
                <div className="bg-white rounded-2xl shadow p-5 mb-5 border border-gray-100">
                  <CreatePost onAddPost={addPost} />
                </div>
              )}

              {posts.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-4xl mb-3">📸</p>
                  <p>No posts yet. Share your travel moments!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {posts.map((post) => (
                    <div key={post._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      {post.image && (
                        <img src={post.image} alt="post" className="w-full h-48 object-cover" />
                      )}
                      <div className="p-4">
                        {post.location && (
                          <p className="text-xs text-indigo-500 mb-1">📍 {post.location}</p>
                        )}
                        <p className="text-sm text-gray-700">{post.caption}</p>
                        <button
                          onClick={() => deletePost(post._id)}
                          className="text-xs text-red-400 hover:underline mt-3"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Saved */}
          {activeTab === "Saved" && (
            savedTrips.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-4xl mb-3">💾</p>
                <p>No saved trips yet!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {savedTrips.map((trip) => (
                  <div key={trip.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-800">{trip.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">📍 {trip.destination}</p>
                    <button
                      onClick={() => unsaveTrip(trip.id)}
                      className="text-xs text-red-400 hover:underline mt-3"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                ))}
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}

export default Profile;