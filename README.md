# Secret Gadget Management API

A RESTful API for managing secret gadgets and admin authentication.

## Table of Contents
- [Authentication](#authentication)
- [Admin Endpoints](#admin-endpoints)
- [Gadget Endpoints](#gadget-endpoints)

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:


## Admin Endpoints

### Create Admin
- **URL**: `/admin/signup`
- **Method**: `POST`
- **Response**: Returns the generated password and admin details
- **Success Response Code**: 201

### Admin Login
- **URL**: `/admin/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "codename": "string",
    "password": "string"
  }
  ```
- **Response**: Returns JWT token
- **Success Response Code**: 200

## Gadget Endpoints

### Get All Gadgets
- **URL**: `/gadget`
- **Method**: `GET`
- **Query Parameters**: 
  - `status` (optional) - Filter gadgets by status
- **Success Response Code**: 200
- **Description**: Returns all gadgets. If no status is specified, returns only 'Available' gadgets.

### Create Gadget
- **URL**: `/gadget`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "string" // Optional, will be auto-generated if not provided
  }
  ```
- **Success Response Code**: 201
- **Description**: Creates a new gadget with auto-generated codename and mission success probability.

### Update Gadget
- **URL**: `/gadget/:id`
- **Method**: `PATCH`
- **Parameters**: 
  - `id` (UUID) - Gadget ID
- **Success Response Code**: 200
- **Description**: Updates specified gadget details.

### Decommission Gadget
- **URL**: `/gadget/:id`
- **Method**: `DELETE`
- **Parameters**: 
  - `id` (UUID) - Gadget ID
- **Success Response Code**: 200
- **Description**: Changes gadget status to 'Decommissioned' and sets decommission timestamp.

### Self-Destruct Gadget
- **URL**: `/gadget/:id/self-destruct`
- **Method**: `POST`
- **Parameters**: 
  - `id` (UUID) - Gadget ID
- **Success Response Code**: 200
- **Description**: Initiates self-destruct sequence and returns confirmation code.

## Models

### Gadget Model
- **Fields**:
  - `id` (UUID, Primary Key)
  - `name` (String)
  - `codename` (String)
  - `status` (Enum: 'Available', 'Deployed', 'Destroyed', 'Decommissioned')
  - `missionSuccessProbability` (Float)
  - `decommissionedAt` (Date, nullable)

### Admin Model
- **Fields**:
  - `id` (UUID, Primary Key)
  - `codename` (String, unique)
  - `password` (String, hashed)

## Error Handling

All endpoints return appropriate error messages with the following structure:


Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Environment Variables

Required environment variables:
- `NEON_DATABASE_URL`: PostgreSQL database connection URL
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRATION`: JWT token expiration time
- `NODE_ENV`: Application environment (development/production)
