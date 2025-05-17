import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostForm from './Post/PostForm';
import PostList from './Post/PostList';
import PostShow from './Post/PostShow';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/posts/new" element={<PostForm />} />
                <Route path="/posts/index" element={<PostList />} />
                <Route path="/posts/show/:id" element={<PostShow />} />
            </Routes>
        </BrowserRouter>
    );
}


export default App;
