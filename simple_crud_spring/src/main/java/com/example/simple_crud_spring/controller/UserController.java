package com.example.simple_crud_spring.controller;

import com.example.simple_crud_spring.dto.UserResponseDto;
import com.example.simple_crud_spring.model.User;
import com.example.simple_crud_spring.repository.UserRepository;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * ユーザー関連の操作を提供するRESTコントローラ
 * 下記の機能を持つ
 * ・新規ユーザー登録
 * ・ログイン中のユーザー情報取得
 * ※ログイン機能はSpring Security の機能（/login）に任せるので特別なコードは不要
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * 新しいユーザーを登録する。
     * すでに登録されたメールアドレスが存在する場合は登録を拒否する。
     *
     * @param user 登録対象のユーザー情報（バリデーション付き）
     * @return 登録されたユーザーのIDとメールアドレスを含むレスポンス（ステータスコード200）
     * @throws IllegalArgumentException メールアドレスが既に登録されている場合
     */
    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> register(@Valid @RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("このメールアドレスは既に使われています");
        }

        // パスワードをハッシュ化する
        user.setPassword(passwordEncoder.encode(user.getPassword())); // パスワードをハッシュ化

        // 保存を実行する
        User savedUser = userRepository.save(user);
        UserResponseDto userResponse = new UserResponseDto(savedUser.getId(), savedUser.getEmail(),
                savedUser.getUserName());

        return ResponseEntity.ok(userResponse);
    }

    /**
     * 現在ログイン中のユーザー情報を取得する
     *
     * @param authentication Spring Securityによって注入されるログイン済みユーザーの認証情報
     * @return ログイン済みユーザーのIDとメールアドレスを含むレスポンス（ステータスコード200）
     *         未認証の場合は 401 Unauthorized を返す
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser(Authentication authentication) {
        // ユーザーがログインしていない場合（認証情報がない or 未認証）、401 Unauthorized を返す
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 認証されている場合は、認証情報からログインユーザー（Userオブジェクト）を取得する
        User user = (User) authentication.getPrincipal();

        // 上記のままではパスワードのような、使用しない情報も含まれている。
        // ユーザーIDとメールアドレスだけを返す簡易レスポンスを作成して返す
        UserResponseDto response = new UserResponseDto(user.getId(), user.getEmail(), user.getUserName());
        return ResponseEntity.ok(response);
    }
}
