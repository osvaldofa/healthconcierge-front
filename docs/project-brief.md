# Project Brief — Health Concierge

**Version:** 1.0.0
**Status:** Draft
**Criado por:** Atlas (@analyst)
**Data:** 2026-03-11
**Evento:** Hackathon Avanade 2026

---

## Sumário Executivo

O **Health Concierge** é um aplicativo web MVP voltado para pacientes de uma rede de clínicas, com foco especial no público idoso. Ele oferece uma interface conversacional fluida — priorizando a interação por voz — que permite ao paciente realizar triagem básica de saúde e agendar consultas médicas de forma simples e acessível.

---

## Problema

Pacientes idosos de redes de clínicas encontram dificuldade em:
- Avaliar a gravidade dos próprios sintomas e saber quando buscar atendimento urgente
- Navegar por interfaces complexas para agendar consultas
- Obter orientações de saúde de forma rápida, sem precisar ligar ou ir presencialmente à clínica

---

## Proposta de Valor

Uma interface de concierge inteligente, acessível via voz ou texto, que orienta o paciente com linguagem natural, reduz a fricção do atendimento clínico e melhora a experiência do usuário idoso — substituindo formulários e menus complexos por uma conversa direta.

---

## Usuários-Alvo

| Perfil | Descrição |
|--------|-----------|
| **Primário** | Pacientes idosos de rede de clínicas |
| **Secundário** | Demais pacientes da rede (adultos) |

**Características do público primário:**
- Pouca familiaridade com tecnologia complexa
- Preferência por interações simples e diretas
- Possível limitação de mobilidade (favorece o uso de voz)
- Necessidade de linguagem clara, sem jargão técnico

---

## Funcionalidades do MVP

### F1 — Triagem Básica de Saúde
- Paciente descreve seus sintomas (texto ou voz)
- Sistema identifica gravidade e orienta de acordo
- Em casos graves, recomenda ir imediatamente à emergência
- Em casos leves/moderados, orienta sobre próximos passos

### F2 — Consultas e Agendamentos
- Paciente consulta disponibilidade de médicos/especialidades
- Paciente solicita agendamento de consulta
- Sistema confirma ou oferece alternativas

---

## Telas (UI — MVP)

### Tela 1 — Login Simplificado
- Campo único: **e-mail**
- Ao submeter, o sistema identifica o paciente e redireciona para a área logada
- Sem senha (MVP)

### Tela 2 — Interface Principal (Chat Concierge)
- Layout inspirado em interfaces de chat de IA (estilo GPT/Claude)
- Campo de texto para digitação livre
- Botão de voz destacado para gravação e envio de áudio
- Exibição do histórico da conversa (gerenciado pelo frontend)
- Respostas textuais: organizadas, sucintas e em linguagem natural

---

## Arquitetura Técnica

### Frontend
| Aspecto | Decisão |
|---------|---------|
| Framework | Next.js (ou equivalente React) |
| Hospedagem | Vercel |
| Linguagem principal | TypeScript |
| Interação por voz | Web Speech API ou MediaRecorder → .wav |

### Backend (já implementado)
| Aspecto | Detalhe |
|---------|---------|
| Tipo | API REST HTTP |
| Ambiente atual | Local |
| Ambiente alvo | Azure (migração prevista para amanhã) |
| Formato de resposta | JSON |

### Endpoints (confirmados via controller C#)
| Endpoint | Método | Payload | Uso |
|----------|--------|---------|-----|
| `POST /api/atendimento/interagir` | POST | `application/json: { Prompt, JsonHistory, PatientId, PatientName }` | Envio de mensagem de texto |
| `POST /api/atendimento/upload-interacao` | POST | `multipart/form-data: { file(.wav), Prompt, JsonHistory, PatientId, PatientName }` | Envio de mensagem de voz |

> ⚠️ **Risco identificado:** O endpoint de voz usa `[FromBody]` e `[FromForm]` simultaneamente — incompatível em ASP.NET Core. Confirmar correção com backend antes de implementar. Ver `docs/architecture.md`.

### Gerenciamento de Estado (Frontend)
- **Histórico de mensagens:** gerenciado pelo frontend (array de mensagens)
- Cada requisição envia: `{ prompt ou file.wav, history: [...mensagens anteriores] }`
- Resposta JSON do backend é renderizada como mensagem do concierge

---

## Restrições e Constraints

| ID | Constraint |
|----|-----------|
| CON-01 | MVP entregue até 2026-03-12 (amanhã) |
| CON-02 | Apresentação em 2026-03-13 (manhã) |
| CON-03 | Backend não pode ser alterado pelo time de front |
| CON-04 | Audio enviado exclusivamente em formato .wav |
| CON-05 | Login sem autenticação robusta (MVP — apenas e-mail) |
| CON-06 | Apenas 2 funcionalidades no escopo: triagem e agendamento |

---

## Critérios de Sucesso (MVP)

- [ ] Usuário consegue fazer login inserindo apenas o e-mail
- [ ] Usuário consegue enviar mensagem de texto e receber resposta do concierge
- [ ] Usuário consegue gravar voz, enviar como .wav e receber resposta
- [ ] Histórico da conversa é mantido e enviado a cada requisição
- [ ] Interface é legível e usável por público idoso (fontes adequadas, botões grandes)
- [ ] App funciona em produção no Vercel apontando para API no Azure

---

## Fora do Escopo (MVP)

- Autenticação com senha / OAuth / MFA
- Notificações push ou e-mail
- Histórico persistido no backend
- Integração com prontuário eletrônico
- App mobile nativo
- Múltiplos idiomas

---

## Próximos Artefatos Sugeridos

| Artefato | Agente Responsável | Prioridade |
|----------|--------------------|-----------|
| PRD (Product Requirements Document) | `@pm` | Alta |
| Arquitetura Técnica Detalhada | `@architect` | Alta |
| Stories de desenvolvimento | `@sm` | Alta |
| Implementação | `@dev` | Alta |

---

*Gerado por Atlas (@analyst) — Synkra AIOX | Health Concierge MVP — Hackathon Avanade 2026*
