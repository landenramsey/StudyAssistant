# 🔑 API Key Troubleshooting Guide

## Quick Fixes

### 1. Verify Your API Key Format

Your OpenAI API key should:
- Start with `sk-` or `sk-proj-`
- Be about 50-60 characters long
- Have no spaces or extra characters

### 2. Check Your .env File

Make sure your `backend/.env` file contains:

```env
OPENAI_API_KEY=your_api_key_here
```

**Important:**
- No quotes around the key
- No spaces before or after the `=`
- No extra characters

### 3. Regenerate Your API Key

If your key is invalid or expired:

1. Go to: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the new key immediately (you won't see it again!)
4. Update your `.env` file:
   ```bash
   cd backend
   echo "OPENAI_API_KEY=your_new_key_here" > .env
   ```

### 4. Check API Key Status

Test if your key works:

```bash
# Make sure backend is running, then:
curl http://localhost:8000/api/test-openai
```

Or visit in browser: http://localhost:8000/api/test-openai

### 5. Common Error Messages

| Error Message | What It Means | How to Fix |
|--------------|---------------|------------|
| "Invalid API key" | Key is wrong or expired | Regenerate key at platform.openai.com |
| "Rate limit exceeded" | Too many requests | Wait a few minutes and try again |
| "Insufficient quota" | Account has no credits | Add payment method at platform.openai.com |
| "API key not found" | .env file missing or wrong | Create/update .env file |

### 6. Verify Your Account Status

1. Go to: https://platform.openai.com/account/usage
2. Check if you have:
   - ✅ Active API access
   - ✅ Available credits/quota
   - ✅ Valid payment method (if required)

### 7. Restart Backend After Changing .env

After updating your `.env` file:

```bash
# Stop the backend (Ctrl+C)
# Then restart:
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

## Step-by-Step Fix

1. **Check current key:**
   ```bash
   cd backend
   cat .env
   ```

2. **Test the key manually:**
   ```bash
   cd backend
   source venv/bin/activate
   python3 -c "from openai import OpenAI; import os; from dotenv import load_dotenv; load_dotenv(); client = OpenAI(api_key=os.getenv('OPENAI_API_KEY')); print(client.chat.completions.create(model='gpt-4o-mini', messages=[{'role':'user','content':'test'}], max_tokens=5).choices[0].message.content)"
   ```

3. **If that fails, get a new key:**
   - Visit: https://platform.openai.com/api-keys
   - Create new key
   - Update `.env` file

4. **Restart backend:**
   ```bash
   # Stop current server (Ctrl+C)
   uvicorn app.main:app --reload
   ```

## Still Not Working?

1. **Check backend logs** - Look at the terminal where backend is running
2. **Check browser console** - Press F12, look for errors
3. **Verify .env location** - Must be in `backend/.env` (not root directory)
4. **Check file permissions** - Make sure .env is readable

## Need a New API Key?

1. Go to: https://platform.openai.com/api-keys
2. Sign in to your account
3. Click "Create new secret key"
4. Copy it immediately
5. Update `backend/.env`:
   ```bash
   cd backend
   echo "OPENAI_API_KEY=your_new_key_here" > .env
   ```
6. Restart backend server

