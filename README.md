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
