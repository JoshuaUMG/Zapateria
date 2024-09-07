document.addEventListener('DOMContentLoaded', function() {
    const vendedoresTable = document.getElementById('vendedoresTable').getElementsByTagName('tbody')[0];

    // Obtener todos los vendedores
    fetch('/api/vendedores')
        .then(response => response.json())
        .then(data => {
            const tableBody = vendedoresTable;
            tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevos datos
            data.forEach(vendedor => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${vendedor.id_vendedores}</td>
                    <td>${vendedor.nombre}</td>
                    <td>${vendedor.dpi}</td>
                    <td>${vendedor.edad}</td>
                    <td>${vendedor.telefono}</td>
                    <td>${vendedor.direccion}</td>
                    <td>${vendedor.tienda_asignada}</td>
                    <td>
                        <button onclick="editVendedor(${vendedor.id_vendedores})">Editar</button>
                        <button onclick="deleteVendedor(${vendedor.id_vendedores})">Eliminar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));

    // Funciones para editar y eliminar (puedes implementar más adelante)
    window.editVendedor = function(id) {
        // Implementa la funcionalidad de edición aquí
        console.log('Editar vendedor con ID:', id);
    };

    window.deleteVendedor = function(id) {
        // Implementa la funcionalidad de eliminación aquí
        console.log('Eliminar vendedor con ID:', id);
    };
});
