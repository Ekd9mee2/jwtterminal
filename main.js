/**
 * Gera uma JWT Secret de alta entropia usando CSPRNG nativo do Node.js.
 *
 * Observações de segurança (breve):
 * - Usa `crypto.randomBytes`, que provê CSPRNG seguro (OpenSSL/OS).
 * - Suporta 256 bits (32 bytes) e 512 bits (64 bytes) de entropia, conforme exigido.
 * - Saídas disponíveis: `base64url` (URL-safe) ou `hex`.
 *
 * Uso (ex.):
 *   node main.js --bits 512 --format base64url
 *
 * Risco evitado: NÃO usar geradores não-criptográficos como Math.random().
 */

const crypto = require('crypto');
const fs = require('fs');
const readline = require('readline');

// Color constants for convenience
const clr = {
    BLACK: '\x1b[30m',
    RED: '\x1b[31m',
    GREEN: '\x1b[32m',
    YELLOW: '\x1b[33m',
    BLUE: '\x1b[34m',
    MAGENTA: '\x1b[35m',
    CYAN: '\x1b[36m',
    WHITE: '\x1b[37m',
    RESET: '\x1b[0m',
    BOLD: '\x1b[1m',
    DIM: '\x1b[2m',
    BG_BLACK: '\x1b[40m',
    BG_MAGENTA: '\x1b[45m',
    BG_CYAN: '\x1b[46m'
};

const MSG = {
    ERROR_PREFIX: `${clr.RED}> Erro:${clr.RESET}`,
    ERROR_INVALID_BITS: `${clr.RED}> Entropia inválida. Use 256 ou 512 bits.${clr.RESET}`,
    ERROR_SAVE_FILE: `${clr.RED}> Falha ao salvar arquivo:${clr.RESET}`,
    SUCCESS_GENERATED: `${clr.GREEN}> JWT secret gerada com sucesso!${clr.RESET}`,
    SUCCESS_SAVED: `${clr.GREEN}>  Segredo salvo em:${clr.RESET}`,
    PROMPT_TITLE: `${clr.BG_BLACK}${clr.BG_BLACK}[ マ Gerador JWT ]${clr.RESET} ${clr.WHITE}JWT Secret Generator${clr.RESET}`,
    PROMPT_SUBTITLE: `${clr.CYAN}> Modo interativo ativado — responda às perguntas abaixo.${clr.RESET}`,
    HELPTITLE: `${clr.MAGENTA}${clr.BOLD}> Ajuda - Gerador JWT${clr.RESET}`,
    HELP_USAGE: `${clr.CYAN}Uso:${clr.RESET} > node main.js --bits <256|512> --format <base64url|hex>`,
    HELP_NOTES: `${clr.YELLOW}Dica:${clr.RESET} > use --interactive para o modo com perguntas.`,
    JWT_LABEL: `${clr.MAGENTA}> JWT Secret:${clr.RESET}`,

    // ADICIONADO: erros gerais
    ERROR_UNKNOWN_ARGUMENT: `${clr.RED}> Argumento desconhecido:${clr.RESET}`,
    ERROR_MISSING_VALUE: `${clr.RED}> Valor ausente para o argumento:${clr.RESET}`,
    ERROR_INVALID_FORMAT: `${clr.RED}> Formato inválido. Use base64url ou hex.${clr.RESET}`,
    ERROR_INVALID_BITS_TYPE: `${clr.RED}> A entropia deve ser um número inteiro: 256 ou 512.${clr.RESET}`,
    ERROR_EMPTY_VALUE: `${clr.RED}> O valor informado não pode estar vazio.${clr.RESET}`,
    ERROR_INVALID_ARGUMENT: `${clr.RED}> Argumento inválido.${clr.RESET}`,
    ERROR_FILE_NOT_FOUND: `${clr.RED}> Arquivo ou diretório não encontrado:${clr.RESET}`,
    ERROR_PERMISSION_DENIED: `${clr.RED}> Permissão negada ao acessar o arquivo.${clr.RESET}`,
    ERROR_INVALID_PATH: `${clr.RED}> Caminho de arquivo inválido.${clr.RESET}`,
    ERROR_DIRECTORY: `${clr.RED}> O caminho informado aponta para um diretório.${clr.RESET}`,
    ERROR_RANDOM_GENERATION: `${clr.RED}> Falha ao gerar bytes criptograficamente seguros.${clr.RESET}`,
    ERROR_UNEXPECTED: `${clr.RED}> Ocorreu um erro inesperado:${clr.RESET}`,
    ERROR_INTERRUPTED: `${clr.RED}> Operação interrompida pelo usuário.${clr.RESET}`,
    ERROR_INVALID_INPUT: `${clr.RED}> Entrada inválida.${clr.RESET}`,
    ERROR_NAME_INVALID: `${clr.RED}> Nome/label inválido.${clr.RESET}`,
    ERROR_FORMAT_TYPE: `${clr.RED}> O formato deve ser um texto válido.${clr.RESET}`,
    ERROR_BITS_TYPE: `${clr.RED}> O valor de bits deve ser numérico.${clr.RESET}`,

    // ADICIONADO: informações
    INFO_USING_DEFAULT: `${clr.YELLOW}> Valor inválido. Utilizando o valor padrão.${clr.RESET}`,
    INFO_INTERRUPTED: `${clr.YELLOW}> Operação cancelada.${clr.RESET}`,

    // ADICIONADO: crédito
    FOOTER: `${clr.DIM}${clr.WHITE}Feito com amor pelo Suesa. :)${clr.RESET}`
};


