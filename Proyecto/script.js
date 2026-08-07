let libros = [];
let editandoId = null;


const formulario = document.getElementById("formLibro");
const titulo = document.getElementById("titulo");
const autor = document.getElementById("autor");
const genero = document.getElementById("genero");
const anio = document.getElementById("anio");

const tabla = document.getElementById("tablaLibros");
const mensaje = document.getElementById("mensaje");

const buscar = document.getElementById("buscar");
const filtroGenero = document.getElementById("filtroGenero");
const ordenar = document.getElementById("ordenar");

const totalLibros = document.getElementById("totalLibros");


formulario.addEventListener("submit", guardarLibro);
buscar.addEventListener("input", actualizarVista);
filtroGenero.addEventListener("change", actualizarVista);
ordenar.addEventListener("change", actualizarVista);


function guardarLibro(e){

    e.preventDefault();

    if(!validarFormulario()){
        return;
    }

    const libro = {

        id: Date.now(),

        titulo: titulo.value.trim(),

        autor: autor.value.trim(),

        genero: genero.value,

        anio: Number(anio.value)

    };

    if(editandoId == null){

        // PUSH
        libros.push(libro);

        mostrarMensaje("Libro registrado correctamente.", true);

    }else{

        // FINDINDEX

        const indice = libros.findIndex(libro => libro.id === editandoId);

        libros[indice] = {

            id: editandoId,

            titulo: titulo.value.trim(),

            autor: autor.value.trim(),

            genero: genero.value,

            anio: Number(anio.value)

        };

        editandoId = null;

        document.getElementById("btnGuardar").textContent="Guardar Libro";

        mostrarMensaje("Libro actualizado correctamente.", true);

    }

    formulario.reset();

    actualizarVista();

}

function validarFormulario(){

    if(titulo.value.trim()===""){
        mostrarMensaje("Ingrese el título.");
        return false;
    }

    if(autor.value.trim()===""){
        mostrarMensaje("Ingrese el autor.");
        return false;
    }

    if(genero.value===""){
        mostrarMensaje("Seleccione un género.");
        return false;
    }

    if(anio.value===""){
        mostrarMensaje("Ingrese el año.");
        return false;
    }

    if(Number(anio.value)<1000 || Number(anio.value)>2100){

        mostrarMensaje("El año no es válido.");

        return false;

    }

    return true;

}


function mostrarMensaje(texto, exito=false){

    mensaje.textContent = texto;

    if(exito){

        mensaje.className="exito";

    }else{

        mensaje.className="error";

    }

    setTimeout(()=>{

        mensaje.style.display="none";

        mensaje.className="";

    },3000);

}

function actualizarVista(){

    let resultado = [...libros];


    resultado = resultado.filter(libro=>{

        return libro.titulo
            .toLowerCase()
            .includes(
                buscar.value.toLowerCase()
            );

    });

    if(filtroGenero.value!="Todos"){

        resultado = resultado.filter(libro=>{

            return libro.genero===filtroGenero.value;

        });

    }

    if(ordenar.value==="titulo"){

        resultado.sort((a,b)=>{

            return a.titulo.localeCompare(b.titulo);

        });

    }

    if(ordenar.value==="anio"){

        resultado.sort((a,b)=>{

            return a.anio-b.anio;

        });

    }

    mostrarTabla(resultado);

}

function mostrarTabla(lista){

    tabla.innerHTML="";

    // MAP

    const filas = lista.map(libro=>{

        return `

        <tr>

            <td>${libro.titulo}</td>

            <td>${libro.autor}</td>

            <td>${libro.genero}</td>

            <td>${libro.anio}</td>

            <td>

                <button
                    class="btnEditar"
                    onclick="editarLibro(${libro.id})">

                    Editar

                </button>

                <button
                    class="btnEliminar"
                    onclick="eliminarLibro(${libro.id})">

                    Eliminar

                </button>

            </td>

        </tr>

        `;

    });

    tabla.innerHTML = filas.join("");

    totalLibros.textContent =
        "Total de libros: " + lista.length;

}


function editarLibro(id){

    const libro = libros.find(libro=>{

        return libro.id===id;

    });

    titulo.value = libro.titulo;

    autor.value = libro.autor;

    genero.value = libro.genero;

    anio.value = libro.anio;

    editandoId = id;

    document.getElementById("btnGuardar").textContent="Actualizar Libro";

}

function eliminarLibro(id){

    const indice = libros.findIndex(libro=>{

        return libro.id===id;

    });

    // SPLICE

    libros.splice(indice,1);

    actualizarVista();

    mostrarMensaje("Libro eliminado.",true);

}