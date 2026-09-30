# Elpida

### Full-Stack E-Commerce & Administration Platform

Elpida is a full-stack web application built as an end-to-end software engineering project using an **AI-assisted development workflow**.

The project covers the complete application lifecycle: requirements analysis, relational database design, backend API development, frontend implementation, authentication, persistent media storage, testing, debugging, database migrations, environment management, deployment, and production troubleshooting.

**Live Application:** https://elpida-website.vercel.app

---

## Project Overview

Elpida combines a public business website with a lightweight e-commerce ordering system and protected administration portal.

Customers can browse categories and products, select product variants and quantities, add products to their cart, and submit an order for manual review and follow-up.

The administration system provides functionality for managing products, categories, variants, orders, customer messages, images, and application settings.

The project was developed primarily as a practical exercise in understanding how the different layers of a production web application work together.

## Architecture

```text
                        ┌─────────────────────┐
                        │      Customer       │
                        │       Browser       │
                        └──────────┬──────────┘
                                   │
                                   │ HTTPS
                                   ▼
                        ┌─────────────────────┐
                        │  React / TypeScript │
                        │      Frontend       │
                        │       Vercel        │
                        └──────────┬──────────┘
                                   │
                                   │ REST API
                                   ▼
                        ┌─────────────────────┐
                        │   Node.js / Express │
                        │       Backend       │
                        │       Vercel        │
                        └───────┬─────┬───────┘
                                │     │
                     SQL        │     │ Media
                                ▼     ▼
                    ┌──────────────┐  ┌──────────────┐
                    │ PostgreSQL   │  │  Cloudinary  │
                    │  Supabase    │  │ Image Storage│
                    └──────────────┘  └──────────────┘
```

The frontend does not communicate directly with the database. Instead:

```text
Browser → React Frontend → REST API → Express Backend → PostgreSQL
```

Product image URLs are stored with the application data, while the actual image assets are hosted through Cloudinary.

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Component-based UI architecture

### Backend
- Node.js
- Express
- REST APIs
- JWT authentication
- API security middleware
- File/image upload handling

### Database
- PostgreSQL
- Relational data modeling
- Foreign-key relationships
- Constraints
- SQL migration infrastructure
- Query indexes

### Infrastructure
- Vercel
- Supabase PostgreSQL
- Cloudinary

### Development Workflow
- Git / GitHub
- Feature and release branches
- Environment-specific configuration
- Development, staging, and production environments
- Database migration workflow

## Core Features

### Customer Experience
Customers can:
- Browse product categories
- Browse available products
- View product images and information
- Select product variants
- Choose quantities
- Add products to a cart
- Submit an order
- Submit contact messages

The current system intentionally uses an **order-request model rather than online checkout**. Submitted orders can be reviewed before the business contacts the customer.

### Administration
The protected administration interface provides functionality for:
- Category management
- Product management
- Product variant management
- Product image management
- Order management
- Customer message management
- Application settings
- Administrator authentication

## Data Model

The application uses a relational PostgreSQL database. Core relationships include:

```text
categories
    │
    └── products
            │
            └── product_variants
                       │
                       └── order_items
                                │
                                └── orders
```

Additional application data includes `messages` and `settings`.

The schema uses foreign-key relationships to maintain referential integrity between related entities. This became particularly important when implementing deletion behavior because removing a parent record while dependent records still existed could violate relational constraints.

## Database Indexing

Indexes were added to relationship columns used by common joins and relational operations, including:

```text
products.category_id
product_variants.product_id
order_items.order_id
order_items.product_variant_id
```

Additional indexes support common administration queries involving:

```text
orders.created_at
orders.status
messages.created_at
messages.status
```

The objective is to reduce unnecessary full-table scans as the corresponding tables grow and support common relationship, filtering, and sorting operations more efficiently.

## Database Migration System

The backend includes migration infrastructure for managing database schema changes. The migration runner:

1. Creates a `schema_migrations` tracking table when required.
2. Discovers SQL migration files.
3. Checks whether each migration has previously been applied.
4. Executes new migrations inside a PostgreSQL transaction.
5. Records successfully applied migrations.
6. Rolls the transaction back if a migration fails.

```text
Migration → BEGIN → Execute Change → Record Migration → COMMIT
                         │
                         └── failure → ROLLBACK
```

