import sys

with open("repo.export", "rb") as f:
    content = f.read(1024)
    print(content)
