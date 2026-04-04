# Google OAuth Implementation Guide

This document describes the complete Google OAuth flow implemented in the TrokaMart frontend.

## Overview

The Google OAuth flow allows users to sign in using their Google account instead of mobile number and password. The flow consists of frontend redirects and backend authentication.

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ Frontend                                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User clicks "Continue with Google"                          │
│     ↓                                                            │
│  2. Store loginMethod: "google" in localStorage                 │
│     ↓                                                            │
│  3. Show loader: "Redirecting to Google for secure sign-in"    │
│     ↓                                                            │
│  4. Redirect to: /auth/google (backend endpoint)               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ Backend (OAuth Server)                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Receive request to /auth/google                            │
│     ↓                                                            │
│  2. Generate Google OAuth URL                                   │
│     ↓                                                            │
│  3. Redirect to Google OAuth authorization endpoint             │
│     ↓                                                            │
│  4. User authenticates with Google                              │
│     ↓                                                            │
│  5. Google redirects back to backend callback URL with code    │
│     ↓                                                            │
│  6. Backend exchanges code for access token                     │
│     ↓                                                            │
│  7. Fetch user profile from Google                              │
│     ↓                                                            │
│  8. Create or fetch user from database                          │
│     ↓                                                            │
│  9. Generate JWT token/session                                  │
│     ↓                                                            │
│  10. Store user data in response                                │
│      ↓                                                            │
│  11. Redirect to /auth/google/callback on frontend with:       │
│      - token parameter                                          │
│      - or set token in cookie (httpOnly)                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ Frontend - Google Callback Handler                             │
├─────────────────────────────────────────────────────────────────┤
│ Route: /auth/google/callback                                   │
│                                                                  │
│  1. Receive 'code' parameter from Google                        │
│     ↓                                                            │
│  2. if error parameter exists:                                  │
│     - Store error in localStorage                               │
│     - Redirect to /login with error message                    │
│     ↓                                                            │
│  3. Send code to backend: POST /auth/google/callback           │
│     ↓                                                            │
│  4. Backend validates code and returns token + user            │
│     ↓                                                            │
│  5. Store token in localStorage                                │
│     ↓                                                            │
│  6. Store user data in localStorage                             │
│     ↓                                                            │
│  7. Redirect to /auth-success                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ Frontend - Auth Success Page                                   │
├─────────────────────────────────────────────────────────────────┤
│ Route: /auth-success                                           │
│                                                                  │
│  1. Retrieve user from localStorage                             │
│     ↓                                                            │
│  2. Check user.role:                                            │
│     - "admin" → redirect to /admin/dashboard                    │
│     - "seller" → redirect to /dashboard/seller                 │
│     - others → redirect to /dashboard                           │
│     ↓                                                            │
│  3. User is now authenticated                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend Files Modified/Created

### 1. **app/services/oauth.ts** (NEW)
Helper functions for OAuth flow:
- `initiateGoogleOAuth()` - Direct OAuth flow with Google
- `redirectToBackendOAuth()` - Redirect to backend OAuth endpoint
- `getGoogleAuthCallback()` - Handle OAuth callback
- `getUserFromToken()` - Fetch user from token

### 2. **store/authStore.ts** (UPDATED)
Added new actions:
- `setGoogleAuth(user, token)` - Store OAuth authentication
- `initiateGoogleLogin()` - Start Google login flow
- New state: `loginMethod` - Tracks "google" or "email" login

### 3. **app/(auth)/login/page.tsx** (UPDATED)
- Added "Continue with Google" button
- Added loader and error handling for OAuth
- Displays error from failed OAuth attempts (via query params)
- Google button shows loader during redirect

### 4. **components/LoginModal.tsx** (UPDATED)
- Added "Continue with Google" button
- Same functionality as login page
- Proper error handling

### 5. **app/(auth)/google-callback/page.tsx** (NEW)
Route: `/auth/google/callback`
- Receives authorization `code` from Google
- Handles OAuth errors
- Exchanges code for token via backend
- Stores token and user data in localStorage
- Redirects to `/auth-success`

### 6. **app/(auth)/auth-success/page.tsx** (NEW)
Route: `/auth-success`
- Handles role-based redirects
- Shows loading state during redirect
- Displays errors if authentication fails

