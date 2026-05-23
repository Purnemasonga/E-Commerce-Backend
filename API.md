# 🛒 E-Commerce Full-Stack Application - API Documentation

This document contains a comprehensive analysis and documentation of all backend API endpoints available in the application.

- **Base URL:** `http://localhost:5000` (Defined by the `PORT` environment variable in `.env`)
- **Default Content Type:** `application/json`

---

## 🔑 Authentication & Authorization Middlewares

Some endpoints are protected and require specific headers to verify the identity and role of the client.

### 1. `verifyToken`
* **Purpose:** Validates that a JSON Web Token (JWT) is present and has not expired or been tampered with.
* **Required Header:** `Authorization: Bearer <JWT_TOKEN>`

### 2. `isAdmin`
* **Purpose:** First decodes the JWT and validates that the user's role is exactly `"admin"`.
* **Required Header:** `Authorization: Bearer <JWT_TOKEN>` (Must contain `role: "admin"` in payload)

### 3. `isUser`
* **Purpose:** First decodes the JWT and validates that the user's role is exactly `"user"`.
* **Required Header:** `Authorization: Bearer <JWT_TOKEN>` (Must contain `role: "user"` in payload)

---

## 👤 User Endpoints (`/user`)

Handles user registration, authentication, profile updates, and password recovery.

### 1. Register User
* **URL:** `http://localhost:5000/user/register`
* **Method:** `POST`
* **Headers:**
  * `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": 9876543210,
    "password": "securePassword123",
    "address": "123 Main Street",
    "city": "San Jose",
    "userType": "user",
    "state": "California",
    "zipCode": 95112
  }
  ```
* **Query Parameters:** None
* **Path Parameters:** None
* **Responses:**
  * **200 OK (Success):**
    ```json
    {
      "message": "Register Successfully"
    }
    ```
  * **500 Internal Server Error:**
    ```json
    {
      "message": "failed to register",
      "err": {
        "name": "MongoServerError",
        "message": "E11000 duplicate key error collection..."
      }
    }
    ```

### 2. Get All Users
* **URL:** `http://localhost:5000/user/get-users`
* **Method:** `GET`
* **Headers:** None
* **Query Parameters:** None
* **Path Parameters:** None
* **Responses:**
  * **200 OK (Success):**
    ```json
    {
      "message": "Users fetched successfully",
      "data": [
        {
          "_id": "664ea1c875d9e525ec1d556c",
          "name": "John Doe",
          "email": "johndoe@example.com",
          "phone": 9876543210,
          "address": "123 Main Street",
          "city": "San Jose",
          "userType": "user",
          "state": "California",
          "zipCode": 95112,
          "createdAt": "2026-05-23T11:00:00.000Z",
          "updatedAt": "2026-05-23T11:00:00.000Z"
        }
      ]
    }
    ```

### 3. Login User
* **URL:** `http://localhost:5000/user/login`
* **Method:** `POST`
* **Headers:**
  * `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "username": "johndoe@example.com",
    "password": "securePassword123"
  }
  ```
* **Query/Path Parameters:** None
* **Responses:**
  * **202 Accepted (Success):**
    ```json
    {
      "message": "login successfull",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGVhMWM4NzVkOWU1MjVlYzFkNTU2YyIsInJvbGUiOiJ1c2VyIiwiZW1haWwiOiJqb2huZG9lQGV4YW1wbGUuY29tIiwiZXhwIjoxNzE2NDgyMDAwfQ...",
      "id": "664ea1c875d9e525ec1d556c",
      "email": "johndoe@example.com"
    }
    ```
  * **401 Unauthorized (Invalid Password):**
    ```json
    {
      "message": "invalid password"
    }
    ```
  * **500 Internal Server Error (User Not Found):**
    ```json
    {
      "message": "username not found"
    }
    ```