// ADICIONADO: helper centralizado para erros
function showError(message, details = '') {
    console.error(`\n${MSG.ERROR_PREFIX} ${message}`);

    if (details) {
        console.error(`${clr.DIM}${details}${clr.RESET}`);
    }
}


// ADICIONADO: helper para validar bits
function validateBits(bits) {
    if (bits === undefined || bits === null || bits === '') {
        throw new Error('A quantidade de bits não foi informada.');
    }

    if (typeof bits !== 'number' || !Number.isFinite(bits)) {
        throw new Error('A quantidade de bits deve ser um número.');
    }

    if (!Number.isInteger(bits)) {
        throw new Error('A quantidade de bits deve ser um número inteiro.');
    }

    if (![256, 512].includes(bits)) {
        throw new Error('Entropia inválida. Os valores permitidos são 256 ou 512 bits.');
    }

    return true;
}


// ADICIONADO: helper para validar formato
function validateFormat(format) {
    if (format === undefined || format === null || format === '') {
        throw new Error('O formato não foi informado.');
    }

    if (typeof format !== 'string') {
        throw new Error('O formato deve ser um texto.');
    }

    const normalized = format.toLowerCase();

    if (!['base64url', 'hex'].includes(normalized)) {
        throw new Error(`Formato "${format}" inválido. Use "base64url" ou "hex".`);
    }

    return true;
}


// ADICIONADO: helper para validar argumentos desconhecidos
function validateArgument(argument) {
    const allowed = [
        '--bits',
        '-b',
        '--format',
        '-f',
        '--interactive',
        '-i',
        '--help',
        '-h'
    ];

    if (!allowed.includes(argument)) {
        throw new Error(`Argumento "${argument}" não é reconhecido.`);
    }
}


// ADICIONADO: helper para detectar valor ausente
function validateArgumentValue(argv, index, argument) {
    if (!argv[index + 1]) {
        throw new Error(`O argumento "${argument}" precisa receber um valor.`);
    }

    if (argv[index + 1].startsWith('-')) {
        throw new Error(`O argumento "${argument}" recebeu um valor inválido ou ausente.`);
    }
}


// ADICIONADO: helper para tratamento de arquivos
function handleFileError(err) {
    if (!err) return;

    switch (err.code) {
        case 'ENOENT':
            throw new Error(`${MSG.ERROR_FILE_NOT_FOUND} ${err.path || ''}`);
        case 'EACCES':
        case 'EPERM':
            throw new Error(MSG.ERROR_PERMISSION_DENIED);
        case 'EISDIR':
            throw new Error(MSG.ERROR_DIRECTORY);
        case 'ENOTDIR':
            throw new Error(MSG.ERROR_INVALID_PATH);
        case 'ENOSPC':
            throw new Error('Não há espaço disponível para salvar o arquivo.');
        case 'EROFS':
            throw new Error('O sistema de arquivos está somente para leitura.');
        default:
            throw new Error(err.message || 'Erro desconhecido ao acessar o arquivo.');
    }
}


