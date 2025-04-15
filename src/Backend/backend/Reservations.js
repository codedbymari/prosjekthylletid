import { useEffect, useState } from "react";
import axios from "axios";

function Reservations() {
    const [reservasjoner, setReservasjoner] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);  // Ny state for å håndtere lasting

    useEffect(() => {
        console.log("Henter data fra backend...");
        axios.get("http://localhost:5000/reservasjoner")
            .then((response) => {
                console.log("Data mottatt:", response.data);
                if (response.data && response.data.length > 0) {
                    setReservasjoner(response.data);
                    console.log("Reservasjoner etter oppdatering:", response.data);  // Vis dataen før vi oppdaterer state
                } else {
                    console.log("Ingen data mottatt");
                }
                setLoading(false);  // Sett loading til false etter at data er hentet
            })
            .catch((error) => {
                console.error("Feil ved henting av reservasjoner:", error);
                setError("Kunne ikke laste reservasjoner. Prøv igjen senere.");
                setLoading(false);  // Sett loading til false i tilfelle feil
            });
    }, []);

    return (
        <div>
            <h1>Alle reserveringer</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading ? (
                <p>Laster inn reservasjonsdata...</p>  // Vist mens dataene lastes
            ) : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>Tittel</th>
                            <th>Forfatter</th>
                            <th>Lånernummer</th>
                            <th>Reservert dato</th>
                            <th>Klar dato</th>
                            <th>Hentet dato</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservasjoner.length > 0 ? (
                            reservasjoner.map((res) => (
                                <tr key={res.id}>
                                    <td>{res.tittel}</td>
                                    <td>{res.forfatter}</td>
                                    <td>{res.lånernummer}</td>
                                    <td>{res.reservert_dato}</td>
                                    <td>{res.klar_dato}</td>
                                    <td>{res.hentet_dato || "Ikke hentet"}</td>
                                    <td>{res.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7">Ingen reservasjoner funnet.</td></tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Reservations;
