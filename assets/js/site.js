(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.nav');

  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  };

  if (menuButton && navigation) {
    menuButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      navigation.classList.toggle('is-open', open);
    });
    navigation.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('click', (event) => {
      if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    const updateVisibility = () => {
      const visible = window.scrollY > 120;
      backToTop.classList.toggle('is-visible', visible);
      backToTop.setAttribute('aria-hidden', visible ? 'false' : 'true');
    };
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();
  }

  document.querySelectorAll('.faq-list details').forEach((details) => {
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      window.requestAnimationFrame(() => {
        const top = details.getBoundingClientRect().top + window.scrollY - 16;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      });
    });
  });

  const demos = [...document.querySelectorAll('[data-calc-demo]')];
  if (!demos.length) return;

  const examples = [
    { expression: '100 + 10%', result: '110' },
    { expression: '2^(3^2)', result: '512' },
    { expression: '25 MPa * 300 mm^2', result: '7,5 kN' },
    { expression: 'log2(1024)', result: '10' }
  ];

  const render = (expression, result = '', confirmed = false) => {
    demos.forEach((demo) => {
      const expressionNode = demo.querySelector('[data-demo-expression]');
      const resultNode = demo.querySelector('[data-demo-result]');
      if (expressionNode) expressionNode.textContent = expression;
      if (resultNode) {
        resultNode.textContent = result ? `= ${result}` : '';
        resultNode.classList.toggle('is-confirmed', confirmed);
      }
    });
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    render(examples[2].expression, examples[2].result, false);
    return;
  }

  const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  const waitForVisiblePage = async () => {
    while (document.hidden) await wait(250);
  };

  const animate = async () => {
    let index = 0;
    while (true) {
      await waitForVisiblePage();
      const example = examples[index];
      render('');
      await wait(360);

      for (let length = 1; length <= example.expression.length; length += 1) {
        await waitForVisiblePage();
        render(example.expression.slice(0, length));
        await wait(64 + Math.random() * 28);
      }

      render(example.expression, example.result, false);
      await wait(720);
      render(example.expression, example.result, true);
      await wait(1450);
      index = (index + 1) % examples.length;
    }
  };

  animate();
})();
