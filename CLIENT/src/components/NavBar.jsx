import { useState } from "react";
import { Menu, X, Home, DollarSign, Clock, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import logoSrc from "../assets/logo.png";

const Navbar = () => {
    const [open, setOpen] = useState(false);

    const navItems = [
        { name: "Home", path: "/", icon: Home },
        { name: "Keuangan", path: "/finance", icon: DollarSign },
        { name: "Deadline", path: "/deadline", icon: Clock },
        { name: "Diskusi", path: "/discussion", icon: MessageCircle },
    ];

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            <img src={logoSrc} alt="" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                            Aturin
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className="group flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 ease-in-out transform hover:scale-105"
                                >
                                    <Icon
                                        size={18}
                                        className="group-hover:rotate-12 transition-transform duration-200"
                                    />
                                    <span className="font-medium">
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setOpen(!open)}
                            className="relative p-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 transform hover:scale-110"
                        >
                            <div className="relative w-6 h-6">
                                <Menu
                                    size={24}
                                    className={`absolute transition-all duration-300 ${
                                        open
                                            ? "rotate-180 opacity-0"
                                            : "rotate-0 opacity-100"
                                    }`}
                                />
                                <X
                                    size={24}
                                    className={`absolute transition-all duration-300 ${
                                        open
                                            ? "rotate-0 opacity-100"
                                            : "-rotate-180 opacity-0"
                                    }`}
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="px-4 pb-4 space-y-1 bg-gradient-to-b from-white to-gray-50">
                    {navItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-white hover:shadow-md transition-all duration-200 transform hover:translate-x-2 ${
                                    open ? "animate-slideIn" : ""
                                }`}
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                }}
                                onClick={() => setOpen(false)}
                            >
                                <Icon size={20} className="text-gray-400" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .animate-slideIn {
                    animation: slideIn 0.4s ease-out forwards;
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
