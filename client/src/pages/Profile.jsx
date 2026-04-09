import Sidebar from "../components/Sidebar";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const posts = JSON.parse(localStorage.getItem("posts")) || [];

  const userPosts = posts.filter((p) => p.user === user?.name);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">
          Profile 👤
        </h1>

        <h2 className="text-lg mb-6">Hi, {user?.name}</h2>

        <h3 className="font-semibold mb-3">Your Posts</h3>

        {userPosts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded shadow mb-3">
            <img src={post.image} className="h-40 w-full object-cover mb-2" />
            <p>{post.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;