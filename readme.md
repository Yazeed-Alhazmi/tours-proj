# Tours Application


A RESTful API for managing tours, built with **Node.js**, **Express**, and **MongoDB**. This project supports tour listings, user authentication, reviews, and more

## Features

- Tour CRUD operations
- User authentication and authorization
- Reviews linked to tours and users

## Authentication

- JWT based authentication
- Role based access control (admin, user, guide, lead-guide)


## Getting Started

1. **Clone the repo**
   ```bash
   git clone  https://github.com/Yazeed-Alhazmi/tours-proj.git
   cd tours-proj
   ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Set up environment**
Create a .env file with:
    ```bash
    NODE_ENV = development
    PORT = 3000
    DATABASE_PASSWORD = <your-password>
    DATABASE = <your-mongo-url>

    JWT_SECRET=<your-secret>
    JWT_EXPIRES_IN=90d

    EMAIL_USERNAME=<your-email>
    EMAIL_PASSWORD=<your-gmail-token>
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=465
    ```

4. **Start the server**

    ```bash
    npm run start:dev
    ```

5. **Seeding the Database**

You can import or delete sample tour data from the tours.json file using:
Import: 
    ```bash
    node starter/dev-data/data/import-dev-data.js --import
    ```
Delete: 
    ```bash
    node starter/dev-data/data/import-dev-data.js --delete
    ```


## API

Test endpoints using [Postman](https://www.postman.com/)

[API Documentation](https://documenter.getpostman.com/view/31564072/2sB34ikzVm)