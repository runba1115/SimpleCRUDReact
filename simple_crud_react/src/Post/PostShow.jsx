import React, { useEffect, useState } from 'react'; // Reactの基本機能とフックを読み込み
import { useParams, useNavigate } from 'react-router-dom';       // URLパラメータ（id）取得のためのフック
import { Link } from 'react-router-dom';
import { useDeletePost } from '../hooks/DeletePost';
import { API_BASE_URL } from '../config/Constant';

function PostShow() {
    // URLの /posts/show/:id に含まれる「id」を取得
    const { id } = useParams();
    const navigate = useNavigate();
    const deletePost = useDeletePost(() => {
        navigate('/posts');
    });

    // 投稿データを格納するstate（最初はnull）
    const [post, setPost] = useState(null);

    // ページが表示されたとき（初回レンダリング時）に一度だけ実行
    useEffect(() => {
        // Spring BootのAPIから該当idの投稿を取得
        fetch(`${API_BASE_URL}/api/posts/${id}`)
            .then(response => response.json())   // JSONデータとして解釈
            .then(data => setPost(data))         // 取得したデータを state に保存
            .catch(error => {
                console.error('詳細取得エラー:', error);  // エラーをコンソール出力
                alert('投稿の詳細取得に失敗しました');     // ユーザーにエラー通知
            });
    }, [id]); // idが変わったときにも再取得される

    // データがまだ来ていないときの仮表示
    if (!post) return <p>読み込み中...</p>;

    // データが取得できていれば、画面に表示
    return (
        <div>
            <Link to={`/posts/index`}>一覧に戻る</Link>
            <h2>投稿詳細</h2>
            <p><strong>タイトル:</strong> {post.title}</p>
            <p><strong>内容:</strong> {post.content}</p>
            <p><strong>ユーザーID:</strong> {post.userId}</p>
            <p><strong>作成日時:</strong> {post.createdAt}</p>
            <p><strong>更新日時:</strong> {post.updatedAt || 'なし'}</p>
            <p><strong>削除日時:</strong> {post.deletedAt || 'なし'}</p>
            <button onClick={()=> deletePost(post.id)}></button>

        </div>
    );
}

export default PostShow; // 他のファイルから読み込めるようにエクスポート