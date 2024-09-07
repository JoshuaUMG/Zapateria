const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); // Importar cors
const app = express();

// Configurar CORS
app.use(cors());

// Configurar body-parser para manejar datos de solicitud POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

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
    console.log('Conexión establecida exitosamente!');
});

// Servir el archivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ======== Manejo de Usuarios ========

// Ruta para manejar el login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Consulta a la base de datos
    connection.query('SELECT * FROM usuarios WHERE usuario = ? AND contrasenia = ?', [username, password], (err, rows) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }

        if (rows.length > 0) {
            // Usuario autenticado
            res.json({ success: true, message: 'Login exitoso' });
        } else {
            // Usuario no autenticado
            res.json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }
    });
});

// Ruta para manejar el registro de usuarios
app.post('/register', (req, res) => {
    const { username, password, role } = req.body;

    // Validar que el rol es válido
    if (role !== 'admin' && role !== 'vendedor') {
        return res.status(400).json({ success: false, message: 'Rol no válido' });
    }

    // Consulta para insertar el nuevo usuario en la base de datos
    connection.query('INSERT INTO usuarios (usuario, contrasenia, roles) VALUES (?, ?, ?)', [username, password, role], (err, result) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }

        // Devolver el id_usuario generado
        res.json({ success: true, message: 'Usuario registrado exitosamente', id_usuario: result.insertId });
    });
});

// Ruta para obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
    connection.query('SELECT id_usuario, usuario, roles FROM usuarios', (err, rows) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }

        res.json(rows);
    });
});

// Ruta para obtener un usuario por ID
app.get('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;

    connection.query('SELECT id_usuario, usuario, roles FROM usuarios WHERE id_usuario = ?', [id], (err, rows) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        } 

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    });
});

// Ruta para actualizar un usuario por ID
app.put('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { username, password, role } = req.body;

    if (role !== 'admin' && role !== 'vendedor') {
        return res.status(400).json({ success: false, message: 'Rol no válido' });
    }

    connection.query('UPDATE usuarios SET usuario = ?, contrasenia = ?, roles = ? WHERE id_usuario = ?', [username, password, role, id], (err, result) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Usuario actualizado exitosamente' });
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    });
});

// Ruta para eliminar un usuario por ID
app.delete('/api/usuarios/:id', (req, res) => {
    const { id } = req.params;

    connection.query('DELETE FROM usuarios WHERE id_usuario = ?', [id], (err, result) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }

        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Usuario eliminado exitosamente' });
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    });
});

// ======== Manejo de Vendedores ========

// Ruta para obtener todos los vendedores
app.get('/api/vendedores', (req, res) => {
    connection.query('SELECT * FROM vendedores', (err, rows) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }
        res.json(rows);
    });
});

// Ruta para obtener un vendedor por ID
app.get('/api/vendedores/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM vendedores WHERE id_vendedores = ?', [id], (err, rows) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }
        res.json(rows[0]);
    });
});

// Ruta para agregar un nuevo vendedor
app.post('/api/vendedores', (req, res) => {
    const { nombre, dpi, edad, telefono, direccion, tienda_asignada } = req.body;
    const query = 'INSERT INTO vendedores (nombre, dpi, edad, telefono, direccion, tienda_asignada) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [nombre, dpi, edad, telefono, direccion, tienda_asignada], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }
        res.status(201).json({ success: true, id: results.insertId });
    });
});


// Ruta para actualizar un vendedor
app.put('/api/vendedores/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, dpi, edad, telefono, direccion, tienda_asignada } = req.body;
    const query = 'UPDATE vendedores SET nombre = ?, dpi = ?, edad = ?, telefono = ?, direccion = ?, tienda_asignada = ? WHERE id_vendedores = ?';
    connection.query(query, [nombre, dpi, edad, telefono, direccion, tienda_asignada, id], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }
        res.status(200).json({ success: true });
    });
});

// Ruta para obtener los detalles de un vendedor
app.get('/api/vendedores/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM vendedores WHERE id_vendedores = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }
        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).json({ success: false, message: 'Vendedor no encontrado' });
        }
    });
});


// Ruta para eliminar un vendedor
app.delete('/api/vendedores/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM vendedores WHERE id_vendedores = ?', [id], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }
        res.json({ success: true });
    });
});

// ======= PRODUCTOS ========

// Ruta para obtener todos los productos
app.get('/api/productos', (req, res) => {
    connection.query('SELECT * FROM zapatos', (err, rows) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }
        res.json(rows);
    });
});

// Ruta para obtener un producto por ID
app.get('/api/productos/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM zapatos WHERE id_zapato = ?', [id], (err, rows) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }
        res.json(rows[0]);
    });
});

// Ruta para agregar un nuevo producto
app.post('/api/productos', (req, res) => {
    const { modelo, marca, talla, color, stock, medidas, precio } = req.body;
    const query = 'INSERT INTO zapatos (modelo, marca, talla, color, stock, medidas, precio) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [modelo, marca, talla, color, stock, medidas, precio], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }
        res.status(201).json({ success: true, id: results.insertId });
    });
});

// Ruta para actualizar un producto
app.put('/api/productos/:id', (req, res) => {
    const id = req.params.id;
    const { modelo, marca, talla, color, stock, medidas, precio } = req.body;
    const query = 'UPDATE zapatos SET modelo = ?, marca = ?, talla = ?, color = ?, stock = ?, medidas = ?, precio = ? WHERE id_zapato = ?';
    connection.query(query, [modelo, marca, talla, color, stock, medidas, precio, id], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }
        res.json({ success: true });
    });
});

// Ruta para eliminar un producto
app.delete('/api/productos/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM zapatos WHERE id_zapato = ?', [id], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }
        res.json({ success: true });
    });
});



// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
