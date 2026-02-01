# 🔧 Login Issue - Complete Fix Guide

## Quick Fix (Try This First!)

### Step 1: Restart Backend Server

**In your backend terminal** (where `npm run dev` is running):

1. Press `Ctrl + C` to stop the server
2. Wait for it to stop completely
3. Run: `npm run dev`
4. Wait for "Server running on port 5000" message

### Step 2: Create/Verify Admin Account

**In a NEW terminal** (keep backend running):

```bash
cd "e:\tnpsc website\backend"
node test-login.js
```

This will:
- ✅ Create admin user if missing
- ✅ Reset password to "admin123"
- ✅ Verify password works
- ✅ Show all users

### Step 3: Clear Browser Data

1. Open your browser
2. Press `F12` (DevTools)
3. Go to **Application** tab
4. Under **Storage**, click **Clear site data**
5. Refresh the page (`Ctrl + R`)

### Step 4: Try Login

Go to: `http://localhost:3000/login`

**Credentials:**
- Email: `admin@bookstore.com`
- Password: `admin123`

---

## If Still Not Working

### Check 1: Is Backend Running?

Open in browser: `http://localhost:5000/api/health`

**Should see:**
```json
{
  "success": true,
  "message": "Server is running",
  ...
}
```

**If you see an error:**
- Backend is not running
- Restart it: `cd "e:\tnpsc website\backend"` then `npm run dev`

### Check 2: Check Browser Console

1. Press `F12`
2. Go to **Console** tab
3. Try logging in
4. Look for errors (red text)

**Common errors:**

**"Network Error"** or **"ERR_CONNECTION_REFUSED"**
- Backend is not running
- Solution: Start backend with `npm run dev`

**"Invalid credentials"**
- Wrong email/password
- Solution: Run `node test-login.js` to reset password

**"User not found"**
- Admin account doesn't exist
- Solution: Run `node test-login.js` to create it

### Check 3: Test Login Directly

Open a new terminal and run:

```bash
cd "e:\tnpsc website\backend"
```

Then run this PowerShell command:

```powershell
$body = @{
    email = "admin@bookstore.com"
    password = "admin123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
```

**If successful, you'll see:**
```
success  : True
message  : Login successful
token    : eyJhbGc...
user     : @{id=...; name=Admin; email=admin@bookstore.com; role=admin}
```

**If it fails:**
- Backend has an issue
- Check backend terminal for errors

---

## Create Your Own Admin Account

If you want to use a different email:

### Option 1: Sign Up Then Promote

1. Go to `http://localhost:3000/signup`
2. Create account with your email
3. Run this in backend terminal:

```bash
node
```

Then paste (replace YOUR_EMAIL):

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore').then(async () => {
  const user = await User.findOne({ email: 'YOUR_EMAIL@example.com' });
  if (user) {
    user.role = 'admin';
    await user.save();
    console.log('✅ You are now an admin!');
  } else {
    console.log('❌ User not found');
  }
  process.exit(0);
});
```

Press `Enter` twice, then `Ctrl + D`

### Option 2: Create Directly

Run:

```bash
node
```

Then paste (replace with your details):

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookstore').then(async () => {
  const user = await User.create({
    name: 'Your Name',
    email: 'your.email@example.com',
    password: 'yourpassword',
    role: 'admin',
    isActive: true
  });
  console.log('✅ Admin created!');
  console.log('Email:', user.email);
  console.log('Password: yourpassword');
  process.exit(0);
});
```

---

## Debugging Checklist

- [ ] Backend server is running (`npm run dev` in backend folder)
- [ ] Frontend server is running (`npm run dev` in frontend folder)
- [ ] Ran `node test-login.js` successfully
- [ ] Cleared browser cache and localStorage
- [ ] Using correct email: `admin@bookstore.com`
- [ ] Using correct password: `admin123`
- [ ] No errors in browser console (F12)
- [ ] Backend health check works: `http://localhost:5000/api/health`

---

## Still Having Issues?

**Share with me:**

1. **Error message** you see (screenshot or copy-paste)
2. **Browser console errors** (F12 → Console tab)
3. **Backend terminal output** (any red errors?)
4. **Output of:** `node test-login.js`

I'll help you fix it! 🚀
