document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const usuarioInput = document.getElementById('usuario').value;
    const passwordInput = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');

    const usuarioValido = "admin";
    const passwordValido = "12345";

    if (usuarioInput === usuarioValido && passwordInput === passwordValido) {
        errorMsg.style.color = "#22c55e";
        errorMsg.textContent = "Acceso exitoso. Cargando panel...";
        
        setTimeout(() => {
            cargarPanelPrincipal();
        }, 500);
    } else {
        errorMsg.style.color = "#ef4444";
        errorMsg.textContent = "Usuario o contraseña incorrectos.";
    }
});

function cargarPanelPrincipal() {
    const cuerpoHtml = document.body;
    cuerpoHtml.innerHTML = `
        <div class="dashboard-layout">
            <!-- Barra Superior -->
            <header class="top-bar">
                <div class="left-section">
                    <div class="dropdown">
                        <button class="btn-dots" onclick="toggleMenu(event)" title="Opciones avanzadas">⋮</button>
                        <div id="dropdownMenu" class="dropdown-content">
                            <div class="dropdown-header">Filtros por Estado</div>
                            <button onclick="filtrarEstado('todos')">📂 Ver todos los expedientes</button>
                            <button onclick="filtrarEstado('En cola')">⏳ Ver casos En Cola</button>
                            <button onclick="filtrarEstado('En proceso')">🔄 Ver casos En Proceso</button>
                            <button onclick="filtrarEstado('Resuelto')">✅ Ver casos Resueltos</button>
                            <hr>
                            <div class="dropdown-header">Filtros por Materia</div>
                            <button onclick="filtrarMateria('todos')">⚖️ Todas las materias</button>
                            <button onclick="filtrarMateria('Civil')">🏛️ Civil</button>
                            <button onclick="filtrarMateria('Penal')">⚖️ Penal</button>
                            <button onclick="filtrarMateria('Familia')">👨‍👩‍👧 Familia</button>
                            <button onclick="filtrarMateria('Laboral')">💼 Laboral</button>
                            <hr>
                            <button onclick="window.print()">🖨️ Imprimir reporte</button>
                            <button onclick="limpiarTabla()" class="text-danger">🗑️ Limpiar todos los registros</button>
                        </div>
                    </div>
                    <h2 class="app-title">⚖️ Despacho Jurídico</h2>
                </div>

                <div class="right-section">
                    <span class="user-badge">👤 Abogado en Turno</span>
                    <button onclick="location.reload()" class="btn-logout">Cerrar Sesión</button>
                </div>
            </header>

            <!-- Contenido Principal -->
            <main class="main-content">
                
                <!-- Tarjetas Informativas -->
                <section class="summary-cards">
                    <div class="summary-card badge-today">
                        <div class="card-icon">📅</div>
                        <div class="card-info">
                            <span id="cantAtencionesHoy">0</span>
                            <small>Atenciones de Hoy</small>
                        </div>
                    </div>
                    <div class="summary-card badge-process">
                        <div class="card-icon">⚖️</div>
                        <div class="card-info">
                            <span id="cantEnProceso">0</span>
                            <small>En Proceso Judicial</small>
                        </div>
                    </div>
                    <div class="summary-card badge-queue">
                        <div class="card-icon">⏳</div>
                        <div class="card-info">
                            <span id="cantEnCola">0</span>
                            <small>En Cola</small>
                        </div>
                    </div>
                </section>

                <!-- Formulario de Registro -->
                <section class="card form-card">
                    <h3>Registrar Nueva Atención / Expediente</h3>
                    <form id="atencionForm">
                        <div class="form-grid">
                            <div class="input-group">
                                <label>Cliente</label>
                                <input type="text" id="cliCliente" placeholder="Ej. Juan Pérez" required autocomplete="off">
                            </div>
                            <div class="input-group">
                                <label>N° Asunto / Expediente</label>
                                <input type="text" id="cliAsunto" placeholder="Ej. 00123-2026" required autocomplete="off">
                            </div>
                            <div class="input-group">
                                <label>Fecha</label>
                                <input type="date" id="cliFecha" required>
                            </div>
                            <div class="input-group">
                                <label>Hora</label>
                                <input type="time" id="cliHora" required>
                            </div>
                            <div class="input-group">
                                <label>Tipo de Causa</label>
                                <select id="cliMateria" required>
                                    <option value="Civil">Civil</option>
                                    <option value="Penal">Penal</option>
                                    <option value="Familia">Familia</option>
                                    <option value="Laboral">Laboral</option>
                                </select>
                            </div>
                            <div class="input-group">
                                <label>Juzgado Destino</label>
                                <select id="cliJuzgado" required>
                                    <option value="Juzgado Local">Juzgado Local</option>
                                    <option value="Juzgado Distrito">Juzgado Distrito</option>
                                    <option value="Tribunal de Apelación">Tribunal de Apelación</option>
                                </select>
                            </div>
                            <div class="input-group full-width">
                                <label>Descripción del Caso / Objeto de Atención</label>
                                <input type="text" id="cliCaso" placeholder="Ej. Demanda ejecutiva singular" required autocomplete="off">
                            </div>
                            <div class="input-group">
                                <label>Estado del Caso</label>
                                <select id="cliEstado" required>
                                    <option value="En cola">En cola</option>
                                    <option value="En proceso">En proceso</option>
                                    <option value="Resuelto">Resuelto</option>
                                </select>
                            </div>
                            <div class="input-group full-width">
                                <label>Próxima Actuación Procesal</label>
                                <input type="text" id="cliActuacion" placeholder="Ej. Presentar escrito de contestación (Manual)" autocomplete="off">
                            </div>
                        </div>
                        <button type="submit" class="btn-guardar">+ Guardar y Sincronizar Registro</button>
                    </form>
                </section>

                <!-- Tabla de Expedientes con Buscador Integrado -->
                <section class="card table-card">
                    <div class="table-header">
                        <h3>Expedientes y Atenciones Registradas</h3>
                        <div class="table-controls">
                            <input type="text" id="inputBuscador" placeholder="🔍 Buscar por cliente o asunto..." onkeyup="buscarExpediente()" autocomplete="off">
                            <span id="contadorCasos" class="counter-tag">0 Registros</span>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>N° Asunto</th>
                                    <th>Cliente</th>
                                    <th>Fecha / Hora</th>
                                    <th>Causa / Juzgado</th>
                                    <th>Detalle del Caso</th>
                                    <th>Próx. Actuación</th>
                                    <th>Estado</th>
                                    <th style="text-align: right;">Acción</th>
                                </tr>
                            </thead>
                            <tbody id="tablaAtenciones">
                                <!-- Se llena desde LocalStorage -->
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    `;

    inicializarLogicaCasos();
    cargarCasosGuardados();
}

