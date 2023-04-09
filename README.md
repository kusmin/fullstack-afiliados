# Projeto Fullstack Afiliados

Projeto Fullstack Afiliados é um aplicativo web completo que inclui um frontend em React e um backend em Node.js com NestJS. Este aplicativo fornece funcionalidades para gerenciar transações e processá-las de acordo com a lógica do negócio.

## Pré-requisitos

Para executar este projeto localmente, você precisará:

- Docker e Docker Compose instalados em sua máquina

## Como executar o projeto

Este projeto inclui um script chamado `run-docker.sh` que facilita a execução dos serviços de frontend e backend usando Docker e Docker Compose. Para executar o projeto, siga estas etapas:

1. Clone o repositório:

```bash
git clone https://github.com/seu_usuario/projeto_xyz.git
cd projeto_xyz
```

2. Torne o script run-docker.sh executável:
   
```bash
chmod +x run-docker.sh
```

3. Execute o script de acordo com suas necessidades:

```bash
./run-docker.sh api        # Executa apenas o serviço de API
./run-docker.sh frontend   # Executa apenas o serviço de frontend
./run-docker.sh            # Executa ambos os serviços
```

Quando o script for executado sem argumentos, ele iniciará os serviços de API e frontend simultaneamente. Se você quiser executar apenas um dos serviços, passe 'api' ou 'frontend' como argumento ao executar o script.

## Estrutura do projeto

O projeto é dividido em duas partes principais:

1. api: Esta pasta contém a API do projeto, desenvolvida com NestJS. A API é responsável pelo gerenciamento e processamento das transações.

2. frontend: Esta pasta contém o aplicativo React que fornece a interface do usuário para interagir com a API e realizar as operações necessárias.

>  This is a challenge by [Coodesh](https://coodesh.com/)