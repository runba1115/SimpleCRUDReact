import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, MESSAGES, ROUTES } from '../config/Constant';
import { useUser } from '../contexts/UserContext';
import { useShowErrorMessage } from '../hooks/ShowErrorMessage';
import { useCreateErrorFromResponse } from '../hooks/CreateErrorFromResponse';

/**
 * ログイン画面
 * @returns ログイン画面
 */
function UserLogin() {
    const { initializeUser } = useUser();
    const {setIsAuthenticated, setUserInfo} = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const showErrorMessage = useShowErrorMessage();
    const createErrorFromResponse = useCreateErrorFromResponse();

    /**
     * フォーム送信時に実行されるログイン処理
     * @param {Event} e - フォーム送信イベント
     */
    const handleLogin = async (e) => {
        // フォームのデフォルトの送信動作（ページリロード）をキャンセル
        e.preventDefault();

        // フォームデータを URL エンコード形式で作成する
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        try {
            // ログイン API を呼び出して認証を試みる
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                credentials: 'include', // 認証情報（クッキーなど）を含める
                body: formData// リクエストボディにフォームデータを設定
            });

            if (response.ok) {
                // ログインに成功した
                alert(MESSAGES.LOG_IN_SUCCESS);

                // ユーザー初期化処理を再度実行することでログインした状態にする
                await initializeUser();
                navigate(ROUTES.POST_INDEX);
            } else {
                throw await createErrorFromResponse(response);
            }
        } catch (error) {
            showErrorMessage(error, MESSAGES.LOG_IN_FAILED);
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

