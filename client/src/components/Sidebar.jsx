import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-60 h-screen bg-white shadow p-4">
      <h2 className="text-xl font-bold text-indigo-600 mb-6">
        TripSync ✈️
      </h2>

      <div className="flex flex-col gap-4">
        <Link to="/dashboard">🏠 My Trips</Link>
        <Link to="/saved">💾 Saved Trips</Link>
        <Link to="/explore">🌍 Explore</Link>
      </div>
    </div>
  );
}

export default Sidebar;