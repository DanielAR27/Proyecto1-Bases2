// tests/integration/user.routes.test.js

const request = require('supertest');
const app = require('../../src/app');

let adminToken = '';
let createdUserId = null;

describe('User Routes - Integration Tests', () => {

  beforeAll(async () => {
    // 1. Crear un usuario administrador (para hacer operaciones importantes)
    await request(app)
      .post('/auth/register')
      .send({
        nombre: 'Admin Tester',
        email: 'admin@example.com',
        contrasena: 'adminpass123',
        rol: 'administrador'
      });

    const adminLogin = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        contrasena: 'adminpass123'
      });

    adminToken = adminLogin.body.token;

    // 2. Crear un usuario normal que después se va a actualizar/borrar
    await request(app)
      .post('/auth/register')
      .send({
        nombre: 'Juan Normal',
        email: 'normal@example.com',
        contrasena: 'normalpass123',
        rol: 'cliente'
      });

    const userLogin = await request(app)
      .post('/auth/login')
      .send({
        email: 'normal@example.com',
        contrasena: 'normalpass123'
      });

    createdUserId = userLogin.body.usuario.id_usuario;
  });

  afterAll(async () => {
    // Borra usuario normal si sigue vivo
    if (createdUserId) {
      await request(app)
        .delete(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .catch(() => {});
    }
  
    // Reloguear admin para conseguir id_usuario
    const loginAdmin = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@example.com', contrasena: 'adminpass123' });
  
    const adminId = loginAdmin.body.usuario.id_usuario;
    const refreshedToken = loginAdmin.body.token;
  
    // Borrar admin
    await request(app)
      .delete(`/users/${adminId}`)
      .set('Authorization', `Bearer ${refreshedToken}`)
      .catch(() => {});
  });
  
  describe('GET /users/me', () => {
    it('debería devolver la información del admin', async () => {
      const response = await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id_usuario');
      expect(response.body).toHaveProperty('nombre');
      expect(response.body.rol).toBe('administrador');
    });
  });

  describe('PUT /users/:id', () => {
    it('debería actualizar la información de un usuario', async () => {
      const updateData = {
        nombre: 'Juan Actualizado',
        email: 'nuevoactualizado@example.com',
        rol: 'cliente'
      };

      const response = await request(app)
        .put(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.message).toBe('Usuario actualizado correctamente.');
    });
  });

  describe('DELETE /users/:id', () => {
    it('debería borrar el usuario', async () => {
      const response = await request(app)
        .delete(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.message).toBe('Usuario eliminado correctamente.');
    });
  });

});
