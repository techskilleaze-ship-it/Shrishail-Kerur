(function(){
  const $ = id => document.getElementById(id);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motion = !reduce;
  // reveal
  const els = Array.from(document.querySelectorAll('[data-reveal]'));
  if (motion) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'none'; io.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(el => {
      const sib = Array.from(el.parentElement.children).filter(c => c.hasAttribute('data-reveal'));
      const d = Math.min(sib.indexOf(el), 6) * 80;
      el.style.opacity = '0'; el.style.transform = 'translateY(32px)';
      el.style.transition = 'opacity .9s cubic-bezier(.2,.7,.2,1) ' + d + 'ms, transform 1.1s cubic-bezier(.2,.7,.2,1) ' + d + 'ms';
      io.observe(el);
    });
  }
  // beams
  const a = $('beamA'), b = $('beamB');
  if (motion && a && b && a.animate) {
    a.animate([{transform:'rotate(-14deg)'},{transform:'rotate(12deg)'}],{duration:7000,iterations:Infinity,direction:'alternate',easing:'ease-in-out'});
    b.animate([{transform:'rotate(14deg)'},{transform:'rotate(-10deg)'}],{duration:8600,iterations:Infinity,direction:'alternate',easing:'ease-in-out'});
    a.animate([{opacity:.55},{opacity:1}],{duration:3200,iterations:Infinity,direction:'alternate',easing:'ease-in-out'});
  }
  // timecode
  const tc = $('tc'), t0 = performance.now(), p = n => String(n).padStart(2,'0');
  (function tick(){ const ms = performance.now()-t0, s = Math.floor(ms/1000), f = Math.floor((ms%1000)/40);
    tc.textContent = p(Math.floor(s/3600))+':'+p(Math.floor(s/60)%60)+':'+p(s%60)+':'+p(f); requestAnimationFrame(tick); })();
  // scroll effects
  const nav = $('nav'), img = $('heroImg'), strip = $('strip');
  let ticking = false;
  function apply(){
    const y = scrollY, vh = innerHeight, solid = y > 40;
    nav.style.background = solid ? 'rgba(11,10,13,.82)' : 'transparent';
    nav.style.backdropFilter = solid ? 'blur(14px)' : 'none';
    nav.style.borderBottomColor = solid ? 'rgba(243,239,233,.08)' : 'transparent';
    if (motion && y < vh*1.2) img.style.transform = 'translate3d(0,'+(y*0.28)+'px,0) scale('+(1+y/vh*0.06)+')';
    const sec = strip.parentElement.getBoundingClientRect();
    const max = Math.max(0, strip.scrollWidth - innerWidth + 40);
    const pr = Math.min(1, Math.max(0, (vh - sec.top) / (vh + sec.height)));
    strip.style.transform = motion ? 'translate3d('+(-pr*max)+'px,0,0)' : 'none';
    strip.parentElement.style.overflowX = motion ? 'hidden' : 'auto';
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; apply(); }); } }, { passive: true });
  addEventListener('resize', apply); apply();
  // video
  const v = $('video');
  if (v) { v.muted = true; new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(()=>{}); else v.pause(); }, { threshold: 0.3 }).observe(v); }
})();
