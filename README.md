# Desafio B2Blue - Sistema de Controle de Volume de Armazenamento

Este projeto consiste em um sistema para gerenciamento de estações de armazenamento, permitindo atualizar volumes, gerar pedidos de coleta automaticamente quando o volume atinge 80% ou mais, e confirmar coletas.

---

## Tecnologias Utilizadas

- **Backend**: Django REST Framework
- **Frontend**: React + Material UI + Vite
- **Docker**: para orquestração e execução do backend

---

## Lógica de Funcionamento

### Regras implementadas:

- Cada estação tem um volume entre 0 e 100%.
- Ao atualizar o volume de uma estação para **≥ 80%**, um **pedido de coleta é criado automaticamente**.
- Se uma estação com pedido de coleta pendente for atualizada para um volume **< 80%**, o pedido de coleta é **cancelado automaticamente**.
- A coleta só pode ser confirmada se o volume estiver em **80% ou mais**.
- Todas as ações relevantes são armazenadas em um **histórico por estação**.

---

## Como rodar o backend (Docker)

### Pré-requisitos:
- Docker e Docker Compose instalados (o Docker Desktop já instala todos os pré-requisitos)

### Instruções:

```bash
# Clone o projeto
git clone 
cd 

# Suba o backend
docker-compose up --build
```

> A API estará disponível em: `http://localhost:8000/api/`

### Endpoints:

- `GET /api/stations/` → Lista todas as estações
- `PATCH /api/stations/<id>/` → Atualiza volume da estação específica
- `POST /api/stations/<id>/confirm_pickup/` → Confirma coleta de uma estação
- `GET /api/stations/<id>/history/` → Lista o histórico de ações de uma estação

---

## Como rodar o frontend localmente

### Pré-requisitos:
- Node.js (v18+)
- NPM

### Instruções:

```bash
# Ir para a pasta do frontend
cd frontend

# Instalar dependências
npm install

# Rodar o projeto
npm run dev
```

> A interface estará disponível em: `http://localhost:5173`

---

## Funcionalidades da Interface

- Cards exibindo nome e volume de cada estação
- Input para atualizar o volume de ocupação
- Botão "Confirmar Coleta" aparece somente se volume ≥ 80%
- Modal com histórico da estação acessado via ícone de info (ao lado do nome da estação)
- Feedbacks visuais:
  - Alerta em volume crítico
  - Snackbar com mensagens de sucesso e erro

---

## Organização do Projeto

```bash
.
├── backend/
│   ├── station/
│   └── core/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── types.ts
└── docker-compose.yml
```

---