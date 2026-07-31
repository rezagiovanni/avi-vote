"""
Generate 225 unique voter tokens in AAAHH format (3 digits + 2 lowercase letters)
and output SQL INSERT statements for BigQuery.

Format: AAAHH
  - AAA = 3 random digits (0-9)
  - HH = 2 random lowercase letters (a-z)

Example: 449kh, 630ti, 982ka
"""
import random
import string

def generate_token():
    digits = "".join(random.choices(string.digits, k=3))
    letters = "".join(random.choices(string.ascii_lowercase, k=2))
    return digits + letters

def main():
    random.seed()
    tokens = set()
    rows = []

    kelas_list = ["7A", "7B", "7C", "8A", "8B", "8C", "9A", "9B", "9C"]
    nomor = 1

    for kelas in kelas_list:
        for i in range(1, 26):
            while True:
                token = generate_token()
                if token not in tokens:
                    tokens.add(token)
                    break
            nama = f"{kelas}-{i:02d}"
            rows.append((token, nama, kelas))
            nomor += 1

    print(f"Generated {len(rows)} unique tokens in AAAHH format")
    print(f"Sample tokens: {rows[:5]}")
    print()

    # Output SQL
    print("--- SQL ---")
    lines = []
    for token, nama, kelas in rows:
        lines.append(f"('{token}','{nama}','{kelas}',false)")
    print(f"INSERT INTO `avi_vote.voters` (token, nama, kelas, voted) VALUES")
    print(",\n".join(lines) + ";")

    # Also output TSV for easy copy-paste
    print("\n--- TSV (token \t nama \t kelas) ---")
    for token, nama, kelas in rows:
        print(f"{token}\t{nama}\t{kelas}")

if __name__ == "__main__":
    main()
