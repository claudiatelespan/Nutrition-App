import { useContext, useState, useEffect } from "react";
import { ApiContext } from "../context/ApiContext";
import toast from "react-hot-toast";
import RecipeCard from "../components/RecipeCard";

export default function FriendsPage() {
  const {
    friends,
    pendingRequests,
    sendFriendRequest,
    respondToFriendRequest,
    getFriendFavorites,
    recipes,
  } = useContext(ApiContext);

  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendFavorites, setFriendFavorites] = useState([]);
  const [accessDenied, setAccessDenied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");

  const handleSendRequest = async () => {
    if (!usernameInput.trim()) return;
    try {
      await sendFriendRequest(usernameInput.trim());
      toast.success("Friend request sent.");
      setUsernameInput("");
      setModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRespond = async (id, action) => {
    await respondToFriendRequest(id, action);
    toast.success(`Request ${action}ed.`);
  };

  const fetchFriendFavorites = async (friendUsername) => {
    try {
      const res = await getFriendFavorites(friendUsername);
      const fullRecipes = res
        .map((fav) => recipes.find((r) => r.id === fav.recipe))
        .filter(Boolean);
      setFriendFavorites(fullRecipes);
      setAccessDenied(false);
    } catch (err) {
      setFriendFavorites([]);
      setAccessDenied(true);
    }
  };

  useEffect(() => {
    if (selectedFriend) {
      fetchFriendFavorites(selectedFriend.username);
    }
  }, [selectedFriend]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Sidebar */}
      <div className="md:w-1/3 w-full space-y-6">
        <div className="bg-beige p-4 rounded-xl shadow flex justify-center">
          <button
            onClick={() => setModalOpen(true)}
            className="max-w-50 bg-mango hover:bg-orange-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-opacity-90 transition"
          >
            Add Friend
          </button>
        </div>

        {/* Pending Requests */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-vintage mb-2">Pending Requests</h3>
          {pendingRequests.length === 0 ? (
            <p className="text-sm text-gray-500">No requests</p>
          ) : (
            pendingRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between py-2 border-b"
              >
                <span className="text-gray-800 text-sm">{req.from_user_username}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleRespond(req.id, "accept")}
                    className="text-xs bg-green-400 text-white px-2 py-1 rounded hover:bg-green-600 cursor-pointer transform transition-transform duration-200 hover:scale-105"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRespond(req.id, "reject")}
                    className="text-xs bg-red-400 text-white px-2 py-1 rounded hover:bg-red-600 cursor-pointer transform transition-transform duration-200 hover:scale-105"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Friends List */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-vintage mb-2">Friends</h3>
          {friends.length === 0 ? (
            <p className="text-sm text-gray-500">No friends yet</p>
          ) : (
            friends.map((friend) => (
              <button
                key={friend.id}
                onClick={() => setSelectedFriend(friend)}
                className="block w-full text-left p-2 text-sm text-gray-800 hover:bg-hover-beige rounded"
              >
                {friend.username}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail panel */}
      <div className="flex-1 bg-white p-6 rounded-xl shadow">
        {selectedFriend ? (
          <>
            <h2 className="text-xl font-semibold text-vintage mb-4">
              Favoritele lui {selectedFriend.username}
            </h2>
            {accessDenied ? (
              <p className="text-gray-500">Acest utilizator nu partajează favoritele sale.</p>
            ) : friendFavorites.length === 0 ? (
              <p className="text-gray-500">Nu are favorite salvate.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {friendFavorites.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500">Select a friend to view favorites.</p>
        )}
      </div>

      {/* Add Friend Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold text-vintage mb-4">Add Friend</h3>
            <input
              type="text"
              placeholder="Username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full mb-4 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-mango"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setModalOpen(false); setUsernameInput(""); }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                className="px-4 py-2 bg-mango hover:bg-orange-500 cursor-pointer text-white rounded hover:bg-opacity-90"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
