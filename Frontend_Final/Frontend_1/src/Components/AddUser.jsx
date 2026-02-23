import React from "react";
import { useNavigate } from "react-router-dom";
import UserForm from "./UserForm";

const AddUser = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate("/admin")}>← Back</button>
      <UserForm onSuccess={() => navigate("/admin")} />
    </div>
  );
};

export default AddUser;
