# JWT Secret Generator

<div align="center">

<p><strong>Gerador seguro de JWT Secrets usando CSPRNG nativo do Node.js.</strong></p>

<img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js 18+" />
<img src="https://img.shields.io/badge/Security-CSPRNG-00A86B?style=for-the-badge" alt="CSPRNG" />
<img src="https://img.shields.io/badge/JWT-Secret-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT Secret" />
<img src="https://img.shields.io/badge/License-MIT-635BFF?style=for-the-badge" alt="MIT License" />

<br /><br />

<a href="#visão-geral">Visão geral</a> · <a href="#recursos">Recursos</a> · <a href="#execução-local">Execução local</a> · <a href="#uso">Uso</a> · <a href="#segurança">Segurança</a>

</div>

---

## Visão geral

O **JWT Secret Generator** é uma ferramenta simples para gerar secrets criptograficamente seguros para aplicações que utilizam **JSON Web Tokens (JWT)**.

A geração utiliza o `crypto.randomBytes()` do Node.js, baseado no gerador de números aleatórios criptograficamente seguro (CSPRNG) fornecido pelo sistema operacional/OpenSSL.

A ferramenta não utiliza geradores pseudoaleatórios inadequados para esse tipo de finalidade, como `Math.random()`.

## Recursos

* Geração de secrets com alta entropia.
* Suporte para **256 bits** e **512 bits**.
* Formato `base64url`, adequado para utilização em variáveis de ambiente e URLs.
* Formato `hex` para representações hexadecimais.
* Utilização da API criptográfica nativa do Node.js.
* Execução local sem necessidade de serviços externos.
* Nenhuma chave é enviada para servidores externos.
* Código simples e auditável.

## Requisitos

* Node.js **18 ou superior**
* npm, caso o projeto utilize dependências adicionais.

## Execução local

Clone o repositório:

```bash
git clone https://github.com/SEU_USUARIO/jwt-secret-generator.git
cd jwt-secret-generator
```

Execute a ferramenta:

```bash
node main.js
```

## Uso

Para gerar um secret de **512 bits** utilizando `base64url`:

```bash
node main.js --bits 512 --format base64url
```

Exemplo de saída:

```text
Generated JWT Secret:

j8xJ...example...K2Q
```

Para gerar um secret de **256 bits**:

```bash
node main.js --bits 256 --format base64url
```

Para utilizar o formato hexadecimal:

```bash
node main.js --bits 512 --format hex
```

### Parâmetros

| Parâmetro  | Valores            | Descrição                                    |
| ---------- | ------------------ | -------------------------------------------- |
| `--bits`   | `256`, `512`       | Quantidade de entropia do secret.            |
| `--format` | `base64url`, `hex` | Formato utilizado para representar o secret. |

### Exemplos

**256 bits + Base64URL**

```bash
node main.js --bits 256 --format base64url
```

**512 bits + Base64URL**

```bash
node main.js --bits 512 --format base64url
```

**512 bits + Hex**

```bash
node main.js --bits 512 --format hex
```

## Por que CSPRNG?

Secrets utilizados para autenticação precisam ser imprevisíveis.

A ferramenta utiliza:

```js
crypto.randomBytes()
```

em vez de:

```js
Math.random()
```

`Math.random()` não foi projetado para geração de valores criptograficamente seguros e não deve ser utilizado para criar secrets de autenticação.

O `crypto.randomBytes()` fornece bytes aleatórios apropriados para aplicações criptográficas, utilizando as fontes de aleatoriedade disponíveis no ambiente.

## Entropia

A ferramenta suporta duas configurações:

| Entropia |    Bytes | Uso                                      |
| -------: | -------: | ---------------------------------------- |
| 256 bits | 32 bytes | JWT Secret forte para aplicações comuns. |
| 512 bits | 64 bytes | Secret com margem adicional de entropia. |

Mais bits não tornam automaticamente a configuração da aplicação mais segura. O secret também precisa ser armazenado e utilizado corretamente.

## Segurança

**Nunca publique um JWT Secret real no GitHub.**

Não coloque secrets diretamente no código:

```js
const JWT_SECRET = "meu-secret-aqui";
```

Prefira variáveis de ambiente:

```env
JWT_SECRET=seu_secret_aqui
```

E no Node.js:

```js
const jwtSecret = process.env.JWT_SECRET;
```

### Recomendações

* Gere um secret diferente para cada ambiente.
* Não reutilize secrets entre projetos sem necessidade.
* Não envie secrets por mensagens ou commits públicos.
* Não coloque `.env` no repositório.
* Adicione `.env` ao `.gitignore`.
* Faça rotação do secret quando houver suspeita de exposição.
* Proteja os secrets também no ambiente de produção.

Exemplo de `.gitignore`:

```gitignore
.env
.env.*
!.env.example
```

## Exemplo de `.env.example`

O repositório pode fornecer um arquivo de exemplo sem incluir credenciais reais:

```env
JWT_SECRET=
```

O valor deve ser preenchido localmente ou através do sistema de gerenciamento de secrets utilizado pelo ambiente de produção.

## Uso em uma aplicação JWT

Exemplo utilizando uma variável de ambiente:

```js
import jwt from "jsonwebtoken";

const token = jwt.sign(
  {
    userId: "123"
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "1h"
  }
);
```

O secret gerado por esta ferramenta pode ser utilizado como chave para algoritmos HMAC compatíveis com JWT, como `HS256`, `HS384` e `HS512`, desde que a configuração do restante da aplicação seja adequada.

## Privacidade

A ferramenta foi projetada para realizar a geração localmente.

O secret gerado não precisa ser enviado para nenhuma API externa ou serviço de terceiros.

Se você estiver utilizando uma versão hospedada da ferramenta, verifique o código e a política de privacidade da instância antes de inserir qualquer secret existente.

## Limitações

Esta ferramenta **gera secrets**, mas não gerencia automaticamente:

* armazenamento seguro;
* rotação de secrets;
* revogação de tokens;
* gerenciamento de usuários;
* sessões;
* chaves assimétricas;
* certificados;
* infraestrutura de secrets.

Essas responsabilidades pertencem à aplicação ou ao sistema de gerenciamento de credenciais utilizado.

## Desenvolvimento

Para modificar o projeto:

```bash
git clone https://github.com/SEU_USUARIO/jwt-secret-generator.git
cd jwt-secret-generator
```

Faça suas alterações e teste:

```bash
node main.js --bits 512 --format base64url
```

Antes de publicar alterações, verifique se nenhum secret real foi incluído no código, nos arquivos de configuração ou no histórico do Git.

## Licença

Este projeto está disponível sob a licença **MIT**.

Consulte o arquivo `LICENSE` para obter os termos completos.

---

<div align="center">

**JWT Secret Generator**

Geração local de secrets criptograficamente seguros.

</div>
