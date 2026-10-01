# JWT Secret Generator

<div align="center">

<p><strong>Gerador de JWT Secrets criptograficamente seguros para aplicações Node.js.</strong></p>

<p>
  Gere secrets de <strong>256 ou 512 bits</strong> utilizando o CSPRNG nativo do Node.js,
  com suporte a <strong>Base64URL</strong>, <strong>Hex</strong>, modo interativo e salvamento local.
</p>

<br />

<img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js 18+" />
<img src="https://img.shields.io/badge/CSPRNG-Cryptographically%20Secure-00A86B?style=for-the-badge" alt="CSPRNG" />
<img src="https://img.shields.io/badge/JWT-Secret-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT Secret" />
<img src="https://img.shields.io/badge/256%20%7C%20512-Bits-635BFF?style=for-the-badge" alt="256 or 512 bits" />

<br /><br />

<a href="#visão-geral">Visão geral</a> · <a href="#recursos">Recursos</a> · <a href="#instalação">Instalação</a> · <a href="#uso">Uso</a> · <a href="#modo-interativo">Modo interativo</a> · <a href="#segurança">Segurança</a>

</div>

---

## Visão geral

O **JWT Secret Generator** é uma ferramenta de linha de comando desenvolvida para gerar secrets de alta entropia destinados a aplicações que utilizam **JSON Web Tokens (JWT)**.

A geração utiliza a API criptográfica nativa do Node.js:

```js
crypto.randomBytes()
```

O método utiliza um **CSPRNG (Cryptographically Secure Pseudo-Random Number Generator)**, apropriado para geração de dados aleatórios destinados a aplicações criptográficas.

A ferramenta foi projetada para funcionar **localmente**, sem necessidade de enviar o secret gerado para uma API ou serviço externo.

---

## Recursos

* Geração criptograficamente segura usando `crypto.randomBytes()`.
* Suporte a **256 bits (32 bytes)**.
* Suporte a **512 bits (64 bytes)**.
* Formato **Base64URL**.
* Formato **Hexadecimal**.
* Modo de execução por argumentos.
* Modo interativo para geração guiada.
* Comando `--help`.
* Aliases curtos para os principais argumentos.
* Identificação opcional da secret através de uma label.
* Salvamento opcional em arquivo.
* Tentativa de aplicar permissões `0600` ao arquivo salvo.
* Não utiliza `Math.random()`.
* Não depende de serviços externos para gerar secrets.

---

## Requisitos

* **Node.js 18 ou superior**
* Terminal compatível com Node.js
* npm é opcional e só é necessário caso o projeto utilize dependências adicionais.

Verifique sua versão:

```bash
node --version
```

Exemplo:

```text
v20.x.x
```

---

## Instalação

Clone o repositório:

```bash
git clone https://github.com/SEU_USUARIO/jwt-secret-generator.git
```

Entre no diretório:

```bash
cd jwt-secret-generator
```

Não é necessário instalar dependências para executar a versão atual, caso o projeto contenha apenas o código nativo apresentado.

---

## Uso rápido

Execute:

```bash
node main.js
```

Quando nenhum argumento é fornecido em um terminal interativo, a ferramenta inicia automaticamente o **modo interativo**.

Para gerar diretamente uma secret:

```bash
node main.js --bits 512 --format base64url
```

Saída:

```text
your-generated-secret
```

No modo não interativo, a saída contém apenas a secret, facilitando seu uso em scripts e automações.

---

## Argumentos

| Argumento       | Alias | Valores            | Padrão      | Descrição                        |
| --------------- | ----- | ------------------ | ----------- | -------------------------------- |
| `--bits`        | `-b`  | `256`, `512`       | `512`       | Define a quantidade de entropia. |
| `--format`      | `-f`  | `base64url`, `hex` | `base64url` | Define o formato da secret.      |
| `--interactive` | `-i`  | —                  | —           | Ativa o modo interativo.         |
| `--help`        | `-h`  | —                  | —           | Exibe a ajuda da ferramenta.     |

### Ver ajuda

```bash
node main.js --help
```

Também é possível utilizar:

```bash
node main.js -h
```

---

## Geração por linha de comando

### 256 bits — Base64URL

```bash
node main.js --bits 256 --format base64url
```

### 512 bits — Base64URL

```bash
node main.js --bits 512 --format base64url
```

### 256 bits — Hex

```bash
node main.js --bits 256 --format hex
```

### 512 bits — Hex

```bash
node main.js --bits 512 --format hex
```

Também é possível utilizar os aliases:

