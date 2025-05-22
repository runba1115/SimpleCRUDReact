import { useState } from 'react';
import { API_BASE_URL, APIS, MESSAGES, ROUTES } from '../config/Constant';
import { useShowErrorMessage } from '../hooks/ShowErrorMessage';
import { Routes, useNavigate } from 'react-router-dom';

/**
 * ユーザー登録画面
 * @returns ユーザー登録画面
 */
function UserRegister() {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const showErrorMessage = useShowErrorMessage();
    const navigate = useNavigate();

    /**
     * フォーム送信時に実行されるログイン処理
     * @param {Event} e - フォーム送信イベント
     */
    const handleRegister = async (e) => {
        // フォームのデフォルトの送信動作（ページリロード）をキャンセルする
        e.preventDefault();

        try {
            const response = await fetch(`${API_BASE_URL}${APIS.USER_REGISTER}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName, email, password })
            });

            if (response.ok) {
                alert(MESSAGES.USER_REGISTER_SUCCESSED);
                navigate(ROUTES.USER_LOGIN);
            } else {
                const errorText = await response.text();
                alert('登録に失敗しました: ' + errorText);
            }
        } catch (error) {
            showErrorMessage(error, MESSAGES.USER_REGISTER_FAILED);
        }
    };

    return (
        <div>
            <h2>ユーザー登録</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>ユーザー名:</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>
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

