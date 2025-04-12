import React, { useState, useEffect } from "react";

const Låner = () => {
  const [lånere, setLånere] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/lånere")
      .then((response) => response.json())
      .then((data) => setLånere(data))
      .catch((err) => {
        setError("Kunne ikke hente lånere");
        console.error(err);
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
