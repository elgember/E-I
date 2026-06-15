const camara = document.getElementById('miCamara');

let estaArrastrando = false;
let posicionAnterior = { x: 0, y: 0 };
let rotacionActual = { x: 0, y: 0 };

// --- LÓGICA DE LAS FOTOS ---

const visor = document.getElementById('visorFoto');
const imgPlaneta = document.getElementById('imagenPlaneta');
const tituloPlaneta = document.getElementById('nombrePlaneta');
const planetas = document.querySelectorAll('.planeta');
let temporizadorVisor;

// Diccionario con fotos reales de alta calidad (URLs de dominio público / NASA)
const fotosReales = {
  'mercurio': 'imagenes/IMG_5.jpg',
  'venus': 'imagenes/IMG_6.jpg',
  'tierra': 'imagenes/IMG_2.webp',
  'marte': 'imagenes/IMG_8.jpg',
  'jupiter': 'imagenes/IMG_4.jpg',
  'saturno': 'imagenes/IMG_1.webp',
  'urano': 'imagenes/IMG_7.jpg',
  'neptuno': 'imagenes/IMG_3.jpg',
};

const nombresPersonalizados = {
  'mercurio': 'Nuestro recuerdo de aniversario',
  'venus': 'Preciosa como siempre mi amor',
  'tierra': 'Nuestro Primer año juntos',
  'marte': 'Mi primera foto tuya',
  'jupiter': 'Mi amor, lo mejor de mi vida',
  'saturno': 'Siempre me la paso bien contigo',
  'urano': 'cada dia mas enamorado',
  'neptuno': 'Eres mi universo',
};

// Escuchamos el clic de cada planeta
planetas.forEach(planetaDiv => {
  planetaDiv.addEventListener('mousedown', (e) => {
    // Esto evita que al hacer clic se active accidentalmente la rotación de la cámara
    e.stopPropagation(); 
  });

  planetaDiv.addEventListener('click', (e) => {
    // Averiguamos qué planeta fue clickeado leyendo sus clases (ej. "planeta jupiter")
    const clases = Array.from(planetaDiv.classList);
    const nombre = clases.find(c => c !== 'planeta');
    
    // Inyectamos la información en el visor
    tituloPlaneta.innerText = nombresPersonalizados[nombre];
    imgPlaneta.src = fotosReales[nombre];
    
    // Mostramos el visor y pausamos la animación del universo
    visor.classList.add('activo');
    document.body.classList.add('pausado');

    // Por si haces varios clics, reiniciamos el temporizador
    clearTimeout(temporizadorVisor);

    // Cerramos automáticamente después de 20,000 milisegundos (20 segundos)
    temporizadorVisor = setTimeout(() => {
      cerrarVisor();
    }, 20000);
  });
});

function cerrarVisor() {
  visor.classList.remove('activo');
  document.body.classList.remove('pausado'); // Esto reanuda la animación de fondo
}

// Opcional: Permitir al usuario cerrar la foto antes de los 20s haciendo clic en cualquier lado del visor
visor.addEventListener('click', () => {
  clearTimeout(temporizadorVisor);
  cerrarVisor();
});

// Iniciar arrastre
document.addEventListener('mousedown', (e) => {
  estaArrastrando = true;
  posicionAnterior = { x: e.clientX, y: e.clientY };
});

// Girar mientras se arrastra
document.addEventListener('mousemove', (e) => {
  if (!estaArrastrando) return;

  const diferenciaX = e.clientX - posicionAnterior.x;
  const diferenciaY = e.clientY - posicionAnterior.y;

  // Ajustamos los ángulos (0.15 controla la sensibilidad del giro)
  rotacionActual.y += diferenciaX * 0.15;
  rotacionActual.x -= diferenciaY * 0.15; 

  // Limitamos para no dar vueltas de campana hacia arriba/abajo (opcional)
  if(rotacionActual.x > 80) rotacionActual.x = 80;
  if(rotacionActual.x < -80) rotacionActual.x = -80;

  // Aplicamos la rotación a la cámara
  camara.style.transform = `rotateX(${rotacionActual.x}deg) rotateY(${rotacionActual.y}deg)`;

  posicionAnterior = { x: e.clientX, y: e.clientY };
});

// Soltar
document.addEventListener('mouseup', () => {
  estaArrastrando = false;
});

// Salir de la pantalla
document.addEventListener('mouseleave', () => {
  estaArrastrando = false;
});

// --- SOPORTE PARA PANTALLAS TÁCTILES (MÓVILES) ---

// Iniciar arrastre con el dedo
document.addEventListener('touchstart', (e) => {
  estaArrastrando = true;
  // e.touches[0] captura la posición del primer dedo que toca la pantalla
  posicionAnterior = { x: e.touches[0].clientX, y: e.touches[0].clientY };
});

