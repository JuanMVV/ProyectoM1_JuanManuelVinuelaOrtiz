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

  // Bloque superior: el rectangulo pintado con el color
  const color = document.createElement("div");
  color.className = "swatch_color";
  color.style.background = colorHSL;

  // Zona inferior: nombre + codigos
  const info = document.createElement("div");
  info.className = "swatch_info";

  const elNombre = document.createElement("p");
  elNombre.className = "swatch_nombre";
  elNombre.textContent = nombre;

  const elCodigo = document.createElement("p");
  elCodigo.className = "swatch_codigo";
  elCodigo.textContent = colorHEX + " · " + colorHSL;

  info.append(elNombre, elCodigo);

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

if (boton) {
  boton.addEventListener("click", function () {
    renderPaleta(Number(selector.value));
  });
} else {
  console.log("No encontre el boton 'generar'. Revisa el id en el HTML.");
}

selector.addEventListener("change", function () {
  renderPaleta(Number(selector.value));
});

renderPaleta(6);
