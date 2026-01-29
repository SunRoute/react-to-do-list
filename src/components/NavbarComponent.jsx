import React, { useEffect, useState } from "react";
import LogoImg from "../assets/notes.svg";
import { logout } from "../services/authService";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router";

const NavbarComponent = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  return (
    <>
      <nav className="flex w-full justify-between items-center bg-blue-200 shadow-md py-3 px-10">
        {/* logo */}
        <a href="/">
          <div className="flex gap-1 justify-center items-center cursorpointer">
            <img src={LogoImg} alt="logo-image" className="h-9 w-9" />
            <p className="text-lg font-semibold text-blue-900 hover:textblue-800 transition ease-in-out">
              ToDoSome
            </p>
          </div>
        </a>
        {/* navmenu */}
        <div className="flex gap-6 justify-center items-center text-blue-900 font-semibold">
          {user ? (
            <div className="flex items-center gap-8">
              {user.photoURL ? (
                <img
                  src={user?.photoURL}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-800 text-whiteflex items-center justify-center font-semibold hover:bg-blue-900 transition ease-in-out">
                  {user.email.charAt(0).toUpperCase()}
                </div>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white text-sm py-2 px-4 rounded-md hover:bg-red-700 transition ease-in-out"
              >
                Logout
              </button>
            </div>
          ) : (
            <a href="/signin">
              <h1 className="text-lg text-blue-900 font-semibold">
                Please login!
              </h1>
            </a>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavbarComponent;
