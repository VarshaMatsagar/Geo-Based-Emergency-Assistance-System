import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Admin not logged in");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:8081/api/contact/admin/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setContacts(response.data);
      } catch (error) {
        console.error(error);
        alert("Failed to load contact queries");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []); // ✅ empty dependency = runs once on mount

  if (loading) {
    return <div className="container py-4">Loading contact queries...</div>;
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Contact Queries</h2>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Created At</th>
          </tr>
        </thead>

        <tbody>
          {contacts.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No queries found
              </td>
            </tr>
          ) : (
            contacts.map((c) => (
              <tr key={c.contactId}>
                <td>{c.fullName}</td>
                <td>{c.email}</td>
                <td>{c.message}</td>
                <td>{new Date(c.createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminContactList;