## Backend Requirements

Your backend needs to implement the following endpoints:

### 1. **POST /auth/google**
Initiates the Google OAuth flow.

**Request:**
```json
{}
```

**Response:**
- Redirect to Google OAuth authorization URL
- Or return the Google OAuth URL

**Environment Variables Needed:**
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI` (should be `{FRONTEND_URL}/auth/google/callback`)

### 2. **POST /auth/google/callback**
Handles the OAuth callback after user authorizes.

**Request:**
```json
{
  "code": "authorization_code_from_google"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user|seller|admin",
    "avatar": "profile_picture_url",
    "mobile": "phone_number_if_available"
  }
}
```

**Process:**
1. Exchange `code` for Google access token
2. Use access token to fetch user profile from Google
3. Extract email, name, avatar from Google profile
4. Check if user exists in database by email
5. If not exists: Create new user with role "user"
6. If exists: Update user info (optional)
7. Generate JWT token for the user
8. Return token and user object

### 3. **Environment Setup**
Add to backend `.env`:
```
GOOGLE_CLIENT_ID=26398409435-megm1ddti11vjohs11r54k4vkg1087e7.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

## Frontend Environment Setup

Already configured in `.env`:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=26398409435-megm1ddti11vjohs11r54k4vkg1087e7.apps.googleusercontent.com
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Note:** Make sure to update `NEXT_PUBLIC_API_URL` to match your backend URL.

## User Flow

### Success Scenario:
1. User clicks "Continue with Google" on login page
2. UI shows "Redirecting to Google for secure sign-in"
3. User is redirected to `/auth/google` (backend)
4. Backend redirects to Google OAuth page
5. User signs in with Google
6. Google redirects back to `/auth/google/callback` with authorization code
7. Frontend exchanges code for token via backend
8. Frontend stores token and user data
9. Frontend redirects to `/auth-success`
10. Success page detects user role and redirects appropriately
11. User is logged in

### Error Scenario:
1. User clicks "Continue with Google"
2. Google OAuth process fails at any step
3. Frontend redirects to `/login` with error message
4. User sees "Google login failed. Please try again."
5. User can try again or use email/password login

## Security Considerations

1. **Token Storage**: Token is stored in `localStorage` but should ideally be in an httpOnly cookie
2. **CSRF Protection**: Implement CSRF tokens for OAuth flow
3. **State Parameter**: The OAuth flow should use a state parameter to prevent CSRF attacks
4. **Code Exchange**: Backend should never expose the authorization code to frontend
5. **HTTPS Only**: OAuth should only work over HTTPS in production

## Testing the Flow

### Test URLs:
- Login Page: `http://localhost:3000/login`
- Google Callback: `http://localhost:3000/auth/google/callback`
- Auth Success: `http://localhost:3000/auth-success`

### Test Cases:
1. ✅ Click "Continue with Google" - should redirect properly
2. ✅ Successful Google authentication - should show loader and redirect
3. ✅ Failed Google authentication - should show error on login page
4. ✅ Role-based routing - admin/seller/user roles redirect correctly
5. ✅ Token persistence - token should be available after page refresh

## API Response Format for Token Exchange

The backend response from `/auth/google/callback` should be:

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "email": "user@gmail.com",
      "name": "John Doe",
      "mobile": null,
      "role": "user",
      "avatar": "https://lh3.googleusercontent.com/a/ACg8...",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

## Error Handling

### Frontend Error Handling:
- Missing authorization code
- Invalid authorization code
- Backend returns error response
- Network errors during token exchange

### Error Display:
- Errors are displayed toast/alert on login page
- Error message: "Google login failed. Please try again."
- Specific error details logged to console for debugging

## Styling & UX

- Google button uses official Google colors and icon
- Loading state shows spinner and "Redirecting..." text
- Smooth transitions and proper disabled states
- Mobile-responsive design
- Error messages displayed in red

## Next Steps

1. Implement backend OAuth endpoints
2. Set up Google OAuth credentials (already in .env)
3. Configure redirect URIs in Google Console
4. Test the complete flow
5. Add error logging and monitoring
6. Add rate limiting to OAuth endpoints
7. Consider adding state parameter for CSRF protection
