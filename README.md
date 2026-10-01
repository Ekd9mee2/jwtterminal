# JWT Secret Generator

<div align="center">

<p><strong>Cryptographically secure JWT Secret generator for Node.js applications.</strong></p>

<p>
  Generate <strong>256 ou 512 bits</strong> using Node.js native CSPRNG,
  with support for <strong>Base64URL</strong>, <strong>Hex</strong>, interactive mode and local saving.
</p>

<br />

<img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js 18+" />
<img src="https://img.shields.io/badge/CSPRNG-Cryptographically%20Secure-00A86B?style=for-the-badge" alt="CSPRNG" />
<img src="https://img.shields.io/badge/JWT-Secret-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT Secret" />
<img src="https://img.shields.io/badge/256%20%7C%20512-Bits-635BFF?style=for-the-badge" alt="256 or 512 bits" />

<br /><br />

<a href="#visão-geral">Overview</a> · <a href="#recursos">Features</a> · <a href="#instalação">Installation</a> · <a href="#uso">Usage</a> · <a href="#modo-interativo">Interactive mode</a> · <a href="#segurança">Security</a>

</div>

---

## Overview

**JWT Secret Generator** is a command-line tool designed to generate high-entropy secrets for applications that use **JSON Web Tokens (JWT)**.

Generation uses Node.js native cryptographic API:

```js
crypto.randomBytes()
```

The method uses a **CSPRNG (Cryptographically Secure Pseudo-Random Number Generator)**, suitable for generating random data for cryptographic applications.

The tool is designed to run **locally**, without sending the generated secret to an external API or service.

---

## Features

* Geração criptograficamente segura usando `crypto.randomBytes()`.
* Suporte a **256 bits (32 bytes)**.
* Suporte a **512 bits (64 bytes)**.
* Formato **Base64URL**.
* Formato **Hexadecimal**.
* Modo de execução por argumentos.
* Interactive mode para geração guiada.
* Comando `--help`.
* Aliases curtos para os principais argumentos.
* Identificação opcional da secret através de uma label.
* Salvamento opcional em arquivo.
* Tentativa de aplicar permissões `0600` ao arquivo salvo.
* Não utiliza `Math.random()`.
* Não depende de serviços externos para gerar secrets.

---

## Requirements

* **Node.js 18 or later**
* Terminal compatible with Node.js
* npm is optional and only required if the project uses additional dependencies.

Check your version:

```bash
node --version
```

Example:

```text
v20.x.x
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/SEU_USUARIO/jwt-secret-generator.git
```

Enter the directory:

```bash
cd jwt-secret-generator
```

No dependencies need to be installed to run the current version if the project contains only the native code shown.

---

## Quick start

Run:

```bash
node main.js
```

When no arguments are provided in an interactive terminal, the tool automatically starts **interactive mode**.

To generate a secret directly:

```bash
node main.js --bits 512 --format base64url
```

Output:

```text
your-generated-secret
```

In non-interactive mode, the output contains only the secret, making it convenient for scripts and automation.

---

## Arguments

| Argumento       | Alias | Values            | Default      | Description                        |
| --------------- | ----- | ------------------ | ----------- | -------------------------------- |
| `--bits`        | `-b`  | `256`, `512`       | `512`       | Defines the amount of entropy. |
| `--format`      | `-f`  | `base64url`, `hex` | `base64url` | Defines the secret format.      |
| `--interactive` | `-i`  | —                  | —           | Enables interactive mode.         |
| `--help`        | `-h`  | —                  | —           | Displays the tool help.     |

### View help

```bash
node main.js --help
```

Também é possível utilizar:

```bash
node main.js -h
```

---

## Command-line generation

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

You can also use the aliases:

```bash
node main.js -b 512 -f base64url
```

---

## Available formats

### Base64URL

The `base64url` format uses a representation compatible with the Base64URL standard.

Example:

```text
mV7k...example...xQ
```

It is particularly convenient for use in:

* environment variables;
* application configuration;
* HTTP headers;
* systems that work with URLs.

O Node.js utiliza a codificação:

```js
buffer.toString('base64url')
```

---

### Hexadecimal

The `hex` format represents each byte as two hexadecimal characters.

Example:

```text
a93f...example...71c2
```

It is a simple representation widely used for secrets and keys.

O Node.js utiliza:

```js
buffer.toString('hex')
```

---

## Interactive mode

Interactive mode can be started explicitly with:

```bash
node main.js --interactive
```

Or:

```bash
node main.js -i
```

When started, the program asks for:

1. Secret name/label.
2. Amount of entropy.
3. Output format.
4. Whether the secret should be saved to a file.
5. File path, if saving is selected.

Example:

```text
[ Gerador JWT ] JWT Secret Generator
──────────────────────────────────────────────────────────
> Interactive mode ativado — responda às perguntas abaixo.

> Nome/label da secret (opcional):
> Entropy em bits (256/512): [padrão: 512]
> Formato da saída (base64url/hex): [padrão: base64url]
> Salvar secret em arquivo [s/n, padrão n]:
```

---

## Saving to a file

Interactive mode allows the secret to be saved to a local file.

Example:

```text
> File path: [default: jwt-secret-api-1720000000000.txt]
```

When possible, the tool attempts to apply permissions:

```text
0600
```

This means the file should be accessible only by the owner on systems that support this permission model.

