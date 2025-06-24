import React, { useEffect, useRef } from 'react';
import assets, { messagesDummyData } from '../assets/assets';
import { formatMessageTime } from '../lib/utils';

const ChatContainer = ({ selectedUser, setselectedUser }) => {
  const scrollEnd = useRef();

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagesDummyData]); // Scrolls to bottom on message change

  return selectedUser ? (
    <div className="h-full overflow-hidden relative backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 py-3 px-4 border-b border-stone-500">
        <div className="flex items-center gap-3">
          <img src={assets.profile_martin} alt="profile" className="w-8 rounded-full" />
          <p className="text-lg text-white flex items-center gap-2">
            {selectedUser.fullName || 'Martin Johnson'}
            <span className="w-2 h-2 bg-green-500 rounded-full ml-1"></span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <img
            onClick={() => setselectedUser(null)}
            src={assets.arrow_icon}
            alt="Back"
            className="md:hidden w-6 cursor-pointer"
          />
          <img src={assets.help_icon} alt="Help" className="max-md:hidden w-5" />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messagesDummyData.map((msg, index) => {
          const isCurrentUser = msg.senderId === '680f50e4f10f3cd28382ecf9';
          return (
            <div
              key={index}
              className={`flex items-end gap-2 mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              {msg.image ? (
                <img
                  src={msg.image}
                  alt="chat"
                  className="max-w-[230px] border border-gray-700 rounded-lg"
                />
              ) : (
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-words text-white ${
                    isCurrentUser
                      ? 'bg-violet-500/30 rounded-bl-none'
                      : 'bg-gray-700/40 rounded-br-none'
                  }`}
                >
                  {msg.text}
                </p>
              )}
              <div className="text-center text-xs">
                <img
                  src={isCurrentUser ? assets.avatar_icon : assets.profile_martin}
                  alt="avatar"
                  className="w-7 rounded-full mb-1"
                />
                <p className="text-gray-500">{formatMessageTime(msg.createdAt)}</p>
              </div>
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/* Bottom Input Area */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/10 px-3 rounded-full">
          <input
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white bg-transparent placeholder-gray-400"
          />
          <input type="file" id="image" accept="image/png, image/jpeg" hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="Gallery" className="w-5 mr-2 cursor-pointer" />
          </label>
        </div>
        <img src={assets.send_button} alt="Send" className="w-7 cursor-pointer" />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden h-full">
      <img src={assets.logo_icon} className="max-w-16" alt="Logo" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
