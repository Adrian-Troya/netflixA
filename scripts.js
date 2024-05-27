import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

// Función para iniciar sesión con correo electrónico y contraseña
document.getElementById('emailLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        await loginWithEmailPassword(email, password);
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        alert("Error durante el inicio de sesión: " + error.message);
    }
});

// Función para iniciar sesión con usuario y contraseña
async function loginWithEmailPassword(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        alert("Error durante el inicio de sesión: " + error.message);
    }
}

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "API_KEY_HERE",
    authDomain: "peliculas-ae2f1.firebaseapp.com",
    projectId: "peliculas-ae2f1",
    storageBucket: "peliculas-ae2f1.appspot.com",
    messagingSenderId: "854647408875",
    appId: "1:854647408875:web:39489056b967ada8b316ae",
    measurementId: "G-EK15PN80TF"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const peliculasCollection = collection(db, "peliculas");

// Verificar estado de autenticación
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('app-container').style.display = 'block';
        getPeliculas(); // Cargar la lista de películas
    } else {
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('app-container').style.display = 'none';
    }
});

// Función para iniciar sesión con Google
async function loginWithGoogle() {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
    }
}

// Función para cerrar sesión
async function logout() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error durante el cierre de sesión:", error);
    }
}


// Función para obtener y mostrar todas las películas
async function getPeliculas() {
    const querySnapshot = await getDocs(peliculasCollection);
    const tableBody = document.getElementById('tablaPeliculasBody');
    tableBody.innerHTML = ''; // Limpiamos el contenido del cuerpo de la tabla
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const row = `
            <tr data-id="${doc.id}">
                <td>${doc.id}</td>
                <td>${data.titulo}</td>
                <td>${data.director}</td>
                <td>${data.año_estreno}</td>
                <td>${data.genero}</td>
                <td>${data.duracion_minutos}</td>
                <td>${data.idioma_original}</td>
                <td>${data.pais_produccion}</td>
                <td>${data.calificacion_IMDB}</td>
                <td>${data.sinopsis}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });

    // Añadimos un evento de clic a cada fila para buscar y llenar el formulario con los datos de la película seleccionada
    document.querySelectorAll('#tablaPeliculasBody tr').forEach(row => {
        row.addEventListener('click', () => {
            const id = row.getAttribute('data-id');
            searchPeliculaById(id);
        });
    });
}

// Función para buscar una película por ID y llenar el formulario con sus datos
async function searchPeliculaById(id) {
    const peliculaDoc = doc(db, "peliculas", id);
    const docSnap = await getDoc(peliculaDoc);
    if (docSnap.exists()) {
        fillFormWithPeliculaData(docSnap.id, docSnap.data());
    } else {
        console.log("No such document!");
        document.getElementById('peliculaForm').reset();
    }
}

// Función para llenar el formulario con los datos de una película
function fillFormWithPeliculaData(id, data) {
    document.getElementById('buscarId').value = id;
    document.getElementById('titulo').value = data.titulo;
    document.getElementById('director').value = data.director;
    document.getElementById('año_estreno').value = data.año_estreno;
    document.getElementById('genero').value = data.genero;
    document.getElementById('duracion_minutos').value = data.duracion_minutos;
    document.getElementById('idioma_original').value = data.idioma_original;
    document.getElementById('pais_produccion').value = data.pais_produccion;
    document.getElementById('calificacion_IMDB').value = data.calificacion_IMDB;
    document.getElementById('sinopsis').value = data.sinopsis;
}

// Función para crear una nueva película
async function createPelicula(data) {
    try {
        await addDoc(peliculasCollection, data);
        getPeliculas(); // Actualizar la lista de películas
    } catch (error) {
        console.error("Error al crear la película:", error);
    }
}

// Función para actualizar una película existente
async function updatePelicula(id, updatedData) {
    try {
        const peliculaDoc = doc(db, "peliculas", id);
        await updateDoc(peliculaDoc, updatedData);
        getPeliculas(); // Actualizar la lista de películas
    } catch (error) {
        console.error("Error al actualizar la película:", error);
    }
}

// Función para borrar una película
async function deletePelicula(id) {
    try {
        const peliculaDoc = doc(db, "peliculas", id);
        await deleteDoc(peliculaDoc);
        getPeliculas(); // Actualizar la lista de películas
    } catch (error) {
        console.error("Error al borrar la película:", error);
    }
}

// Función para iniciar sesión con usuario y contraseña
async function loginWithEmailPassword(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        alert("Error durante el inicio de sesión: " + error.message);
    }
}

// Mostrar la lista de correos registrados
async function showEmailList() {
    const emails = ["correo1@example.com", "correo2@example.com", "correo3@example.com"]; // Ejemplo, reemplaza con datos reales si los tienes
    const emailList = document.getElementById('emailList');
    emailList.innerHTML = '';
    emails.forEach(email => {
        const emailItem = document.createElement('li');
        emailItem.textContent = email;
        emailItem.addEventListener('click', () => {
            document.getElementById('email').value = email;
            document.getElementById('password').focus();
            document.getElementById('emailModal').style.display = 'none';
        });
        emailList.appendChild(emailItem);
    });
    document.getElementById('emailModal').style.display = 'block';
