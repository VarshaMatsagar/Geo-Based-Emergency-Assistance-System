import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const AdminLayout = () => {
  const location = useLocation();
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Force re-render when navigating back to admin dashboard
    if (location.pathname === '/admin') {
      setKey(prev => prev + 1);
    }
  }, [location.pathname]);

  return (
    <div className="container-fluid">
      <Outlet key={key} />
    </div>
  );
};

export default AdminLayout;
