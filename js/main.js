const NOMBRE_TIENDA = "Comiquería Central";

let carrito = [];


const calcularSubtotal = (cantidad, precio) => cantidad * precio;


function calcularDescuento(cantidad, subtotal) {
    if (cantidad >= 3) {
        return subtotal * 0.10;
    }

    if (cantidad === 2) {
        return subtotal * 0.05;
    }

    return 0;
}


function agregarAlCarrito(idProducto) {
    const producto = obtenerProductoPorId(idProducto);

    if (producto === null) {
        alert("No se encontró el producto seleccionado.");
        return;
    }

    const resultadoVenta = producto.vender(1);

    if (!resultadoVenta.exito) {
        alert(resultadoVenta.mensaje);
        return;
    }

    carrito.push(producto.id);

    console.log(resultadoVenta.mensaje);

    renderizarCatalogo();
    actualizarCarrito();
    abrirCarrito();
}


function quitarUnaUnidad(idProducto) {
    const posicion = carrito.indexOf(idProducto);

    if (posicion === -1) {
        return;
    }

    carrito.splice(posicion, 1);

    const producto = obtenerProductoPorId(idProducto);

    if (producto !== null) {
        producto.reponer(1);
    }

    renderizarCatalogo();
    actualizarCarrito();
}


function eliminarProductoDelCarrito(idProducto) {
    let cantidadEliminada = 0;

    while (carrito.includes(idProducto)) {
        const posicion = carrito.indexOf(idProducto);
        carrito.splice(posicion, 1);
        cantidadEliminada++;
    }

    const producto = obtenerProductoPorId(idProducto);

    if (producto !== null && cantidadEliminada > 0) {
        producto.reponer(cantidadEliminada);
    }

    renderizarCatalogo();
    actualizarCarrito();
}


function devolverProductosAlStock() {
    for (const idProducto of carrito) {
        const producto = obtenerProductoPorId(idProducto);

        if (producto !== null) {
            producto.reponer(1);
        }
    }
}


function vaciarCarrito() {
    if (carrito.length === 0) {
        alert("El carrito ya está vacío.");
        return;
    }

    devolverProductosAlStock();
    carrito.splice(0, carrito.length);

    renderizarCatalogo();
    actualizarCarrito();
}


function contarProducto(idProducto) {
    let cantidad = 0;

    for (const productoDelCarrito of carrito) {
        if (productoDelCarrito === idProducto) {
            cantidad++;
        }
    }

    return cantidad;
}


function obtenerProductosUnicos() {
    const productosUnicos = [];

    for (const idProducto of carrito) {
        if (!productosUnicos.includes(idProducto)) {
            productosUnicos.push(idProducto);
        }
    }

    return productosUnicos;
}


function calcularTotalCarrito() {
    let total = 0;

    for (const idProducto of carrito) {
        const producto = obtenerProductoPorId(idProducto);

        if (producto !== null) {
            total += producto.precio;
        }
    }

    return total;
}


function actualizarCarrito() {
    const contador = document.getElementById("cantidadCarrito");
    const contenido = document.getElementById("carritoContenido");
    const totalElemento = document.getElementById("totalCarrito");

    contador.textContent = carrito.length;

    const total = calcularTotalCarrito();

    totalElemento.textContent = formatearPrecio(total);

    if (carrito.length === 0) {
        contenido.innerHTML =
            "<p class=\"empty-cart\">" +
                "Todavía no agregaste ningún producto." +
            "</p>";

        return;
    }

    const productosUnicos = obtenerProductosUnicos();

    let html = "";

    for (const idProducto of productosUnicos) {
        const producto = obtenerProductoPorId(idProducto);

        if (producto === null) {
            continue;
        }

        const cantidad = contarProducto(idProducto);
        const subtotal = calcularSubtotal(cantidad, producto.precio);
        const idSeguro = JSON.stringify(producto.id);

        html +=
            "<div class=\"cart-item\">" +
                "<div>" +
                    "<h3>" + producto.nombre + "</h3>" +
                    "<p class=\"cart-item-price\">" +
                        formatearPrecio(producto.precio) + " c/u" +
                    "</p>" +
                    "<p class=\"cart-item-price\">" +
                        "Stock disponible: " + producto.stock +
                    "</p>" +
                "</div>" +
                "<div class=\"cart-subtotal\">" +
                    formatearPrecio(subtotal) +
                "</div>" +
                "<div class=\"cart-item-controls\">" +
                    "<button class=\"quantity-btn\" type=\"button\" " +
                        "onclick='quitarUnaUnidad(" + idSeguro + ")'>" +
                        "−" +
                    "</button>" +
                    "<span class=\"quantity\">" + cantidad + "</span>" +
                    "<button class=\"quantity-btn\" type=\"button\" " +
                        "onclick='agregarAlCarrito(" + idSeguro + ")'>" +
                        "+" +
                    "</button>" +
                    "<button class=\"remove-btn\" type=\"button\" " +
                        "onclick='eliminarProductoDelCarrito(" +
                        idSeguro + ")'>" +
                        "Eliminar" +
                    "</button>" +
                "</div>" +
            "</div>";
    }

    contenido.innerHTML = html;
}


function abrirCarrito() {
    document.getElementById("carritoPanel").classList.add("open");
    document.getElementById("carritoOverlay").classList.add("visible");
    document.body.classList.add("cart-open");
}


function cerrarCarrito() {
    document.getElementById("carritoPanel").classList.remove("open");
    document.getElementById("carritoOverlay").classList.remove("visible");
    document.body.classList.remove("cart-open");
}


