document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cursosForm');
    const tableBody = document.getElementById('cursosTable').querySelector('tbody');
    let isUpdating = false;

    //async permite que la función se comporte de manera asíncrona, 
    //puede ejecutar operaciones sin bloquear el hilo principal de ejecucion
    const fetchCursos = async () => {
        //luego cambiaremos la url por https://<hostdepanywhere>/productos
        const response = await fetch('https://Silaba70.pythonanywhere.com/cursos');// promesa: esperar a que se complete la solicitud HTTP
        const cursos = await response.json(); //esperar a que se complete la conversión de la respuesta a JSON
        tableBody.innerHTML = '';
        cursos.forEach(cursos => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cursos.id}</td>
                <td>${cursos.nombre}</td>
                <td>${cursos.dictado_por}</td>
                <td>${cursos.fecha}</td>
                <td>${cursos.precio}</td>
                <td>
                    <button onclick="editCursos(${cursos.id}, '${cursos.nombre}', ${cursos.dictado_por}, ${cursos.fecha},${cursos.precio})">Editar</button>
                    <button onclick="deleteCursos(${cursos.id})">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    };

    const addCursos = async (cursos) => {
        await fetch('https://Silaba70.pythonanywhere.com/agregar_cursos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cursos)
        });
        fetchCursos();
    };

    const updateCursos = async (id, cursos) => {
        await fetch(`https://Silaba70.pythonanywhere.com/actualizar_cursos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cursos)
        });
        fetchCursos();
    };

    const deleteCursos = async (id) => {
        await fetch(`https://Silaba70.pythonanywhere.com/quitar_curso/${id}`, {
            method: 'DELETE'
        });
        fetchCursos();
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('cursosId').value;
        const nombre = document.getElementById('nombre').value;
        const dictado_por = document.getElementById('dictado_por').value;
        const fecha = document.getElementById('fecha').value;
        const precio = document.getElementById('precio').value;
        const cursos = { nombre, dictado_por, fecha, precio };

        if (isUpdating) {
            updateCursos(id, cursos);
            isUpdating = false;
        } else {
            addCursos(cursos);
        }

        form.reset();
        document.getElementById('cursosId').value = '';
    });

    window.editCursos = (id, nombre, cantidad, precio) => {
        document.getElementById('cursosId').value = id;
        document.getElementById('nombre').value = nombre;
        document.getElementById('cantidad').value = dictado_por;
        document.getElementById('cantidad').value = fecha;
        document.getElementById('precio').value = precio;
        isUpdating = true;
    };

    window.deleteCursos = (id) => {
        if (confirm('¿Estás seguro de eliminar este curso?')) {
            deleteCursos(id);
        }
    };

    fetchCursos();
});
