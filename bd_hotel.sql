-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: db_mysql:3306
-- Tiempo de generación: 17-04-2024 a las 07:14:19
-- Versión del servidor: 8.3.0
-- Versión de PHP: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bd_hotel`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `building`
--

CREATE TABLE `building` (
  `bld_id` varchar(100) NOT NULL,
  `bld_name` varchar(100) DEFAULT NULL,
  `bld_address` varchar(100) DEFAULT NULL,
  `bld_floors` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `building`
--

INSERT INTO `building` (`bld_id`, `bld_name`, `bld_address`, `bld_floors`) VALUES
('BLD00', 'Ciudad del Viento', 'Av. Colombia 542', 3),
('BLD01', 'Ciudad del Sol', 'Av. Peru 542', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contracts`
--

CREATE TABLE `contracts` (
  `contract_id` varchar(100) NOT NULL,
  `user_id` varchar(100) DEFAULT NULL,
  `contract_start_date` date DEFAULT NULL,
  `contract_end_date` date DEFAULT NULL,
  `payment_day` int DEFAULT NULL,
  `rent_amount` decimal(10,2) DEFAULT NULL,
  `warranty` decimal(10,2) DEFAULT NULL,
  `has_wifi` tinyint(1) DEFAULT NULL,
  `wifi_cost` decimal(10,2) DEFAULT NULL,
  `rooms_id` varchar(100) DEFAULT NULL,
  `contract_photo` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `contracts`
--

INSERT INTO `contracts` (`contract_id`, `user_id`, `contract_start_date`, `contract_end_date`, `payment_day`, `rent_amount`, `warranty`, `has_wifi`, `wifi_cost`, `rooms_id`, `contract_photo`, `active`) VALUES
('CRT00', '54654fe65d65fd4', '2024-04-01', '2025-04-01', NULL, 800.00, 400.00, 1, 80.00, 'RMS00', NULL, 1),
('CRT01', '54654fe65d65fd4', '2024-05-01', '2025-05-01', NULL, 800.00, 400.00, 1, 120.00, 'RMS01', NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documenttypes`
--

CREATE TABLE `documenttypes` (
  `document_id` int NOT NULL,
  `name_document` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `documenttypes`
--

INSERT INTO `documenttypes` (`document_id`, `name_document`) VALUES
(1, 'C.C'),
(2, 'C.E'),
(3, 'NIT'),
(4, 'PAS'),
(5, 'PPT');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `floors`
--

CREATE TABLE `floors` (
  `flr_id` varchar(100) NOT NULL,
  `bld_id` varchar(100) DEFAULT NULL,
  `flr_rooms` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `floors`
--

INSERT INTO `floors` (`flr_id`, `bld_id`, `flr_rooms`) VALUES
('BLD00FLR0', 'BLD00', 5),
('BLD00FLR1', 'BLD00', 6),
('BLD00FLR2', 'BLD00', 6),
('BLD01FLR0', 'BLD01', 5),
('BLD01FLR1', 'BLD01', 6),
('BLD01FLR2', 'BLD01', 6),
('BLD01FLR3', 'BLD01', 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `payment_history`
--

CREATE TABLE `payment_history` (
  `contract_id` varchar(100) DEFAULT NULL,
  `upload_date` date DEFAULT NULL,
  `paid_month` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rooms`
--

CREATE TABLE `rooms` (
  `rooms_id` varchar(100) NOT NULL,
  `flr_id` varchar(100) DEFAULT NULL,
  `number_room` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `rooms`
--

INSERT INTO `rooms` (`rooms_id`, `flr_id`, `number_room`) VALUES
('RMS00', 'BLD00FLR0', 1),
('RMS01', 'BLD01FLR0', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `user_id` varchar(100) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(190) DEFAULT NULL,
  `phone` int DEFAULT '0',
  `password_hash` varchar(255) DEFAULT NULL,
  `personal_photo` varchar(255) DEFAULT NULL,
  `document_number` varchar(100) DEFAULT NULL,
  `document_id` int DEFAULT NULL,
  `r_person_a` varchar(100) DEFAULT NULL,
  `r_person_a_phone` int DEFAULT NULL,
  `r_person_b` varchar(100) DEFAULT NULL,
  `r_person_b_phone` int DEFAULT NULL,
  `admin` tinyint(1) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `phone`, `password_hash`, `personal_photo`, `document_number`, `document_id`, `r_person_a`, `r_person_a_phone`, `r_person_b`, `r_person_b_phone`, `admin`, `active`) VALUES
('54654fe65d65fd4', 'David Jose', 'Manzano Arias', 'davidjosemanzano@gmail.com', 914968452, '$2b$10$K6AO.sJpMvxIIcbwfiPciOBLENnjJzrii8tTT0/klDn7w9RIO6WZ.', NULL, '005716530', 2, 'Carlos Martines', 854745965, 'Daniel Contreras', 351254751, 1, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `building`
--
ALTER TABLE `building`
  ADD PRIMARY KEY (`bld_id`);

--
-- Indices de la tabla `contracts`
--
ALTER TABLE `contracts`
  ADD PRIMARY KEY (`contract_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `rooms_id` (`rooms_id`);

--
-- Indices de la tabla `documenttypes`
--
ALTER TABLE `documenttypes`
  ADD PRIMARY KEY (`document_id`);

--
-- Indices de la tabla `floors`
--
ALTER TABLE `floors`
  ADD PRIMARY KEY (`flr_id`),
  ADD KEY `bld_id` (`bld_id`);

--
-- Indices de la tabla `payment_history`
--
ALTER TABLE `payment_history`
  ADD KEY `contract_id` (`contract_id`);

--
-- Indices de la tabla `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`rooms_id`),
  ADD KEY `flr_id` (`flr_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `document_type` (`document_id`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `contracts`
--
ALTER TABLE `contracts`
  ADD CONSTRAINT `contracts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `contracts_ibfk_2` FOREIGN KEY (`rooms_id`) REFERENCES `rooms` (`rooms_id`);

--
-- Filtros para la tabla `floors`
--
ALTER TABLE `floors`
  ADD CONSTRAINT `floors_ibfk_1` FOREIGN KEY (`bld_id`) REFERENCES `building` (`bld_id`);

--
-- Filtros para la tabla `payment_history`
--
ALTER TABLE `payment_history`
  ADD CONSTRAINT `payment_history_ibfk_1` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`contract_id`);

--
-- Filtros para la tabla `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`flr_id`) REFERENCES `floors` (`flr_id`);

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`document_id`) REFERENCES `documenttypes` (`document_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
