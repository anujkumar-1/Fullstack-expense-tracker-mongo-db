
# **Expense Tracker App** 💰📊

A smart and simple way to manage your finances — track income and expenses, view detailed reports for daily, weekly, monthly, and yearly spending, and download your data as a PDF.

---

## **🚀 Features**

* **Add Income & Expenses** – Record transactions with category-based organization.
* **Category Management** – Categorize expenses (e.g., Food, Travel, Shopping, Bills).
* **Detailed Tracking** – View:

  * **Daily** expenses
  * **Weekly** expenses
  * **Monthly** expenses
  * **Yearly** expenses
* **Financial Overview** – Instantly see:

  * **Total Income**
  * **Total Expense**
  * **Net Remaining Income**
* **PDF Export** – Download your expense report as a PDF, including:

  * Summary (Income, Expense, Net Balance)
  * Full list of transactions
* **User Authentication** – Secure login and signup using JWT.
* **Mobile-Responsive** – Works perfectly on desktop and mobile devices.

---

## **🛠 Tech Stack**

**Frontend**

* HTML (User Interface)
* CSS  (Styling)
* Javascript (Logic)

**Backend**

* Node.js + Express.js (API Server)
* Mongo-DB
* Axios
  

**Other Tools**

* JWT (Authentication)
* PDFKit (Generate PDF reports)
* Git & GitHub (Version Control)

---

## **📦 Installation & Setup**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/anujkumar-1/expense-tracker.git
   cd expense-tracker
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root folder and add:

   ```env
   DB_HOST=your_mysql_host
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=expense_tracker_db
   JWT_SECRET=your_jwt_secret
   ```

4. **Run Database Migrations**

   ```bash
   npx sequelize db:migrate
   ```

5. **Start the App**

   ```bash
   npm start
   ```

   or for development:

   ```bash
   npm run dev
   ```

---

## **📸 Screenshots**

*(Add screenshots or GIFs of the app here)*

---

## **🤝 Contributing**

We welcome contributions!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature-name`)
5. Open a Pull Request

---

## **📜 License**

This project is licensed under the **MIT License** — you’re free to use and modify it.

---

## **📬 Contact**

For queries or collaboration:
📧 **[anuj39263@gmail.com](mailto:anuj39263@gmail.com)**
🔗 [GitHub Profile](https://github.com/anujkumar-1)

---

If you want, I can make a **PDF export feature flow diagram** for this README so it visually explains how the expense data turns into a downloadable report — that would make your GitHub page stand out more.
