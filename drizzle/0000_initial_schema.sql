CREATE TABLE `resources` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `title` text NOT NULL,
  `url` text NOT NULL,
  `condition_slug` text,
  `category` text NOT NULL,
  `description` text NOT NULL,
  `submitter_name` text NOT NULL,
  `submitter_email` text NOT NULL,
  `status` text DEFAULT 'pending' NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE `subscribers` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `email` text NOT NULL,
  `subscribed_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE `contacts` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `message` text NOT NULL,
  `status` text DEFAULT 'new' NOT NULL,
  `created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX `subscribers_email_unique` ON `subscribers` (`email`);
