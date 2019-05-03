## Live Demo
[ https://boblittle-library.herokuapp.com]

# Bob Library
Build an app that performs CRUD operations on a bookshelf/library.
A user can view books only if they are not logged in.
Logged in user can add, delete, view and edit books.
All users can search for a book via title or genre.

##Getting Started
Clone this repository or download as a zip file


##Prerequisite
Make sure you have `nodejs and npm` installed on your local machine.
You can choose to connect to a local mongoDB serve or use mlab


##Installing
Navigate to project root and run command `npm install` to install all dependencies.
Go to `app.js line 49`, and add your database connection string

##Deployment
U can use `nodemon` or type `node app.js` in your command line
Feel free to use any PaaS. i used Heroku for this deployment

##Tech stack in use:
- ExpressJS
- EJS for frontend. 
- MongoDB

The following are the properties of a book.
- Title
- Author
- Genre
PS: You can use any library for authentication/login.

NB:: the code is well documented

##Author
Big Bob Little

##Lincense
This project is licensed under the MIT License

##Acknowledgments
The template for the work is from colorib

