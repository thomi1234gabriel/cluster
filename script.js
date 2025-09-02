  // el loader se ejecuta inmediatamente
(function () {
  const loader = document.getElementById('app-loader');
  const bar = document.querySelector('.loader-progress__bar');
  const percLabel = document.getElementById('loader-perc');

  if (!loader || !bar || !percLabel) {
    // Si no encuentra los elementos, intenta de nuevo en un momento
    setTimeout(arguments.callee, 50);
    return;
  }

  const SHOW_MS = 1000;
  let target = 0;
  let shown = 0;

  const estTimer = setInterval(() => { target = Math.min(95, target + 5); }, 90);
  
  window.addEventListener('load', () => { target = 100; });

  function tick(){
    shown += (target - shown) * 0.14;
    const pct = Math.round(shown);
    bar.style.width = pct + '%';
    percLabel.textContent = pct;
    requestAnimationFrame(tick);
  }
  tick();

  setTimeout(() => {
    clearInterval(estTimer);
    target = 100;
    document.body.classList.add('is-ready');
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 550);
  }, SHOW_MS);
})();

// ===== RESTO DEL CÓDIGO CUANDO DOM ESTÉ LISTO =====
document.addEventListener('DOMContentLoaded', function() {
  
  // ====== NAV + REVEAL + SCROLLSPY ======
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');
  
  if (btn && nav) {
    btn.addEventListener('click', ()=>{ 
      const open = nav.classList.toggle('open'); 
      btn.setAttribute('aria-expanded', open ? 'true' : 'false'); 
    });
    
    document.addEventListener('click', (e)=>{ 
      if(!nav.contains(e.target) && !btn.contains(e.target)){ 
        if(nav.classList.contains('open')){ 
          nav.classList.remove('open'); 
          btn.setAttribute('aria-expanded','false'); 
        } 
      } 
    });
  }

  // Reveal animations para presentación
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target; 
        const delay = Number(el.dataset.delay||0);
        setTimeout(()=> el.classList.add('in'), delay); 
        observer.unobserve(el);
      }
    });
  },{ threshold: 0.2 });
  
  document.querySelectorAll('#presentacion .reveal').forEach(el=>observer.observe(el));

  // Scrollspy para navegación
  const map = { presentacion:'Presentación', empresas:'Empresas', sectores:'Sectores', contacto:'Contacto', vinculate:'Vinculate' };
  const links = [...document.querySelectorAll('.nav a')];
  const spy = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      const id = entry.target.id;
      if(entry.isIntersecting && map[id]){
        links.forEach(l=>l.classList.remove('active'));
        const current = links.find(l => l.textContent.trim() === map[id]);
        if(current){ current.classList.add('active'); }
      }
    });
  },{ threshold: 0.6 });
  
  Object.keys(map).forEach(id=>{ 
    const sec=document.getElementById(id); 
    if(sec) spy.observe(sec); 
  });

  // ===== ANIMACIONES DE SECCIONES =====
  
  // Animación misión y visión
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-animation').forEach(element => {
    sectionObserver.observe(element);
  });

  // Animación cards de sectores
  const sectorCards = document.querySelectorAll('.sector-card');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, index * 100);
        cardObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  sectorCards.forEach(card => {
    cardObserver.observe(card);
  });

  // Animación sección empresas
  const empresasSection = document.querySelector('.wrap-empresas');
  if (empresasSection) {
    const empresaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });

    empresaObserver.observe(empresasSection);
  }

  // Animación headers
  const headers = document.querySelectorAll('.emp-head');
  const headerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        headerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  headers.forEach(header => {
    headerObserver.observe(header);
  });

  // ===== NUEVA LÓGICA DE EMPRESAS =====

  // Mapeo de categorías del array Empresas a chips de filtro
  const CATEGORIA_TO_CHIP = {
  "Servicios de Ingeniería y Consultoría": "ingenieria",
  "Equipos y Componentes Industriales": "equipos", 
  "Tecnologías y Automatización": "tecnologia",
  "Seguridad y Medio Ambiente": "seguridad",
  "Logística y Servicios de Apoyo": "logistica",
  "default": "equipos"
};

  // Función para generar HTML de tarjeta de empresa
  function generarTarjetaEmpresa(empresa) {
    const chipKey = CATEGORIA_TO_CHIP[empresa.categoria] || CATEGORIA_TO_CHIP["default"];
    const logoPath = empresa.logoEmpresa ? `${empresa.logoEmpresa}` : 'meta.jpeg';
    
    const searchTags = [
      empresa.nombreEmpresa,
      empresa.categoria,
      ...(empresa.productos || []),
      empresa.descripcion || ''
    ].join(' ').toLowerCase();

    return `
      <div class="empresa-card empresa-card--logo" 
           data-sector="${chipKey}"
           data-name="${empresa.nombreEmpresa.replace(/"/g,'&quot;')}"
           data-tags="${searchTags.replace(/"/g,'&quot;')}"
           style="--order:${Math.floor(Math.random() * 10)}">
        <img class="empresa-image empresa-image--logo" 
             src="${logoPath}" 
             alt="${empresa.nombreEmpresa}"
             onerror="this.src='meta.jpeg'">
        <div class="overlay">
          <h3 class="overlay-title">${empresa.nombreEmpresa}</h3>
          <p class="overlay-description">${empresa.categoria}</p>
        </div>
      </div>
    `;
  }

  // Función para cargar empresas
  function cargarEmpresas() {
    const grid = document.getElementById('empGrid');
    if (!grid) {
      console.error('Grid no encontrado');
      return;
    }

    // Verificar si existe el array Empresas
    if (typeof Empresas === 'undefined') {
      console.error('Array Empresas no disponible');
      // Mostrar mensaje de error o crear empresas de ejemplo
      grid.innerHTML = '<p>No se pudieron cargar las empresas. Verifica que el archivo Empresas.js esté incluido.</p>';
      return;
    }

    // Generar HTML para todas las empresas
    grid.innerHTML = Empresas.map(generarTarjetaEmpresa).join('');

    // Activar animaciones
    requestAnimationFrame(() => {
      grid.querySelectorAll('.empresa-card').forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('visible');
        }, index * 50);
      });
    });
  }

  // Función de filtrado
  function applyFilter() {
    const grid = document.querySelector('.empresas-grid');
    if (!grid) return;
    
    const cards = Array.from(grid.querySelectorAll('.empresa-card'));
    const activeChip = document.querySelector('.chips .filter-chip.is-active');
    const input = document.getElementById('empSearch');
    
    const sector = activeChip ? activeChip.dataset.sector : 'all';
    const q = (input?.value || '').trim().toLowerCase();

    cards.forEach(card => {
      const cSec = card.dataset.sector;
      const name = (card.dataset.name || '').toLowerCase();
      const tags = (card.dataset.tags || '').toLowerCase();
      const sectorOk = (sector === 'all') || (cSec === sector);
      const textOk = !q || name.includes(q) || tags.includes(q);
      card.style.display = (sectorOk && textOk) ? '' : 'none';
    });
  }

  // Configurar filtros
  function configurarFiltros() {
    const chips = Array.from(document.querySelectorAll('.chips .filter-chip'));
    const clear = document.getElementById('clearFilters');
    const input = document.getElementById('empSearch');

    chips.forEach(ch => {
      ch.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('is-active'));
        ch.classList.add('is-active');
        applyFilter();
      });
    });

    clear?.addEventListener('click', () => {
      if(input) input.value = '';
      chips.forEach(c => c.classList.remove('is-active'));
      applyFilter();
    });

    input?.addEventListener('input', applyFilter);
  }
  
  // Cargar empresas
  cargarEmpresas();
  
  // Configurar filtros después de cargar
  setTimeout(() => {
    configurarFiltros();
    applyFilter();
  }, 100);

});