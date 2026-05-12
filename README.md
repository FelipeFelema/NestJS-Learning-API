# User Management App

Aplicação fullstack para gerenciamento de usuários com autenticação e painel administrativo.

---

## Arquitetura

Este projeto é dividido em duas partes:

- mobile-app → Aplicação mobile feita com React Native (Expo)
- users-api-nest → API construída com NestJS, Prisma e PostgreSQL

---

## Tecnologias

### Back-end
- Node.js
- NestJS
- Prisma ORM
- PostgreSQL
- JWT (Acess Token + Refresh Token)

### Front-end
- React Native (Expo)
- TypeScript

---

## Funcionalidades

- Registro e login de usuários
- Autenticação com JWT
- Refresh Token
- CRUD de usuários (admin)
- Paginação
- Busca de usuários
- Atualização de dados
- Exclusão de usuários

---
 
##  Interface do Projeto

| Tela de Login | Tela de Registro |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/c71733a1-8a6a-4db6-985a-b0abe7cc12d1" width="400"> | <img src="https://github.com/user-attachments/assets/99542e07-586f-4644-b74b-69ba84c82193" width="400"> |

| Tela de Perfil | Tela Editando Perfil |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/eab432cc-b081-4b74-b482-fbff3520a3b6" width="400"> | <img src="https://github.com/user-attachments/assets/4354f3bc-d523-4ebe-b907-36d697a96e53" width="400"> |

| Tela de Gestão de Usuários |
| :---: |
| <img src="https://github.com/user-attachments/assets/34b86273-914d-499b-b0eb-e0c998c126df" width="400"> |

---

## Como rodar o projeto

### Pré-requisitos

- Node.js
- npm
- Docker e Docker Compose
- Expo Go instalado no celular, se for testar no dispositivo físico

### Back-end

```bash
cd users-api-nest
npm install
npm run db:up
npm run prisma:migrate
npm run prisma:generate
npm run start
```

O banco PostgreSQL roda via Docker Compose na porta `5433` do host. A URL padrão fica assim:

```env
DATABASE_URL="postgresql://nestjs_auth:nestjs_auth@localhost:5433/nestjs_auth?schema=public"
```

Crie um arquivo `.env` em `users-api-nest` usando `users-api-nest/.env.example` como referência.

Comandos úteis:

```bash
npm run db:up        # sobe o PostgreSQL
npm run db:down      # para e remove o container
npm run db:logs      # acompanha os logs do banco
npm run prisma:migrate
npm run prisma:generate
npx prisma studio
```

### Criando um usuário admin

O projeto não tem endpoint público para criar administradores, para manter a API simples. O fluxo recomendado para desenvolvimento é:

1. Rode o back-end e o app.
2. Crie uma conta normalmente pela tela de registro.
3. No terminal, dentro de `users-api-nest`, abra o Prisma Studio:

```bash
npx prisma studio
```

4. Acesse a tabela `User`.
5. Edite o campo `role` do usuário criado de `USER` para `ADMIN`.
6. Salve a alteração e faça login novamente no app.

### Front-end

```bash
cd mobile-app
npm install
npx expo start
```

Crie um arquivo `.env.local` em `mobile-app` usando `mobile-app/.env.example` como referência:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3000/api/v1
```

No celular físico, use o IP da sua máquina na rede local. No emulador Android, pode ser necessário usar `http://10.0.2.2:3000/api/v1`.

---

## Aprendizados

- Estrutura de projetos com NestJS
- Autenticação com JWT e refresh token
- Configuração de variáveis de ambiente para back-end e app Expo
- Uso de Docker Compose para subir um PostgreSQL local replicável
- Execução de migrations e geração do Prisma Client
- Uso do Prisma Studio para visualizar e editar dados em ambiente de desenvolvimento
- Paginação no back-end e front-end
- Consumo de API com React Native
- Gerenciamento de estado com hooks
- Tratamento de erros em aplicações fullstack

---

## Decisões técnicas

- Uso de refresh token para melhorar a segurança da autenticação
- Uso de Docker Compose para evitar dependência de um PostgreSQL instalado manualmente
- Exposição do PostgreSQL na porta `5433` para evitar conflito com bancos locais na porta padrão `5432`
- Criação de administradores via Prisma Studio em desenvolvimento, mantendo a API sem endpoint público para essa ação
- Uso de arquivos `.env.example` para documentar as variáveis necessárias sem versionar dados locais
- Paginação no backend para melhor performance
- Separação entre front-ent e back-end
