# ReadySip ☕

ReadySip is a premium, full-stack MERN application designed for high-traffic cafes (like those in Bangalore). It allows customers to "skip the wait" by ordering ahead and arriving at the cafe just as their brew is ready.

## 🚀 Key Features

### For Customers
- **Order Ahead**: Browse a beautiful menu of artisan teas, craft coffees, and fresh juices.
- **Timed Pickups**: Choose your arrival time for the perfect experience.
- **Real-time Notifications**: Track order status (Pending → Accepted → Ready) via Socket.io and SMS (Twilio).
- **Dual Feedback System**: Rate specific items and share your overall cafe experience.
- **Seamless Auth**: Login via Email/OTP or Google OAuth.
- **Secure Payments**: Integrated with Razorpay for effortless transactions.

### For Administrators
- **Dynamic Dashboard**: Real-time order management with Socket.io alerts.
- **Product Management**: Full CRUD for menu items with image uploads (Cloudinary).
- **Analytics**: Track daily orders, revenue, and customer feedback.
- **Order Flow Control**: Accept, complete, or cancel orders with a single click.

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Redux Toolkit, Framer Motion.
- **Backend**: Node.js, Express.js, TypeScript, MongoDB (Mongoose).
- **Real-time**: Socket.io for instant updates between Admin and Customer.
- **Storage**: Cloudinary for product image management.
- **Payments**: Razorpay API integration.
- **Communication**: Twilio SMS and Nodemailer (SMTP) for OTPs.

## 🏗 Architecture

The project follows a **Layered Architecture** and **SOLID principles** to ensure maintainability and testability:
- **Interfaces**: Decoupled layers using TypeScript interfaces for Dependency Inversion.
- **Controllers**: Handle HTTP requests and response logic.
- **Services**: Contain core business logic.
- **Repositories**: Encapsulate database access logic.
- **Models**: Mongoose schemas and TypeScript types.

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB
- Cloudinary, Razorpay, Twilio, and Google Cloud Console accounts

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the environment requirements:
   ```env
   PORT=4000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_name
   RAZORPAY_KEY_ID=your_key
   SMTP_HOST=your_smtp
   GOOGLE_CLIENT_ID=your_google_id
   TWILIO_ACCOUNT_SID=your_sid
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:4000/api
   VITE_GOOGLE_CLIENT_ID=your_google_id
   VITE_RAZORPAY_KEY_ID=your_key
   ```
4. Start the Vite dev server:
   ```bash
   npm run dev
   ```

---
Built with ❤️ for a better café experience.