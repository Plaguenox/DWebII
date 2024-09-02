document.addEventListener('DOMContentLoaded', () => {
    const botonCarrito = document.getElementById('botoncarrito');
    const botonesComprar = document.querySelectorAll('.comprar');
    const botonesMas = document.querySelectorAll('.mas');
    const botonesMenos = document.querySelectorAll('.menos');
    const botonesPeso = document.querySelectorAll('.kg');
    const carritoModal = document.getElementById('carrito-modal');
    const carritoContenido = document.getElementById('carrito-contenido');
    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    const confirmarPagoBtn = document.getElementById('confirmar-pago');

    let pesoSeleccionado = {};

    function agregarAlCarrito(item) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const index = carrito.findIndex(producto => producto.id === item.id && producto.peso === item.peso);
        if (index !== -1) {
            carrito[index].cantidad += item.cantidad;
        } else {
            carrito.push(item);
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        alert('Artículo agregado al carrito');
    }

    function mostrarCarrito() {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoContenido.innerHTML = '';
        carrito.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('carrito-item');
            itemDiv.innerHTML = `
                <p>${item.nombre}</p>
                <p>${item.precio}</p>
                <p>Peso: ${item.peso} Kg</p>
                <p>Cantidad: ${item.cantidad}</p>
                <button class="quitar-item" data-index="${index}">Quitar</button>
            `;
            carritoContenido.appendChild(itemDiv);
        });
        carritoModal.style.display = 'flex';

        document.querySelectorAll('.quitar-item').forEach(boton => {
            boton.addEventListener('click', (e) => {
                quitarDelCarrito(e.target.getAttribute('data-index'));
            });
        });
    }

    function quitarDelCarrito(index) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    }

    function vaciarCarrito() {
        localStorage.removeItem('carrito');
        mostrarCarrito();
    }

    function confirmarPago() {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        if (carrito.length === 0) {
            alert('El carrito está vacío. Añade productos antes de confirmar el pago.');
            return;
        }
        alert('Pago confirmado. Gracias por su compra.');
        vaciarCarrito();
    }

    botonesComprar.forEach(boton => {
        boton.addEventListener('click', () => {
            const id = boton.getAttribute('data-id');
            const cantidad = parseInt(document.getElementById(`cantidad-${id}`).innerText);
            const peso = pesoSeleccionado[id] || 1;
            const item = {
                id: id,
                nombre: boton.getAttribute('data-nombre'),
                precio: boton.getAttribute('data-precio'),
                cantidad: cantidad,
                peso: peso
            };
            agregarAlCarrito(item);
        });
    });

    botonesPeso.forEach(boton => {
        boton.addEventListener('click', () => {
            const id = boton.getAttribute('data-id');
            const peso = parseInt(boton.getAttribute('data-peso'));
            pesoSeleccionado[id] = peso;

            document.querySelectorAll(`.kg[data-id="${id}"]`).forEach(boton => {
                boton.classList.remove('kg-seleccionado');
            });

            boton.classList.add('kg-seleccionado');
        });
    });

    botonesMas.forEach(boton => {
        boton.addEventListener('click', () => {
            const id = boton.getAttribute('data-id');
            const cantidadElem = document.getElementById(`cantidad-${id}`);
            let cantidad = parseInt(cantidadElem.innerText);
            if (cantidad < 10) {
                cantidad++;
                cantidadElem.innerText = cantidad;
            } else {
                alert('No puedes comprar más de 10 productos.');
            }
        });
    });

    botonesMenos.forEach(boton => {
        boton.addEventListener('click', () => {
            const id = boton.getAttribute('data-id');
            const cantidadElem = document.getElementById(`cantidad-${id}`);
            let cantidad = parseInt(cantidadElem.innerText);
            if (cantidad > 1) {
                cantidad--;
                cantidadElem.innerText = cantidad;
            } else {
                alert('Debes comprar al menos 1 producto.');
            }
        });
    });

    botonCarrito.addEventListener('click', mostrarCarrito);

    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

    confirmarPagoBtn.addEventListener('click', confirmarPago);
    document.getElementById('close-carrito-modal').addEventListener('click', () => {
        document.getElementById('carrito-modal').style.display = 'none';
    });
});


