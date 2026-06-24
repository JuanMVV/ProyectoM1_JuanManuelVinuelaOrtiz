function hslToHex(h, s, l) {
  l = l / 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = function (n) {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return "#" + f(0) + f(8) + f(4);
}

function crearSwatch(colorHSL, colorHEX, nombre) {
  const swatch = document.createElement("article");
  swatch.className = "swatch";

  const color = document.createElement("div");
  color.className = "swatch_color";
  color.style.background = colorHSL;

  const info = document.createElement("div");
  info.className = "swatch_info";

  const elNombre = document.createElement("p");
  elNombre.className = "swatch_nombre";
  elNombre.textContent = nombre;

  // --- HEX (icono + texto) ---
  const rowHEX = document.createElement("div");
  rowHEX.className = "swatch_code-row";

  const btnCopyHex = document.createElement("button");
  btnCopyHex.className = "copy-btn copy-hex";
  btnCopyHex.type = "button";
  btnCopyHex.textContent = "📋";
  btnCopyHex.setAttribute("aria-label", "Copiar código HEX");

  const codHEX = document.createElement("p");
  codHEX.className = "swatch_codHEX";
  codHEX.textContent = "HEX: " + colorHEX;

  rowHEX.append(btnCopyHex, codHEX);

  // --- HSL (icono + texto) ---
  const rowHSL = document.createElement("div");
  rowHSL.className = "swatch_code-row";

  const btnCopyHsl = document.createElement("button");
  btnCopyHsl.className = "copy-btn copy-hsl";
  btnCopyHsl.type = "button";
  btnCopyHsl.textContent = "📋";
  btnCopyHsl.setAttribute("aria-label", "Copiar código HSL");

  const codHSL = document.createElement("p");
  codHSL.className = "swatch_codHSL";
  codHSL.textContent = "HSL: " + colorHSL;

  rowHSL.append(btnCopyHsl, codHSL);

  info.append(elNombre, rowHEX, rowHSL);
  swatch.append(color, info);

  return swatch;
}

function generarColor() {
  const h = Math.round(Math.random() * 360);
  const hsl = "hsl(" + h + ", 70%, 60%)";
  const hex = hslToHex(h, 70, 60);

  return { hsl, hex };
}

const galeria = document.getElementById("galeria");

function renderPaleta(cantidad) {
  galeria.innerHTML = "";

  for (let i = 0; i < cantidad; i++) {
    const color = generarColor();
    const swatch = crearSwatch(color.hsl, color.hex, "Color " + (i + 1));
    galeria.appendChild(swatch);
  }
}

const boton = document.getElementById("generar");
const selector = document.getElementById("cantidad");
const inputCant = document.getElementById("input-cantidad");

inputCant.addEventListener("change", function () {
  const cant = Number(inputCant.value);
  if (cant > 0 && cant <= 10) {
    renderPaleta(cant);
  } else {
    showToastError("La cantidad ingresada debe ser entre 1 y 10");
    inputCant.value = "";     
    inputCant.focus(); 
  }
});

if (boton) {
  boton.addEventListener("click", function () {
    renderPaleta(Number(selector.value));
    inputCant.value = "";
  });
} else {
  console.log("No encontre el boton 'generar'. Revisa el id en el HTML.");
}

selector.addEventListener("change", function () {
  renderPaleta(Number(selector.value));
});

renderPaleta(6);



// region copiar codigos
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".copy-btn");
  if (!btn) return;
  const row = btn.closest(".swatch_code-row");
  if (!row) return;
  const p = row.querySelector("p");
  if (!p) return; 
  const text = p.textContent.replace(/^HEX:\s*|^HSL:\s*/i, "").trim();

  try {
    await navigator.clipboard.writeText(text);
    const original = btn.textContent;
    btn.textContent = "✓";
    showToast("Copiado al portapapeles");
    setTimeout(() => {
      btn.textContent = original;
    }, 1800);
  } catch (err) {
    console.error("Error al copiar: ", err);
    showToast("No se pudo copiar al portapapeles", 2500);
  }
});


// region msn toast
function showToast(message, duration = 1800) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  if (toast._timeoutId) {
    clearTimeout(toast._timeoutId);
  }

  toast._timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}


function showToastError(message, duration = 1800) {
  const toast = document.getElementById('toast-error');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  if (toast._timeoutId) {
    clearTimeout(toast._timeoutId);
  }

  toast._timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}