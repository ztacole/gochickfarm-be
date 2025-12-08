CREATE TABLE `animals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tag` varchar(100) NOT NULL,
	`species_id` int NOT NULL,
	`birthdate` date NOT NULL,
	`sex` enum('Jantan','Betina') NOT NULL,
	`weight` double NOT NULL,
	`status` enum('Hidup','Mati','Terjual') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `animals_id` PRIMARY KEY(`id`),
	CONSTRAINT `animals_tag_unique` UNIQUE(`tag`)
);

CREATE TABLE `breeding_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`male_id` int NOT NULL,
	`female_id` int NOT NULL,
	`mating_date` date NOT NULL,
	`offspring_count` int NOT NULL DEFAULT 0,
	`user_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `breeding_logs_id` PRIMARY KEY(`id`)
);

CREATE TABLE `feeding_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`animal_id` int NOT NULL,
	`feed_id` int NOT NULL,
	`quantity` double NOT NULL,
	`new_weight` double NOT NULL,
	`health_notes` text NOT NULL,
	`user_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `feeding_logs_id` PRIMARY KEY(`id`)
);

CREATE TABLE `feeds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`quantity` double NOT NULL,
	`price_per_unit` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `feeds_id` PRIMARY KEY(`id`)
);

CREATE TABLE `roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	CONSTRAINT `roles_id` PRIMARY KEY(`id`)
);

CREATE TABLE `species` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	CONSTRAINT `species_id` PRIMARY KEY(`id`)
);

CREATE TABLE `transaction_details` (
	`id` int AUTO_INCREMENT NOT NULL,
	`header_id` int NOT NULL,
	`animal_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transaction_details_id` PRIMARY KEY(`id`)
);

CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`description` varchar(255) NOT NULL,
	`type` enum('Pemasukan','Pengeluaran') NOT NULL,
	`total` int NOT NULL,
	`date` datetime NOT NULL,
	`user_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);

CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`role_id` int NOT NULL,
	`session_id` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);

ALTER TABLE `animals` ADD CONSTRAINT `animals_species_id_species_id_fk` FOREIGN KEY (`species_id`) REFERENCES `species`(`id`) ON DELETE cascade ON UPDATE cascade;
ALTER TABLE `breeding_logs` ADD CONSTRAINT `breeding_logs_male_id_animals_id_fk` FOREIGN KEY (`male_id`) REFERENCES `animals`(`id`) ON DELETE cascade ON UPDATE cascade;
ALTER TABLE `breeding_logs` ADD CONSTRAINT `breeding_logs_female_id_animals_id_fk` FOREIGN KEY (`female_id`) REFERENCES `animals`(`id`) ON DELETE cascade ON UPDATE cascade;
ALTER TABLE `breeding_logs` ADD CONSTRAINT `breeding_logs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;
ALTER TABLE `feeding_logs` ADD CONSTRAINT `feeding_logs_animal_id_animals_id_fk` FOREIGN KEY (`animal_id`) REFERENCES `animals`(`id`) ON DELETE cascade ON UPDATE cascade;
ALTER TABLE `feeding_logs` ADD CONSTRAINT `feeding_logs_feed_id_feeds_id_fk` FOREIGN KEY (`feed_id`) REFERENCES `feeds`(`id`) ON DELETE cascade ON UPDATE cascade;
ALTER TABLE `feeding_logs` ADD CONSTRAINT `feeding_logs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;
ALTER TABLE `transaction_details` ADD CONSTRAINT `transaction_details_header_id_transactions_id_fk` FOREIGN KEY (`header_id`) REFERENCES `transactions`(`id`) ON DELETE cascade ON UPDATE cascade;
ALTER TABLE `transaction_details` ADD CONSTRAINT `transaction_details_animal_id_animals_id_fk` FOREIGN KEY (`animal_id`) REFERENCES `animals`(`id`) ON DELETE cascade ON UPDATE cascade;
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE cascade;