```bash
node main.js -b 512 -f base64url
```

---

## Formatos disponíveis

### Base64URL

O formato `base64url` utiliza uma representação compatível com o padrão Base64URL.

Exemplo:

```text
mV7k...example...xQ
```

É particularmente conveniente para utilização em:

* variáveis de ambiente;
* configurações de aplicações;
* headers HTTP;
* sistemas que trabalham com URLs.

O Node.js utiliza a codificação:

```js
buffer.toString('base64url')
```

---

### Hexadecimal

O formato `hex` representa cada byte como dois caracteres hexadecimais.

Exemplo:

```text
a93f...example...71c2
```

É uma representação simples e amplamente utilizada para secrets e chaves.

O Node.js utiliza:

```js
buffer.toString('hex')
```

---

## Modo interativo

O modo interativo pode ser iniciado explicitamente com:

```bash
node main.js --interactive
```

Ou:

```bash
node main.js -i
```

Quando iniciado, o programa solicita:

1. Nome/label da secret.
2. Quantidade de entropia.
3. Formato da saída.
4. Se a secret deve ser salva em arquivo.
5. Caminho do arquivo, caso o salvamento seja escolhido.

Exemplo:

```text
[ Gerador JWT ] JWT Secret Generator
──────────────────────────────────────────────────────────
> Modo interativo ativado — responda às perguntas abaixo.

> Nome/label da secret (opcional):
> Entropia em bits (256/512): [padrão: 512]
> Formato da saída (base64url/hex): [padrão: base64url]
> Salvar secret em arquivo [s/n, padrão n]:
```

---

## Salvamento em arquivo

O modo interativo permite salvar a secret em um arquivo local.

Exemplo:

```text
> Caminho do arquivo: [default: jwt-secret-api-1720000000000.txt]
```

Quando possível, a ferramenta tenta aplicar permissões:

```text
0600
```

Isso significa que o arquivo deve ser acessível somente pelo proprietário em sistemas que suportam esse modelo de permissões.

> **Importante:** permissões de arquivo podem funcionar de maneira diferente dependendo do sistema operacional. No Windows, por exemplo, o comportamento de `chmod` não é equivalente ao de sistemas Unix/Linux.

---

## Como a secret é gerada

O tamanho da secret é calculado a partir da quantidade de bits:

```js
const lengthBytes = bits / 8;
```

Portanto:

| Entropia | Bytes gerados |
| -------: | ------------: |
| 256 bits |      32 bytes |
| 512 bits |      64 bytes |

A geração é realizada através de:

```js
const buffer = crypto.randomBytes(lengthBytes);
```

A ferramenta então converte os bytes para o formato solicitado:

```js
buffer.toString('base64url')
```

ou:

```js
buffer.toString('hex')
```

---

## Por que `crypto.randomBytes()`?

Secrets utilizados para autenticação precisam ser imprevisíveis.

Por isso, a ferramenta **não utiliza**:

```js
Math.random()
```

`Math.random()` é destinado a geração pseudoaleatória comum e não deve ser utilizado para gerar credenciais, tokens ou secrets criptográficos.

O projeto utiliza:

```js
crypto.randomBytes()
```

A API criptográfica do Node.js utiliza mecanismos apropriados do ambiente para fornecer bytes aleatórios destinados a aplicações criptográficas.

---

## Entropia

### 256 bits

```text
256 bits = 32 bytes
```

Fornece um espaço de valores extremamente grande para uma secret aleatória.

### 512 bits

```text
512 bits = 64 bytes
```

Oferece o dobro da quantidade de bits em relação à configuração de 256 bits.

A ferramenta utiliza **512 bits como padrão**.

> Aumentar a quantidade de bits não substitui boas práticas de armazenamento, controle de acesso e gerenciamento de secrets.

---

## Segurança

### Nunca faça commit de uma secret real

Não faça:

```js
const JWT_SECRET = "uma-secret-real";
```

Prefira:

```env
JWT_SECRET=sua_secret_aqui
```

E carregue através do ambiente:

```js
const jwtSecret = process.env.JWT_SECRET;
```

### Recomendações

* Gere secrets diferentes para ambientes diferentes.
* Não reutilize secrets desnecessariamente.
* Não publique secrets no GitHub.
* Não envie secrets por mensagens.
* Não coloque `.env` no repositório.
* Utilize um Secret Manager em ambientes de produção quando apropriado.
* Faça rotação de secrets caso exista suspeita de exposição.
* Restrinja o acesso aos arquivos que armazenam secrets.
* Não coloque secrets em logs.
* Não compartilhe secrets gerados para demonstrações como se fossem credenciais reais.

