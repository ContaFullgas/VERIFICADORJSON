

//variable para almacenar el archivo que se arrastra o se selecciona
let file;

//variable para manipular la etiqueta input para seleccionar un archivo
const adjuntarArchivo = document.getElementById('adjuntarArchivo');

// Manejar el evento change del input para cuando se seleccionan archivos
adjuntarArchivo.addEventListener('change', () => {
    file = adjuntarArchivo.files[0];  // Acceder al primer (y único) archivo seleccionado
    console.log(file.name);

    // ---------------------------------
    validarNombreDeArchivoZip();
    // ---------------------------------

});

const dropAreaImpresion = document.getElementById('dropArea');
const adjuntarArchivoImpresion = document.getElementById('adjuntarArchivo');

erroresTitulo = document.getElementById("erroresTitulo");
listadoErorresNombreArchivo = document.getElementById('listadoErorresNombreArchivo');

const fechaDelArchivo = document.getElementById('fechaDelArchivo');

const sumaVolumenCompras = document.getElementById('sumaVolumenCompras');
const sumaVolumenVentas = document.getElementById('sumaVolumenVentas');
const sumaImporteVentas = document.getElementById('sumaImporteVentas');

const dieselTitulo = document.getElementById('dieselTitulo');
const volumenComprasDieselImpresion = document.getElementById('volumenComprasDiesel');
const volumenVentasDieselImpresion = document.getElementById('volumenVentasDiesel');
const importeVentasDieselImpresion = document.getElementById('importeVentasDiesel');

const magnaTitulo = document.getElementById('magnaTitulo');
const volumenComprasMagnaImpresion = document.getElementById('volumenComprasMagna');
const volumenVentasMagnaImpresion = document.getElementById('volumenVentasMagna');
const importeVentasMagnaImpresion = document.getElementById('importeVentasMagna');

const premiumTitulo = document.getElementById('premiumTitulo');
const volumenComprasPremiumImpresion = document.getElementById('volumenComprasPremium');
const volumenVentasPremiumImpresion = document.getElementById('volumenVentasPremium');
const importeVentasPremiumImpresion = document.getElementById('importeVentasPremium');

const rfcContribuyenteImpresion = document.getElementById('rfcContribuyente');
const rfcProveedorImpresion = document.getElementById('rfcProveedor');

const numPermisoImpresion = document.getElementById('numPermiso');
const caracterPermisoImpresion = document.getElementById('caracterPermisos');
const numeroDispensariosImpresion = document.getElementById('numeroDispensarios');

const nombreArchivoImpreso = document.getElementById("nombreArchivoImpreso");

// const botonLimpiar = document.getElementById("botonLimpiar");
// document.getElementById("botonReiniciarPagina").addEventListener("click", actualizarPagina);

//variables globales para javascript arreglos
var arrayDeCadenas = [];
var arrayFechaCadenas = [];
var arrayErroresNombreArchivo = [];
//Arreglo RFC contribuyentes
var arrayRFC_contribuyente = ['SEM1410318Q5','SEC150112537','SES150112RC3','SEM1512187Y9','SEB151218B36','SEC141031S67','SEC20082165A','JGE900406818',
                                'SEY0704139A8','CACX7605101P8','CGM130531NS2','CARJ521227GH5','SEC1503037FA','SEM141031V5A','SES150112RC3',
                                'AET1404031U2','SYU110901LR9','SEI1410319R7','SEC150204U97','SER150303GN5','SEM070413TA9','SEM150204RK4'];

// Metodos para controlar los eventos del area en donde se arrastra el zip
dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.style.borderColor = '#005BB5';
});
dropArea.addEventListener('dragleave', () => {
    dropArea.style.borderColor = '#0087F7';
});

//metodo para capturar el archivo zip y realizar las operaciones pertinentes con el
dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.style.borderColor = '#0087F7';
    file = event.dataTransfer.files[0];

    validarNombreDeArchivoZip();
});

