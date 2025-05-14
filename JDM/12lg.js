let channelsReady = false; // Comienza como false

// DespuÃ©s de cargar los canales y llenar channelsList:
channelsReady = true;


window.onload = function () {
    // Mostrar el modal al cargar la pÃ¡gina
    const modal = document.getElementById("channelModal");
    modal.style.display = "block"; // Asegurarse de que el modal se muestre
    const sidebar = document.getElementById("channelListSidebar");

    // AsegÃºrate de que el sidebar estÃ¡ visible cuando se abre el modal
    if (sidebar) {
        sidebar.style.display = "block"; // Mostrar el sidebar al cargar el modal
    }

    // Cargar la lista de canales (sin mostrar el streamList)
    loadChannelList();  // Esta es la funciÃ³n que carga los canales en el sidebar
};

function loadChannelList() {
    // LÃ³gica para cargar canales en el sidebar sin mostrar el streamList al principio
    showChannelListSidebar(); // Esta funciÃ³n ya existe en tu cÃ³digo
}

function selectChannel(channel) {
    // AquÃ­ seleccionamos el canal
    openStream(channel.url, channel.name); // Esto abrirÃ­a el canal elegido

    // Cerrar el modal
    const modal = document.getElementById("channelModal");
    if (modal) {
        modal.style.display = "none";  // Ocultar el modal
    }

    // Mostrar el streamList o el contenido de los canales
    const streamList = document.getElementById("streamList");
    if (streamList) {
        streamList.style.display = "block"; // Mostrar el contenido de los canales
    }
}




   // #######################    FunciÃ³n para mostrar la lista de canales en la barra lateral
function showChannelListSidebar() {
    const sidebar = document.getElementById("channelListSidebar");
    sidebar.innerHTML = ""; // Limpiar contenido anterior

    // Crear input de bÃºsqueda
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Buscar canal con Boton Verde";
    searchInput.classList.add("search-sidebar");
    searchInput.id = "sidebarSearchInput";
    searchInput.style.width = "100%";
    searchInput.style.marginBottom = "10px";
    searchInput.style.padding = "5px";

    // Evento para filtrar
    searchInput.addEventListener("keyup", () => {
        const filter = searchInput.value.toLowerCase();
        const items = sidebar.querySelectorAll(".sidebar-channel");

        items.forEach(item => {
            const name = item.dataset.name.toLowerCase();
            item.style.display = name.includes(filter) ? "" : "none";
        });
    });

    sidebar.appendChild(searchInput);


    channelsList.forEach((channel, index) => {
        const div = document.createElement("div");
        div.classList.add("sidebar-channel");
        div.tabIndex = 0;
        div.textContent = channel.name;
        div.dataset.index = index;
        div.dataset.name = channel.name;

        // #######################    Marca el canal actual visualmente
        if (channel.name === currentChannelName) {
            div.classList.add("selected");
        }

        // Clic para cambiar de canal
        div.addEventListener("click", () => {
            openStream(channel.url, channel.name);
            hideSidebar();
        });

        sidebar.appendChild(div);
    });

    sidebar.style.display = "block"; // Mostrar la barra lateral
    focusCurrentChannelInSidebar(); // ðŸ‘ Este enfoque es el correcto
}


function hideSidebar() {
    const sidebar = document.getElementById("channelListSidebar");
    sidebar.style.display = "none";
}

   // #######################    Oculta y Habilita  la navegaciÃ³n por teclado en la barra lateral
