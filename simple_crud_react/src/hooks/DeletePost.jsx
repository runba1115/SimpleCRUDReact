//　定数のインポートを行う
import { API_BASE_URL, APIS, MESSAGES } from "../config/Constant";

// 共通のエラー生成ユーティリティ関数をimportする
import { useCreateErrorFromResponse } from '../hooks/CreateErrorFromResponse';

/**
 * 投稿削除用のカスタムフック
 * ユーザーに確認ダイアログを表示し、OKが押されたらAPIを通じて投稿を削除する
 *
 * @returns {Function} deletePost - 引数に投稿IDを受け取り、削除処理を実行する非同期関数
 */
export const useDeletePost = () => {
    // fetchのresponseがok以外の場合に使用する、想定外の値が帰ってきた場合にErrorを作成する共通機能
    const createErrorFromResponse = useCreateErrorFromResponse();

    /**
     * 投稿削除処理を実行する非同期関数
     *
     * @param {number|string} id - 削除対象の投稿ID（数値 or 文字列）
     */
    const deletePost = async (id) => {

        // 削除確認ダイアログの表示を行う（キャンセルされたら中断）
        if (!window.confirm(MESSAGES.DELETE_CONFIRM)) {
            return;
        }

        try {
            // 指定IDの投稿に対して DELETE リクエストを送信する
            const res = await fetch(`${API_BASE_URL}${APIS.POST_DELETE(id)}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                //レスポンスが成功（200系）の場合
                alert(MESSAGES.DELETE_SUCCESSED);
            }
            else {
                //想定外のエラー応答があった場合は共通関数でErrorオブジェクト生成する
                throw await createErrorFromResponse(res);
            }
        }
        catch (error) {
            // ネットワークエラー or 明示的にthrowされたErrorをキャッチする
            alert(MESSAGES.DELETE_FAILED);
            console.error(MESSAGES.DELETE_FAILED, error);
        }
    }

    // このフックの戻り値として、削除関数そのものを返す
    return deletePost;
}