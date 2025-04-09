import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import AddPost from './pages/AddPost'
import PostDetail from './pages/PostDetail'
import SignIn from './pages/SignIn'

function App() {

	return (
		<Router>
			<Routes>
				<Route path='/' element={<Home/>} />
				<Route path='/addPost' element={<AddPost/>} />
				<Route path='/posts/:postId' element={<PostDetail/>} />
				<Route path='/signin' element={<SignIn/>} />
			</Routes>
		</Router>
	)
}

export default App