function enableSidebarKeyboardNavigation() {
    let inactivityTimeout;
    const INACTIVITY_DELAY = 6000; // 6 segundos

    const sidebar = document.getElementById("channelListSidebar");

    function hideSidebar() {
        sidebar.style.display = "none";
    }

    function resetInactivityTimer() {
        clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(() => {
            const activeElement = document.activeElement;
            const isTyping = activeElement &&
                activeElement.tagName === "INPUT" &&
                activeElement.id === "sidebarSearchInput"; // <== CORREGIDO ACÃ

            if (!isTyping) {
                hideSidebar();
            } else {
                // Si estÃ¡ escribiendo, reiniciamos el contador
                resetInactivityTimer();
            }
        }, INACTIVITY_DELAY);
    }

    document.addEventListener("keydown", (e) => {
        if (sidebar.style.display !== "block") return;

        const items = Array.from(sidebar.querySelectorAll(".sidebar-channel"))
            .filter(el => el.style.display !== "none");

        const current = document.activeElement;
        let index = items.indexOf(current);

        if (e.key === "ArrowDown") {
            index = (index + 1) % items.length;
            items[index].focus();
            e.preventDefault();
            resetInactivityTimer();
        } else if (e.key === "ArrowUp") {
            index = (index - 1 + items.length) % items.length;
            items[index].focus();
            e.preventDefault();
            resetInactivityTimer();
        } else if (e.key === "Enter") {
            if (current.classList.contains("sidebar-channel")) {
                const channelIndex = parseInt(current.dataset.index);
                const channel = channelsList[channelIndex];
                openStream(channel.url, channel.name);
                e.preventDefault();
                resetInactivityTimer();
            }
        } else {
            resetInactivityTimer(); // Por si se escribe texto
        }
    });

    sidebar.addEventListener("mousemove", resetInactivityTimer);
    sidebar.addEventListener("touchstart", resetInactivityTimer);
}



  // #######################    Desvanece La Info De Canales 
let inactivityTimeout;
const overlay = document.getElementById("controlHelpOverlay");

function showOverlay() {
    overlay.style.opacity = "1";
    overlay.style.transition = "opacity 0.5s";
}

function hideOverlay() {
    overlay.style.opacity = "0.1"; // puedes usar 0 para ocultarlo completamente
    overlay.style.transition = "opacity 1s";
}

function resetInactivityTimer() {
    showOverlay();
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
        hideOverlay();
    }, 5000); // 5 segundos sin interacciÃ³n
}

// Eventos que reinician el contador
["mousemove", "keydown", "touchstart"].forEach(event => {
    document.addEventListener(event, resetInactivityTimer);
});

// Inicializamos el timer al cargar
resetInactivityTimer();




  // #######################    FunciÃ³n para enfocar el canal actual en la barra lateral
    function focusCurrentChannelInSidebar() {
        const sidebar = document.getElementById("channelListSidebar");
        const currentItem = Array.from(sidebar.querySelectorAll(".sidebar-channel"))
            .find(el => el.dataset.name === currentChannelName);

        if (currentItem) {
            currentItem.focus();
            currentItem.scrollIntoView({ block: "center", behavior: "smooth" });
        } else {
            const first = sidebar.querySelector(".sidebar-channel");
            if (first) first.focus();
        }
    }

   //  ######################     Mostrar la lista de canales con la barra lateral cuando se presiona la tecla "L"
 //  document.addEventListener("keydown", (e) => {
//  if (e.key.toLowerCase() === "l") {
 //     const sidebar = document.getElementById("channelListSidebar");
 //     if (sidebar.style.display === "block") {
   //       sidebar.style.display = "none";
   //   } else {
    //      showChannelListSidebar(); // ðŸ”¥ AquÃ­ cargamos los canales
   //   }
 // }
//   });

// Mostrar u ocultar la lista de canales con la tecla "9"
document.addEventListener("keydown", (e) => {
    if (e.key === "9") {
        const sidebar = document.getElementById("channelListSidebar");
        if (sidebar.style.display === "block") {
            sidebar.style.display = "none";
        } else {
            showChannelListSidebar(); // ðŸ”¥ AquÃ­ cargamos los canales
        }
    }
});


//   ###############################################








let lastFocusedElement = null;

// #######################    FunciÃ³n para guardar el foco del elemento
function saveFocus(element) {
  lastFocusedElement = element;
}















// #######################    Variables globales para agrupar canales, canal actual y su nombre
let allGroups = {};
let currentChannel = null;
let currentChannelName = null;
let channelsList = [];

// #######################    Devuelve la clave con la que se guarda la lista en localStorage
function getListKey() {
    return `cachedM3U_${m3uUrl}`;
}

