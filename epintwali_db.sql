-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 02, 2026 at 04:50 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `epintwali_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `calendarevents`
--

CREATE TABLE `calendarevents` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date` date NOT NULL,
  `type` enum('Exam','Holiday','Event','Other') DEFAULT 'Event',
  `createdBy` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `startTime` varchar(255) DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `homework`
--

CREATE TABLE `homework` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `grade` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `dueDate` date NOT NULL,
  `fileUrl` varchar(255) DEFAULT NULL,
  `teacherId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `homework`
--

INSERT INTO `homework` (`id`, `title`, `description`, `grade`, `subject`, `dueDate`, `fileUrl`, `teacherId`, `createdAt`, `updatedAt`) VALUES
(1, 'fghj', 'cvbnm,', 'Grade 2', 'General', '2026-02-24', '/uploads/homework/1769981514519-S.pdf', 3, '2026-02-01 21:31:54', '2026-02-01 21:31:54'),
(2, '1234', 'hhhhhhhh', 'Grade 2', 'Social Studies', '2026-02-12', '/uploads/homework/1769985579889-(B07D23CFGR)_James_Clear_-_Atomic_Habits-Random_House_Business_Books_(2018).pdf', 3, '2026-02-01 22:39:40', '2026-02-01 22:39:40'),
(3, 'trtr', 'rtrtr', 'Grade 1', 'Sport', '2026-02-19', '/uploads/homework/1769999816594-Student_Report_2026.pdf', 3, '2026-02-02 02:36:56', '2026-02-02 02:36:56');

-- --------------------------------------------------------

--
-- Table structure for table `marks`
--

CREATE TABLE `marks` (
  `id` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `teacherId` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `marks` float DEFAULT 0,
  `term` varchar(255) DEFAULT 'Term 1',
  `academicYear` varchar(255) DEFAULT '2026',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `type` enum('CAT','Exam') DEFAULT 'CAT',
  `maxScore` int(11) NOT NULL DEFAULT 100
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `marks`
--

INSERT INTO `marks` (`id`, `studentId`, `teacherId`, `subject`, `marks`, `term`, `academicYear`, `createdAt`, `updatedAt`, `type`, `maxScore`) VALUES
(5, 2, 3, 'General', 50, 'Term 1', '2026', '2026-02-01 22:29:05', '2026-02-01 23:26:55', 'Exam', 77),
(6, 2, 3, 'Mathematics', 12, 'Term 1', '2026', '2026-02-01 22:44:26', '2026-02-01 22:44:26', 'CAT', 100),
(7, 2, 3, 'English', 12, 'Term 1', '2026', '2026-02-01 22:47:00', '2026-02-01 22:47:00', 'Exam', 100),
(8, 2, 3, 'Art and Craft', 12, 'Term 1', '2026', '2026-02-01 23:00:37', '2026-02-01 23:00:37', 'CAT', 100),
(9, 2, 3, 'Sport', 30, 'Term 1', '2026', '2026-02-02 02:36:19', '2026-02-02 02:36:19', 'Exam', 100);

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category` enum('News','Event','Announcement') DEFAULT 'News',
  `authorId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `syllabuses`
--

CREATE TABLE `syllabuses` (
  `id` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `grade` varchar(255) NOT NULL,
  `fileUrl` varchar(255) NOT NULL,
  `teacherId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `syllabuses`
--

INSERT INTO `syllabuses` (`id`, `subject`, `grade`, `fileUrl`, `teacherId`, `createdAt`, `updatedAt`) VALUES
(1, '', '', '/uploads/syllabi/1769932110593-weer.pdf', 3, '2026-02-01 07:48:30', '2026-02-01 07:48:30'),
(2, '', 'Grade 4', '/uploads/syllabi/1769932679910-weer.pdf', 3, '2026-02-01 07:57:59', '2026-02-01 07:57:59'),
(3, '', 'Grade 6', '/uploads/syllabi/1769935162225-weer.pdf', 11, '2026-02-01 08:39:22', '2026-02-01 08:39:22'),
(4, '', 'Grade 2', '/uploads/syllabi/1769971785139-PDF_Phoenix_20251218_110655_(3).pdf', 11, '2026-02-01 18:49:45', '2026-02-01 18:49:45'),
(5, '', 'Grade 2', '/uploads/syllabi/1769972612009-DOC-20251217-WA0014..pdf', 11, '2026-02-01 19:03:32', '2026-02-01 19:03:32'),
(6, '', 'Grade 1', '/uploads/syllabi/1769972845007-DOC-20251217-WA0014..pdf', 11, '2026-02-01 19:07:25', '2026-02-01 19:07:25'),
(7, '', 'Grade 2', '/uploads/syllabi/1769980658447-S.pdf', 3, '2026-02-01 21:17:38', '2026-02-01 21:17:38'),
(8, 'General', 'Grade 2', '/uploads/syllabi/1769981386233-S.pdf', 3, '2026-02-01 21:29:46', '2026-02-01 21:29:46'),
(9, 'Kinyarwanda', 'Grade 2', '/uploads/syllabi/1769984874909-ABIINEZA_MOISE_,224001282_MEE_YEAR_2,1.pdf', 3, '2026-02-01 22:27:54', '2026-02-01 22:27:54'),
(10, 'Science', 'Grade 2', '/uploads/syllabi/1769985517198-ABINEZA_MOISE,224001282_MEE_YEAR_2_1.pdf', 3, '2026-02-01 22:38:37', '2026-02-01 22:38:37'),
(11, 'Mathematics', 'Grade 2', '/uploads/syllabi/1769985540449-S.pdf', 3, '2026-02-01 22:39:00', '2026-02-01 22:39:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `regNumber` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','manager','teacher','student') NOT NULL,
  `grade` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `regNumber`, `password`, `role`, `grade`, `subject`, `createdAt`, `updatedAt`) VALUES
