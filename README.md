# Survival Nexus Backend

Welcome to the Survival Nexus Backend! This API serves as the backend for managing survivors and their resources in a post-apocalyptic scenario.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation and Usage](#installation-and-usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- Manage survivor information
- Track items and resources
- Calculate averages and statistics related to survivors and items
- Efficient CRUD operations

## Technologies

- Node.js
- Express
- TypeScript
- Prisma (for database management)
- MySQL

## Installation and Usage

1. **Install MySQL**: Ensure you have MySQL installed on your machine. Create a database named `survival_nexus`.
2. **Clone the Repository**: 
   ```bash
   git clone https://github.com/yourusername/survival-nexus-backend.git
   cd survival-nexus-backend
3. **yarn install**: 
   ```bash
   git clone https://github.com/yourusername/survival-nexus-backend.git
   cd survival-nexus-backend
4. **Configure Database Connection**: Create a .env file in the root of the project and add your database connection string
   ```bash
   DATABASE_URL=mysql://root:SurvivalNexus2024%40@localhost:3306/survival
5. **Run Migrations**: 
   ```bash
   yarn prisma migrate
6. **Start the Server**: 
   ```bash
   yarn start
