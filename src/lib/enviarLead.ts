/**
 * Envio do formulário de contato.
 *
 * STUB — hoje só simula o envio para o protótipo funcionar de ponta a ponta.
 * A integração real com o Pipefy entra aqui depois da aprovação visual:
 * troca-se o corpo desta função por um fetch para /api/lead, que por sua vez
 * chama a mutation `createCard` do GraphQL do Pipefy com PIPEFY_TOKEN e
 * PIPEFY_PIPE_ID vindos do .env. A assinatura não muda.
 */

export interface Lead {
  nome: string;
  email: string;
  telefone: string;
  idioma: string;
  horarios: string;
}

export interface ResultadoEnvio {
  ok: boolean;
  mensagem: string;
}

export async function enviarLead(lead: Lead): Promise<ResultadoEnvio> {
  // Simula a latência de rede para os estados de loading aparecerem no protótipo.
  await new Promise((resolve) => setTimeout(resolve, 900));

  console.info("[stub] lead capturado — integrar com Pipefy:", lead);

  return {
    ok: true,
    mensagem: "Recebemos seus dados. A equipe responde ainda hoje com os horários disponíveis.",
  };
}
