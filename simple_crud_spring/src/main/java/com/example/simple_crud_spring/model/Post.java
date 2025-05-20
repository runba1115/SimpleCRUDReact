package com.example.simple_crud_spring.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * 投稿データを表すエンティティクラス
 * DB上の posts テーブルとマッピングされる
 * タイトル・本文・投稿者・作成日時・更新日時・論理削除日時を持つ
 */
@Entity // このクラスがJPAエンティティであることを示す
@Table(name = "posts")
@SQLDelete(sql = "UPDATE posts SET deleted_at = NOW() WHERE id = ?") // delete実行時に物理削除せず、deleted_at を更新する
@SQLRestriction("deleted_at IS NULL") // 通常のSELECT時に deleted_at がNULLのデータだけ取得されるよう制限
public class Post {

    /** 投稿のID（主キー） */
    @Id // 主キーであることを示す
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 自動採番する
    private Long id;

    /** 投稿者（Userエンティティと多対一で紐づく） */
    @NotNull(message = "ユーザーIDを空にはできません（ログインしていますか？）")
    @ManyToOne // 多対一のリレーション（投稿：ユーザー = 多：1）
    @JoinColumn(name = "user_id") // 外部キーとして user_id カラムと結びつける
    private User user;

    /** 投稿タイトル（255文字以内、空文字不可） */
    @NotBlank(message = "タイトルの長さを0文字にはできません")
    @Size(max = 255, message = "タイトルは255文字以内で入力してください")
    @Column(nullable = false, length = 255)
    private String title;

    /** 投稿本文（空文字不可） */
    @Lob // 文章量が多くても保存できるようにする（DBでは TEXT 型）
    @Column(nullable = false, columnDefinition = "TEXT") // DBでは明示的にTEXT型
    private String content;

    /** 作成日時（初回保存時に自動設定） */
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /** 更新日時（保存や更新時に自動更新） */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /** 削除日時（論理削除時に設定される） */
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    /** 新規作成時に createdAt・updatedAt を現在時刻で初期化 */
    @PrePersist // エンティティが初めて保存される直前に実行される処理
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /** 更新時に updatedAt を現在時刻に更新する */
    @PreUpdate // エンティティが更新される直前に実行される処理
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // --- 以下、ゲッター・セッター群（ID以外は書き換え可能） ---

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

}
