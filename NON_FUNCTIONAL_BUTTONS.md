# Non-Functional Buttons & Links Report

## 🔴 Critical Issues (Buttons that should work but don't)

### 1. **Onboarding Page** (`Onboarding.jsx`)
- ❌ **"Learn More" button** (Line 68)
  - **Location:** Hero section
  - **Issue:** No onClick handler
  - **Expected:** Should scroll to a section or show more information

### 2. **Login Page** (`Login.jsx`)
- ❌ **"Forgot Password?" link** (Line 171)
  - **Location:** Below password input
  - **Issue:** No onClick handler
  - **Expected:** Should navigate to password reset page or show modal

- ❌ **Social Login Buttons** (Lines 200-211)
  - **Buttons:** "G" (Google), "in" (LinkedIn)
  - **Issue:** No onClick handlers
  - **Expected:** Should trigger OAuth login flows

### 3. **SignUp Page** (`SignUp.jsx`)
- ❌ **"Terms of Service" link** (Line 271)
  - **Location:** In terms agreement text
  - **Issue:** No onClick handler
  - **Expected:** Should show terms modal or navigate to terms page

- ❌ **"Privacy Policy" link** (Line 272)
  - **Location:** In terms agreement text
  - **Issue:** No onClick handler
  - **Expected:** Should show privacy policy modal or navigate to privacy page

- ❌ **Social Login Buttons** (Lines 292-309)
  - **Buttons:** "f" (Facebook), "G" (Google), "in" (LinkedIn)
  - **Issue:** No onClick handlers
  - **Expected:** Should trigger OAuth signup flows

### 4. **Dashboard Page** (`Dashboard.tsx`)
- ❌ **Top Navigation Links** (Lines 242-246)
  - **Links:** HOME, DASHBOARD, AI DIAGNOSTICS, ABOUT US, CONTACT
  - **Issue:** Using `href="#..."` which only scrolls to anchors on same page
  - **Expected:** Should navigate to actual pages or scroll to sections

- ❌ **"PATIENT LOGIN" button** (Line 249)
  - **Location:** Top right of header
  - **Issue:** Always navigates to `/login` even when user is already logged in
  - **Expected:** Should show user menu or logout option when logged in

- ❌ **"Contact Info" button** (Line 340)
  - **Location:** User profile card
  - **Issue:** No onClick handler
  - **Expected:** Should show contact information modal or navigate to contact page

- ❌ **"Book New Appointment" button** (Line 481)
  - **Location:** Action buttons at bottom
  - **Issue:** Navigates to `/dashboard` (same page, does nothing)
  - **Expected:** Should navigate to appointment booking page or show booking modal

- ❌ **"Settings" sidebar item** (Line 267)
  - **Location:** Left sidebar
  - **Issue:** Navigates to `/dashboard` (same page)
  - **Expected:** Should navigate to `/settings` page

### 5. **Test Selection Page** (`TestSelection.tsx`)
- ⚠️ **"Start Heart Analysis" button** (Line 77)
  - **Location:** Inside Heart Disease Risk card
  - **Issue:** Button has no onClick, but parent div has onClick
  - **Status:** Works because parent div handles click, but button itself doesn't
  - **Recommendation:** Add onClick to button or remove button and style div as button

- ⚠️ **"Start Cardiovascular Analysis" button** (Line 99)
  - **Location:** Inside Cardiovascular Risk card
  - **Issue:** Button has no onClick, but parent div has onClick
  - **Status:** Works because parent div handles click, but button itself doesn't
  - **Recommendation:** Add onClick to button or remove button and style div as button

### 6. **Settings Page** (`Settings.jsx`)
- ❌ **Entire Page**
  - **Issue:** Page is just a placeholder with no functionality
  - **Expected:** Should have settings options (profile edit, preferences, notifications, etc.)

## 🟡 Minor Issues (Links that could be improved)

### 7. **Onboarding Page** (`Onboarding.jsx`)
- ⚠️ **Navigation Links** (Lines 24-28)
  - **Links:** Home, Why NovaCare, About, Services, Contact
  - **Issue:** Using anchor links `#home`, `#why`, etc. - works but could use smooth scroll
  - **Status:** Functional but could be enhanced

### 8. **Dashboard Page** (`Dashboard.tsx`)
- ⚠️ **"Save Changes" button** (Line 469)
  - **Location:** Action buttons
  - **Issue:** Navigates to `/setup-profile` but doesn't actually save changes from dashboard
  - **Expected:** Should save any changes made on dashboard or be removed if no changes can be made

## 📋 Summary by Page

| Page | Non-Functional Buttons | Status |
|------|------------------------|--------|
| **Onboarding** | 1 button | 🔴 Needs fix |
| **Login** | 3 buttons/links | 🔴 Needs fix |
| **SignUp** | 5 buttons/links | 🔴 Needs fix |
| **Dashboard** | 5 buttons/links | 🔴 Needs fix |
| **TestSelection** | 2 buttons (work but inconsistent) | 🟡 Minor issue |
| **Settings** | Entire page | 🔴 Needs implementation |
| **Form** | All working ✅ | ✅ OK |
| **HeartDiagnosis** | All working ✅ | ✅ OK |
| **CardioDiagnosis** | All working ✅ | ✅ OK |
| **DiagnosisResult** | All working ✅ | ✅ OK |
| **MedicalHistory** | All working ✅ | ✅ OK |

## 🎯 Priority Fixes

### High Priority:
1. **Settings Page** - Complete implementation needed
2. **Dashboard "Book New Appointment"** - Should navigate to appointment page
3. **Dashboard "Settings" sidebar** - Should navigate to settings page
4. **Dashboard "Contact Info"** - Should show contact information
5. **Dashboard "PATIENT LOGIN"** - Should show user menu when logged in

### Medium Priority:
6. **Forgot Password** - Should implement password reset flow
7. **Terms of Service & Privacy Policy** - Should show modals or pages
8. **Social Login Buttons** - Should implement OAuth or remove if not needed

### Low Priority:
9. **"Learn More" button** - Should scroll to section or show info
10. **TestSelection buttons** - Make buttons functional directly (not just parent div)

## 💡 Recommendations

1. **Remove or Implement:** If social login won't be implemented, remove those buttons
2. **Settings Page:** Create a proper settings page with user preferences
3. **Appointment Booking:** Create appointment booking page or modal
4. **Contact Info:** Create modal or page for contact information
5. **Navigation:** Use React Router's `Link` component instead of anchor tags for better navigation