// #######################    Restaura la posiciÃ³n del scroll guardada en localStorage
function restoreScrollPosition() {
    const scrollY = localStorage.getItem(`scrollY_${m3uUrl}`);
    if (scrollY) {
        setTimeout(() => window.scrollTo(0, parseInt(scrollY)), 100);
    }
}

// #######################    Guarda la posiciÃ³n actual del scroll
function saveScrollPosition() {
    localStorage.setItem(`scrollY_${m3uUrl}`, window.scrollY);
}

// #######################    Abre el stream de un canal y guarda la selecciÃ³n actual
function openStream(url, name) {
    saveScrollPosition();
    localStorage.setItem("lastChannelUrl", url);
    currentChannel = url;
    currentChannelName = name;
    playChannel(url, name);
}

// #######################    Reproduce el canal en el reproductor del modal
function playChannel(url, name) {
    const video = document.getElementById("modalVideo");
    const infoOverlay = document.getElementById("channelInfoOverlay");
    const currentInfo = document.getElementById("currentChannelInfo");
    const index = channelsList.findIndex(c => c.url === url);
    
    video.src = url;
    document.getElementById("channelModal").style.display = "block";
    document.getElementById("modalTitle").textContent = "Reproduciendo: " + (name || url);
    currentInfo.textContent = "Estas Viendo: " + (name || url);



   // #######################     Obtener nombres anterior y siguiente
    const prevName = index > 0 ? channelsList[index - 1]?.name : "N/A";
    const nextName = index < channelsList.length - 1 ? channelsList[index + 1]?.name : "N/A";

  // #######################    Mostrar en el tÃ­tulo del modal
    document.getElementById("modalTitle").textContent = "Reproduciendo: " + (name || url);

 // #######################    Mostrar info adicional junto al overlay de ayuda
    infoOverlay.innerHTML = `
        <div>â—€ Ant: <b>${prevName}</b></div>
        <div>â–¶ Sig: <b>${nextName}</b></div>
    `;

    video.src = url;
    document.getElementById("channelModal").style.display = "block";
}


// #######################    Cierra el modal de reproducciÃ³n
function closeModal() {
    const modal = document.getElementById("channelModal");
    modal.style.display = "none";

    // Mostrar el contenedor de canales (si se ocultÃ³)
    document.getElementById("streamList").style.display = "block";

    // Restaurar foco al primer canal visible
    focusFirstVisibleChannel();
}


// #######################    Alterna pantalla completa del video
function toggleFullScreen() {
  const video = document.getElementById('modalVideo');
  const isFullscreen = document.fullscreenElement;

  if (isFullscreen) {
    // Desactivar pantalla completa
    document.exitFullscreen().then(() => {
      // Restaurar el enfoque al Ãºltimo elemento enfocado
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      } else {
        // Si no hay un Ãºltimo elemento enfocado, puedes enfocar el primer canal
        const firstChannel = document.querySelector('.channel');
        if (firstChannel) firstChannel.focus();
      }
    });
  } else {
    // Activar pantalla completa
    video.requestFullscreen();
  }
}


// #######################    Carga la lista M3U desde localStorage o desde la URL
async function fetchM3U() {
    const savedData = localStorage.getItem(getListKey());
    if (savedData) {
        console.log("Cargando datos desde localStorage");
        parseM3U(savedData);
        restoreScrollPosition();
        return;
    }
    try {
        console.log("Cargando datos desde la URL M3U");
        const response = await fetch(m3uUrl);
        const data = await response.text();
        localStorage.setItem(getListKey(), data);
        parseM3U(data);
        restoreScrollPosition();
    } catch (error) {
        console.error("Error al cargar la lista M3U", error);
    }
}

