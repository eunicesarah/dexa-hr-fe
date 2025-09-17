import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Button from './Button';

const Navbar = ({ role }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const adminMenu = [
        {
            name: 'Attendance',
            path: '/attendance',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            )
        },
        {
            name: 'Employee',
            path: '/employee',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
            )
        }
    ];

    const userMenu = [
        {
            name: 'Today Attendance',
            path: '/today-attendance',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            )
        },
        {
            name: 'My Attendance',
            path: '/my-attendance',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
            )
        },
        {
            name: 'Profile',
            path: '/profile',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
            )
        }
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const currentMenu = role === 'admin' || role === 'ADMIN' ? adminMenu : userMenu;
    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`bg-gradient-to-b from-darkRed to-mandarin text-white transition-all duration-300 flex flex-col shadow-lg min-h-screen w-[25%]`}>
            <div className="p-4 border-b border-yellow">
                <div className="flex items-center justify-between flex flex-col">
                            <h1 className="text-xl font-bold">
                                {role === 'admin' || role === 'ADMIN' ? 'Admin' : 'Employee'}
                            </h1>
                            <p className="text-white text-sm">
                                {role === 'admin' || role === 'ADMIN' ? 'HR Management' : 'Welcome back!'}
                            </p>
                </div>
            </div>

            <div className="flex-1 py-4">
                <div className="space-y-2 px-3">
                    {currentMenu.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => handleNavigation(item.path)}
                            className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 text-left ${
                                isActive(item.path)
                                    ? 'bg-yellow text-white shadow-md'
                                    : 'hover:bg-mandarin hover:text-white'
                            }`}
                        >
                            <span className="flex-shrink-0">
                                {item.icon}
                            </span>
                                <span className="ml-3 font-medium">{item.name}</span>
                            { isActive(item.path) && (
                                <span className="ml-auto">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="border-t border-yellow p-4">

                <Button
                    onClick={handleLogout}
                    className={`w-full flex items-center px-3 py-3 rounded-lg text-yellow hover:bg-red-500 hover:text-white transition-all duration-200`}
                    label={'Logout'}
                    variant='add'
                />
            </div>
        </nav>
    );
};

export default Navbar;