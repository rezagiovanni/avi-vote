# AVI Vote

Voting webapp for OSIS & MPK elections, deployed on Cloud Run.

## Setup

1. Create BigQuery dataset `avi-vote` and run `scripts/setup_bq.sql`.
2. Add `avi-vote` service account and generate key.
3. Configure GitHub Actions secrets for Cloud Run deployment.
4. Deploy to Cloud Run.

## Local development

```bash
npm install
npm run dev
```

## Env

See `app.json` for default environment configuration.