---

## `.gitignore`

Recomenda-se adicionar arquivos de ambiente ao `.gitignore`:

```gitignore
.env
.env.*
!.env.example
```

---

## Exemplo de `.env.example`

O repositório pode conter um arquivo `.env.example` sem nenhuma credencial real:

```env
JWT_SECRET=
```

O valor deve ser preenchido somente no ambiente local ou no sistema de gerenciamento de secrets utilizado pela aplicação.

---

## Utilização com JWT

Uma secret gerada pode ser utilizada em uma aplicação JWT com algoritmos HMAC, desde que a configuração da aplicação seja adequada.

Exemplo:

```js
import jwt from "jsonwebtoken";

const token = jwt.sign(
  {
    userId: "123"
  },
  process.env.JWT_SECRET,
  {
    algorithm: "HS256",
    expiresIn: "1h"
  }
);
```

O secret pode ser utilizado com algoritmos como:

* `HS256`
* `HS384`
* `HS512`

A escolha do algoritmo deve ser consistente entre a emissão e a validação dos tokens.

---

## Privacidade

A geração das secrets ocorre localmente.

O funcionamento básico da ferramenta não exige:

* API externa;
* banco de dados;
* conta de usuário;
* conexão com um servidor;
* envio da secret para terceiros.

Isso significa que uma secret gerada localmente pode permanecer exclusivamente no ambiente em que o programa foi executado.

> Se você utilizar uma versão hospedada por terceiros, não presuma que o funcionamento seja idêntico ao código deste repositório. Verifique a implementação antes de inserir informações sensíveis.

---

## Limitações

O JWT Secret Generator é responsável apenas pela **geração de secrets**.

Ele não fornece automaticamente:

* armazenamento seguro;
* gerenciamento de usuários;
* autenticação;
* autorização;
* revogação de JWTs;
* gerenciamento de sessões;
* rotação automática;
* Secret Manager;
* gerenciamento de certificados;
* geração de chaves assimétricas;
* proteção da aplicação que utiliza o secret.

A segurança final depende também da aplicação que utiliza a secret e de como ela é armazenada.

---

## Desenvolvimento

Clone o projeto:

```bash
git clone https://github.com/SEU_USUARIO/jwt-secret-generator.git
cd jwt-secret-generator
```

Execute:

```bash
node main.js
```

Teste a geração direta:

```bash
node main.js --bits 512 --format base64url
```

Teste o modo interativo:

```bash
node main.js --interactive
```

Teste a ajuda:

```bash
node main.js --help
```

Antes de criar um commit, verifique se nenhuma credencial real foi adicionada:

```bash
git status
```

E revise as alterações:

```bash
git diff
```

---

## Estrutura

Uma estrutura simples para o projeto:

```text
jwt-secret-generator/
├── main.js
├── README.md
├── LICENSE
├── .gitignore
└── .env.example
```

---

## Licença

Este projeto utiliza uma **licença personalizada**.

É permitido:

* estudar o código;
* utilizar a ferramenta;
* modificar o código;
* criar versões derivadas;
* distribuir modificações gratuitamente;
* realizar melhorias no projeto.

Não é permitido:

* vender o projeto;
* vender versões modificadas;
* comercializar o código como produto independente;
* remover a atribuição ao autor original;
* apresentar o projeto original como sendo de autoria de outra pessoa.

Consulte o arquivo [`LICENSE`](LICENSE) para conhecer os termos completos.

---

## Contribuição

Alterações e melhorias podem ser propostas através de Pull Requests.

Ao contribuir, certifique-se de:

1. Não adicionar secrets ou credenciais reais.
2. Não adicionar dados pessoais desnecessários.
3. Manter o funcionamento existente da CLI.
4. Documentar novos argumentos ou comportamentos.
5. Testar as alterações antes de abrir o Pull Request.

---

## Aviso

Esta ferramenta gera valores aleatórios criptograficamente seguros, mas isso **não garante que uma aplicação inteira seja segura**.

A segurança de um sistema JWT também depende de fatores como:

* armazenamento do secret;
* algoritmo utilizado;
* validação do token;
* expiração;
* proteção das credenciais;
* controle de acesso;
* configuração do servidor;
* tratamento de comprometimento de secrets.

Use a ferramenta como parte de uma estratégia de segurança adequada.

---

<div align="center">

### JWT Secret Generator

**Geração local de secrets criptograficamente seguros.**

Feito para desenvolvimento e aplicações que precisam de secrets de alta entropia.

</div>
