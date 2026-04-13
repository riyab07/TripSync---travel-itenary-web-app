import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const DESTINATION_IMAGES = {
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
  tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop",
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop",
  dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop",
  default: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
};

function getImage(destination = "") {
  return DESTINATION_IMAGES[destination.toLowerCase().trim()] || DESTINATION_IMAGES.default;
}

function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [activeTab, setActiveTab] = useState("Trips");

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: res } = await api.get(`/users/${username}`);
        setData(res);
        setFollowerCount(res.user.followers?.length || 0);
        setFollowing(
          res.user.followers?.some((f) => f._id === currentUserId)
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [username]);

  const toggleFollow = async () => {
    try {
      const { data: res } = await api.put(`/users/${data.user._id}/follow`);
      setFollowing(res.following);
      setFollowerCount(res.followers);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return <div className="text-center py-16 text-gray-400">Loading profile...</div>;
  if (!data)
    return <div className="text-center py-16 text-gray-400">User not found</div>;

  const { user, trips, posts } = data;
  const isOwnProfile = user._id === currentUserId;

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-indigo-600 mb-4 flex items-center gap-1"
      >
        ← Back
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {followerCount} followers · {user.following?.length || 0} following
              </p>
              <p className="text-sm text-gray-500">
                {trips.length} trips · {posts.length} posts
              </p>
            </div>
          </div>

          {!isOwnProfile && (
            <button
              onClick={toggleFollow}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
                following
                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {following ? "✓ Following" : "+ Follow"}
            </button>
          )}

          {isOwnProfile && (
            <button
              onClick={() => navigate("/profile")}
              className="px-5 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {["Trips", "Posts"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              activeTab === tab
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {tab === "Trips" ? "🗺️ Trips" : "📸 Posts"}
          </button>
        ))}
      </div>

      {/* Trips Tab */}
      {activeTab === "Trips" && (
        trips.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🗺️</p>
            <p>No public trips yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {trips.map((trip) => (
              <div
                key={trip._id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <img
                  src={trip.coverImage || getImage(trip.destination)}
                  alt={trip.destination}
                  className="w-full h-36 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{trip.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">📍 {trip.destination}</p>
                  <p className="text-xs text-gray-400 mt-1">⎇ {trip.cloneCount || 0} clones</p>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Posts Tab */}
      {activeTab === "Posts" && (
        posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📸</p>
            <p>No posts yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
              >
                {post.image && (
                  <img src={post.image} alt="post" className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  {post.location && (
                    <p className="text-xs text-indigo-500 mb-1">📍 {post.location}</p>
                  )}
                  <p className="text-sm text-gray-700">{post.caption}</p>
                  <p className="text-xs text-gray-400 mt-2">❤️ {post.likes?.length || 0} likes</p>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default PublicProfile;