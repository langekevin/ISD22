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

1. **Install git:** To contribute to this project, you first have to install git on your local machine. Therefore you can either install GitHub Desktop from [this website](https://desktop.github.com/) or you can use the cli of Git.
2. **Clone the project:** To clone the project simply select the repository in GitHub Desktop, click on fetch repository and then open in Visual Studio Code or PyCharm or use
    ```bash
    git clone https://github.com/langekevin/ISD22.git
    ```
3. **Create a virtual env:** After cloning the repository from GitHub, you have to create a virtual environment for python. To achieve this, just type
    ```bash
    cd ISD22
    python -m venv venv
    venv\Scripts\activate
    ```
4. **Install the requirements:** To install all the requriements for your project, just type

    ```bash
    pip install -r requirements.txt
    ```

5. **Write your code:** After fetching the repository from GitHub, you can write the code according to the issues in GitHub. Don't forget to commit and push your code afterwards

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

How the Website ist hosted on PythonAnywhere.
A virtualenv is used and we have a copy of our code on PythonAnywhere which can be edited and browsed and commited to version control.
First create an PythonAnywhere Account.

1. **Code upload to PythonAnywhere**
	Clone the Django project from GitHub
	```bash
	$ git clone https://github.com/langekevin/ISD22.git
	```

2. **Creat virtualenv, install Django + other requirements**
	```bash
	$ mkvirtualenv --python=/usr/bin/python3.10 pacman-virtulenv
	(pacman-virtulenv)$ pip install django
	(pacman-virtulenv)$ pip install -r requirements.txt
	```

3. **Setting up web app and WSGI file**
	1. Save the Directories:
	List the Django project's name and path, manage.py path
	```<txt>
	Directories

	manage.py folder path - /home/gourmetpacman/isd22
	Project Name - pacman
	Project Path - /home/gourmetpacman/isd22/pacman
	virtualenv - pacman-virtulenv
	```
	2. Create a Web app with Manual Config
	- go to the Web tab and create a new web app, 
	- choose the "Manual Configuration" option with the right version of Python (same as in venv).
	3. Enter virtualenv name
	- enter the name of the virtualenv `pacman-virtulenv` in the Virtualenv section on the web tab
	- click "OK"
	4. Edit WSGI file
	Don't change the automatically created file `wsgi.py`. PythonAnywhere ignors this.
	Edit the WSGI file that has a link inside the "Code" section of the Web tab.
	- Click on the WSGI file link, an editor will open where you can change it.
	- Delete everything except the Django section and then uncomment that section. 
	  Your WSGI file should look like this:
	```bash
	# +++++++++++ DJANGO +++++++++++
	# To use your own Django app use code like this:
	import os
	import sys

	# assuming your Django settings file is at '/home/gourmetpacman/isd22/pacman/settings.py'
	path = '/home/gourmetpacman/isd22'
	if path not in sys.path:
	    sys.path.insert(0, path)

	os.environ['DJANGO_SETTINGS_MODULE'] = 'mysite.settings'

	## Uncomment the lines below depending on your Django version
	###### then, for Django >=1.5:
	from django.core.wsgi import get_wsgi_application
	application = get_wsgi_application()
	###### or, for older Django <=1.4
	#import django.core.handlers.wsgi
	#application = django.core.handlers.wsgi.WSGIHandler()
	```
	5. save the file and reload the domain.
	
4.**Database setup**
	- Use the Consoles tab, start a bash console, navigate with `cd` to the directory where the Django project's manage.py is located.
	- run:
		```bash
		./manage.py migrate
		```
	- The website should be live. Just without any design.
5. **Set up static file**
	To get some design into the website we have to set up the static files.

	1. Set STATIC_ROOT in settings.py
		With the STATIC_ROOT variable in settings.py we define the single folder we want to collect all our static files.
		```bash
		STATIC_ROOT = "/home/gourmetpacman/isd22/static"
	2. Collectstatic
		With `python3 manage.py collectstatic` it collects all static files from the pacmanapp, and copies them into `STATIC_ROOT`.
	3. Set up a static files mapping
		Now, set up a static files mapping to get the web server to serve out the static files.
			- Go to the Web tab on the PythonAnywhere dashboard
			- Go to the Static Files section
			- Enter the same URL as STATIC_URL in the url section (/static/)
			- Enter the path from STATIC_ROOT into the path section (/home/gourmetpacman/isd22/static)
		Hit Reload and test the static file mapping by going to retrieve a known static file.
6. **Play the Game**
