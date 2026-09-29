/**
 * Rolagem automática dos carrosséis (Carrossel.astro e CarrosselCards.astro).
 *
 * A cada INTERVALO_MS o trilho avança um card; no último, volta ao início.
 * Só roda quando faz sentido, e para sozinho quando atrapalharia:
 * - trilho sem rolagem (ex.: Depoimentos no desktop, que vira grade): nada;
 * - mouse em cima ou foco de teclado dentro do carrossel: pausa enquanto durar;
 * - pessoa arrastou, rolou ou clicou numa seta/bolinha: espera PAUSA_TOQUE_MS
 *   sem mexer antes de voltar, para não "brigar" com quem está navegando;
 * - carrossel fora da tela ou aba escondida: não avança;
 * - prefers-reduced-motion: nunca liga, e o botão de pausa some.
 * O botão de pausa/retomar atende o WCAG 2.2.2 (conteúdo que se move sozinho
 * precisa de um jeito de parar); a escolha da pessoa vale até ela mudar.
 */

const INTERVALO_MS = 5000;
const PAUSA_TOQUE_MS = 8000;

interface Opcoes {
  /** Elemento que envolve trilho, setas e bolinhas (hover/foco/toque). */
  raiz: HTMLElement;
  /** O contêiner com rolagem horizontal. */
  trilho: HTMLElement;
  /** Quanto rolar para avançar um card (o mesmo das setas). */
  passo: () => number;
  /** Botão de pausar/retomar; alterna os ícones [data-icone-pausar|retomar]. */
  botao?: HTMLButtonElement | null;
}

export function autoplayCarrossel({ raiz, trilho, passo, botao }: Opcoes) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    if (botao) botao.hidden = true;
    return;
  }

  let pausadoPelaPessoa = false;
  let emCima = false;
  let comFoco = false;
  let naTela = false;
  let ultimoToque = 0;

  const temRolagem = () => trilho.scrollWidth - trilho.clientWidth > 1;

  const avancar = () => {
    if (pausadoPelaPessoa || emCima || comFoco || !naTela || document.hidden) return;
    if (Date.now() - ultimoToque < PAUSA_TOQUE_MS || !temRolagem()) return;

    const maximo = trilho.scrollWidth - trilho.clientWidth;
    if (trilho.scrollLeft >= maximo - 1) {
      trilho.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      trilho.scrollBy({ left: passo(), behavior: "smooth" });
    }
  };
  window.setInterval(avancar, INTERVALO_MS);

  new IntersectionObserver(([entrada]) => {
    naTela = entrada.isIntersecting;
  }).observe(trilho);

  // Hover só com mouse: no toque o pointerenter/leave vem junto com o dedo.
  raiz.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") emCima = true;
  });
  raiz.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "mouse") emCima = false;
  });
  // Foco no próprio botão de pausa não conta: depois de clicar em "retomar"
  // o foco fica nele, e o carrossel ficaria parado para sempre.
  raiz.addEventListener("focusin", (e) => {
    if (e.target !== botao) comFoco = true;
  });
  raiz.addEventListener("focusout", (e) => {
    const destino = e.relatedTarget as Node | null;
    if (!raiz.contains(destino) || destino === botao) comFoco = false;
  });

  // Interações da pessoa (não o scroll programático do próprio autoplay).
  const tocou = () => (ultimoToque = Date.now());
  ["pointerdown", "wheel", "touchstart", "keydown"].forEach((evento) =>
    raiz.addEventListener(evento, tocou, { passive: true })
  );

  if (botao) {
    const pausar = botao.querySelector<SVGElement>("[data-icone-pausar]");
    const retomar = botao.querySelector<SVGElement>("[data-icone-retomar]");
    const sincronizar = () => {
      botao.setAttribute(
        "aria-label",
        pausadoPelaPessoa ? "Retomar a passagem automática" : "Pausar a passagem automática"
      );
      pausar?.classList.toggle("hidden", pausadoPelaPessoa);
      retomar?.classList.toggle("hidden", !pausadoPelaPessoa);
    };
    botao.addEventListener("click", () => {
      pausadoPelaPessoa = !pausadoPelaPessoa;
      sincronizar();
    });
    // O botão fica dentro da raiz: clicar nele não deve contar como "toque".
    botao.addEventListener("pointerdown", (e) => e.stopPropagation());
    sincronizar();
  }
}
