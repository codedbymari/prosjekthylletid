import { useEffect, useState } from "react";
import axios from "axios";

function Reservations() {
    const [reservasjoner, setReservasjoner] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:3000/reservasjoner").then((response) => {
            setReservasjoner(response.data);
        });
    }, []);

    return (
        <div>
            <h1>Aktive reserveringer</h1>
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
                    {reservasjoner.map((res) => (
                        <tr key={res.id}>
                            <td>{res.tittel}</td>
                            <td>{res.forfatter}</td>
                            <td>{res.lånernummer}</td>
                            <td>{res.reservert_dato}</td>
                            <td>{res.klar_dato}</td>
                            <td>{res.hentet_dato === "-" ? "Ikke hentet" : res.hentet_dato}</td>
                            <td>{res.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Reservations;
