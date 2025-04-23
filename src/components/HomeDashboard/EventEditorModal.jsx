import React from "react";
import {
  FiX,
  FiEdit,
  FiTrash2,
  FiSave,
  FiAlertCircle
} from "react-icons/fi";

const EventEditorModal = ({
  showEventEditor,
  editingEvent,
  setShowEventEditor,
  handleInputChange,
  handleNumberChange,
  handleCheckboxChange,
  handleSaveEvent,
  handleDeleteEvent,
  modalRef
}) => {
  if (!showEventEditor || !editingEvent) return null;

  return (
    <div className="modal-overlay">
      <div className="modal event-editor-modal" ref={modalRef}>
        <div className="modal-header">
          <h2>{editingEvent.id === Date.now() ? 'Nytt arrangement' : 'Rediger arrangement'}</h2>
          <button
            className="close-button"
            onClick={() => setShowEventEditor(false)}
            aria-label="Lukk"
          >
            <FiX />
          </button>
        </div>

        <div className="modal-content">
          <form className="event-edit-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="title">Tittel</label>
              <input
                type="text"
                id="title"
                name="title"
                value={editingEvent.title}
                onChange={handleInputChange}
                required
                aria-required="true"
                placeholder="Skriv inn tittel på arrangementet"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Beskrivelse</label>
              <textarea
                id="description"
                name="description"
                value={editingEvent.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Skriv en beskrivelse av arrangementet"
                aria-describedby="desc-hint"
              ></textarea>
              <small id="desc-hint" className="form-hint">
                Beskriv arrangementet kort og presist for deltakerne
              </small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Dato</label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  value={editingEvent.date}
                  onChange={handleInputChange}
                  placeholder="DD.MM.ÅÅÅÅ"
                  pattern="\d{2}\.\d{2}\.\d{4}"
                  aria-describedby="date-hint"
                />
                <small id="date-hint" className="form-hint">
                  Format: DD.MM.ÅÅÅÅ
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="time">Tidspunkt</label>
                <input
                  type="text"
                  id="time"
                  name="time"
                  value={editingEvent.time}
                  onChange={handleInputChange}
                  placeholder="HH:MM - HH:MM"
                  aria-describedby="time-hint"
                />
                <small id="time-hint" className="form-hint">
                  Format: HH:MM - HH:MM
                </small>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Sted</label>
              <input
                type="text"
                id="location"
                name="location"
                value={editingEvent.location}
                onChange={handleInputChange}
                placeholder="Skriv inn sted for arrangementet"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="attendees">Antall påmeldte</label>
                <input
                  type="number"
                  id="attendees"
                  name="attendees"
                  value={editingEvent.attendees}
                  onChange={handleNumberChange}
                  min="0"
                  max={editingEvent.maxAttendees}
                />
              </div>

              <div className="form-group">
                <label htmlFor="maxAttendees">Maks antall</label>
                <input
                  type="number"
                  id="maxAttendees"
                  name="maxAttendees"
                  value={editingEvent.maxAttendees}
                  onChange={handleNumberChange}
                  min={editingEvent.attendees}
                />
              </div>
            </div>

            <div className="form-row checkbox-row">
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="isNew"
                  name="isNew"
                  checked={editingEvent.isNew}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="isNew">Marker som nytt</label>
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={editingEvent.isFeatured}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="isFeatured">Marker som anbefalt</label>
              </div>
            </div>
          </form>

          <div className="form-feedback">
            {editingEvent.title.trim() === '' && (
              <p className="error-message">
                <FiAlertCircle /> Arrangementet må ha en tittel
              </p>
            )}
          </div>

          <div className="modal-actions">
            {editingEvent.id !== Date.now() && (
              <button
                className="modal-button danger"
                onClick={handleDeleteEvent}
                type="button"
              >
                <FiTrash2 /> Slett
              </button>
            )}
            <button
              className="modal-button secondary"
              onClick={() => setShowEventEditor(false)}
              type="button"
            >
              Avbryt
            </button>
            <button
              className="modal-button primary"
              onClick={handleSaveEvent}
              type="button"
              disabled={editingEvent.title.trim() === ''}
            >
              <FiSave /> Lagre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventEditorModal;
