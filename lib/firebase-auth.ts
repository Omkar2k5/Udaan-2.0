import { initializeApp } from "firebase/app"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from "firebase/auth"
import { getAnalytics } from "firebase/analytics"

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9-4wIWdGheBldDEL6SixDNYPipLePKBw",
  authDomain: "uddan-2-0.firebaseapp.com",
  projectId: "uddan-2-0",
  storageBucket: "uddan-2-0.firebasestorage.app",
  messagingSenderId: "264260034605",
  appId: "1:264260034605:web:1bb3fac6c233e6003018a4",
  measurementId: "G-NYC9CSNKPJ",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// Initialize Analytics only on client side
let analytics: any = null
if (typeof window !== "undefined") {
  analytics = getAnalytics(app)
}

const auth = getAuth(app)

// Sign up with email and password
export const signUp = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    // Update the user's profile with the display name
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName })
    }
    return userCredential.user
  } catch (error: any) {
    const errorMessage = getErrorMessage(error.code)
    throw new Error(errorMessage)
  }
}

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error: any) {
    const errorMessage = getErrorMessage(error.code)
    throw new Error(errorMessage)
  }
}

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth)
  } catch (error: any) {
    throw new Error("Failed to sign out. Please try again.")
  }
}

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser
}

// Listen for auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

// Helper function to get user-friendly error messages
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email is already in use. Please use a different email or login."
    case "auth/invalid-email":
      return "Invalid email address. Please check and try again."
    case "auth/weak-password":
      return "Password is too weak. Please use a stronger password."
    case "auth/user-not-found":
      return "No account found with this email. Please sign up first."
    case "auth/wrong-password":
      return "Incorrect password. Please try again."
    case "auth/too-many-requests":
      return "Too many failed login attempts. Please try again later."
    default:
      return "An error occurred. Please try again."
  }
}

export { app, analytics }
