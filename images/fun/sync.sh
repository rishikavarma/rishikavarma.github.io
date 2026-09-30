#!/usr/bin/env bash
# Regenerate gallery.json in each images/fun/<slug>/ folder from the photos inside.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
python3 - "$ROOT" <<'PY'
import json, os, sys
root = sys.argv[1]
exts = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
for name in sorted(os.listdir(root)):
    path = os.path.join(root, name)
    if not os.path.isdir(path) or name.startswith("."):
        continue
    files = [
        f for f in os.listdir(path)
        if os.path.isfile(os.path.join(path, f))
        and os.path.splitext(f)[1].lower() in exts
        and not f.startswith(".")
    ]
    def key(fname):
        stem = os.path.splitext(fname)[0]
        return (0, int(stem)) if stem.isdigit() else (1, fname.lower())
    files.sort(key=key)
    with open(os.path.join(path, "gallery.json"), "w") as out:
        json.dump(files, out, indent=2)
        out.write("\n")
    print(f"{name}: {len(files)} image(s)")
PY