(1, 'System Admin', 'admin@gmail.com', NULL, '$2b$10$odtJM8mfDAuQab1wnQxRvu/a4qsMEQOCKw7rEmaBUQzxwuP6fbhrG', 'admin', NULL, NULL, '2026-02-01 20:41:12', '2026-02-01 20:41:12'),
(2, 'student1', '26EPI0001@epintwali.edu.rw', '26EPI0001', '$2b$10$e1KUuOBFlBOwnC9xBmVB/uyEoJgJLCc/y5SoNx3D6gWbe8mYtS9VS', 'student', 'Grade 2', 'General', '2026-02-01 21:02:51', '2026-02-01 21:02:51'),
(3, 'cedro', 'tr@gmail.com', NULL, '$2b$10$Rq5l/j3rBLQcaE8bKJmnre07s1guAHk613HVT3IYeIFleROZcVZyS', 'teacher', 'Grade 1', 'General', '2026-02-01 21:04:02', '2026-02-01 21:04:02'),
(4, 'cetone', 'sm@gmail.com', NULL, '$2b$10$lMtTdty69om3uczCWt4CsOnRm.HDh2OqtNJEmjwXWxzqtjlQJX1ym', 'manager', 'Grade 1', 'General', '2026-02-01 21:04:23', '2026-02-01 21:04:23'),
(5, 'student 2', '26EPI0002@epintwali.edu.rw', '26EPI0002', '$2b$10$3ihumq5TW7VUJWVy7k0f9.9S5h/.XVmvX5IcpD/70wYgNZ5HAUwPu', 'student', 'Grade 4', 'General', '2026-02-02 02:52:20', '2026-02-02 02:52:20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `calendarevents`
--
ALTER TABLE `calendarevents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `homework`
--
ALTER TABLE `homework`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `marks`
--
ALTER TABLE `marks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `studentId` (`studentId`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `syllabuses`
--
ALTER TABLE `syllabuses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `regNumber` (`regNumber`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `regNumber_2` (`regNumber`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `regNumber_3` (`regNumber`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `regNumber_4` (`regNumber`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `regNumber_5` (`regNumber`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `regNumber_6` (`regNumber`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `regNumber_7` (`regNumber`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `regNumber_8` (`regNumber`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `regNumber_9` (`regNumber`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `regNumber_10` (`regNumber`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `regNumber_11` (`regNumber`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `regNumber_12` (`regNumber`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `regNumber_13` (`regNumber`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `regNumber_14` (`regNumber`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `regNumber_15` (`regNumber`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `regNumber_16` (`regNumber`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `regNumber_17` (`regNumber`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `regNumber_18` (`regNumber`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `regNumber_19` (`regNumber`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `regNumber_20` (`regNumber`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `regNumber_21` (`regNumber`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `regNumber_22` (`regNumber`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `regNumber_23` (`regNumber`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `regNumber_24` (`regNumber`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `regNumber_25` (`regNumber`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `regNumber_26` (`regNumber`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `regNumber_27` (`regNumber`),
  ADD UNIQUE KEY `regNumber_28` (`regNumber`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `regNumber_29` (`regNumber`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `regNumber_30` (`regNumber`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `calendarevents`
--
ALTER TABLE `calendarevents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `exams`
--
ALTER TABLE `exams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `homework`
--
ALTER TABLE `homework`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `marks`
--
ALTER TABLE `marks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `syllabuses`
--
ALTER TABLE `syllabuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `marks`
--
ALTER TABLE `marks`
  ADD CONSTRAINT `marks_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
