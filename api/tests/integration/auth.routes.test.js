// tests/integration/auth.routes.test.js

const request = require('supertest');
const app = require('../../src/app');

let token = '';
let userId = null;

describe('Auth Routes - Integration Tests', () => {

  afterAll(async () => {
    if (token && userId) {
      await request(app)
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    }
  });

  describe('POST /auth/register', () => {
    it('debería registrar un nuevo usuario', async () => {
      const newUser = {
        nombre: 'Juan',
        email: 'juan@example.com',
        contrasena: 'password123',
        rol: 'cliente'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Usuario registrado exitosamente.');
    });
  });

  describe('POST /auth/login', () => {
    it('debería loguear exitosamente y devolver token', async () => {
      const credentials = {
        email: 'juan@example.com',
        contrasena: 'password123'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(credentials)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('usuario');
      token = response.body.token;
      userId = response.body.usuario.id_usuario; // Guardamos también el id_usuario para después
    });
  });

  describe('GET /auth/verify', () => {
    it('debería verificar el token y devolver usuario', async () => {
      const response = await request(app)
        .get('/auth/verify')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('usuario');
      expect(response.body.usuario).toHaveProperty('id_usuario');
    });
  });

});
