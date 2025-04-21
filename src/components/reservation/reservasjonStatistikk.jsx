import React, { useState, useEffect } from "react";
import axios from "axios";

const Statistikk = () => {
  const [statistikk, setStatistikk] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/statistikk")
      .then((response) => {
        setStatistikk(response.data);  // Setter inn statistikken over reservasjoner per låner
      })
      .catch((error) => {
        console.error("Feil ved henting av statistikk:", error);
        setError("Kunne ikke laste statistikk. Prøv igjen senere.");
      });
  }, []);

  return (
    <div>
      <h2>Statistikk over reservasjoner per låner</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Lånernummer</th>
            <th>Fornavn</th>
            <th>Etternavn</th>
            <th>Antall Reservasjoner</th>
          </tr>
        </thead>
        <tbody>
          {statistikk.map((stat) => (
            <tr key={stat.laaner_id}>
              <td>{stat.laaner_id}</td>
              <td>{stat.fornavn}</td>
              <td>{stat.etternavn}</td>
              <td>{stat.antall_reservasjoner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Statistikk;
