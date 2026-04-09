import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex flex-col items-center justify-center text-center px-6">

      <h1 className="text-5xl font-bold mb-6">
        TripSync ✈️
      </h1>

      <p className="text-lg max-w-xl mb-8">
        Plan, share and clone travel itineraries like never before.
        Build your dream trips and explore others' journeys.
      </p>

      <div className="flex gap-4">
        <Link to="/login">
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition">
            Get Started
          </button>
        </Link>

        <Link to="/explore">
          <button className="border border-white px-6 py-3 rounded-xl hover:scale-105 transition">
            Explore Trips
          </button>
        </Link>
      </div>

    </div>
  );
}

export default Home;