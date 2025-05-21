// APIを実行するときの基本となるURL
export const API_BASE_URL = process.env.REACT_APP_API_URL;

// 各ページのルーティングを行うときに使用する定数
export const ROUTES = {
    POST_NEW : '/posts/new',
    POST_INDEX : '/posts/index',
    POST_SHOW : (id = ':id') => `/posts/show/${id}`,
    POST_EDIT : (id = ':id') => `/posts/edit/${id}`,
    USER_REGISTER : '/users/register',
    USER_LOGIN : '/users/login',
    NOT_MATCH : '*',
};

// メッセージ
export const MESSAGES = {
    // ユーザー認証関係のメッセージ
    LOGGED_IN: 'ログイン済みです',
    NOT_ALREADY_LOGGED_IN:  '未ログインです',
    LOGGED_OUT: 'ログアウトしました',
    FAILED_LOGGED_OUT: 'ログアウトに失敗しました',

    // 想定していないエラーが発生した場合のエラー
    INTERNAL_ERROR: '想定していないエラーが発生しました。管理者に連絡してください。',


    // 投稿関係
    DELETE_CONFIRM: '本当に削除しますか？',
    DELETE_SUCCESSED: '削除に成功しました',
    DELETE_FAILED: '削除に失敗しました',

    // デバッグ用メッセージ
    NOT_USED_IN_USER_PROVIDER: 'UserProviderの位置が不正です',
}

// API
export const APIS={
    // ユーザー関係
    GET_CURRENT_USER: '/api/users/me',
    LOGOUT: '/logout',

    // 投稿関係
    POST_ALL : '/api/posts/all',
    POST_DELETE : (id = ':id') => `/api/posts/${id}`,
}