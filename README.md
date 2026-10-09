# 🔐 Generador de Contraseñas Seguras

> Aplicación web moderna, rápida y criptográficamente segura para generar contraseñas robustas al instante desde el navegador. Construida con tecnologías nativas, 100% en el cliente y sin dependencias externas.

[![HTML5](https://img.shields.io/badge/HTML5-Semántico-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Nativo-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla%20ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Security](https://img.shields.io/badge/API-Web%20Crypto%20API-0284c7?style=flat-square&logo=security&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-059669?style=flat-square)](LICENSE)

---

## 🌟 Características Principales

- 🛡️ **Seguridad Criptográfica Real**: Generación aleatoria a través de la API estándar `window.crypto.getRandomValues()` sin sesgo de módulo (*modulo bias*), garantizando entropía robusta frente a generadores basados en `Math.random()`.
- 📊 **Medidor de Fortaleza en Tiempo Real**: Cálculo dinámico de entropía y variedad que categoriza la contraseña en 4 niveles (*Débil*, *Media*, *Fuerte*, *Muy fuerte*) con barra de estado visual y consejos de seguridad.
- ⚙️ **Altamente Personalizable**:
  - Control de longitud entre 6 y 64 caracteres mediante deslizador reactivo con barra de progreso estilizada.
  - Opciones conmutables e independientes: **Mayúsculas** (`A-Z`), **Minúsculas** (`a-z`), **Números** (`0-9`) y **Símbolos** (`!@#$%...`).
  - Protección activa para evitar conjuntos vacíos de caracteres.
- 📋 **Copiado Rápido con un Clic**: Botón de portapapeles con confirmación visual interactiva en el botón y notificación *Toast* flotante accesible.
- 👁️ **Mostrar / Ocultar Contraseña**: Alterna entre caracteres visibles y enmascarados de forma cómoda e intuitiva.
- 🎨 **Diseño Moderno & Minimalista**:
  - Paleta de colores fríos y azules (*Sky*, *Slate*).
  - Maquetación fluida y adaptable (móviles, tablets y escritorio) mediante **CSS Grid** y **Flexbox**.
  - Tipografía escalable con base estándar `1rem = 10px` (`html { font-size: 62.5%; }`).
- 🔒 **Privacidad Total (Client-Side Only)**: Todo el procesamiento ocurre en local. Ningún dato ni contraseña viaja a través de internet ni se almacena en cookies o bases de datos.
- ⚡ **Cero Dependencias**: Sin frameworks pesados, librerías externas ni fuentes de terceros. Rápido, ligero y listo para desplegar.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Descripción |
| :--- | :--- |
| **HTML5** | Estructura semántica accesible (`<header>`, `<main>`, `<fieldset>`, `<form>`, etc.) y optimizada para SEO. |
| **CSS3 Nativo** | Sistema de diseño modular con variables CSS, animaciones sutiles y diseño *Mobile-First*. Sin frameworks externos (ni Bootstrap ni Tailwind). |
| **JavaScript Vanilla** | Lógica de generación criptográfica, barajado Fisher-Yates, manipulación limpia del DOM sin `innerHTML` y gestión de eventos. |
| **Web Crypto API** | Proveedor de entropía criptográfica nativo del navegador. |

---

## 📁 Estructura del Proyecto

```text
generador-de-contraseñas/
├── assets/
│   ├── css/
│   │   └── styles.css      # Estilos globales, diseño responsive y componentes UI
│   ├── js/
│   │   └── app.js          # Lógica criptográfica, interactividad y eventos del DOM
│   └── img/
│       └── favicon.svg     # Isotipo y favicon vectorial optimizado
├── index.html              # Estructura semántica principal
├── README.md               # Documentación del proyecto
└── AGENTS.md               # Especificaciones de desarrollo y requerimientos
```

---

## 🚀 Inicio Rápido y Uso Local

No requiere compilación, `npm install` ni instalación de dependencias. Solo necesitas un navegador web moderno:

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/TU_USUARIO/generador-de-contraseñas.git
   ```

2. **Acceder a la carpeta**:
   ```bash
   cd generador-de-contraseñas
   ```

3. **Ejecutar**:
   - Puedes abrir directamente el archivo `index.html` en tu navegador favorito haciendo doble clic.
   - O bien, ejecutarlo con una extensión de servidor local como [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) en VS Code, o con un comando sencillo:
     ```bash
     # Usando Node.js (opcional)
     npx serve .
     
     # Usando Python (opcional)
     python -m http.server 3000
     ```

---

## 🔒 Consideraciones de Seguridad y Buenas Prácticas

- **¿Por qué `crypto.getRandomValues()`?**  
  Los generadores pseudoaleatorios tradicionales como `Math.random()` son predecibles y no aptos para criptografía ni generación de claves de seguridad. Este proyecto implementa la API nativa de criptografía del navegador con muestreo por rechazo para asegurar una distribución estrictamente uniforme.
- **Barajado Fisher-Yates**:  
  Garantiza que, tras asegurar la inclusión de al menos un carácter de cada tipo seleccionado, el orden final sea completamente impredecible y no tenga patrones fijos.
- **Seguridad en el DOM**:  
  Todo el contenido dinámico se inserta mediante métodos seguros (`createElement`, `textContent`, `appendChild`), previniendo cualquier riesgo de inyección o vulnerabilidades XSS.

---

## 🌐 Despliegue en GitHub Pages

Este proyecto está 100% optimizado para ser desplegado en **GitHub Pages** en segundos:

1. Ve a los **Settings** de tu repositorio en GitHub.
2. En la sección lateral izquierda, haz clic en **Pages**.
3. En **Build and deployment > Source**, selecciona `Deploy from a branch`.
4. Elige la rama `main` (o `master`) y la carpeta `/ (root)`.
5. Pulsa **Save**. En menos de un minuto tendrás tu generador online en vivo.

---

## 📄 Licencia

Este proyecto se encuentra bajo la licencia **MIT**. Puedes usarlo, modificarlo y compartirlo libremente. Consulta el archivo correspondiente para más detalles.
