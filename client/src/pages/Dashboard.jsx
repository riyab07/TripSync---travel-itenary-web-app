import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import CreateTrip from "../components/CreateTrip";

function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");

  // Load
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("trips")) || [];
    setTrips(saved);
  }, []);

  // Save
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

  const filteredTrips = trips.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-indigo-600 mb-6">
          Dashboard
        </h1>

        <CreateTrip onAddTrip={addTrip} />

        <input
          type="text"
          placeholder="Search trips..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 mb-6 border rounded"
        />

        {filteredTrips.length === 0 ? (
          <p className="text-gray-500">No trips found</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <div className="flex justify-between">
                  <h3 className="font-bold">{trip.title}</h3>

                  <button onClick={() => toggleLike(trip.id)}>
                    {trip.liked ? "❤️" : "🤍"}
                  </button>
                </div>

                <p>📍 {trip.destination}</p>
                <p>💰 ₹{trip.budget}</p>
                <p>📅 {trip.date}</p>

                <p className="text-sm mt-1">
                  {trip.isPublic ? "🌍 Public" : "🔒 Private"}
                </p>

                <button
                  onClick={() => deleteTrip(trip.id)}
                  className="text-red-500 mt-2 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;