function finalizarCompra() {
    if (carrito.length === 0) {
        alert("Agregá al menos un producto antes de finalizar la compra.");
        return;
    }

    const total = calcularTotalCarrito();

    alert(
        "Compra simulada correctamente.\\n\\n" +
        "Productos: " + carrito.length + "\\n" +
        "Total: " + formatearPrecio(total)
    );

    carrito.splice(0, carrito.length);

    actualizarCarrito();
    cerrarCarrito();
}


function buscarDesdeWeb() {
    const input = document.getElementById("buscarInput");
    const mensaje = document.getElementById("mensajeBusqueda");

    const texto = input.value.trim();

    if (texto === "") {
        mensaje.textContent =
            "Escribí el nombre de un producto para buscar.";
        mensaje.className = "search-message error";
        return;
    }

    const resultado = buscarProducto(texto);

    document.querySelectorAll(".product-card").forEach(function (card) {
        card.classList.remove("highlight");
    });

    if (resultado.existe) {
        mensaje.textContent =
            resultado.nombre + " está disponible en el índice " +
            resultado.posicion + ". Precio: " +
            formatearPrecio(resultado.producto.precio) +
            ". Stock: " + resultado.producto.stock + ".";

        mensaje.className = "search-message ok";

        const card = document.getElementById(
            "producto-" + resultado.producto.id
        );

        if (card) {
            card.classList.add("highlight");

            card.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

        return;
    }

    mensaje.textContent =
        "\"" + texto + "\" no se encuentra en el catálogo.";
    mensaje.className = "search-message error";
}


function solicitarCantidad(producto) {
    let ingreso = prompt(
        "¿Cuántas unidades querés comprar?\\n" +
        "Stock disponible: " + producto.stock
    );

    if (ingreso === null) {
        return null;
    }

    let cantidad = Number(ingreso);

    while (
        !Number.isInteger(cantidad) ||
        cantidad <= 0 ||
        cantidad > producto.stock
    ) {
        let mensaje =
            "Ingresá una cantidad entera mayor a 0.";

        if (cantidad > producto.stock) {
            mensaje =
                "Solo hay " + producto.stock + " unidad(es) disponibles.";
        }

        ingreso = prompt(mensaje);

        if (ingreso === null) {
            return null;
        }

        cantidad = Number(ingreso);
    }

    return cantidad;
}


function iniciarSimulador() {
    alert("Bienvenido a " + NOMBRE_TIENDA);

    const reporte = obtenerReporteCatalogo(catalogo);

    const productoIngresado = prompt(
        reporte + "Escribí el producto que querés comprar:"
    );

    if (
        productoIngresado === null ||
        productoIngresado.trim() === ""
    ) {
        alert("Operación cancelada.");
        return;
    }

    const resultado = buscarProducto(productoIngresado);

    if (!resultado.existe) {
        alert(
            productoIngresado + " no se encuentra en el catálogo."
        );
        return;
    }

    const producto = resultado.producto;

    alert(
        producto.nombre + " está disponible.\\n" +
        "Precio: " + formatearPrecio(producto.precio) + "\\n" +
        "Stock: " + producto.stock
    );

    const cantidad = solicitarCantidad(producto);

    if (cantidad === null) {
        alert("Operación cancelada.");
        return;
    }

    const resultadoVenta = producto.vender(cantidad);

    if (!resultadoVenta.exito) {
        alert(resultadoVenta.mensaje);
        return;
    }

    const subtotal = calcularSubtotal(cantidad, producto.precio);
    const descuento = calcularDescuento(cantidad, subtotal);
    const total = subtotal - descuento;

    const mensaje =
        "RESUMEN DE COMPRA\\n\\n" +
        "Producto: " + producto.nombre + "\\n" +
        "Cantidad: " + cantidad + "\\n" +
        "Subtotal: " + formatearPrecio(subtotal) + "\\n" +
        "Descuento: " + formatearPrecio(descuento) + "\\n" +
        "Total: " + formatearPrecio(total) + "\\n" +
        "Stock restante: " + producto.stock;

    alert(mensaje);
    console.log(mensaje);
    console.log(resultadoVenta.mensaje);

    let unidadesAgregadas = 0;

    while (unidadesAgregadas < cantidad) {
        carrito.push(producto.id);
        unidadesAgregadas++;
    }

    renderizarCatalogo();
    actualizarCarrito();
    abrirCarrito();
}


document.addEventListener("DOMContentLoaded", function () {
    // Las operaciones de arrays se ejecutan una sola vez al cargar.
    modificarCatalogo();

    renderizarCatalogo();
    actualizarCarrito();

    console.log("Catálogo preparado:");
    console.table(catalogo);
    mostrarPruebaDeObjetos();

    document
        .getElementById("buscarBtn")
        .addEventListener("click", buscarDesdeWeb);

    document
        .getElementById("buscarInput")
        .addEventListener("keydown", function (evento) {
            if (evento.key === "Enter") {
                buscarDesdeWeb();
            }
        });

    document
        .getElementById("abrirCarritoBtn")
        .addEventListener("click", abrirCarrito);

    document
        .getElementById("navCarritoBtn")
        .addEventListener("click", abrirCarrito);

    document
        .getElementById("cerrarCarritoBtn")
        .addEventListener("click", cerrarCarrito);

    document
        .getElementById("carritoOverlay")
        .addEventListener("click", cerrarCarrito);

    document
        .getElementById("vaciarCarritoBtn")
        .addEventListener("click", vaciarCarrito);

    document
        .getElementById("finalizarCompraBtn")
        .addEventListener("click", finalizarCompra);
});
