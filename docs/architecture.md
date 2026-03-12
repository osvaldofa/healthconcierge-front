# Arquitetura Técnica — Health Concierge

**Version:** 1.0.0
**Status:** Draft
**Criado por:** Aria (@architect)
**Data:** 2026-03-11
**Evento:** Hackathon Avanade 2026

---

## Visão Geral do Sistema

```
┌─────────────────────────────────────────┐
│              USUÁRIO                    │
│   (Paciente idoso — browser/mobile web) │
└────────────────┬────────────────────────┘
                 │ HTTPS
┌────────────────▼────────────────────────┐
│           FRONTEND                      │
│   Next.js + TypeScript                  │
│   Hospedado: Vercel                     │
│                                         │
│  ┌─────────────┐  ┌──────────────────┐  │
│  │  /login     │  │  /chat (área     │  │
│  │  (página 1) │  │   logada, p. 2)  │  │
│  └─────────────┘  └──────────────────┘  │
│                                         │
│  State: histórico de mensagens          │
│  (gerenciado no cliente)                │
└────────────────┬────────────────────────┘
                 │ HTTP/HTTPS REST
┌────────────────▼────────────────────────┐
│           BACKEND (C# ASP.NET Core)     │
│   Base URL: configurável via .env       │
│   Hospedagem atual: local               │
│   Hospedagem alvo: Azure Container      │
│                                         │
│  POST /api/atendimento/interagir        │
│  POST /api/atendimento/upload-interacao │
└─────────────────────────────────────────┘
```

---

## Contrato da API (Confirmado via Controller)

### Modelo compartilhado — `InteractRequest`

```typescript
// Equivalente TypeScript do InteractRequest C#
interface InteractRequest {
  Prompt: string;         // obrigatório — texto da mensagem
  JsonHistory?: string;   // opcional — histórico serializado como JSON string
  PatientId?: string;     // opcional — id do paciente (vindo do login)
  PatientName?: string;   // opcional — nome do paciente (vindo do login)
}
```

> **Nota importante sobre `JsonHistory`:** O backend espera o histórico como uma **string JSON** (`string?`), não como array aninhado. O frontend deve serializar o array de mensagens com `JSON.stringify(history)` antes de enviar.

---

### Endpoint 1 — Chat de Texto

```
POST /api/atendimento/interagir
Content-Type: application/json
```

**Request body:**
```json
{
  "Prompt": "Estou com dor de cabeça forte há 2 dias",
  "JsonHistory": "[{\"role\":\"user\",\"content\":\"...\"},{\"role\":\"assistant\",\"content\":\"...\"}]",
  "PatientId": "paciente-123",
  "PatientName": "Maria Silva"
}
```

**Response `200 OK`:**
```json
{
  "resposta": "Entendo, Maria. Uma dor de cabeça forte por 2 dias pode ter diversas causas..."
}
```

**Acesso no frontend:** `response.resposta`

---

### Endpoint 2 — Interação por Voz

```
POST /api/atendimento/upload-interacao
Content-Type: multipart/form-data
```

**⚠️ RISCO ARQUITETURAL — VER SEÇÃO ABAIXO**

**Request (multipart/form-data):**
```
file:        <arquivo .wav>
Prompt:      (campo de form — pode ser vazio se só enviar áudio)
JsonHistory: "[...]"  (JSON string serializado)
PatientId:   "paciente-123"
PatientName: "Maria Silva"
```

**Response `200 OK`:** texto transcrito/processado (formato não confirmado — pode ser string pura)

---

## ⚠️ Risco Crítico — Endpoint de Voz

### Problema identificado

O endpoint `upload-interacao` no backend tem a seguinte assinatura:

```csharp
public async Task<IActionResult> UploadWav(
    [FromForm] IFormFile file,
    [FromBody] InteractRequest request)   // ← PROBLEMA AQUI
```

