// src/routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Búsqueda de Productos
 *     description: Endpoints para buscar y reindexar productos desde Elasticsearch.
 *   - name: Gestión de Productos Indexados
 *     description: Endpoints para agregar, actualizar o eliminar productos en el índice de búsqueda.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       required:
 *         - id_producto
 *         - nombre
 *         - categoria
 *       properties:
 *         id_producto:
 *           type: integer
 *           description: Identificador único del producto
 *         nombre:
 *           type: string
 *           description: Nombre del producto
 *         descripcion:
 *           type: string
 *           description: Descripción detallada del producto
 *         categoria:
 *           type: string
 *           description: Categoría a la que pertenece el producto
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /search/products:
 *   get:
 *     summary: Buscar productos por texto
 *     tags: [Búsqueda de Productos]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Término de búsqueda
 *     responses:
 *       200:
 *         description: Lista de productos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *       400:
 *         description: Término de búsqueda no proporcionado
 *       500:
 *         description: Error al buscar productos
 */
router.get('/products', searchController.searchProducts);

/**
 * @swagger
 * /search/products/category/{categoria}:
 *   get:
 *     summary: Buscar productos por categoría
 *     tags: [Búsqueda de Productos]
 *     parameters:
 *       - in: path
 *         name: categoria
 *         schema:
 *           type: string
 *         required: true
 *         description: Categoría de los productos
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página de resultados
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de resultados por página
 *     responses:
 *       200:
 *         description: Productos filtrados por categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Producto'
 *                 total:
 *                   type: integer
 *                   description: Total de productos encontrados
 *                 pagina:
 *                   type: integer
 *                   description: Página actual
 *                 total_paginas:
 *                   type: integer
 *                   description: Total de páginas disponibles
 *       500:
 *         description: Error al realizar la búsqueda por categoría
 */
router.get('/products/category/:categoria', searchController.searchProductsByCategory);

/**
 * @swagger
 * /search/reindex:
 *   post:
 *     summary: Reindexar todos los productos desde la base de datos
 *     tags: [Búsqueda de Productos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reindexación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Productos reindexados correctamente"
 *                 count:
 *                   type: integer
 *                   description: Número de productos reindexados
 *                   example: 150
 *       401:
 *         description: No autorizado para realizar esta operación
 *       500:
 *         description: Error al reindexar productos
 */
router.post('/reindex', authMiddleware, searchController.reindexProducts);

/**
 * @swagger
 * /search/product:
 *   post:
 *     summary: Indexar producto individual
 *     tags: [Gestión de Productos Indexados]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       201:
 *         description: Producto indexado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Producto indexado correctamente"
 *                 producto:
 *                   $ref: '#/components/schemas/Producto'
 *       400:
 *         description: Datos de producto incompletos
 *       401:
 *         description: No autorizado para indexar productos
 *       500:
 *         description: Error al indexar producto
 */
router.post('/product', authMiddleware, searchController.indexProduct);

/**
 * @swagger
 * /search/product/{id}:
 *   put:
 *     summary: Actualizar producto en el índice
 *     tags: [Gestión de Productos Indexados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre actualizado del producto
 *               descripcion:
 *                 type: string
 *                 description: Descripción actualizada del producto
 *               categoria:
 *                 type: string
 *                 description: Categoría actualizada del producto
 *             required:
 *               - nombre
 *               - categoria
 *     responses:
 *       200:
 *         description: Producto actualizado en índice correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Producto actualizado correctamente"
 *                 id:
 *                   type: string
 *                   example: "123"
 *       400:
 *         description: Datos de producto incompletos
 *       401:
 *         description: No autorizado para actualizar productos
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al actualizar producto en índice
 */
router.put('/product/:id', authMiddleware, searchController.updateProduct);

/**
 * @swagger
 * /search/product/{id}:
 *   delete:
 *     summary: Eliminar producto del índice
 *     tags: [Gestión de Productos Indexados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado del índice correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Producto eliminado correctamente"
 *                 id:
 *                   type: string
 *                   example: "123"
 *       401:
 *         description: No autorizado para eliminar productos
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al eliminar producto del índice
 */
router.delete('/product/:id', authMiddleware, searchController.deleteProduct);

module.exports = router;