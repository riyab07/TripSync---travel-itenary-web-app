import { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const TABS = ["Trips", "Posts"];

const DESTINATION_IMAGES = {
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
  tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop",
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop",
  dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop",
  default: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
};

function getImage(destination = "") {
  const key = (destination || "").toLowerCase().trim();
  return DESTINATION_IMAGES[key] || DESTINATION_IMAGES.default;
}

function Explore() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Trips");
  const [trips, setTrips] = useState([]);
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [clonedIds, setClonedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripsRes, postsRes] = await Promise.all([
          api.get("/trips/explore"),
          api.get("/posts"),
        ]);
        setTrips(tripsRes.data || []);
        setPosts(postsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cloneTrip = async (trip) => {
    try {
      await api.post(`/trips/${trip._id}/clone`);
      setClonedIds((prev) => [...prev, trip._id]);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLikePost = async (postId) => {
    try {
      const { data } = await api.put(`/posts/${postId}/like`);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, likes: Array(data.likes).fill(0), liked: data.liked }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ SAFE FILTERS (NO BUILD CRASH)
  const filteredTrips = trips.filter((t) => {
    const title = t.title?.toLowerCase() || "";
    const dest = t.destination?.toLowerCase() || "";
    const q = search.toLowerCase();
    return title.includes(q) || dest.includes(q);
  });

  const filteredPosts = posts.filter((p) => {
    const caption = p.caption?.toLowerCase() || "";
    const location = p.location?.toLowerCase() || "";
    const q = search.toLowerCase();
    return caption.includes(q) || location.includes(q);
  });

  return (
    <div className="px-3 sm:px-0">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Explore 🌍
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Discover trips and travel posts from the community
        </p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search destinations, trips, posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm"
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              activeTab === tab
                ? "bg-indigo-600 text-white shadow"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {tab === "Trips" ? "🗺️ Trips" : "📸 Posts"}
          </button>
        ))}
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 animate-pulse h-52 rounded-2xl"
            />
          ))}
        </div>
      ) : (
        <>
          {/* TRIPS */}
          {activeTab === "Trips" && (
            filteredTrips.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-4xl mb-3">🌍</p>
                <p>No trips yet… be the first explorer ✨</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {filteredTrips.map((trip) => (
                  <div
                    key={trip._id}
                    onClick={() => navigate(`/trips/${trip._id}`)}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden border border-gray-100 cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={getImage(trip.destination)}
                        alt={trip.destination}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <h3 className="absolute bottom-2 left-3 text-white font-semibold text-sm">
                        {trip.title || "Untitled Trip"}
                      </h3>
                    </div>

                    <div className="p-3 sm:p-4">
                      <p className="text-sm text-gray-500">
                        📍 {trip.destination || "Unknown"}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        by{" "}
                        <span
                          className="cursor-pointer hover:text-indigo-600 hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/user/${trip.author?.name}`);
                          }}
                        >
                          {trip.author?.name || "traveler"}
                        </span>{" "}
                        · ⎇ {trip.cloneCount || 0}
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cloneTrip(trip);
                        }}
                        disabled={clonedIds.includes(trip._id)}
                        className={`mt-3 w-full py-1.5 rounded-xl text-sm font-medium transition ${
                          clonedIds.includes(trip._id)
                            ? "bg-green-100 text-green-600"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        {clonedIds.includes(trip._id)
                          ? "✅ Cloned"
                          : "⎇ Clone Trip"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* POSTS */}
          {activeTab === "Posts" && (
            filteredPosts.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-4xl mb-3">📸</p>
                <p>No posts yet. Share your travel moments ✨</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {filteredPosts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden border border-gray-100"
                  >
                    {post.image && (
                      <img
                        src={post.image}
                        alt="post"
                        className="w-full h-48 object-cover"
                      />
                    )}

                    <div className="p-3 sm:p-4">
                      <p className="text-xs text-indigo-500 mb-1 font-medium">
                        <span
                          className="cursor-pointer hover:underline"
                          onClick={() =>
                            navigate(`/user/${post.author?.name}`)
                          }
                        >
                          👤 {post.author?.name || "traveler"}
                        </span>
                        {post.location ? ` · 📍 ${post.location}` : ""}
                      </p>

                      <p className="text-sm text-gray-700">
                        {post.caption || ""}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleLikePost(post._id)}
                            className="text-lg hover:scale-110 transition"
                          >
                            {post.liked ? "❤️" : "🤍"}
                          </button>
                          <span className="text-xs text-gray-400">
                            {post.likes?.length || 0}
                          </span>
                        </div>
                        <span className="text-xs text-gray-300">•••</span>
                      </div>
                    </div>
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

export default Explore;