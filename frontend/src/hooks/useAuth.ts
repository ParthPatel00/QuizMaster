import { useEffect, useState } from "react";
import { auth } from "../services/firebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    })
    return () => unsubscribe();
  }, []);

  return { user };
};
