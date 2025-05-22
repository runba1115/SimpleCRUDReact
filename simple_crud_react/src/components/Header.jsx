import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { ROUTES } from "../config/Constant";
import './Header.css'

/**
 * アプリケーション全体で表示されるヘッダー
 * @returns ヘッダー
 */
function Header() {
    // Contextからログイン中のユーザー情報・状態・ログアウト関数を取得する
    const { userInfo, isAuthenticated, handleLogout } = useUser();

    return (
        <header>
            <div className="common_container header_container">
                <div className="heder_left_element">
                    <p>
                        投稿サンプル
                    </p>
                </div>
                <div className="header_right_element">
                    {
                        isAuthenticated
                            ? (
                                // ログイン済みの場合：ユーザー情報とログアウトボタンを表示する
                                <>
                                    <p>{userInfo.userName}</p>
                                    <button onClick={handleLogout} className="common_button_to_link">ログアウト</button>
                                </>
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
            </div>
        </header>
    );
}

// ログイン済みの場合、ユーザー情報とログアウトボタンを表示する
export default Header;
