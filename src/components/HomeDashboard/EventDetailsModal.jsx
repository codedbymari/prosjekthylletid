import React from "react";
import { FiX, FiCalendar, FiClock, FiLocation, FiUsers, FiEdit } from "react-icons/fi";

const EventDetailsModal = ({
  showEventDetails,
  selectedEvent,
  setShowEventDetails,
  handleEditEvent,
  modalRef
}) => {
  if (!showEventDetails || !selectedEvent) return null;

  return (
    <div className="modal-overlay">
      <div className="modal event-details-modal" ref={modalRef}>
        <div className="modal-header">
          <h2>Arrangementsdetaljer</h2>
          <button
            className="close-button"
            onClick={() => setShowEventDetails(false)}
            aria-label="Lukk"
          >
            <FiX />
          </button>
        </div>

        <div className="modal-content">
          <div className="event-detail-header">
            <h3>{selectedEvent.title}</h3>
            <div className="event-tags">
              {selectedEvent.isNew && <span className="event-tag new">Ny</span>}
              {selectedEvent.isFeatured && <span className="event-tag featured">Anbefalt</span>}
            </div>
          </div>

          <div className="event-detail-info">
            <div className="detail-item">
              <FiCalendar className="detail-icon" />
              <div>
                <strong>Dato</strong>
                <p>{selectedEvent.date}</p>
              </div>
            </div>

            <div className="detail-item">
              <FiClock className="detail-icon" />
              <div>
                <strong>Tidspunkt</strong>
                <p>{selectedEvent.time}</p>
              </div>
            </div>

            <div className="detail-item">
              <FiLocation className="detail-icon" />
              <div>
                <strong>Sted</strong>
                <p>{selectedEvent.location}</p>
              </div>
            </div>

            <div className="detail-item">
              <FiUsers className="detail-icon" />
              <div>
                <strong>Påmeldte</strong>
                <p>{selectedEvent.attendees} av {selectedEvent.maxAttendees} plasser</p>
                <div className="attendance-bar">
                  <div
                    className="attendance-fill"
                    style={{
                      width: `${(selectedEvent.attendees / selectedEvent.maxAttendees) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="event-description-full">
            <h4>Beskrivelse</h4>
            <p>{selectedEvent.description}</p>
          </div>

          <div className="modal-actions">
            <button
              className="modal-button secondary"
              onClick={() => setShowEventDetails(false)}
            >
              Lukk
            </button>
            <button
              className="modal-button primary"
              onClick={() => {
                setShowEventDetails(false);
                handleEditEvent(selectedEvent);
              }}
            >
              <FiEdit /> Rediger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
