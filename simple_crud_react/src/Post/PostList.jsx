import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDeletePost } from '../hooks/DeletePost';
import { UserContext } from '../contexts/UserContext';
import { API_BASE_URL } from '../config/Constant';

function PostList() {
    const {userInfo} = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const deletePost = useDeletePost((id) => {
        setPosts(posts.filter(post => post.id !== id));
    });

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/posts/all`)
            .then(response => response.json())
            .then(data => {
                if (!Array.isArray(data)) {
                    console.error("予期しないデータ形式:", data);
                    alert("投稿一覧の取得に失敗しました");
                    return;
                }
                setPosts(data);
            })
            .catch(error => {
                console.error('取得エラー:', error);
                alert('投稿の取得に失敗しました');
            });
    }, []);

    return (
        <div>
            <Link to={`/posts/new`}>新規作成</Link>
            <h2>投稿一覧</h2>
            {posts.length === 0 ? (
                <p>投稿がまだありません</p>
            ) : (
                <ul>
                    {posts.map(post => {
                        const isOwner = post.user.id == userInfo?.id;
                        const buttonStyle = {
                            color: isOwner ? 'blue' : 'gray',
                        };

                        return (<li key={post.id}>
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                            <small>投稿者ID: {post.userId}</small>
                            <Link to={`/posts/show/${post.id}`} style={buttonStyle}>詳細</Link>
                            <Link to={`/posts/edit/${post.id}`} style={buttonStyle}>編集</Link>
                            <button onClick={() => deletePost(post.id)}>削除</button>
                        </li>);
                    })}
                </ul>
            )}
        </div>
    );
}

export default PostList;