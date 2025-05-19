package com.example.simple_crud_spring.controller;

import com.example.simple_crud_spring.model.User;
import com.example.simple_crud_spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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

    // ① ユーザー作成
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword())); // パスワードをハッシュ化
        return userRepository.save(user);
    }

    // ② ログインは Spring Security の機能（/login）に任せるので特別なコードは不要

    // ③ ログインしているユーザー情報の取得
    @GetMapping("/me")
    public Object getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        User user = (User) authentication.getPrincipal();
        return new UserResponse(user.getId(), user.getEmail());
    }

    private record UserResponse(Long id, String email) {
    }
}
