# Wireframes Lo-Fi — Health Concierge

**Version:** 1.0.0
**Status:** Draft
**Criado por:** Uma (@ux-design-expert)
**Data:** 2026-03-11
**Fidelidade:** Low-Fidelity (Lo-Fi)

---

## Contexto de Design

**Usuário primário:** Paciente idoso de rede de clínicas
**Premissas de acessibilidade:**
- Fontes grandes (mínimo 18px em elementos interativos)
- Botões com área de toque mínima de 48×48px
- Alto contraste (IA para saúde → tons de azul confiável + branco)
- Hierarquia visual clara — poucos elementos por tela
- Linguagem simples, sem jargão técnico

---

## Fluxo de Navegação

```
[Raiz /]
    ↓ (redirect automático)
[Tela 1: /login]
    ↓ (e-mail válido + submit)
[Tela 2: /chat]
    ↓ (interação textual ou por voz)
[Respostas do concierge no chat]
```

---

## Tela 1 — Login (`/login`)

### Wireframe

```
+----------------------------------------------------------+
|                                                          |
|                                                          |
|                    [🏥 ÍCONE/LOGO]                       |
|                                                          |
|              Health Concierge                            |
|           ========================                       |
|                                                          |
|           Seu assistente de saúde pessoal                |
|                                                          |
|   +------------------------------------------------+     |
|   |                                                |     |
|   |   E-mail                                       |     |
|   |   -------                                      |     |
|   |   +------------------------------------------+ |     |
|   |   |  seu@email.com                    [✉]    | |     |
|   |   +------------------------------------------+ |     |
|   |                                                |     |
|   |   +------------------------------------------+ |     |
|   |   |                                          | |     |
|   |   |           ACESSAR  →                     | |     |
|   |   |                                          | |     |
|   |   +------------------------------------------+ |     |
|   |                                                |     |
|   +------------------------------------------------+     |
|                                                          |
|       ⚠  [mensagem de erro — aparece se inválido]        |
|                                                          |
|                                                          |
+----------------------------------------------------------+
```

### Anotações

| Elemento | Especificação |
|----------|--------------|
| Logo/Ícone | Centralizado no topo, ≥ 64×64px |
| Título "Health Concierge" | `text-3xl` bold, cor azul escuro (`blue-800`) |
| Subtítulo | `text-lg`, cor cinza médio (`gray-500`) |
| Campo e-mail | `text-lg`, padding generoso (`py-3 px-4`), borda suave, foco com ring azul |
| Botão ACESSAR | Largura total, altura mínima 56px (`py-4`), `text-xl` bold, fundo `blue-700` |
| Botão desabilitado | Opacidade 50% quando campo vazio |
| Mensagem de erro | Pequena, em vermelho, abaixo do campo |
| Background | Azul bem claro (`blue-50`) — transmite credibilidade saúde |
| Card central | Branco, bordas arredondadas (`rounded-2xl`), sombra suave |

### Fluxo de Interação

```
Usuário acessa /login
        ↓
[Campo e-mail vazio]
Botão ACESSAR = desabilitado (50% opacity)
        ↓
[Usuário digita e-mail]
Botão ACESSAR = habilitado (azul sólido)
        ↓
[Usuário clica ACESSAR]
        ↓
    [Validação]
   ┌──────┴──────┐
   ↓             ↓
[Válido]    [Inválido]
   ↓             ↓
[/chat]    [Msg de erro]
           "Por favor, insira
            um e-mail válido."
```

---

## Tela 2 — Chat (`/chat`)

### Wireframe — Estado Inicial (sem mensagens)

```
+----------------------------------------------------------+
| Health Concierge                         [👤 email@...]  |
+----------------------------------------------------------+
|                                                          |
|                                                          |
|                   [🏥 ÍCONE]                             |
|                                                          |
|            Olá! Como posso ajudar?                       |
|                                                          |
|   Posso ajudar você com:                                 |
|   • 🩺  Orientação sobre sintomas                        |
|   • 📅  Agendamento de consultas                         |
|                                                          |
|                                                          |
|                                                          |
|                                                          |
+----------------------------------------------------------+
|  +----------------------------------------------+  [🎤] |
|  |  Digite sua mensagem...                       |       |
|  +----------------------------------------------+  [→]  |
+----------------------------------------------------------+
```

### Wireframe — Com Mensagens (estado conversacional)

```
+----------------------------------------------------------+
| Health Concierge                         [👤 email@...]  |
+----------------------------------------------------------+
|                                                          |
|         +--------------------------------------+         |
|         | Estou com dor de cabeça forte há 2   |  [USR] |
|         | dias e febre.                         |        |
|         +--------------------------------------+         |
|                                                          |
| [HC] +----------------------------------------------+   |
|      | Entendo, Maria. Esses sintomas podem indicar  |   |
|      | diferentes condições. Você está sentindo      |   |
|      | outros sintomas, como rigidez no pescoço      |   |
|      | ou sensibilidade à luz?                        |   |
|      +----------------------------------------------+   |
|                                                          |
|         +--------------------------------------+         |
|         | Sim, tenho sensibilidade à luz também. | [USR]|
|         +--------------------------------------+         |
|                                                          |
| [HC] +----------------------------------------------+   |
|      | ⚠️  Atenção: A combinação de dor de          |   |
|      | cabeça intensa, febre e sensibilidade à       |   |
|      | luz pode ser sinal de algo sério.             |   |
|      | **Recomendo buscar atendimento de             |   |
|      | emergência imediatamente.**                   |   |
|      +----------------------------------------------+   |
|                                                          |
| [HC] ● ● ●  (digitando...)                              |
|                                                          |
+----------------------------------------------------------+
|  +----------------------------------------------+  [🎤] |
|  |  Digite sua mensagem...                       |       |
|  +----------------------------------------------+  [→]  |
+----------------------------------------------------------+
```

