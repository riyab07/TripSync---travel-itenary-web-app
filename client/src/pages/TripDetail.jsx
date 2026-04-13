import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const DAYS = [1, 2, 3, 4, 5, 6, 7];

const DESTINATION_IMAGES = {
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=400&fit=crop",
  tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=400&fit=crop",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=400&fit=crop",
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=400&fit=crop",
  dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=400&fit=crop",
  default: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop",
};

function getImage(destination = "") {
  const key = destination.toLowerCase().trim();
  return DESTINATION_IMAGES[key] || DESTINATION_IMAGES.default;
}

function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(1);
  const [form, setForm] = useState({ activity: "", time: "", notes: "" });
  const [adding, setAdding] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const { data } = await api.get(`/trips/${id}`);
        setTrip(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  const isOwner = trip?.author?._id === userId;

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const { data } = await api.post(`/trips/${id}/cover`, { image: reader.result });
        setTrip({ ...trip, coverImage: data.coverImage });
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const addActivity = async () => {
    if (!form.activity.trim()) return;
    setAdding(true);
    try {
      const { data } = await api.post(`/trips/${id}/itinerary`, {
        day: activeDay,
        activity: form.activity,
        time: form.time,
        notes: form.notes,
      });
      setTrip(data);
      setForm({ activity: "", time: "", notes: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const deleteActivity = async (itemId) => {
    try {
      const { data } = await api.delete(`/trips/${id}/itinerary/${itemId}`);
      setTrip(data);
    } catch (err) {
      console.error(err);
    }
  };

  const dayItems = trip?.itinerary?.filter((i) => i.day === activeDay) || [];

  if (loading)
    return <div className="text-center py-16 text-gray-400">Loading trip...</div>;
  if (!trip)
    return <div className="text-center py-16 text-gray-400">Trip not found</div>;

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => navigate("/trips")}
        className="text-sm text-gray-500 hover:text-indigo-600 mb-4 flex items-center gap-1"
      >
        ← Back to My Trips
      </button>

      {/* Cover Image */}
      <div className="relative w-full h-52 rounded-2xl overflow-hidden mb-6">
        <img
          src={trip.coverImage || getImage(trip.destination)}
          alt={trip.destination}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-5 text-white">
          <h1 className="text-2xl font-bold">{trip.title}</h1>
          <p className="text-sm text-white/80">📍 {trip.destination}</p>
        </div>
        <span className={`absolute top-4 right-4 text-xs px-3 py-1 rounded-full font-medium ${
          trip.isPublic ? "bg-green-400/80 text-white" : "bg-gray-400/80 text-white"
        }`}>
          {trip.isPublic ? "🌍 Public" : "🔒 Private"}
        </span>

        {/* Cover upload button — owner only */}
        {isOwner && (
          <label className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-1.5 rounded-xl cursor-pointer hover:bg-black/70 transition">
            {uploading ? "Uploading..." : "📷 Change Cover"}
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Trip Info */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <div className="flex gap-6 text-sm text-gray-500 flex-wrap">
          <span>💰 ₹{trip.budget}</span>
          <span>📅 {trip.date}</span>
          <span>✈️ by {trip.author?.name}</span>
          <span>⎇ {trip.cloneCount || 0} clones</span>
          <span>❤️ {trip.likes?.length || 0} likes</span>
        </div>
      </div>

      {/* Itinerary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">📋 Itinerary</h2>

        {/* Day Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {DAYS.map((d) => {
            const hasItems = trip.itinerary?.some((i) => i.day === d);
            return (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className={`relative px-3 py-1.5 rounded-xl text-sm font-medium transition ${
                  activeDay === d
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                Day {d}
                {hasItems && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Activities */}
        <div className="mb-6">
          {dayItems.length === 0 ? (
            <p className="text-gray-400 text-sm py-6 text-center">
              No activities for Day {activeDay} yet.
              {isOwner && " Add one below!"}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {dayItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-start justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-100"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{item.activity}</p>
                    {item.time && (
                      <p className="text-xs text-indigo-500 mt-0.5">🕐 {item.time}</p>
                    )}
                    {item.notes && (
                      <p className="text-xs text-gray-500 mt-0.5">📝 {item.notes}</p>
                    )}
                  </div>
                  {isOwner && (
                    <button
                      onClick={() => deleteActivity(item._id)}
                      className="text-xs text-red-400 hover:underline ml-4 shrink-0"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Activity — owner only */}
        {isOwner && (
          <div className="border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              + Add activity for Day {activeDay}
            </h3>
            <div className="grid md:grid-cols-3 gap-3 mb-3">
              <input
                type="text"
                placeholder="Activity *"
                value={form.activity}
                onChange={(e) => setForm({ ...form, activity: e.target.value })}
                className="p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <input
                type="text"
                placeholder="Notes (optional)"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
            <button
              onClick={addActivity}
              disabled={adding}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {adding ? "Adding..." : "Add Activity 🚀"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TripDetail;