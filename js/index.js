// region Traducciones
const i18n = {
  es: {
    app_title: "Chroma Studio",
    nav_generate_palette: "Generar Paleta",
    palette_title: "Paleta de Colores",
    btn_generate_random: "Generar colores Random",
    label_select_quantity: "Seleccionar cantidad de colores",
    option_6_colors: "6 colores",
    option_8_colors: "8 colores",
    option_9_colors: "9 colores",
    label_or_write_quantity: "o escribir cantidad:",
    footer_text: "ChromaStudio © 2026 | Todos los derechos reservados | Términos y condiciones",
    toast_error_default: "",
    toast_default: "",
    toast_invalid_quantity: "La cantidad ingresada debe ser entre 1 y 10",
    toast_copied: "Copiado al portapapeles",
    toast_copy_failed: "No se pudo copiar al portapapeles",
    color_label: "Color"
  },
  en: {
    app_title: "Chroma Studio",
    nav_generate_palette: "Generate Palette",
    palette_title: "Color Palette",
    btn_generate_random: "Generate random colors",
    label_select_quantity: "Select number of colors",
    option_6_colors: "6 colors",
    option_8_colors: "8 colors",
    option_9_colors: "9 colors",
    label_or_write_quantity: "or type quantity:",
    footer_text: "ChromaStudio © 2026 | All rights reserved | Terms and conditions",
    toast_error_default: "",
    toast_default: "",
    toast_invalid_quantity: "Quantity must be between 1 and 10",
    toast_copied: "Copied to clipboard",
    toast_copy_failed: "Could not copy to clipboard",
    color_label: "Color"
  }
};

let currentLang = "es";

function changeLanguage(lang) {
  const dict = i18n[lang];
  if (!dict) return;

  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(el => {
    const key = el.dataset.i18n;
    const translation = dict[key];
    if (translation !== undefined) {
      // Para options y labels alcanza con textContent
      el.textContent = translation;
    }
  });

  // Actualizamos tambien el atributo lang del HTML
  document.documentElement.setAttribute("lang", lang);
  currentLang = lang;
  localStorage.setItem("lang", lang);
}

document.addEventListener("DOMContentLoaded", () => {
  const langButtons = document.querySelectorAll(".lang-btn");

  langButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      changeLanguage(lang);

      langButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  const savedLang = localStorage.getItem("lang") || "es";
  changeLanguage(savedLang);

  const activeBtn = document.querySelector(`.lang-btn[data-lang="${savedLang}"]`);
  if (activeBtn) activeBtn.classList.add("active");
});
// end region Traducciones

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
    const labelColor = i18n[currentLang].color_label || "Color";
    const swatch = crearSwatch(color.hsl, color.hex, `${labelColor} ${i + 1}`);

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
    const msg = i18n[currentLang].toast_invalid_quantity;
    showToastError(msg);
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


// region copiar códigos
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
    // showToast("Copiado al portapapeles");
    const msgCopied = i18n[currentLang].toast_copied;
    showToast(msgCopied);
    setTimeout(() => {
      btn.textContent = original;
    }, 1800);
  } catch (err) {
    console.error("Error al copiar: ", err);
    // showToast("No se pudo copiar al portapapeles", 2500);
    const msgFail = i18n[currentLang].toast_copy_failed;
    showToast(msgFail, 2500);
  }
});
//end region copiar códigos



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
//end region msn toast
