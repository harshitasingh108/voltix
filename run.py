import os
import sys

# Change working directory to SmartCharge-ML if running from repository root
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ml_dir = os.path.join(BASE_DIR, "SmartCharge-ML")
if os.path.exists(ml_dir) and os.path.isdir(ml_dir):
    os.chdir(ml_dir)
    sys.path.insert(0, ml_dir)
else:
    sys.path.insert(0, BASE_DIR)

import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"[VOLTIX Launcher] Starting Uvicorn server on 0.0.0.0:{port} from working directory {os.getcwd()}")
    uvicorn.run("api:app", host="0.0.0.0", port=port)
