DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
	`id` VARCHAR(255) NOT NULL,
	`password` VARCHAR(64) NOT NULL DEFAULT '',
	PRIMARY KEY(`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8;

DROP TABLE IF EXISTS `agent`;
CREATE TABLE `agent` (
	`id` VARCHAR(255) NOT NULL,
	`ownerId` VARCHAR(255) NOT NULL,
	`name` VARCHAR(64) NOT NULL DEFAULT '',
	`openType` TINYINT NOT NULL DEFAULT 1,
	PRIMARY KEY(`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8;

DROP TABLE IF EXISTS `agent_relation`;
CREATE TABLE `agent_relation` (
	`parent` VARCHAR(255) NOT NULL,
	`child` VARCHAR(255) NOT NULL,
	PRIMARY KEY(`parent`, `child`),
	index(`child`), index(`parent`)
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8;

DROP TABLE IF EXISTS `schedule`;
CREATE TABLE `schedule` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`agentId` VARCHAR(255) NOT NULL,
	`startTime` DATETIME NOT NULL,
	`endTime` DATETIME NOT NULL,
	`head` VARCHAR(32) NOT NULL DEFAULT '',
	`body` VARCHAR(500) NOT NULL DEFAULT '',
	PRIMARY KEY(`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8;

DROP TABLE IF EXISTS `line`;
CREATE TABLE `line` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`agentId` VARCHAR(255) NOT NULL,
	`time` DATETIME NOT NULL,
	`head` VARCHAR(32) NOT NULL DEFAULT '',
	`body` VARCHAR(500) NOT NULL DEFAULT '',
	PRIMARY KEY(`id`)
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8;

DROP TABLE IF EXISTS `reply`;
CREATE TABLE `reply` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`rId` INTEGER NOT NULL,
	`type` TINYINT NOT NULL,
	`agentId` VARCHAR(255) NOT NULL,
	`writeTime` DATETIME NOT NULL,
	`reply` VARCHAR(500) NOT NULL DEFAULT '',
	PRIMARY KEY(`id`), index(`rid`, `type`)
) ENGINE = InnoDB DEFAULT CHARACTER SET utf8;
