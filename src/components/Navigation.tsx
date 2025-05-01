import { Link } from 'react-router-dom';
import LeaderboardIcon from '../icons/leaderboard.svg?react';
import TestsIcon from '../icons/tests.svg?react';
import SettingsIcon from '../icons/settings.svg?react';
import LeaveIcon from '../icons/leave.svg?react';
import logo from "../assets/logo.png"


const Navigation = () => {

    const navigationList = [
        { to: "tests", name: "ტესტები", Icon: TestsIcon },
        { to: "leaderboard", name: "ლიდერბორდი", Icon: LeaderboardIcon },
        { to: "settings", name: "პარამეტრები", Icon: SettingsIcon },
    ]

    return (
        <>
            {/* Sidebar for larger screens */}
            <div className='fixed top-0 left-0 h-full w-16 bg-gray-900 text-white flex-col items-center py-4 gap-6 hidden md:flex'>
                <Link to={'/'}>
                    <img src={logo} className='w-8' alt='...' />
                </Link>
                <hr className='w-[80%] border-2' />
                {navigationList.map(({ Icon, name, to }) => (
                    <Link to={to} className='relative group'>
                        <Icon className="w-8 h-8 fill-texts-color" />
                        <span className='absolute left-12 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity'>{name}</span>
                    </Link>
                ))}
                <div className='flex flex-col gap-y-5 absolute bottom-5 items-center'>
                    <Link to={'profile'}>
                        <img src='https://picsum.photos/100' className="w-10 h-10 fill-red-500" />
                    </Link>
                    <Link to='/' className='group'>
                        <LeaveIcon className="w-8 h-8 fill-texts-color" />
                        <span className='absolute left-12 bottom-0 transform -translate-y-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity'>გამოსვლა</span>
                    </Link>
                </div>
            </div>

            {/* Bottom nav for smaller screens */}
            <div className='fixed bottom-0 left-0 w-full bg-gray-900 text-white flex justify-around py-4 md:hidden'>
                {navigationList.map(({ Icon, name, to }) => (
                    <Link to={to} className='relative group'>
                        <Icon className="w-8 h-8 fill-texts-color" />
                        <span className='absolute left-12 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity'>{name}</span>
                    </Link>
                ))}
                <Link to={'profile'}>
                    <img src='https://picsum.photos/100' className="w-8 h-8 rounded-full" />
                </Link>
            </div>
        </>
    );
};

export default Navigation;