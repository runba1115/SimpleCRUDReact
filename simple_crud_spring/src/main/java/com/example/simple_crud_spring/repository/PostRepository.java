package com.example.simple_crud_spring.repository;

import com.example.simple_crud_spring.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long>{
    
}