// Menú desplegable
function toggleMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('show');
}

window.onclick = function(event) {
    const menu = document.getElementById('dropdownMenu');
    if (menu && menu.classList.contains('show')) {
        menu.classList.remove('show');
    }
};

function inicializarLogicaCasos() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('cliFecha').value = hoy;
    
    const horaActual = new Date().toTimeString().slice(0,5);
    document.getElementById('cliHora').value = horaActual;

    document.getElementById('atencionForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const nuevoCaso = {
            id: Date.now(),
            cliente: document.getElementById('cliCliente').value,
            asunto: document.getElementById('cliAsunto').value,
            fecha: document.getElementById('cliFecha').value,
            hora: document.getElementById('cliHora').value,
            materia: document.getElementById('cliMateria').value,
            juzgado: document.getElementById('cliJuzgado').value,
            caso: document.getElementById('cliCaso').value,
            estado: document.getElementById('cliEstado').value,
            actuacion: document.getElementById('cliActuacion').value || 'Ninguna registrada'
        };

        guardarCasoEnStorage(nuevoCaso);
        renderizarCasos();

        document.getElementById('cliCliente').value = '';
        document.getElementById('cliAsunto').value = '';
        document.getElementById('cliCaso').value = '';
        document.getElementById('cliActuacion').value = '';
        document.getElementById('cliCliente').focus();
    });
}

function obtenerCasosStorage() {
    let casos = localStorage.getItem('expedientes_juridicos');
    return casos ? JSON.parse(casos) : [];
}

function guardarCasoEnStorage(caso) {
    let casos = obtenerCasosStorage();
    casos.push(caso);
    localStorage.setItem('expedientes_juridicos', JSON.stringify(casos));
}

function cargarCasosGuardados() {
    renderizarCasos();
}

