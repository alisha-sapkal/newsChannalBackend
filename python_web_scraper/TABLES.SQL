CREATE TABLE news (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ArticleId VARCHAR(255) UNIQUE NOT NULL,
    Title TEXT,
    Description TEXT,
    Sphoto TEXT,
    Lphoto TEXT,
    Type VARCHAR(50),
    Source VARCHAR(50),
    SourceLink VARCHAR(50),
    Link VARCHAR(255),
    Deleted BOOLEAN DEFAULT FALSE,
    created_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    image TEXT,
    provider VARCHAR(100) NOT NULL,
    provider_id VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'subscriber',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    bio TEXT,
    location VARCHAR(255),
    website VARCHAR(255)
);