### 4. Get User by ID (⚠️ Route Conflict / Parameter Issue)
* **URL:** `http://localhost:5000/user/get-users`
* **Method:** `GET`
* **Headers:** None
* **Query Parameters:** None
* **Path Parameters:** None
* **⚠️ Critical Implementation Notes:**
  This endpoint is mapped in `userRouter.js` as `router.get("/get-users", getUserBasedonId)`.
  1. **Route Conflict:** It shares the exact same path and method as the "Get All Users" endpoint (`router.get("/get-users", getUsers)`). Due to Express routing rules, the second handler will never execute for standard requests on `/get-users`.
  2. **Parameter Issue:** The controller `getUserBasedonId` attempts to query using `Users.find(req.params.id)`. However, the router does NOT define an `:id` parameter in the route path pattern. Therefore, `req.params.id` will always be `undefined`.
  3. **Recommendation:** Change the router path to `/get-users/:id` to distinguish this endpoint and receive the user ID as a path parameter.
* **Expected (Fixed) Path:** `http://localhost:5000/user/get-users/:id`
* **Responses:**
  * **200 OK (Success):**
    ```json
    {
      "message": "Users fetched successfully",
      "data": {
        "_id": "664ea1c875d9e525ec1d556c",
        "name": "John Doe",
        "email": "johndoe@example.com"
      }
    }
    ```

### 5. Update Profile (⚠️ Parameter Issue)
* **URL:** `http://localhost:5000/user/update-profile`
* **Method:** `PATCH`
* **Headers:**
  * `Content-Type: application/json`
* **Request Body:** (Fields to update)
  ```json
  {
    "name": "John Smith",
    "address": "456 Oak Avenue",
    "city": "San Francisco"
  }
  ```
* **⚠️ Critical Implementation Notes:**
  1. The controller `updateProfile` attempts to use `req.params.id` to identify the user (`Users.findByIdAndUpdate(req.params.id, req.body, ...)`). However, the router defines the path as `/update-profile` without any `:id` parameter.
  2. **Recommendation:** Update the router path to `/update-profile/:id` or read the authenticated user's ID directly from the decoded JWT token.
* **Responses:**
  * **200 OK (Success):**
    ```json
    {
      "message": "update successfully",
      "updatedPrpfile": {
        "_id": "664ea1c875d9e525ec1d556c",
        "name": "John Smith",
        "email": "johndoe@example.com",
        "phone": 9876543210,
        "address": "456 Oak Avenue",
        "city": "San Francisco",
        "userType": "user",
        "state": "California",
        "zipCode": 95112
      }
    }
    ```

### 6. Forget Password
* **URL:** `http://localhost:5000/user/forget-password`
* **Method:** `PATCH`
* **Headers:**
  * `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "email": "johndoe@example.com",
    "password": "newSecurePassword456"
  }
  ```
* **Responses:**
  * **200 OK (Success):**
    ```json
    {
      "message": "password updated successfully"
    }
    ```
  * **500 Internal Server Error:**
    ```json
    {
      "message": "failed to update password",
      "err": {}
    }
    ```

---

## 📦 Product Endpoints (`/products`)

Handles product creation, retrieval, updates, deletion, filtering, and sorting.

### 1. Add Product (Admin Only)
* **URL:** `http://localhost:5000/products/add-products`
* **Method:** `POST`
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <ADMIN_JWT_TOKEN>`
* **Request Body:**
  ```json
  {
    "name": "Wireless Noise Cancelling Headphones",
    "price": 14999,
    "description": "Premium wireless over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound.",
    "ratings": "4.5",
    "imageSrc": "https://example.com/images/headphones.jpg",
    "about": "Designed for long listening sessions with plush memory foam earcups and voice assistant support.",
    "reviews": []
  }
  ```
* **Responses:**
  * **201 Created (Success):**
    ```json
    {
      "message": "Product Added"
    }
    ```
  * **401 / 403 (Auth Failure):**
    ```json
    {
      "message": "Access Denied , Admin only"
    }
    ```

### 2. Get All Products
* **URL:** `http://localhost:5000/products/get-allproducts`
* **Method:** `GET`
* **Headers:** None
* **Responses:**
  * **200 OK (Success):**
    ```json
    {
      "allProducts": [
        {
          "_id": "664ea5c275d9e525ec1d557f",
          "name": "Wireless Noise Cancelling Headphones",
          "price": 14999,
          "description": "Premium wireless over-ear headphones...",
          "ratings": "4.5",
          "imageSrc": "https://example.com/images/headphones.jpg",
          "about": "Designed for long listening sessions...",
          "reviews": [],
          "createdAt": "2026-05-23T11:00:00.000Z",
          "updatedAt": "2026-05-23T11:00:00.000Z"
        }
      ]
    }
    ```

