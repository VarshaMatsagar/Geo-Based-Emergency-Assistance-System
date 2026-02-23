import { useNavigate, useParams } from "react-router-dom";
import UserForm from "./UserForm";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <button
        className="btn btn-secondary mb-3"
        onClick={() => navigate("/admin")}
      >
        ← Back
      </button>

      <UserForm
        userId={id}
        onSuccess={() => navigate("/admin")}
      />
    </div>
  );
};

export default EditUser;
