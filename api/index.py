import os
import sys

# Add the backend directory to Python path so relative imports inside app work
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.main import app