### 3. Get Product by ID
* **URL:** `http://localhost:5000/products/get-product/:id`
* **Method:** `GET`
* **Headers:** None
* **Path Parameters:**
  * `id` - The product's MongoDB ObjectId (e.g., `664ea5c275d9e525ec1d557f`)
* **Responses:**
  * **200 OK (Success):**
    ```json
    {
      "foundProduct": {
        "_id": "664ea5c275d9e525ec1d557f",
        "name": "Wireless Noise Cancelling Headphones",
        "price": 14999,
        "description": "Premium wireless over-ear headphones...",
        "ratings": "4.5",
        "imageSrc": "https://example.com/images/headphones.jpg",
        "about": "Designed for long listening sessions...",
        "reviews": []
      }
    }
    ```

### 4. Delete Product (Admin Only)
* **URL:** `http://localhost:5000/products/delete-product/:id`
* **Method:** `DELETE`
* **Headers:**
  * `Authorization: Bearer <ADMIN_JWT_TOKEN>`
* **Path Parameters:**
  * `id` - The product's MongoDB ObjectId (e.g., `664ea5c275d9e525ec1d557f`)
* **Responses:**
  * **200 OK (Success):**
    ```json
    {
      "message": "Product Deleted",
      "deletedProduct": {
        "_id": "664ea5c275d9e525ec1d557f",
        "name": "Wireless Noise Cancelling Headphones",
        "price": 14999
      }
    }
    ```

### 5. Edit Product (Admin Only)
* **URL:** `http://localhost:5000/products/edit-product/:id`
* **Method:** `PUT`
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <ADMIN_JWT_TOKEN>`
* **Path Parameters:**
  * `id` - The product's MongoDB ObjectId (e.g., `664ea5c275d9e525ec1d557f`)
* **Request Body:** (Fields to update)
  ```json
  {
    "price": 13999,
    "ratings": "4.7"
  }
  ```
* **Responses:**
  * **200 OK (Success):**
    ```json
    {
      "message": "updated successfully",
      "updatedProduct": {
        "_id": "664ea5c275d9e525ec1d557f",
        "name": "Wireless Noise Cancelling Headphones",
        "price": 13999,
        "description": "Premium wireless over-ear headphones with active noise cancellation...",
        "ratings": "4.7",
        "imageSrc": "https://example.com/images/headphones.jpg",
        "about": "Designed for long listening sessions...",
        "reviews": []
      }
    }
    ```

### 6. Filter Products by Price
* **URL:** `http://localhost:5000/products/filter-products`
* **Method:** `GET`
* **Headers:** None
* **Query Parameters:**
  * `min` - Minimum price value (e.g., `10000`)
  * `max` - Maximum price value (e.g., `50000`)
* **Responses:**
  * **200 OK (Success):**
    ```json
    {
      "filteredProducts": [
        {
          "_id": "664ea5c275d9e525ec1d557f",
          "name": "Wireless Noise Cancelling Headphones",
          "price": 14999,
          "description": "Premium wireless over-ear headphones...",
          "ratings": "4.5",
          "imageSrc": "https://example.com/images/headphones.jpg",
          "about": "Designed for long listening sessions...",
          "reviews": []
        }
      ]
    }
    ```

### 7. Sort Products by Price
* **URL:** `http://localhost:5000/products/sort-products`
* **Method:** `GET`
* **Headers:** None
* **Query Parameters:**
  * `sortPrice` - Sort order. `1` for Ascending, `-1` for Descending. (Defaults to `1` if not specified).