//metodo para validar el nombre del archivo zip
function validarNombreDeArchivoZip()
{
    //Valida si el archivo no termina en .zip
    if (!file.name.endsWith('.zip')) 
        {
            //si no es un zip, manda una alerta y actualiza la página para reiniciar
            alert("El archivo no es de tipo zip");
            // actualizarPagina();
            location.reload();
        }

    // Captura del nombre del archivo zip en la variable nombreArchivo
    var nombreArchivo = file.name;
    var espacio = "_"; //separador del ciclo
    // metodo para dividir el nombre del archivo en un arreglo para despues analizarlo
    dividirCadena(nombreArchivo,espacio);   

    //Evaluaciones del nombre del archivo ----------------------------------------------------
    //Evaluar la primer letra del tipo del archivo
    if(arrayDeCadenas[0] !== "M" && arrayDeCadenas[0] !== "D")
    {
        arrayErroresNombreArchivo.push("Identificador del tipo de documento");
    }

    //Evalua el ID de envio sea de 36 caracteres
    if(arrayDeCadenas[1].length !== 36)
    {
        arrayErroresNombreArchivo.push("Identificador de envio");
    }

    //Evalua en RFC del contribuyente sea de 12 o 13 caracteres
    if(arrayDeCadenas[2].length !== 12 && arrayDeCadenas[2].length !== 13)
    {
        arrayErroresNombreArchivo.push("RFC del contribuyente");
    }

    //Evalua el RFC del proveedor sea de 12 o 13 caracteres
    if(arrayDeCadenas[3].length !== 12 && arrayDeCadenas[3].length !== 13)
    {
        arrayErroresNombreArchivo.push("RFC del proveedor");
    }

    var separador2 = "-";
    dividirCadenaFecha(arrayDeCadenas[4], separador2);

    //Llamada al metodo para evaluar la fecha
    if (!esFechaValida(arrayFechaCadenas))
    {
        arrayErroresNombreArchivo.push("Fecha invalida");
    }

    //Evalua clave de identificación de la instalación, debe ser de 8 caracteres
    if(!contarCaracteresAlfanumericos(arrayDeCadenas[5]))
    {
        arrayErroresNombreArchivo.push("Clave de instalacion");
    }
    
    //Evalua clave de tipo de reporte, debe ser de 3 caracteres y solo letras
    if(!contarCaracteresClaves(arrayDeCadenas[6]))
    {
        arrayErroresNombreArchivo.push("Clave de tipo de reporte");
    }

    //condicion que evalua que este bien escrito JSON y sea un zip
    if(arrayDeCadenas[7] !== "JSON.zip")
    {
        arrayErroresNombreArchivo.push("El nombre del archivo no termina en JSON.zip");
    }

    console.log(arrayDeCadenas);
    console.log(arrayErroresNombreArchivo);
    // ------------------------------------------------------------------------------------------

    //Si no hay errores se abre el zip y se lee el json
    if(arrayErroresNombreArchivo == 0)
    {
        accederAlZipYLeerJson();
    }
    //Si hay errores se muestran en pantalla y no se ejecuta
    else
    {
        // var text = "";
        // //Se recorre el arreglo de errores y se imprimen
        // for (var i = 0; i < arrayErroresNombreArchivo.length; i++) {
        // text += '<li>'+arrayErroresNombreArchivo[i]+'</li>';
        // }
        // document.getElementById("listadoErorresNombreArchivo").innerHTML = text;
        var text = "";
        // Se recorre el arreglo de errores y se agregan las filas
        for (var i = 0; i < arrayErroresNombreArchivo.length; i++) {
            text += '<div class="celda fw-bold border rounded-2 d-flex justify-content-start mt-3 mb-3 p-2" style="background-color: #d90429; font-family: sans-serif;">' + arrayErroresNombreArchivo[i] + '</div>';
        }
        // Insertar los errores en la tabla
        document.getElementById("camposTablaErroresNombreJson").innerHTML = text;
        
        //Ocultar elementos en pantalla
        //DropArea
        // document.getElementById("dropArea").style.display = "none";
        dropArea.classList.add("oculto");
        //Boton para adjuntar archivo
        adjuntarArchivoImpresion.classList.add("oculto");
        // botonLimpiar.classList.remove("oculto");
        tablaDatosJson.classList.add("oculto");

        //Mostrar elementos en pantalla
        // erroresTitulo.classList.remove("oculto");
        tablaErroresNombreJson.classList.remove("oculto");
        botonReiniciarPagina.classList.remove("oculto");
    }
}

