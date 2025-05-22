import { useCallback } from "react";
import { MESSAGES, ROUTES } from "../config/Constant";
import { useUser } from "../contexts/UserContext";
import { useNavigate} from "react-router-dom";

/**
 * 未ログインの場合、機能の使用をブロック（投稿一覧に遷移）する関数を返すカスタムフック
 * @returns 未ログインの場合、機能の使用をブロック（投稿一覧に遷移）する関数
 */
export const useBlockIfNotLoggedIn = () => {
    const {isAuthenticated, userInfo} = useUser();
    const navigate = useNavigate();

    /**
     * 未ログインの場合、機能の使用をブロック（投稿一覧に遷移）する関数（ブロックも行う）
     * @returns true:ブロックした false:ブロックしなかった
     */
    const blockIfNotLoggedIn = useCallback(() => {
        const isUserLoggedIn  = (isAuthenticated && userInfo != null && userInfo.id != null);
        if(!isUserLoggedIn){
            alert(MESSAGES.CANT_USE_FUNCTION_DUE_TO_NOT_LOGGED_IN);
            navigate(ROUTES.POST_INDEX);
            return true;
        }
        return false;
    }, [navigate, isAuthenticated, userInfo]);

    return blockIfNotLoggedIn;
}
