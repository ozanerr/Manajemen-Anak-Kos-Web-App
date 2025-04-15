import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AddPost from "./pages/AddPost";
import PostDetail from "./pages/PostDetail";
import SignIn from "./pages/SignIn";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { clearUser, setUser } from "./user/userSlice";

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
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/addPost" element={<AddPost />} />
                <Route path="/posts/:postId" element={<PostDetail />} />
                <Route path="/signin" element={<SignIn />} />
            </Routes>
        </Router>
    );
}

export default App;
