# ISD22 :3

ISD22 Project - Pacman

# Group Members

-   Anastassiya Nikitina (project lead)
-   Tobias Thomé
-   Gian-Luca Frisch
-   Kevin Lange

# Pacman Website

-   The app contains a user management where users can register and login
-   The app contains a user profile where the personal data can be edited
-   The app contains a list of top users scores 
-   The main area of the website will be the page for actually playing the game

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

If you have successfully downloaded the code from github, the first thing you have to do is to execute the migration of the project in order to create the database.

```bash
python manage.py migrate
```

Afterwards you can start the development server on your local machine

```bash
python manage.py runserver
```

# Hosting

@sirAdmiral will put the documentation for hosting here
