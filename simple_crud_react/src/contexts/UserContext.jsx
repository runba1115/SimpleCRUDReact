// Context API を用いたユーザー情報の管理を行うためのimport
import { createContext, useState, useContext } from 'react';
import { API_BASE_URL, APIS, MESSAGES } from '../config/Constant';
import { useCreateErrorFromResponse } from '../hooks/CreateErrorFromResponse';

// ユーザー情報と認証状態を格納するContext
export const UserContext = createContext();


/**
 * ユーザー情報をグローバルに保持・提供するためのProviderコンポーネント
 * @param {React.ReactNode} children - 子要素（このProviderに包まれるすべての要素）
 * @returns {JSX.Element} - Providerで囲われた子要素たち
 */
export const UserProvider = ({ children }) => {
    // ユーザー情報（ログイン後に設定）
    const [userInfo, setUserInfo] = useState(null);

    // 認証済みかどうかの状態
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // fetchのresponseがok以外の場合に使用する、想定外の値が帰ってきた場合にErrorを作成する共通機能
    const createErrorFromResponse = useCreateErrorFromResponse();

    /**
     * アプリ起動時などにセッションが有効かどうか確認し、
     * ログイン済みなら userInfo に情報をセットする
     * 未ログインやセッション切れなら状態を初期化する
     */
    const initializeUser = async () => {
        try {
            // セッションに紐づいたユーザー情報を取得するAPIを呼び出す
            const res = await fetch(`${API_BASE_URL}${APIS.GET_CURRENT_USER}`, {
                credentials: 'include',
            });

            if (res.ok) {
                // 認証OK（ログイン済み）
                console.log(MESSAGES.LOGGED_IN);

                // ユーザー情報の読み取り
                const data = await res.json();

                // ユーザーの情報を状態として保持する
                setUserInfo(data);

                // 認証済みに設定する
                setIsAuthenticated(true);
            } else {
                if (res.status === 401) {
                    // セッションが切れているなどで未認証の場合
                    console.log(MESSAGES.NOT_ALREADY_LOGGED_IN);

                    // 未ログイン状態に設定する
                    setUserInfo(null);
                    setIsAuthenticated(false);
                }
                else {
                    // それ以外の想定外エラー
                    const error = new Error();
                    error.status = res.status;
                    error.body = await res.text()
                    throw error;
                }
            }
        } catch (error) {
            // fetch失敗または上記の throw によるキャッチ
            console.error(MESSAGES.INTERNAL_ERROR, error);
            alert(MESSAGES.INTERNAL_ERROR);

            // 未ログイン状態に設定する
            setUserInfo(null);
            setIsAuthenticated(false);
        }
    };

    /**
     * ログアウト処理（セッション破棄・ステータス更新）
     */
    const handleLogout = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}${APIS.LOGOUT}`, {
                method: "POST",
                credentials: "include",
            });

            if (res.ok) {
                // 成功したら未ログイン状態に設定する
                console.log(MESSAGES.LOGGED_OUT);
                setIsAuthenticated(false);
                setUserInfo(null);
            } else {
                // それ以外の想定外エラー
                throw await createErrorFromResponse(res);
            }
        } catch (err) {
            // 通信エラーや想定外の例外
            console.error(MESSAGES.FAILED_LOGGED_OUT, err);
        }
    };

    // Contextとして全機能・状態を子要素に渡す
    return (
        <UserContext.Provider value={{
            userInfo,
            setUserInfo,
            isAuthenticated,
            setIsAuthenticated,
            initializeUser,
            handleLogout
        }}>
            {children}
        </UserContext.Provider>
    );
};


/**
 * useUser フック：任意のコンポーネントでユーザー情報や認証状態を簡単に扱えるようにする
 * @returns {object} - Context内で提供されている各種値や関数
 * @throws {Error} - UserProviderで包まれていない場合にエラーを投げる
 */
export const useUser = () => {
    const context = useContext(UserContext);
    if (context == null) {
        // Provider外で呼び出された場合は明示的にエラーを出す
        throw new Error(MESSAGES.NOT_USED_IN_USER_PROVIDER);
    }
    return context;
};