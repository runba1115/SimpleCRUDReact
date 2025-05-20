package com.example.simple_crud_spring.dto;

/**
 * バリデーションエラーなどのフィールドごとのエラー情報を表すレスポンスDTO
 *
 * @param field   エラーが発生した対象のフィールド名
 * @param message エラーメッセージの内容
 */
public record ErrorResponseDto(String field, String message) {
}