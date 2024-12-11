"use client";
import { useAuth } from "@/context/AuthContext";
import { getUserRoles } from "@/actions/getUserRoles";
import { useState, useEffect } from "react";
import { UserRole } from "@/types/types";

export default function Landing() {
  const { user, loading } = useAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (user) {
        const roles = await getUserRoles(user.id);
        setUserRoles(roles);
        console.log(roles);
      }
    };
    fetchUserRoles();
  }, [user]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <div>
          <p>Welcome, {user.email}</p>
          <p>Your roles: {userRoles.map((role) => role.roleName).join(", ")}</p>
        </div>
      ) : (
        <p>Welcome, guest! Please log in to access more features.</p>
      )}
    </div>
  );
}
