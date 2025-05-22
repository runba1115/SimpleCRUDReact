import { useState } from 'react';
import { API_BASE_URL, APIS, MESSAGES, ROUTES } from '../config/Constant';
import { useShowErrorMessage } from '../hooks/ShowErrorMessage';
import { Routes, useNavigate } from 'react-router-dom';
import './UserAuth.css';

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
        <div className='common_container'>
            <div className='user_auth_container'>
                <h2 className='user_auth_title'>ユーザー登録</h2>
                <form onSubmit={handleRegister} className='user_auth_form'>
                    <div className='user_auth_form_group'>
                        <label className='user_auth_label'>ユーザー名</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                            className='user_auth_input'
                        />
                    </div>
                    <div className='user_auth_form_group'>
                        <label className='user_auth_label'>メールアドレス</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className='user_auth_input'
                        />
                    </div>
                    <div className='user_auth_form_group'>
                        <label className='user_auth_label'>パスワード</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className='user_auth_input'
                        />
                    </div>
                    <div className='user_auth_button_group'>
                        <input type="submit" className='common_button user_auth_login_button' value="登録する" />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserRegister;

