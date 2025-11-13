import { useMemo } from "react";
import TimisoaraMap from "../../Components/Map/TimisoaraMap";
import "./MapPage.css";
import Navbar from "../../Components/Layout/Navbar/Navbar";

type Issue = {
  id: string;
  title: string;
  status: string;
  position: [number, number];
};

const mockIssues: Issue[] = [
  {
    id: "1",
    title: "Groapă în carosabil - Str. Gheorghe Lazăr",
    status: "În lucru",
    position: [45.757, 21.221],
  },
  {
    id: "2",
    title: "Gunoi neridicat - Piața 700",
    status: "Nouă",
    position: [45.754, 21.229],
  },
];

export default function MapPage() {
  const issues = useMemo(() => mockIssues, []);

  return (
    <div className="map-page">
      <header className="map-page-header">
       <Navbar/>
      </header>

      <section className="map-page-content">
        <TimisoaraMap issues={issues} />
      </section>
    </div>
  );
}
