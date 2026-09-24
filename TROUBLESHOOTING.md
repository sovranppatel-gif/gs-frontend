# Troubleshooting Guide - Network Errors

## Login Network Error Fix

Agar aapko "Network error. Please check your connection and try again." aa raha hai, ye steps follow karein:

### 1. Server Check Karein

**Server running hai ya nahi check karein:**

```bash
# Terminal 1 - Server start karein
cd billzymall-server
npm run dev

# Ya agar nodemon hai
npm start
```

**Expected output:**
```
Server running on port 3000
MongoDB connected
```

### 2. Port Check Karein

**Server port 3000 par chal raha hai ya nahi:**

Browser mein jao: `http://localhost:3000`

Agar "Cannot connect" dikhe, to server start nahi hua.

### 3. API URL Check Karein

**Frontend mein API URL verify karein:**

1. Browser Console kholo (F12)
2. Login attempt karo
3. Console mein dekho: `Attempting login to: http://localhost:3000/api/auth/login`

**Agar URL galat hai:**
- `.env` file check karo `billzymall-frontend/` mein
- `VITE_API_URL=http://localhost:3000` set karo

### 4. CORS Check Karein

**Server CORS configuration:**

`billzymall-server/server.js` mein:
```javascript
const corsOptions = {
  origin: 'http://localhost:5174', // Frontend URL
  credentials: true
};
```

### 5. Common Issues & Solutions

#### Issue 1: Server Not Running
**Solution:**
```bash
cd billzymall-server
npm install  # Agar dependencies missing hain
npm run dev  # Server start karo
```

#### Issue 2: Port Already in Use
**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ya server ko different port par chalao
# .env mein: PORT=3001
```

#### Issue 3: MongoDB Not Connected
**Error:** `MongoDB connection error`

**Solution:**
1. MongoDB running hai ya nahi check karo
2. `.env` file mein `MONGODB_URI` verify karo
3. MongoDB service start karo

#### Issue 4: CORS Error
**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**
`billzymall-server/server.js` mein CORS origin update karo:
```javascript
origin: process.env.FRONTEND_URL || 'http://localhost:5174'
```

### 6. Quick Test

**Server test karein:**

```bash
# Terminal mein
curl http://localhost:3000/api/auth/login -X POST -H "Content-Type: application/json" -d "{\"identifier\":\"test\",\"password\":\"test\"}"
```

**Ya browser mein:**
- Open: `http://localhost:3000`
- Agar server running hai, response milega

### 7. Debug Steps

1. **Server logs check karo** - Koi error dikh raha hai?
2. **Browser Console check karo** - Network tab mein request fail ho raha hai?
3. **Network tab mein request details dekho:**
   - Status code kya hai?
   - Request URL sahi hai?
   - CORS headers present hain?

### 8. Environment Variables

**Frontend `.env` (optional):**
```
VITE_API_URL=http://localhost:3000
```

**Backend `.env`:**
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/billzymall
JWT_SECRET=your-secret-key
CORS_ORIGINS=http://localhost:5174
```

### 9. Still Not Working?

1. **Both servers restart karo:**
   ```bash
   # Terminal 1 - Backend
   cd billzymall-server
   npm run dev
   
   # Terminal 2 - Frontend  
   cd billzymall-frontend
   npm run dev
   ```

2. **Browser cache clear karo:**
   - Ctrl+Shift+R (Hard refresh)
   - Ya DevTools > Application > Clear storage

3. **Check console errors:**
   - F12 > Console tab
   - Koi red errors dikh rahe hain?

---

**Note:** Agar server running hai aur bhi error aa raha hai, to browser console mein exact error message share karein.
