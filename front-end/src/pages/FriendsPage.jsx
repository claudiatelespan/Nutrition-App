import { useContext, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ApiContext } from "../context/ApiContext";
import toast from "react-hot-toast";
import RecipeCard from "../components/RecipeCard";
import { UserMinusIcon } from "@heroicons/react/24/outline";

export default function FriendsPage() {
  const {
    friends,
    pendingRequests,
    sendFriendRequest,
    respondToFriendRequest,
    getFriendFavorites,
    removeFriend,
    recipes,
  } = useContext(ApiContext);

  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendFavorites, setFriendFavorites] = useState([]);
  const [accessDenied, setAccessDenied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [unfriendUser, setUnfriendUser] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

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

  const handleUnfriend = async () => {
    try {
      await removeFriend(unfriendUser.username);
      toast.success(`You are no longer friends with ${unfriendUser.username}.`);
      if (selectedFriend?.username === unfriendUser.username) {
        setSelectedFriend(null);
        setFriendFavorites([]);
      }
      setUnfriendUser(null);
    } catch (err) {
      toast.error("Failed to remove friend.");
    }
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
    const userParam = searchParams.get("user");
    if (!userParam || friends.length === 0) return;

    const friend = friends.find((f) => f.username === userParam);
    if (!friend) return;

    setSelectedFriend(friend);
    fetchFriendFavorites(friend.username);
  }, [friends, searchParams]);


  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 mt-20">
      {/* Sidebar */}
      <div className="md:w-1/4 w-full space-y-6">
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
        <div className="bg-beige p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-vintage mb-2">Friends</h3>
          {friends.length === 0 ? (
            <p className="text-sm text-gray-500">No friends yet</p>
          ) : (
            friends.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between bg-white border border-gray-300 hover:bg-almostwhite mb-2 rounded">
                <button
                  onClick={() => {
                    setSelectedFriend(friend);
                    setSearchParams({ user: friend.username });
                  }}
                  className={`text-left text-sm flex-1 rounded transition text-gray-800 p-2
                    ${selectedFriend?.id === friend.id ? "font-semibold text-mango" : ""}`}
                >
                  {friend.username}
                </button>
                <button onClick={() => setUnfriendUser(friend)}>
                  <UserMinusIcon className="h-5 w-5 mr-2 text-mango hover:text-orange-500 cursor-pointer transform transition-transform duration-200 hover:scale-105 " />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail panel */}
      <div className="flex-1 bg-beige p-6 rounded-xl shadow">
        {selectedFriend ? (
          <>
            <h2 className="text-xl font-semibold text-vintage mb-4">
              {selectedFriend.username}'s favorite recipes
            </h2>
            {accessDenied ? (
              <p className="text-gray-500">This user does not share his favorite recipes.</p>
            ) : friendFavorites.length === 0 ? (
              <p className="text-gray-500">No favorite recipes yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto pr-2">
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

      {/* Unfriend Confirm Modal */}
      {unfriendUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold text-vintage mb-4">
              Are you sure you want to remove <span className="text-mango">{unfriendUser.username}</span> from your friends?
            </h3>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setUnfriendUser(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUnfriend}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
              >
                Unfriend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
