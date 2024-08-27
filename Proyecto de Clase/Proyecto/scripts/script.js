document.addEventListener('DOMContentLoaded', () => {
    // Obtener elementos
    const loginButton = document.querySelector('.botoni .iniciar-sesin');
    const registerButtons = [document.querySelector('.botonr1 .iniciar-sesin'), document.querySelector('.botonr')];
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const cartonContent = document.getElementById('cartonContent');
    const searchButton = document.querySelector('.buscar');
    const logoutButton = document.querySelector('.botoncs .cerrar-sesion');
    
    const modals = {
        'ocio': document.getElementById('taskModal'),
        'compras': document.getElementById('taskModal'),
        'proyectos': document.getElementById('taskModal'),
        'hogar': document.getElementById('taskModal'),
        'aprendizaje': document.getElementById('taskModal'),
        'mascotas': document.getElementById('taskModal')
    };
    let currentCategory = '';

    // Mostrar y ocultar modales
    const showModal = (modal) => {
        if (modal) {
            modal.style.display = 'flex';
            if (cartonContent) cartonContent.classList.add('blur');
        }
    };

    const hideModal = (modal) => {
        if (modal) {
            modal.style.display = 'none';
            if (cartonContent) cartonContent.classList.remove('blur');
        }
    };

    // Función para cerrar todos los modales
    const closeAllModals = () => {
        Object.values(modals).forEach(modal => {
            if (modal && modal.style.display === 'flex') {
                hideModal(modal);
            }
        });
        if (loginModal && loginModal.style.display === 'flex') {
            hideModal(loginModal);
        }
        if (registerModal && registerModal.style.display === 'flex') {
            hideModal(registerModal);
        }
        if (modal2 && modal2.style.display === 'flex') {
            hideModal(modal2);
        }
    };

    // Manejador de eventos para la tecla Esc
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });

    // Manejo de inicio de sesión
    const handleLogin = () => {
        const username = loginModal.querySelector('.usuario').value;
        const password = loginModal.querySelector('.contrasea').value;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const validUser = users.find(user => user.username === username && user.password === password);

        if (validUser) {
            localStorage.setItem('currentUser', username);
            alert('Inicio de sesión exitoso. ¡Bienvenido!');
            hideModal(loginModal);
            window.location.assign('logeado.html');
        } else {
            alert('Usuario o contraseña incorrectos. Inténtalo nuevamente.');
        }
    };

    // Manejo de registro
    const handleRegister = () => {
        const username = registerModal.querySelector('.usuario').value;
        const password = registerModal.querySelector('.contrasea').value;
        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.some(user => user.username === username)) {
            alert('El nombre de usuario ya está registrado. Por favor, elige otro.');
        } else {
            users.push({ username, password });
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', username);
            alert('Registro exitoso.');
            hideModal(registerModal);
            window.location.assign('logeado.html');
        }
    };

    // Eventos de botones
    if (loginButton) {
        loginButton.addEventListener('click', () => showModal(loginModal));
    }

    registerButtons.forEach(button => {
        button?.addEventListener('click', () => showModal(registerModal));
    });

    if (loginModal) {
        const loginButtonInModal = loginModal.querySelector('.entrar');
        loginButtonInModal?.addEventListener('click', handleLogin);
    }

    if (registerModal) {
        const registerButtonInModal = registerModal.querySelector('.registrate');
        registerButtonInModal?.addEventListener('click', handleRegister);
    }

    searchButton?.addEventListener('click', () => alert('Nada encontrado'));

    logoutButton?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.assign('index.html');
    });

    // Funciones de tareas
    const taskModal = document.getElementById('taskModal');
    const addTaskButton = document.getElementById('addTaskButton');
    const closeModal = document.getElementById('closeModal');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    const getCurrentUser = () => localStorage.getItem('currentUser') || '';

    const addTask = (category, taskValue) => {
        try {
            const username = getCurrentUser();
            if (!taskValue.trim()) {
                alert('La tarea no puede estar vacía');
                return;
            }
            let tasks = JSON.parse(localStorage.getItem(`tasks_${username}_${category}`)) || [];
            tasks.push({ text: taskValue, completed: false });
            localStorage.setItem(`tasks_${username}_${category}`, JSON.stringify(tasks));
            loadTasks(category);
        } catch (error) {
            console.error('Error al agregar la tarea:', error);
        }
    };
    

    const loadTasks = (category) => {
        const username = getCurrentUser();
        let tasks = JSON.parse(localStorage.getItem(`tasks_${username}_${category}`)) || [];
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            if (task.completed) taskItem.classList.add('completed');

            taskItem.innerHTML = `
                <span>${task.text}</span>
                <div>
                    <button class="complete-btn" data-index="${index}">Completar</button>
                    <button class="edit-btn" data-index="${index}">Editar</button>
                    <button class="delete-btn" data-index="${index}">Eliminar</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });

        document.querySelectorAll('.complete-btn').forEach(button => {
            button.addEventListener('click', () => toggleComplete(category, button.dataset.index));
        });
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', () => editTask(category, button.dataset.index));
        });
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', () => deleteTask(category, button.dataset.index));
        });
    };

    const toggleComplete = (category, index) => {
        const username = getCurrentUser();
        let tasks = JSON.parse(localStorage.getItem(`tasks_${username}_${category}`)) || [];
        tasks[index].completed = !tasks[index].completed;
        localStorage.setItem(`tasks_${username}_${category}`, JSON.stringify(tasks));
        loadTasks(category);
    };

    const editTask = (category, index) => {
        const username = getCurrentUser();
        let tasks = JSON.parse(localStorage.getItem(`tasks_${username}_${category}`)) || [];
        const newText = prompt('Edita la tarea:', tasks[index].text);
        if (newText !== null) {
            tasks[index].text = newText.trim();
            localStorage.setItem(`tasks_${username}_${category}`, JSON.stringify(tasks));
            loadTasks(category);
        }
    };

    const deleteTask = (category, index) => {
        const username = getCurrentUser();
        let tasks = JSON.parse(localStorage.getItem(`tasks_${username}_${category}`)) || [];
        tasks.splice(index, 1);
        localStorage.setItem(`tasks_${username}_${category}`, JSON.stringify(tasks));
        loadTasks(category);
    };

    const showTaskModal = (category) => {
        const modal = modals[category];
        if (modal) {
            modal.style.display = 'flex';
            document.getElementById('modalTitle').innerText = category.charAt(0).toUpperCase() + category.slice(1);
            loadTasks(category);
        }
    };

    const hideTaskModal = () => {
        Object.values(modals).forEach(modal => {
            if (modal) modal.style.display = 'none';
        });
    };

    document.querySelectorAll('.ocio img').forEach(img => {
        img.addEventListener('click', (event) => {
            currentCategory = event.target.id;
            showTaskModal(currentCategory);
        });
    });

    addTaskButton?.addEventListener('click', () => {
        const taskValue = taskInput.value.trim();
        if (taskValue) {
            addTask(currentCategory, taskValue);
            taskInput.value = '';
        } else {
            alert('No se puede agregar una tarea vacía');
        }
    });

    closeModal?.addEventListener('click', hideTaskModal);

    // Inicializar modales si se necesitan
    if (loginModal) hideModal(loginModal);
    if (registerModal) hideModal(registerModal);
    Object.values(modals).forEach(modal => hideModal(modal));
});

// Modales de aprendizaje
const modal2 = document.getElementById('modal2');
const sidebotonaprende = document.querySelector('.sidebotonaprende');
const closeModal2 = document.getElementById('closeModal2');
const saveSuggestion = document.getElementById('saveSuggestion');

const htmlButton = document.getElementById('htmlButton');
const cssButton = document.getElementById('cssButton');
const jsButton = document.getElementById('jsButton');
const suggestions = document.getElementById('suggestions');

let currentSuggestion = '';

// Función para mostrar el modal de aprendizaje
sidebotonaprende.addEventListener('click', () => {
    modal2.style.display = 'flex';
});

// Función para ocultar el modal de aprendizaje
closeModal2.addEventListener('click', () => {
    modal2.style.display = 'none';
});

// Función para actualizar las sugerencias según el botón clicado
function showSuggestions(content) {
    suggestions.innerHTML = content;
    currentSuggestion = content;  // Guarda el contenido actual para usarlo más tarde
}

// Función para guardar las sugerencias en el local storage
function saveToLocalStorage() {
    let aprendizaje = JSON.parse(localStorage.getItem('aprendizaje')) || [];
    if (currentSuggestion && !aprendizaje.includes(currentSuggestion)) {
        aprendizaje.push(currentSuggestion);
        localStorage.setItem('aprendizaje', JSON.stringify(aprendizaje));
    }
}

htmlButton.addEventListener('click', () => {
    showSuggestions(`
        <h3>HTML</h3>
        <p>Entender la estructura básica: Aprende sobre etiquetas como <code>&lt;html&gt;</code>, <code>&lt;head&gt;</code>, <code>&lt;body&gt;</code>, <code>&lt;title&gt;</code>, etc.</p>
        <p>Etiquetas de texto: Familiarízate con etiquetas como <code>&lt;h1&gt;</code> a <code>&lt;h6&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;a&gt;</code>, <code>&lt;strong&gt;</code>, <code>&lt;em&gt;</code>.</p>
        <p>Imágenes y multimedia: Aprende a usar <code>&lt;img&gt;</code>, <code>&lt;audio&gt;</code>, <code>&lt;video&gt;</code>.</p>
        <p>Listas: Practica con <code>&lt;ul&gt;</code>, <code>&lt;ol&gt;</code>, <code>&lt;li&gt;</code>.</p>
        <p>Tablas: Conoce las etiquetas <code>&lt;table&gt;</code>, <code>&lt;tr&gt;</code>, <code>&lt;td&gt;</code>, <code>&lt;th&gt;</code>.</p>
        <p>Formularios: Aprende a crear formularios con <code>&lt;form&gt;</code>, <code>&lt;input&gt;</code>, <code>&lt;label&gt;</code>, <code>&lt;button&gt;</code>.</p>
        <p>Enlaces: Usa <code>&lt;a&gt;</code> para crear enlaces y navegar entre páginas.</p>
        <p>Comentarios: Utiliza <code>&lt;!-- comentario --&gt;</code> para agregar notas en tu código.</p>
        <p>Metadatos: Aprende a usar <code>&lt;meta&gt;</code> para definir metadatos de tu página.</p>
        <p>Semántica: Usa etiquetas semánticas como <code>&lt;header&gt;</code>, <code>&lt;footer&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>.</p>
    `);
});

cssButton.addEventListener('click', () => {
    showSuggestions(`
        <h3>CSS</h3>
        <p>Selectores básicos: Aprende a seleccionar elementos con selectores de tipo, clase (<code>.clase</code>), e ID (<code>#id</code>).</p>
        <p>Propiedades de texto: Familiarízate con <code>color</code>, <code>font-size</code>, <code>font-family</code>, <code>text-align</code>.</p>
        <p>Modelo de caja: Entiende <code>margin</code>, <code>padding</code>, <code>border</code>, <code>width</code>, <code>height</code>.</p>
        <p>Colores: Usa colores con nombres, valores hexadecimales, RGB y HSL.</p>
        <p>Fondos: Aprende a usar <code>background-color</code>, <code>background-image</code>, <code>background-repeat</code>.</p>
        <p>Posicionamiento: Practica con <code>position</code> (<code>static</code>, <code>relative</code>, <code>absolute</code>, <code>fixed</code>).</p>
        <p>Flexbox: Aprende a usar <code>display: flex</code> y sus propiedades (<code>justify-content</code>, <code>align-items</code>).</p>
        <p>Grid: Familiarízate con <code>display: grid</code> y sus propiedades (<code>grid-template-columns</code>, <code>grid-template-rows</code>).</p>
        <p>Transiciones: Usa <code>transition</code> para animar cambios en las propiedades.</p>
        <p>Media Queries: Aprende a usar <code>@media</code> para hacer tu diseño responsive.</p>
    `);
});

jsButton.addEventListener('click', () => {
    showSuggestions(`
        <h3>JavaScript</h3>
        <p>Sintaxis básica: Aprende sobre variables (<code>var</code>, <code>let</code>, <code>const</code>), operadores y tipos de datos.</p>
        <p>Funciones: Practica creando funciones con <code>function</code> y <code>=&gt;</code>.</p>
        <p>Condicionales: Usa <code>if</code>, <code>else if</code>, <code>else</code> para tomar decisiones en tu código.</p>
        <p>Bucles: Familiarízate con <code>for</code>, <code>while</code>, <code>do...while</code>.</p>
        <p>Eventos: Aprende a manejar eventos como <code>click</code>, <code>mouseover</code>, <code>keydown</code>.</p>
        <p>DOM: Manipula el DOM con métodos como <code>getElementById</code>, <code>querySelector</code>, <code>createElement</code>.</p>
        <p>Arrays: Trabaja con arrays y métodos como <code>push</code>, <code>pop</code>, <code>shift</code>, <code>unshift</code>.</p>
        <p>Objetos: Aprende a crear y manipular objetos.</p>
        <p>Promesas: Familiarízate con <code>Promise</code>, <code>then</code>, <code>catch</code>, <code>async</code>, <code>await</code>.</p>
        <p>Fetch API: Aprende a hacer solicitudes HTTP con <code>fetch</code>.</p>
    `);
});

saveSuggestion.addEventListener('click', () => {
    saveToLocalStorage();
    alert('Sugerencias guardadas');



});