// ADICIONADO: tratamento de Ctrl+C
process.on('SIGINT', () => {
    console.log(`\n\n${MSG.INFO_INTERRUPTED}`);
    console.log(MSG.FOOTER);
    process.exit(130);
});


function generateSecureJwtSecret({ bits = 512, format = 'base64url' } = {}) {

    // ADICIONADO: validação extra
    validateBits(bits);
    validateFormat(format);

    // Validar bits
    if (![256, 512].includes(bits)) {
        throw new Error(MSG.ERROR_INVALID_BITS);
    }

    const lengthBytes = bits / 8; // 256 -> 32 bytes, 512 -> 64 bytes

    // crypto.randomBytes é uma CSPRNG fornecida pelo Node.js (OpenSSL/OS),
    // adequada para gerar segredos criptográficos.
    let buffer;

    // ADICIONADO: tratamento de erro do CSPRNG
    try {
        buffer = crypto.randomBytes(lengthBytes);
    } catch (err) {
        throw new Error(
            `${MSG.ERROR_RANDOM_GENERATION} ${err.message || ''}`
        );
    }

    if (format === 'hex') return buffer.toString('hex');
    // 'base64url' é uma codificação Base64 sem caracteres '+' '/' e sem padding,
    // ideal para uso em URLs e headers HTTP sem precisar escapar.
    return buffer.toString('base64url');
}


// --- CLI mínimo ---
function parseArgs(argv) {
    const args = { bits: 512, format: 'base64url' };

    for (let i = 2; i < argv.length; i++) {
        const a = argv[i];

        // ADICIONADO: validação de argumento
        try {
            validateArgument(a);
        } catch (err) {
            if (
                a !== '--bits' &&
                a !== '-b' &&
                a !== '--format' &&
                a !== '-f' &&
                a !== '--interactive' &&
                a !== '-i' &&
                a !== '--help' &&
                a !== '-h'
            ) {
                throw err;
            }
        }

        if ((a === '--bits' || a === '-b') && argv[i + 1]) {

            // ADICIONADO: validação contra letras misturadas com números
            if (!/^\d+$/.test(argv[i + 1])) {
                throw new Error(
                    `Valor inválido para ${a}: "${argv[i + 1]}". Informe apenas números.`
                );
            }

            args.bits = Number(argv[++i]);
            continue;
        }

        if ((a === '--bits' || a === '-b') && !argv[i + 1]) {
            throw new Error(`O argumento "${a}" precisa receber um valor.`);
        }

        if (a === '--interactive' || a === '-i') {
            args.interactive = true;
            continue;
        }

        if ((a === '--format' || a === '-f') && argv[i + 1]) {
            args.format = argv[++i];
            continue;
        }

        if ((a === '--format' || a === '-f') && !argv[i + 1]) {
            throw new Error(`O argumento "${a}" precisa receber um valor.`);
        }

        if (a === '--help' || a === '-h') {
            args.help = true;
            break;
        }
    }

    return args;
}


function printHelp() {
    console.log(MSG.HELPTITLE);
    console.log(MSG.HELP_USAGE);
    console.log(MSG.HELP_NOTES);

    // ADICIONADO
    console.log(`
${clr.CYAN}Opções:${clr.RESET}
  --bits, -b       Entropia da secret: 256 ou 512
  --format, -f     Formato: base64url ou hex
  --interactive, -i
                   Inicia o modo interativo
  --help, -h       Exibe esta ajuda
`);
}


