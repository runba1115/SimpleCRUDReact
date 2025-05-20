package com.example.simple_crud_spring.dto;

/**
 * 投稿作成時にクライアント（フロントエンド）から送られてくるデータを受け取るDTO
 * title・content・userId を含み、Controller で受け取って Entity に変換される前段階のデータ構造
 * ※投稿作成時にPostクラスの変数（バリデーション付き）に値を格納するため、ここではバリデーションを設定しない
 */
public class PostRequestDto {
    /** 投稿のタイトル */
    public String title;

    /** 投稿の本文 */
    public String content;

    /** 投稿を行ったユーザーのID（投稿者ID） */
    public Long userId;
}