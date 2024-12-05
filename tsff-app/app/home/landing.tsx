'use client'
import { useAuth } from '@/context/AuthContext';

export default function Landing() {
    const { user, loading } = useAuth();
    if (loading) {
        return <p>Loading...</p>;
    
      }
    return (
    <div>
        {user ? (
            <p>Welcome, {user.email}</p>
        ) : (
            <p>Welcome, guest! Please log in to access more features.</p>
        )}
    </div>
    )
}