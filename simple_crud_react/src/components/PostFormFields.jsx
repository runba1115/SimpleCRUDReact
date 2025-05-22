/**
 * 投稿作成（もしくは編集）画面の
 * @param {String} formTitle フォームのタイトル
 * @param {String} title 投稿のタイトルを入力するテキストボックスに表示する値
 * @param {String} content 投稿の内容を入力するテキストボックスに表示する値
 * @param {Function} onPostChange 投稿（タイトル、内容の両方）が変更されたときに更新するための関数
 * @param {Function} onSubmit フォームを送信するボタンクリック時の関数
 * @param {String} buttonLabel フォームを送信するボタンに表示する文字列
 * @returns 
 */
function PostFormFields({ formTitle, title, content, onPostChange, onSubmit, buttonLabel }) {
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
                        onChange={onPostChange}
                    />
                </div>
                <div>
                    <label>内容:</label>
                    <textarea
                        value={content}
                        name="content"
                        onChange={onPostChange}
                    />
                </div>
                <button type="submit">{buttonLabel}</button>
            </form>
        </div>
    );
}

export default PostFormFields;
