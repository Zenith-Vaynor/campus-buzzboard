"""
WSGI config for backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os
from django.core.wsgi import get_wsgi_application
from django.core.management import call_command

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Instead of forcing it, we handle the error gracefully
try:
    application = get_wsgi_application()
    call_command('deploy') # This calls our custom command above
except Exception as e:
    print(f"Startup task failed: {e}")
