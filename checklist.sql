-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               PostgreSQL 16.5, compiled by Visual C++ build 1941, 64-bit
-- Server OS:                    
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table public.checklist_detail
CREATE TABLE IF NOT EXISTS "checklist_detail" (
	"text" VARCHAR(255) NULL DEFAULT NULL,
	"status" SMALLINT NULL DEFAULT NULL,
	"checklist_id" INTEGER NULL DEFAULT NULL,
	"uid" SERIAL NOT NULL,
	PRIMARY KEY ("uid")
);

-- Dumping data for table public.checklist_detail: 2 rows
/*!40000 ALTER TABLE "checklist_detail" DISABLE KEYS */;
INSERT INTO "checklist_detail" ("text", "status", "checklist_id", "uid") VALUES
	('dearder', 0, 1, 3),
	('bearere', 0, 1, 4);
/*!40000 ALTER TABLE "checklist_detail" ENABLE KEYS */;

-- Dumping structure for table public.checklist_header
CREATE TABLE IF NOT EXISTS "checklist_header" (
	"header" VARCHAR(255) NULL DEFAULT NULL,
	"status" SMALLINT NULL DEFAULT NULL,
	"user_id" VARCHAR(255) NULL DEFAULT NULL,
	"checklist_id" SERIAL NOT NULL,
	PRIMARY KEY ("checklist_id")
);

-- Dumping data for table public.checklist_header: 3 rows
/*!40000 ALTER TABLE "checklist_header" DISABLE KEYS */;
INSERT INTO "checklist_header" ("header", "status", "user_id", "checklist_id") VALUES
	('dearder', 1, 'trial', 8),
	('dearder', 0, 'trial', 6),
	('Data', 1, 'trial', 1);
/*!40000 ALTER TABLE "checklist_header" ENABLE KEYS */;

-- Dumping structure for table public.checklist_user
CREATE TABLE IF NOT EXISTS "checklist_user" (
	"username" VARCHAR(255) NULL DEFAULT NULL,
	"password" VARCHAR(255) NULL DEFAULT NULL,
	"email" VARCHAR(255) NULL DEFAULT NULL,
	"user_id" VARCHAR(255) NOT NULL,
	PRIMARY KEY ("user_id")
);

-- Dumping data for table public.checklist_user: -1 rows
/*!40000 ALTER TABLE "checklist_user" DISABLE KEYS */;
INSERT INTO "checklist_user" ("username", "password", "email", "user_id") VALUES
	('trial', 'trial', 'retrial@mail.com', 'trial'),
	('trial1', 'trial1', 'retrial@mail.com', 'trial1'),
	('trial2', 'trial2', 'trial2', 'trial2');
/*!40000 ALTER TABLE "checklist_user" ENABLE KEYS */;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
