// Authentication service
let currentUser = null;

export const signInWithEmailAndPassword = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'john@example.com' && password === 'password123') {
        currentUser = { id: '1', name: 'John Doe', email, isAdmin: false };
        resolve(currentUser);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 500);
  });
};

export const createUserWithEmailAndPassword = async (email, password, name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentUser = { id: Date.now().toString(), name, email, isAdmin: false };
      resolve(currentUser);
    }, 500);
  });
};

export const getUserData = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (currentUser) {
        resolve(currentUser);
      } else {
        reject(new Error('No user logged in'));
      }
    }, 200);
  });
};

export const signOut = async () => {
  currentUser = null;
};