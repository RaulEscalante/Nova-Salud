SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

--
-- Volcado de datos para la tabla `category`
--

INSERT INTO `category` (`id`, `name`, `active`, `createdAt`, `updatedAt`) VALUES
(1, 'Medicamentos y Fármacos', 1, '2026-11-02 15:47:00.246', '2026-11-04 14:44:07.777'),
(2, 'Vitaminas y Suplementos', 1, '2026-11-04 09:32:39.000', '2026-11-04 09:32:39.000'),
(3, 'Cuidado Personal e Higiene', 1, '2026-11-04 09:32:39.000', '2026-11-04 09:32:39.000'),
(4, 'Primeros Auxilios y Curaciones', 1, '2026-11-04 09:32:39.000', '2026-11-04 09:32:39.000'),
(5, 'Bebés y Maternidad', 1, '2026-11-04 09:32:39.000', '2026-11-04 15:58:24.233'),
(6, 'Dermatología y Cuidado de la Piel', 1, '2026-11-04 09:32:39.000', '2026-11-04 09:32:39.000'),
(7, 'Ortopedia y Bienestar', 1, '2026-11-04 09:32:39.000', '2026-11-04 09:32:39.000'),
(8, 'Ofertas y Promociones', 1, '2026-11-04 09:32:39.000', '2026-11-04 09:32:39.000');

--
-- Volcado de datos para la tabla `product`
--

INSERT INTO `product` (`id`, `sku`, `name`, `description`, `purchasePrice`, `salePrice`, `minStock`, `maxStock`, `active`, `categoryId`, `createdAt`, `updatedAt`) VALUES
(1, 'MED-001', 'Paracetamol 500 mg', 'Tabletas de 500 mg - presentación actualizada', 3.10, 4.00, 15, 60, 1, 1, '2026-11-02 16:02:02.994', '2026-11-04 16:48:49.088'),
(2, 'MED-TEST-002', 'Producto de prueba para vencimiento', 'Producto utilizado para pruebas de lotes vencidos', 2.50, 8.00, 5, 50, 1, 1, '2026-11-03 16:45:02.760', '2026-11-05 21:41:21.635'),
(3, 'PAR500', 'Paracetamol 500 mg x 100 Tab', 'Analgésico y antipirético de uso común para el alivio del dolor y la fiebre.', 12.50, 18.00, 20, 150, 1, 1, '2026-11-04 10:56:37.000', '2026-11-04 10:56:37.000'),
(4, 'IBU400', 'Ibuprofeno 400 mg x 50 Tab', 'Antiinflamatorio no esteroideo indicado para dolores musculares y inflamación.', 15.00, 22.50, 15, 100, 1, 1, '2026-11-04 10:56:37.000', '2026-11-04 10:56:37.000'),
(5, 'AMO500', 'Amoxicilina 500 mg x 30 Cáps', 'Antibiótico de amplio espectro para infecciones bacterianas sensibles.', 15.00, 38.00, 10, 80, 1, 1, '2026-11-04 10:56:37.000', '2026-11-06 14:42:03.072'),
(6, 'VITC1G', 'Vitamina C 1g Efervescente x 20 Tab', 'Suplemento vitamínico para reforzar el sistema inmunológico, sabor naranja.', 14.20, 21.00, 12, 90, 1, 2, '2026-11-04 10:56:37.000', '2026-11-04 10:56:37.000'),
(7, 'OME20M', 'Omeprazol 20 mg x 30 Cáps', 'Protector gástrico indicado para el tratamiento de acidez y reflujo.', 10.00, 14.00, 10, 100, 1, 1, '2026-11-04 10:56:37.000', '2026-11-05 21:34:43.949'),
(8, 'ALC1LT', 'Alcohol Medicinal 70° x 1 Litro', 'Solución antiséptica tópica para desinfección de la piel y superficies.', 6.80, 10.50, 25, 200, 1, 3, '2026-11-04 10:56:37.000', '2026-11-04 15:58:29.947'),
(9, 'GELANT', 'Gel Antibacterial para Manos 500 ml', 'Alcohol en gel con aloe vera, eliminación rápida de bacterias.', 7.00, 12.00, 20, 120, 1, 3, '2026-11-04 10:56:37.000', '2026-11-04 10:56:37.000'),
(10, 'GAZEST', 'Gasa Estéril 10x10 cm Sobre x 5 u', 'Material de curación estéril para heridas y primeros auxilios.', 1.50, 5.00, 30, 250, 1, 4, '2026-11-04 10:56:37.000', '2026-11-05 21:35:32.467'),
(11, 'PAÑREC', 'Pañales Recién Nacido Pack x 40 u', 'Pañales con alta absorción y cubierta suave para pieles sensibles', 28.50, 39.90, 8, 60, 1, 5, '2026-11-04 10:56:37.000', '2026-11-04 10:56:37.000'),
(12, 'BLOFS50', 'Bloqueador Solar SPF 50+ 200 ml', 'Protector solar dermatológico de amplio espectro contra rayos UVA/UVB.', 35.00, 52.00, 5, 50, 1, 6, '2026-11-04 10:56:37.000', '2026-11-04 15:59:01.098'),
(13, 'MED-0002', 'Caramelo antigripal', NULL, 1.50, 2.50, 10, 100, 1, 1, '2026-11-05 17:27:25.586', '2026-11-05 17:27:25.586');

