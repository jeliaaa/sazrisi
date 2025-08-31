import { Link, useLocation } from "react-router-dom";
import LeaderboardIcon from "../icons/leaderboard.svg?react";
import TestsIcon from "../icons/tests.svg?react";
import SettingsIcon from "../icons/settings.svg?react";
import LeaveIcon from "../icons/leave.svg?react";
import VideoLessons from "../icons/video-lessons.svg?react";
import logo from "../assets/logo.png";
import { useAuthStore } from "../stores/authStore";

const Navigation = () => {
  const { pathname } = useLocation();
  const { logout, user } = useAuthStore();

  const navigationList = [
    { to: "/quizs", name: "ტესტები", Icon: TestsIcon },
    { to: "/leaderboard", name: "ლიდერბორდი", Icon: LeaderboardIcon },
    { to: "/settings", name: "პარამეტრები", Icon: SettingsIcon },
    { to: "/videoLessons", name: "ვიდეო გაკვეთილები", Icon: VideoLessons },
  ];

  const isActive = (to: string) => pathname.startsWith(to);
  const handleLogOut = () => {
    logout();
  }

  return (
    <>
      {/* Sidebar for desktop */}
      <div className="top-0 left-0 h-screen w-[5dvw] bg-gray-900 text-white z-50 flex-col items-center py-4 gap-6 hidden md:fixed md:flex">
        <Link to="/">
          <img src={logo} className="w-8" alt="Logo" />
        </Link>

        <hr className="w-[80%] border-2 border-gray-600 my-4" />

        {navigationList.map(({ Icon, name, to }) => (
          <Link key={to} to={to} className="relative group w-fit z-50">
            <Icon
              className={`w-8 h-8 trans1ition-colors duration-200 ${isActive(to) ? "fill-main-color" : "fill-texts-color"
                }`}
            />
            <span className="hidden absolute left-12 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded z-50 group-hover:block ">
              {name}
            </span>
          </Link>
        ))}

        <div className="flex flex-col gap-y-5 absolute bottom-5 items-center">
          <Link to="/profile">
            <img
              src={import.meta.env.VITE_BACKEND_APP_URL + user?.avatar?.url}
              className="w-10 h-10 rounded-full border-2 border-main-color"
              alt="Profile"
            />
          </Link>
          <button onClick={() => handleLogOut()} className="group">
            <LeaveIcon className="w-8 h-8 fill-texts-color" />
            <span className="absolute left-12 bottom-0 transform -translate-y-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              გამოსვლა
            </span>
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white flex justify-around py-4 md:hidden z-50">
        {navigationList.map(({ Icon, name, to }) => (
          <Link key={to} to={to} className="relative group">
            <Icon
              className={`w-8 h-8 ${isActive(to) ? "fill-main-color" : "fill-texts-color"
                }`}
            />
            <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-1 bg-gray-700 text-white text-xs  px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {name}
            </span>
          </Link>
        ))}
        <Link to="/profile">
          <img
            src={import.meta.env.VITE_BACKEND_APP_URL + user?.avatar?.url}
            className="w-8 h-8 rounded-full border-2 border-main-color"
            alt="Profile"
          />
        </Link>
      </div>
    </>
  );
};

export default Navigation;
