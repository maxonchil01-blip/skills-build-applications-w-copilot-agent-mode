import React, { useState, useEffect } from 'react';

const Activities = () => {
  const baseApiUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`
    : 'http://localhost:8000/api';
  const endpoint = `${baseApiUrl}/activities/`;
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching Activities from', endpoint);
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('Activities fetched data:', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setActivities(items);
      })
      .catch((err) => {
        console.error('Error fetching activities:', err);
        setError(err.message || 'Failed to fetch activities');
      });
  }, [endpoint]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Activities</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Activity</th>
            <th>User</th>
            <th>Distance</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, idx) => (
            <tr key={activity.id || idx}>
              <td>{activity.activity}</td>
              <td>{activity.user}</td>
              <td>{activity.distance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Activities;
