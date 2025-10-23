# Microsserviços Escaláveis

## 📖 Sobre o Projeto

Este é um projeto demonstrativo que implementa uma arquitetura de microsserviços escalável, desenvolvido para ilustrar conceitos de comunicação assíncrona entre serviços, observabilidade distribuída e separação de responsabilidades. O sistema simula um e-commerce onde pedidos são criados em um microsserviço e processados por outro microsserviço de faturas através de mensageria.

### 🛠️ Tecnologias Utilizadas

**Backend (Node.js/TypeScript):**
- **Fastify** - Framework web rápido e eficiente
- **Drizzle ORM** - ORM type-safe para PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **RabbitMQ** - Broker de mensagens para comunicação assíncrona
- **OpenTelemetry** - Instrumentação para observabilidade
- **Zod** - Validação de schemas TypeScript
- **AMQP** - Protocolo de mensageria

**Infraestrutura:**
- **Docker & Docker Compose** - Containerização e orquestração
- **Jaeger** - Sistema de tracing distribuído
- **TypeScript** - Tipagem estática
- **ESM Modules** - Módulos ES6 nativos

## 🏗️ Arquitetura

Este projeto implementa uma arquitetura de microsserviços escalável com os seguintes componentes:

- **app-orders**: Microsserviço de pedidos (porta 3000)
- **app-invoices**: Microsserviço de faturas (porta 3001)
- **RabbitMQ**: Broker de mensagens para comunicação assíncrona
- **Jaeger**: Sistema de tracing distribuído
- **PostgreSQL**: Bancos de dados para cada microsserviço

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐
│   app-orders    │    │  app-invoices   │
│   (porta 3000)  │    │   (porta 3001)  │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
          └──────────┬───────────┘
                     │
              ┌──────▼──────┐
              │  RabbitMQ   │
              │  (porta     │
              │  5672/15672)│
              └─────────────┘
                     │
              ┌──────▼──────┐
              │   Jaeger    │
              │  (porta     │
              │   16686)    │
              └─────────────┘
```

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Docker** e **Docker Compose**
- **Git**

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd microsservicos-escalaveis
```

### 2. Instalar dependências dos microsserviços

Execute os seguintes comandos para instalar as dependências de cada microsserviço:

```bash
# Instalar dependências do app-orders
cd app-orders
npm install
cd ..

# Instalar dependências do app-invoices
cd app-invoices
npm install
cd ..
```

### 3. Configurar variáveis de ambiente

Crie arquivos `.env` em cada microsserviço com as configurações necessárias:

**app-orders/.env:**
```env
DATABASE_URL="postgresql://docker:docker@localhost:5432/orders"
RABBITMQ_URL="amqp://localhost:5672"
```

**app-invoices/.env:**
```env
DATABASE_URL="postgresql://docker:docker@localhost:5433/invoices"
RABBITMQ_URL="amqp://localhost:5672"
```

### 4. Executar migrações do banco de dados

```bash
# Migrações do app-orders
cd app-orders
npm run drizzle:migrate
cd ..

# Migrações do app-invoices
cd app-invoices
npm run drizzle:migrate
cd ..
```

## 🐳 Iniciando os Serviços

### 1. Iniciar infraestrutura (Broker e Tracing)

```bash
# Na raiz do projeto
docker-compose up -d
```

Isso irá iniciar:
- **RabbitMQ** nas portas 5672 (AMQP) e 15672 (Management UI)
- **Jaeger** na porta 16686 (UI)

### 2. Iniciar bancos de dados

```bash
# Banco do app-orders (porta 5432)
cd app-orders
docker-compose up -d
cd ..

# Banco do app-invoices (porta 5433)
cd app-invoices
docker-compose up -d
cd ..
```

### 3. Iniciar os microsserviços

Abra terminais separados para cada microsserviço:

**Terminal 1 - app-orders:**
```bash
cd app-orders
npm run dev
```

**Terminal 2 - app-invoices:**
```bash
cd app-invoices
npm run dev
```

## 🌐 Acessando os Serviços

Após iniciar todos os serviços, você pode acessar:

### Microsserviços
- **app-orders**: http://localhost:3000
  - Health check: http://localhost:3000/health
  - Criar pedido: POST http://localhost:3000/orders

- **app-invoices**: http://localhost:3001
  - Health check: http://localhost:3001/health

### Infraestrutura
- **RabbitMQ Management**: http://localhost:15672
  - Usuário: `guest`
  - Senha: `guest`

- **Jaeger UI**: http://localhost:16686
  - Para visualizar traces distribuídos

## 📊 Monitoramento e Observabilidade

### Tracing com Jaeger

O projeto está configurado com OpenTelemetry para tracing distribuído. Todos os requests são automaticamente traceados e podem ser visualizados no Jaeger UI.

### Logs

Cada microsserviço produz logs estruturados que incluem:
- Informações de tracing
- Requests HTTP
- Eventos de mensageria

## 🔧 Comandos Úteis

### Desenvolvimento

```bash
# Executar em modo de desenvolvimento (watch mode)
npm run dev

# Executar migrações
npm run drizzle:migrate

# Gerar migrations
npm run drizzle:generate
```

### Docker

```bash
# Parar todos os serviços
docker-compose down

# Remover volumes (CUIDADO: apaga dados)
docker-compose down -v

# Ver logs dos containers
docker-compose logs -f [service-name]
```

### Limpeza

```bash
# Parar todos os containers
docker stop $(docker ps -aq)

# Remover todos os containers
docker rm $(docker ps -aq)

# Remover volumes não utilizados
docker volume prune
```

## 🧪 Testando a Aplicação

### 1. Criar um pedido

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.50,
    "clientId": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

### 2. Verificar health dos serviços

```bash
# app-orders
curl http://localhost:3000/health

# app-invoices
curl http://localhost:3001/health
```

### 3. Visualizar traces no Jaeger

1. Acesse http://localhost:16686
2. Selecione o serviço desejado
3. Clique em "Find Traces"

## 📁 Estrutura do Projeto

```
microsservicos-escalaveis/
├── app-orders/                 # Microsserviço de pedidos
│   ├── src/
│   ├── docker-compose.yml     # PostgreSQL para orders
│   ├── package.json
│   └── ...
├── app-invoices/              # Microsserviço de faturas
│   ├── src/
│   ├── docker-compose.yml     # PostgreSQL para invoices
│   ├── package.json
│   └── ...
├── contracts/                 # Contratos de mensagens
├── docker-compose.yml         # RabbitMQ e Jaeger
└── README.md
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Porta já em uso**: Verifique se não há outros serviços rodando nas portas necessárias
2. **Banco não conecta**: Certifique-se de que os containers PostgreSQL estão rodando
3. **RabbitMQ não conecta**: Verifique se o RabbitMQ está acessível na porta 5672
4. **Traces não aparecem**: Confirme se o Jaeger está rodando e se o OpenTelemetry está configurado

### Logs de Debug

```bash
# Ver logs detalhados dos microsserviços
npm run dev -- --verbose

# Logs do Docker
docker-compose logs -f [service-name]
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ para demonstrar arquitetura de microsserviços escaláveis**
