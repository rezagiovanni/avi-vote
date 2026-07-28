# AVI Vote

Voting webapp for OSIS & MPK elections, deployed on Cloud Run.

## Setup

1. Create BigQuery dataset `avi_vote` and run `scripts/setup_bq.sql`.
2. Service account `avi-vote` created: `avi-vote@data-gym-480909.iam.gserviceaccount.com` (project `data-gym-480909`).
3. Configure GitHub Actions secrets for Workload Identity / Cloud Run deployment.
4. Deploy to Cloud Run.

## Local development

```bash
npm install
npm run dev
```

## Env

See `app.json` for default environment configuration.