**Em ASP.NET Core, `[FromForm]` e `[FromBody]` não podem coexistir na mesma action.** Quando a requisição é `multipart/form-data`, o framework já consumiu o body como form data — não há como também fazer bind de um `[FromBody]` JSON no mesmo request. Isso causará um erro `415 Unsupported Media Type` ou falha silenciosa no bind do `request`.

### Correção esperada no backend

O backend precisará alterar `[FromBody]` para `[FromForm]` no parâmetro `request`:

```csharp
// CORRETO — ambos vêm do form
public async Task<IActionResult> UploadWav(
    [FromForm] IFormFile file,
    [FromForm] InteractRequest request)
```

### Impacto para o frontend

- **Com a correção acima:** enviar tudo como `multipart/form-data` com os campos do `InteractRequest` como campos de form individuais (não como JSON no body)
- **Sem a correção:** o endpoint de voz não funcionará independente do frontend

> **Ação necessária:** Confirmar com o time de backend antes de implementar o frontend de voz. Solicitar que testem o endpoint com `curl` ou Postman usando `multipart/form-data`.

---

## Estrutura de Projeto Frontend (Sugerida)

```
concierge/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx              # Redireciona para /login
│   │   ├── login/
│   │   │   └── page.tsx          # Tela 1 — Login por e-mail
│   │   └── chat/
│   │       └── page.tsx          # Tela 2 — Chat Concierge
│   ├── components/
│   │   ├── ChatInterface/        # Componente principal do chat
│   │   ├── MessageBubble/        # Bolha de mensagem (usuário / concierge)
│   │   ├── VoiceButton/          # Botão de gravação de voz
│   │   └── TextInput/            # Campo de texto + botão enviar
│   ├── hooks/
│   │   ├── useChatHistory.ts     # Gerencia histórico de mensagens
│   │   └── useVoiceRecorder.ts   # Gravação de áudio → .wav
│   ├── services/
│   │   └── api.ts                # Chamadas HTTP para o backend
│   ├── types/
│   │   └── index.ts              # Tipos TypeScript (Message, InteractRequest, etc.)
│   └── lib/
│       └── session.ts            # Dados do paciente (PatientId, PatientName)
├── .env.local                    # URL base da API (local)
├── .env.production               # URL base da API (Azure)
└── next.config.ts
```

---

## Configuração de Ambiente

A URL base da API **não deve ser hardcoded**. O Next.js suporta variáveis de ambiente nativamente:

### `.env.local` (desenvolvimento)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### `.env.production` (Vercel / Azure)
```env
NEXT_PUBLIC_API_BASE_URL=https://health-concierge-api.azurecontainer.io
```

> O prefixo `NEXT_PUBLIC_` torna a variável acessível no browser. Como a API é chamada diretamente do frontend (client-side), esse prefixo é obrigatório.

### Uso no código
```typescript
// src/services/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
```

> **No Vercel:** configurar a variável `NEXT_PUBLIC_API_BASE_URL` no painel de Environment Variables do projeto antes do deploy.

---

## Gerenciamento de Estado — Histórico de Mensagens

O backend **não persiste** o histórico. O frontend é responsável por manter e enviar o contexto a cada requisição.

### Modelo de mensagem (frontend)
```typescript
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  type: 'text' | 'voice';
}
```

### Fluxo de envio
```typescript
// A cada mensagem enviada:
const payload: InteractRequest = {
  Prompt: newMessage,
  JsonHistory: JSON.stringify(
    chatHistory.map(m => ({ role: m.role, content: m.content }))
  ),
  PatientId: session.patientId,
  PatientName: session.patientName,
};
```

---

## Fluxo de Gravação de Voz → .wav

```
Usuário clica em "falar"
       ↓
MediaRecorder API (browser)
  - mimeType: 'audio/wav' (ou conversão via AudioContext)
       ↓
Blob de áudio capturado
       ↓
File object: new File([blob], 'audio.wav', { type: 'audio/wav' })
       ↓
FormData com campos:
  - file: <File>
  - Prompt: "" (vazio — o áudio é o prompt)
  - JsonHistory: JSON.stringify(history)
  - PatientId: session.patientId
  - PatientName: session.patientName
       ↓
POST /api/atendimento/upload-interacao
```

