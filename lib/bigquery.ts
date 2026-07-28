// @ts-nocheck
import { BigQuery } from "@google-cloud/bigquery";

export const bq = new BigQuery();

export const DATASET = process.env.BQ_DATASET || "avi_vote";

export const VOTERS_TABLE = `${DATASET}.voters`;
export const ADMIN_TABLE = `${DATASET}.admin_tokens`;
