import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-indigo-600">
        TripSync ✈️
      </h1>

      <div className="flex gap-6 items-center">
        <Link to="/dashboard" className="hover:text-indigo-600">
          Dashboard
        </Link>

        <Link to="/explore" className="hover:text-indigo-600">
          Explore
        </Link>

        {user && (
          <>
            <span className="text-gray-600">Hi, {user.name}</span>

            <button
              onClick={logout}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;