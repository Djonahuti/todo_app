# For cPanel/shared hosting deployment
# This file tells the Python application where to find the WSGI application

import sys
import os

# Add your application directory to the Python path
sys.path.insert(0, os.path.dirname(__file__))

# Import the Flask app
from app import app as application

# This is required for cPanel Python applications
if __name__ == '__main__':
    application.run()
