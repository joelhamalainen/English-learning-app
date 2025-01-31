# English-learning-app
Backend - Project Work 2024

This is the final project of the course, where the assignment was to make a full stack application. 
The topic is an English learning application. The application can be used to teach foreign words to children, for example. 
The application contains a database where words are stored in both in native language and their translation (in this case Finnish and English).

## Features
The application has two roles, Teacher and Student. 

![image](https://github.com/user-attachments/assets/af8da232-0390-4289-b73c-5169e0a26d62)

In the Teacher role, you can add, edit, and delete words. The view has two tables (words and tags). The application supports tags so student can filter the words to be practiced.

![image](https://github.com/user-attachments/assets/3f19965e-f3df-4cb2-bf3c-9ebf4d8d7ce1)
![image](https://github.com/user-attachments/assets/12781fc3-e5c9-43a8-b04f-1c8d50dd2b0a)

In the Student role, user can practise words by entering translations for the words displayed. The application calculates the score based on how many words the user got right.

![image](https://github.com/user-attachments/assets/7939a83d-4362-40d8-a8e4-c583cdb21b45)

## Technologies
- The frontend of the application is made with React and the backend with Express with Node.js.
- JavaScript is used as the language.
- SQLite is used as the database. 

## How to use?
You can try the app at:
https://learn-english-app-9uwf.onrender.com/

Or download the project to your computer:
```bash
git clone https://github.com/joelhamalainen/English-learning-app

cd english-learning-app

npm install

npm run start
```
The teacher role requires a password, which is 'admin' by default.
