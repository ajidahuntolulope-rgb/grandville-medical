// GRANDVILLE MEDICAL — interactions
(function(){
  'use strict';

  // ---- Nav: transparent → solid on scroll ----
  var nav = document.querySelector('.nav');
  function onScroll(){
    if(!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // ---- Mobile menu ----
  var burger = document.querySelector('.burger');
  var menu = document.querySelector('.mobile-menu');
  if(burger && menu){
    burger.addEventListener('click', function(){
      burger.classList.toggle('open');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        burger.classList.remove('open');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Reveal on scroll ----
  var revealEls = document.querySelectorAll('.reveal');
  function revealAll(){
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }
  if('IntersectionObserver' in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
    revealEls.forEach(function(el){ io.observe(el); });
    // Safety net: if IO never fires (hidden tab, broken env), reveal everything
    setTimeout(revealAll, 2000);
  } else {
    revealAll();
  }

  // ---- Footer year ----
  document.querySelectorAll('.js-year').forEach(function(el){
    el.textContent = new Date().getFullYear();
  });

  // ---- FormSubmit (no backend needed) ----
  document.querySelectorAll('form[data-formsubmit]').forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var data = new FormData(form);
      var action = form.getAttribute('data-formsubmit');
      fetch(action, {method:'POST', body:data, mode:'no-cors'})
        .then(function(){
          form.reset();
          var note = form.querySelector('.form-success');
          if(!note){
            note = document.createElement('p');
            note.className = 'form-success';
            note.style.cssText = 'grid-column:1/-1;color:#7CB342;font-size:.9rem;padding:12px 0;';
            note.textContent = 'Thank you — your request has been received. Our team will contact you shortly.';
            form.appendChild(note);
            setTimeout(function(){ note.remove(); }, 8000);
          }
        })
        .catch(function(){
          alert('Something went wrong. Please call us on +234 906 000 7927.');
        });
    });
  });

  // ---- Smooth anchor scroll (with fixed-nav offset) ----
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href');
      if(id.length > 1){
        var target = document.querySelector(id);
        if(target){
          e.preventDefault();
          var y = target.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({top:y, behavior:'smooth'});
        }
      }
    });
  });
})();
