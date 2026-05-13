import React, { useState, useEffect } from 'react';

const Teams = () => {
  const baseApiUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`
    : 'http://localhost:8000/api';
  const endpoint = `${baseApiUrl}/teams/`;
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching Teams from', endpoint);
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('Teams fetched data:', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setTeams(items);
      })
      .catch((err) => {
        console.error('Error fetching teams:', err);
        setError(err.message || 'Failed to fetch teams');
      });
  }, [endpoint]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Teams</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {teams.map((team, idx) => (
          <div key={team.id || idx} className="col-md-6 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary">{team.name}</h5>
                <p className="card-text"><strong>Members:</strong> {team.members?.join(', ')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teams;
