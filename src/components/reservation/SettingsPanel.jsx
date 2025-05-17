// src/components/reservation/SettingsPanel.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiClock, FiMail, FiX, FiSave } from 'react-icons/fi';

function SettingsPanel({ 
  pickupTimeLimit, 
  reminderDays, 
  saveSettings, 
  showToast,
  sendAutomaticReminders
}) {
  const [tempSettings, setTempSettings] = useState(null);

  const handleSave = () => {
    saveSettings(tempSettings);
    setTempSettings(null);
  };

  const handleCancel = () => {
    setTempSettings(null);
    showToast('Endringer avbrutt', 'info');
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <section className="settings-section">
          <div className="settings-header">
            <h2>Hentefrist og påminnelser</h2>
            <p className="settings-description">
              Konfigurer når reservasjoner utløper og når påminnelser skal sendes
            </p>
          </div>
          <div className="settings-content">
            <div className="setting-card">
              <div className="setting-card-header">
                <div className="setting-icon">
                  <FiClock />
                </div>
                <h3>Hentefrist</h3>
              </div>
              <div className="setting-card-content">
                <p>Antall dager en reservasjon kan vente på hentehyllen før den utløper</p>
                <div className="setting-input-group">
                  <div className="number-input-group setting-value">
                    <input 
                      type="number" 
                      id="pickup-time-limit"
                      min="1" 
                      max="30"
                      value={tempSettings?.pickupTimeLimit !== undefined ? tempSettings.pickupTimeLimit : pickupTimeLimit}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : parseInt(e.target.value);
                        setTempSettings(prev => ({
                          ...prev || {},
                          pickupTimeLimit: value
                        }));
                      }}
                    />
                    <span className="input-suffix">dager</span>
                  </div>
                </div>
              </div>
              <div className="setting-card-footer">
                <p className="setting-info">
                  Nåværende innstilling: <strong>{pickupTimeLimit} dager</strong>
                </p>
              </div>
            </div>

            <div className="setting-card">
              <div className="setting-card-header">
                <div className="setting-icon">
                  <FiMail />
                </div>
                <h3>Påminnelse</h3>
              </div>
              <div className="setting-card-content">
                <p>Antall dager før hentefrist som påminnelse sendes automatisk til låner</p>
                <div className="setting-input-group">
                  <div className="number-input-group setting-value">
                    <input 
                      type="number" 
                      id="reminder-days"
                      min="1" 
                      max={(tempSettings?.pickupTimeLimit || pickupTimeLimit) - 1}
                      value={tempSettings?.reminderDays !== undefined ? tempSettings.reminderDays : reminderDays}
                      onChange={(e) => {
                        const value = e.target.value === '' ? '' : parseInt(e.target.value);
                        setTempSettings(prev => ({
                          ...prev || {},
                          reminderDays: value
                        }));
                      }}
                    />
                    <span className="input-suffix">dager</span>
                  </div>
                </div>
              </div>
              <div className="setting-card-footer">
                <p className="setting-info">
                  Nåværende innstilling: <strong>{reminderDays} dager</strong> før utløp
                </p>
              </div>
            </div>
          </div>
          
          <div className="settings-actions">
            <button 
              className="btn-secondary"
              onClick={handleCancel}
              disabled={!tempSettings}
            >
              <FiX className="icon" />
              Avbryt endringer
            </button>
            
            <button 
              className="btn-primary"
              onClick={handleSave}
              disabled={!tempSettings}
            >
              <FiSave className="icon" />
              Lagre innstillinger
            </button>
          </div>
        </section>
        
        <section className="settings-section">
          <div className="settings-header">
          </div>
          <div className="auto-reminder-info">
            <div className="info-card">
              <div className="info-icon">
                <FiMail />
              </div>
              <div className="info-content">
                <p>
                  Påminnelser sendes automatisk til lånere <strong>{reminderDays} dager</strong> før hentefristen 
                  utløper. Dette hjelper lånere å huske å hente reservert materiale i tide.
                </p>
                <p>
                  Påminnelser sendes via e-post og/eller SMS, avhengig av lånerens kontaktpreferanser.
                
                </p>
                
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

SettingsPanel.propTypes = {
  pickupTimeLimit: PropTypes.number.isRequired,
  reminderDays: PropTypes.number.isRequired,
  saveSettings: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired,
  sendAutomaticReminders: PropTypes.func.isRequired
};

export default SettingsPanel;