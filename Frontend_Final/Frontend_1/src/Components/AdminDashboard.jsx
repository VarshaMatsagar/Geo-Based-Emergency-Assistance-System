import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState("users");

  // VIEW MODAL STATE
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/AdminUsers");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= ACTION HANDLERS ================= */
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditUser = (user) => {
    navigate(`/admin/edit-user/${user.userId}`);
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Delete ${user.fullName}?`)) return;

    try {
      await api.delete(`/AdminUsers/${user.userId}`);
      setUsers((prev) => prev.filter((u) => u.userId !== user.userId));
      alert("User deleted");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">

        {/* ================= SIDEBAR ================= */}
        <div className="col-md-2 bg-dark text-white p-3">
          <h5 className="text-center mb-4">Admin Panel</h5>

          <ul className="nav nav-pills flex-column gap-2">
            

            
              
            
          </ul>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="col-md-10 p-4">

          {activeMenu === "users" && (
            <>
              <h3 className="mb-3">User Management</h3>

              {loading && <div>Loading...</div>}

              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th width="220">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => (
                    <tr key={u.userId}>
                      <td>{u.userId}</td>
                      <td>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>{u.phoneNumber}</td>
                      <td>{u.role?.roleName || "Citizen"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-info me-2"
                          onClick={() => handleViewUser(u)}
                        >
                          View
                        </button>

                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEditUser(u)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteUser(u)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {users.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {/* ================= VIEW USER MODAL ================= */}
      {showViewModal && selectedUser && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-md">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title">User Details</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowViewModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th>ID</th>
                        <td>{selectedUser.userId}</td>
                      </tr>
                      <tr>
                        <th>Full Name</th>
                        <td>{selectedUser.fullName}</td>
                      </tr>
                      <tr>
                        <th>Email</th>
                        <td>{selectedUser.email}</td>
                      </tr>
                      <tr>
                        <th>Phone</th>
                        <td>{selectedUser.phoneNumber}</td>
                      </tr>
                      <tr>
                        <th>Role</th>
                        <td>{selectedUser.role?.roleName}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowViewModal(false)}
                  >
                    Close
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Modal Backdrop */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;


// import React, { useEffect, useState } from "react";
// import api from "../Services/api";
// import { useNavigate } from "react-router-dom";

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [activeMenu, setActiveMenu] = useState("users");
//   const navigate = useNavigate();

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get("/AdminUsers");
//       setUsers(res.data);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to fetch users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleEditUser = user =>
//     navigate(`/AdminUsers/${user.userId}`);

//   const handleDeleteUser = async user => {
//     if (!window.confirm(`Delete ${user.fullName}?`)) return;
//     try {
//       await api.delete(`/AdminUsers/${user.userId}`);
//       setUsers(prev =>
//         prev.filter(u => u.userId !== user.userId)
//       );
//       alert("User deleted");
//     } catch (err) {
//       console.error(err);
//       alert("Delete failed");
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row min-vh-100">

//         {/* ===== SIDEBAR ===== */}
//         <div className="col-md-2 bg-dark text-white p-3">
//           <h5 className="text-center mb-4">Admin Panel</h5>

//           <ul className="nav nav-pills flex-column gap-2">
//             <li className="nav-item">
//               <button
//                 className={`nav-link text-start ${
//                   activeMenu === "users" ? "active" : "text-white"
//                 }`}
//                 onClick={() => setActiveMenu("users")}
//               >
//                 Manage Users
//               </button>
//             </li>

//             <li className="nav-item">
//               <button
//                 className={`nav-link text-start ${
//                   activeMenu === "roles" ? "active" : "text-white"
//                 }`}
//                 onClick={() => setActiveMenu("police")}
//               >
//                 Manage Police
//               </button>
//             </li>

//             <li className="nav-item">
//               <button
//                 className={`nav-link text-start ${
//                   activeMenu === "roles" ? "active" : "text-white"
//                 }`}
//                 onClick={() => setActiveMenu("hospital")}
//               >
//                 Manage Hospital
//               </button>
//             </li>

//             <li className="nav-item mt-3">
//               <button
//                 className="nav-link text-start text-danger"
//                 onClick={() => {
//                   localStorage.clear();
//                   navigate("/login");
//                 }}
//               >
//              Logout
//               </button>
//             </li>
//           </ul>
//         </div>

//         {/* ===== MAIN CONTENT ===== */}
//         <div className="col-md-10 p-4">

//           {/* USERS SECTION */}
//           {activeMenu === "users" && (
//             <>
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h3>User Management</h3>
//                 {/* <button
//                   className="btn btn-primary"
//                   onClick={() => navigate("/admin/add-user")}
//                 >
//                   Add User
//                 </button> */}
//               </div>

//               {loading && <div>Loading...</div>}

//               <table className="table table-bordered">
//                 <thead className="table-light">
//                   <tr>
//                     <th>ID</th>
//                     <th>Full Name</th>
//                     <th>Email</th>
//                     <th>Phone</th>
//                     <th>Role</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {users.map(u => (
//                     <tr key={u.userId}>
//                       <td>{u.userId}</td>
//                       <td>{u.fullName}</td>
//                       <td>{u.email}</td>
//                       <td>{u.phoneNumber}</td>
//                       <td>{u.role?.name || "Citizen"}</td>
//                       <td>
//                         <button
//                           className="btn btn-sm btn-outline-primary me-2"
//                           onClick={() => handleEditUser(u)}
//                         >
//                           View
//                         </button>
//                         <button
//                           className="btn btn-sm btn-outline-primary me-2"
//                           onClick={() => handleEditUser(u)}
//                         >
//                           Edit
//                         </button>
//                         <button
//                           className="btn btn-sm btn-outline-danger"
//                           onClick={() => handleDeleteUser(u)}
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}

//                   {users.length === 0 && (
//                     <tr>
//                       <td colSpan="6" className="text-center text-muted">
//                         No users found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </>
//           )}

//           {/* ROLES SECTION (placeholder) */}
//           {activeMenu === "police" && (
//             <div className="alert alert-info">
//               Police Management Coming Soon 
//             </div>
//           )}

//           {/* ROLES SECTION (placeholder) */}
//           {activeMenu === "hospital" && (
//             <div className="alert alert-info">
//               Hospital Management Coming Soon 
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;