This provides a controlled mechanism for evolving database schemas between environments rather than relying on untracked manual changes.

## Authentication

The administration system uses JWT-based authentication. Protected administrative functionality requires successful authentication before privileged operations can be performed.

Authentication and authorization are enforced by the backend rather than relying only on frontend route protection.

## Image Storage Architecture

Product images were initially handled using local application storage. That approach is unsuitable for persistent media in a serverless/cloud deployment, so the architecture was changed to use Cloudinary.

```text
Admin Upload → Express Backend → Cloudinary → Persistent Image URL → Application Data
```

This separates application deployment from persistent media storage.

## Environment Strategy

The project evolved to use separate environments for different stages of development:

```text
Development → Staging / Preview → Production
```

Environment-specific values are managed through environment variables rather than being hardcoded into application source code. These include database configuration, frontend/API URLs, authentication secrets, Cloudinary configuration, and allowed frontend origins.

Sensitive production values are not stored directly in the repository.

## Development → Production Workflow

The project was also used to develop a safer workflow for modifying software after production deployment:

```text
Feature Development
        ↓
Local Testing
        ↓
Git Feature / Release Workflow
        ↓
Preview / Staging Testing
        ↓
Production Release
        ↓
Production Verification
```

This allows changes to be developed and tested without immediately affecting the live application.

## Engineering Challenges & Lessons

### Referential Integrity
Deleting categories or products initially caused PostgreSQL foreign-key violations when dependent records existed. This required understanding the relationships between entities and implementing controlled deletion behavior rather than treating every entity as independent.

### CORS
Frontend and backend deployments encountered cross-origin request problems. This required configuring allowed origins for local, preview, and production environments and understanding how browsers enforce cross-origin API requests.

### Persistent Image Storage
Local image storage worked during development but was unsuitable for deployed serverless infrastructure. Images were migrated to Cloudinary to separate persistent media storage from application deployments.

### SPA Routing
Direct navigation to frontend routes required deployment configuration so client-side routes correctly returned the application rather than a platform 404.

### Environment Isolation
Development, staging, and production require different database connections, API endpoints, origins, credentials, and service configuration. Moving these values into environment configuration made it possible to use the same application code across environments.

### Database Evolution
Schema changes need to be reproducible and controlled across environments. Migration infrastructure was introduced to track and safely apply database changes.

## AI-Assisted Development

Elpida was developed using an **AI-first software development workflow**.

```text
Requirements
     ↓
Architecture & Planning
     ↓
Database Design
     ↓
Backend
     ↓
Frontend
     ↓
Integration
     ↓
Testing
     ↓
Debugging
     ↓
Deployment
     ↓
Iteration
```

AI development tools were used to accelerate implementation, investigate problems, generate and modify code, and support technical reasoning.

The project also demonstrated why AI-generated code still requires engineering oversight. Architecture decisions, system boundaries, data relationships, environment management, deployment behavior, debugging, validation, and the consequences of technical changes must still be understood at the system level.

## Repository Structure

```text
elpida-website/
├── Backend/
│   ├── migrations/
│   ├── scripts/
│   ├── src/
│   ├── .env.example
│   └── package.json
├── Frontend/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Local Development

### Requirements
- Node.js
- npm
- PostgreSQL


### Backend

Create the required local environment configuration using `.env.example` as the reference. Configure the PostgreSQL connection for the database you want to use.

Install the backend dependencies:

```bash
cd Backend
npm install
```

Initialize the database schema:

```bash
npm run migrate
```

The migration runner creates the required application tables and records applied migrations in the `schema_migrations` table. On subsequent runs, migrations that have already been applied are skipped.

Start the backend development server:

```bash
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

## Project Purpose

Elpida is not intended to demonstrate a large-scale distributed architecture.

Its purpose is to demonstrate practical end-to-end understanding of how a full-stack application is designed, implemented, connected, deployed, debugged, and evolved.

The project provided hands-on experience across:
- Requirements analysis
- System structure
- Relational database design
- API development
- Frontend/backend integration
- Authentication
- Cloud storage
- Environment management
- Database migrations
- Git workflows
- Deployment
- Production troubleshooting
- AI-assisted software engineering

It serves as the foundation for increasingly complex software architecture and systems-design projects.