--
-- Volcado de datos para la tabla `sale`
--

INSERT INTO `sale` (`id`, `total`, `createdAt`) VALUES
(1, 12.00, '2026-11-03 16:07:00.176'),
(2, 20.00, '2026-11-03 16:27:42.275'),
(3, 13.00, '2026-11-05 21:37:00.931'),
(4, 24.00, '2026-11-05 21:37:56.698'),
(5, 48.00, '2026-11-05 22:20:50.616'),
(6, 114.00, '2026-11-06 14:48:55.700'),
(7, 40.00, '2026-11-06 14:49:13.373');

--
-- Volcado de datos para la tabla `purchase`
--

INSERT INTO `purchase` (`id`, `supplierName`, `total`, `createdAt`) VALUES
(1, 'Distribuidora Farmacéutica Lima', 144.50, '2026-11-04 16:48:49.065'),
(6, 'Colones', 320.00, '2026-11-05 21:34:43.933'),
(7, 'Colones', 75.00, '2026-11-05 21:35:32.452'),
(8, 'VENCIDOS', 12.50, '2026-11-05 21:41:21.617'),
(9, 'DESTRO', 300.00, '2026-11-06 14:42:03.051');

--
-- Volcado de datos para la tabla `batch`
--

INSERT INTO `batch` (`id`, `productId`, `batchCode`, `expirationDate`, `quantity`, `createdAt`) VALUES
(1, 1, 'LOTE-001', '2027-12-31', 32, '2026-11-02 16:38:44.360'),
(2, 2, 'LOTE-VENCIDO-001', '2026-10-15', 10, '2026-11-03 11:47:15.000'),
(3, 1, 'COMPRA-001-LOTE-A', '2028-06-30', 20, '2026-11-04 16:48:49.081'),
(4, 2, 'COMPRA-001-LOTE-B', '2028-12-31', 11, '2026-11-04 16:48:49.109'),
(6, 7, 'OME-001', '2028-10-02', 20, '2026-11-05 21:34:43.944'),
(7, 10, 'GAES - 001', '2030-12-31', 71, '2026-11-05 21:34:43.962'),
(8, 10, 'GAES - 002', '2030-12-31', 50, '2026-11-05 21:35:32.463'),
(9, 2, 'LOTE - 006', '2027-12-12', 0, '2026-11-05 21:41:21.627'),
(10, 5, 'AMOX-001', '2028-12-12', 17, '2026-11-06 14:42:03.062');

--
-- Estructura de tabla para la tabla `inventory`
--

INSERT INTO `inventory` (`id`, `productId`, `quantity`, `updatedAt`) VALUES
(1, 1, 52, '2026-11-05 21:37:00.930'),
(2, 2, 11, '2026-11-05 22:20:50.614'),
(3, 3, 0, '2026-11-05 12:26:25.000'),
(4, 4, 0, '2026-11-05 12:26:25.000'),
(5, 5, 17, '2026-11-06 14:48:55.698'),
(6, 7, 20, '2026-11-05 21:34:43.946'),
(7, 6, 0, '2026-11-05 12:26:25.000'),
(8, 8, 0, '2026-11-05 12:26:25.000'),
(9, 9, 0, '2026-11-05 12:26:25.000'),
(10, 10, 121, '2026-11-06 14:49:13.373'),
(11, 11, 0, '2026-11-05 12:26:25.000'),
(12, 12, 0, '2026-11-05 12:26:25.000'),
(18, 13, 0, '2026-11-05 17:27:25.586');

