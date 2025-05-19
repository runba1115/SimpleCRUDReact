import React, { createContext, useState } from 'react';
import { API_BASE_URL } from '../config/Constant';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // 自動ログイン確認用関数
    const initializeUser = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/users/me`, {
                credentials: 'include',
            });
            if (res.ok) {
                const text = await res.text(); // ← まずは text で受け取る！
                if (text) {
                    const data = JSON.parse(text); // ← 中身があれば JSON にパース
                    setUserInfo(data);
                    setIsAuthenticated(true);
                } else {
                    console.log("空のレスポンスなのでログイン状態ではありません");
                }
            }
        } catch (error) {
            console.error('ユーザー初期化エラー:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/logout`, {
                method: "POST",
                credentials: "include",
            });
            if (res.ok) {
                setIsAuthenticated(false);
                setUserInfo(null);
                console.log("ログアウトしました");
            } else {
                console.error("ログアウト失敗");
            }
        } catch (err) {
            console.error("通信エラー:", err);
        }
    };

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