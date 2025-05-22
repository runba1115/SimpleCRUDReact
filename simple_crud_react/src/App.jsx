import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import PostNew from './Post/PostNew';
import PostIndex from './Post/PostIndex';
import PostShow from './Post/PostShow';
import PostEdit from './Post/PostEdit';
import UserRegister from './User/UserRegister';
import UserLogin from './User/UserLogin';
import { useUser } from './contexts/UserContext'
import { useEffect } from 'react';
import Header from './components/Header';
import { ROUTES } from './config/Constant';

/**
 * アプリケーションのルートコンポーネント
 * SPAとして各ページをルーティングしつつ、
 * 初回読み込み時にログイン情報を確認する処理を行う。
 *
 * @returns アプリケーション全体のルーティング構造
 */
function App() {
    const {initializeUser} = useUser();

    // コンポーネントの初回マウント時にログイン状態を確認する
    useEffect(() => {
        // API経由でユーザー情報を取得し、Contextに保存する
        initializeUser();
    }, []);

    return (
        // アプリ全体をルーティング対応にするためのRouterラッパー
        <BrowserRouter>
            {/* 共通ヘッダーの表示（ログイン/ログアウトリンクなど） */}
            <Header />

            {/* 各URLに対応する画面を定義 */}
            <Routes>
                <Route path={ROUTES.POST_INDEX} element={<PostIndex />} />
                <Route path={ROUTES.POST_SHOW()} element={<PostShow />} />
                <Route path={ROUTES.POST_NEW} element={<PostNew />} />
                <Route path={ROUTES.POST_EDIT()} element={<PostEdit />} />
                <Route path={ROUTES.USER_REGISTER} element={<UserRegister />} />
                <Route path={ROUTES.USER_LOGIN} element={<UserLogin />} />

                {/* 不正なURLが入力された場合、投稿一覧画面に遷移させる */}
                <Route path={ROUTES.NOT_MATCH} element={<Navigate to={ROUTES.POST_INDEX} />} />
            </Routes>
        </BrowserRouter>
    );
}

// Appコンポーネントを外部に公開する（index.jsで使用）
export default App;

