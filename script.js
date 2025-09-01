// ====== NAV + REVEAL + SCROLLSPY ======
const btn = document.querySelector('.nav-toggle');
const nav = document.getElementById('main-nav');
btn.addEventListener('click', ()=>{ const open = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); });
document.addEventListener('click', (e)=>{ if(!nav.contains(e.target) && !btn.contains(e.target)){ if(nav.classList.contains('open')){ nav.classList.remove('open'); btn.setAttribute('aria-expanded','false'); } } });

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const el = entry.target; const delay = Number(el.dataset.delay||0);
      setTimeout(()=> el.classList.add('in'), delay); observer.unobserve(el);
    }
  });
},{ threshold: 0.2 });
document.querySelectorAll('#presentacion .reveal').forEach(el=>observer.observe(el));

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
Object.keys(map).forEach(id=>{ const sec=document.getElementById(id); if(sec) spy.observe(sec); });

// animacion mision y vison
document.addEventListener('DOMContentLoaded', function() {
  // Configuración del Intersection Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  // Función para envolver palabras en spans (opcional)
  function wrapWords() {
    const texts = document.querySelectorAll('.about-text');
    texts.forEach(text => {
      const words = text.textContent.split(' ');
      text.innerHTML = words.map(word => `<span>${word}</span>`).join(' ');
    });
  }

  // Activar esto si quieres animación palabra por palabra
  // wrapWords();

  // Observar elementos para animación
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        
        // Animación palabra por palabra (opcional)
        if (entry.target.querySelector('.about-text')) {
          const spans = entry.target.querySelectorAll('.about-text span');
          spans.forEach((span, index) => {
            setTimeout(() => {
              span.style.opacity = 1;
            }, index * 30); // Retraso entre palabras
          });
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar todos los elementos con la clase reveal-animation
  document.querySelectorAll('.reveal-animation').forEach(element => {
    observer.observe(element);
  });
});


//animacion card

document.addEventListener('DOMContentLoaded', function() {
  const sectorCards = document.querySelectorAll('.sector-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Añadir un pequeño delay basado en el índice para efecto cascada
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, index * 100);
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  sectorCards.forEach(card => {
    observer.observe(card);
  });
});




document.addEventListener('DOMContentLoaded', function() {
  const section = document.querySelector('.wrap-empresas');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.2
  });

  observer.observe(section);
});



// Lista de archivos de logos (ajustá nombres según tus PNG reales)
const LOGOS = [
  "abac.png","acualite.png","decibel.png","emeldis.png","sero.png",
  "caef.png","drecnaf.png","electrokno.png","emeldis2.png","hcindustrial.png",
  "mayekawa.png","mernera.png","renuotores.png","tm.png","opsa.png",
  "parct.png","poye.png","sero2.png","sintercal.png","tarewa.png",
  "globalcomponentes.png","vortech.png","weft.png","yacoyaco.png","metalmarta.png",
  "rgmetalurgica.png","prefromados.png","abac2.png","opsa2.png","tm2.png",
  "hc2.png","parct2.png","vort2.png","weft2.png","global2.png","poye2.png"
];

// Genera un título legible a partir del nombre de archivo
const pretty = f => f
  .replace(/\.[a-z0-9]+$/i,'')   // saca extensión
  .replace(/[_-]+/g,' ')         // guiones a espacios
  .replace(/\b([a-z])/g, m => m.toUpperCase()); // Capitaliza

(function renderLogos(){
  const grid = document.getElementById('empGrid');
  if(!grid) return;

  grid.innerHTML = LOGOS.slice(0,36).map((file, i) => {
    const name = pretty(file);
    const order = i; // para animación en cascada
    return `
      <div class="empresa-card empresa-card--logo" style="--order:${order}">
        <img class="empresa-image empresa-image--logo" src="logos/${file}" alt="${name}">
        <div class="overlay">
          <h3 class="overlay-title">${name}</h3>
          <p class="overlay-description">Empresa</p>
        </div>
      </div>
    `;
  }).join('');

  // Marca las cards como visibles (si usás animación CSS)
  requestAnimationFrame(()=>{
    grid.querySelectorAll('.empresa-card').forEach(el=>el.classList.add('visible'));
  });
})();


