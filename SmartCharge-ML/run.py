import os
import sys

# Ensure current working directory is SmartCharge-ML
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(BASE_DIR)
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"[VOLTIX Launcher] Starting Uvicorn server on 0.0.0.0:{port} from working directory {os.getcwd()}")
    uvicorn.run("api:app", host="0.0.0.0", port=port)
