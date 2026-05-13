import React, { useState, useEffect } from 'react';

const Users = () => {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const codespaceEndpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/users/`
    : null;
  const baseApiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api';
  const endpoint = codespaceEndpoint || `${baseApiUrl}/users/`;
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = () => {
    console.log('Fetching Users from', endpoint);
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('Users fetched data:', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setUsers(items);
        setFilteredUsers(items);
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setError(err.message || 'Failed to fetch users');
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [endpoint]);

  const handleSearch = (event) => {
    event.preventDefault();
    const term = query.trim().toLowerCase();
    const items = term
      ? users.filter((user) =>
          [user.name, user.email, user.team]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(term)
        )
      : users;
    setFilteredUsers(items);
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="page-section">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
        <div>
          <h2 className="h3">Users</h2>
          <p className="text-muted mb-0">Endpoint: <span className="text-break">{endpoint}</span></p>
        </div>
        <button type="button" className="btn btn-outline-primary mt-3 mt-md-0" onClick={fetchUsers}>
          Refresh Users
        </button>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form className="row g-2 align-items-center mb-4" onSubmit={handleSearch}>
            <div className="col-sm-8">
              <label htmlFor="usersSearch" className="form-label visually-hidden">
                Search Users
              </label>
              <input
                id="usersSearch"
                type="text"
                className="form-control"
                value={query}
                placeholder="Search name, email or team"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="col-sm-4 d-grid">
              <button type="submit" className="btn btn-primary">
                Filter Users
              </button>
            </div>
          </form>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Team</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, idx) => (
                  <tr key={user.id || idx}>
                    <td>{user.name || '—'}</td>
                    <td>{user.email || '—'}</td>
                    <td>{user.team || 'Unassigned'}</td>
                    <td className="text-end">
                      <button type="button" className="btn btn-sm btn-link" onClick={() => openModal(user)}>
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

      {showModal && selectedUser && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Details</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
              </div>
              <div className="modal-body">
                <pre className="bg-light p-3 rounded">{JSON.stringify(selectedUser, null, 2)}</pre>
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

export default Users;