//Funcion para abrir zip y leer json
function accederAlZipYLeerJson()
{
    if (file && file.name.endsWith('.zip')) 
        {
            const reader = new FileReader();

            reader.onload = async (e) => 
            {
                try 
                {
                    //la libreria JSZip accede al zip
                    const zip = await JSZip.loadAsync(e.target.result);
                    //se busca el archivo json
                    const jsonFileName = Object.keys(zip.files).find(name => name.endsWith('.json'));

                    if (jsonFileName) 
                    {
                        //si se encuentra el archivo json se guarda en la variable data
                        const jsonData = await zip.file(jsonFileName).async("text");
                        const data = JSON.parse(jsonData);
                        
                        //se recorre el json
                        //Sumatorias de cantidades
                        const totalRecepcionesValorNumerico = (data.Producto.reduce((sum, producto) => {
                            return sum + producto.ReporteDeVolumenMensual.Recepciones.SumaVolumenRecepcionMes.ValorNumerico;
                        }, 0)).toFixed(3);
                        const totalEntregasValorNumerico = (data.Producto.reduce((sum, producto) => {
                            return sum + producto.ReporteDeVolumenMensual.Entregas.SumaVolumenEntregadoMes.ValorNumerico;
                        }, 0)).toFixed(3);
                        const totalImporteEntregasMes = (data.Producto.reduce((sum, producto) => {
                            return sum + producto.ReporteDeVolumenMensual.Entregas.ImporteTotalEntregasMes;
                        }, 0)).toFixed(3);

                        //cantidades individuales DIESEL
                        const volumenComprasDiesel = data.Producto.find(producto => producto.MarcaComercial.toUpperCase() === "DIESEL")?.ReporteDeVolumenMensual.Recepciones.SumaVolumenRecepcionMes.ValorNumerico;
                        const volumenVentasDiesel = data.Producto.find(producto => producto.MarcaComercial.toUpperCase() === "DIESEL")?.ReporteDeVolumenMensual.Entregas.SumaVolumenEntregadoMes.ValorNumerico;
                        const importeVentasDiesel = data.Producto.find(producto => producto.MarcaComercial.toUpperCase() === "DIESEL")?.ReporteDeVolumenMensual.Entregas.ImporteTotalEntregasMes;
                        
                        //cantidades individuales MAGNA
                        const volumenComprasMagna = data.Producto.find(producto => producto.MarcaComercial.toUpperCase() === "MAGNA")?.ReporteDeVolumenMensual.Recepciones.SumaVolumenRecepcionMes.ValorNumerico;
                        const volumenVentasMagna = data.Producto.find(producto => producto.MarcaComercial.toUpperCase() === "MAGNA")?.ReporteDeVolumenMensual.Entregas.SumaVolumenEntregadoMes.ValorNumerico;
                        const importeVentasMagna = data.Producto.find(producto => producto.MarcaComercial.toUpperCase() === "MAGNA")?.ReporteDeVolumenMensual.Entregas.ImporteTotalEntregasMes;

                        //cantidades individuales PREMIUM
                        const volumenComprasPremium = data.Producto.find(producto => producto.MarcaComercial.toUpperCase() === "PREMIUM")?.ReporteDeVolumenMensual.Recepciones.SumaVolumenRecepcionMes.ValorNumerico;
                        const volumenVentasPremium = data.Producto.find(producto => producto.MarcaComercial.toUpperCase() === "PREMIUM")?.ReporteDeVolumenMensual.Entregas.SumaVolumenEntregadoMes.ValorNumerico;
                        const importeVentasPremium = data.Producto.find(producto => producto.MarcaComercial.toUpperCase() === "PREMIUM")?.ReporteDeVolumenMensual.Entregas.ImporteTotalEntregasMes;

                        //RFC contribuyente del json
                        const rfcContribuyente = data.RfcContribuyente;

                        //permiso CRE
                        const numPermiso = data.NumPermiso;
                        //caracterPermiso
                        const caracterPermiso = data.Caracter;
                        //numDispensario
                        const numDispensario = data.NumeroDispensarios;

                        //RFC proveedor json
                        const rfcProveedor = data.RfcProveedor;
                        // console.log(rfcProveedor);

                        //Se imprimen en la pagina web los resultados
                        fechaDelArchivo.textContent = `LA FECHA DEL ARCHIVO ES: ${arrayDeCadenas[4]}`;

                        sumaVolumenCompras.textContent = totalRecepcionesValorNumerico;
                        sumaVolumenVentas.textContent = totalEntregasValorNumerico;
                        sumaImporteVentas.textContent = totalImporteEntregasMes;
                        
                        volumenComprasDieselImpresion.textContent =  volumenComprasDiesel;
                        volumenVentasDieselImpresion.textContent = volumenVentasDiesel;
                        importeVentasDieselImpresion.textContent = importeVentasDiesel;

                        volumenComprasMagnaImpresion.textContent =  volumenComprasMagna;
                        volumenVentasMagnaImpresion.textContent = volumenVentasMagna;
                        importeVentasMagnaImpresion.textContent = importeVentasMagna;

                        volumenComprasPremiumImpresion.textContent =  volumenComprasPremium;
                        volumenVentasPremiumImpresion.textContent = volumenVentasPremium;
                        importeVentasPremiumImpresion.textContent = importeVentasPremium;

                        rfcContribuyenteImpresion.textContent = rfcContribuyente;
                        rfcProveedorImpresion.textContent = rfcProveedor;

                        //permiso cre
                        numPermisoImpresion.textContent = numPermiso;
                        //caracter permisos
                        caracterPermisoImpresion.textContent = caracterPermiso;
                        //
                        numeroDispensariosImpresion.textContent = numDispensario;
                        
                        nombreArchivoImpreso.textContent = file.name;

                        // errorDisplay.textContent = ""; 

                        //Ocultar elementos en pantalla
                        dropArea.classList.add("oculto");

                        // document.getElementById("dropArea").style.display = "none";
                        // adjuntarArchivoImpresion.classList.add("oculto");

                        //Mostrar elementos en pantalla
                        // fechaDelArchivo.classList.remove("oculto");
                        tablaDatosJson.classList.remove("oculto");
                        botonReiniciarPagina.classList.remove("oculto");

                        // Vaciar cuerpo de tabla por si se procesa otro archivo
                        const tbody = document.querySelector("#tablaRecepciones tbody");
                        tbody.innerHTML = "";

                        // Recorrer cada producto
                        data.Producto.forEach(producto => {
                        const marca = producto.MarcaComercial;
                        const recepciones = producto.ReporteDeVolumenMensual?.Recepciones?.Complemento || [];

                        recepciones.forEach(complemento => {
                            const nacionales = complemento.Nacional || [];
                            nacionales.forEach(nacional => {
                            const cfdis = nacional.CFDIs || [];
                            cfdis.forEach(cfdi => {
                                const tr = document.createElement("tr");

                                const tdMarca = document.createElement("td");
                                tdMarca.textContent = marca;
                                tr.appendChild(tdMarca);

                                const tdCfdi = document.createElement("td");
                                tdCfdi.textContent = cfdi.Cfdi || "";
                                tr.appendChild(tdCfdi);

                                const tdPrecioCompra = document.createElement("td");
                                tdPrecioCompra.textContent = cfdi.PrecioCompra ?? "";
                                tr.appendChild(tdPrecioCompra);

                                const tdTipoCfdi = document.createElement("td");
                                tdTipoCfdi.textContent = cfdi.TipoCfdi ?? "";
                                tr.appendChild(tdTipoCfdi);

                                const tdVolumen = document.createElement("td");
                                tdVolumen.textContent = cfdi.VolumenDocumentado?.ValorNumerico ?? "";
                                tr.appendChild(tdVolumen);

                                tbody.appendChild(tr);
                                });

                            });
                        });
                        });

                    } 
                    else 
                    {
                        //Error no se encontro el archivo json en el zip
                       alert("No se encontró un archivo JSON en el ZIP.");
                    //    actualizarPagina();
                        location.reload();
                    }
                } 
                catch (error) 
                {
                    //Error al procesar un archivo zip
                    alert("Error al procesar el archivo ZIP o JSON.",error);
                //    actualizarPagina();
                    location.reload();
                }
            };
            reader.readAsArrayBuffer(file);
        } 
        else 
        {
            //Error por si no se sube un archivo zip
           alert("Por favor, sube un archivo ZIP válido.");
        //    actualizarPagina();
            location.reload();
        }//Termino de condicion
}