> **Important:** file permissions may behave differently depending on the operating system. On Windows, for example, `chmod` behavior is not equivalent to Unix/Linux systems.

---

## How the secret is generated

The secret size is calculated from the number of bits:

```js
const lengthBytes = bits / 8;
```

Therefore:

| Entropy | Generated bytes |
| -------: | ------------: |
| 256 bits |      32 bytes |
| 512 bits |      64 bytes |

Generation is performed using:

```js
const buffer = crypto.randomBytes(lengthBytes);
```

The tool then converts the bytes to the requested format:

```js
buffer.toString('base64url')
```

ou:

```js
buffer.toString('hex')
```

---

## Why `crypto.randomBytes()`?

Secrets used for authentication must be unpredictable.

Therefore, the tool **does not use**:

```js
Math.random()
```

`Math.random()` is intended for general pseudo-random generation and should not be used to generate credentials, tokens, or cryptographic secrets.

O projeto utiliza:

```js
crypto.randomBytes()
```

Node.js cryptographic APIs use appropriate environment mechanisms to provide random bytes for cryptographic applications.

---

## Entropy

### 256 bits

```text
256 bits = 32 bytes
```

Provides an extremely large value space for a random secret.

### 512 bits

```text
512 bits = 64 bytes
```

Provides twice the number of bits compared with the 256-bit configuration.

The tool uses **512 bits by default**.

> Increasing the number of bits does not replace good storage, access control, and secret management practices.

---

## Security

### Never commit a real secret

Do not do this:

```js
const JWT_SECRET = "uma-secret-real";
```

Prefer:

```env
JWT_SECRET=sua_secret_aqui
```

Load it through the environment:

```js
const jwtSecret = process.env.JWT_SECRET;
```

### Recommendations

* Generate different secrets for different environments.
* Do not unnecessarily reuse secrets.
* Do not publish secrets on GitHub.
* Do not send secrets through messages.
* Do not put `.env` in the repository.
* Use a Secret Manager in production environments when appropriate.
* Rotate secrets if exposure is suspected.
* Restrict access to files that store secrets.
* Do not put secrets in logs.
* Do not share secrets generated for demonstrations as if they were real credentials.

---

## `.gitignore`

It is recommended to add environment files to `.gitignore`:

```gitignore
.env
.env.*
!.env.example
```

---

## `.env.example` example

The repository may contain an `.env.example` file without any real credentials:

```env
JWT_SECRET=
```

The value should only be populated in the local environment or in the secret management system used by the application.

---

## Using JWT

A generated secret can be used in a JWT application with HMAC algorithms, provided the application is configured appropriately.

Example:

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

The secret can be used with algorithms such as:

* `HS256`
* `HS384`
* `HS512`

The algorithm choice must be consistent between token issuance and validation.

---

## Privacy

Secret generation occurs locally.

The basic operation of the tool does not require:

* an external API;
* a database;
* a user account;
* a server connection;
* sending the secret to third parties.

This means a locally generated secret can remain exclusively in the environment where the program was executed.

> If you use a version hosted by a third party, do not assume its behavior is identical to the code in this repository. Verify the implementation before entering sensitive information.

---

## Limitations

JWT Secret Generator is responsible only for **secret generation**.

It does not automatically provide:

* secure storage;
* user management;
* authentication;
* authorization;
* JWT revocation;
* session management;
* automatic rotation;
* Secret Manager;
* certificate management;
* asymmetric key generation;
* protection for the application that uses the secret.

Overall security also depends on the application using the secret and how it is stored.

---

## Development

Clone o projeto:

```bash
git clone https://github.com/SEU_USUARIO/jwt-secret-generator.git
cd jwt-secret-generator
```

Run:

```bash
node main.js
```

Test direct generation:

```bash
node main.js --bits 512 --format base64url
```

Test interactive mode:

```bash
node main.js --interactive
```

Test the help:

```bash
node main.js --help
```

Before creating a commit, verify that no real credentials were added:

```bash
git status
```

Review the changes:

```bash
git diff
```

---

## Structure

A simple project structure:

```text
jwt-secret-generator/
├── main.js
├── README.md
├── LICENSE
├── .gitignore
└── .env.example
```

---

## License

This project uses a **custom license**.

Allowed:

* study the code;
* use the tool;
* modify the code;
* create derivative versions;
* distribute modifications free of charge;
* make improvements to the project.

Not allowed:

* sell the project;
* sell modified versions;
* commercialize the code as an independent product;
* remove attribution to the original author;
* present the original project as being authored by someone else.

See the [`LICENSE`](LICENSE) file for the complete terms.

---

## Contributing

Changes and improvements can be proposed through Pull Requests.

When contributing, make sure to:

1. Do not add real secrets or credentials.
2. Do not add unnecessary personal data.
3. Maintain the existing CLI behavior.
4. Document new arguments or behaviors.
5. Test changes before opening the Pull Request.

---

## Disclaimer

This tool generates cryptographically secure random values, but this **does not guarantee that an entire application is secure**.

The security of a JWT system also depends on factors such as:

* secret storage;
* algorithm used;
* token validation;
* expiration;
* credential protection;
* access control;
* server configuration;
* handling compromised secrets.

Use the tool as part of an appropriate security strategy.

---

<div align="center">

### JWT Secret Generator

**Local generation of cryptographically secure secrets.**

Built for development and applications that require high-entropy secrets.

</div>
