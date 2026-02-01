# 🗄️ How to Change Database to Your Own

## Current Database Configuration

Your app is currently using:
```
mongodb://localhost:27017/bookstore
```

This is a **local MongoDB** database on your computer.

---

## Option 1: Use MongoDB Atlas (Cloud Database) ⭐ Recommended

MongoDB Atlas is a **free cloud database** that's perfect for production.

### Step 1: Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free (no credit card needed)
3. Create a free cluster (M0 Sandbox - FREE forever)

### Step 2: Get Your Connection String

1. In MongoDB Atlas dashboard, click **"Connect"**
2. Choose **"Connect your application"**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/bookstore?retryWrites=true&w=majority
   ```

### Step 3: Update Your .env File

1. Open: `e:\tnpsc website\backend\.env`
2. Find the line: `MONGODB_URI=mongodb://localhost:27017/bookstore`
3. Replace it with your Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/bookstore?retryWrites=true&w=majority
   ```
4. **Important:** Replace `<password>` with your actual database password
5. Save the file

### Step 4: Restart Backend

```bash
# Stop backend (Ctrl + C)
# Then restart:
npm run dev
```

---

## Option 2: Use Different Local Database

If you want to use a different local MongoDB database:

### Step 1: Update .env File

Open: `e:\tnpsc website\backend\.env`

Change:
```env
# From:
MONGODB_URI=mongodb://localhost:27017/bookstore

# To (replace with your database name):
MONGODB_URI=mongodb://localhost:27017/YOUR_DATABASE_NAME
```

### Step 2: Restart Backend

```bash
npm run dev
```

---

## Option 3: Use MongoDB with Authentication

If your MongoDB requires username/password:

### Update .env File

```env
MONGODB_URI=mongodb://username:password@localhost:27017/bookstore?authSource=admin
```

Replace:
- `username` - Your MongoDB username
- `password` - Your MongoDB password
- `bookstore` - Your database name

---

## Option 4: Use Remote MongoDB Server

If you have MongoDB on another server:

### Update .env File

```env
MONGODB_URI=mongodb://your-server-ip:27017/bookstore
```

Or with authentication:
```env
MONGODB_URI=mongodb://username:password@your-server-ip:27017/bookstore
```

---

## Quick Setup Script

I'll create a script to help you configure your database:

**Run this in backend folder:**

```bash
node setup-database.js
```

This will:
1. Ask for your database connection string
2. Update the .env file
3. Test the connection
4. Create admin user

---

## After Changing Database

### 1. Restart Backend Server

```bash
# In backend terminal
# Press Ctrl + C to stop
npm run dev
```

### 2. Create Admin User

```bash
node create-admin.js
```

This creates the admin account in your new database.

### 3. Verify Connection

Open in browser:
```
http://localhost:5000/api/health
```

Should show:
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## Troubleshooting

### Error: "MongoServerError: Authentication failed"

**Solution:** Check your username and password in the connection string

### Error: "MongooseServerSelectionError: connect ECONNREFUSED"

**Solution:** 
- MongoDB is not running
- Wrong IP address or port
- Firewall blocking connection

### Error: "MongoParseError: Invalid connection string"

**Solution:** Check your connection string format

---

## Example Connection Strings

### Local MongoDB (Default)
```
mongodb://localhost:27017/bookstore
```

### MongoDB Atlas (Cloud)
```
mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/bookstore
```

### Local with Auth
```
mongodb://admin:password@localhost:27017/bookstore?authSource=admin
```

### Remote Server
```
mongodb://192.168.1.100:27017/bookstore
```

### Multiple Hosts (Replica Set)
```
mongodb://host1:27017,host2:27017,host3:27017/bookstore?replicaSet=myReplicaSet
```

---

## What Database Do You Want to Use?

**Tell me:**
1. **MongoDB Atlas (Cloud)** - I'll guide you through setup
2. **Local MongoDB** - Different database name
3. **Remote MongoDB** - You have a server
4. **Other** - Describe your setup

I'll help you configure it! 🚀
