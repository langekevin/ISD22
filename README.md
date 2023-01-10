# ISD22

ISD22 Project - Pacman

# Group Members

-   Anastassiya Nikitina (project lead)
-   Tobias Thomé
-   Gian-Luca Frisch
-   Kevin Lange

# Pacman Website

-   The app contains a user management where users can register and login
-   The app contains a user profile with the maximum score of the user
-   The app contains a list of top 3 user scores 
-   The main area of the website is the page for actually playing the game

After a user is registered or logged in, if a profile was already created before, user is redirected straight to the game window and asked to press "N" button corresponding to "New game" to start playing and get his/her first score! User can also view his/her profile page with the highest score he/she got as well as see the top 3 rating of best players in order to stay motivated!

In this game Pacman is a total gourmand, he collects points by eating little slices of pizza (his favourite meal prepared by the best Italian chefs) as well as taking small breaks with his beloved dessert - pancakes! He gets so much suger power after eating a pancake that is ready to defeat any health coaches (ghosts) hunting him! He also makes them very sad, when he gets to eat such sweet desserts. After finishing with all food on the map, Pacman is ready for the next level with pizzas and pancakes, because he can eat them nonstop!

Each page is done in a unique for this game color style and theme. Pacman as well as ghosts are drawn uniquely by pieces of code. All pieces of code are written from scratch by us, existing projects were used only as inspiration. We really enjoyed putting our hearts (and long nights) into this game!

# Task Breakdown

- Anastassiya Nikitina: profile page, documentation
- Tobias Thomé: hosting
- Gian-Luca Frisch: login and registration pages
- Kevin Lange: pacman game, documentation

# How can I get the code?

1. **Clone the project:**
    ```bash
    git clone https://github.com/langekevin/ISD22.git
    ```
2. **Create a virtual env:** 
    ```bash
    cd ISD22
    python -m venv venv
    venv\Scripts\activate
    ```
3. **Install the requirements:**

    ```bash
    pip install -r requirements.txt
    ```

# Run the server

If you have successfully downloaded the code from github, the first thing you have to do is to execute the migration of the project in order to create the database

```bash
python manage.py migrate
```

Afterwards you can start the development server on your local machine

```bash
python manage.py runserver
```

# Hosting

1. **Code upload to PythonAnywhere**
	Clone the Django project from GitHub
	```bash
	git clone https://github.com/langekevin/ISD22.git
	cd ISD22
	```

2. **Creat virtualenv, install Django + other requirements**
	```bash
	mkvirtualenv --python=/usr/bin/python3.10 pacman-virtualenv
	pip install -r requirements.txt
	```

3. **Database setup**
   - Use the Consoles tab, start a bash console, navigate with `cd` to the directory where the Django project's manage.py is located.
   - run:
   ```bash
   python manage.py migrate
   ```

4. **Create super user**
   - Create a super user to log into the admin account
		```bash
		python manage.py createsuperuser
		```
   
5. **Set up static file**

   1. Set `STATIC_ROOT` in settings.py

		```bash
		STATIC_ROOT = "/home/gourmetpacman/isd22/pacmanapp/static"
		```
   2. Collect static files
		```bash
		python manage.py collectstatic
		```
   3. Set up a static files mapping
      - Go to the Web tab on the PythonAnywhere dashboard
      - Go to the Static Files section
      - Enter the same URL as STATIC_URL in the url section (/static/)
      - Enter the path from STATIC_ROOT into the path section (/home/gourmetpacman/isd22/pacmanapp/static)

6. **Setting up web app and WSGI file**
   
	1. Create a Web app with Manual Config
      	- go to the Web tab and create a new web app, 
      	- choose the "Manual Configuration" option with the right version of Python (same as in venv).
	2. Enter virtualenv name
      	- enter the name of the virtualenv `pacman-virtulenv` in the Virtualenv section on the web tab
      	- click "OK"
	3. Edit WSGI file
	Edit the WSGI file that has a link inside the "Code" section of the Web tab.
      	- Click on the WSGI file link, an editor will open where you can change it.
      	- Make sure that the WSGI file looks like the following code:

			```python
			# +++++++++++ DJANGO +++++++++++
			# To use your own Django app use code like this:
			import os
			import sys

			# assuming your Django settings file is at '/home/gourmetpacman/isd22/pacman/settings.py'
			path = '/home/gourmetpacman/isd22'
			if path not in sys.path:
				sys.path.insert(0, path)

			os.environ['DJANGO_SETTINGS_MODULE'] = 'pacman.settings'

			## Uncomment the lines below depending on your Django version
			###### then, for Django >=1.5:
			from django.core.wsgi import get_wsgi_application
			application = get_wsgi_application()
			###### or, for older Django <=1.4
			#import django.core.handlers.wsgi
			#application = django.core.handlers.wsgi.WSGIHandler()
			```
	4. Save the file and reload the application.
