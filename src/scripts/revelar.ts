/**
 * Entrada ao rolar: elementos com `data-revelar` aparecem com fade + leve
 * subida quando chegam na tela. O visual está em global.css ("Entrada ao rolar").
 *
 * - `data-revelar-grupo` num pai: o grupo é observado inteiro e, ao entrar,
 *   os filhos `data-revelar` aparecem em sequência (escalonamento). Serve
 *   para grades e carrosséis: num carrossel os cards fora da área visível
 *   entram junto, em vez de surgirem um a um enquanto a pessoa arrasta.
 * - O que já está na tela ao carregar aparece direto, sem animar (senão
 *   piscaria: pintado visível, escondido, animado de novo).
 * - Rede de segurança: numa rolagem muito rápida (arremesso no celular,
 *   arrastar a barra) o observador pode não pegar um elemento que passou
 *   entre dois quadros. Quando a rolagem para, quem ficou na tela entra, e
 *   quem já ficou para cima aparece direto — nada fica invisível.
 * - Sem IntersectionObserver ou com prefers-reduced-motion, nada é ativado.
 */

/** Intervalo entre um card e o próximo no escalonamento. */
const PASSO_MS = 90;
/** Depois de 6 itens o atraso para de crescer (o 8º card não espera 700ms). */
const MAX_PASSOS = 5;

const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduzido && "IntersectionObserver" in window) {
  iniciar();
}

function iniciar() {
  const grupos = Array.from(document.querySelectorAll<HTMLElement>("[data-revelar-grupo]"));
  const soltos = Array.from(document.querySelectorAll<HTMLElement>("[data-revelar]")).filter(
    (el) => !el.closest("[data-revelar-grupo]")
  );

  const itensDe = (alvo: Element) =>
    alvo.hasAttribute("data-revelar-grupo")
      ? Array.from(alvo.querySelectorAll<HTMLElement>("[data-revelar]"))
      : [alvo as HTMLElement];

  // Quem já está visível fica visível; só o resto entra na fila.
  const pendentes = [...grupos, ...soltos].filter((alvo) => {
    const caixa = alvo.getBoundingClientRect();
    const naTela = caixa.top < window.innerHeight && caixa.bottom > 0;
    if (naTela) itensDe(alvo).forEach((el) => el.classList.add("revelado"));
    return !naTela;
  });

  document.documentElement.classList.add("revelar-ativo");

  const observador = new IntersectionObserver(
    (entradas) => {
      // Soltos que entram no mesmo instante (ex.: título + card) também escalonam.
      let ordem = 0;
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        // `soltar` é definido logo abaixo; o callback só roda depois.
        soltar(entrada.target, true, ordem++);
      }
    },
    // Dispara um pouco antes da borda de baixo, quando o elemento já "entrou".
    { rootMargin: "0px 0px -8% 0px" }
  );

  const fila = new Set(pendentes);
  fila.forEach((alvo) => observador.observe(alvo));

  // Revela e tira da fila (usado pelo observador e pela rede de segurança).
  const soltar = (alvo: Element, animar: boolean, posicaoInicial = 0) => {
    if (!fila.delete(alvo)) return;
    observador.unobserve(alvo);
    const ehGrupo = alvo.hasAttribute("data-revelar-grupo");
    itensDe(alvo).forEach((el, i) => {
      if (animar) revelar(el, ehGrupo ? i : posicaoInicial);
      else el.classList.add("revelado");
    });
  };

  const conferir = () => {
    fila.forEach((alvo) => {
      const caixa = alvo.getBoundingClientRect();
      if (caixa.bottom <= 0) soltar(alvo, false);
      else if (caixa.top < window.innerHeight) soltar(alvo, true);
    });
  };

  // `scrollend` onde existe; nos demais, fim de rolagem por espera curta.
  if ("onscrollend" in window) {
    window.addEventListener("scrollend", conferir, { passive: true });
  } else {
    let espera = 0;
    window.addEventListener(
      "scroll",
      () => {
        clearTimeout(espera);
        espera = window.setTimeout(conferir, 150);
      },
      { passive: true }
    );
  }
}

function revelar(el: HTMLElement, posicao: number) {
  el.style.setProperty("--atraso", `${Math.min(posicao, MAX_PASSOS) * PASSO_MS}ms`);
  el.classList.add("revelado", "animar");

  // Tira a animação ao terminar, para ela não segurar o `translate` e os
  // hovers que sobem o card voltarem a funcionar. Filtra pelo nome: o
  // evento borbulha de animações de dentro do card (selo, reflexo...).
  const aoTerminar = (evento: AnimationEvent) => {
    if (evento.target !== el || evento.animationName !== "revelar") return;
    el.classList.remove("animar");
    el.style.removeProperty("--atraso");
    el.removeEventListener("animationend", aoTerminar);
  };
  el.addEventListener("animationend", aoTerminar);
}
