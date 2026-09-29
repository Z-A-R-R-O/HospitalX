import os
import sys

with open("repo.export", "rb") as f:
    raw_bytes = f.read()

text = raw_bytes.decode("utf-16", errors="replace")
blobs = {}
lines = text.split("\n")

current_mark = None
i = 0
while i < len(lines):
    line = lines[i]
    if line.startswith("blob"):
        i += 1
        mark_line = lines[i]
        if mark_line.startswith("mark :"):
            current_mark = mark_line.split(":")[1].strip()
        i += 1
        data_line = lines[i]
        if data_line.startswith("data "):
            data = []
            i += 1
            while i < len(lines) and not (lines[i].startswith("blob") or lines[i].startswith("commit") or lines[i].startswith("reset") or lines[i].startswith("tag ")):
                data.append(lines[i])
                i += 1
            blobs[current_mark] = "\n".join(data)
            continue
    elif line.startswith("commit "):
        is_v1 = False
        commit_data = []
        while i < len(lines) and not (lines[i].startswith("blob") or lines[i].startswith("commit ") and len(commit_data) > 0):
            commit_data.append(lines[i])
            if "release: HospitalX V1" in lines[i]:
                is_v1 = True
            i += 1
        
        if is_v1:
            for c_line in commit_data:
                if c_line.startswith("M 100644 :") or c_line.startswith("M 100755 :"):
                    parts = c_line.split(" ")
                    if len(parts) >= 3:
                        mark = parts[2][1:]
                        filepath = " ".join(parts[3:]).strip()
                        if filepath.endswith(".ts") or filepath.endswith(".tsx") or filepath.endswith(".css") or filepath.endswith(".json") or filepath.endswith(".mjs") or filepath.endswith(".js") or filepath.endswith(".cs"):
                            dirname = os.path.dirname(filepath)
                            if dirname:
                                os.makedirs(dirname, exist_ok=True)
                            with open(filepath, "w", encoding="utf-8") as out_f:
                                content = blobs.get(mark, "")
                                content = content.replace("\r\r\n", "\r\n").replace("\r\n\r\n", "\n")
                                out_f.write(content)
            sys.exit(0)
        continue
    i += 1
