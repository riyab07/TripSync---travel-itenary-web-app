import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";

function Explore() {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("trips")) || [];
    setTrips(all.filter((t) => t.isPublic));
  }, []);

  const cloneTrip = (trip) => {
    const existing = JSON.parse(localStorage.getItem("trips")) || [];

    const cloned = {
      ...trip,
      id: Date.now(),
      title: trip.title + " (Clone)",
    };

    localStorage.setItem("trips", JSON.stringify([cloned, ...existing]));
    alert("Cloned 🚀");
  };

  const filtered = trips.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6">
          Explore Trips 🌍
        </h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search destinations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-6 p-3 border rounded-xl"
        />

        {/* Cards */}
        {filtered.length === 0 ? (
          <p>No trips found</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-xl shadow hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                {/* Image */}
                <img
                  src={`https://source.unsplash.com/400x300/?${trip.destination}`}
                  alt="trip"
                  className="w-full h-40 object-cover"
                />

                <div className="p-4">
                  <h3 className="font-bold text-lg">{trip.title}</h3>
                  <p className="text-gray-600">📍 {trip.destination}</p>

                  <button
                    onClick={() => cloneTrip(trip)}
                    className="mt-3 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                  >
                    Clone Trip
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Explore;