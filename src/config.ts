/**
 * Configuração central do site.
 * Tudo que depende de dado real do cliente vive aqui — trocar em um lugar só.
 */

// TODO: substituir pelo número real do Clube (formato internacional, só dígitos)
export const WHATSAPP_NUMERO = "5554999999999";

/** Monta o link do WhatsApp com mensagem pré-preenchida. */
export function whatsapp(mensagem: string): string {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}

export const LINKS = {
  heroConversa: whatsapp("Oi! Vim pelo site e quero saber mais sobre as aulas."),
  aulaGratis: whatsapp("Oi! Quero agendar minha aula experimental gratuita de 30 minutos."),
  ingles: whatsapp("Oi! Tenho interesse nas aulas de inglês."),
  espanhol: whatsapp("Oi! Tenho interesse nas aulas de espanhol."),
  idiomas: whatsapp("Oi! Quero aprender um novo idioma. Pode me contar como funcionam as aulas?"),
  consultarValor: whatsapp("Oi! Quero consultar o valor do plano ideal pra mim."),
  professoras: whatsapp("Oi! Quero conhecer as professoras do Clube."),
  // TODO: substituir pelo perfil real
  instagram: "https://instagram.com/clubedofluente",
} as const;

export const SITE = {
  nome: "Clube do Fluente",
  titulo: "Clube do Fluente — Aulas de inglês e espanhol ao vivo",
  descricao:
    "Aulas particulares de inglês e espanhol ao vivo, feitas sob medida para o seu objetivo. Conversação desde a primeira aula. Aula experimental gratuita de 30 minutos.",
  email: "contato@clubedofluente.com.br",
  url: "https://clubedofluente.com.br",
} as const;
