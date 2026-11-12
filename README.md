# MCC Player Tracker

A web-based statistics tracker for **Halo: The Master Chief Collection (MCC)**. Built using React, Vite, Node.js, Express and MongoDB.

## Requirements

- [Node.js](https://nodejs.org/) and npm
- The provided `.env` file
- Internet connection

## How to Run

### 1. Extract the project

Extract the submitted project folder and open it in VS Code.

### 2. Install frontend dependencies

Open a terminal in the project root directory and run:

```bash
npm install
```

### 3. Install backend dependencies

Navigate into the backend folder:

```bash
cd backend
npm install
```

### 4. Configure the environment file

Copy the provided `.env` file from the hand-in folder into the `backend` directory.

The `.env` file contains the MongoDB connection details required by the backend.

### 5. Start the backend

While inside the `backend` directory, run:

```bash
node server.js
```

Keep this terminal running.

### 6. Start the frontend

Open a second terminal in the project root directory and run:

```bash
npm run dev
```

### 7. Open the website

Open the local URL provided by Vite, normally:

[http://localhost:5173](http://localhost:5173)

**Note:** Both the frontend and backend must be running simultaneously for the website to function correctly.