// #######################    Analiza el contenido M3U y organiza los canales por grupos
function parseM3U(data) {
    const lines = data.split("\n");
    let groups = {};
    let allChannels = [];

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("#EXTINF")) {
            const nameMatch = lines[i].match(/,(.*)$/);
            const logoMatch = lines[i].match(/tvg-logo="(.*?)"/);
            const groupMatch = lines[i].match(/group-title="(.*?)"/);
            const url = lines[i + 1]?.trim();

            if (nameMatch && url) {
                const name = nameMatch[1]?.trim();
                if (!name) continue;
                const excludeWords = ["FHD", "UHD", "4K"];
                const nameUpper = name.toUpperCase();
                if (excludeWords.some(word => nameUpper.includes(word))) continue;

                const groupName = groupMatch ? groupMatch[1] : "Sin categorÃ­a";
                const logo = logoMatch ? logoMatch[1] : "";

                if (!groups[groupName]) groups[groupName] = [];

                const channel = {
                    name: name,
                    logo: logo,
                    url: url
                };

                groups[groupName].push(channel);
                allChannels.push(channel);
            }
        }
    }

    allGroups = groups;
    channelsList = allChannels;

    createGroupButtons(groups); // (si quieres mantenerlos, si no, puedes comentar esta lÃ­nea)
    // displayGroups(groups); â† âŒ Ya no llamamos esto
    displaySidebarChannels(allChannels); // âœ… Solo mostramos en el sidebar
}
function displaySidebarChannels(channels) {
    const sidebarList = document.getElementById("channelListSidebarList");
    sidebarList.innerHTML = "";

    channels.forEach(channel => {
        const item = document.createElement("div");
        item.className = "sidebar-channel";
        item.tabIndex = 0;
        item.textContent = channel.name;

        item.onclick = () => openStream(channel.url, channel.name);
        item.onkeydown = (e) => {
            if (e.key === "Enter") openStream(channel.url, channel.name);
        };

        sidebarList.appendChild(item);
    });
}


// #######################    Crea botones para cada grupo de canales
function createGroupButtons(groups) {
    const groupButtons = document.getElementById("groupButtons");
    groupButtons.innerHTML = "";

    Object.keys(groups).forEach(group => {
        const button = document.createElement("button");
        button.textContent = group;
        button.classList.add("canal-btn");
        button.onclick = () => scrollToGroup(group);
        groupButtons.appendChild(button);
    });
}

// #######################    Hace scroll hacia un grupo especÃ­fico
function scrollToGroup(group) {
  const target = group === "Favoritos" ? document.getElementById("favoritosTitle") : document.getElementById(group);
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });

 // #######################    Restaurar el foco al primer canal del grupo
  const firstChannel = document.querySelector(`#${group} .channel`);
  if (firstChannel) firstChannel.focus();
}


// #######################    Muestra los grupos y sus canales en pantalla


// #######################    Variables para reinicio automÃ¡tico del stream si se pausa, termina o queda esperando
const video = document.getElementById("modalVideo");
let retryCount = 0;
const maxRetries = 5;

// #######################    Reintenta reproducir el canal si no estÃ¡ cargando bien
function safeRestartStream() {
    if (video.readyState < 3 || video.paused || video.ended) {
        retryCount++;
        console.log(`Intento de reinicio #${retryCount}`);
        if (retryCount <= maxRetries) {
            playChannel(currentChannel, currentChannelName); // Reproduce nuevamente el canal
        } else {
            console.warn("Demasiados intentos de reinicio. Deteniendo reintentos.");
        }
    } else {
        retryCount = 0; // Si estÃ¡ reproduciÃ©ndose correctamente, reinicia el contador
    }
}

// #######################    Eventos para reintentar stream automÃ¡ticamente
video.addEventListener('ended', () => setTimeout(safeRestartStream, 2000));  // Cuando termina el video
video.addEventListener('pause', () => setTimeout(safeRestartStream, 2000));  // Cuando se pausa
video.addEventListener('waiting', () => setTimeout(safeRestartStream, 2000));  // Cuando se queda esperando el stream


// #######################    BotÃ³n para cerrar el modal
document.getElementById("closeModal").onclick = closeModal;

