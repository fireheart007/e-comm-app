// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQ-aeNTfIRXQ6iqAyFcabhKNAUEgOVjdg",
  authDomain: "e-commerce-35d79.firebaseapp.com",
  projectId: "e-commerce-35d79",
  storageBucket: "e-commerce-35d79.appspot.com",
  messagingSenderId: "601189601276",
  appId: "1:601189601276:web:e1c29e4e42400f32942c79",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const AuthContext = createContext(null);

const AuthProvider=({children})=>{
  const auth=useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
};

export const useAuth=()=>useContext(AuthContext);

//Defining custom hook for authentication
function useProvideAuth() {
  const [user, setUser] = useState();

  const signUp = (email, password, displayName) =>
    createUserWithEmailAndPassword(auth, email, password).then(({ user }) => {
      updateProfile(user, { displayName });
      setUser(user);
      return user;
    });

  const signIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password).then(({ user }) => {
      setUser(user);
      return user;
    });

  const signOutUser = () => signOut(auth).then(() => setUser(null));
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      user ? setUser(user) : setUser(null);
    });

    return () => {
      unsubscribe();
    };
  });

  return{
    signIn,signUp,signOut:signOutUser,user
  }
}

export default AuthProvider;