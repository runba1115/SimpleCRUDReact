import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { API_BASE_URL, APIS, MESSAGES, ROUTES } from "../config/Constant";
import { useNavigate } from 'react-router-dom';
import PostFormFields from "../components/PostFormFields";
import { useCreateErrorFromResponse } from "../hooks/CreateErrorFromResponse";
import { useBlockIfNotLoggedIn } from "../hooks/BlockIfNotLoggedIn";
import { useShowErrorMessage } from "../hooks/ShowErrorMessage";

/**
 * 新規投稿作成ページ
 * @returns 新規投稿作成ページ
 */
function PostNew() {
    const { userInfo, isAuthenticated } = useUser();
    const [post, setPost] = useState({
        title: '',
        content: '',
        userId: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const createErrorFromResponse = useCreateErrorFromResponse();
    const showErrorMessage = useShowErrorMessage();
    const blockIfNotLoggedIn = useBlockIfNotLoggedIn();

    /**
     * 初回レンダリング時の処理
     * - 未ログインの場合、投稿フォームへのアクセスをブロック
     * - ユーザーIDを投稿データに設定
     */
    useEffect(()=>{
        blockIfNotLoggedIn();
        if(userInfo?.id != null){
            setPost(prevPost => ({...prevPost, userId: userInfo.id}));
        }
    },[blockIfNotLoggedIn, userInfo]);

    /**
     * 入力フォームの値を変更する処理
     * - フォームの入力値をリアルタイムで状態に反映
     * @param {Object} e イベントオブジェクト
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        // prevPostには変更前の値が入る。変更対象の値のみ変更する。
        setPost(prevPost => ({ ...prevPost, [name]: value }));
    }

    /**
     * フォーム送信
     * @param {Object} e イベントオブジェクト
     */
    const handleSubmit = async (e) => {
        // 投稿を送信中の場合、以降の処理を行わない。
        if (isSubmitting) {
            return;
        }

        // 重複して行われないよう、投稿送信中フラグをtrueに設定
        setIsSubmitting(true);

        // デフォルトのフォーム送信動作（ページリロード）を無効化
        e.preventDefault();

        try {
            // APIに投稿のデータを送信する
            const response = await fetch(
                `${API_BASE_URL}${APIS.POST_CREATE}`,
                {
                    method: 'POST',
                    headers:
                    {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(post),
                }
            );

            if (response.ok) {
                // 投稿の作成に成功した。その旨を表示し、投稿一覧に遷移する。
                alert(MESSAGES.POST_CREATE_SUCCESSED);
                navigate(ROUTES.POST_INDEX);
            } else {
                // 想定外の例外が発生した
                throw await createErrorFromResponse(response);
            }
        } catch (error) {
            // ネットワークエラーまたはサーバーエラーをキャッチ
            showErrorMessage(error, MESSAGES.POST_CREATE_FAILED)
        } finally{
            // 投稿送信中フラグをfalseにリセット
            setIsSubmitting(false);
        }
    }

    return (
        <PostFormFields
            formTitle={'新規投稿'}
            title={post.title}
            content={post.content}
            onPostChange={handleChange}
            onSubmit={handleSubmit}
            buttonLabel={"投稿する"}
        />
    );
}

export default PostNew;
