
# Password Reset Backend

This project is a backend for a password reset flow, built with Node.js, Express.js, MongoDB, and Nodemailer. It supports user signup, login, password reset, and sending emails for the reset link.

## Features

- User Signup
- User Login
- Password Reset
- Send Reset Link via Email

## Installation

### Prerequisites

- Node.js
- MongoDB
- Nodemailer for email functionality

### Steps to Set Up

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/password-reset-backend.git
   cd password-reset-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the project and add the following variables:

   ```env
   MONGO_URI=your-mongodb-uri
   EMAIL_USER=your-email-address
   EMAIL_PASSWORD=your-email-password
   JWT_SECRET=your-jwt-secret
   CLIENT_URL=http://localhost:3000  # or your production URL
   ```

4. Run the app:
   ```bash
   npm start
   ```

5. The app should now be running at `http://localhost:5000`.

## API Endpoints

### `POST /signup`
- Description: Registers a new user.
- Request Body: `{ "email": "user@example.com", "password": "password123" }`
- Response: `{ "message": "User registered successfully" }`

### `POST /login`
- Description: Logs in a user.
- Request Body: `{ "email": "user@example.com", "password": "password123" }`
- Response: `{ "message": "Login successful" }`

### `POST /forgot-password`
- Description: Sends a password reset link to the user's email.
- Request Body: `{ "email": "user@example.com" }`
- Response: `{ "message": "Password reset link sent to email" }`

### `POST /reset-password/:token`
- Description: Resets the user's password using the token.
- Request Body: `{ "newPassword": "newpassword123" }`
- Response: `{ "message": "Password reset successful" }`

## Deployment

This application is ready to be deployed using services like Heroku, Render, or any other cloud hosting.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
