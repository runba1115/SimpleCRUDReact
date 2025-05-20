package com.example.simple_crud_spring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * アプリケーションのエントリーポイント（起動クラス）
 * Spring Bootがこのクラスからアプリ全体を起動する
 */
@SpringBootApplication // Spring Bootアプリとして自動構成・コンポーネントスキャンなどを有効化するアノテーション
public class SimpleCrudSpringApplication {

    /**
     * アプリケーションのメインメソッド（エントリーポイント）
     * Javaアプリの実行開始点であり、Spring Bootの起動処理を呼び出す
     *
     * @param args 実行時引数（CLIなどから渡される）
     */
    public static void main(String[] args) {
        // Spring Bootアプリケーションを起動する
        SpringApplication.run(SimpleCrudSpringApplication.class, args);
    }

}
