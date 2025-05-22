import { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { API_BASE_URL, APIS, MESSAGES, ROUTES } from '../config/Constant';
import { useDeletePost } from '../hooks/DeletePost';
import { useCreateErrorFromResponse } from '../hooks/CreateErrorFromResponse';
import { useShowErrorMessage } from '../hooks/ShowErrorMessage';
import './PostIndex.css';

/**
 * 投稿一覧画面
 * @returns 投稿一覧画面
 */
function PostIndex() {
    const { userInfo } = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const deletePost = useDeletePost(useCallback(() => { getPosts(); }, []));
    const createErrorFromResponse = useCreateErrorFromResponse();
    const showErrorMessage = useShowErrorMessage();

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
                throw await createErrorFromResponse(res);
            }
        } catch (error) {
            // ネットワークエラーまたはthrowされたErrorをキャッチ
            showErrorMessage(error, MESSAGES.POST_GET_FAILED);

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
    }

    return (
        <div className='common_container '>
            {/* 新規投稿作成画面へのリンク */}
            <Link to={`/posts/new`} className='common_button posts_create_button'>新規作成</Link>
            <h2>投稿一覧</h2>

            {/* 投稿が存在しない場合のメッセージ表示 */}
            {posts.length === 0 ? (
                <p>投稿がまだありません</p>
            ) : (
                <ul>
                    {posts.map(post => {
                        // 現在ログインしているユーザーが投稿者かどうか判定する（今後、投稿者でなければ編集、削除を行えないようにするため）
                        const isOwner = post.user.id == userInfo?.id;
                        const editButtonClass = isOwner ? '' : 'common_disable_button posts_detail_view_disable_button';

                        return (
                            <div className="posts_simple_view_post">
                                <p className="posts_simple_view_user">ユーザー名：{post.user.userName}</p>
                                <h3 className="posts_simple_view_title">{post.title}</h3>
                                <p>{post.content}</p>
                                <Link to={ROUTES.POST_SHOW(post.id)} className="common_button posts_simple_view_button posts_simple_view_detail_button">詳細</Link>
                                <Link to={ROUTES.POST_EDIT(post.id)} className={`common_button posts_simple_view_button posts_simple_view_edit_button ${editButtonClass}`}>編集</Link>
                                <button  onClick={() => handleDelete(post.id)} className={`common_button posts_simple_view_button posts_simple_view_delete_button ${editButtonClass}`}>削除</button>

                            </div>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default PostIndex;