function renderizarCasos() {
    const tbody = document.getElementById('tablaAtenciones');
    const casos = obtenerCasosStorage();

    if (casos.length === 0) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="8">No hay atenciones ni expedientes registrados.</td></tr>`;
        actualizarEstadisticas();
        return;
    }

    tbody.innerHTML = '';
    casos.forEach(c => {
        let badgeClass = 'badge-cola';
        if (c.estado === 'En proceso') badgeClass = 'badge-proceso';
        if (c.estado === 'Resuelto') badgeClass = 'badge-resuelto';

        const fila = document.createElement('tr');
        fila.dataset.estado = c.estado;
        fila.dataset.materia = c.materia;
        fila.innerHTML = `
            <td><strong>${c.asunto}</strong></td>
            <td class="td-cliente">${c.cliente}</td>
            <td><small>${c.fecha}<br>${c.hora}</small></td>
            <td><span class="tag-materia">${c.materia}</span><br><small>${c.juzgado}</small></td>
            <td>${c.caso}</td>
            <td><em class="actuacion-text">${c.actuacion}</em></td>
            <td><span class="badge ${badgeClass}">${c.estado}</span></td>
            <td style="text-align: right;">
                <button onclick="eliminarCaso(${c.id})" class="btn-eliminar">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    });

    actualizarEstadisticas();
}

function eliminarCaso(id) {
    let casos = obtenerCasosStorage();
    casos = casos.filter(c => c.id !== id);
    localStorage.setItem('expedientes_juridicos', JSON.stringify(casos));
    renderizarCasos();
}

function actualizarEstadisticas() {
    const casos = obtenerCasosStorage();
    const hoy = new Date().toISOString().split('T')[0];
    
    let atencionesHoy = 0;
    let enProceso = 0;
    let enCola = 0;

    casos.forEach(c => {
        if (c.fecha === hoy) atencionesHoy++;
        if (c.estado === 'En proceso') enProceso++;
        if (c.estado === 'En cola') enCola++;
    });

    document.getElementById('cantAtencionesHoy').textContent = atencionesHoy;
    document.getElementById('cantEnProceso').textContent = enProceso;
    document.getElementById('cantEnCola').textContent = enCola;

    const contador = document.getElementById('contadorCasos');
    if (contador) {
        contador.textContent = `${casos.length} ${casos.length === 1 ? 'Registro' : 'Registros'}`;
    }
}

// Filtro rápido por estado desde los tres puntos
function filtrarEstado(estadoFiltro) {
    const filas = document.querySelectorAll('#tablaAtenciones tr:not(.empty-row)');
    filas.forEach(fila => {
        if (estadoFiltro === 'todos' || fila.dataset.estado === estadoFiltro) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

// Filtro rápido por tipo de materia (Civil, Penal, Familia, Laboral)
function filtrarMateria(materiaFiltro) {
    const filas = document.querySelectorAll('#tablaAtenciones tr:not(.empty-row)');
    filas.forEach(fila => {
        if (materiaFiltro === 'todos' || fila.dataset.materia === materiaFiltro) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

// Buscador instantáneo por texto
function buscarExpediente() {
    const texto = document.getElementById('inputBuscador').value.toLowerCase();
    const filas = document.querySelectorAll('#tablaAtenciones tr:not(.empty-row)');

    filas.forEach(fila => {
        const contenidoFila = fila.textContent.toLowerCase();
        if (contenidoFila.includes(texto)) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    });
}

function limpiarTabla() {
    if (confirm("¿Estás seguro de eliminar todos los registros guardados?")) {
        localStorage.removeItem('expedientes_juridicos');
        renderizarCasos();
    }
}

// FUNCIÓN PUNTO 5: Exportar todos los registros a Excel (Formato CSV compatible)
function exportarAExcel() {
    const casos = obtenerCasosStorage();
    if (casos.length === 0) {
        alert("No hay registros para exportar.");
        return;
    }

    let csvContent = "\uFEFFN° Asunto;Cliente;Fecha;Hora;Materia;Juzgado;Detalle Caso;Próxima Actuación;Documento;Estado\n";
    casos.forEach(c => {
        csvContent += `"${c.asunto}";"${c.cliente}";"${c.fecha}";"${c.hora}";"${c.materia}";"${c.juzgado}";"${c.caso}";"${c.actuacion}";"${c.archivo}";"${c.estado}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reporte_expedientes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function limpiarTabla() {
    if (confirm("¿Estás seguro de eliminar todos los registros guardados?")) {
        localStorage.removeItem('expedientes_juridicos');
        renderizarCasos();
    }
}