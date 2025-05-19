import { useCallback } from "react";
import { API_BASE_URL } from "../config/Constant";

export function useDeletePost(onSuccess) {
    const deletePost = useCallback((id) => {
        if (!window.confirm("本当に削除しますか？")) return;

        fetch(`${API_BASE_URL}/api/posts/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                if(onSuccess) onSuccess(id);
            })
            .catch(error => {
                console.error("削除失敗：", error);
                window.alert("削除に失敗しました");
            })
    }, [onSuccess]);

    return deletePost;
}