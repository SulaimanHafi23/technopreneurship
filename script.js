// Enhance in-page navigation for single-page anchors
document.addEventListener('DOMContentLoaded', () => {
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navOverlay = document.getElementById('nav-overlay');

  // Close mobile menu when a nav link is clicked
  if (navMenu) {
    navMenu.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', () => {
        if (window.innerWidth < 768 && navMenu.classList.contains('block')) {
          navMenu.classList.add('hidden');
          navMenu.classList.remove('block');
          if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
          // Sembunyikan overlay jika ada
          if (navOverlay) navOverlay.classList.add('hidden');
        }
      });
    });
  }

  // Optional: highlight active nav item on scroll
  const sections = ['home','product','about','contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const linkMap = new Map();
  if (navMenu) {
    navMenu.querySelectorAll('a[href^="#"]').forEach(a => {
      const hash = a.getAttribute('href').slice(1);
      linkMap.set(hash, a);
    });
  }
  const setActive = (id) => {
    linkMap.forEach((a, key) => {
      if (key === id) {
        a.classList.add('text-primary','underline','underline-offset-4');
      } else {
        a.classList.remove('text-primary','underline','underline-offset-4');
      }
    });
  };
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      let current = 'home';
      const offset = 120; // account for sticky header
      sections.forEach(sec => {
        const top = sec.getBoundingClientRect().top;
        if (top - offset <= 0) current = sec.id;
      });
      setActive(current);
      ticking = false;
    });
  };
  if (sections.length) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
});

// Smooth scroll untuk anchor internal
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Animasi hover tambahan pada link navbar
document.querySelectorAll('nav a').forEach(a => {
  a.addEventListener('mouseenter', () => a.classList.add('underline', 'decoration-primary', 'underline-offset-4'));
  a.addEventListener('mouseleave', () => a.classList.remove('underline', 'decoration-primary', 'underline-offset-4'));
});

// Toggle menu mobile untuk header publik
(function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;
  // Siapkan overlay global untuk menu mobile (dibuat sekali dan dipakai lintas halaman)
  let overlay = document.getElementById('nav-overlay');
  const desiredOverlayClass = 'fixed inset-0 bg-transparent z-40 hidden md:hidden';
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'nav-overlay';
    overlay.className = desiredOverlayClass;
    document.body.appendChild(overlay);
  } else {
    // Ensure old classes (e.g., bg-black/40 or backdrop-blur) are replaced
    overlay.className = desiredOverlayClass;
  }

  const isSidebar = menu.classList.contains('as-sidebar');
  const openMenu = () => {
    if (isSidebar) {
      menu.classList.remove('-translate-x-full','hidden');
      menu.classList.add('translate-x-0');
    } else {
      menu.classList.remove('hidden');
    }
    toggle.setAttribute('aria-expanded', 'true');
    overlay.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  };
  const closeMenu = () => {
    if (isSidebar) {
      menu.classList.add('-translate-x-full');
      menu.classList.remove('translate-x-0');
    } else {
      menu.classList.add('hidden');
    }
    toggle.setAttribute('aria-expanded', 'false');
    overlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  };
  const isOpen = () => isSidebar ? menu.classList.contains('translate-x-0') : !menu.classList.contains('hidden');
  const toggleMenu = () => (isOpen() ? closeMenu() : openMenu());

  toggle.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);
  const closeBtn = document.getElementById('nav-close');
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      closeMenu();
    }
  });
  // Tutup menu saat klik link
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      closeMenu();
    }
  }));
  // Pastikan overlay menghilang saat resize ke md+ dan menu mengikuti state responsif
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      overlay.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
      if (isSidebar) {
        // Normalize sidebar menu to visible/static state on desktop
        menu.classList.remove('translate-x-0','-translate-x-full','hidden');
      }
    } else {
      if (isSidebar) {
        // Ensure off-canvas initial state on mobile
        menu.classList.add('-translate-x-full');
      }
    }
  });
})();

// Toggle sidebar untuk halaman admin (off-canvas di mobile)
(function initAdminSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar || !toggle) return;
  const open = () => {
    sidebar.classList.remove('-translate-x-full');
    if (overlay) overlay.classList.remove('hidden');
  };
  const close = () => {
    sidebar.classList.add('-translate-x-full');
    if (overlay) overlay.classList.add('hidden');
  };
  const isOpen = () => !sidebar.classList.contains('-translate-x-full');
  toggle.addEventListener('click', () => (isOpen() ? close() : open()));
  if (overlay) overlay.addEventListener('click', close);
  // Tutup saat resize ke md ke atas (agar konsisten)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      sidebar.classList.remove('-translate-x-full');
      if (overlay) overlay.classList.add('hidden');
    }
  });
})();
