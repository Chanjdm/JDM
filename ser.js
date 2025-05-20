const selector = document.getElementById("temporadaSelector");
const temporadas = document.querySelectorAll(".temporada");

selector.addEventListener("change", function () {
  temporadas.forEach(temp => temp.classList.remove("active"));
  const selected = document.getElementById(this.value);
  if (selected) {
    selected.classList.add("active");
  }
});
