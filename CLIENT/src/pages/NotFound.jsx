import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoaded(true);

        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="relative min-h-[calc(100vh-4.2rem)] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className=" w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
                    style={{
                        left: `${mousePosition.x * 0.1}%`,
                        top: `${mousePosition.y * 0.1}%`,
                        transform: "translate(-50%, -50%)",
                    }}
                />
                <div
                    className="absolute w-64 h-64 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-700"
                    style={{
                        right: `${mousePosition.x * 0.05}%`,
                        bottom: `${mousePosition.y * 0.05}%`,
                        transform: "translate(50%, 50%)",
                    }}
                />
            </div>

            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

            <div className="relative z-10 flex items-center justify-center px-4">
                <div
                    className={`text-center max-w-2xl mx-auto transform transition-all duration-1000 ${
                        isLoaded
                            ? "translate-y-0 opacity-100"
                            : "translate-y-10 opacity-0"
                    }`}
                >
                    <div className="relative mb-8">
                        <h1 className="text-9xl md:text-[12rem] font-black text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text animate-pulse">
                            404
                        </h1>
                    </div>

                    <div className="mb-8 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 pb-3">
                            Ups! Halaman Tidak Ditemukan
                        </h2>
                        <p className="text-gray-500 text-lg md:text-xl leading-relaxed pb-5">
                            Maaf, Kami tidak dapat menemukan halaman yang Anda
                            cari
                        </p>
                    </div>

                    <div className="flex justify-center items-center mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="cursor-pointer group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                        >
                            <ArrowLeft
                                size={20}
                                className="group-hover:-translate-x-1 transition-transform"
                            />
                            Kembali
                        </button>
                    </div>

                    <div
                        className="absolute -top-20 -left-20 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 animate-bounce"
                        style={{
                            animationDelay: "0s",
                            animationDuration: "3s",
                        }}
                    />
                    <div
                        className="absolute -bottom-20 -right-20 w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-20 animate-bounce"
                        style={{
                            animationDelay: "1s",
                            animationDuration: "4s",
                        }}
                    />
                    <div
                        className="absolute top-1/4 -right-32 w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full opacity-20 animate-bounce"
                        style={{
                            animationDelay: "2s",
                            animationDuration: "5s",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default NotFound;
