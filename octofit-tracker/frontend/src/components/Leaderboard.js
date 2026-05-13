import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const codespaceEndpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
    : null;
  const baseApiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api';
  const endpoint = codespaceEndpoint || `${baseApiUrl}/leaderboard/`;
  const [leaderboard, setLeaderboard] = useState([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeaderboard = () => {
    console.log('Fetching Leaderboard from', endpoint);
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('Leaderboard fetched data:', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setLeaderboard(items);
        setFilteredLeaderboard(items);
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching leaderboard:', err);
        setError(err.message || 'Failed to fetch leaderboard');
      });
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [endpoint]);

  const handleSearch = (event) => {
    event.preventDefault();
    const term = query.trim().toLowerCase();
    const items = term
      ? leaderboard.filter((entry) =>
          [entry.team, String(entry.points)]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(term)
        )
      : leaderboard;
    setFilteredLeaderboard(items);
  };

  const openModal = (entry) => {
    setSelectedEntry(entry);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEntry(null);
  };

  return (
    <div className="page-section">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
        <div>
          <h2 className="h3">Leaderboard</h2>
          <p className="text-muted mb-0">Endpoint: <span className="text-break">{endpoint}</span></p>
        </div>
        <button type="button" className="btn btn-outline-primary mt-3 mt-md-0" onClick={fetchLeaderboard}>
          Refresh Leaderboard
        </button>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form className="row g-2 align-items-center mb-4" onSubmit={handleSearch}>
            <div className="col-sm-8">
              <label htmlFor="leaderboardSearch" className="form-label visually-hidden">
                Search Leaderboard
              </label>
              <input
                id="leaderboardSearch"
                type="text"
                className="form-control"
                value={query}
                placeholder="Search teams or points"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="col-sm-4 d-grid">
              <button type="submit" className="btn btn-primary">
                Filter Leaderboard
              </button>
            </div>
          </form>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Team</th>
                  <th>Points</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaderboard.map((entry, idx) => (
                  <tr key={entry.id || idx}>
                    <td>{entry.team || '—'}</td>
                    <td>
                      <span className="badge bg-primary rounded-pill">{entry.points ?? '0'}</span>
                    </td>
                    <td className="text-end">
                      <button type="button" className="btn btn-sm btn-link" onClick={() => openModal(entry)}>
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

      {showModal && selectedEntry && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Leaderboard Entry</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
              </div>
              <div className="modal-body">
                <pre className="bg-light p-3 rounded">{JSON.stringify(selectedEntry, null, 2)}</pre>
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

export default Leaderboard;