--
-- Estructura de tabla para la tabla `saledetail`
--
INSERT INTO `saledetail` (`id`, `saleId`, `productId`, `quantity`, `unitPrice`, `subtotal`) VALUES
(1, 1, 1, 3, 4.00, 12.00),
(2, 2, 1, 5, 4.00, 20.00),
(3, 3, 10, 1, 5.00, 5.00),
(4, 3, 1, 2, 4.00, 8.00),
(5, 4, 2, 3, 8.00, 24.00),
(6, 5, 2, 6, 8.00, 48.00),
(7, 6, 5, 3, 38.00, 114.00),
(8, 7, 10, 8, 5.00, 40.00);

--
-- Volcado de datos para la tabla `purchasedetail`
--

INSERT INTO `purchasedetail` (`id`, `purchaseId`, `productId`, `batchId`, `quantity`, `unitPrice`, `subtotal`) VALUES
(1, 1, 1, 3, 20, 3.10, 62.00),
(2, 1, 2, 4, 15, 5.50, 82.50),
(4, 6, 7, 6, 20, 10.00, 200.00),
(5, 6, 10, 7, 80, 1.50, 120.00),
(6, 7, 10, 8, 50, 1.50, 75.00),
(7, 8, 2, 9, 5, 2.50, 12.50),
(8, 9, 5, 10, 20, 15.00, 300.00);


--
-- Estructura de tabla para la tabla `inventorymovement`
--

INSERT INTO `inventorymovement` (`id`, `productId`, `batchId`, `saleId`, `type`, `quantity`, `reason`, `createdAt`, `purchaseId`) VALUES
(1, 1, 1, NULL, 'PURCHASE', 50, 'Compra inicial de mercancía', '2026-11-02 16:38:44.372', NULL),
(2, 1, 1, NULL, 'ADJUSTMENT', -8, 'Ajuste por conteo físico', '2026-11-02 16:39:38.395', NULL),
(3, 1, 1, 1, 'SALE', -3, 'Venta de producto', '2026-11-03 16:07:00.187', NULL),
(4, 1, 1, 2, 'SALE', -5, 'Venta de producto', '2026-11-03 16:27:42.282', NULL),
(5, 1, 3, NULL, 'PURCHASE', 20, 'Compra #1', '2026-11-04 16:48:49.103', 1),
(6, 2, 4, NULL, 'PURCHASE', 15, 'Compra #1', '2026-11-04 16:48:49.136', 1),
(8, 7, 6, NULL, 'PURCHASE', 20, 'Compra #6', '2026-11-05 21:34:43.956', 6),
(9, 10, 7, NULL, 'PURCHASE', 80, 'Compra #6', '2026-11-05 21:34:43.977', 6),
(10, 10, 8, NULL, 'PURCHASE', 50, 'Compra #7', '2026-11-05 21:35:32.474', 7),
(11, 10, 7, 3, 'SALE', -1, 'Venta de producto', '2026-11-05 21:37:00.941', NULL),
(12, 1, 1, 3, 'SALE', -2, 'Venta de producto', '2026-11-05 21:37:00.941', NULL),
(13, 2, 4, 4, 'SALE', -3, 'Venta de producto', '2026-11-05 21:37:56.704', NULL),
(14, 2, 9, NULL, 'PURCHASE', 5, 'Compra #8', '2026-11-05 21:41:21.647', 8),
(15, 2, 9, 5, 'SALE', -5, 'Venta de producto', '2026-11-05 22:20:50.623', NULL),
(16, 2, 4, 5, 'SALE', -1, 'Venta de producto', '2026-11-05 22:20:50.623', NULL),
(17, 5, 10, NULL, 'PURCHASE', 20, 'Compra #9', '2026-11-06 14:42:03.083', 9),
(18, 5, 10, 6, 'SALE', -3, 'Venta de producto', '2026-11-06 14:48:55.706', NULL),
(19, 10, 7, 7, 'SALE', -8, 'Venta de producto', '2026-11-06 14:49:13.374', NULL);

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;