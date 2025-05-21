import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { ROUTES } from "../config/Constant";

/**
 * アプリケーション全体で表示されるヘッダーコンポーネント
 * ログイン状態に応じて、ユーザー情報やログアウトボタン、
 * または新規登録・ログインリンクを切り替えて表示する
 *
 * @component
 * @returns {JSX.Element} - ヘッダーとして表示されるReact要素
 */
function Header() {
    // Contextからログイン中のユーザー情報・状態・ログアウト関数を取得する
    const { userInfo, isAuthenticated, handleLogout } = useUser();

    return (
        <div>
            {
                isAuthenticated
                    ? (
                        // ログイン済みの場合：ユーザー情報とログアウトボタンを表示する
                        <div>
                            <p>{userInfo.email}</p>
                            <p>{userInfo.id}</p>
                            <button onClick={handleLogout}>ログアウト</button>
                        </div>
                    )
                    : (
                        // 未ログインの場合：新規登録／ログインリンクを表示する
                        <>
                            <Link to={ROUTES.USER_REGISTER}>新規登録</Link>
                            <Link to={ROUTES.USER_LOGIN}>ログインする</Link>
                        </>
                    )
            }
        </div>
    );
}

// ログイン済みの場合、ユーザー情報とログアウトボタンを表示する
export default Header;