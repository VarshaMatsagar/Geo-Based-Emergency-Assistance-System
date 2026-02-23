import React, { useEffect, useState } from "react";
import api from "../services/api";

const UserForm = ({ userId, onSuccess }) => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    roleId: 2 // Default to Citizen
  });

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch roles from database
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        console.log('Fetching roles...');
        const response = await api.get("/AdminUsers/roles");
        console.log('Roles response:', response.data);
        setRoles(response.data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        console.error("Error details:", error.response?.data);
      }
    };
    fetchRoles();
  }, []);

  // Load user for edit
  useEffect(() => {
    if (!userId) return;

    api.get(`/AdminUsers/${userId}`)
      .then(res => {
        setForm({
          userId: Number(userId),
          fullName: res.data.fullName,
          email: res.data.email,
          phoneNumber: res.data.phoneNumber,
          password: "",
          roleId: res.data.roleId || 2
        });
      })
      .catch(err => {
        console.error(err);
        alert("Failed to load user");
      });
  }, [userId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'roleId' ? Number(value) : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        roleId: form.roleId
      };

      // Only include password for new users
      if (!userId && form.password) {
        payload.password = form.password;
      }

      if (userId) {
        await api.put(`/AdminUsers/${userId}`, payload);
        alert("User updated successfully");
      } else {
        await api.post("/AdminUsers", payload);
        alert("User added successfully");
      }

      onSuccess();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card shadow-sm p-4" onSubmit={handleSubmit}>
      <h5 className="mb-3">{userId ? "Edit User" : "Add User"}</h5>

      <div className="mb-3">
        <label>Full Name</label>
        <input
          name="fullName"
          className="form-control"
          value={form.fullName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label>Email</label>
        <input
          type="email"
          name="email"
          className="form-control"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label>Phone Number</label>
        <input
          name="phoneNumber"
          className="form-control"
          value={form.phoneNumber}
          onChange={handleChange}
          required
        />
      </div>

      {!userId && (
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
      )}

      <div className="mb-3">
        <label>Role</label>
        <select
          name="roleId"
          className="form-select"
          value={form.roleId}
          onChange={handleChange}
        >
          {roles.length === 0 ? (
            <option value="">Loading roles...</option>
          ) : (
            roles.map(role => (
              <option key={role.roleId} value={role.roleId}>
                {role.roleName}
              </option>
            ))
          )}
        </select>
        {/* Debug info */}
        <small className="text-muted">Roles loaded: {roles.length}</small>
      </div>

      <button className="btn btn-primary" disabled={loading}>
        {loading ? "Saving..." : "Submit"}
      </button>
    </form>
  );
};

export default UserForm;
