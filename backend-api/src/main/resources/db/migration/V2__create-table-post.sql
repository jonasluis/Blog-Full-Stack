CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    summary TEXT,
    content TEXT,
    cover_image_url VARCHAR(255)
);

CREATE TABLE posts_tags (
    posts_id BIGINT NOT NULL,
    tags VARCHAR(255),
    CONSTRAINT fk_posts_tags_post FOREIGN KEY (posts_id) REFERENCES posts(id) ON DELETE CASCADE
);