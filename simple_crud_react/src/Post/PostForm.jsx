// src/PostForm.jsx
import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

function PostForm() {
    const { userInfo, isAuthenticated, } = useContext(UserContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate(); // 成功後に画面遷移するためのフック

    useEffect(() => {
        if(!isAuthenticated || !userInfo){
            alert("未ログインです。ログインしてください。");
            navigate("/posts/index");
        }
    },[isAuthenticated, userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // APIにPOST
        try {
            const response = await fetch('http://localhost:8080/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content, userId: userInfo.id }),
            });

            if (!response.ok) {
                if(response.status === 400){
                    const messages = await response.json();
                    alert(messages.join('\n'));
                }else{
                    throw new Error("投稿に失敗しました");
                }
                return;
            }

            // 成功したら一覧ページにリダイレクト
            navigate('/posts/index');
            alert("投稿が完了しました");
        } catch (error) {
            console.error(error);
            alert('エラーが発生しました');
        }
    };

    return (
        <div>
            <h2>新規投稿</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>タイトル:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label>内容:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <button type="submit">投稿する</button>
            </form>
        </div>
    );
}

export default PostForm;