import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase.js";
import "./subpages.css";

const HomeEle = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState({});
  const [search, setSearch] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchItems = async () => {
      const snap = await getDocs(collection(db, "items"));
      setItems(
        snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    };
    fetchItems();
  }, []);

  const toggleCart = async (item) => {
    if (!user) {
      alert("Please login first");
      return;
    }

    const userRef = doc(db, "users", user.uid);

    const payload = {
      id: item.id,
      name: item.name,
      price: item.price,
      img: item.img,
      unit: item.unit
    };

    setCart(prev => {
      const copy = { ...prev };

      if (copy[item.id]) {
        updateDoc(userRef, {
          cart: arrayRemove(payload)
        });
        delete copy[item.id];
      } else {
        updateDoc(userRef, {
          cart: arrayUnion(payload)
        });
        copy[item.id] = item;
      }

      return copy;
    });
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="all">
      <div className="tag">Today's Menu</div>

      <input
        className="search"
        placeholder="Search sweets..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="items-grid">
        {filteredItems.map(item => {
          const inCart = !!cart[item.id];

          return (
            <div className="item-card" key={item.id}>
              <img src={item.img} alt={item.name} className="mithai" />
              <div className="itemname">{item.name}</div>
              <div className="detail">{item.description}</div>
              <div className="price">
                ₹{item.price} <span>{item.unit}</span>
              </div>

              <button
                className={`cart-btn ${inCart ? "added" : ""}`}
                onClick={() => toggleCart(item)}
              >
                {inCart ? "Added to Cart" : "Add to Cart"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeEle;
