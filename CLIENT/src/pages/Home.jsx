import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { displayName, photoURL, isloggedIn } = useSelector(
        (state) => state.user
    );

    const navigate = useNavigate();

    // if (isLoggedIn != true) {
    //     navigate("/signin");
    // }

    useEffect(() => {
        if (isloggedIn != true) {
            navigate("/signin");
        }
    }, []);
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">
                Welcome to the Home Page
            </h1>
            <p className="text-lg text-gray-700">
                This is the home page of your application.
            </p>
        </div>
    );
};

export default Home;
