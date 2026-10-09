/**
 * Generador de Contraseñas Seguras
 * Desarrollado en JavaScript Vanilla (Sin librerías externas)
 * Cumple con estándares criptográficos de seguridad (Web Crypto API)
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Constantes y Diccionarios de Caracteres
  // =========================================================================
  const CHAR_SETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?~'
  };

  // =========================================================================
  // 2. Elementos del DOM
  // =========================================================================
  const passwordOutput = document.getElementById('password-output');
  const lengthSlider = document.getElementById('length-slider');
  const lengthDisplay = document.getElementById('length-display');
  const optUppercase = document.getElementById('opt-uppercase');
  const optLowercase = document.getElementById('opt-lowercase');
  const optNumbers = document.getElementById('opt-numbers');
  const optSymbols = document.getElementById('opt-symbols');
  const generatorForm = document.getElementById('generator-form');
  const btnRegenerate = document.getElementById('btn-regenerate');
  const btnCopy = document.getElementById('btn-copy');
  const btnToggleVisibility = document.getElementById('btn-toggle-visibility');
  const strengthText = document.getElementById('strength-text');
  const strengthHint = document.getElementById('strength-hint');
  const strengthBars = document.querySelector('.strength-bars');
  const strengthSegments = document.querySelectorAll('.strength-segment');
  const toastContainer = document.getElementById('toast-container');

  // Iconos dentro de botones
  const iconEye = btnToggleVisibility.querySelector('.icon-eye');
  const iconEyeOff = btnToggleVisibility.querySelector('.icon-eye-off');
  const iconCopy = btnCopy.querySelector('.icon-copy');
  const iconCheck = btnCopy.querySelector('.icon-check');
  const iconRefresh = btnRegenerate.querySelector('.icon-refresh');

  let copyTimeoutId = null;

  // =========================================================================
  // 3. Generación Criptográfica y Aleatoria
  // =========================================================================

  /**
   * Obtiene un entero aleatorio en el rango [0, max - 1] sin sesgo de módulo.
   * Utiliza la API nativa criptográfica del navegador.
   * @param {number} max
   * @returns {number}
   */
  function getSecureRandomInt(max) {
    if (max <= 0) return 0;
    const array = new Uint32Array(1);
    const maxSafe = Math.floor(0xFFFFFFFF / max) * max;
    let randomVal;

    do {
      window.crypto.getRandomValues(array);
      randomVal = array[0];
    } while (randomVal >= maxSafe);

    return randomVal % max;
  }

  /**
   * Baraja un array utilizando el algoritmo Fisher-Yates con números criptográficos.
   * @param {Array} array
   * @returns {Array}
   */
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = getSecureRandomInt(i + 1);
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  /**
   * Genera una contraseña aleatoria con las opciones seleccionadas.
   * @returns {string}
   */
  function generatePassword() {
    const length = parseInt(lengthSlider.value, 10);
    const activeSets = [];

    if (optUppercase.checked) activeSets.push(CHAR_SETS.uppercase);
    if (optLowercase.checked) activeSets.push(CHAR_SETS.lowercase);
    if (optNumbers.checked) activeSets.push(CHAR_SETS.numbers);
    if (optSymbols.checked) activeSets.push(CHAR_SETS.symbols);

    // Salvaguarda: al menos un conjunto debe estar activo
    if (activeSets.length === 0) {
      optLowercase.checked = true;
      activeSets.push(CHAR_SETS.lowercase);
      showToast('Se activó minúsculas por defecto para poder generar la clave.', 'warning');
    }

    const passwordChars = [];

    // Garantizar que exista al menos 1 caracter de cada conjunto activo
    activeSets.forEach(function (charset) {
      const randomIndex = getSecureRandomInt(charset.length);
      passwordChars.push(charset[randomIndex]);
    });

    // Crear la reserva completa de caracteres disponibles
    const combinedCharset = activeSets.join('');

    // Rellenar los caracteres restantes hasta alcanzar la longitud deseada
    const remainingCount = length - passwordChars.length;
    for (let i = 0; i < remainingCount; i++) {
      const randomIndex = getSecureRandomInt(combinedCharset.length);
      passwordChars.push(combinedCharset[randomIndex]);
    }

    // Mezclar aleatoriamente el orden final de caracteres
    const finalShuffled = shuffleArray(passwordChars);
    return finalShuffled.join('');
  }

  // =========================================================================
  // 4. Medición de Fortaleza de la Contraseña
  // =========================================================================

  /**
   * Evalúa la fortaleza de una contraseña y devuelve un nivel (1 al 4).
   * @param {string} password
   * @returns {{ level: number, text: string, hint: string }}
   */
  function evaluatePasswordStrength(password) {
    const length = password.length;
    let poolSize = 0;

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);

    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNumber) poolSize += 10;
    if (hasSymbol) poolSize += 30;

    const varietyCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;

    // Cálculo de entropía en bits: L * log2(poolSize)
    const entropy = poolSize > 0 ? length * (Math.log(poolSize) / Math.LN2) : 0;

    let level = 1;
    let text = 'Muy débil';
    let hint = 'Longitud insuficiente o poca variedad. Aumenta caracteres.';

    if (length < 8 || varietyCount === 1) {
      level = 1;
      text = 'Débil';
      hint = 'Contraseña corta o predecible. Es vulnerable a ataques rápidos.';
    } else if (entropy < 50 || length < 12 || varietyCount < 2) {
      level = 2;
      text = 'Media';
      hint = 'Seguridad aceptable para usos básicos, pero se aconseja mayor variedad.';
    } else if (entropy < 75 || length < 16 || varietyCount < 3) {
      level = 3;
      text = 'Fuerte';
      hint = 'Buena protección y longitud adecuada para la mayoría de servicios.';
    } else {
      level = 4;
      text = 'Muy fuerte';
      hint = 'Excelente combinación y longitud. Resistencia óptima ante fuerza bruta.';
    }

    return { level: level, text: text, hint: hint };
  }

  /**
   * Actualiza el componente visual de la barra de fortaleza.
   * @param {{ level: number, text: string, hint: string }} strength
   */
  function updateStrengthUI(strength) {
    // Actualizar texto y pista
    strengthText.textContent = strength.text;
    strengthText.className = 'strength-value strength-' + strength.level;
    strengthHint.textContent = strength.hint;

    // Actualizar atributos de accesibilidad
    if (strengthBars) {
      strengthBars.setAttribute('aria-valuenow', strength.level.toString());
    }

    // Actualizar segmentos de barra
    strengthSegments.forEach(function (segment, index) {
      segment.className = 'strength-segment';
      if (index < strength.level) {
        segment.classList.add('active-' + strength.level);
      }
    });
  }

  // =========================================================================
  // 5. Notificaciones Visuales en el DOM (Sin alert ni confirm)
  // =========================================================================

  /**
   * Crea y muestra una notificación visual en el DOM.
   * @param {string} message
   * @param {'success'|'warning'} [type='success']
   * @param {number} [duration=5000]
   */
  function showToast(message, type, duration) {
    if (!toastContainer) return;
    const toastType = type || 'success';
    const displayDuration = typeof duration === 'number' ? duration : 5000;

    const toast = document.createElement('div');
    toast.className = 'toast toast-' + toastType;

    // Icono SVG creado con createElementNS
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'toast-icon');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');

    if (toastType === 'success') {
      const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      polyline.setAttribute('points', '20 6 9 17 4 12');
      svg.appendChild(polyline);
    } else {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', '12');
      circle.setAttribute('cy', '12');
      circle.setAttribute('r', '10');
      const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line1.setAttribute('x1', '12');
      line1.setAttribute('y1', '8');
      line1.setAttribute('x2', '12');
      line1.setAttribute('y2', '12');
      const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line2.setAttribute('x1', '12');
      line2.setAttribute('y1', '16');
      line2.setAttribute('x2', '12.01');
      line2.setAttribute('y2', '16');
      svg.appendChild(circle);
      svg.appendChild(line1);
      svg.appendChild(line2);
    }

    const textSpan = document.createElement('span');
    textSpan.textContent = message;

    toast.appendChild(svg);
    toast.appendChild(textSpan);
    toastContainer.appendChild(toast);

    // Auto-cierre con transición
    setTimeout(function () {
      toast.classList.add('toast-fade-out');
      toast.addEventListener('transitionend', function () {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, { once: true });
    }, displayDuration);
  }

  // =========================================================================
  // 6. Sincronización y Actualización de UI
  // =========================================================================

  /**
   * Actualiza el fondo degradado de la barra deslizadora.
   */
  function updateSliderBackground() {
    const min = parseFloat(lengthSlider.min) || 6;
    const max = parseFloat(lengthSlider.max) || 64;
    const current = parseFloat(lengthSlider.value) || 16;
    const percentage = ((current - min) / (max - min)) * 100;

    lengthSlider.style.background =
      'linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ' +
      percentage +
      '%, #e2e8f0 ' +
      percentage +
      '%, #e2e8f0 100%)';
  }

  /**
   * Genera y muestra una nueva contraseña, actualizando los indicadores.
   */
  function handleGenerate() {
    const newPassword = generatePassword();
    passwordOutput.value = newPassword;

    const strength = evaluatePasswordStrength(newPassword);
    updateStrengthUI(strength);
  }

  /**
   * Anima brevemente el icono de recargar.
   */
  function triggerRefreshAnimation() {
    if (iconRefresh) {
      iconRefresh.classList.remove('rotate-anim');
      // Forzar reflow para reiniciar animación
      void iconRefresh.offsetWidth;
      iconRefresh.classList.add('rotate-anim');
    }
  }

  // =========================================================================
  // 7. Acciones de Usuario
  // =========================================================================

  /**
   * Copia la contraseña actual al portapapeles con fallback y feedback.
   */
  function handleCopy(event) {
    if (event) event.preventDefault();

    const textToCopy = passwordOutput.value;
    if (!textToCopy) {
      showToast('No hay ninguna contraseña generada para copiar.', 'warning');
      return;
    }

    function onCopySuccess() {
      // Feedback en el botón de copiar
      btnCopy.classList.add('copied');
      iconCopy.classList.add('is-hidden');
      iconCheck.classList.remove('is-hidden');
      btnCopy.setAttribute('title', '¡Copiado!');

      if (copyTimeoutId) clearTimeout(copyTimeoutId);
      copyTimeoutId = setTimeout(function () {
        btnCopy.classList.remove('copied');
        iconCopy.classList.remove('is-hidden');
        iconCheck.classList.add('is-hidden');
        btnCopy.setAttribute('title', 'Copiar contraseña al portapapeles');
      }, 5000);

      showToast('¡Contraseña copiada al portapapeles con éxito!', 'success', 5000);
    }

    function onCopyFallback() {
      try {
        passwordOutput.select();
        passwordOutput.setSelectionRange(0, 9999);
        const successful = document.execCommand('copy');
        if (successful) {
          onCopySuccess();
        } else {
          showToast('No se pudo copiar automáticamente. Puedes seleccionarla y copiarla manualmente.', 'warning');
        }
      } catch (err) {
        showToast('No se pudo copiar automáticamente al portapapeles.', 'warning');
      }
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy)
        .then(onCopySuccess)
        .catch(function () {
          onCopyFallback();
        });
    } else {
      onCopyFallback();
    }
  }

  /**
   * Alterna entre mostrar y ocultar la contraseña.
   */
  function handleToggleVisibility(event) {
    if (event) event.preventDefault();

    const isCurrentlyPassword = passwordOutput.type === 'password';

    if (isCurrentlyPassword) {
      passwordOutput.type = 'text';
      passwordOutput.classList.remove('masked');
      iconEye.classList.remove('is-hidden');
      iconEyeOff.classList.add('is-hidden');
      btnToggleVisibility.setAttribute('title', 'Ocultar contraseña');
      btnToggleVisibility.setAttribute('aria-label', 'Ocultar contraseña');
    } else {
      passwordOutput.type = 'password';
      passwordOutput.classList.add('masked');
      iconEye.classList.add('is-hidden');
      iconEyeOff.classList.remove('is-hidden');
      btnToggleVisibility.setAttribute('title', 'Mostrar contraseña');
      btnToggleVisibility.setAttribute('aria-label', 'Mostrar contraseña');
    }
  }

  /**
   * Validación para evitar que el usuario desmarque todas las casillas.
   */
  function handleCheckboxChange(event) {
    const targetCheckbox = event.target;
    const checkboxes = [optUppercase, optLowercase, optNumbers, optSymbols];
    const checkedCount = checkboxes.filter(function (cb) { return cb.checked; }).length;

    if (checkedCount === 0) {
      // Impedir desmarcar la última opción
      targetCheckbox.checked = true;
      showToast('Debes mantener al menos una opción de caracteres activa.', 'warning');
      return;
    }

    handleGenerate();
  }

  // =========================================================================
  // 8. Event Listeners y Inicialización
  // =========================================================================

  // Cambio en slider de longitud
  lengthSlider.addEventListener('input', function () {
    lengthDisplay.textContent = lengthSlider.value;
    updateSliderBackground();
    handleGenerate();
  });

  // Opciones de caracteres
  [optUppercase, optLowercase, optNumbers, optSymbols].forEach(function (checkbox) {
    checkbox.addEventListener('change', handleCheckboxChange);
  });

  // Envío del formulario
  generatorForm.addEventListener('submit', function (event) {
    event.preventDefault();
    triggerRefreshAnimation();
    handleGenerate();
  });

  // Botón regenerar
  btnRegenerate.addEventListener('click', function (event) {
    event.preventDefault();
    triggerRefreshAnimation();
    handleGenerate();
  });

  // Botón copiar
  btnCopy.addEventListener('click', handleCopy);

  // Botón alternar visibilidad
  btnToggleVisibility.addEventListener('click', handleToggleVisibility);

  // Selección automática al hacer click en el campo de contraseña para facilidad de uso
  passwordOutput.addEventListener('focus', function () {
    passwordOutput.select();
  });

  // Inicialización inicial
  updateSliderBackground();
  handleGenerate();
})();
