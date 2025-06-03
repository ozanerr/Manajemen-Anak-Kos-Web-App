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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-4">
                Selamat datang di Halaman Home
            </h1>
            <p className="text-lg text-gray-700">Ini adalah halaman home.</p>
        </div>
    );
};

export default Home;
