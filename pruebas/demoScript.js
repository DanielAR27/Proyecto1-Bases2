const axios = require('axios');
const {faker}  = require('@faker-js/faker');

// Cambiar el locale global a español
faker.locale = 'es';

const AUTH_API = 'http://localhost:4000';   // Para /auth/register y /auth/login
const API = 'http://localhost:5000';        // Para /restaurants, /products, etc.

const TOTAL_USERS = 10;
const TOTAL_RESTAURANTS = 5;
const MENUS_PER_RESTAURANT = 2;
const PRODUCTS_PER_MENU = 4;
const RESERVATIONS_PER_USER = 3;
const ORDERS_PER_USER = 2;

const crearDatosMasivos = async () => {
  try {
    const productosGlobales = [];

    // Crear admin
    const adminEmail = faker.internet.email();
    await axios.post(`${AUTH_API}/auth/register`, {
      nombre: faker.person.fullName(),
      email: adminEmail,
      contrasena: '123456',
      rol: 'administrador'
    });

    const loginAdmin = await axios.post(`${AUTH_API}/auth/login`, {
      email: adminEmail,
      contrasena: '123456'
    });
    const adminToken = loginAdmin.data.token;
    console.log("Token del admin: ", adminToken);

    // Crear usuarios normales
    const usuarios = [];
    for (let i = 0; i < TOTAL_USERS; i++) {
      const email = faker.internet.email();
      const nombre = faker.person.fullName();

      await axios.post(`${AUTH_API}/auth/register`, {
        nombre,
        email,
        contrasena: '123456',
        rol: 'cliente'
      });

      const login = await axios.post(`${AUTH_API}/auth/login`, {
        email,
        contrasena: '123456'
      });

      usuarios.push({
        id: login.data.usuario.id_usuario,
        token: login.data.token
      });
    }

    // Crear restaurantes con menús y productos
    const restaurantes = [];
    for (let r = 0; r < TOTAL_RESTAURANTS; r++) {
      const rest = await axios.post(`${API}/restaurants`, {
        nombre: faker.company.name(),
        direccion: faker.location.streetAddress()
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      const id_restaurante = rest.data.restaurante.id_restaurante;
      restaurantes.push(id_restaurante);

      for (let m = 0; m < MENUS_PER_RESTAURANT; m++) {
        const menu = await axios.post(`${API}/menus`, {
          id_restaurante,
          nombre: faker.commerce.department(),
          descripcion: faker.commerce.productDescription()
        }, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });

        const id_menu = menu.data.menu.id_menu;

        for (let p = 0; p < PRODUCTS_PER_MENU; p++) {
          const producto = await axios.post(`${API}/products`, {
            nombre: faker.commerce.productName(),
            categoria: faker.commerce.department(),
            descripcion: faker.commerce.productDescription(),
            precio: parseFloat(faker.commerce.price()),
            id_menu
          }, {
            headers: { Authorization: `Bearer ${adminToken}` }
          });

          productosGlobales.push({
            id_producto: producto.data.producto.id_producto,
            id_restaurante
          });
        }
      }
    }

    // Crear reservaciones y pedidos por usuario
    for (const user of usuarios) {
      for (let r = 0; r < RESERVATIONS_PER_USER; r++) {
        const id_restaurante = faker.helpers.arrayElement(restaurantes);
        await axios.post(`${API}/reservations`, {
          id_usuario: user.id,
          id_restaurante,
          fecha_hora: faker.date.future().toISOString(),
          estado: 'pendiente'
        }, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      }

      for (let o = 0; o < ORDERS_PER_USER; o++) {
        const productosPedido = faker.helpers.arrayElements(productosGlobales, faker.number.int({ min: 1, max: 3 }));

        const productosFormateados = productosPedido.map(p => ({
          id_producto: p.id_producto,
          cantidad: faker.number.int({ min: 1, max: 5 })
        }));

        await axios.post(`${API}/orders`, {
          id_usuario: user.id,
          id_restaurante: productosPedido[0].id_restaurante,
          tipo: 'en restaurante',
          productos: productosFormateados
        }, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      }
    }

    console.log("Base de datos poblada con éxito.");

  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
};

const pruebasCompletas = async () => {
  try {
    
    // Crear usuario normal
    /*await axios.post(`${AUTH_API}/auth/register`, {
      nombre: 'Usuario Demo',
      email: 'user@demo.com',
      contrasena: '123456',
      rol: 'cliente'
    });*/


    // Crear administrador
    await axios.post(`${AUTH_API}/auth/register`, {
      nombre: 'Admin Demo',
      email: 'admin@demo.com',
      contrasena: '123456',
      rol: 'administrador'
    });

    // Crear usuario prueba
    await axios.post(`${AUTH_API}/auth/register`, {
      nombre: 'Prueba Demo',
      email: 'prueba@demo.com',
      contrasena: '123456',
      rol: 'cliente'
    });
  
    // Login administrador
    const loginAdmin = await axios.post(`${AUTH_API}/auth/login`, {
      email: 'admin@demo.com',
      contrasena: '123456'
    });
    const adminToken = loginAdmin.data.token;
    const adminId = loginAdmin.data.usuario.id_usuario;
  
    // Login usuario prueba
    const loginUserPrueba = await axios.post(`${AUTH_API}/auth/login`, {
      email: 'prueba@demo.com',
      contrasena: '123456'
    });
    const userPruebaToken = loginUserPrueba.data.token;
    const userPruebaId = loginUserPrueba.data.usuario.id_usuario;

    console.log("Admin Token:", adminToken);

    // Crear restaurante
    const restaurante = await axios.post(`${API}/restaurants`, {
      nombre: 'Restaurante Demo',
      direccion: 'Calle Falsa 123'
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
  
    const id_restaurante = restaurante.data.restaurante.id_restaurante;

    // Crear menú
    const menu = await axios.post(`${API}/menus`, {
      id_restaurante,
      nombre: 'Menú Principal',
      descripcion: 'Comida variada',
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    const id_menu = menu.data.menu.id_menu;

    // Crear reservación
    await axios.post(`${API}/reservations`, {
      id_usuario: userPruebaId,
      id_restaurante,
      fecha_hora: new Date().toISOString(),
      estado: 'pendiente'
    }, {
      headers: { Authorization: `Bearer ${userPruebaToken}` }
    });
    
    console.log("Comienzan pruebas de productos")

    // Crear producto 1
    const prod1 = await axios.post(`${API}/products`, {
      nombre: 'Atún',
      categoria: 'Comida',
      descripcion: 'Lata de atún',
      precio: 5.0,
      id_menu
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    console.log("Producto #1 agregado exitosamente.")


    const id_prod1 = prod1.data.producto.id_producto;

    // Crear producto 2
    const prod2 = await axios.post(`${API}/products`, {
      nombre: 'Galletas',
      categoria: 'Snacks',
      descripcion: 'Paquete de galletas',
      precio: 2.0,
      id_menu
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    console.log("Producto #2 agregado exitosamente.")

    const id_prod2 = prod2.data.producto.id_producto;

    console.log("Creando pedido...");

    const pedido = await axios.post(`${API}/orders`, {
      id_usuario: userPruebaId,
      id_restaurante,
      tipo: 'en restaurante',
      productos: [
        { id_producto: id_prod1, cantidad: 2 }, // 2 atunes x $5 = $10
        { id_producto: id_prod2, cantidad: 1 }  // 1 galletas x $2 = $2
      ]
    }, {
      headers: { Authorization: `Bearer ${userPruebaToken}` }
    });

    console.log("Pedido creado con éxito:", pedido.data.pedido);



  } catch (err) {
    console.error('Error en el script:', err.response?.data || err.message);
  }
};

crearDatosMasivos();