package com.example.simple_crud_spring.dto;

import java.time.LocalDateTime;

/**
 * 投稿の簡易レスポンス
 * ユーザー情報については、ユーザー情報の簡易レスポンスと同じもののみ含む
 */
public record PostResponseDto(UserResponseDto user, String title, String content, LocalDateTime createdAt,
        LocalDateTime updatedAt, LocalDateTime deletedAt) {
}