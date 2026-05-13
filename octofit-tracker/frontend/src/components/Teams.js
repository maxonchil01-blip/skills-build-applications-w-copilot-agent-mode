import React, { useState, useEffect } from 'react';

const Teams = () => {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const baseApiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api';
  const endpoint = `${baseApiUrl}/teams/`;
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const fetchTeams = () => {
    console.log('Fetching Teams from', endpoint);
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('Teams fetched data:', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setTeams(items);
        setFilteredTeams(items);
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching teams:', err);
        setError(err.message || 'Failed to fetch teams');
      });
  };

  useEffect(() => {
    fetchTeams();
  }, [endpoint]);

  const handleSearch = (event) => {
    event.preventDefault();
    const term = query.trim().toLowerCase();
    const items = term
      ? teams.filter((team) =>
          [team.name, (team.members || []).join(' ')].join(' ').toLowerCase().includes(term)
        )
      : teams;
    setFilteredTeams(items);
  };

  const openModal = (team) => {
    setSelectedTeam(team);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTeam(null);
  };

  return (
    <div className="page-section">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
        <div>
          <h2 className="h3">Teams</h2>
          <p className="text-muted mb-0">Endpoint: <span className="text-break">{endpoint}</span></p>
        </div>
        <button type="button" className="btn btn-outline-primary mt-3 mt-md-0" onClick={fetchTeams}>
          Refresh Teams
        </button>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form className="row g-2 align-items-center mb-4" onSubmit={handleSearch}>
            <div className="col-sm-8">
              <label htmlFor="teamsSearch" className="form-label visually-hidden">
                Search Teams
              </label>
              <input
                id="teamsSearch"
                type="text"
                className="form-control"
                value={query}
                placeholder="Search teams or members"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="col-sm-4 d-grid">
              <button type="submit" className="btn btn-primary">
                Filter Teams
              </button>
            </div>
          </form>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Team</th>
                  <th>Members</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((team, idx) => (
                  <tr key={team.id || idx}>
                    <td>{team.name || '—'}</td>
                    <td>{(team.members || []).join(', ') || 'No members yet'}</td>
                    <td className="text-end">
                      <button type="button" className="btn btn-sm btn-link" onClick={() => openModal(team)}>
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && selectedTeam && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Team Details</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
              </div>
              <div className="modal-body">
                <pre className="bg-light p-3 rounded">{JSON.stringify(selectedTeam, null, 2)}</pre>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </div>
      )}
    </div>
  );
};

export default Teams;
