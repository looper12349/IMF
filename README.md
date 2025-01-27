# Phoenix : IMF Gadget API Development Challenge

A RESTful API for managing secret gadgets and admin authentication.

## Table of Contents
- [Authentication](#authentication)
- [Admin Endpoints](#admin-endpoints)
- [Gadget Endpoints](#gadget-endpoints)
- [Limitations & Considerations](#limitations--considerations)

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

### Headers
http
Authorization: Bearer <your_token>
Content-Type: application/json


## Admin Endpoints

### Create Admin
- **URL**: `/admin/signup`
- **Method**: `POST`
- **Headers**: 
  ```http
  Content-Type: application/json
  ```
- **Response**: Returns the generated password and admin details
- **Success Response Code**: 201

### Admin Login
- **URL**: `/admin/login`
- **Method**: `POST`
- **Headers**: 
  ```http
  Content-Type: application/json
  ```
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

All gadget endpoints require authentication. Include the JWT token in the Authorization header.

### Get All Gadgets
- **URL**: `/gadget`
- **Method**: `GET`
- **Headers**: 
  ```http
  Authorization: Bearer <your_token>
  ```
- **Query Parameters**: 
  - `status` (optional) - Filter gadgets by status
- **Success Response Code**: 200
- **Description**: Returns all gadgets. If no status is specified, returns only 'Available' gadgets.

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


## Limitations & Considerations

### Codename Generation
- The current codename generation system is limited to approximately 140 unique combinations
- Based on the following calculation:
  ```
  Total combinations = codenamePrefixes.length × codenameNouns.length
  Current capacity = 6 prefixes × 17 nouns = 102 combinations
  ```
- To scale this system, consider:
  1. Adding more prefix and noun combinations
  2. Implementing a hash-based naming system
  3. Using UUID or timestamp-based suffixes

### Rate Limiting Considerations
The API could benefit from implementing rate limiting to:
- Prevent brute force attacks on authentication endpoints
- Protect against DoS attacks
- Ensure fair usage of resources

Suggested rate limits:
- Authentication endpoints: 5 requests per minute
- Gadget creation: 10 requests per minute
- Get requests: 60 requests per minute

### Future Improvements
1. Implement rate limiting using Redis or similar caching system
2. Add pagination for gadget listing endpoint
3. Expand codename generation algorithm
4. Add request logging and monitoring
5. Implement IP-based blocking for security
