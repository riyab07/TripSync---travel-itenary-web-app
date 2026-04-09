import { useState } from "react";

function CreateTrip({ onAddTrip }) {
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [date, setDate] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !destination) return;

    const newTrip = {
      id: Date.now(),
      title,
      destination,
      budget,
      date,
      isPublic,
      liked: false,
    };

    onAddTrip(newTrip);

    setTitle("");
    setDestination("");
    setBudget("");
    setDate("");
    setIsPublic(true);
  };

  return (
    <form className="bg-white p-5 rounded-xl shadow mb-6" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-4">Create Trip</h2>

      <input
        className="w-full mb-3 p-2 border rounded"
        placeholder="Trip Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="w-full mb-3 p-2 border rounded"
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      <input
        className="w-full mb-3 p-2 border rounded"
        placeholder="Budget ₹"
        type="number"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      />

      <input
        className="w-full mb-3 p-2 border rounded"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <label className="flex items-center mb-3">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={() => setIsPublic(!isPublic)}
          className="mr-2"
        />
        Public Trip
      </label>

      <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
        Add Trip
      </button>
    </form>
  );
}

export default CreateTrip;