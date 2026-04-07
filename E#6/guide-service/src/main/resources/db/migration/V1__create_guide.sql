CREATE TABLE guide (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    display_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(64),
    home_location VARCHAR(255)
);
