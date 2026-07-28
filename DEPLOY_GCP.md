# Deploy nyvo clean to Google Cloud Run

## One-time setup

1. Enable billing for project `nyvo-clean-app`:
   https://console.cloud.google.com/billing/linkedaccount?project=nyvo-clean-app
2. Enable APIs (or let deploy do it):
   ```bash
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com --project=nyvo-clean-app
   ```

## Deploy

```bash
cd C:\Users\HP\Projects\nyvo-clean
gcloud config set project nyvo-clean-app
gcloud run deploy nyvo-clean `
  --source . `
  --region asia-south1 `
  --allow-unauthenticated `
  --port 8080
```

After deploy, Cloud Run prints a HTTPS URL.

## Local Docker test (optional)

```bash
docker build -t nyvo-clean .
docker run -p 8080:8080 nyvo-clean
```
