import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import PostForm from './Post/PostForm';
import PostList from './Post/PostList';
import PostShow from './Post/PostShow';
import PostEdit from './Post/PostEdit';
import UserRegister from './User/UserRegister';
import UserLogin from './User/UserLogin';
import React, { useState, useEffect } from 'react';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        // 自動ログイン状態確認（任意）
        fetch('http://localhost:8080/api/users/me', {
            credentials: 'include'
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && data.email) {
                    setUserInfo(data);
                    setIsAuthenticated(true);
                }
            })
            .catch(err => console.error('自動ログイン確認失敗:', err));
    }, []);

    const handleLogout = () => {
        fetch("http://localhost:8080/logout", {
            method: "POST",
            credentials: "include"
        }).then((res) => {
            if (res.ok) {
                // ログアウト成功 → 状態クリア！
                setIsAuthenticated(false);
                setUserInfo(null);
                setUserId(null);
                setEmail('');
                console.log("ログアウトしました");
            } else {
                console.error("ログアウト失敗");
            }
        });
    };

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
                <Route path="/posts/new" element={<PostForm userId={userInfo?.id} />} />
                <Route path="/posts/index" element={<PostList userId={userInfo?.id} />} />
                <Route path="/posts/show/:id" element={<PostShow />} />
                <Route path="/posts/edit/:id" element={<PostEdit userId={userInfo?.id} />} />
                <Route path="/users/register" element={<UserRegister />} />
                <Route path="/users/login" element={<UserLogin setIsAuthenticated={setIsAuthenticated} setUserInfo={setUserInfo}/>} />
                <Route path="*" element={<Navigate to="/posts/index" />} /> {/* 不正なURLが入力されたら一覧画面に移動させる */}
            </Routes>
        </BrowserRouter>
    );
}


export default App;
