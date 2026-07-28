import csv
import sys
import os
sys.path.insert(0, os.path.expanduser('~/.local/share/google/google-cloud-sdk/bin'))
from google.cloud import bigquery

client = bigquery.Client(project="data-gym-480909")
query = "SELECT token, nama, kelas FROM `avi_vote.voters` ORDER BY kelas, nama"
rows = client.query(query).result()

with open('/home/rezagiovanni/voting-osis/exports/tokens.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['token','nama','kelas'])
    for r in rows:
        writer.writerow([r.token, r.nama, r.kelas])

print('exported to exports/tokens.csv')
