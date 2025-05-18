package com.example.simple_crud_spring.controller;

import com.example.simple_crud_spring.model.Post;
import com.example.simple_crud_spring.repository.PostRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostRepository postRepository;

    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping("/all")
    public List<Post> getAll() {
        System.out.println("取得開始");

        List<Post> allPosts;
        try {
            allPosts = postRepository.findAll();
            System.out.println("取得成功: " + allPosts.size() + " 件");
        } catch (Exception e) {
            System.out.println("エラー発生: " + e.getMessage());
            e.printStackTrace(); // これが一番重要です♡
            return List.of(); // 空リスト返して回避
        }

        return allPosts;
    }

    @PostMapping
    public Post create(@RequestBody Post post) {
        return postRepository.save(post);
    }

    @GetMapping("/{id}")
    public Post getById(@PathVariable Long id) {
        return postRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Post update(@PathVariable Long id, @RequestBody Post updatedPost) {
        return postRepository.findById(id)
                .map(post -> {
                    post.setTitle(updatedPost.getTitle());
                    post.setContent(updatedPost.getContent());
                    post.setUserId(updatedPost.getUserId());
                    return postRepository.save(post);
                })
                .orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        postRepository.deleteById(id);
    }
}