### Wireframe — Estado de Voz (gravando)

```
+----------------------------------------------------------+
| Health Concierge                         [👤 email@...]  |
+----------------------------------------------------------+
|                                                          |
|   [... histórico de mensagens ...]                       |
|                                                          |
|                                                          |
+----------------------------------------------------------+
|  +----------------------------------------------+  [🔴] |
|  |  🎤 Gravando... (clique para parar)           |  ●●● |
|  +----------------------------------------------+  [→]  |
+----------------------------------------------------------+
```

### Anotações

| Elemento | Especificação |
|----------|--------------|
| Header | Fundo `blue-700`, texto branco, altura 56px |
| Título no header | `text-xl` bold |
| Avatar usuário | Iniciais do e-mail, círculo pequeno no header |
| Área de chat | Fundo `gray-50`, scroll vertical, padding lateral |
| Bubble usuário | Alinhado à direita, fundo `blue-600`, texto branco, `rounded-2xl rounded-tr-sm` |
| Bubble concierge | Alinhado à esquerda, fundo branco, borda `gray-200`, `rounded-2xl rounded-tl-sm` |
| Fonte nas bubbles | `text-base` (16px) mínimo; `text-lg` (18px) preferido |
| Padding nas bubbles | `px-4 py-3` — generoso para fácil leitura |
| Sombra nas bubbles | Suave (`shadow-sm`) para separação visual |
| Indicador "digitando" | 3 pontos animados (`● ● ●`), fundo branco, lado esquerdo |
| ⚠️ Aviso urgência | Destacado com borda vermelha ou fundo âmbar claro |
| Campo de texto | `text-lg`, `rounded-xl`, fundo branco, borda `gray-200` |
| Botão Enviar `→` | Quadrado 48×48px, `blue-700`, fica desabilitado se vazio |
| Botão Voz `🎤` | Quadrado 48×48px, `blue-700`; vermelho pulsante ao gravar `🔴` |
| Área do input | Fundo branco, borda superior `gray-200`, padding `p-3` |

### Estados do Botão de Voz

```
Estado: idle      → 🎤 Azul (`blue-700`)
Estado: gravando  → 🔴 Vermelho pulsante + animação
Estado: enviando  → ⏳ Cinza (desabilitado)
```

### Fluxo de Interação — Texto

```
Usuário digita mensagem
        ↓
Botão → habilitado
        ↓
[Enter] ou [click →]
        ↓
Mensagem aparece no chat (lado direito, bubble azul)
Campo limpo
        ↓
"Digitando..." aparece
        ↓
Resposta do concierge aparece (bubble cinza/branco)
Chat faz scroll down automático
```

### Fluxo de Interação — Voz

```
Usuário clica [🎤]
        ↓
Botão muda → [🔴] pulsante
Campo mostra "Gravando..."
        ↓
Usuário fala
        ↓
Usuário clica [🔴] para parar
        ↓
Áudio convertido para .wav
"[Mensagem de voz]" aparece no chat
        ↓
"Digitando..." aparece
        ↓
Resposta do concierge aparece
```

---

## Estados Especiais

### Estado de Erro (API indisponível)

```
| [HC] +----------------------------------------------+   |
|      | ⚠️  Desculpe, não consegui processar sua     |   |
|      | mensagem. Verifique sua conexão e tente      |   |
|      | novamente.                          [Tentar] |   |
|      +----------------------------------------------+   |
```

### Estado de Carregamento Inicial

```
|           +------------------------+                     |
|           |  Conectando...   ⏳    |                     |
|           +------------------------+                     |
```

---

## Paleta de Cores (Lo-Fi Reference)

| Uso | Classe Tailwind | Hex |
|-----|----------------|-----|
| Primária (botões, header) | `blue-700` | #1D4ED8 |
| Primária hover | `blue-800` | #1E40AF |
| Fundo geral | `blue-50` | #EFF6FF |
| Fundo chat | `gray-50` | #F9FAFB |
| Bubble usuário | `blue-600` | #2563EB |
| Bubble concierge | `white` + `gray-200` border | #FFFFFF |
| Texto principal | `gray-900` | #111827 |
| Texto secundário | `gray-500` | #6B7280 |
| Erro/Urgência | `red-600` | #DC2626 |
| Aviso | `amber-500` | #F59E0B |

---

## Componentes Atômicos Identificados

### Átomos
- `Button` (primary, secondary, disabled, danger)
- `Input` (text, email)
- `Avatar` (iniciais)
- `Badge` (urgência, status)

### Moléculas
- `MessageBubble` (user + assistant variants)
- `TextInput` (input + send button)
- `VoiceButton` (idle + recording + processing states)
- `TypingIndicator` (3 pontos animados)

### Organismos
- `ChatHeader` (logo + título + avatar)
- `ChatHistory` (lista de MessageBubbles + scroll)
- `ChatInputBar` (TextInput + VoiceButton)
- `WelcomeState` (estado inicial sem mensagens)

### Templates
- `LoginTemplate` (card centralizado)
- `ChatTemplate` (header fixo + área scrollável + input fixo no bottom)

---

## Próximos Passos

| Ação | Responsável |
|------|------------|
| Implementar componentes com base nos wireframes | `@dev` |
| Revisão de acessibilidade WCAG AA | `*a11y-check` |
| Gerar prompt para v0.dev (opcional, acelera UI) | `*generate-ui-prompt` |

---

*Gerado por Uma (@ux-design-expert) — Synkra AIOX | Health Concierge MVP — Hackathon Avanade 2026*
