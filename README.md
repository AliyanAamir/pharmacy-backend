<p align="center">
  <img src="logo.webp" width="200px" align="center" alt="Zod logo" />
  <h1 align="center">✨ TypeScript Backend Toolkit ✨</h1>
  <p align="center">
    <br/>
    Robust backend boilerplate designed for scalability, flexibility, and ease of development. It's packed with modern technologies and best practices to kickstart your next backend project.
  </p>
</p>
<br/>

## Prerequisites

Before you get started, make sure you have the following installed on your machine:

- **Docker + Docker Compose**
- **PNPM**
- **Node.js 20+ (LTS)**

## How to Run

1. **Set up Docker Services**:

   - Run the following command to start MongoDB and Redis instances locally:
     ```sh
     docker compose up -d
     ```
2. **Install Dependencies**:

   - Use pnpm to install all the necessary dependencies:
     ```sh
     pnpm i
     ```
3. **Configure Environment Variables**:

   - Create a `.env` file in the root directory.
   - Use the provided `.env.sample` as a template to enter all the required environment variables.

## What's Included

- **OpenAPI Autogenerated Swagger Docs** : Automatically generated Swagger docs through MagicRouter API and Zod, accessible at `/api-docs`.
- **Auth Module**: Includes Google Sign-In support for easy authentication.
- **User Management**: Comprehensive user management functionality.
- **File Upload**: Handles file uploads with Multer and Amazon S3.
- **Data Validation & Serialization**: Zod is used for validation and serialization of data.
- **Configuration Management**: Managed using dotenv-cli and validated with Zod for accuracy and safety.
- **Middlewares**:
  - **Authorization**: Built-in authorization middleware.
  - **Zod Schema Validation**: Ensures your API inputs are correctly validated.
  - **JWT Extraction**: Easily extract and verify JWT tokens.
- **Type-safe Email Handling**: Emails are managed using React Email and Mailgun for dynamic and flexible email handling.
- **Queues**: Powered by BullMQ with Redis for handling background jobs.
- **ESLint Setup**: Pre-configured ESLint setup for consistent code quality.
  ```sh
  pnpm run lint
  ```
- **Development Server**: Run the server in development mode using ts-node-dev:
  ```sh
  pnpm run dev
  ```
- **Build Process**: Efficiently bundle your project using tsup:
  ```sh
  pnpm run build
  ```
- **PM2 Support**: Out-of-the-box support for PM2 to manage your production processes.

## Roadmap

- **Socket.io Support:** Adding support for Redis adapter and a chat module.
- **Notification Infrastructure**: Notifications via FCM and Novu.
- **Ansible Playbook** : Create an Ansible playbook for server configuration to set up a basic environment quickly and consistently.
- **AWS CDK Support** : Integrate AWS CDK for infrastructure management, making it easier to deploy and manage cloud resources.
- **Monorepo Support** : Implement monorepo architecture using Turborepo and Pnpm for better project organization and scalability.
- **AWS Lambda Support** : Add support for deploying serverless functions on AWS Lambda.
- **Cloudflare Workers Support** : Enable Cloudflare Workers support for edge computing and faster request handling.
- **Postgres Support with Drizzle** : Add support for PostgreSQL using Drizzle ORM for better relational database management.
- **Containerization with Docker** : Implement containerization to ensure the project can be easily deployed to any environment using Docker.
- **Kubernetes Support** : Integrate Kubernetes for container orchestration, enabling scalable and automated deployment of the application.
- **CI/CD with GitHub Actions** : Implement a CI/CD pipeline using GitHub Actions to automate testing, building, and deployment processes.
- **Testing with Jest**: Add support for unit and integration testing using Jest to ensure code reliability and maintainability.

## Contributions

Feel free to contribute to this project by submitting issues or pull requests. Let's build something amazing together!

## **License**

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
