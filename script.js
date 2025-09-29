// Smooth scroll untuk anchor internal
document.querySelectorAll('a[href^="#"]').forEach(link=>{
  link.addEventListener('click',e=>{
    e.preventDefault();
    document.querySelector(link.getAttribute('href')).scrollIntoView({behavior:'smooth'});
  });
});

// Animasi hover tambahan
document.querySelectorAll('nav a').forEach(a=>{
  a.addEventListener('mouseenter',()=>a.classList.add('underline','decoration-primary'));
  a.addEventListener('mouseleave',()=>a.classList.remove('underline','decoration-primary'));
});
