import { useState, useEffect } from "react";
import CreateTrip from "../components/CreateTrip";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");

  // Load trips
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("trips")) || [];
    setTrips(saved);
  }, []);

  // Save trips
  useEffect(() => {
    localStorage.setItem("trips", JSON.stringify(trips));
  }, [trips]);

  const addTrip = (trip) => {
    setTrips([trip, ...trips]);
  };

  const deleteTrip = (id) => {
    setTrips(trips.filter((t) => t.id !== id));
  };

  const toggleLike = (id) => {
    setTrips(
      trips.map((t) =>
        t.id === id ? { ...t, liked: !t.liked } : t
      )
    );
  };

  const saveTrip = (trip) => {
    const saved = JSON.parse(localStorage.getItem("savedTrips")) || [];
    localStorage.setItem("savedTrips", JSON.stringify([trip, ...saved]));
    alert("Saved 💾");
  };

  const filteredTrips = trips.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">

        <h1 className="text-3xl font-bold text-indigo-600 mb-6">
          My Trips ✈️
        </h1>

        {/* Create Trip */}
        <CreateTrip onAddTrip={addTrip} />

        {/* Search */}
        <input
          type="text"
          placeholder="Search trips..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 mb-6 border rounded-xl"
        />

        {/* Trips */}
        {filteredTrips.length === 0 ? (
          <p>No trips found</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="flex justify-between">
                  <h3 className="font-bold">{trip.title}</h3>

                  <button onClick={() => toggleLike(trip.id)}>
                    {trip.liked ? "❤️" : "🤍"}
                  </button>
                </div>

                <p className="text-gray-600 mt-2">📍 {trip.destination}</p>
                <p>💰 ₹{trip.budget}</p>
                <p>📅 {trip.date}</p>

                <p className="text-sm mt-1">
                  {trip.isPublic ? "🌍 Public" : "🔒 Private"}
                </p>

                {/* Actions */}
                <div className="flex gap-4 mt-3">
                  <button
                    onClick={() => deleteTrip(trip.id)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => saveTrip(trip)}
                    className="text-blue-600 text-sm"
                  >
                    Save 💾
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;