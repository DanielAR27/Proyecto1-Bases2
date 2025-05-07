# Instalación de módulos

Es necesario actualizar los módulos necesarios para el correcto funcionamiento de la API, para ello se debe ubicar en el folder `./api` mediante el comando

```
cd ./api
```

Para poder instalar o actualizar los módulos necesarios basta con utilizar el siguiente comando

```
npm install
```

Posteriormente, se puede regresar al directorio general mediante el comando

```
cd ..
```

Una vez allí, se debe ubicar ahora en el folder `./auth_service` mediante el comando

```
cd ./auth_service
```

Nuevamente, se debe utilizar el comando para instalar o actualizar los módulos necesarios

```
npm install
```

#  Uso con Docker

##  Construcción y levantamiento de los servicios

Para construir los contenedores e iniciar toda la aplicación (API, servicio de autenticación, base de datos, etc.):

```docker
docker-compose up --build
```

##  Pruebas de cobertura

El proyecto cuenta con pruebas automatizadas separadas para el servicio de autenticación y la API principal. A continuación se presentan los comandos necesarios para ejecutarlas

### Servición de autenticación

Para realizar las pruebas del servicio de autenticación, primero construya el contenedor específico:

```docker
docker-compose build auth_test_runner
```
Luego, ejecute las pruebas con cobertura:

```docker
docker-compose --profile test up auth_test_runner
```
### API Principal

Para realizar las pruebas de la API principal, primero construya el contenedor específico:

```docker
docker-compose build test_runner
```

Luego, ejecute las pruebas con cobertura:

```docker
docker-compose --profile test up test_runner
```

## Reinicio completo del entorno

Si desea eliminar todos los contenedores, redes y volúmenes (incluyendo la base de datos), ejecute:

```docker
docker-compose down -v
```
Esto restablecerá completamente el entorno y eliminará todos los datos almacenados hasta el momento.

## Documentación de la API Rest

Para visualizar la documentación interactiva generada con **Swagger**, abra su navegador después haber ejecutado docker compose y visite:

```
http://localhost:5000/api-docs
```

Para visualizar la documentación de la parte de la autenticación viste

```
http://localhost:4000/api-docs
```

En ambos encontrará todos los endpoints documentados con su descripción, parámetros y códigos de respuesta.

## Visualización en tiempo real de base de datos

Puede usar PgAdmin para ver y gestionar la base de datos en tiempo real. Para ello, acceda desde su navegador a:

```
http://localhost:5050
```

Asegúrese de tener configuradas las credenciales desde el archivo `.env` o puede basarse en el archivo `template.env` incluido en el repositorio para un entorno funcional.

---

### Pasos para configurar PgAdmin y acceder  a la base de datos:

1. En PgAdmin, vaya a la parte superior izquierda donde **"Servers"**
   - Haga click derecho sobre *Servers* → **Register** → **Server...**
     
2. En la pestaña **General**:
   - En el campo **Name**, puede escribir por ejemplo: `PG Docker`.
     
3. En la pestaña **Connection**:
   - **Host name/address**: `postgres_container` (o el valor de `POSTGRES_HOST` en el `.env`)
   - **Port**: `5432` (puede dejarlo igual)
   - **Maintenance database**: `apidb` (o `POSTGRES_DB`)
   - **Username**: `postgres` (o `POSTGRES_USER`)
   - **Password**: `postgres` (o `POSTGRES_PASSWORD`)
     
4. Haga click en **Save** para guardar la configuración y poder conectarse.

---

###  Consultar datos directamente desde PgAdmin:

Una vez conectado:

- Expanda el servidor que creó (`PG Docker`).
- Vaya a **Databases** → seleccione `apidb` o el valor de `POSTGRES_DB`.
- En la parte superior izquierda, en la sección de **Object Explorer**, haga click en el ícono de una base de datos negra con un cursor para abrir el **editor de consultas SQL**.
- Desde ahí, puede hacer consultas en tiempo real directamente sobre la base de datos PostgreSQL.

---

Autor: Pani
Última actualización: *`25/3/2025`*
