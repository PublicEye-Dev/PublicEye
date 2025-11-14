import { useEffect, useMemo, useRef } from "react";
import type { LatLngExpression, Map as LeafletMap } from "leaflet";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  GeoJSON,
  ZoomControl,
} from "react-leaflet";
import rawGeoJson from "../../Data/Map/export.geojson?raw"; //importat cu ?raw ca sa vina ca text
import "./TimisoaraMap.css";
import type { ReportIssue } from "../../Types/report";

//tip generic pentru proprietatile fiecarui feature din GeoJSON
type FeatureProperties = {
  name?: string;
  [key: string]: unknown;
};

//props pentru componenta de map, trecem o lista de issues si o functie onMarkerClick(callback cand user-ul apasa pe un marker)
type TimisoaraMapProps = {
  issues?: ReportIssue[];
  onMarkerClick?: (issueId: string) => void;
};

const featureCollection = JSON.parse(rawGeoJson) as GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  FeatureProperties
>; //facem parse la geojson ca sa avem tipare typescript

//filtram poligoanele cu gemetry type ca sa lucram doar cu limitele teritoriale
function isPolygonFeature(
  feature: GeoJSON.Feature<GeoJSON.Geometry, FeatureProperties>
): feature is GeoJSON.Feature<
  GeoJSON.Polygon | GeoJSON.MultiPolygon,
  FeatureProperties
> {
  const geometryType = feature.geometry?.type;
  return geometryType === "Polygon" || geometryType === "MultiPolygon";
}

const polygonFeatures = featureCollection.features.filter(isPolygonFeature);

//reconstruiesc un feature collection doar cu poligaone, trimit direct la componenta GeoJSON
const polygonCollection: GeoJSON.FeatureCollection<
  GeoJSON.Polygon | GeoJSON.MultiPolygon,
  FeatureProperties
> = {
  type: "FeatureCollection",
  features: polygonFeatures,
};

//identific limita teritoriala a municipiului Timisoara
const timisoaraBoundary =
  polygonFeatures.find((feature) => feature.properties?.name === "Timișoara") ??
  null;

//construiesc un poligon outer ring cu coordonatele globale, apoi inserez conturul timisoarei ca hole. folosesc pentru a umbri restul hartii
function createMaskFeature(
  feature: GeoJSON.Feature<
    GeoJSON.Polygon | GeoJSON.MultiPolygon,
    FeatureProperties
  >
): GeoJSON.Feature<GeoJSON.Polygon, FeatureProperties> {
  const outerRing: GeoJSON.Position[] = [
    [-180, -85],
    [-180, 85],
    [180, 85],
    [180, -85],
    [-180, -85],
  ];

  const holes =
    feature.geometry.type === "Polygon"
      ? feature.geometry.coordinates
      : (feature.geometry.coordinates.flat() as GeoJSON.Position[][]);

  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [outerRing, ...holes],
    },
  };
}

const boundaryMask = timisoaraBoundary
  ? createMaskFeature(timisoaraBoundary)
  : null;

const TIMISOARA_CENTER: LatLngExpression = [45.7489, 21.2087];
const DEFAULT_ZOOM = 13;

const issueIcon = new L.Icon.Default();

const fallbackBounds = L.latLngBounds([
  [45.6, 20.9],
  [45.95, 21.4],
]);

export default function TimisoaraMap({
  issues = [],
  onMarkerClick,
}: TimisoaraMapProps) {
  const maxBounds = useMemo(() => {
    if (!timisoaraBoundary) {
      return fallbackBounds;
    }

    const layer = L.geoJSON(timisoaraBoundary);
    const bounds = layer.getBounds().pad(0.1); //10% padding pentru a putea vedea in jurul timisoarei
    layer.remove();
    return bounds;
  }, []);

  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    map.setMaxBounds(maxBounds);
    map.options.inertia = false;
  }, [maxBounds]);

  return (
    <MapContainer
      ref={mapRef}
      center={TIMISOARA_CENTER}
      zoom={DEFAULT_ZOOM}
      minZoom={12}
      maxZoom={20}
      maxBounds={maxBounds}
      maxBoundsViscosity={1}
      className="map-container"
      scrollWheelZoom
      zoomControl={false} //dezactivez zoom control default ca sa pot pune in alta pozitie
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        minZoom={12}
        maxZoom={20}
        noWrap
      />

      <ZoomControl position="bottomright" />

      {/*aplic masca, daca se gaseste conturul timisoarei, se deseneaza masca */}
      {boundaryMask && (
        <GeoJSON
          data={boundaryMask}
          style={{
            color: "transparent",
            weight: 0,
            fillColor: "#1f2937",
            fillOpacity: 0.35,
            fillRule: "evenodd", //folosim fillRule evenodd ca sa umbrim restul hartii
          }}
          interactive={false} //previne hover pe masca
        />
      )}

      <GeoJSON
        data={polygonCollection}
        style={(feature) => {
          const properties = feature?.properties as
            | FeatureProperties
            | undefined;
          const isTimisoara = properties?.name === "Timișoara";
          return {
            color: "#FF6B35",
            weight: isTimisoara ? 2 : 1,
            fillColor: isTimisoara ? "#FFEDD5" : "#E0F2FE",
            fillOpacity: isTimisoara ? 0.05 : 0.03,
          };
        }}
      />

      {issues.map((issue) => (
        <Marker
          key={issue.id}
          position={issue.position}
          icon={issueIcon}
          eventHandlers={{
            click: () => onMarkerClick?.(issue.id),
          }}
        >
          <Popup>
            <strong>{issue.title}</strong>
            <br />
            Status: {issue.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
