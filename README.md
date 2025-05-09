# nextbus
# 🚍 NextBus

**NextBus** is a full-stack bus scheduling and tracking system designed to streamline campus and public transport for students, drivers, and administrators. The system includes live tracking, authentication, feedback, and role-based dashboards.

---

## 🌐 Features

### ✅ User Features
- Login/Register functionality
- View upcoming bus schedules
- Track buses in real-time (Google Maps API)
- Submit feedback
- Book carpool or taxi options (if enabled)

### ✅ Driver Features
- Login/Register functionality
- Start/Stop location sharing
- View assigned routes
- Update location manually or via geolocation
- Access driver-specific dashboard

### ✅ Admin Features
- Secure login access
- Manage users and drivers
- Upload and edit bus schedules
- Monitor feedback
- Control system configurations

---

## 🧭 Tech Stack

### Frontend:
- React.js
- React Router DOM
- Zustand (state management)
- Axios
- Leaflet (for live bus tracking)
- React Hot Toast

### Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

---

## 📁 Project Structure

nextbus/
│
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── middleware/
│ │ └── index.js
│ └── .env
│
├── frontend/
│ ├── src/
│ │ ├── api/
│ │ ├── components/
│ │ ├── hooks/
│ │ ├── pages/
│ │ └── stores/
│ └── public/

yaml
Copy
Edit

---

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- MongoDB (local or Atlas)
- Google Maps API Key

---

### 1. Clone the Repository

```bash
git clone https://github.com/krishmonga/nextbus.git
cd nextbus
2. Backend Setup
bash
Copy
Edit
cd backend
npm install
npm start
Create a .env file with:

env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
3. Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm start
🧪 Sample API Endpoints
Method	Route	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login for user/driver
GET	/api/buses	Fetch bus schedules
POST	/api/feedback	Submit feedback

📌 Future Improvements
Push notifications for upcoming buses

Admin analytics dashboard

QR code-based ticketing

Driver performance tracking

📬 Contact
Made with ❤️ by Krish Monga
📧 krishmonga21667@gmail.com
🔗 LinkedIn  https://www.linkedin.com/in/krish-monga-8b397a2a8/
