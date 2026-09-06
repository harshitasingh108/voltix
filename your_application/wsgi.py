import sys
import os

# Base directory resolution
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ml_dir = os.path.join(BASE_DIR, "SmartCharge-ML")
if ml_dir not in sys.path:
    sys.path.insert(0, ml_dir)

from api import app as _asgi_app
from a2wsgi import ASGIMiddleware

# WSGI compatibility entry point for Gunicorn default runner
application = ASGIMiddleware(_asgi_app)
