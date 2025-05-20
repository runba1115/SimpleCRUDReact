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
                const data = await res.json();
                console.log(data);
                setUserInfo(data);
                setIsAuthenticated(true);
            } else {
                if (res.status === 401) {
                    // 未認証
                    console.log("未認証です");
                    setUserInfo(null);
                    setIsAuthenticated(false);
                }
                else {
                    // 想定外のエラーが発生した
                    console.warn(`想定外のエラーが発生しました ${res.status} ${res.json}`)
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

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};