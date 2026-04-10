import { useState, useEffect } from "react";
import CreateTrip from "../components/CreateTrip";
import api from "../api";

function Trips() {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data } = await api.get("/trips/my");
        setTrips(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const addTrip = async (trip) => {
    try {
      const { data } = await api.post("/trips", trip);
      setTrips([data, ...trips]);
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTrip = async (id) => {
    try {
      await api.delete(`/trips/${id}`);
      setTrips(trips.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLike = async (id) => {
    try {
      await api.put(`/trips/${id}/like`);
      setTrips(trips.map((t) =>
        t._id === id ? { ...t, liked: !t.liked } : t
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const saveTrip = async (id) => {
    try {
      await api.put(`/trips/${id}/save`);
      alert("Saved 💾");
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTrips = trips.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Trips 🗺️</h1>
          <p className="text-sm text-gray-500 mt-1">Plan, manage and share your travel itineraries</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
        >
          {showForm ? "✕ Cancel" : "+ New Trip"}
        </button>
      </div>

      {/* Create Trip Form */}
      {showForm && (
        <div className="mb-6 bg-white rounded-2xl shadow p-5">
          <CreateTrip onAddTrip={addTrip} />
        </div>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search your trips..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-6 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-indigo-600">{trips.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Trips</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-500">
            {trips.filter((t) => t.isPublic).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Public</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-pink-500">
            {trips.filter((t) => t.liked).length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Liked</p>
        </div>
      </div>

      {/* Trip Cards */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading trips...</div>
      ) : filteredTrips.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🧳</p>
          <p>No trips yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filteredTrips.map((trip) => (
            <div
              key={trip._id}
              className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">{trip.title}</h3>
                <button onClick={() => toggleLike(trip._id)} className="text-lg">
                  {trip.liked ? "❤️" : "🤍"}
                </button>
              </div>
              <p className="text-sm text-gray-500">📍 {trip.destination}</p>
              <p className="text-sm text-gray-500">💰 ₹{trip.budget}</p>
              <p className="text-sm text-gray-500">📅 {trip.date}</p>
              <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full font-medium ${
                trip.isPublic ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
              }`}>
                {trip.isPublic ? "🌍 Public" : "🔒 Private"}
              </span>
              <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => saveTrip(trip._id)}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  💾 Save
                </button>
                <button
                  onClick={() => deleteTrip(trip._id)}
                  className="text-xs text-red-400 hover:underline"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Trips;