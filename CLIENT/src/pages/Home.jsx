import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { displayName, photoURL, isloggedIn, payload } = useSelector(
        (state) => state.user
    );

    const navigate = useNavigate();

    useEffect(() => {
        if (isloggedIn != true) {
            navigate("/signin");
        }
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row gap-10">
                {/* Left Sidebar - Profile */}
                <div className="">
                    <div className="w-auto sm:w-80 bg-white rounded-lg shadow-sm p-6">
                        {/* Profile Image */}
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full border-4 border-red-500 overflow-hidden mb-4">
                                <img
                                    className="w-full h-full rounded-full object-cover border border-white shadow-sm"
                                    src={
                                        photoURL ||
                                        `https://ui-avatars.com/api/?name=${(
                                            displayName || "U"
                                        ).charAt(
                                            0
                                        )}&background=random&color=fff&font-size=0.5&bold=true`
                                    }
                                    alt={displayName || "User"}
                                />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                {displayName}
                            </h2>
                            <p className="text-gray-500 text-sm mb-6">
                                a432bsy2611
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                                Keuangan
                            </button>
                            <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                                Deadline
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grow-2">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="bg-green-500 rounded-lg p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                            <h4 className="text-white text-xl font-semibold">
                                ini diskusi
                            </h4>
                        </div>

                        <div className="bg-blue-500 rounded-lg p-8 text-center shadow-lg hover:shadow-xl transition-shadow">
                            <h4 className="text-white text-xl font-semibold">
                                ini berita
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
