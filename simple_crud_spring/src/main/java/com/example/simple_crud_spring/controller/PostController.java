package com.example.simple_crud_spring.controller;

import com.example.simple_crud_spring.model.Post;
import com.example.simple_crud_spring.repository.PostRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/posts")
public class PostController{
    
    private final PostRepository postRepository;

    public PostController(PostRepository postRepository){
        this.postRepository = postRepository;
    }

    @GetMapping
    public List<Post> getAll(){
        return postRepository.findAll();
    }

    @PostMapping
    public Post create(@RequestBody Post post){
        return postRepository.save(post);
    }

    @GetMapping("/{id}")
    public Post getById(@PathVariable Long id){
        return postRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Post update(@PathVariable Long id, @RequestBody Post updatedPost){
        return postRepository.findById(id)
            .map(post -> {
                post.setTitle(updatedPost.getTitle());
                post.setContent(updatedPost.getContent());
                post.setUserId(updatedPost.getUserId());
                return postRepository.save(post);
            })
            .orElse(null);
    }
}
