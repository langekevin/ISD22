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

@sirAdmiral will put the documentation for hosting here

# Hosting

How the Website ist hosted with AWS EC2, Ubuntu and Apache2.

1. **Set up an Instance**
	- Go to the AWS Management Console and log in to your AWS account.
	- Navigate to the EC2 dashboard.
	- Click the "Launch Instance" button.
	- Name the instance.
	- Select an Ubuntu AMI.
	- Choose an instance type (here we use the free tier).
	- Create and/or choose a new key pair. (.ppk) **Keep it safe!**
	- Configure Security Group
		- Add Custom TCP-Rule; with Port Range 8000 (Django); Source 0.0.0.0/0 ::0 (every computer can access)
		- Add HTTP; Port Range 80; Source 0.0.0.0/0 ::0 (every computer can access)
		- Add HTTPS; Port Range 422; Source 0.0.0.0/0 ::0 (every computer can access) 
	- Click the "Launch" button, and then launch the instance.

2. **Elastic IP**
	- Navigate to the EC2 Tab "Elasitic IP".
	- Generate an Elastic IP.
	- Associate Elastiv IP to the instance.

3. **Recommended: Connect to EC2**
	- Use PuTTY (Windows) as a Terminal Program. Or use the browser version in EC2.
	- Use WinSCP (Windows) to transfer files directly into the instance.
	- You need the public IP (Elastic IP).
	- and the private key file (.ppk). Place it into Autentification (SSH-Authenification).
	- Username "ubuntu"

4. **Install Apache**
	Apache2 and mod_wsgi on your EC2 instance:
	```bash
	sudo apt update
	sudo apt install apache2 libapache2-mod-wsgi-py3

	# Start the server and check with the public IP
	sudo service apache2 start
	```
	Necessary commands for Apache:
	```bash
	sudo service apache2 start
	sudo service apache2 stop
	sudo service apache2 restart
	```
5. **Upload Project**
	Drag and Drop with/in WinSCP.
	(Everything in ISD22-main in an additional folder 'PacmanProject')

6. **Install Django*
	1. Check the python version.
	```bash
	python3
	# output: installed pythen version (3.10.6).
	exit()
	```
	2. Install pip. To get python packages like Django, Pandas, ... And install Django.
	```bash
	sudo apt update
	sudo apt install python3-pip
	# check the version:
	pip3 --version
	# output: pip 22.0.2 from /usr/lib/python3/dist-packages/pip (python 3.10)
	pip3 install django
	```
	3. Install virtual inviroment.
	```bash
	sudo apt install python3-venv
	```
	4. Create and open virtual invirement (venv).
	First open the Django project. Afterwards create the venv in the Django and open it. So it can be activated.
	```bash
	ls
	# output: ISD22-main
	cd ISD22-main
	python3 -m venv pacman_env
	ls
	ls pacman_env/
	ls pacman_env/bin/
	source pacman_env/bin/activate
	```
	5. Changes in settings.py 
	```bash
	cd PacmanProject/
	ls
	# Output: LICENSE  README.md  Untitled.ipynb  manage.py  pacman  pacmanapp  requirements.txt
	vi pacman/settings.py
	```
	Make the change in ALOWED_HOSTS - fill in the public IP (Elastic IP)
	go out of the change with the command: `:wq`
	
	6. Check if it works.
	```bash
	python3.10 manage.py runserver 0.0.0.0:8000
	```
	The website should be seen with your publicIP and 8000 in the end.

7. **Directories**
	List the Django project's name and path, application name and path, environment's location path, and WSGI file path.
	
	```<txt>
	Directories
	
	Folder Name - /home/ubuntu/ISD22-main
	
	Project Name - PacmanProject
	Project Path - /home/ubuntu/ISD22-main/PacmanProject

	Application Path - pacmanapp
	Application Path - /home/ubuntu/ISD22-main/PacmanProject/pacmanapp

	Environment Folder Path - /home/ubuntu/ISD-main/pacman_env
	Wsgi File Path - /home/ubuntu/ISD22-main/PackmanProject/pacman/wsgi.py

	```
8. **Add Static Files variables in Settings.py**
	Django provides a mechanism for collecting static files into one place so that they can be served easily.
	Open `Settings.py` using the console or WinSCP.
	`vi ISD22-main/PacmanProject/pacman/settings.py`
	```<python>
	# Add below code in settings.py file
	import os 

	STATIC_URL = '/static/' 
	STATIC_ROOT = os.path.join(BASE_DIR, "static/") 
	STATICFILES=[STATIC_ROOT]
	```
	Leave the file with `:wq`

9. **Migrate Django and Collect Static**
	Use the `makemigration`, `migrate` and `collectstatic` commands.
	```console
	source ISD22-main/pacman_env/bin/activate
	python3 ISD22-main/PacmanProject/manage.py makemigrations
	python3 ISD22-main/PacmanProject/manage.py migrate
	python3 ISD22-main/PacmanProject/manage.py collectstatic
	```

10. **Change Permission and ownership
	Change the permissions of the SQLite file. Also, change the ownership of the Django project folders.

	The following commands will change the permission and ownership of the files and folders.
	```bash
	chmod 664 ~/ISD22-main/PacmanProject/db.sqlite3

	sudo chown :www-data ~/ISD22-main/PacmanProject/db.sqlite3
	sudo chown :www-data ~/ISD22-main/PacmanProject
	sudo chown :www-data ~/ISD22-main/PacmanProject/pacman
	
	deactivate
	```

11. **Changes in Apache Config File**
	A few changes in the `000-default.conf` file. Before that, make a backup. 
	```console
	# Go to the location - 
	cd /etc/apache2/sites-available

	# Take a backup of file
	sudo cp 000-default.conf 000-default.conf_backup

	# Open conf file using Vi
	sudo vi 000-default.conf
	```

	Add the following code to the file:
	```xml
	Alias /static /home/ubuntu/ISD22-main/PacmanProject/static

	<Directory /home/ubuntu/ISD22-main/PacmanProject/static>
		Require all granted
	</Directory>
	
	<Directory /home/ubuntu/ISD22-main/PacmanProject/pacman>
		<Files wsgi.py>
			Require all granted
		</Files>
	</Directory>

	WSGIPassAuthorization On
	WSGIDaemonProcess PacmanProject python-path=/home/ubuntu/ISD22-main/PacmanProject/ python-home=/home/ubuntu/ISD22-main/pacman_env
	WSGIProcessGroup PacmanProject
	WSGIScriptAlias / /home/ubuntu/ISD22-main/PackmanProject/pacman/wsgi.py
	```
	Make changes of the path if neccessary.

12. **Enable the Site and wsgi mod in Apache**
	Enable the conf file using `a2ensite`.
	```bash
	cd /etc/apache2/sites-available/
	
	sudo a2ensite 000-default.conf
	```
	use `sudo a2enmod wsgi`
	and then restart the server with `sudo service apache2 restart`.
