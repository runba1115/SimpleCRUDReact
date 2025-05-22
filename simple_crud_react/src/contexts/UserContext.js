// Context API を用いたユーザー情報の管理を行うためのimport
import { createContext, useState, useContext } from 'react';
import { API_BASE_URL, APIS, HTTP_STATUS_CODES, MESSAGES } from '../config/Constant';
import { useCreateErrorFromResponse } from '../hooks/CreateErrorFromResponse';
import { useShowErrorMessage } from '../hooks/ShowErrorMessage';

// ユーザー情報と認証状態を格納するContext
export const UserContext = createContext();


/**
 * ユーザー情報をグローバルに保持・提供するためのProviderコンポーネント
 * @param {React.ReactNode} children - 子要素（このProviderに包まれるすべての要素）
 * @returns- Providerで囲われた子要素たち
 */
export const UserProvider = ({ children }) => {
    // ユーザー情報（ログイン後に設定）
    const [userInfo, setUserInfo] = useState(null);

    // 認証済みかどうかの状態
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const createErrorFromResponse = useCreateErrorFromResponse();
    const showErrorMessage = useShowErrorMessage();

    /**
     * アプリ起動時などにセッションが有効かどうか確認し、
     * ログイン済みなら userInfo に情報をセットする
     * 未ログインやセッション切れなら状態を初期化する
     */
    const initializeUser = async () => {
        try {
            // セッションに紐づいたユーザー情報を取得するAPIを呼び出す
            const res = await fetch(`${API_BASE_URL}${APIS.USER_GET_CURRENT}`, {
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
                if (res.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
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
            showErrorMessage(error, MESSAGES.USER_INFO_GET_FAILED)

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
            const res = await fetch(`${API_BASE_URL}${APIS.USER_LOGOUT}`, {
                method: "POST",
                credentials: "include",
            });

            if (res.ok) {
                // 成功したら未ログイン状態に設定する
                console.log(MESSAGES.LOG_OUT_SUCCESS);
                setIsAuthenticated(false);
                setUserInfo(null);
            } else {
                // それ以外の想定外エラー
                throw await createErrorFromResponse(res);
            }
        } catch (error) {
            // 通信エラーや想定外の例外
            showErrorMessage(error, MESSAGES.LOG_OUT_FAILED)
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
 * @returns  - Context内で提供されている各種値や関数
 */
export const useUser = () => {
    const context = useContext(UserContext);
    if (context == null) {
        // Provider外で呼び出された場合は明示的にエラーを出す
        throw new Error(MESSAGES.NOT_USED_IN_USER_PROVIDER);
    }
    return context;
};
