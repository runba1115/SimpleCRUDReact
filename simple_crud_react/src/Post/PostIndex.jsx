import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { API_BASE_URL, APIS, MESSAGES, ROUTES } from '../config/Constant';
import { useDeletePost } from '../hooks/DeletePost';
import { useCreateErrorFromResponse } from '../hooks/CreateErrorFromResponse';

/**
 * 投稿一覧を表示する画面コンポーネント
 *
 * - APIから投稿一覧を取得して表示
 * - 投稿者本人には「編集」「削除」ボタンを表示
 * - 削除成功後は投稿一覧を再取得
 *
 * @component
 * @returns {JSX.Element} 投稿一覧画面
 */
function PostIndex() {
    // 認証中ユーザー情報をContextから取得（idの比較に使用）
    const { userInfo } = useContext(UserContext);

    // 投稿一覧データの状態管理
    const [posts, setPosts] = useState([]);

    // 投稿削除処理用のカスタムフック（confirm, API, navigate含む）
    const deletePost = useDeletePost();


    // fetchのresponseがok以外の場合に使用する、想定外の値が帰ってきた場合にErrorを作成する共通機能
    const createErrorFromResponse = useCreateErrorFromResponse();

    /**
     * 投稿一覧をAPI経由で取得してStateに格納する関数
     * fetchの成功可否をチェックし、失敗時にはエラーを通知する
     */
    const getPosts = async () => {
        try {
            // セッションに紐づいたユーザー情報を取得するAPIを呼び出す
            const res = await fetch(`${API_BASE_URL}${APIS.POST_ALL}`);

            if (res.ok) {
                // 投稿一覧データ（JSON）を取得して状態にセット
                const resultPosts = await res.json();
                setPosts(resultPosts);
            } else {
                // 想定外のステータスコード（4xx/5xxなど）
                throw createErrorFromResponse(res);
            }
        } catch (error) {
            // ネットワークエラーまたはthrowされたErrorをキャッチ
            console.error(MESSAGES.INTERNAL_ERROR, error);
            alert(MESSAGES.INTERNAL_ERROR);

            // 投稿を空にする
            setPosts([]);
        }
    }


    // 初回レンダリング時に投稿一覧を取得する
    useEffect(() => {
        getPosts();
    }, []);

    /**
     * 削除ボタン押下時に呼ばれる関数
     * 指定IDの投稿を削除した後、投稿一覧を再取得して画面を更新する
     *
     * @param {number|string} id - 削除対象の投稿ID
     */
    const handleDelete = async (id) => {
        await deletePost(id);
        getPosts();
    }

    return (
        <div>
            {/* 新規投稿作成画面へのリンク */}
            <Link to={`/posts/new`}>新規作成</Link>
            <h2>投稿一覧</h2>

            {/* 投稿が存在しない場合のメッセージ表示 */}
            {posts.length === 0 ? (
                <p>投稿がまだありません</p>
            ) : (
                <ul>
                    {posts.map(post => {
                        // 現在ログインしているユーザーが投稿者かどうか判定する（今後、投稿者でなければ編集、削除を行えないようにするため）
                        const isOwner = post.user.id == userInfo?.id;
                        const buttonStyle = {
                            color: isOwner ? 'blue' : 'gray',
                        };

                        return (<li key={post.id}>
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                            <small>投稿者ID: {post.userId}</small>
                            <Link to={ROUTES.POST_SHOW(post.id)} style={buttonStyle}>詳細</Link>
                            <Link to={ROUTES.POST_EDIT(post.id)} style={buttonStyle}>編集</Link>
                            <button onClick={() => handleDelete(post.id)}>削除</button>
                        </li>);
                    })}
                </ul>
            )}
        </div>
    );
}

export default PostIndex;