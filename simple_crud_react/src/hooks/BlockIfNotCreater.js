import { useCallback } from "react";
import { MESSAGES, ROUTES } from "../config/Constant";
import { useUser } from "../contexts/UserContext";
import { useNavigate} from "react-router-dom";

/**
 * 未ログインの場合、機能の使用をブロック（投稿一覧に遷移）する関数を返すカスタムフック
 * @returns 未ログインの場合、機能の使用をブロック（投稿一覧に遷移）する関数
 */
export const useBlockIfNotCreater = () => {
    const {isAuthenticated, userInfo} = useUser();
    const navigate = useNavigate();

    /**
     * 投稿の作成者とログインしているユーザーが異なる場合、機能の使用をブロック（投稿一覧に遷移）する関数
     * @returns true:ブロックした false:ブロックしなかった
     */
    const blockIfNotCreater = useCallback((post) => {
        const isCreater = (isAuthenticated && userInfo != null && userInfo.id != null && post.user.id === userInfo.id);
        if(!isCreater){
            alert(MESSAGES.DONT_HAVE_PROMISSION);
            navigate(ROUTES.POST_INDEX);
            return true;
        }
        return false;
    }, [navigate]);

    return blockIfNotCreater;
}
