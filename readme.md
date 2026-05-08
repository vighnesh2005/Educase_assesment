# School Management API

A RESTful API built using **Node.js**, **Express.js**, and **MySQL** for managing school data.

The API allows users to:
- Add new schools to the database
- Retrieve schools sorted by proximity to a user's location

This project was developed as part of the **School Management Backend Assessment**.

---

# Live Deployment

Base URL:

```bash
https://educase-assesment-8tpt.onrender.com
```

---

# Tech Stack

- Node.js
- Express.js
- MySQL (TiDB Cloud - MySQL Compatible)
- mysql2
- dotenv
- cors

---

# Features

- Add schools with validation
- Prevent duplicate school entries
- Retrieve schools sorted by nearest distance
- Geographical distance calculation using Haversine Formula
- RESTful API design
- Environment variable support
- Error handling

---

# Project Structure

```bash
.
├── index.js
├── databaseSetup.js
├── package.json
├── .env
└── README.md
```

---

# Environment Variables

Create a `.env` file in the root directory.

```env
HOST=your_host
PORT=4000
USERNAME=your_username
PASSWORD=your_password
DATABASE=school_management
```

---

# Installation & Setup

## Clone Repository

```bash
git clone <repository-url>
cd <project-folder>
```

---

## Install Dependencies

```bash
npm install
```

---

## Start Development Server

```bash
npm run dev
```

OR

```bash
node index.js
```

---

# Database Schema

The following table is automatically created when the server starts:

```sql
CREATE TABLE IF NOT EXISTS Schools(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL
);
```

---

# API Documentation

# 1. Add School API

## Endpoint

```http
POST /addSchool
```

---

## Description

Adds a new school to the database after validating the input data.

The API prevents duplicate schools with the same:
- name
- address

---

## Request Body

```json
{
  "name": "ABC School",
  "address": "Hyderabad",
  "latitude": 17.385,
  "longitude": 78.4867
}
```

---

## Successful Response

### Status Code

```http
201 Created
```

### Response

```json
{
  "message": "School added successfully",
  "school": {
    "name": "ABC School",
    "address": "Hyderabad",
    "latitude": 17.385,
    "longitude": 78.4867
  }
}
```

---

# Validation Rules

| Field | Type | Validation |
|------|------|------|
| name | string | Required |
| address | string | Required |
| latitude | number | Required |
| longitude | number | Required |

---

# Error Responses

## Missing Fields

### Response

```http
400 Bad Request
```

```json
{
  "error": "All fields are required"
}
```

---

## Invalid Data Types

### Response

```http
400 Bad Request
```

```json
{
  "error": "Invalid data types for one or more fields"
}
```

---

## Duplicate School

### Response

```http
400 Bad Request
```

```json
{
  "error": "School with the same name and address already exists"
}
```

---

# 2. List Schools API

## Endpoint

```http
GET /listSchools
```

---

## Description

Returns all schools sorted by proximity to the user's location.

The API uses the **Haversine Formula** to calculate geographical distance between coordinates.

---

## Query Parameters

| Parameter | Type | Required |
|------|------|------|
| latitude | number | Yes |
| longitude | number | Yes |

---

## Example Request

```http
GET /listSchools?latitude=17.385&longitude=78.4867
```

---

## Successful Response

### Status Code

```http
200 OK
```

### Response

```json
{
  "schools": [
    {
      "id": 1,
      "name": "ABC School",
      "address": "Hyderabad",
      "latitude": 17.385,
      "longitude": 78.4867,
      "distance": 0
    }
  ]
}
```

---

# Validation Rules

- Latitude must be between -90 and 90
- Longitude must be between -180 and 180

---

# Error Responses

## Missing Coordinates

### Response

```http
400 Bad Request
```

```json
{
  "error": "Latitude and longitude are required"
}
```

---

## Invalid Coordinates

### Response

```http
400 Bad Request
```

```json
{
  "error": "Latitude and longitude must be valid numbers"
}
```

---

## Invalid Latitude

### Response

```http
400 Bad Request
```

```json
{
  "error": "Invalid latitude"
}
```

---

## Invalid Longitude

### Response

```http
400 Bad Request
```

```json
{
  "error": "Invalid longitude"
}
```

---

# Distance Calculation

The API uses the **Haversine Formula** for calculating geographical distance between two latitude-longitude points on Earth.

Formula used:

```text
distance = 6371 * acos(
    cos(radians(lat1)) *
    cos(radians(lat2)) *
    cos(radians(lon2) - radians(lon1)) +
    sin(radians(lat1)) *
    sin(radians(lat2))
)
```

Distance is calculated in kilometers.

---

# Example Test Cases

# Add School API

## Test Case 1 — Valid School Creation

### Request

```json
{
  "name": "Delhi Public School",
  "address": "Hyderabad",
  "latitude": 17.385,
  "longitude": 78.4867
}
```

### Expected Result

```http
201 Created
```

School should be added successfully.

---

## Test Case 2 — Missing Name

### Request

```json
{
  "address": "Hyderabad",
  "latitude": 17.385,
  "longitude": 78.4867
}
```

### Expected Result

```http
400 Bad Request
```

---

## Test Case 3 — Invalid Data Type

### Request

```json
{
  "name": "ABC School",
  "address": "Hyderabad",
  "latitude": "invalid",
  "longitude": 78.4867
}
```

### Expected Result

```http
400 Bad Request
```

---

## Test Case 4 — Duplicate School

### Expected Result

```http
400 Bad Request
```

Duplicate school entries should not be allowed.

---

# List Schools API

## Test Case 1 — Valid Coordinates

### Request

```http
GET /listSchools?latitude=17.385&longitude=78.4867
```

### Expected Result

```http
200 OK
```

Schools should be returned sorted by nearest distance.

---

## Test Case 2 — Missing Parameters

### Request

```http
GET /listSchools
```

### Expected Result

```http
400 Bad Request
```

---

## Test Case 3 — Invalid Latitude

### Request

```http
GET /listSchools?latitude=200&longitude=78.4867
```

### Expected Result

```http
400 Bad Request
```

---

# Postman Collection

The Postman collection includes:
- Add School API
- List Schools API
- Example request payloads
- Example responses

---

# Deployment

The application is deployed on Render.
and for database we used TiDB Cloud (MySQL)

---


# Author

Developed as part of the School Management Backend Assessment.