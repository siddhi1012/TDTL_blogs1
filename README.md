# TDTL_blogs
Created blogs website. 

file structure:
Blog_Project/               # Root Directory
├── manage.py               # Django's command-line utility
├── blog_project/           # Main Project Configuration
│   ├── __init__.py
│   ├── settings.py         # MySQL & JWT configurations [cite: 10, 15]
│   ├── urls.py             # Main routing (includes accounts & posts) [cite: 12]
│   └── wsgi.py
│
├── accounts/               # App 1: Authentication Logic [cite: 13]
│   ├── migrations/
│   ├── __init__.py
│   ├── models.py           # Custom User model (if needed) [cite: 19]
│   ├── serializers.py      # Registration & Login logic [cite: 14]
│   ├── urls.py             # Auth endpoints (/api/accounts/) [cite: 29]
│   └── views.py            # JWT token generation logic [cite: 15]
│
├── posts/                  # App 2: Blog Features [cite: 30]
│   ├── migrations/
│   ├── __init__.py
│   ├── models.py           # Post model (title, content, author) [cite: 20]
│   ├── serializers.py      # Blog post data formatting [cite: 49]
│   ├── urls.py             # Blog endpoints (/api/posts/) [cite: 31, 32]
│   └── views.py            # CRUD logic & Permissions [cite: 16, 33]
│
├── venv/                   # Virtual Environment [cite: 11]
├── requirements.txt        # Dependencies (Django, DRF, mysqlclient) [cite: 12]
└── README.md               # Documentation & Setup guide [cite: 48]
