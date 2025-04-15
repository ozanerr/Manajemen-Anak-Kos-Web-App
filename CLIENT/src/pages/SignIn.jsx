import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import {
    browserSessionPersistence,
    setPersistence,
    signInWithPopup,
} from "firebase/auth";
import { auth, gitHubProvider, googleProvider } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
    const navigate = useNavigate();

    const handleSignInGoogle = async () => {
        try {
            await setPersistence(auth, browserSessionPersistence);
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            if (user) {
                navigate("/");
                console.log(user);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSignInGitHub = async () => {
        try {
            const result = await signInWithPopup(auth, gitHubProvider);
            const user = result.user;

            if (user) {
                navigate("/");
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5 }} // Durasi animasi diperpanjang
                className="relative z-10 bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-96 text-center backdrop-blur-lg"
            >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Sign In to your account
                </h2>
                <p className="text-gray-600 mb-6 text-sm">
                    Choose a sign-in method to continue
                </p>
                <div className="space-y-4">
                    <button
                        onClick={handleSignInGoogle}
                        className="w-full flex items-center justify-center space-x-3 py-3 border border-gray-400 rounded-lg text-gray-800 font-medium hover:bg-gray-300 transition relative z-20"
                    >
                        <FcGoogle size={24} />
                        <span>Continue with Google</span>
                    </button>
                    <button
                        onClick={handleSignInGitHub}
                        className="w-full flex items-center justify-center space-x-3 py-3 border border-gray-400 rounded-lg text-gray-800 font-medium hover:bg-gray-300 transition relative z-20"
                    >
                        <FaGithub size={24} />
                        <span>Continue with GitHub</span>
                    </button>
                </div>
                <div className="mt-6 text-gray-600 text-sm">
                    By signing in, you agree to our{" "}
                    <a href="#" className="text-gray-700 hover:underline">
                        Terms
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-gray-700 hover:underline">
                        Privacy Policy
                    </a>
                    .
                </div>
                <div className="mt-8 flex flex-col items-center">
                    <p className="text-gray-600 text-sm">
                        Powered by MERN Stack
                    </p>
                    <div className="mt-2 flex space-x-3">
                        <i className="devicon-mongodb-plain colored text-3xl"></i>
                        <i className="devicon-express-original text-3xl text-gray-600"></i>
                        <i className="devicon-react-original colored text-3xl"></i>
                        <i className="devicon-nodejs-plain colored text-3xl"></i>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 opacity-60 blur-2xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                    rotate: [0, 20, -20, 0],
                    x: [-30, 30, -30],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 10,
                    ease: "easeInOut",
                }} // Durasi diperpanjang menjadi 10 detik
            ></motion.div>
        </div>
    );
}