// #######################    Reproduce el siguiente canal de la lista
function playNextChannel() {
saveFocus(document.activeElement);
    const index = channelsList.findIndex(c => c.url === currentChannel);
    if (index !== -1 && index < channelsList.length - 1) {
        const next = channelsList[index + 1];
        currentChannel = next.url;
        currentChannelName = next.name;
        playChannel(next.url, next.name);
        showNextPrevInfo("â–¶ Siguiente: " + next.name);
    }
}

// ###############################  Reproduce el canal anterior de la lista
function playPreviousChannel() {
saveFocus(document.activeElement);
    const index = channelsList.findIndex(c => c.url === currentChannel);
    if (index > 0) {
        const prev = channelsList[index - 1];
        currentChannel = prev.url;
        currentChannelName = prev.name;
        playChannel(prev.url, prev.name);
        showNextPrevInfo("â—€ Anterior: " + prev.name);
    }
}


// ################################  Muestra mensaje flotante con nombre del canal siguiente o anterior
function showNextPrevInfo(text) {
    const infoBox = document.getElementById("nextPrevInfo");
    infoBox.textContent = text;
    infoBox.style.opacity = 1;  // Asegura que empiece completamente visible

    // ####################### Clear previous timeout
    clearTimeout(infoBox.timeout);

    // ####################### Desaparecer gradualmente despuÃ©s de 2 minutos (120,000 ms)
    infoBox.timeout = setTimeout(() => {
        infoBox.style.transition = "opacity 2s ease-out";  // AÃ±adir una transiciÃ³n suave
        infoBox.style.opacity = 0.3;  // Dejarlo ligeramente transparente
    }, 120000);  // 2 minutos (120,000 ms)
}

// ####################### FunciÃ³n para cambiar de canal (simulaciÃ³n)
function changeChannel(newChannel) {
    // Cambiar el canal aquÃ­
    // ...

   // ####################### Reiniciar el temporizador de transparencia
    showNextPrevInfo(`Canal: ${newChannel}`);
}


// ##############################################   Manejo de teclas del control remoto (colores)
document.addEventListener("keydown", (e) => {
    const modal = document.getElementById("channelModal");
    const sidebar = document.getElementById("channelListSidebar");
    const searchInput = document.getElementById("sidebarSearchInput");

    switch (e.keyCode) {
        case 403: // ðŸ”´ Rojo
            if (modal.style.display === "block") {
                closeModal();
            } else if (currentChannel) {
                playChannel(currentChannel, currentChannelName);
            }
            e.preventDefault();
            break;

        case 405: // ðŸŸ¡ Amarillo
            playNextChannel();
            e.preventDefault();
            break;

        case 406: // ðŸ”µ Azul
            playPreviousChannel();
            e.preventDefault();
            break;

        case 33: // Canal+
            playNextChannel();
            e.preventDefault();
            break;

        case 34: // Canal-
            playPreviousChannel();
            e.preventDefault();
            break;

        case 48: // NÃºmero 0 - toggle barra lateral
            toggleChannelListSidebar(); // âœ… usamos la funciÃ³n de abajo
            e.preventDefault();
            break;

        case 404: // ðŸŸ¢ BotÃ³n Verde - enfocar buscador si el sidebar estÃ¡ visible
            if (sidebar.style.display === "block") {
                if (searchInput) {
                    searchInput.value = "";
                    searchInput.focus();
                }
            } else {
                showChannelListSidebar();
            }
            e.preventDefault();
            break;

    //    case 76: // Tecla L (pruebas)
    //        toggleChannelListSidebar(); // tambiÃ©n usa la misma funciÃ³n
   //         e.preventDefault();
   //         break;

   //   case 65: // Letra A del teclado - abre sidebar
   //       toggleChannelListSidebar(); // âœ… la misma funciÃ³n sin alterar lo actual
   //       e.preventDefault();
  //        break;
    }
});

function toggleChannelListSidebar() {
    if (!channelsReady) {
        alert("Cargando canales... espera un momento.");
        return;
    }

    const sidebar = document.getElementById("channelListSidebar");

    if (sidebar.style.display === "block") {
        sidebar.style.display = "none";
        focusFirstVisibleChannel(); // âœ… vuelve el foco a la lista principal
    } else {
        showChannelListSidebar(); // âœ… carga y muestra los canales
    }
}



