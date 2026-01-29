// Authentication service using localStorage (async storage for web)

/**
 * Get all users from localStorage
 */
export const getUsers = () => {
  try {
    const users = localStorage.getItem('novacare_users');
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

/**
 * Save users to localStorage
 */
export const saveUsers = (users) => {
  try {
    localStorage.setItem('novacare_users', JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
};

/**
 * Register a new user
 */
export const registerUser = async (userData) => {
  const { firstName, lastName, email, password } = userData;
  
  // Validation
  if (!firstName || !lastName || !email || !password) {
    return { success: false, error: 'All fields are required' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Invalid email format' };
  }

  // Check if user already exists
  const users = getUsers();
  const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
  
  if (existingUser) {
    return { success: false, error: 'User with this email already exists' };
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    firstName,
    lastName,
    email: email.toLowerCase(),
    password, // In production, this should be hashed
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  const saved = saveUsers(users);

  if (saved) {
    return { success: true, user: { ...newUser, password: undefined } };
  } else {
    return { success: false, error: 'Failed to save user' };
  }
};

/**
 * Login user
 */
export const loginUser = async (email, password) => {
  // Validation
  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  const users = getUsers();
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Create session
  const session = {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    },
    token: `token_${Date.now()}_${user.id}`, // Simple token generation
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
  };

  localStorage.setItem('novacare_session', JSON.stringify(session));
  return { success: true, session };
};

/**
 * Get current session
 */
export const getSession = () => {
  try {
    const session = localStorage.getItem('novacare_session');
    if (!session) return null;

    const parsedSession = JSON.parse(session);
    
    // Check if session expired
    if (parsedSession.expiresAt < Date.now()) {
      logout();
      return null;
    }

    return parsedSession;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  const session = getSession();
  return session ? session.user : null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return getSession() !== null;
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('novacare_session');
  return true;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, updates) => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return { success: false, error: 'User not found' };
  }

  // Update user data (excluding password)
  const { password, ...safeUpdates } = updates;
  users[userIndex] = { ...users[userIndex], ...safeUpdates };

  const saved = saveUsers(users);

  if (saved) {
    // Update session if current user
    const session = getSession();
    if (session && session.user.id === userId) {
      session.user = { ...session.user, ...safeUpdates };
      localStorage.setItem('novacare_session', JSON.stringify(session));
    }
    return { success: true, user: users[userIndex] };
  } else {
    return { success: false, error: 'Failed to update user' };
  }
};