// Girar mientras se arrastra el dedo
document.addEventListener('touchmove', (e) => {
  if (!estaArrastrando) return;

  const diferenciaX = e.touches[0].clientX - posicionAnterior.x;
  const diferenciaY = e.touches[0].clientY - posicionAnterior.y;

  // En móviles, el movimiento puede sentirse muy brusco, 
  // bajamos un poco la sensibilidad a 0.1
  rotacionActual.y += diferenciaX * 0.1;
  rotacionActual.x -= diferenciaY * 0.1; 

  // Limitamos para no dar vueltas de campana hacia arriba/abajo
  if(rotacionActual.x > 80) rotacionActual.x = 80;
  if(rotacionActual.x < -80) rotacionActual.x = -80;

  // Aplicamos la rotación a la cámara
  camara.style.transform = `rotateX(${rotacionActual.x}deg) rotateY(${rotacionActual.y}deg)`;

  posicionAnterior = { x: e.touches[0].clientX, y: e.touches[0].clientY };
});

// Soltar el dedo
document.addEventListener('touchend', () => {
  estaArrastrando = false;
});

// --- LÓGICA DEL DESTELLO AL TOCAR LA PANTALLA ---

function crearDestello(e) {
  // 1. Averiguamos las coordenadas exactas del clic o del dedo
  let x, y;
  
  if (e.type === 'touchstart') {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  } else {
    x = e.clientX;
    y = e.clientY;
  }

  // 2. Creamos la "estrella" en el código
  const destello = document.createElement('div');
  destello.classList.add('onda-estelar');
  
  // 3. La movemos al punto exacto donde tocó
  destello.style.left = `${x}px`;
  destello.style.top = `${y}px`;
  
  // 4. La pegamos en la pantalla
  document.body.appendChild(destello);
  
  // 5. La borramos de la memoria después de 600 milisegundos (cuando acaba la animación)
  setTimeout(() => {
    destello.remove();
  }, 600);
}


// --- SISTEMA DE RASTREO 2D PLANO ---

// Esperamos a que la página cargue para evitar errores
document.addEventListener('DOMContentLoaded', () => {
  const planetas3D = document.querySelectorAll('.planeta');
  const cajas2D = [];

  planetas3D.forEach(planeta => {
    // 1. Creamos la caja plana (2D)
    const hitbox = document.createElement('div');
    hitbox.className = 'hitbox-planeta';
    
    // 2. La inyectamos directamente en el body (Fuera del contenedor 3D)
    document.body.appendChild(hitbox);

    // 3. Evento de toque directo
    hitbox.addEventListener('click', (e) => {
      e.stopPropagation(); // Evita clics dobles

      // Obtenemos el nombre del planeta de forma segura
      let nombre = "";
      planeta.classList.forEach(clase => {
        if(clase !== 'planeta') nombre = clase;
      });

      // Conectamos con el visor
      const tituloPlaneta = document.getElementById('nombrePlaneta');
      const imgPlaneta = document.getElementById('imagenPlaneta');
      const visor = document.getElementById('visorFoto');

      tituloPlaneta.innerText = nombresPersonalizados[nombre];
      imgPlaneta.src = fotosReales[nombre];

      visor.classList.add('activo');
      document.body.classList.add('pausado');

      clearTimeout(temporizadorVisor);
      temporizadorVisor = setTimeout(() => {
        cerrarVisor();
      }, 20000);
    });

    cajas2D.push({ planeta3D: planeta, hitbox2D: hitbox });
  });

  // 4. El motor que pega las coordenadas 3D a la pantalla 2D
  function rastrearCajas() {
    cajas2D.forEach(item => {
      // getBoundingClientRect lee dónde se dibujó el planeta en la pantalla de tu celular
      const rect = item.planeta3D.getBoundingClientRect();

      // Si el planeta tiene un tamaño lógico y está en la pantalla...
      if (rect.width > 0 && rect.top < window.innerHeight && rect.bottom > 0) {
        item.hitbox2D.style.display = 'block';

        // Calculamos el centro exacto
        const centroX = rect.left + (rect.width / 2);
        const centroY = rect.top + (rect.height / 2);

        // El tamaño: Mínimo 80px (perfecto para un dedo pulgar), si el planeta es más grande, crece con él.
        const tamano = Math.max(rect.width, 80);

        // Actualizamos la posición 2D
        item.hitbox2D.style.left = `${centroX}px`;
        item.hitbox2D.style.top = `${centroY}px`;
        item.hitbox2D.style.width = `${tamano}px`;
        item.hitbox2D.style.height = `${tamano}px`;
      } else {
        // Si el planeta está detrás de la cámara, ocultamos el círculo
        item.hitbox2D.style.display = 'none';
      }
    });

    requestAnimationFrame(rastrearCajas);
  }

  rastrearCajas();
});