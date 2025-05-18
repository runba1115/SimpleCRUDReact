import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PostForm from './Post/PostForm';
import PostList from './Post/PostList';
import PostShow from './Post/PostShow';
import PostEdit from './Post/PostEdit';
import React, { useState, useEffect } from 'react';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        const storedUserId = localStorage.getItem("userId");
        if (storedEmail && storedUserId) {
            setIsAuthenticated(true);
            setEmail(storedEmail);
            setUserId(Number(storedUserId));
            return;
        }

        const login = () => {
            const users = [
                { id: 0, email: "admin@example.com", password: "password123" },
                { id: 1, email: "user@example.com", password: "password456" },
            ];

            const inputEmail = prompt("メールアドレスを入力してください：", "");
            const inputPassword = prompt("パスワードを入力してください：", "");
            const matchedUser = users.find(
                user => user.email === inputEmail && user.password === inputPassword
            );

            if (matchedUser) {
                setIsAuthenticated(true);
                setEmail(matchedUser.email);
                setUserId(matchedUser.id)
                localStorage.setItem("email", matchedUser.email);
                localStorage.setItem("userId", matchedUser.id);
                alert("ログインに成功しました！");
            } else {
                alert("ログインに失敗しました。ページを再読み込みして再試行してください。")
            }
        };

        login();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("email");
        setEmail("");
        setUserId(null);
        setIsAuthenticated(false);
        alert("ログアウトしました。再読み込みで再ログインできます。");
    };

    if (!isAuthenticated) {
        return <p>ログインが必要です。ページを再読み込みして実行してください。</p>
    }

    return (
        <BrowserRouter>
            <div>
                ログイン中：{email}
                <button onClick={handleLogout}>
                    ログアウト
                </button>
            </div>
            <Routes>
                <Route path="/posts/new" element={<PostForm userId = {userId}/>} />
                <Route path="/posts/index" element={<PostList userId = {userId}/>} />
                <Route path="/posts/show/:id" element={<PostShow />} />
                <Route path="/posts/edit/:id" element={<PostEdit userId = {userId} />} />
                <Route path="*" element={<Navigate to="/posts/index" />} /> {/* 不正なURLが入力されたら一覧画面に移動させる */}
            </Routes>
        </BrowserRouter>
    );
}


export default App;