async function interactivePrompt() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = (q) => new Promise((res) => rl.question(q, (a) => res(a.trim())));

    console.log(MSG.PROMPT_TITLE);
    console.log(`${clr.DIM}${clr.WHITE}──────────────────────────────────────────────────────────${clr.RESET}`);
    console.log(`${MSG.PROMPT_SUBTITLE}\n`);

    const styledQ = (label, hint, icon = '›') => `${clr.CYAN}${icon} ${clr.BOLD}${label}${clr.RESET}${hint ? ` ${clr.DIM}${clr.WHITE}${hint}${clr.RESET}` : ''} `;

    const name = await ask(styledQ('Nome/label da secret (opcional):', '(ENTER para nenhum)', '>'));

    let bitsRaw = await ask(styledQ('Entropia em bits (256/512):', '[padrão: 512]', '>'));
    bitsRaw = bitsRaw || '512';

    // ADICIONADO: não aceitar letras misturadas nos bits
    if (!/^\d+$/.test(bitsRaw)) {
        throw new Error(
            `A entropia deve conter apenas números. Valor recebido: "${bitsRaw}".`
        );
    }

    const bits = Number(bitsRaw) === 256 ? 256 : 512;

    let format = await ask(styledQ('Formato da saída (base64url/hex):', '[padrão: base64url]', '>'));
    format = (format || 'base64url').toLowerCase();

    if (!['base64url', 'hex'].includes(format)) {
        console.log(`${MSG.ERROR_PREFIX} Formato inválido. Usando base64url por padrão.`);
        format = 'base64url';
    }

    let saveAns = await ask(styledQ('Salvar secret em arquivo>', '[s/n, padrão n]', '>'));
    saveAns = (saveAns || 'n').toLowerCase();
    const save = saveAns.startsWith('s') || saveAns.startsWith('y');

    let filename = '';

    if (save) {
        const defaultName = `jwt-secret-${(name || 'secret').replace(/[^a-z0-9\-]/gi, '-').toLowerCase()}-${Date.now()}.txt`;
        filename = await ask(styledQ('Caminho do arquivo:', `[default: ${defaultName}]`));

        if (!filename) filename = defaultName;
    }

    rl.close();

    // Gerar secret
    const secret = generateSecureJwtSecret({ bits, format });

    // Exibir resultado com estilo
    console.log(`\n${MSG.SUCCESS_GENERATED}`);

    if (name) console.log(`${clr.CYAN}Label:${clr.RESET}`, name);

    console.log(`${clr.CYAN}Bits:${clr.RESET}`, bits);
    console.log(`${clr.CYAN}Formato:${clr.RESET}`, format);
    console.log(`\n${MSG.JWT_LABEL} ${secret}`);

    if (save) {
        try {
            fs.writeFileSync(filename, secret + '\n', { mode: 0o600, flag: 'w' });

            try {
                fs.chmodSync(filename, 0o600);
            } catch (e) {
                // windows may ignore
            }

            console.log(`\n${MSG.SUCCESS_SAVED} ${filename}`);

        } catch (err) {
            // ADICIONADO: tratamento detalhado de erro
            try {
                handleFileError(err);
            } catch (fileError) {
                showError(fileError.message);
            }
        }
    }

    console.log(`\n${clr.CYAN}> Dica:${clr.RESET} armazene este segredo em um Secret Manager (AWS/Azure/GCP) e nunca o commit no repositório.`);
    console.log(`\n${MSG.FOOTER}`);
}


if (require.main === module) {

    let opts;

    // ADICIONADO: proteção do parser
    try {
        opts = parseArgs(process.argv);
    } catch (err) {
        showError(err.message);
        printHelp();
        console.log(`\n${MSG.FOOTER}`);
        process.exit(1);
    }

    if (opts.help) {
        printHelp();
        console.log(`\n${MSG.FOOTER}`);
        process.exit(0);
    }

    // Se nenhum argumento fornecido e terminal interativo, entra em modo interativo
    const hasArgs = process.argv.length > 2;

    if (!hasArgs && process.stdin.isTTY) {

        interactivePrompt().catch((err) => {
            showError(err.message);
            console.log(`\n${MSG.FOOTER}`);
            process.exit(1);
        });

    } else {

        try {

            // ADICIONADO: validação final antes da geração
            validateBits(opts.bits);
            validateFormat(opts.format);

            const secret = generateSecureJwtSecret({
                bits: opts.bits,
                format: opts.format
            });

            console.log(secret);

            // ADICIONADO: crédito no modo CLI
            console.error(`\n${MSG.FOOTER}`);

        } catch (err) {

            showError(err.message);

            printHelp();

            console.log(`\n${MSG.FOOTER}`);

            process.exit(1);
        }
    }
}