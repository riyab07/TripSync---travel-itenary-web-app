import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const links = [
    { to: "/trips", label: "My Trips", icon: "🗺️" },
    { to: "/explore", label: "Explore", icon: "🌍" },
    { to: "/feed", label: "Feed", icon: "📸" },
    { to: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="w-60 min-h-screen bg-white shadow-md flex flex-col justify-between p-5 sticky top-0">
      <div>
        <h2 className="text-xl font-bold text-indigo-600 mb-8">TripSync ✈️</h2>
        <div className="flex flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                ${location.pathname === link.to
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <p className="mb-2 px-1 font-medium text-gray-700">
          👋 {user || "Traveler"}
        </p>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 transition-all"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;