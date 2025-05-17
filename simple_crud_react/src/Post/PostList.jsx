import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';

function PostList() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/posts')
            .then(response => response.json())
            .then(data => setPosts(data))
            .catch(error => {
                console.error('取得エラー:', error);
                alert('投稿の取得に失敗しました');
            });
    }, []);

    return (
        <div>
            <h2>投稿一覧</h2>
            {posts.length === 0 ? (
                <p>投稿がまだありません</p>
            ) : (
                <ul>
                    {posts.map(post => (
                        <li key={post.id}>
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                            <small>投稿者ID: {post.userId}</small>
                            <Link to={`/posts/show/${post.id}`}>詳細</Link>
                            <Link to={`/posts/edit/${post.id}`}>編集</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PostList;