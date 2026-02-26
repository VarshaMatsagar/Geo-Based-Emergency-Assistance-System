import React, { useEffect, useState } from "react";
import { Table, Spinner } from "react-bootstrap";
import { feedbackAPI } from "../services/api";

const MyFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await feedbackAPI.getMyFeedbacks(); // Pass userId if needed
        setFeedbacks(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (loading) return <Spinner animation="border" />;

  return (
    <div>
      <h5 className="mb-3">Your Feedbacks</h5>
      {feedbacks.length === 0 ? (
        <p>You haven’t submitted any feedback yet.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Rating</th>
              <th>Comments</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((f) => (
              <tr key={f.feedback_id}>
                <td>{f.rating}</td>
                <td>{f.comments}</td>
                <td>{new Date(f.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default MyFeedbacks;
