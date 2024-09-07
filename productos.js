document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = '/api/productos';
    const productsTableBody = document.querySelector('#productsTable tbody');
    const searchInput = document.getElementById('search');
    const productModal = document.getElementById('productModal');
    const closeModal = document.querySelector('.close');
    const productForm = document.getElementById('productForm');
    const addProductButton = document.getElementById('addProductButton');
    let editingProductId = null;

    const fetchProducts = async () => {
        try {
            const response = await fetch(apiUrl);
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const displayProducts = (products) => {
        productsTableBody.innerHTML = '';
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id_zapato}</td>
                <td>${product.modelo}</td>
                <td>${product.marca}</td>
                <td>${product.talla}</td>
                <td>${product.color}</td>
                <td>${product.stock}</td>
                <td>${product.medidas}</td>
                <td>${product.precio}</td>
                <td>
                    <button class="edit-button" data-id="${product.id_zapato}">Editar</button>
                    <button class="delete-button" data-id="${product.id_zapato}">Eliminar</button>
                </td>
            `;
            productsTableBody.appendChild(row);
        });
        addEventListeners();
    };

    const addEventListeners = () => {
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', () => {
                editingProductId = button.getAttribute('data-id');
                showModalForEdit();
            });
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', async () => {
                const productId = button.getAttribute('data-id');
                if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
                    try {
                        await fetch(`${apiUrl}/${productId}`, { method: 'DELETE' });
                        fetchProducts();
                    } catch (error) {
                        console.error('Error deleting product:', error);
                    }
                }
            });
        });
    };

    const showModalForEdit = async () => {
        try {
            const response = await fetch(`${apiUrl}/${editingProductId}`);
            const product = await response.json();
            document.getElementById('modalTitle').textContent = 'Editar Producto';
            document.getElementById('productId').value = product.id_zapato;
            document.getElementById('modelo').value = product.modelo;
            document.getElementById('marca').value = product.marca;
            document.getElementById('talla').value = product.talla;
            document.getElementById('color').value = product.color;
            document.getElementById('stock').value = product.stock;
            document.getElementById('medidas').value = product.medidas;
            document.getElementById('precio').value = product.precio;
            productModal.style.display = 'block';
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    closeModal.addEventListener('click', () => {
        productModal.style.display = 'none';
    });

    productForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const productData = {
            modelo: document.getElementById('modelo').value,
            marca: document.getElementById('marca').value,
            talla: document.getElementById('talla').value,
            color: document.getElementById('color').value,
            stock: document.getElementById('stock').value,
            medidas: parseFloat(document.getElementById('medidas').value),
            precio: parseFloat(document.getElementById('precio').value),
        };

        try {
            if (editingProductId) {
                await fetch(`${apiUrl}/${editingProductId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData),
                });
            } else {
                await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData),
                });
            }
            productModal.style.display = 'none';
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    });

    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase();
        document.querySelectorAll('#productsTable tbody tr').forEach(row => {
            const cells = Array.from(row.getElementsByTagName('td'));
            const isVisible = cells.some(cell => cell.textContent.toLowerCase().includes(searchValue));
            row.style.display = isVisible ? '' : 'none';
        });
    });

    addProductButton.addEventListener('click', () => {
        editingProductId = null;
        document.getElementById('modalTitle').textContent = 'Agregar Producto';
        document.getElementById('productForm').reset();
        productModal.style.display = 'block';
    });

    fetchProducts();
});
