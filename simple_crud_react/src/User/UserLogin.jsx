import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/Constant';
import { useUser } from '../contexts/UserContext';

function UserLogin() {
    const {setIsAuthenticated, setUserInfo} = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();

        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                credentials: 'include',
                body: formData
            });

            if (response.ok) {
                const meRes = await fetch(`${API_BASE_URL}/api/users/me`, {
                    credentials: 'include'
                });
                const userInfo = await meRes.json();

                alert('ログイン成功');
                setIsAuthenticated(true);   // ← ここでAppの状態更新！
                setUserInfo(userInfo);      // ← これでユーザー情報も保存！
                navigate("/posts/index");
            } else {
                alert('ログイン失敗');
            }
        } catch (error) {
            console.error('通信エラー:', error);
            alert('サーバーへの接続に失敗しました');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <div>
                <label>メールアドレス:</label><br />
                <input
                    type="email"
                    value={email}
                    autoComplete="username"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="メールアドレス"
                    required
                />
            </div>
            <div>
                <label>パスワード:</label><br />
                <input
                    type="password"
                    value={password}
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="パスワード"
                    required
                />
            </div>
            <button type="submit">ログイン</button>
        </form>
    );
}

export default UserLogin;
