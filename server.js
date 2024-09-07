const Fastify = require('fastify');
const fastifyStatic = require('@fastify/static');
const fastifyCors = require('@fastify/cors');
const path = require('path');
const mysql = require('mysql2');

// Crear instancia de Fastify
const fastify = Fastify();

// Configurar CORS para Fastify
fastify.register(fastifyCors);

// Configurar el plugin fastify-static para servir archivos estáticos
fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/', // Rutas accesibles desde el root
});

// Configurar la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'bp7c1qkgysowdr1vvw8x-mysql.services.clever-cloud.com',
    user: 'umoorekkhbl7oudd',
    password: 'xelOVMnW7eI5ndrpRZ1k',
    database: 'bp7c1qkgysowdr1vvw8x'
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) throw err;
    console.log('Conexión a la base de datos establecida!');
});

// Ruta de login en Fastify
fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body;

    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM usuarios WHERE usuario = ? AND contrasenia = ?', [username, password], (err, rows) => {
            if (err) {
                console.error('Error en la consulta:', err);
                reply.status(500).send({ success: false, message: 'Error en el servidor' });
                return reject(err);
            }

            if (rows.length > 0) {
                // Usuario autenticado
                reply.send({ success: true, message: 'Login exitoso' });
                return resolve();
            } else {
                // Usuario no autenticado
                reply.send({ success: false, message: 'Usuario o contraseña incorrectos' });
                return resolve();
            }
        });
    });
});

// Iniciar el servidor de Fastify
const PORT = 3001;
fastify.listen(PORT, (err, address) => {
    if (err) {
        console.error('Error al iniciar Fastify:', err);
        process.exit(1);
    }
    console.log(`Servidor Fastify corriendo en ${address}`);
});
