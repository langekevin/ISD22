# ISD22

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

# Login Page

This is the HTML code for a login page for a web application. It includes a form for users to enter their login credentials, as well as a submit button to send the form data to the server.
HTML Structure
The login page consists of a form element with input elements for the username and password fields, and a button element for the submit button.
The form element has an action attribute that specifies the URL to which the form data will be sent, and a method attribute that specifies the HTTP method to use (in this case, POST).
The input elements for the username and password fields have type attributes set to text and password, respectively, as well as name attributes that will be used to identify the fields when the form is submitted.
The button element has a type attribute set to submit and a label that will be displayed on the button.
CSS Styles
The login page includes some basic CSS styles to provide layout and formatting for the form elements.
The form element is given a max-width and centered on the page using the margin: 0 auto rule.
The input elements are given a width and padding, and the button element is given a background-color and color.
JavaScript Functionality
The login page includes a simple JavaScript function to handle form submission. When the form is submitted, the function is called and performs basic validation on the form data, ensuring that the username and password fields are not empty. If the form data is invalid, an error message is displayed to the user. If the form data is valid, the form is submitted to the server for processing.

# Registration Page
This is the HTML code for a registration page for a web application. It includes a form for users to enter their personal and account information, as well as a submit button to send the form data to the server.
HTML Structure
The registration page consists of a form element with input elements for the various fields, and a button element for the submit button.
The form element has an action attribute that specifies the URL to which the form data will be sent, and a method attribute that specifies the HTTP method to use (in this case, POST).
The input elements for the fields have type attributes and name attributes that correspond to the type of data being entered and the purpose of the field, respectively. For example, the input element for the email field has a type attribute set to email and a name attribute set to email.
The button element has a type attribute set to submit and a label that will be displayed on the button.
CSS Styles
The registration page includes some basic CSS styles to provide layout and formatting for the form elements.
The form element is given a max-width and centered on the page using the margin: 0 auto rule.
The input elements are given a width and padding, and the button element is given a background-color and color.
JavaScript Functionality
The registration page includes a simple JavaScript function to handle form submission. When the form is submitted, the function is called and performs validation on the form data, ensuring that all required fields are filled out and that the email address is in a valid format. If the form data is invalid, an error message is displayed to the user. If the form data is valid, the form is submitted to the server for processing.
