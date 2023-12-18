# Server side for QuizWiz

## Project description

The backend system is developed for QuiWiz, an educational application designed to aid students in revising and enhancing their knowledge. The platform facilitates note-taking and engages users in AI-generated quizzes based on their notes. These quizzes are presented as multiple-choice questions, supporting various subjects for study and revision.

The application utilizes the MongoDB database system to manage and store a wide range of information. This includes historical records of questions and corresponding answers, user scores, notes, and user registration details. These components collectively contribute to the functionality and data management within the QuiWiz application.

## Installation and Setup

Clone the repository and cd into it:

```bash
git clone <repository_url> && cd $_
```
Next you need to Install Dependencies by typing this in the terminal:

```bash
npm install
```
Create a .env file in the root of the API folder :

```bash
echo -e "PORT=3000 \nDB_URL='connection-string'" > .env
```
Replace connection-string with the connection string to your mongo database.

## How to use

start the API:

```bash
 npm run dev
```
you can open the API by going to this link after it starts:

http://localhost:3000

### Routes

#### Users
| Method | Endpoint              | Description                                                |
|--------|-----------------------|------------------------------------------------------------|
| POST   | `/users/register`     | User registration route. Expects user registration data in the request body. |
| POST   | `/users/login`        | User login route. Expects user login credentials (e.g., email and password) in the request body. |
| GET    | `/users/logout`       | User logout route. Handles user logout process, typically by clearing sessions or tokens. |

#### Subjects
| Method | Endpoint              | Description                                                |
|--------|-----------------------|------------------------------------------------------------|
| GET    | `/subject/`           | Retrieve all subjects.                                      |
| POST   | `/subject/`           | Create a new subject. Expects subject data in the request body. |
| PATCH  | `/subject/:id`        | Update an existing subject by ID. Expects updated subject data in the request body. |

#### Scores
| Method | Endpoint                 | Description                                                |
|--------|--------------------------|------------------------------------------------------------|
| GET    | `/score/`                | Retrieve all scores.                                       |
| GET    | `/score/token/:token`    | Show score by token.                                       |
| GET    | `/score/subject/:subject`| Show score by subject.                                     |
| POST   | `/score/`                | Create a new score. Expects score data in the request body. |
| PATCH  | `/score/:token`          | Update score by token. Expects updated score data in the request body. |

#### Notes
| Method | Endpoint        | Description                                                  |
|--------|-----------------|--------------------------------------------------------------|
| GET    | `/note/`        | Retrieve all notes.                                          |
| POST   | `/note/`        | Create a new note. Expects note data in the request body.     |
| GET    | `/note/:id`     | Show a specific note by ID.                                  |
| PATCH  | `/note/:id`     | Update a specific note by ID. Expects updated note data in the request body. |
| DELETE | `/note/:id`     | Delete a specific note by ID.                                |

#### Answers
| Method | Endpoint        | Description                                            |
|--------|-----------------|--------------------------------------------------------|
| GET    | `/answer/:id`   | Show answers by question ID.                            |
| POST   | `/answer/`      | Create a new answer. Expects answer data in the request body. |

## contributers

<a href="https://github.com/nine96as/reddy31_server/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=nine96as/reddy31_server" />
</a>
