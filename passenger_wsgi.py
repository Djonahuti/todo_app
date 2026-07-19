# For cPanel/shared hosting deployment
# This file tells the Python application where to find the WSGI application

import sys
import os

# Application root (same folder as this file)
APP_ROOT = os.path.dirname(__file__)
sys.path.insert(0, APP_ROOT)

# Load .env before importing the Flask app (cPanel does not auto-load it)
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(APP_ROOT, '.env'))
except ImportError:
    pass

# Import the Flask app
from app import app as application

# This is required for cPanel Python applications
if __name__ == '__main__':
    application.run()
