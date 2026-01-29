# NovaCare Testing Guide

## Prerequisites

1. **Python 3.7+** installed
2. **Node.js and npm** installed
3. **Backend ML models** should be in `backend_squad_b_ready/models/` directory:
   - `heart_risk_rf.pkl`
   - `cardio_risk_xgb.pkl`

## Step 1: Install Dependencies

### Frontend Dependencies
```bash
cd c:\Users\Hp\NOVACARE
npm install
```

### Backend Dependencies
```bash
cd c:\Users\Hp\NOVACARE\backend_squad_b_ready
pip install flask flask-cors joblib
```

## Step 2: Start the Backend Server

Open a terminal/command prompt and run:

```bash
cd c:\Users\Hp\NOVACARE\backend_squad_b_ready
python app.py
```

**Expected Output:**
- Server should start on `http://127.0.0.1:5000`
- You should see logs like "Heart model loaded successfully" and "Cardio model loaded successfully"

**Note:** If models are missing, you'll see error messages. Make sure the model files are in the `models/` directory.

## Step 3: Start the Frontend Development Server

Open a **NEW** terminal/command prompt and run:

```bash
cd c:\Users\Hp\NOVACARE
npm run dev
```

**Expected Output:**
- Server should start (usually on `http://localhost:5173` or similar)
- You'll see a local URL in the terminal

## Step 4: Testing the Application Flow

### 4.1 Test Onboarding Page
1. Open your browser and go to the frontend URL (e.g., `http://localhost:5173`)
2. **Check:**
   - ✅ Logo appears in header
   - ✅ Background leaf pattern is visible
   - ✅ Navigation links work
   - ✅ "Sign In" button is visible
   - ✅ Page scrolls smoothly through all sections

### 4.2 Test Sign Up Flow
1. Click "Sign In" or navigate to `/signup`
2. **Fill in the form:**
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
   - Check "I agree to terms"
3. Click "Sign up"
4. **Expected:** Should redirect to `/setup-profile` (Profile Setup page)

### 4.3 Test Profile Setup
1. **Fill in Personal Information:**
   - Height: `175` (cm)
   - Weight: `70` (kg)
   - Date of Birth: Select a date (e.g., `1990-01-01`)
   - Gender: `Male`
   - Blood Group: `O+`
   - Genotype: `AA`
   - Blood Pressure: `120/80`

2. **Select Medical History:**
   - Check any conditions (e.g., `Hypertension`, `Diabetes`)

3. **Select Symptoms:**
   - Check any symptoms (e.g., `Chest Pain`, `Fatigue`)

4. **Add Medications (optional):**
   - Enter medication names

5. **Upload Profile Picture (optional)**

6. Click "Save & Continue"
7. **Expected:** Should redirect to `/dashboard`

### 4.4 Test Dashboard
1. **Check Dashboard displays:**
   - ✅ User profile card with name and picture
   - ✅ Health Score gauge showing a number (0-100)
   - ✅ Personal Information card with all your data
   - ✅ Medical History card with selected conditions
   - ✅ Current Symptoms card with selected symptoms
   - ✅ Current Medications card
   - ✅ Background leaf pattern visible
   - ✅ Sidebar navigation visible

2. **Test Sidebar Navigation:**
   - Click "Health Profile" → Should navigate to Medical History page
   - Click "Dashboard" → Should return to dashboard

3. **Test Action Buttons:**
   - Click "Run New Health Analysis" → Should navigate to Heart Diagnosis form

### 4.5 Test Heart Diagnosis Form
1. **Check pre-filled data:**
   - ✅ Age should be pre-filled from profile
   - ✅ Gender should be pre-filled
   - ✅ Symptoms should be mapped (e.g., if you selected "Chest Pain", it should be checked)

2. **Fill/Update form fields:**
   - Review all Yes/No questions
   - Update Age if needed
   - Select Gender if needed

3. Click "Submit for Analysis"
4. **Expected:** 
   - Loading state shows "Analyzing..."
   - Should redirect to `/diagnosis-result` page
   - Backend should receive POST request to `/predict/heart`

### 4.6 Test Diagnosis Result Page
1. **Check result display:**
   - ✅ Name is displayed
   - ✅ Age is displayed
   - ✅ BMI is calculated and displayed
   - ✅ Blood Pressure is shown
   - ✅ Risk Score is displayed as a percentage
   - ✅ Risk tag (Excellent/Moderate/Needs Attention) is shown
   - ✅ Medical Overview section shows history and symptoms

