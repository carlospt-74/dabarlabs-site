// Dabar Labs + Assista — JS mínimo compartido entre páginas.
(function () {
  // Menú móvil
  var toggle = document.querySelector('.menu-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
      });
    });
  }

  // Acordeón de preguntas frecuentes
  document.querySelectorAll('.accordion-item').forEach(function (item) {
    var trigger = item.querySelector('.accordion-trigger');
    var panel = item.querySelector('.accordion-panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      item.classList.toggle('open', !isOpen);
      panel.style.maxHeight = isOpen ? '0px' : panel.scrollHeight + 'px';
    });
  });

  // Formulario de contacto
  var form = document.getElementById('form-contacto');
  if (form) {
    var msg = document.getElementById('form-msg');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var boton = form.querySelector('button[type="submit"]');
      boton.disabled = true;
      boton.textContent = 'Enviando...';

      var datos = Object.fromEntries(new FormData(form).entries());

      fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      })
        .then(function (res) {
          if (!res.ok) throw new Error('fallo');
          form.reset();
          msg.className = 'form-msg ok';
          msg.textContent = 'Gracias. Recibimos tu solicitud y te contactaremos a la brevedad.';
        })
        .catch(function () {
          msg.className = 'form-msg err';
          msg.textContent = 'No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos directamente.';
        })
        .finally(function () {
          boton.disabled = false;
          boton.textContent = 'Enviar solicitud';
        });
    });
  }
})();
