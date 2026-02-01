# Admin Login Credentials

## Default Admin Account

**Email:** `admin@bookstore.com`  
**Password:** `admin123`  
**Role:** Admin

## How to Create/Reset Admin Account

Run this command in the backend directory:

```bash
node create-admin.js
```

This will:
- Create an admin user if it doesn't exist
- Update existing user to admin role if needed
- Display all users in the database

## If Login Still Fails

### 1. Check if admin exists:
```bash
node create-admin.js
```

### 2. Clear browser cache and localStorage:
- Open browser DevTools (F12)
- Go to Application tab
- Clear Local Storage
- Clear Cookies
- Refresh page

### 3. Try logging in with:
- **Email:** admin@bookstore.com
- **Password:** admin123

### 4. Check browser console for errors:
- Open DevTools (F12)
- Go to Console tab
- Look for any error messages

## Creating a New Admin User

If you want to create a different admin account, you can:

1. **Sign up normally** on the website
2. **Run this MongoDB command** to make that user an admin:

```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Troubleshooting

### "Invalid credentials" error:
- Double-check email and password
- Make sure caps lock is off
- Try copy-pasting the credentials

### "Account is deactivated" error:
- Run: `node create-admin.js` to reactivate

### Network error:
- Make sure backend is running on port 5000
- Check if `http://localhost:5000/api/health` works

## Current Users

To see all users in your database, run:
```bash
node create-admin.js
```

It will list all users with their emails and roles.
