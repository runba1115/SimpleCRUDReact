import React, { useState } from 'react';

function UserRegister() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                alert('ユーザー登録に成功しました');
                setEmail('');
                setPassword('');
            } else {
                const errorText = await response.text();
                alert('登録に失敗しました: ' + errorText);
            }
        } catch (error) {
            console.error('通信エラー:', error);
            alert('サーバーに接続できませんでした');
        }
    };

    return (
        <div>
            <h2>ユーザー登録</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>メールアドレス:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>パスワード:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">登録する</button>
            </form>
        </div>
    );
}

export default UserRegister;
