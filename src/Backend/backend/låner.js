import React, { useState, useEffect } from "react";
import axios from "axios";

const Låner = () => {
  const [lånere, setLånere] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/låner")
      .then((response) => {
        setLånere(response.data);  // Her bruker du setLånere og ikke setReservasjoner
      })
      .catch((error) => {
        console.error("Feil ved henting av lånere:", error);
        setError("Kunne ikke laste lånere. Prøv igjen senere.");
      });
  }, []);

  return (
    <div>
      <h2>Lånere</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Lånernummer</th>
            <th>Fornavn</th>
            <th>Etternavn</th>
            <th>E-post</th>
          </tr>
        </thead>
        <tbody>
          {lånere.map((låner) => (
            <tr key={låner.lånernummer}>
              <td>{låner.lånernummer}</td>
              <td>{låner.fornavn}</td>
              <td>{låner.etternavn}</td>
              <td>{låner.epost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Låner;
