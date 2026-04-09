import { useState } from "react";

function CreatePost() {
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) reader.readAsDataURL(file);
  };

  const handlePost = (e) => {
    e.preventDefault();

    if (!image || !caption) return;

    const user = JSON.parse(localStorage.getItem("user"));

    const newPost = {
      id: Date.now(),
      image,
      caption,
      location,
      user: user?.name || "Anonymous",
      likes: 0,
      comments: [],
    };

    const existing = JSON.parse(localStorage.getItem("posts")) || [];
    localStorage.setItem("posts", JSON.stringify([newPost, ...existing]));

    setImage("");
    setCaption("");
    setLocation("");
  };

  return (
    <form className="bg-white p-5 rounded-xl shadow mb-6" onSubmit={handlePost}>
      <h2 className="font-semibold mb-3">Create Post 📸</h2>

      <input type="file" onChange={handleImage} className="mb-3" />

      <input
        type="text"
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="text"
        placeholder="Location 📍"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <button className="bg-indigo-600 text-white px-4 py-2 rounded">
        Post
      </button>
    </form>
  );
}

export default CreatePost;