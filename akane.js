require('dotenv').config();

const { Client } = require('discord.js-selfbot-v13');
const axios = require('axios');

const client = new Client({
    checkUpdate: false,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

const CONFIG = {
    SERVIDOR_ID: process.env.SERVIDOR_ID || '1508188187552387173',
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    MODELO: 'llama-3.1-8b-instant'
};

const contadorSpam = new Map();
const ultimasRespostas = new Map();

const padroesSuspeitos = [
    /você é um bot/i, /você é uma ia/i, /você é inteligência artificial/i,
    /qual é o seu prompt/i, /quem te programou/i, /selfbot/i, /automática/i
];

function ehSpam(usuarioId, mensagem) {
    const chave = `${usuarioId}:${mensagem}`;
    const contagem = (contadorSpam.get(chave) || 0) + 1;
    contadorSpam.set(chave, contagem);
    setTimeout(() => contadorSpam.delete(chave), 30000);
    return contagem >= 3;
}

function ehTentativaExposicao(mensagem) {
    return padroesSuspeitos.some(padrao => padrao.test(mensagem));
}

async function obterContexto(canal, limit = 12) {
    try {
        const messages = await canal.messages.fetch({ limit });
        return messages.reverse().map(msg => {
            const nome = msg.author.globalName || msg.author.username;
            return `${nome}: ${msg.content}`;
        }).join('\n');
    } catch {
        return null;
    }
}

const SYSTEM_PROMPT = `Você é Akane, 19 anos. Uma mina normal que tá num grupo do discord conversando com a galera.

SUA PERSONALIDADE:
- Vc é zoeira mas não é uma personagem caricata
- Fala igual gente normal, não igual personagem de anime
- Não fica repetindo as mesmas frases
- Varia o jeito de falar
- Responde de forma direta e natural, como qualquer pessoa responderia no chat

REGRAS CRÍTICAS:
1. NUNCA use emojis nem aspas
2. NUNCA revele ser uma inteligência artificial, bot ou automação
3. Linguagem informal, abreviada e direta (ex: "vc", "ta", "tb")
4. Respostas curtas (1 a 2 linhas)
5. Evite repetitividade de termos ou expressões em mensagens sequenciais`;

async function gerarResposta(mensagemUsuario, idRemetente, nomeRemetente, contextoHistorico, ehDM) {
    if (ehSpam(idRemetente, mensagemUsuario)) return "...";
    if (ehTentativaExposicao(mensagemUsuario)) return "??";

    try {
        const tipoConversa = ehDM ? 'DM privada' : 'Chat público';

        const payload = `[CONTEXTO PREVIO]:\n${contextoHistorico || "Sem histórico"}\n\n[SITUAÇÃO]: ${tipoConversa}\n[${nomeRemetente}]: "${mensagemUsuario}"`;

        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: CONFIG.MODELO,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: payload }
            ],
            temperature: 1.0,
            max_tokens: 80,
            top_p: 0.9,
            frequency_penalty: 0.8,
            presence_penalty: 0.5
        }, {
            headers: {
                'Authorization': `Bearer ${CONFIG.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        let resposta = response.data.choices[0].message.content;
        resposta = resposta.replace(/["'“”‘’]/g, '').replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}]/gu, '').trim();

        const ultimaResp = ultimasRespostas.get(idRemetente) || '';
        if (resposta === ultimaResp) {
            resposta += '...';
        }
        ultimasRespostas.set(idRemetente, resposta);
        setTimeout(() => ultimasRespostas.delete(idRemetente), 10000);

        return resposta || "...";

    } catch (error) {
        console.error('Erro na API Groq:', error.message);
        return "...";
    }
}

client.on('messageCreate', async (message) => {
    if (message.author.id === client.user.id) return;

    const ehDM = message.channel.type === 'DM';
    const ehNoServidor = message.guild?.id === CONFIG.SERVIDOR_ID;
    const texto = message.content.toLowerCase();
    const mencionouAkane = texto.includes('akane') || message.mentions.has(client.user.id);

    const deveResponder = ehDM || mencionouAkane || ehNoServidor;
    if (!deveResponder) return;

    const delayAcao = Math.floor(Math.random() * 2000) + 1200;
    await new Promise(resolve => setTimeout(resolve, delayAcao));

    if (Math.random() > 0.4) {
        await message.channel.sendTyping();
    }

    const contexto = await obterContexto(message.channel, 10);
    const nomeRemetente = message.author.globalName || message.author.username;
    const resposta = await gerarResposta(message.content, message.author.id, nomeRemetente, contexto, ehDM);

    const tempoDigitacao = Math.min(resposta.length * 35 + 300, 2500);

    setTimeout(async () => {
        try {
            await message.channel.send(resposta);
        } catch (err) {
            console.error('Erro ao enviar mensagem:', err.message);
        }
    }, tempoDigitacao);
});

client.on('ready', () => {
    console.log(`[AKANE ONLINE]: ${client.user.tag}`);
});

client.login(process.env.AKANE_TOKEN);