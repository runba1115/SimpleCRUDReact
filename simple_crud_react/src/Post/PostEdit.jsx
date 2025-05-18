import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function PostEdit({userId}) {
    const { id } = useParams(); // URLのパラメータ（ID）を取得する
    const navigate = useNavigate(); // 編集成功後の画面遷移に使用する
    const [post, setPost] = useState({
        title: '',
        content: '',
        userId: ''
    });

    // 初期表示時に投稿データを取得する
    useEffect(() => {
        fetch(`http://localhost:8080/api/posts/${id}`)
            .then(response => response.json())
            .then(data => {
                if(data.userId === userId)
                {
                    setPost(data)
                }
                else{
                    alert('この投稿を表示する権限がありません');
                    navigate('/posts/index');
                }
            })
            .catch(error => {
                console.error('取得エラー：', error);
                alert('投稿の取得に失敗しました')
            });
    }, [id]);

    // 入力値が変更された問いの処理
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost(prevPost => ({ ...prevPost, [name]: value }));
    };

    // フォーム送信時の処理
    const handleSubmit = (e) => {
        // ページリロードを防ぐ
        e.preventDefault();

        fetch(`http://localhost:8080/api/posts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post)
        })
            .then(response => {
                if (response.ok) {
                    alert('投稿を更新しました');
                    navigate('/posts/index');    // 更新世交互に一覧画面へ移動する
                }
                else {
                    throw new Error('更新に失敗しました');
                }
            })
            .catch(error => {
                console.error('更新エラー', error);
                alert('エラーが発生しました');
            });
    };

    return (
        <div>
            <h2>投稿編集</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>タイトル</label>
                    <input 
                        type="text" 
                        name="title"
                        value={post.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>内容</label>
                    <textarea 
                        name="content"
                        value={post.content}
                        onChange={handleChange}
                        required
                    />
                </div>
                <input
                    type="submit" 
                    value="更新する"
                />
            </form>
        </div>
    );
}

export default PostEdit;