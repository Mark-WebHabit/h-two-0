import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { get, ref, onValue } from "firebase/database";
import { auth, db } from "../firebase";
import { useNavigation } from "@react-navigation/native";

export const useRoleBasedNavigation = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          const role = userData.role;

          if (role === "customer") {
            navigation.navigate("Home");
          } else if (role === "seller") {
            navigation.navigate("Store");
          }
        }
      }
    });

    return unsubscribe;
  }, []);

  return null;
};

export const useNoUserNavigation = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigation.navigate("Login");
      }
    });

    return unsubscribe;
  }, []);

  return null;
};

export const useGetUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      const uid = currentUser.uid;
      const userRef = ref(db, `users/${uid}`);

      const unsubscribe = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUser({ ...userData, uid: snapshot.key });
        } else {
          setUser(null);
        }
      });

      return () => {
        // Unsubscribe from the listener when component unmounts
        unsubscribe();
      };
    } else {
      // If there is no current user, reset the user state
      setUser(null);
    }
  }, [auth.currentUser]);

  return user;
};
