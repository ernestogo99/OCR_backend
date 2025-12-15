## OCR BACKEND

![Nestjs](https://img.shields.io/badge/-NestJs-ea2845?style=flat-square&logo=nestjs&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%2378C3E6.svg?style=for-the-badge&logo=docker&logoColor=white)
![Typescript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-%2383B93E?style=for-the-badge&logo=swagger&logoColor=white)
![MinIO](https://img.shields.io/badge/MinIO-C72E49?style=for-the-badge&logo=MinIO&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%234D6A9C.svg?style=for-the-badge&logo=postgresql&logoColor=white)

## Table of Contents

- [Description](#description)
- [Prerequisites](#prerequisites)
- [Folder Structure](#folder-structure)
- [Technologies Used](#technologies-used)
- [Project setup](#project-setup)
- [API Documentation](#-api-documentation)
- [Available Services](#-available-services)

## Description

OCR backend application: you can create an account, log in, upload a image and ask for gemini
informations about the text in the image.

## Prerequisites

Ensure you have the following installed on your system:

- **Docker Desktop**
- **Nodejs**
- **Git** (For cloning the repository)

## Folder Structure

```
paggo/
├── dist/                          ← Compiled code (JS) for production
│   ├── auth/
│   ├── documents/
│   ├── users/
│   ├── app.module.js
│   ├── app.controller.js
│   ├── app.service.js
│   └── main.js                    ← Entry point (build)
│
├── prisma/                        ← Prisma ORM
│   ├── schema.prisma
│   └── migrations/
│
├── src/                           ← Source code
│
│   ├── auth/                      ← Auth module
│   │   ├── dto/                   ← Auth DTO
│   │   │   ├── create-auth.dto.ts
│   │   │   └── auth-response.dto.ts
│   │   │
│   │   ├── entities/
│   │   │
│   │   ├── auth.controller.ts     ← Endpoints of login / auth
│   │   ├── auth.service.ts        ← Auth rules
│   │   ├── auth.module.ts         ← Auth module
│   │   ├── jwt.strategy.ts
│   │   ├── jwtauthguard.ts
│   │   └── currentUser.ts         ← Decorator @CurrentUser
│   │
│   ├── users/                     ← Users module
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-user.dto.ts
│   │   │   └── user-response.dto.ts
│   │   │
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   ├── documents/                 ← Docs module
│   │   ├── dto/
│   │   │   └── document-response.dto.ts
│   │   │
│   │   ├── documents.controller.ts ← Upload / read / download
│   │   ├── documents.service.ts    ← Docs logic
│   │   └── documents.module.ts
│   │
│   ├── min-io/                    ←  MinIO integration (Storage)
│   │   ├── minio.service.ts
│   │   └── minio.module.ts
│   │
│   ├── ocr/                       ← OCR (Tesseract)
│   │   ├── ocr.service.ts
│   │   └── ocr.module.ts
│   │
│   ├── llm/                       ← Integration with gemini API
│   │   ├── llm.service.ts
│   │   └── llm.module.ts
│   │
│   ├── generated/                 ← Generated prisma client
│   │
│   ├── prisma/                    ← PrismaService (nest injection)
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   │
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── app.module.ts
│   └── main.ts
│
├── node_modules/
├── docker-compose.yml
├── Dockerfile
├── .env
├── package.json
└── tsconfig.json

```

## Technologies Used

- Typescript: Programming language for back-end
- Nestjs: Back-end framework
- Postgres: Relational database for data storage
- MinIO: An object storage service compatible with Amazon S3, used to store and manage files such as documents and images.
- Docker: A containerization platform that packages the application and its dependencies into isolated containers, ensuring consistency across development and deployment environments.
- Swagger: For api documentation

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run Using docker

```bash
# build
$ docker compose build

#run
$ docker compose up

```

## 📚 API Documentation

### Interactive Documentation

- **Swagger UI**: http://localhost:3000/api

## 🔐 Authentication & Authorization

### Authentication

The API uses JWT-based authentication

## 🌐 Available Services

| Service               | URL                       | Description   | Credentials                |
| --------------------- | ------------------------- | ------------- | -------------------------- |
| **API Documentation** | http://localhost:3000/api | Swagger UI    | N/A                        |
| **Object Storage**    | http://localhost:9000     | MinIO Console | minioadmin / minioadmin123 |
