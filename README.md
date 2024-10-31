# Cocktail Management API

## Overview

This project is a RESTful API built with TypeScript and NestJS to manage cocktails and their ingredients. It provides a complete CRUD (Create, Read, Update, Delete) functionality for both cocktails and ingredients, allowing users to create, edit, display, and delete them. The API supports filtering and sorting for easier data retrieval.

## Features

- **Cocktails**
  - Create, read, update, and delete cocktail records.
  - Each cocktail includes:
    - ID
    - Name
    - Category
    - Instructions
    - Ingredients with quantities

- **Ingredients**
  - Create, read, update, and delete ingredient records.
  - Each ingredient includes:
    - ID
    - Name
    - Description
    - Alcohol status (boolean)
    - Image URL

- **Filtering and Sorting**
  - Support for filtering cocktails by category and alcohol content.
  - Sorting options by name and category in ascending or descending order.

- **Automated Tests**
  - Integration tests to ensure the functionality of the API.

## Technologies Used

- TypeScript
- NestJS
- Prisma
- SQLite
- Jest

## Getting Started

### Prerequisites

- Node.js
- pnpm
- A database (SQLite or another of your choice)

### Installation
1. Clone the repository:
```bash
git clone https://github.com/GOLDER303/solvro-recruitment-task-backend.git
cd solvro-recruitment-task-backend
```
2. Install the dependencies:
```bash
pnpm install
```
3. Set up the database:
	- Create `.env` file and set `DATABASE_URL` variable
	- Run `pnpm db:restart`
4. Start the development server:
```bash
pnpm run start:dev
```
5. The API will be available at http://localhost:3000.

### API Endpoints

The API provides the following endpoints:
Cocktails:
- GET /cocktails -> Retrieve all cocktails (supports filtering and sorting)
- POST /cocktails -> Create a new cocktail
- GET /cocktails/:id -> Retrieve a specific cocktail by ID
- PATCH /cocktails/:id -> Update a specific cocktail by ID
- DELETE /cocktails/:id -> Delete a specific cocktail by ID

Ingredients:
- GET /ingredients -> Retrieve all ingredients (supports filtering)
- POST /ingredients -> Create a new ingredient
- GET /ingredients/:id -> Retrieve a specific ingredient by ID
- PUT /ingredients/:id -> Update a specific ingredient by ID
- DELETE /ingredients/:id -> Delete a specific ingredient by ID

### Running Tests
1. Create `.env.test.local` file and set `DATABASE_URL` variable
3. Initialize/Restart test database:
``` bash
pnpm run db:test:restart
```
4. Run tests:
```bash
pnpm run test:int
```
