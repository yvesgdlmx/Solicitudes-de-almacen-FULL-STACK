-- Referencia: esquema de los modelos en el commit 7359f98.
-- Ejecutar tras revisar 00_revision_esquema.sql y respaldar la base.
-- Requiere solicitudes.id y usuarios.id de tipo INT con signo,
-- tablas padre InnoDB y soporte de JSON en el servidor MySQL/MariaDB.
-- No inserta datos, no altera tablas existentes y no borra registros.
-- IF NOT EXISTS no corrige una tabla que ya exista con otro esquema.

CREATE TABLE IF NOT EXISTS `seguimientos_surtido` (
    `SolicitudId` INTEGER,
    `responsableId` INTEGER,
    `turno` VARCHAR(255) NOT NULL,
    `inicio` DATETIME NOT NULL,
    `limite` DATETIME NOT NULL,
    `primeraAtencion` DATETIME,
    `completada` DATETIME,
    `motivo` VARCHAR(255),
    `detalle` TEXT,
    `createdAt` DATETIME NOT NULL,
    `updatedAt` DATETIME NOT NULL,
    PRIMARY KEY (`SolicitudId`),
    FOREIGN KEY (`SolicitudId`) REFERENCES `solicitudes` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`responsableId`) REFERENCES `usuarios` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `eventos_surtido` (
    `id` INTEGER AUTO_INCREMENT,
    `SolicitudId` INTEGER NOT NULL,
    `actorId` INTEGER NOT NULL,
    `responsableId` INTEGER,
    `tipo` VARCHAR(255) NOT NULL,
    `datos` JSON NOT NULL,
    `createdAt` DATETIME NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`SolicitudId`) REFERENCES `solicitudes` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`actorId`) REFERENCES `usuarios` (`id`)
        ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB;