function focusFirstVisibleChannel() {
    const channels = document.querySelectorAll(".channel");

    for (let i = 0; i < channels.length; i++) {
        if (channels[i].offsetParent !== null) {
            channels[i].focus();
            break;
        }
    }
}






// ################################   Habilita navegaciÃ³n con flechas entre elementos con foco
function enableArrowNavigation() {
    const focusables = Array.from(document.querySelectorAll(".channel, .canal-btn, #closeModal"));

    document.addEventListener("keydown", (e) => {
        const keyMap = {
            37: "left",
            38: "up",
            39: "right",
            40: "down"
        };

        if (!(e.keyCode in keyMap)) return;

        const direction = keyMap[e.keyCode];
        const current = document.activeElement;
        if (!focusables.includes(current)) return;

        const currentRect = current.getBoundingClientRect();
        let next = null;
        let minDistance = Infinity;

        for (const el of focusables) {
            if (el === current) continue;
            const rect = el.getBoundingClientRect();
            let isCandidate = false;
            let distance = Infinity;

            switch (direction) {
                case "up":
                    isCandidate = rect.bottom <= currentRect.top;
                    distance = Math.hypot(currentRect.left - rect.left, currentRect.top - rect.bottom);
                    break;
                case "down":
                    isCandidate = rect.top >= currentRect.bottom;
                    distance = Math.hypot(currentRect.left - rect.left, currentRect.bottom - rect.top);
                    break;
                case "left":
                    isCandidate = rect.right <= currentRect.left;
                    distance = Math.hypot(currentRect.left - rect.right, currentRect.top - rect.top);
                    break;
                case "right":
                    isCandidate = rect.left >= currentRect.right;
                    distance = Math.hypot(currentRect.right - rect.left, currentRect.top - rect.top);
                    break;
            }

            if (isCandidate && distance < minDistance) {
                minDistance = distance;
                next = el;
            }
        }

        if (next) {
            next.focus();
            e.preventDefault();
        }
    });

    // ################################    Enfocar el primer canal al cargar
    setTimeout(() => {
        const first = focusables.find(el => el.classList.contains("channel"));
        if (first) first.focus();
    }, 300);
}

// ################################   Carga la lista M3U y habilita navegaciÃ³n por flechas
fetchM3U().then(() => {
    enableArrowNavigation();
});

enableSidebarKeyboardNavigation();



//   ##############################   BUSCADOR POR LETRA-PALABRA

function filterChannels() {
  const input = document.getElementById('searchInput');
  const filter = input.value.toLowerCase();

  const groups = document.querySelectorAll('.channels-container');

  groups.forEach(container => {
    const channels = Array.from(container.querySelectorAll('.channel'));
    const matching = [];
    const nonMatching = [];

    channels.forEach(channel => {
      const img = channel.querySelector('img');
      const altText = img ? img.alt.toLowerCase() : "";

      if (altText.includes(filter)) {
        channel.style.display = "";
        matching.push(channel);
      } else {
        channel.style.display = "none";
        nonMatching.push(channel);
      }
    });

    // Reorganiza dentro del mismo contenedor
    matching.concat(nonMatching).forEach(channel => {
      container.appendChild(channel);
    });

    // Si no hay coincidencias visibles, puedes ocultar el grupo entero si quieres:
    const groupElement = container.closest('.group');
    if (matching.length === 0) {
      groupElement.style.display = "none";
    } else {
      groupElement.style.display = "";
    }
  });
}

//   ##############################     TERMINA BUSCADOR POR LETRA-PALABRA


function focusFirstVisibleChannel() {
    const channels = document.querySelectorAll(".channel");

    for (let i = 0; i < channels.length; i++) {
        if (channels[i].offsetParent !== null) { // Verifica si el canal estÃ¡ visible
            channels[i].focus();
            break;
        }
    }
}


// Luego de mostrar los canales:
document.getElementById("channelContainer").style.display = "block";

// Restaurar foco:
focusFirstVisibleChannel();