* **Responses:**
  * **200 OK (Success):**
    ```json
    {
      "sortedProducts": [
        {
          "_id": "664ea5c275d9e525ec1d557f",
          "name": "Wireless Noise Cancelling Headphones",
          "price": 14999,
          "description": "Premium wireless over-ear headphones...",
          "ratings": "4.5",
          "imageSrc": "https://example.com/images/headphones.jpg",
          "about": "Designed for long listening sessions...",
          "reviews": []
        }
      ]
    }
    ```

---

## 🤖 AI Prompt Endpoints (`/ai`)

Integrates Google Gemini to process text prompts and save response logs.

### 1. Generate AI Response
* **URL:** `http://localhost:5000/ai/prompt`
* **Method:** `POST`
* **Headers:**
  * `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "prompt": "List the top 3 best practices for writing secure REST APIs in Express.js."
  }
  ```
* **Responses:**
  * **200 OK (Success):**
    ```json
    {
      "AIResponse": "1. Use secure headers (e.g., helmet.js)\n2. Implement rate limiting\n3. Sanitize and validate inputs strictly."
    }
    ```
  * **500 Internal Server Error:**
    ```json
    {
      "message": "failed to generate",
      "err": {}
    }
    ```

---

## 🛒 Cart Endpoints (`/cart`)

Manages customer shopping carts (adding, retrieving, removing, and clearing items).

### 1. Add to Cart
* **URL:** `http://localhost:5000/cart/add-cart`
* **Method:** `POST`
* **Headers:**
  * `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "userId": "664ea1c875d9e525ec1d556c",
    "productId": "664ea5c275d9e525ec1d557f"
  }
  ```
* **Responses:**
  * **200 OK (Success):**
    ```json
    {
      "message": "add to cart successfull"
    }
    ```
  * **401 Unauthorized (Missing fields):**
    ```json
    {
      "message": "missing required fields"
    }
    ```
  * **500 Internal Server Error:**
    ```json
    {
      "message": "Failed to add Cart",
      "error": {}
    }
    ```

### 2. Get Cart Products (User Only)
* **URL:** `http://localhost:5000/cart/get-cartproducts/:userId`
* **Method:** `GET`
* **Headers:**
  * `Authorization: Bearer <USER_JWT_TOKEN>`
* **Path Parameters:**
  * `userId` - The authenticated user's MongoDB ObjectId (e.g., `664ea1c875d9e525ec1d556c`)
* **Responses:**
  * **200 OK (Success):**
    ```json
    {
      "AllProducts": [
        {
          "Products_in_cart": [
            {
              "_id": "664ea5c275d9e525ec1d557f",
              "name": "Wireless Noise Cancelling Headphones",
              "price": 14999,
              "description": "Premium wireless over-ear headphones...",
              "ratings": "4.5",
              "imageSrc": "https://example.com/images/headphones.jpg",
              "about": "Designed for long listening sessions...",
              "reviews": []
            }
          ]
        }
      ]
    }
    ```

### 3. Remove Product from Cart (User Only)
* **URL:** `http://localhost:5000/cart/remove-product`
* **Method:** `PATCH`
* **Headers:**
  * `Content-Type: application/json`
  * `Authorization: Bearer <USER_JWT_TOKEN>`
* **Request Body:**
  ```json
  {
    "userId": "664ea1c875d9e525ec1d556c",
    "productId": "664ea5c275d9e525ec1d557f"
  }
  ```
* **Responses:**
  * **200 OK (Success):**
    ```json
    {
      "removedProducts": {
        "acknowledged": true,
        "modifiedCount": 1,
        "upsertedId": null,
        "upsertedCount": 0,
        "matchedCount": 1
      }
    }
    ```

### 4. Clear Entire Cart (User Only)
* **URL:** `http://localhost:5000/cart/clear-cart`
* **Method:** `PATCH`
* **Headers:**
  * `Authorization: Bearer <USER_JWT_TOKEN>`
* **Query Parameters:**
  * `userId` - The authenticated user's MongoDB ObjectId (e.g., `664ea1c875d9e525ec1d556c`)
* **Responses:**
  * **200 OK (Success):**
    ```json
    {
      "removeAll": {
        "acknowledged": true,
        "modifiedCount": 1,
        "upsertedId": null,
        "upsertedCount": 0,
        "matchedCount": 1
      }
    }
    ```
