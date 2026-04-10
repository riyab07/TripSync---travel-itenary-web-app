import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: "🗺️",
    title: "Plan Itineraries",
    desc: "Build day-by-day trip plans with destinations, budgets and dates.",
  },
  {
    icon: "⎇",
    title: "Clone Trips",
    desc: "Found a trip you love? Clone it instantly and make it your own.",
  },
  {
    icon: "📸",
    title: "Share Moments",
    desc: "Post travel photos and inspire others with your adventures.",
  },
  {
    icon: "🌍",
    title: "Discover Places",
    desc: "Explore public trips from travelers around the world.",
  },
];

const STATS = [
  { value: "10K+", label: "Trips Planned" },
  { value: "5K+", label: "Travelers" },
  { value: "50+", label: "Destinations" },
];

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white overflow-hidden">

      {/* Blobs */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="relative flex justify-between items-center px-8 py-5 max-w-6xl mx-auto">
        <div className="text-xl font-bold">TripSync ✈️</div>
        <Link to="/login">
          <button className="text-sm bg-white/10 border border-white/20 px-4 py-2 rounded-xl hover:bg-white/20 transition">
            Sign In
          </button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative text-center px-6 pt-16 pb-20 max-w-4xl mx-auto">
        <div className="inline-block bg-white/10 border border-white/20 text-xs px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
          🚀 GitHub meets Instagram — for travelers
        </div>

        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Plan trips.
          <br />
          <span className="text-yellow-300">Share adventures.</span>
          <br />
          Inspire the world.
        </h1>

        <p className="text-white/70 text-lg max-w-xl mx-auto mb-10">
          Build beautiful itineraries, clone trips from fellow travelers,
          and share your journey with a community that loves to explore.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <button className="bg-white text-indigo-600 px-8 py-3.5 rounded-xl font-semibold hover:scale-105 hover:shadow-xl transition text-sm">
              Get Started — it's free →
            </button>
          </Link>
          <Link to="/explore">
            <button className="border border-white/30 bg-white/10 backdrop-blur-sm px-8 py-3.5 rounded-xl font-medium hover:bg-white/20 transition text-sm">
              Browse Trips 🌍
            </button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="relative max-w-3xl mx-auto px-6 mb-20">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 grid grid-cols-3 gap-4 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-yellow-300">{s.value}</p>
              <p className="text-xs text-white/60 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-center text-2xl font-bold mb-10">
          Everything you need to travel smarter
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 hover:bg-white/20 transition"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-white/60 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative text-center pb-16 px-6">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">Ready to start exploring?</h2>
          <p className="text-white/60 text-sm mb-6">
            Join thousands of travelers planning smarter with TripSync.
          </p>
          <Link to="/login">
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:scale-105 transition text-sm">
              Create your first trip →
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Home;