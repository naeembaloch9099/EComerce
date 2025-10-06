# 🔧 MongoDB Connection Issues - Quick Fix Guide

## 🚨 Error: IP Not Whitelisted

**Error Message**: `Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted.`

### ✅ Quick Fix (2 minutes):

1. **Open MongoDB Atlas**: https://cloud.mongodb.com/
2. **Login** with your credentials
3. **Select your project** (contains Cluster0)
4. **Go to**: `Security` → `Network Access`
5. **Click**: `Add IP Address`
6. **Choose one**:
   - `Add Current IP Address` (automatic detection)
   - `Allow Access from Anywhere` (0.0.0.0/0) - **DEVELOPMENT ONLY**
7. **Save** and wait 1-2 minutes
8. **Restart your server**

### 🔄 Alternative Solutions:

#### Option 1: Use Local MongoDB

```bash
# Install MongoDB locally
# Windows: Download from https://www.mongodb.com/try/download/community
# Then update .env:
MONGODB_URI=mongodb://localhost:27017/rabbit-ecommerce
```

#### Option 2: Use MongoDB Docker

```bash
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Update .env:
MONGODB_URI=mongodb://localhost:27017/rabbit-ecommerce
```

#### Option 3: Check Your IP

Your current IP might have changed. Get your IP from:

- https://whatismyipaddress.com/
- Add this new IP to Atlas whitelist

### 🛠️ Server Status:

- Server will start even without database connection
- Some features may be limited until database is connected
- Fix IP whitelist for full functionality

### 📞 Need Help?

If issues persist:

1. Check your internet connection
2. Verify MongoDB Atlas credentials
3. Ensure cluster is not paused
4. Contact MongoDB Atlas support
