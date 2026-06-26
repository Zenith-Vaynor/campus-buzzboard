"""
WSGI config for backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os
import sys
from django.core.wsgi import get_wsgi_application
from django.core.management import call_command

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Force migration on startup
try:
    print("Attempting automatic migration...")
    call_command('migrate')
    print("Migration complete.")
except Exception as e:
    print(f"Migration failed: {e}")

application = get_wsgi_application()
