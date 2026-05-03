# Deployment Guide — Matdaan-Mitra

This guide explains how to deploy the **Matdaan-Mitra** application to production using **Google Cloud Run**.

## 1. Prerequisites

- A Google Cloud Project (e.g., `matdaan-mitra-495008`).
- Google Cloud SDK (`gcloud`) installed and authenticated.
- Docker installed (optional, if building locally) or using Google Cloud Build.

## 2. Backend Deployment (Google Cloud Run)

The backend is a Node.js/Express app. We deploy it as a serverless container.

1.  **Configure Environment**: Ensure `backend/.env` is ignored by git but set as environment variables in Cloud Run.
2.  **Deploy Command**:
    ```bash
    gcloud run deploy backend \
      --source backend \
      --project=YOUR_PROJECT_ID \
      --region=asia-south1 \
      --allow-unauthenticated \
      --set-env-vars GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID,NODE_ENV=production
    ```
3.  **Note the URL**: After deployment, Cloud Run will provide a service URL (e.g., `https://backend-xxx.a.run.app`).

## 3. Frontend Deployment (Google Cloud Run)

The frontend is a Next.js app. We deploy it using the same container-based approach.

1.  **Update API URL**: In `frontend/.env.local`, set `NEXT_PUBLIC_API_URL` to your backend service URL.
2.  **Deploy Command**:
    ```bash
    gcloud run deploy frontend \
      --source frontend \
      --project=YOUR_PROJECT_ID \
      --region=asia-south1 \
      --allow-unauthenticated
    ```
3.  **Note the URL**: This will be your primary application link.

## 4. Google Cloud Services Setup

### BigQuery (Analytics)
1.  Create a dataset named `matdaan_analytics` (as defined in `constants.js`).
2.  Create a table named `chat_logs`.
3.  The backend service account must have `BigQuery Data Editor` and `BigQuery Job User` roles.

### Cloud Logging (Monitoring)
1.  Logs are automatically sent to Google Cloud Logging if `GOOGLE_CLOUD_PROJECT` is set.
2.  View them in the **Logs Explorer** under the `global` resource.

### Secret Manager (Security)
1.  Store sensitive keys like `GEMINI_API_KEY` in Secret Manager.
2.  The backend uses the `getSecret` utility to fetch them at runtime.

## 5. Post-Deployment Checks

- Verify the frontend loads over HTTPS.
- Test the **Hindi/English** toggle.
- Check the **Election Countdown** is active.
- Submit a **Vote Pledge** and ensure it persists locally.
- Complete the **Readiness Quiz** and test the **Share** feature.
- Verify that chat interactions are appearing in your BigQuery `chat_logs` table.

---
**Developed for the 2026 Innovation Hackathon.**
*"Empowering every citizen through intelligent guidance."*
