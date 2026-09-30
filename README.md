\# Elpida



\### Full-Stack E-Commerce \& Administration Platform



Elpida is a full-stack web application built as an end-to-end software engineering project using an \*\*AI-assisted development workflow\*\*.



The project covers the complete application lifecycle: requirements analysis, relational database design, backend API development, frontend implementation, authentication, persistent media storage, testing, debugging, database migrations, environment management, deployment, and production troubleshooting.



\*\*Live Application:\*\* https://elpida-website.vercel.app



\---



\## Project Overview



Elpida combines a public business website with a lightweight e-commerce ordering system and protected administration portal.



Customers can browse categories and products, select product variants and quantities, add products to their cart, and submit an order for manual review and follow-up.



The administration system provides functionality for managing products, categories, variants, orders, customer messages, images, and application settings.



The project was developed primarily as a practical exercise in understanding how the different layers of a production web application work together.



\---



\# Architecture



```text

&#x20;                       ┌─────────────────────┐

&#x20;                       │      Customer       │

&#x20;                       │       Browser       │

&#x20;                       └──────────┬──────────┘

&#x20;                                  │

&#x20;                                  │ HTTPS

&#x20;                                  ▼

&#x20;                       ┌─────────────────────┐

&#x20;                       │  React / TypeScript │

&#x20;                       │      Frontend       │

&#x20;                       │       Vercel        │

&#x20;                       └──────────┬──────────┘

&#x20;                                  │

&#x20;                                  │ REST API

&#x20;                                  ▼

&#x20;                       ┌─────────────────────┐

&#x20;                       │   Node.js / Express │

&#x20;                       │       Backend       │

&#x20;                       │       Vercel        │

&#x20;                       └───────┬─────┬───────┘

&#x20;                               │     │

&#x20;                    SQL        │     │ Media

&#x20;                               ▼     ▼

&#x20;                   ┌──────────────┐  ┌──────────────┐

&#x20;                   │ PostgreSQL   │  │  Cloudinary  │

&#x20;                   │  Supabase    │  │ Image Storage│

&#x20;                   └──────────────┘  └──────────────┘

```



The frontend does not communicate directly with the database.



Instead:



```text

Browser

&#x20;  ↓

React Frontend

&#x20;  ↓

REST API

&#x20;  ↓

Express Backend

&#x20;  ↓

PostgreSQL

```



Product image URLs are stored with the application data, while the actual image assets are hosted through Cloudinary.



\---



\# Technology Stack



\## Frontend



\- React

\- TypeScript

\- Vite

\- Tailwind CSS

\- Component-based UI architecture



\## Backend



\- Node.js

\- Express

\- REST APIs

\- JWT authentication

\- API security middleware

\- File/image upload handling



\## Database



\- PostgreSQL

\- Relational data modeling

\- Foreign-key relationships

\- Constraints

\- SQL migrations

\- Query indexes



\## Infrastructure



\- Vercel

\- Supabase PostgreSQL

\- Cloudinary



\## Development Workflow



\- Git

\- GitHub

\- Feature and release branches

\- Environment-specific configuration

\- Development, staging, and production environments

\- Database migration workflow



\---



\# Core Features



\### Customer Experience



Customers can:



\- Browse product categories

\- Browse available products

\- View product images and information

\- Select product variants

\- Choose quantities

\- Add products to a cart

\- Submit an order

\- Submit contact messages



The current system intentionally uses an \*\*order-request model rather than online checkout\*\*. Submitted orders can be reviewed before the business contacts the customer.



\### Administration



The protected administration interface provides functionality for:



\- Category management

\- Product management

\- Product variant management

\- Product image management

\- Order management

\- Customer message management

\- Application settings

\- Administrator authentication



\---



\# Data Model



The application uses a relational PostgreSQL database.



Core entities include:



```text

categories

&#x20;   │

&#x20;   └── products

&#x20;           │

&#x20;           └── product\_variants

&#x20;                      │

&#x20;                      └── order\_items

&#x20;                               │

&#x20;                               └── orders

```



Additional application data includes:



```text

messages

settings

```



The schema uses foreign-key relationships to maintain referential integrity between related entities.



For example:



```text

Category

&#x20;  │

&#x20;  └── Product

&#x20;         │

&#x20;         └── Product Variant

&#x20;                   │

&#x20;                   └── Order Item

```



This became particularly important when implementing deletion behavior because removing a parent record while dependent records still existed could violate relational constraints.



\---



\# Database Indexing



PostgreSQL does not automatically create indexes for referencing foreign-key columns.



As the application evolved, indexes were added to relationship columns used by common joins and relational operations, including:



```text

products.category\_id

product\_variants.product\_id

order\_items.order\_id

order\_items.product\_variant\_id

```



Additional indexes support common administration queries involving:



```text

orders.created\_at

orders.status

messages.created\_at

messages.status

```



The objective is to avoid unnecessary full-table scans as the corresponding tables grow and to support common relationship, filtering, and sorting operations more efficiently.



\---



\# Database Migration System



The backend includes a migration runner for managing database schema changes.



The migration system:



1\. Creates a `schema\_migrations` tracking table when required.

2\. Discovers SQL migration files.

3\. Checks whether each migration has previously been applied.

4\. Executes new migrations inside a PostgreSQL transaction.

5\. Records successfully applied migrations.

6\. Rolls the transaction back if a migration fails.



Conceptually:



