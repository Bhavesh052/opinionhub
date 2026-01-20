# 🗳️ Opinion Hub

Opinion Hub is a modern, elegant, and user-friendly survey platform designed to bridge the gap between surveyors and participants. Built with a focus on visual excellence and seamless user experience, it allows for the creation of diverse surveys and provides detailed analytics.

## 🚀 Features

- **Dynamic Survey Creation**: Build surveys with multiple question types including single-select, multi-select, short text, and long text.
- **Dual Roles**:
  - **Surveyors**: Create, manage, and analyze surveys.
  - **Participants**: Seamlessly fill out surveys with a clean, distraction-free interface.
- **Real-time Analytics**: View survey responses and statistics at a glance.
- **Responsive Design**: A premium, state-of-the-art interface that works beautifully on any device.
- **Robust Security**: Authentication and role-based access control.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [Prisma](https://www.prisma.io/) with PostgreSQL
- **Styling**: Vanilla CSS & [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Email**: Nodemailer for OTP and notifications

## 🏁 Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [PostgreSQL](https://www.postgresql.org/) database

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Bhavesh052/opinionhub.git
   cd opinionhub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and copy the contents from `env.example`. Fill in your database and SMTP details.
   ```bash
   cp env.example .env
   ```

4. **Initialize the Database**:
   Run the Prisma migrations to set up your database schema.
   ```bash
   npx prisma migrate dev
   ```

### 🏃 Running the Application

- **Development Mode**:
  ```bash
  npm run dev
  ```
  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- **Production Build**:
  ```bash
  npm run build
  ```

- **Start Production Server**:
  ```bash
  npm run start
  ```

## 📜 License

This project is licensed under the MIT License.

---
