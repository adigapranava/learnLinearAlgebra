import React from 'react';

const SettingsModal = ({
  settings,
  handleSettingChange,
}) => {
  return (
    <div
      className="modal fade custom-modal"
      id="settingsModal"
      tabIndex="-1"
      aria-labelledby="settingsModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="settingsModalLabel">Settings</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form>
              {/* Checkbox for Grid */}
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="showGridCheckbox"
                  checked={settings.showGrid}
                  onChange={(e) => handleSettingChange('showGrid', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="showGridCheckbox">
                  Show Grid
                </label>
              </div>

              {/* Checkbox for Transformed Grid */}
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="showTransformedGridCheckbox"
                  checked={settings.showTransformedGrid}
                  onChange={(e) => handleSettingChange('showTransformedGrid', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="showTransformedGridCheckbox">
                  Show Transformed Grid
                </label>
              </div>

              {/* Checkbox for Labels */}
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="showLabelsCheckbox"
                  checked={settings.showLabels}
                  onChange={(e) => handleSettingChange('showLabels', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="showLabelsCheckbox">
                  Show Labels
                </label>
              </div>

              {/* Checkbox for Vector Breakdown */}
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="showVectorBreakDownCheckbox"
                  checked={settings.showVectorBreakDown}
                  onChange={(e) => handleSettingChange('showVectorBreakDown', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="showVectorBreakDownCheckbox">
                  Show Vector Breakdown
                </label>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
