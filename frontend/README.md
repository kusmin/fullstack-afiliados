# Frontend do Projeto Fullstack Afiliados


Este é o frontend do Projeto Fullstack Afiliados, desenvolvido com React. Ele fornece uma interface do usuário para interagir com a API e gerenciar as transações.

## Pré-requisitos

Para executar este projeto localmente, você precisará:

- Node.js e npm instalados em sua máquina
- Docker e Docker Compose instalados em sua máquina (caso queira usar o Docker)

## Como executar o projeto

### Usando o Docker

Este projeto inclui um arquivo `Dockerfile` e `docker-compose.yml` para facilitar a execução com o Docker. Para executar o projeto usando o Docker, siga estas etapas:

1. Navegue até a pasta `frontend`:

```bash
cd frontend
```

2. Execute o Docker Compose:

```bash
docker-compose up
```


Isso iniciará o serviço do frontend no Docker. O aplicativo será executado na porta 3000 por padrão. Abra seu navegador e acesse http://localhost:3000 para visualizar o aplicativo.

#### Executando localmente sem Docker
Se você preferir executar o projeto diretamente em sua máquina sem usar o Docker, siga estas etapas:

1. Navegue até a pasta frontend:

```bash
cd frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O aplicativo será executado na porta 5173 por padrão. Abra seu navegador e acesse http://localhost:5173 para visualizar o aplicativo.

## Estrutura do projeto

A pasta src contém os componentes e arquivos relacionados ao aplicativo React. Aqui está uma descrição geral da estrutura:

* src/components: Contém os componentes React reutilizáveis
* src/pages: Contém os componentes de página para cada rota no aplicativo
* src/services: Contém os serviços usados para interagir com a API