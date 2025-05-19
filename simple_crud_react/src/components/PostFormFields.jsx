import React from 'react';

function PostFormFields({ formTitle, title, content, onTitleChange, onContentChange, onSubmit, buttonLabel }) {
    return (
        <div>
            <h2>{formTitle}</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label>タイトル:</label>
                    <input
                        type="text"
                        value={title}
                        name="title"
                        onChange={onTitleChange}
                    />
                </div>
                <div>
                    <label>内容:</label>
                    <textarea
                        value={content}
                        name="content"
                        onChange={onContentChange}
                    />
                </div>
                <button type="submit">{buttonLabel}</button>
            </form>
        </div>
    );
}

export default PostFormFields;