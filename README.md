<div align="center">

  <img src="https://i.ibb.co/tMJh4Qqy/akane-final-transparent-1.png" width="300px" alt="Akane Pixel Art" />

  # 🤖 AKANE — Selfbot Conversacional com IA

  *“Conversas naturais, respostas curtas e simulação de comportamento humano via IA.”*

  [![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![Discord.js Selfbot](https://img.shields.io/badge/Discord.js--Selfbot-v13-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://github.com/aemmit/discord.js-selfbot-v13)
  [![Groq Cloud](https://img.shields.io/badge/Groq_API-Llama_3.1-orange?style=for-the-badge)](https://groq.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

### 📌 Sobre o Projeto

**Akane** é um *selfbot* para Discord construído em Node.js e alimentado pela API da Groq (Llama 3.1). O projeto foi desenhado com foco em **processamento de linguagem natural e comportamento humano**, garantindo conversas curtas, dinâmicas e sem os padrões engessados comuns em assistentes virtuais.

---

### ⚡ Destaques & Recursos

* 🧠 **Respostas Humanizadas:** Sem emojis forçados, aspas ou linguagem de inteligência artificial.
* ⏱️ **Delays Dinâmicos:** Simula tempo de leitura e digitação proporcional ao tamanho da mensagem gerada.
* 🛡️ **Anti-Exposição & Anti-Spam:** Ignora mensagens repetitivas e detecta tentativas de *prompt injection* ou perguntas sobre a sua natureza automatizada.
* 📜 **Injeção de Contexto LTM:** Mantém os últimos registros de conversa do canal para manter a coerência nas respostas.
* 🔒 **Segurança das Chaves:** Suporte completo a variáveis de ambiente com `.env`.

---

### 🛠️ Tecnologias Utilizadas

* **Runtime:** Node.js
* **Framework Discord:** `discord.js-selfbot-v13`
* **Requisições HTTP:** `axios`
* **Modelo de IA:** Groq API (`llama-3.1-8b-instant`)

---

### 🚀 Como Rodar o Projeto

#### 1. Pré-requisitos
* Node.js v18 ou superior instalado.
* Conta na [Groq Cloud](https://groq.com) para obter uma chave de API gratuita.

#### 2. Instalação
Clone o repositório e instale as dependências:

```bash
git clone [https://github.com/seu-usuario/akane-selfbot.git](https://github.com/seu-usuario/akane-selfbot.git)
cd akane-selfbot
npm install
