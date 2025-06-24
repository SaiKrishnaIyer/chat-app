import React, { useState, useEffect, useContext } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    currentUser, // Make sure this is available in your ChatContext
  } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  // Fetch all users on component mount and when onlineUsers change
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await getUsers();
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [onlineUsers, getUsers]);

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName?.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? 'max-md:hidden' : ''
      }`}
    >
      <div className="pb-5">
        {/* Header */}
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />
          <div className="relative">
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="max-h-5 cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100">
                <p
                  onClick={() => {
                    navigate('/profile');
                    setShowMenu(false);
                  }}
                  className="cursor-pointer text-sm"
                >
                  Edit Profile
                </p>
                <hr className="my-2 border-t border-gray-500" />
                <p
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                  }}
                  className="cursor-pointer text-sm"
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            value={input}
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User..."
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex flex-col">
        {filteredUsers.length > 0 ? (
          filteredUsers
            .filter(user => user._id !== currentUser?._id) // Exclude current user from the list
            .map((user, index) => (
              <div
                onClick={() => setSelectedUser(user)}
                key={user._id || index}
                className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
                  selectedUser?._id === user._id ? 'bg-[#282142]/50' : ''
                }`}
              >
                <img
                  src={user?.profilePic || assets.avatar_icon}
                  alt="avatar"
                  className="w-[35px] aspect-[1/1] rounded-full object-cover"
                />
                <div className="flex flex-col leading-5">
                  <p>{user?.fullName}</p>
                  <span
                    className={`text-xs ${
                      onlineUsers.includes(user._id)
                        ? 'text-green-400'
                        : 'text-neutral-400'
                    }`}
                  >
                    {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                  </span>
                </div>

                {unseenMessages[user._id] > 0 && (
                  <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                    {unseenMessages[user._id]}
                  </p>
                )}
              </div>
            ))
        ) : (
          <p className="text-center text-sm text-gray-400 mt-10">No users found</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;