//metodo para recargar una pagina web
function actualizarPagina()
{
    Swal.fire({
        title: '¿Quieres reiniciar?',
        text: 'Esto podría perder tu progreso actual.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Si clic en Aceptar, mostrar segunda alerta de confirmación
          location.reload();
        } 
        // else {
        //   // Si clic en Cancelar, mostrar alerta de cancelación
        //   Swal.fire('Cancelado');
        // }
      });
}

// Función para obtener la fecha actual
function getCurrentDate() {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date().toLocaleDateString('es-ES', options);
    document.getElementById('current-date').innerText = date;
}
// Al cargar la página, desplazarse hacia arriba
document.addEventListener('DOMContentLoaded', function() {
    window.scrollTo(0, 0);
});

// Llamar a la función para mostrar la fecha
getCurrentDate();

//Funcion para dividir la cadena de la fecha en un arreglo que separa el año, el mes y el dia
function dividirCadenaFecha(cadenaDividir2, separador2)
{
    arrayFechaCadenas = cadenaDividir2.split(separador2);
}

//metodo para validar que la fecha del documento sea valida
//evalua que un mes o dia esten fuera de rango, dia invalido, año negativo, formato incorrecto, valores no numericos
function esFechaValida(fecha) 
{
    //verifica que el arreglo tenga 3 elementos
    if (fecha.length !== 3) {
        return false;
    }

    //convierte en entero las variables
    const anio = parseInt(fecha[0], 10);
    const mes = parseInt(fecha[1], 10);
    const dia = parseInt(fecha[2], 10);

    // Validar año, mes y día, que no sean nulos o cero
    if (isNaN(anio) || isNaN(mes) || isNaN(dia) || anio < 0 || mes < 1 || mes > 12) {
        return false;
    }

    // Evalua días máximos por mes
    const diasPorMes = [31, (anio % 4 === 0 && (anio % 100 !== 0 || anio % 400 === 0)) ? 29 : 28,
                        31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    return dia >= 1 && dia <= diasPorMes[mes - 1];
}

//Metodo para dividir el nombre del archivo en cadenas en un arreglo, lo separa en id, idenvio, rfccontribuyente
//rfcproveedor, fechaperiodo, claveinstalacion, tipodereporte y estandar
function dividirCadena(cadenaDividir, separador)
{
    // variable global, divide la cadena en un array a partir del separador _
    arrayDeCadenas = cadenaDividir.split(separador);
}

function contarCaracteresAlfanumericos(cadena) 
{
    // Utilizamos una expresión regular para encontrar solo letras
    const letras = cadena.match(/[a-zA-Z]/g);
    // Si no hay letras, devolvemos 0, de lo contrario, devolvemos la longitud del array
    //return letras ? letras.length : 0;
    const numeros = cadena.match(/\d/g);
    if(letras.length == 3 && numeros.length == 4){
        return letras && numeros;
    }
    else{
        return false;
    }
}

function contarCaracteresClaves(cadena) 
{
    // Utilizamos una expresión regular para encontrar solo letras
    const letras = cadena.match(/[a-zA-Z]/g);
    // Si no hay letras, devolvemos 0, de lo contrario, devolvemos la longitud del array
    //return letras ? letras.length : 0;
    if(letras.length == 3)
    {
        return letras;
    }
    else
    {
        return false;
    }
}