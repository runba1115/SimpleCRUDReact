import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { API_BASE_URL } from '../config/Constant';
import PostFormFields from '../components/PostFormFields';

function PostEdit() {
    const { isAuthenticated, userInfo } = useContext(UserContext);
    const { id } = useParams(); // URLのパラメータ（ID）を取得する
    const navigate = useNavigate(); // 編集成功後の画面遷移に使用する
    const [post, setPost] = useState({
        title: '',
        content: '',
        userId: ''
    });

    // 初期表示時に投稿データを取得する
    useEffect(() => {
        if (!isAuthenticated) {
            alert("未ログインです");
            navigate("/posts/index");
        }

        const fetchPost = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/posts/${id}`);
                const data = await response.json();
                if (data.userId == userInfo.id) {
                    setPost(data);
                } else {
                    alert("この投稿を表示する権限がありません");
                    navigate("/posts/index");
                }
            }
            catch (error) {
                console.error('取得エラー：', error);
                alert('投稿の取得に失敗しました');
                navigate("/posts/index");
            }
        };

        fetchPost();
    }, [id, userInfo]);

    // 入力値が変更された問いの処理
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost(prevPost => ({ ...prevPost, [name]: value }));
    };

    // フォーム送信時の処理
    const handleSubmit = async (e) => {
        // ページリロードを防ぐ
        e.preventDefault();

        const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post)
        });

        if (response.ok) {
            alert('投稿を更新しました');
            navigate('/posts/index');    // 更新世交互に一覧画面へ移動する
        }
        else {
            if (response.status === 400) {
                // バリデーションエラー
                const messages = await response.json();
                alert(messages.join("\n"));
            } else {
                throw new Error("更新に失敗しました");
            }
        }
    };

    return (
        <PostFormFields 
            formTitle="投稿編集" 
            title={post.title} 
            content={post.content} 
            onTitleChange={handleChange} 
            onContentChange={handleChange} 
            onSubmit={handleSubmit}
            buttonLabel="投稿する"
        />
        // <div>
        //     <h2>投稿編集</h2>
        //     <form onSubmit={handleSubmit}>
        //         <div>
        //             <label>タイトル</label>
        //             <input
        //                 type="text"
        //                 name="title"
        //                 value={post.title}
        //                 onChange={handleChange}
        //             />
        //         </div>
        //         <div>
        //             <label>内容</label>
        //             <textarea
        //                 name="content"
        //                 value={post.content}
        //                 onChange={handleChange}
        //                 required
        //             />
        //         </div>
        //         <input
        //             type="submit"
        //             value="更新する"
        //         />
        //     </form>
        // </div>
    );
}

export default PostEdit;