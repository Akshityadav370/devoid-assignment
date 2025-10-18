# Devoid Assignment

A full-stack project management app with session-based project/task isolation using a unique `storageId` per browser. Projects and tasks are stored in MongoDB and associated with a `storageId` for user/session isolation.

### Live Link: https://project-manager-devoid.netlify.app/

#### Note:

I've used serverless hoisting for backend, if error appears when testing the live link, I request you to please wait for few minutes until mongoose connection sits in the cache.
To test the connection health: use `https://devoid-assignment.vercel.app/api/health`

## Features

- Create, edit, delete projects and tasks
- Each browser session gets a unique `storageId` (persisted in localStorage)
- Only projects/tasks for the current `storageId` are shown
- Modern React frontend (Vite)
- Express + MongoDB backend

---

## Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB (local or Atlas)

### 1. Clone the repository

```bash
git clone <repo-url>
cd devoid-assignment
```

### 2. Install dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file in the `backend/` folder with the following:

```
MONGODB_URI=<your-mongodb-connection-string>
PORT=3001
```

#### Example:

```
MONGODB_URI=mongodb://localhost:27017/devoid
PORT=3001
```

### 4. Run the backend server

```bash
cd backend
npm start
```

### 5. Run the frontend

```bash
cd frontend
npm run dev
```

---

## Environment Variables

| Variable    | Description               | Example                          |
| ----------- | ------------------------- | -------------------------------- |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/devoid |
| PORT        | Backend server port       | 3001                             |

---

## Using a Sample storageId

To prefetch already saved DB data, use the following sample storageId:

```
3382df88-70df-4c1a-97eb-9606ce3c05b8
```

You can set this value in your browser's localStorage for testing:

```js
localStorage.setItem('storageId', '3382df88-70df-4c1a-97eb-9606ce3c05b8');
```

---

## Folder Structure

```
backend/
  index.js
  ...
frontend/
  src/
    components/
    context/
    ...
```
