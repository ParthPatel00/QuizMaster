# QuizMaster

AI-powered quiz generation from user-uploaded PDFs.  
📚 Built to help students, educators, enterprises, and lifelong learners test knowledge with ease.

🔗 **Live Demo**: [quizmaster.dedyn.io](https://quizmaster.dedyn.io/)  
💻 **GitHub Repo**: [github.com/ParthPatel00/QuizMaster](https://github.com/ParthPatel00/QuizMaster)

---

## 🚀 Overview

**QuizMaster** is an AI-driven web application that allows users to upload PDF documents—lecture slides, textbooks, articles—and receive personalized quizzes in return. The platform instantly grades answers and offers feedback, supporting repeated attempts and long-term quiz storage.

This project was built as part of CMPE 272 (Spring 2025) at San Jose State University.

---

## 🎯 Key Features

- ✨ Upload any **PDF** (≤ 5MB) and generate custom quizzes instantly
- 🤖 Powered by **Gemini LLM** for content-aware quiz creation
- ✅ **Auto-grading** with visual feedback (green = correct, red = incorrect)
- 🔐 **Authentication via Firebase** (Google login or email/password)
- 📂 **Persistent storage** of past quizzes for signed-in users
- 🔁 **Retake** and reuse quizzes to reinforce learning
- 🧪 Tested with **Vitest** and built using **Agile methodology**

---

## 🧑‍💻 Tech Stack

| Layer        | Technologies Used                                                                 |
|--------------|------------------------------------------------------------------------------------|
| **Frontend** | React, TypeScript, Tailwind CSS                                                   |
| **Backend**  | AWS Lambda, API Gateway                                                           |
| **LLM**      | Google Gemini                                                                     |
| **Storage**  | Amazon S3 (PDFs), DynamoDB (quiz metadata)                                        |
| **Auth**     | Firebase Authentication (Google/email login)                                     |
| **CI/CD**    | GitHub Actions, AWS CodePipeline, CodeDeploy, EC2 (Nginx reverse proxy + SSL)    |
| **Testing**  | Vitest                                                                             |

---

## 🧭 Architecture

![Architecture Diagram](https://github.com/ParthPatel00/QuizMaster/assets/architecture.png) <!-- Replace with actual image link if desired -->

**Workflow Summary**:
1. User uploads a PDF → stored in **S3**
2. Triggered **Lambda** parses the file and sends prompt to **Gemini**
3. Gemini responds with JSON quiz → stored in **DynamoDB**
4. Frontend polls DynamoDB using **API Gateway** until quiz is ready
5. UI renders questions; user attempts and receives feedback

---

## 🧪 Testing Highlights

Used **Vitest** to test:
- File upload constraints
- Error handling (e.g., invalid file type or missing name)
- DynamoDB GET operations
- Exponential polling retries when quiz generation is pending

> Run locally with: `npx vitest`

---

## ⚙️ Deployment

- Deployed on **AWS EC2** (Ubuntu, Nginx, SSL via Certbot)
- Configured **domain name**: `quizmaster.dedyn.io`
- CI/CD pipeline using **GitHub → CodePipeline → CodeDeploy**
- Scripts automate full lifecycle: clean build, install, deploy, restart

---

## 🧠 Engineering Challenges

- **Prompt engineering** to handle noisy, diverse PDF input
- **Exponential polling** to sync with async LLM response times
- **State persistence** with conditional flows (auth vs guest mode)
- **Security**: authenticated access to saved content, API authorization
- **Cost-efficiency**: leveraged AWS free tier + serverless architecture

---

## 👥 Team & Contributions

| Name                   | Major Contributions                                          |
|------------------------|--------------------------------------------------------------|
| **Parth Patel**        | Frontend development, quiz fetch backend, authentication     |
| **Shailen Sutradhar**  | Lambda (upload), AWS provisioning, requirements              |
| **Dev Patel**          | CI/CD, EC2, SSL setup, GitHub Actions                        |
| **Gautam Thampy**      | Gemini integration, LLM prompt engineering                   |

---

## 📎 Useful Links

- 🔗 [Live App](https://quizmaster.dedyn.io/)
- 📁 [Project Report (PDF)](./QuizMaster%20-%20ProjectReport.pdf)
- 📂 [Lucidchart Architecture](https://lucid.app/) *(link placeholder)*
- 📖 [AWS Glossary](https://docs.aws.amazon.com/glossary/latest/reference/glos-chap.html)

---

## 📌 Future Enhancements

- Support for larger file sizes
- Enhanced quiz formats (short answer, drag-and-drop)
- Admin analytics dashboard
- AI-based question quality evaluation
- Real-time collaboration & multiplayer quiz mode

---

## 📝 License

This project was built for academic use. For licensing inquiries, please contact the maintainers.
