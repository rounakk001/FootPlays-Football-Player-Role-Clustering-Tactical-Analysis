# Position-Specific Role Clustering in Football

A deployable ML web application that discovers tactical role archetypes for midfielders using Football Manager 2024 (FM24) data.

This repository takes the original unsupervised machine learning project (PCA + GMM) and wraps it in a production-ready Next.js frontend and a FastAPI backend.

## Project Overview

This project analyzes elite midfielder players (CA ≥ 120) from top football leagues. By clustering players based on their normalized attribute profiles, it identifies 5 distinct tactical role archetypes:
0. Deep-Lying Playmaker
1. Creative Playmaker
2. Defensive Anchor
3. Box-to-Box Midfielder
4. Attacking Playmaker

## Architecture

The application is structured for separate deployment of the frontend and the backend.

```text
       Browser (User)
             │
             ▼
   Next.js Frontend (React, TypeScript, Tailwind)
             │
             │ HTTPS / API
             ▼
    FastAPI Backend (Python)
             │
             ▼
    Pre-computed CSVs & Models (ML Data)
```

**Note on ML implementation:** This is a batch clustering project. The ML logic ran in Jupyter notebooks to produce the models and a static dataset of 683 classified players. The backend serves this dataset, and the frontend provides an interactive explorer. The ML output is read-only.

## Prerequisites

Before starting, ensure you have:
- **Node.js** (v18 or higher) & **npm**
- **Python** (v3.9 or higher)

### Critical ML Data Files
The raw data and models are gitignored. You **must** have the following files locally to run the backend:
1. `data/players_with_role_clusters_k5_v1.csv`
2. `data/cluster_centroids_k5.csv`

Ensure they are placed in the `backend/data/` or `data/` directory (depending on your setup) before running the API.

## Local Setup

### 1. Backend (FastAPI)

Navigate to the `backend` directory and install dependencies:
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Set up environment variables:
```bash
cp .env.example .env
```
Make sure `CORS_ORIGIN=http://localhost:3000` is set.

Run the API:
```bash
uvicorn main:app --reload --port 8000
```
The API will be available at `http://localhost:8000`.

### 2. Frontend (Next.js)

Open a new terminal, navigate to the frontend directory:
```bash
cd frontend
npm install
```

Set up environment variables:
```bash
cp .env.example .env.local
```
Ensure `NEXT_PUBLIC_API_URL=http://localhost:8000` is set.

Run the development server:
```bash
npm run dev
```
The frontend will be available at `http://localhost:3000`.

## Deployment Guide

The frontend and backend can be deployed separately to platforms like Vercel and Render.

### Frontend Deployment (Vercel)
1. Push your code to GitHub.
2. Import the `frontend` directory into Vercel as a Next.js project.
3. Set the Environment Variable: `NEXT_PUBLIC_API_URL` to your deployed backend URL (e.g., `https://my-backend.onrender.com`).
4. Deploy.

### Backend Deployment (Render / Railway / Fly.io)
1. You must commit your `players_with_role_clusters_k5_v1.csv` and `cluster_centroids_k5.csv` files, or download them at build time if they are hosted externally. The API cannot start without them.
2. Deploy the `backend` folder as a Python/FastAPI service.
3. Set the Environment Variable: `CORS_ORIGIN` to your deployed frontend URL (e.g., `https://my-frontend.vercel.app`).
4. Set the start command to `uvicorn main:app --host 0.0.0.0 --port $PORT`.

## Environment Variables

**Frontend (`frontend/.env.local` / Production Settings)**
- `NEXT_PUBLIC_API_URL`: The URL of the FastAPI backend.

**Backend (`backend/.env` / Production Settings)**
- `CORS_ORIGIN`: The URL of the Next.js frontend to allow cross-origin requests.

## ML Modifications
**ML logic changed: NO**
The core ML code (Jupyter notebooks) and methodologies have been preserved. The original Streamlit implementation was analyzed, and a clean API boundary was created to serve the pre-computed clustering results to a new, professional Next.js UI.
#
