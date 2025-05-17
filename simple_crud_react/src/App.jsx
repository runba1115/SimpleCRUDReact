import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostForm from './Post/PostForm';
import PostList from './Post/PostList';
import PostShow from './Post/PostShow';
import PostEdit from './Post/PostEdit';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/posts/new" element={<PostForm />} />
                <Route path="/posts/index" element={<PostList />} />
                <Route path="/posts/show/:id" element={<PostShow />} />
                <Route path="/posts/edit/:id" element={<PostEdit />} />
            </Routes>
        </BrowserRouter>
    );
}


export default App;