2. Click "Back to Dashboard"
3. **Expected:** Should return to dashboard

### 4.7 Test Login Flow
1. Click "Logout" on dashboard
2. Navigate to `/login`
3. **Enter credentials:**
   - Email: `john.doe@example.com`
   - Password: `password123`
4. Click "Sign In"
5. **Expected:** Should redirect to `/dashboard` with your profile data loaded

### 4.8 Test Profile Editing
1. On Dashboard, click "Edit Profile"
2. **Check:**
   - ✅ All fields are pre-filled with existing data
   - ✅ You can modify any field
3. Make changes and click "Save & Continue"
4. **Expected:** Changes should be saved and reflected on dashboard

## Step 5: Testing Backend Connection

### Test Backend API Directly

You can test the backend endpoint using curl or Postman:

```bash
curl -X POST http://127.0.0.1:5000/predict/heart \
  -H "Content-Type: application/json" \
  -d '{
    "Chest_Pain": 1,
    "Shortness_of_Breath": 1,
    "Fatigue": 0,
    "Palpitations": 0,
    "Dizziness": 0,
    "Swelling": 0,
    "High_BP": 1,
    "Pain_Arms_Jaw_Back": 0,
    "Cold_Sweats_Nausea": 0,
    "High_Cholesterol": 1,
    "Diabetes": 1,
    "Smoking": 0,
    "Obesity": 0,
    "Sedentary_Lifestyle": 0,
    "Family_History": 1,
    "Chronic_Stress": 0,
    "Gender": 1,
    "Age": 45
  }'
```

**Expected Response:**
```json
{
  "model": "heart",
  "risk": 0
}
```
or
```json
{
  "model": "heart",
  "risk": 1
}
```

## Common Issues & Solutions

### Issue 1: Backend won't start
**Solution:**
- Check if Python is installed: `python --version`
- Check if Flask is installed: `pip list | findstr flask`
- Check if model files exist in `backend_squad_b_ready/models/`

### Issue 2: Frontend can't connect to backend
**Solution:**
- Verify backend is running on `http://127.0.0.1:5000`
- Check browser console for CORS errors
- Verify the URL in `HeartDiagnosis.tsx` matches your backend URL

### Issue 3: Models not loading
**Solution:**
- Ensure model files (`heart_risk_rf.pkl`, `cardio_risk_xgb.pkl`) are in `backend_squad_b_ready/models/`
- Check backend console for error messages
- Verify file paths in `app.py`

### Issue 4: Data not persisting
**Solution:**
- Check browser's localStorage (F12 → Application → Local Storage)
- Look for keys: `novacare_users`, `novacare_health_profiles`, `novacare_session`
- Clear localStorage if needed and test again

### Issue 5: Images not loading
**Solution:**
- Verify image files exist in `src/assets/images/` and `src/assets/`
- Check browser console for 404 errors
- Ensure file names match exactly (case-sensitive)

## Browser Console Testing

Open browser DevTools (F12) and check:

1. **Console Tab:**
   - No red errors
   - Check for any warnings

2. **Network Tab:**
   - When submitting diagnosis, verify POST request to `/predict/heart`
   - Check response status (should be 200)
   - Verify response contains `risk` or `prediction` field

3. **Application Tab → Local Storage:**
   - `novacare_users` - Should contain registered users
   - `novacare_health_profiles` - Should contain health profiles
   - `novacare_session` - Should contain current session

## Quick Test Checklist

- [ ] Onboarding page loads with logo and background
- [ ] Sign up creates account and redirects to profile setup
- [ ] Profile setup saves data and redirects to dashboard
- [ ] Dashboard displays all profile information
- [ ] Health score is calculated and displayed
- [ ] Heart diagnosis form pre-fills from profile
- [ ] Diagnosis submission connects to backend
- [ ] Result page displays risk score
- [ ] Login works with created account
- [ ] Profile editing updates data correctly
- [ ] All pages show background leaves
- [ ] All pages show correct logo

## Performance Testing

1. **Test with multiple users:**
   - Create 2-3 different accounts
   - Each should have separate profiles
   - Verify data isolation

2. **Test data persistence:**
   - Fill profile, close browser
   - Reopen and login
   - Verify data is still there

3. **Test form validation:**
   - Try submitting empty forms
   - Try invalid data (negative age, etc.)
   - Verify error messages appear

## Next Steps

After basic testing:
1. Test the second model (Cardio) if implemented
2. Test edge cases (very old age, extreme BMI, etc.)
3. Test responsive design on different screen sizes
4. Test accessibility features
