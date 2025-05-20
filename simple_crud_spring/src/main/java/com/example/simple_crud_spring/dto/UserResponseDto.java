package com.example.simple_crud_spring.dto;

/**
 * ユーザー情報の簡易レスポンス
 * 認証されたユーザーの最小限の情報のみを含む
 *
 * @param id    ユーザーID
 * @param email メールアドレス
 */
public record UserResponseDto(Long id, String email) {
}