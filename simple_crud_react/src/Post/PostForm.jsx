// src/PostForm.jsx
import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { API_BASE_URL } from '../config/Constant';
import PostFormFields from '../components/PostFormFields';

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
            const response = await fetch(`${API_BASE_URL}/api/posts`, {
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
        <PostFormFields 
            formTitle="新規投稿" 
            title={title} 
            content={content} 
            onTitleChange={(e)=> setTitle(e.target.value)} 
            onContentChange={(e) => setContent(e.target.value)} 
            onSubmit={handleSubmit}
            buttonLabel="投稿する"
        />
    );
}

export default PostForm;