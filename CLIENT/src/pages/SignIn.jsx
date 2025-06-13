import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import {
    browserSessionPersistence,
    setPersistence,
    signInWithPopup,
} from "firebase/auth";
import { auth, gitHubProvider, googleProvider } from "../firebase/firebase.js";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";

export default function SignIn() {
    const navigate = useNavigate();

    const handleSignInGoogle = async () => {
        try {
            await setPersistence(auth, browserSessionPersistence);
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            if (user) {
                navigate("/");
            }
            // console.log(user);
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    };

    const handleSignInGitHub = async () => {
        try {
            await setPersistence(auth, browserSessionPersistence);
            const result = await signInWithPopup(auth, gitHubProvider);
            const user = result.user;
            if (user) {
                navigate("/");
            }
            // console.log(user);
        } catch (error) {
            console.error("GitHub Sign-In Error:", error);
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-4.2rem)] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 p-4">
            <motion.div
                className="absolute inset-0 z-0"
                animate={{
                    scale: [1, 1.05, 1, 1.05, 1],
                    opacity: [0.3, 0.5, 0.3, 0.5, 0.3],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 20,
                    ease: "easeInOut",
                }}
            >
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
                <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative z-10 bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md text-center border border-white/50"
            >
                <div className="flex flex-col items-center mb-6">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg mb-4 inline-block">
                        <KeyRound size={28} className="text-white" />{" "}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                        Akses Akun Anda
                    </h2>
                    <p className="text-slate-500 mt-2 text-sm sm:text-base">
                        Pilih penyedia untuk melanjutkan.
                    </p>
                </div>

                <div className="space-y-4">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSignInGoogle}
                        className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-100/70 hover:border-slate-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm cursor-pointer"
                    >
                        <FcGoogle size={24} />
                        <span>Lanjutkan dengan Google</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSignInGitHub}
                        className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-100/70 hover:border-slate-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm cursor-pointer"
                    >
                        <FaGithub size={24} className="text-slate-800" />
                        <span>Lanjutkan dengan GitHub</span>
                    </motion.button>
                </div>

                <div className="mt-8 text-slate-500 text-xs sm:text-sm">
                    Dengan masuk, Anda menunjukkan bahwa Anda telah membaca dan
                    setuju dengan{" "}
                    <span className="font-medium text-blue-600 cursor-default">
                        {" "}
                        Ketentuan Layanan
                    </span>{" "}
                    dan{" "}
                    <span className="font-medium text-blue-600 cursor-default">
                        {" "}
                        Kebijakan Privasi
                    </span>
                    .
                </div>
            </motion.div>
        </div>
    );
}
