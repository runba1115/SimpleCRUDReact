import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import PostForm from './Post/PostForm';
import PostList from './Post/PostList';
import PostShow from './Post/PostShow';
import PostEdit from './Post/PostEdit';
import UserRegister from './User/UserRegister';
import UserLogin from './User/UserLogin';
import { UserContext } from './contexts/UserContext';
import React, { useEffect, useContext } from 'react';

function App() {
    const { userInfo, setUserInfo, isAuthenticated, setIsAuthenticated , initializeUser, handleLogout} = useContext(UserContext);

    useEffect(() => {
        initializeUser();
    }, []);

    return (
        <BrowserRouter>
            <div>
                {
                    isAuthenticated
                        ? (
                            <div>
                                <p>{userInfo.email}</p>
                                <p>{userInfo.id}</p>
                                <button onClick={handleLogout}>ログアウト</button>
                            </div>
                        )
                        : (
                            <>
                                <Link to="users/register">新規登録</Link>
                                <Link to="/users/login">ログインする</Link>
                            </>
                        )
                }
            </div>
            <Routes>
                <Route path="/posts/new" element={<PostForm />} />
                <Route path="/posts/index" element={<PostList userId={userInfo?.id} />} />
                <Route path="/posts/show/:id" element={<PostShow />} />
                <Route path="/posts/edit/:id" element={<PostEdit userId={userInfo?.id} />} />
                <Route path="/users/register" element={<UserRegister />} />
                <Route path="/users/login" element={<UserLogin setIsAuthenticated={setIsAuthenticated} setUserInfo={setUserInfo}/>} />
                <Route path="*" element={<Navigate to="/posts/index" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
