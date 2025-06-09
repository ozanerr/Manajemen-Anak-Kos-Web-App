import "./App.css";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import SignIn from "./pages/SignIn";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { clearUser, setUser } from "./user/userSlice";
import Deadline from "./pages/Deadline";
import Finance from "./pages/Finance";
import Navbar from "./components/NavBar";
import Discussion from "./pages/Discussion";
import NotFound from "./pages/NotFound";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch(setUser(user));
            } else {
                dispatch(clearUser());
            }
        });
        return () => unsubscribe();
    }, [dispatch]);

    return (
        <Router>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/posts/:postId" element={<PostDetail />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/deadline" element={<Deadline />} />
                        <Route path="/finance" element={<Finance />} />
                        <Route path="/discussion" element={<Discussion />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </div>
        </Router>

    );
}

export default App;