> **Atenção:** `MediaRecorder` em alguns browsers (Chrome) grava em `audio/webm`, não `audio/wav`. Pode ser necessária conversão via `AudioContext` + `AudioBuffer` → PCM → WAV. Bibliotecas como `audiobuffer-to-wav` ou implementação manual do header WAV resolvem isso.

---

## Fluxo de Login

1. Usuário digita e-mail na `Tela 1`
2. Frontend **não chama o backend** de autenticação (inexistente no MVP)
3. O e-mail é usado como `PatientId` (ou mapeado para um ID fixo em mock)
4. Dados do paciente são salvos em `sessionStorage` ou `Context API`
5. Redirect para `/chat`

> **Decisão MVP:** Sem validação real de e-mail contra base de dados. O `PatientId` pode ser o próprio e-mail ou um valor derivado. O backend recebe e usa conforme sua lógica interna.

---

## Decisões Tecnológicas

| Aspecto | Decisão | Justificativa |
|---------|---------|---------------|
| Framework | **Next.js 14+ (App Router)** | SSR opcional, roteamento simples, deploy Vercel nativo |
| Linguagem | **TypeScript** | Segurança de tipos, essencial para contrato de API |
| Estilo | **Tailwind CSS** | Velocidade de desenvolvimento em hackathon |
| Estado global | **React Context + useState** | Sem complexidade extra; Redux desnecessário para MVP |
| HTTP Client | **fetch nativo** (ou axios) | Sem dependência extra; fetch cobre o caso de uso |
| Gravação de voz | **MediaRecorder API** | Nativa no browser, sem dependência |
| Conversão WAV | **audiobuffer-to-wav** (npm) | Garante compatibilidade com expectativa do backend |
| Deploy | **Vercel** | Zero-config para Next.js |

---

## Riscos e Mitigações

| ID | Risco | Probabilidade | Impacto | Mitigação |
|----|-------|--------------|---------|-----------|
| R-01 | `[FromBody]` + `[FromForm]` no backend causa erro 400/415 | Alta | Blocker para voz | Confirmar com backend hoje; solicitar correção |
| R-02 | MediaRecorder não gera `.wav` nativamente no Chrome | Média | Voz não funciona | Usar lib de conversão `audiobuffer-to-wav` |
| R-03 | CORS bloqueando requisições do Vercel para Azure | Média | Blocker total | Backend deve liberar CORS para domínio Vercel |
| R-04 | URL do Azure não disponível a tempo do deploy | Média | Deploy bloqueado | Manter `.env.local` funcional para demo |
| R-05 | Formato de retorno do endpoint de voz incerto | Baixa | Parsing incorreto | Confirmar com backend se retorna string ou JSON |

---

## Próximos Passos

| Prioridade | Ação | Responsável |
|-----------|------|------------|
| 🔴 Blocker | Confirmar/corrigir `[FromBody]` → `[FromForm]` no endpoint de voz | Backend team |
| 🔴 Blocker | Confirmar CORS está liberado no backend para `*.vercel.app` | Backend team |
| 🔴 Hoje | Scaffolding do Next.js + estrutura de pastas | `@dev` |
| 🔴 Hoje | Implementar Tela 1 (Login) | `@dev` |
| 🔴 Hoje | Implementar Tela 2 (Chat + texto) | `@dev` |
| 🟡 Hoje | Implementar gravação de voz + conversão WAV | `@dev` |
| 🟡 Amanhã | Configurar variável de ambiente no Vercel com URL do Azure | `@devops` |
| 🟢 Amanhã | Deploy no Vercel + smoke test end-to-end | `@devops` |

---

*Gerado por Aria (@architect) — Synkra AIOX | Health Concierge MVP — Hackathon Avanade 2026*
