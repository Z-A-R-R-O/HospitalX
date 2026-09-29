import sys
from datetime import datetime, timedelta

start_time = datetime(2026, 9, 28, 10, 0, 0)
time_increment = timedelta(minutes=25)
commit_count = 0

for line in sys.stdin:
    if line.startswith("author ") or line.startswith("committer "):
        parts = line.strip().split("> ")
        if len(parts) == 2:
            prefix = parts[0] + ">"
            new_time = start_time + (time_increment * commit_count)
            timestamp = int(new_time.timestamp())
            if line.startswith("committer "):
                commit_count += 1
            print(f"{prefix} {timestamp} +0530")
        else:
            print(line, end="")
    else:
        print(line, end="")
