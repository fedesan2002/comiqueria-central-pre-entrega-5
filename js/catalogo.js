class Producto {
    constructor(id, nombre, precio, categoria, stock) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.stock = stock;
    }

    vender(cantidad) {
        if (!Number.isInteger(cantidad) || cantidad <= 0) {
            return {
                exito: false,
                mensaje: "La cantidad debe ser un número entero mayor a 0."
            };
        }

        if (cantidad > this.stock) {
            return {
                exito: false,
                mensaje: "No hay stock suficiente de " + this.nombre + "."
            };
        }

        this.stock -= cantidad;

        return {
            exito: true,
            mensaje:
                "Se vendieron " + cantidad + " unidad(es) de " +
                this.nombre + ". Stock restante: " + this.stock + "."
        };
    }

    reponer(cantidad) {
        if (!Number.isInteger(cantidad) || cantidad <= 0) {
            return {
                exito: false,
                mensaje: "La cantidad a reponer debe ser mayor a 0."
            };
        }

        this.stock += cantidad;

        return {
            exito: true,
            mensaje:
                "Se repusieron " + cantidad + " unidad(es) de " +
                this.nombre + ". Stock actual: " + this.stock + "."
        };
    }

    obtenerPrecioConIva() {
        return this.precio * 1.21;
    }
}


// Instancias creadas a partir de la clase Producto.
const productoBatman = new Producto(
    1,
    "Batman",
    8500,
    "Cómic",
    6
);

const productoSpiderMan = new Producto(
    2,
    "Spider-Man",
    9000,
    "Cómic",
    5
);

const productoJujutsuKaisen = new Producto(
    3,
    "Jujutsu Kaisen",
    7500,
    "Manga",
    8
);

const productoVinlandSaga = new Producto(
    4,
    "Vinland Saga",
    11000,
    "Manga",
    4
);

const productoOnePiece = new Producto(
    5,
    "One Piece",
    7200,
    "Manga",
    10
);

const productoKagurabachi = new Producto(
    6,
    "Kagurabachi",
    7800,
    "Manga",
    7
);

const productoDandadan = new Producto(
    7,
    "Dandadan",
    7600,
    "Manga",
    5
);

const productoDaredevil = new Producto(
    8,
    "Daredevil",
    12000,
    "Cómic",
    3
);

const productoChainsawMan = new Producto(
    9,
    "Chainsaw Man",
    7900,
    "Manga",
    6
);


const catalogo = [
    productoBatman,
    productoSpiderMan,
    productoJujutsuKaisen,
    productoVinlandSaga,
    productoOnePiece
];


function formatearPrecio(valor) {
    return "$" + valor.toLocaleString("es-AR");
}


function modificarCatalogo() {
    catalogo.push(productoDandadan);

    catalogo.unshift(productoKagurabachi);

    const eliminadoFinal = catalogo.pop();
    console.log(
        "Se ha eliminado el elemento: " + eliminadoFinal.nombre
    );

    catalogo.unshift(productoChainsawMan);

    const eliminadoInicio = catalogo.shift();
    console.log(
        "Se eliminó del inicio: " + eliminadoInicio.nombre
    );

    const indiceModificar = 2;
    const productoAnterior = catalogo[indiceModificar];

    catalogo.splice(indiceModificar, 1, productoDaredevil);

    console.log(
        "Se reemplazó \"" + productoAnterior.nombre +
        "\" por \"" + catalogo[indiceModificar].nombre + "\""
    );

    catalogo.push(productoDandadan);
}


function obtenerReporteCatalogo(lista) {
    let mensaje = "CATÁLOGO DISPONIBLE\n\n";

    for (const producto of lista) {
        mensaje +=
            "Producto: " + producto.nombre + "\n" +
            "Categoría: " + producto.categoria + "\n" +
            "Precio: " + formatearPrecio(producto.precio) + "\n" +
            "Stock: " + producto.stock + "\n\n";
    }

    console.log(mensaje);

    return mensaje;
}


function buscarProducto(nombreBuscado) {
    const nombresEnMinuscula = [];

    for (const producto of catalogo) {
        nombresEnMinuscula.push(producto.nombre.toLowerCase());
    }

    const busqueda = nombreBuscado.trim().toLowerCase();

    if (nombresEnMinuscula.includes(busqueda)) {
        const posicion = nombresEnMinuscula.indexOf(busqueda);
        const productoEncontrado = catalogo[posicion];

        return {
            existe: true,
            posicion: posicion,
            producto: productoEncontrado,
            nombre: productoEncontrado.nombre
        };
    }

    return {
        existe: false,
        posicion: -1,
        producto: null,
        nombre: ""
    };
}


function obtenerProductoPorId(idProducto) {
    for (const producto of catalogo) {
        if (producto.id === idProducto) {
            return producto;
        }
    }

    return null;
}


function renderizarCatalogo() {
    const contenedor = document.getElementById("productosGrid");

    let html = "";
    let indice = 0;

    for (const producto of catalogo) {
        const idSeguro = JSON.stringify(producto.id);
        const botonDeshabilitado = producto.stock === 0 ? "disabled" : "";
        const textoBoton =
            producto.stock > 0
                ? "Agregar al carrito"
                : "Sin stock";

        html +=
            "<article class=\"product-card\" id=\"producto-" +
            producto.id + "\">" +
                "<div class=\"product-cover cover-" + (indice % 6) + "\">" +
                    "<span>" + producto.nombre + "</span>" +
                "</div>" +
                "<div class=\"product-info\">" +
                    "<span class=\"product-category\">" +
                        producto.categoria +
                    "</span>" +
                    "<h3>" + producto.nombre + "</h3>" +
                    "<p class=\"price\">" +
                        formatearPrecio(producto.precio) +
                    "</p>" +
                    "<p>Stock disponible: " + producto.stock + "</p>" +
                    "<button type=\"button\" " + botonDeshabilitado +
                        " onclick='agregarAlCarrito(" + idSeguro + ")'>" +
                        textoBoton +
                    "</button>" +
                "</div>" +
            "</article>";

        indice++;
    }

    contenedor.innerHTML = html;
}


function mostrarPruebaDeObjetos() {
    console.log("Instancias creadas con new:");
    console.log(productoBatman);
    console.log(productoSpiderMan);
    console.log(productoJujutsuKaisen);

    const ventaDePrueba = productoBatman.vender(1);
    console.log(ventaDePrueba.mensaje);
    console.log(
        "Stock de Batman después de vender: " + productoBatman.stock
    );

    const reposicionDePrueba = productoBatman.reponer(1);
    console.log(reposicionDePrueba.mensaje);
    console.log(
        "Stock final de Batman: " + productoBatman.stock
    );

    console.log(
        "Precio con IVA de Batman: " +
        formatearPrecio(productoBatman.obtenerPrecioConIva())
    );
}
