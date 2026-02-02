import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login but save the current location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Role not authorized, redirect to their own dashboard or home
        const dashboardPath = user.role === 'admin' ? '/dashboard/admin' :
            user.role === 'manager' ? '/dashboard/manager' :
                user.role === 'teacher' ? '/dashboard/teacher' :
                    '/dashboard/student';

        return <Navigate to={dashboardPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
