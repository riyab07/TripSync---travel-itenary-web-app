import { useState } from "react";

function CreatePost({ onAddPost }) {
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [preview, setPreview] = useState("");

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!caption) return;

    const newPost = {
      id: Date.now(),
      image,
      caption,
      location,
      likes: 0,
      liked: false,
      comments: [],
    };

    onAddPost(newPost);
    setImage("");
    setCaption("");
    setLocation("");
    setPreview("");
  };

  const inputClass =
    "w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-3";

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-base font-semibold text-gray-700 mb-4">📸 New Post</h2>

      {/* Image Upload */}
      <div className="mb-3">
        <label className="block text-xs text-gray-500 mb-1">Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
        />
      </div>

      {/* Preview */}
      {preview && (
        <div className="mb-3 relative">
          <img
            src={preview}
            alt="preview"
            className="w-full h-48 object-cover rounded-xl"
          />
          <button
            type="button"
            onClick={() => { setPreview(""); setImage(""); }}
            className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg"
          >
            ✕ Remove
          </button>
        </div>
      )}

      <input
        type="text"
        placeholder="Write a caption... *"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className={inputClass}
      />

      <input
        type="text"
        placeholder="📍 Location (optional)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className={inputClass}
      />

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
      >
        Share Post 🚀
      </button>
    </form>
  );
}

export default CreatePost;