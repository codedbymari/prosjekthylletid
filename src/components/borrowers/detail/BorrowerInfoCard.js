// src/components/borrowers/detail/BorrowerInfoCard.jsx
import React from 'react';

function BorrowerInfoCard({ borrowerInfo, borrowerId }) {
  return (
    <div className="borrower-info-card">
      <div className="borrower-info-header">
        <h2>Lånerinformasjon</h2>
      </div>
      <div className="borrower-info-content two-columns">
        <div className="info-column">
          <div className="info-item">
            <span className="info-label">Lånernummer:</span>
            <span className="info-value">{borrowerId}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Epost:</span>
            <span className="info-value">{borrowerInfo.contact}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Mobil:</span>
            <span className="info-value">{borrowerInfo.mobil}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Adresse:</span>
            <span className="info-value">{borrowerInfo.address}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Fødselsdato:</span>
            <span className="info-value">{borrowerInfo.birthDate}</span>
          </div>
        </div>
        <div className="info-column">
          <div className="info-item">
            <span className="info-label">Totalt antall bøker:</span>
            <span className="info-value">{borrowerInfo.totalBooks}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Gjennomsnittlig utlånstid:</span>
            <span className="info-value">{borrowerInfo.averageRentalTime}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Medlemskap:</span>
            <span className="info-value membership-badge">{borrowerInfo.membership}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Bibliotek:</span>
            <span className="info-value library-badge">{borrowerInfo.libraryAffiliation}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BorrowerInfoCard;