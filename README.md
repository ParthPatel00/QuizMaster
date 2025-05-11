# QuizMaster

Idea: Quiz making platform AKA QuizMaster

From a user's POV:
A user should be able to create an account, or continue as guest. They should be able to upload a pdf
document such as typed notes, lecture slides, textbook chapters etc. and provide a name for the quiz
to be generated This data should be fed in an AI model such as ChatGPT, Cohere, or Deepseek. Within a
reasonable amount of time, a quiz should be generated for them. The quiz should contain a series of
questions, all visible to the user at once. Each question should be multiple
choice questions with 4 options, with only 1 being the correct option. The user should be able to complete
thequiz and submit it. Once submitted, the evalation of the quiz should be presented to the user. Questions should
be highlighted green or red based on correct and incorrect answers. A retake feature should also exist for the
user in case they want to retake the quiz. If the user has created an account.

# QuizMaster

QuizMaster is an AI-powered quiz generation platform that takes in PDF documents (e.g., notes or lecture slides) and produces customized multiple-choice quizzes. This guide explains how to set up the application locally for development and deploy it to the cloud.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Cloud Deployment](#cloud-deployment)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Scripts](#scripts)
- [Additional Resources](#additional-resources)

---

## Prerequisites

- **Node.js** (v16 or later) and **npm** installed
- For authentication, a configured [Firebase](https://firebase.google.com/docs) project
- (Optional) AWS CLI configured if deploying to AWS
- (Optional) Jenkins for your CI/CD pipeline

---

## Local Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies for the frontend:**

   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

---

## Cloud Deployment

### Using AWS CodeDeploy

- The repository contains an `appspec.yml` file along with several bash scripts located in the `scripts` folder:
  - **clean_old.sh:** Clears old deployment files.
  - **deploy.sh:** Installs dependencies, builds the frontend, and copies the production files.
  - **build_frontend.sh:** Installs dependencies, builds assets, and deploys them.
  - **restart_nginx.sh:** Restarts Nginx to serve the updated build.
- Ensure your target server (e.g., Ubuntu) has Node.js, npm, and Nginx installed and that AWS CodeDeploy is properly configured.
- Deployment steps (executed by CodeDeploy) include cleaning, deploying, building, and restarting Nginx.

### Using Jenkins

- The `Jenkinsfile` in the root defines a pipeline with the following stages:
  - **Checkout:** Checks out code from your repository.
  - **Build:** Installs dependencies and runs the build process.
  - **Deploy:** Copies build artifacts to the server and reloads Nginx.
- Update any server paths or settings in the `Jenkinsfile` as needed.

---

## Project Structure

- **frontend/**  
  Contains the React + TypeScript client application.
  - `src/`: Application source code (pages, components, services, hooks).
  - `vite.config.ts`: Vite configuration.
  - `package.json`: Frontend dependency and script definitions.
  
- **scripts/**  
  Contains bash scripts for deployment:
  - `clean_old.sh`
  - `deploy.sh`
  - `build_frontend.sh`
  - `restart_nginx.sh`

- **appspec.yml**  
  AWS CodeDeploy configuration file.

- **Jenkinsfile**  
  Defines the Jenkins CI/CD pipeline.

- **LambdaFunctions/**  
  Placeholder for AWS Lambda functions.

- **Non-technical/**  
  Contains non-technical project documents and collaboration links.

---

## Development Workflow

- **Coding:** Modify components in `frontend/src/` as needed.
- **Testing:** Use your IDE and browser for live development with HMR.
- **Linting:** Check your code with:

  ```bash
  npm run lint
  ```

- **Production Build:** Create a production build using:

  ```bash
  npm run build
  ```

- **Deployment:** Cloud deployment runs the scripts in `/scripts` as defined in `appspec.yml` or through the Jenkins pipeline.

---

## Scripts

- **Local development:** `npm run dev`
- **Build production assets:** `npm run build`
- **Deployment Scripts:**  
  Executed during CI/CD:
  - `clean_old.sh` cleans previous deployments.
  - `deploy.sh` installs and deploys the build.
  - `build_frontend.sh` builds and copies files to the server.
  - `restart_nginx.sh` restarts the Nginx server.

---

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://reactjs.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [AWS CodeDeploy Documentation](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployments.html)
- [Jenkins Documentation](https://www.jenkins.io/doc/)

---

Happy coding!