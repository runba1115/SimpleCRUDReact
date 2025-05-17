package com.example.simple_crud_spring.repository;

import com.example.simple_crud_spring.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long>{
    // 基底クラスのJpaRepositoryの機能を使用して
    // 基本的なIDを用いた値の取得および削除、すべてのデータの取得が行えるため、
    // このクラスに特別な実装は行わない
    // ※今後、機能を拡張するにあたり必要である可能性があるため、作成したのみ
}