```text

Migration

&#x20;   │

&#x20;   ▼

BEGIN TRANSACTION

&#x20;   │

&#x20;   ├── Execute schema change

&#x20;   │

&#x20;   ├── Record migration

&#x20;   │

&#x20;   ▼

COMMIT



Failure

&#x20;   │

&#x20;   ▼

ROLLBACK

```



This provides a controlled mechanism for evolving database schemas between environments rather than manually applying untracked database changes.



\---



\# Authentication



The administration system uses JWT-based authentication.



Protected administrative functionality requires successful authentication before privileged operations can be performed.



Authentication and authorization are enforced by the backend rather than relying only on frontend route protection.



\---



\# Image Storage Architecture



Product images were initially handled using local application storage.



That approach becomes problematic with serverless/cloud deployments because application filesystem storage should not be treated as permanent persistent storage.



The architecture was therefore changed to use Cloudinary.



```text

Admin uploads image

&#x20;       │

&#x20;       ▼

Express Backend

&#x20;       │

&#x20;       ▼

Cloudinary

&#x20;       │

&#x20;       ▼

Persistent image URL

&#x20;       │

&#x20;       ▼

Application data

```



This separated application deployment from persistent media storage.



\---



\# Environment Strategy



The project evolved to use separate environments for different stages of development.



```text

DEVELOPMENT

Local application

Local PostgreSQL

&#x20;       │

&#x20;       ▼

STAGING / PREVIEW

Deployed test environment

Staging configuration

&#x20;       │

&#x20;       ▼

PRODUCTION

Vercel deployment

Production PostgreSQL

Production services

```



Environment-specific values are managed through environment variables rather than being hardcoded into application source code.



Examples include:



```text

Database configuration

Frontend/API URLs

Authentication secrets

Cloudinary configuration

Allowed frontend origins

```



Sensitive production values are not intended to be stored directly in the repository.



\---



\# Development → Production Workflow



The project was also used to develop a safer workflow for modifying software after production deployment.



The general release process became:



```text

Feature Development

&#x20;       │

&#x20;       ▼

Local Testing

&#x20;       │

&#x20;       ▼

Git Feature / Release Workflow

&#x20;       │

&#x20;       ▼

Preview / Staging Testing

&#x20;       │

&#x20;       ▼

Production Release

&#x20;       │

&#x20;       ▼

Production Verification

```



This allows changes to be developed and tested without immediately affecting the live application.



\---



\# Engineering Challenges \& Lessons



Several issues encountered during development became useful architecture and debugging exercises.



\### Referential Integrity



Deleting categories or products initially caused PostgreSQL foreign-key violations when dependent records existed.



This required understanding the relationships between entities and implementing controlled deletion behavior rather than treating every entity as independent.



\### CORS



Frontend and backend deployments initially encountered cross-origin request problems.



This required configuring allowed origins for local, preview, and production environments and understanding how browsers enforce cross-origin API requests.



\### Persistent Image Storage



Local image storage worked during development but was unsuitable for deployed serverless infrastructure.



Images were migrated to Cloudinary to separate persistent media storage from application deployments.



\### SPA Routing



Direct navigation to frontend routes required additional deployment configuration so client-side routes correctly returned the application rather than a platform 404.



\### Environment Isolation



Development, staging, and production require different database connections, API endpoints, origins, credentials, and service configuration.



Moving these values into environment configuration made it possible to use the same application code across different environments.



\### Database Evolution



Schema changes need to be reproducible and controlled across environments.



A migration system was introduced to track and safely apply database changes.



\---



\# AI-Assisted Development



Elpida was developed using an \*\*AI-first software development workflow\*\*.



AI development tools were used throughout:



```text

Requirements

&#x20;    ↓

Architecture \& Planning

&#x20;    ↓

Database Design

&#x20;    ↓

Backend

&#x20;    ↓

Frontend

&#x20;    ↓

Integration

&#x20;    ↓

Testing

&#x20;    ↓

Debugging

&#x20;    ↓

Deployment

&#x20;    ↓

Iteration

```



AI was used to accelerate implementation, investigate problems, generate and modify code, and support technical reasoning.



The project also demonstrated why AI-generated code still requires engineering oversight.



Architecture decisions, system boundaries, data relationships, environment management, deployment behavior, debugging, validation, and the consequences of technical changes must still be understood at the system level.



\---



\# Repository Structure



```text

elpida-website/

│

├── Backend/

│   ├── migrations/

│   ├── scripts/

│   ├── src/

│   ├── .env.example

│   └── package.json

│

├── Frontend/

│   ├── src/

│   ├── .env.example

│   ├── package.json

│   └── vite.config.ts

│

└── README.md

```



\---



\# Local Development



\## Requirements



\- Node.js

\- npm

\- PostgreSQL



\## Backend



```bash

cd Backend

npm install

```



Create the required local environment configuration using `.env.example` as the reference.



Then start the development server:



```bash

npm run dev

```



\## Frontend



```bash

cd Frontend

npm install

npm run dev

```



\---



\# Project Purpose



Elpida is not intended to demonstrate a large-scale distributed architecture.



Its purpose is to demonstrate practical end-to-end understanding of how a full-stack application is designed, implemented, connected, deployed, debugged, and evolved.



The project provided hands-on experience across:



\- Requirements analysis

\- System structure

\- Relational database design

\- API development

\- Frontend/backend integration

\- Authentication

\- Cloud storage

\- Environment management

\- Database migrations

\- Git workflows

\- Deployment

\- Production troubleshooting

\- AI-assisted software engineering



It serves as the foundation for increasingly complex software architecture and systems-design projects.

