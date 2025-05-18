import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostForm from './Post/PostForm';
import PostList from './Post/PostList';
import PostShow from './Post/PostShow';
import PostEdit from './Post/PostEdit';
import React, {useState, useEffect} from 'react';

function App() {
    const [isAuthenticated , setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(()=>{
        const storedEmail = localStorage.getItem("email");
        if(storedEmail){
            setIsAuthenticated(true);
            setEmail(storedEmail);
            return;
        }
        
        const login = ()=>{
            const inputEmail = prompt("メールアドレスを入力してください：", "");
            const inputPassword = prompt("パスワードを入力してください：", "");

            const validEmail = "admin@example.com"
            const validPassword = "password123";

            if(inputEmail === validEmail && inputPassword === validPassword){
                setIsAuthenticated(true);
                setEmail(inputEmail);
                localStorage.setItem("email", inputEmail);
                alert("ログインに成功しました！");
            }else{
                alert("ログインに失敗しました。ページを再読み込みして再試行してください。")
            }
        };

        login();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("email");
        setEmail("");
        setIsAuthenticated(false);
        alert("ログアウトしました。再読み込みで再ログインできます。");
    };

    if(!isAuthenticated){
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
                <Route path="/posts/new" element={<PostForm />} />
                <Route path="/posts/index" element={<PostList />} />
                <Route path="/posts/show/:id" element={<PostShow />} />
                <Route path="/posts/edit/:id" element={<PostEdit />} />
            </Routes>
        </BrowserRouter>
    );
}


export default App;
