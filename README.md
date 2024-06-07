# **SDH Inc Chat Application**

## **Tabla de Contenido**

1. [Descripción](#descripción)
2. [Funcionalidades](#funcionalidades)
3. [Requisitos](#requisitos)
4. [Instalación](#instalación)
   - [Usar Docker](#usar-docker)
   - [Sin Docker](#sin-docker)
     - [Configurar el servidor](#configurar-el-servidor)
     - [Configurar el frontend](#configurar-el-frontend)
5. [Uso](#uso)
6. [Imagenes del proyecto ](#imagenes-del-proyecto)


## **Descripción**

SDH Inc Chat es una aplicación de chat en tiempo real construida con React en el frontend, Node.js en el backend y MySQL como base de datos. Permite a los usuarios conectarse, enviar y recibir mensajes instantáneos.

## **Funcionalidades**

- **Registro de Usuarios**: Los usuarios pueden unirse al chat proporcionando un nombre de usuario.
- **Lista de Usuarios Conectados**: Muestra una lista de los usuarios actualmente conectados.
- **Mensajería en Tiempo Real**: Los usuarios pueden enviar y recibir mensajes en tiempo real.
- **Historial de Mensajes**: Se guarda el historial de mensajes entre usuarios.

## **Requisitos**

- Node.js
- MySQL
- npm (Node Package Manager)
- Docker
- Docker Compose

## **Instalación**

### **Usar Docker**

1. **Clonar el repositorio**

    ```bash
    https://github.com/davidriano02/sdh_inc_chat.git
    cd sdh-inc-chat
    ```

2. **Configurar el archivo `.env`**

    Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

    ```
    MYSQL_ROOT_PASSWORD=tu_contraseña
    MYSQL_DATABASE=sdh_inc_chat
    MYSQL_USER=tu_usuario
    MYSQL_PASSWORD=tu_contraseña
    ```

3. **Construir y levantar los contenedores**

    ```bash
    docker-compose up --build
    ```

    La aplicación debería estar corriendo en `http://localhost:3000`.



### **Sin Docker**

Si prefieres instalar y ejecutar la aplicación sin Docker, sigue estos pasos:

#### **Configurar el servidor**

1. **Navega a la carpeta del servidor:**

    ```bash
    cd server
    ```

2. **Instala las dependencias:**

    ```bash
    npm install
    ```

3. **Configura la base de datos MySQL:**

    - Crea una base de datos llamada `sdh_inc_chat`.
    - Importa la estructura de la base de datos desde el archivo `sdh_inc_chat.sql`.

    ```sql
    CREATE DATABASE sdh_inc_chat;
    USE sdh_inc_chat;

    -- Tabla de usuarios
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE
    );

    -- Tabla de mensajes
    CREATE TABLE messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT,
        receiver_id INT,
        message TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id),
        FOREIGN KEY (receiver_id) REFERENCES users(id)
    );

    -- Insertar usuarios y mensajes de prueba
    INSERT INTO users (username) VALUES 
    ('David'),
    ('Jose'),
    ('Miguel'),
    ('Tata'),
    ('Camila');

    INSERT INTO messages (sender_id, receiver_id, message) VALUES
    (1, 2, 'Hola'),
    (1, 3, 'Hola'),
    (2, 1, 'Hola'),
    (2, 4, 'Hola'),
    (3, 1, 'Hola'),
    (3, 5, 'Hola'),
    (4, 1, 'Hola'),
    (4, 2, 'Hola'),
    (5, 1, 'Hola'),
    (5, 3, 'Hola');

    -- Verificar los datos
    SELECT * FROM users;
    SELECT * FROM messages;
    ```

4. **Inicia el servidor:**

    ```bash
    npm run dev
    ```

#### **Configurar el frontend**

1. **Navega a la carpeta del frontend:**

    ```bash
    cd client
    ```

2. **Instala las dependencias:**

    ```bash
    npm install
    ```

3. **Inicia la aplicación React:**

    ```bash
    npm start
    ```

    La aplicación debería estar corriendo en `http://localhost:3000`.

## **Uso**

1. Abre la aplicación en el navegador.
2. Ingresa un nombre de usuario para unirte al chat.
3. Selecciona un usuario de la lista para iniciar una conversación.
4. Envía y recibe mensajes en tiempo real.

## **Imagenes del Proyecto**

1. Inicio de chat.
   
![image](https://github.com/davidriano02/sdh_inc_chat/assets/132162397/a2ffde01-922f-4d63-834a-c2e8cc692d2d)

2. interfaz del chat donde evidenciamos quien inicio sesion y que usuario estan conectados.
   
![image](https://github.com/davidriano02/sdh_inc_chat/assets/132162397/0dc82a7c-4cb9-4397-95e7-57ce78a39a3e)

3. Chat en tiempo real, notificacion de nuevo mensaje y historial de chat almacenados.

   ![image](https://github.com/davidriano02/sdh_inc_chat/assets/132162397/79647620-1c97-4697-869d-3ffbc7f0d2c4)
   ![image](https://github.com/davidriano02/sdh_inc_chat/assets/132162397/acc5ceaf-f010-46e7-a7ca-c296dcc505be)
4. Contenedor de Docker con Imagen del Servidor, CLiente (frontend)y base de datos .
   ![image](https://github.com/davidriano02/sdh_inc_chat/assets/132162397/cdd30374-9e8c-4044-b508-6cb03c60aad9)





