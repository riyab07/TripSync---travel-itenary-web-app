import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Saved() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedTrips")) || [];
    setTrips(saved);
  }, []);

  return (
    <div className="flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">

        <h1 className="text-3xl font-bold text-indigo-600 mb-6">
          Saved Trips 💾
        </h1>

        {trips.length === 0 ? (
          <p>No saved trips</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white p-5 rounded-xl shadow"
              >
                <h3 className="font-bold">{trip.title}</h3>
                <p>📍 {trip.destination}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Saved;