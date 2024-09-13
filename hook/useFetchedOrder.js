// import { useEffect, useState } from "react";
// import { ref, onValue } from "firebase/database";
// import { db } from "../firebase";

// const useFetchOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const ordersRef = ref(db, "orders");

//         // Listen for changes to the orders data
//         const unsubscribe = onValue(ordersRef, (snapshot) => {
//           const ordersData = [];
//           snapshot.forEach((childSnapshot) => {
//             ordersData.push({ id: childSnapshot.key, ...childSnapshot.val() });
//           });
//           setOrders(ordersData);
//           setLoading(false);
//         });

//         // Cleanup function to unsubscribe from the listener
//         return () => unsubscribe();
//       } catch (err) {
//         setError(err.message);
//         setLoading(false); // Make sure to set loading to false in case of error
//         console.error("Error fetching orders:", err); // Log the error
//       }
//     };

//     fetchOrders();
//   }, []);

//   return { orders, loading, error };
// };

// export default useFetchOrders;
