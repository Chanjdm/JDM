(function () {
  const USUARIO_CLAVE = localStorage.getItem("usuario_clave");
  const ALMACENAR_ACCESO = "acceso_autorizado_v2";

  // Si no hay clave o acceso autorizado, redirige al index
  if (!USUARIO_CLAVE || localStorage.getItem(ALMACENAR_ACCESO) !== "ok") {
    // Cambia 'index.html' por el nombre real de tu pÃ¡gina principal si es diferente
    window.location.href = "http://jdm.free.nf/jdm/principal1.html";
  }
})();