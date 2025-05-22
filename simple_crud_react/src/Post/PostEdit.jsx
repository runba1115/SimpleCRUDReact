import { useEffect, useState } from 'react';
import { API_BASE_URL, APIS, HTTP_STATUS_CODES, MESSAGES, ROUTES } from '../config/Constant';
import { useUser } from '../contexts/UserContext';
import { useBlockIfNotLoggedIn } from '../hooks/BlockIfNotLoggedIn';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateErrorFromResponse } from '../hooks/CreateErrorFromResponse';
import { useShowErrorMessage } from '../hooks/ShowErrorMessage';
import { useBlockIfNotCreater } from '../hooks/BlockIfNotCreater';
import PostFormFields from '../components/PostFormFields';

/**
 * 投稿編集画面
 * @returns 投稿編集画面
 */
function PostEdit() {
    // URL パラメータから投稿 ID を取得
    const {id} = useParams();

    // 送信中かどうかの状態を管理。初期値は false（送信中でない）
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { userInfo } = useUser();
    const [post, setPost] = useState({
        title: '',
        content: '',
        userId: '',
    });
    const blockIfNotLoggedIn = useBlockIfNotLoggedIn();
    const blockIfNotCreater = useBlockIfNotCreater();
    const createErrorFromResponse = useCreateErrorFromResponse();
    const showErrorMessage = useShowErrorMessage();
    const navigate = useNavigate();

   /**
     * フォームの入力値が変更されたときのハンドラ
     * @param {Event} e - イベントオブジェクト
     */
    const handleChange = (e) => {
        // 変更されたフィールドの名前と値を取得する
        const { name, value } = e.target;

        // 前の状態を基に状態を更新する
        setPost(prevPost => ({ ...prevPost, [name]: value }));
    }

    /**
     * フォームが送信されたときのハンドラ
     * @param {Event} e - イベントオブジェクト
     */
    const handleSubmit = async (e) => {
        if (isSubmitting) {
            // 送信中である。中断する。
            return;
        }

        setIsSubmitting(true);

        // フォームのデフォルトの送信動作をキャンセルする
        e.preventDefault();

        try {
            // API を呼び出して投稿を更新する
            const response = await fetch(
                `${API_BASE_URL}${APIS.POST_EDIT(id)}`,
                {
                    method: 'PUT',
                    headers:
                    {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(post)
                }
            );

            if (response.ok) {
                // 更新に成功した。投稿一覧に遷移する。
                alert(MESSAGES.POST_UPDATE_SUCCESSED);
                navigate(ROUTES.POST_INDEX);
            }
            else {
                if (response.status === HTTP_STATUS_CODES.NOT_FOUND) {
                    // 更新対象の投稿が見つからなかった（削除された可能性がある）。投稿一覧に遷移する。
                    alert(MESSAGES.POST_NOT_FOUND);
                    navigate(ROUTES.POST_INDEX);
                } else {
                    // 想定外のエラーが発生した。
                    throw await createErrorFromResponse();
                }
            }
        } catch (error) {
            showErrorMessage(error, MESSAGES.POST_UPDATE_FAILED);
        }
        finally {
            // 送信完了したため送信中フラグを解除する
            setIsSubmitting(false);
        }
    }

    // 初めて表示された時の初期化処理
    useEffect(() => {
        // ログインしていない場合ブロックする
        if(blockIfNotLoggedIn()){
            // ログインしていないためブロックした。以降の処理を行わない
            return;
        }

        /**
         * 編集対象の投稿を取得する非同期関数
         */
        const fetchPost = async () => {
            try {
                // API を呼び出して投稿データを取得する
                const response = await fetch(`${API_BASE_URL}${APIS.POST_GET_BY_ID(id)}`);
                if (response.ok) {
                    // 投稿の取得に成功した場合
                    const data = await response.json();
                    // 投稿の作成者でない場合ブロックする
                    if(blockIfNotCreater(data)){
                        // ブロックしたため以降の処理を行わない
                        return ;
                    }

                    setPost(data)
                } else {
                    // 投稿の取得に失敗した場合
                    if (response.status === HTTP_STATUS_CODES.NOT_FOUND) {
                        // 更新対象の投稿が見つからなかった（削除された可能性がある）。投稿一覧に遷移する。
                        alert(MESSAGES.POST_NOT_FOUND);
                        navigate(ROUTES.POST_INDEX);
                    } else {
                        // 想定外のエラーが発生した
                        throw await createErrorFromResponse();
                    }
                }
            } catch (error) {
                showErrorMessage(error, MESSAGES.POST_UPDATE_FAILED);
            }
        };

        fetchPost();
    }, [blockIfNotLoggedIn, blockIfNotCreater,createErrorFromResponse, showErrorMessage , id, navigate, userInfo]);


    return (
        <PostFormFields
            formTitle={'投稿編集'}
            title={post.title}
            content={post.content}
            onPostChange={handleChange}
            onSubmit={handleSubmit}
            buttonLabel={"更新する"}
        />
    );
}

export default PostEdit;
