# Personal Finance Manager

A full-stack MERN (MongoDB, Express, React, Node.js) web application designed to help users track their daily expenses, visualize their spending habits, and manage their budget securely.

## 🚀 Features
* **User Authentication:** Secure JWT-based login and registration.
* **Protected Routes:** Only logged-in users can view and manage their specific data.
* **Expense Tracking:** Add, view, and categorize transactions in real-time.
* **Data Visualization:** Interactive Chart.js integration for expense distribution.
* **Responsive UI:** Clean, modern interface built with Tailwind CSS.

## 💻 Tech Stack
* **Frontend:** React.js, Vite, Tailwind CSS, Chart.js, Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Security:** JSON Web Tokens (JWT), bcryptjs

## ⚙️ How to Run Locally
1. Clone the repository
2. Run `npm install` inside both the `frontend` and `backend` folders.
3. Create a `.env` file in the backend with your `MONGO_URI` and `JWT_SECRET`.
4. Run `npm run dev` in both folders.