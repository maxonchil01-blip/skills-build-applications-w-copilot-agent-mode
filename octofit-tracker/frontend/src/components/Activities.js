import React, { useState, useEffect } from 'react';

const Activities = () => {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const baseApiUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api';
  const endpoint = `${baseApiUrl}/activities/`;
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const fetchActivities = () => {
    console.log('Fetching Activities from', endpoint);
    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        console.log('Activities fetched data:', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setActivities(items);
        setFilteredActivities(items);
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching activities:', err);
        setError(err.message || 'Failed to fetch activities');
      });
  };

  useEffect(() => {
    fetchActivities();
  }, [endpoint]);

  const handleSearch = (event) => {
    event.preventDefault();
    const term = query.trim().toLowerCase();
    const items = term
      ? activities.filter((activity) =>
          [activity.activity, activity.user, activity.distance]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(term)
        )
      : activities;
    setFilteredActivities(items);
  };

  const openModal = (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedActivity(null);
  };

  return (
    <div className="page-section">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
        <div>
          <h2 className="h3">Activities</h2>
          <p className="text-muted mb-0">Endpoint: <span className="text-break">{endpoint}</span></p>
        </div>
        <button type="button" className="btn btn-outline-primary mt-3 mt-md-0" onClick={fetchActivities}>
          Refresh Activities
        </button>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form className="row g-2 align-items-center mb-4" onSubmit={handleSearch}>
            <div className="col-sm-8">
              <label htmlFor="activitySearch" className="form-label visually-hidden">
                Search Activities
              </label>
              <input
                id="activitySearch"
                type="text"
                className="form-control"
                value={query}
                placeholder="Search activities, user, or distance"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="col-sm-4 d-grid">
              <button type="submit" className="btn btn-primary">
                Filter Activities
              </button>
            </div>
          </form>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Activity</th>
                  <th>User</th>
                  <th>Distance</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.map((activity, idx) => (
                  <tr key={activity.id || idx}>
                    <td>{activity.activity || '—'}</td>
                    <td>{activity.user || '—'}</td>
                    <td>{activity.distance || '—'}</td>
                    <td className="text-end">
                      <button type="button" className="btn btn-sm btn-link" onClick={() => openModal(activity)}>
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

      {showModal && selectedActivity && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Activity Details</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
              </div>
              <div className="modal-body">
                <pre className="bg-light p-3 rounded">{JSON.stringify(selectedActivity, null, 2)}</pre>
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

export default Activities;
