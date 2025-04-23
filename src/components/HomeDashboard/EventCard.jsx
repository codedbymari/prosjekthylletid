import React from "react";
import { FiEye, FiEdit, FiMapPin, FiUsers } from "react-icons/fi";

const EventCard = ({ event, handleViewEventDetails, handleEditEvent }) => {
  return (
    <div className="event-details">
      <div className="event-header">
        <h3 className="event-title">
          {event.title}
          {event.isNew && <span className="event-tag new">Ny</span>}
          {event.isFeatured && <span className="event-tag featured">Anbefalt</span>}
        </h3>
        <div className="event-actions">
          <button
            className="event-action-button"
            onClick={() => handleViewEventDetails(event)}
            aria-label="Se detaljer"
          >
            <FiEye />
          </button>
          <button
            className="event-action-button"
            onClick={() => handleEditEvent(event)}
            aria-label="Rediger"
          >
            <FiEdit />
          </button>
        </div>
      </div>

      <p className="event-description">{event.description}</p>

      <div className="event-meta">
        <div className="event-location">
          <FiMapPin />
          <span>{event.location}</span>
        </div>

        <div className="event-attendance">
          <div className="attendance-text">
            <FiUsers className="mini-icon" />
            <span>{event.attendees}/{event.maxAttendees} påmeldte</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
