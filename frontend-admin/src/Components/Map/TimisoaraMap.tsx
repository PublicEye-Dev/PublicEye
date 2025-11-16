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
import rawGeoJson from "../../Data/Map/export.geojson?raw";
import "./TimisoaraMap.css";
import type { ReportIssue, Status } from "../../Types/report";
import type { Alerta } from "../../Types/alert";
import { getStatusLabel } from "../../Utils/reportHelpers";
import { useReportStore } from "../../Store/reportStore";

type FeatureProperties = { name?: string; [key: string]: unknown };

type TimisoaraMapProps = {
  issues?: ReportIssue[];
  alerte?: Alerta[];
  onMarkerClick?: (issueId: string) => void;
  onAlertaClick?: (alerta: Alerta) => void;
};

const featureCollection = JSON.parse(rawGeoJson) as GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  FeatureProperties
>;

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

const polygonCollection: GeoJSON.FeatureCollection<
  GeoJSON.Polygon | GeoJSON.MultiPolygon,
  FeatureProperties
> = {
  type: "FeatureCollection",
  features: polygonFeatures,
};

const timisoaraBoundary =
  polygonFeatures.find((feature) => feature.properties?.name === "Timișoara") ??
  null;

function createMaskFeature(
  feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>
): GeoJSON.Feature<GeoJSON.Polygon> {
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

const boundaryMask = timisoaraBoundary ? createMaskFeature(timisoaraBoundary) : null;

const TIMISOARA_CENTER: LatLngExpression = [45.7489, 21.2087];
const DEFAULT_ZOOM = 13;

const markerIcons: Record<Status, L.DivIcon> = {
  DEPUSA: createStatusIcon("depusa"),
  PLANIFICATA: createStatusIcon("planificata"),
  IN_LUCRU: createStatusIcon("in-lucru"),
  REZOLVATA: createStatusIcon("rezolvata"),
  REDIRECTIONATA: createStatusIcon("redirectionata"),
};

function createStatusIcon(modifier: string): L.DivIcon {
  return L.divIcon({
    className: `report-marker-icon report-marker-icon--${modifier}`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
    html: '<span class="report-marker-bullet"></span>',
  });
}

function createAlertaIcon(): L.DivIcon {
  const icon = L.divIcon({
    className: "alerta-marker-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -32],
    html: '<span class="alerta-marker-pulse"></span>',
  });
  console.log("Icon alertă creat:", icon);
  return icon;
}

const fallbackBounds = L.latLngBounds([
  [45.6, 20.9],
  [45.95, 21.4],
]);

// Helper function pentru calcularea bounds exacte (fără padding)
function getExactBounds(): L.LatLngBounds {
  if (!timisoaraBoundary) {
    return fallbackBounds;
  }
  const layer = L.geoJSON(timisoaraBoundary);
  const bounds = layer.getBounds(); // FĂRĂ padding pentru verificare exactă
  layer.remove();
  return bounds;
}

// Helper function pentru verificare dacă un punct este în interiorul poligonului Timișoara
// Folosind algoritm "point in polygon" (ray casting)
function isPointInTimisoara(lat: number, lng: number): boolean {
  if (!timisoaraBoundary) {
    // Fallback la bounds rectangular dacă nu avem GeoJSON
    return fallbackBounds.contains([lat, lng] as LatLngExpression);
  }

  // Verifică mai întâi bounding box-ul pentru performanță
  const exactBounds = getExactBounds();
  if (!exactBounds.contains([lat, lng] as LatLngExpression)) {
    return false;
  }

  // Verificare exactă folosind algoritm "point in polygon"
  return isPointInPolygon(lat, lng, timisoaraBoundary);
}

// Helper function pentru verificarea "point in polygon" folosind ray casting
// În GeoJSON, coordonatele sunt [longitude, latitude]
function isPointInPolygon(lat: number, lng: number, feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>): boolean {
  // x = lng, y = lat
  const x = lng;
  const y = lat;

  // Normalizează la o listă de poligoane (fiecare cu rings: [outer, hole1, hole2, ...])
  const polygons: number[][][] = feature.geometry.type === "Polygon"
    ? [feature.geometry.coordinates[0]] // outer ring
    : feature.geometry.coordinates.map((poly) => poly[0]);

  const holes: number[][][] = feature.geometry.type === "Polygon"
    ? feature.geometry.coordinates.slice(1)
    : feature.geometry.coordinates.flatMap((poly) => poly.slice(1));

  const pointInRing = (ring: number[][]): boolean => {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0]; // lng
      const yi = ring[i][1]; // lat
      const xj = ring[j][0];
      const yj = ring[j][1];

      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  const insideAnyOuter = polygons.some((outer) => pointInRing(outer));
  if (!insideAnyOuter) return false;

  const insideAnyHole = holes.some((hole) => pointInRing(hole));
  return !insideAnyHole;
}

export default function TimisoaraMap({
  issues = [],
  alerte = [],
  onMarkerClick,
  onAlertaClick,
}: TimisoaraMapProps) {
  const { loadReportDetails } = useReportStore();
  const mapRef = useRef<LeafletMap | null>(null);

  const maxBounds = useMemo(() => {
    if (!timisoaraBoundary) {
      return fallbackBounds;
    }
    const layer = L.geoJSON(timisoaraBoundary);
    const bounds = layer.getBounds().pad(0.08); // Padding doar pentru navigare hartă
    layer.remove();
    return bounds;
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

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
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        minZoom={12}
        maxZoom={20}
        noWrap
      />

      <ZoomControl position="bottomright" />

      {boundaryMask && (
        <GeoJSON
          data={boundaryMask}
          style={{
            color: "transparent",
            weight: 0,
            fillColor: "#1f2937",
            fillOpacity: 0.35,
            fillRule: "evenodd",
          }}
          interactive={false}
        />
      )}

      <GeoJSON
        data={polygonCollection}
        style={(feature) => {
          const properties = feature?.properties as FeatureProperties | undefined;
          const isTimisoara = properties?.name === "Timișoara";
          return {
            color: "#FF6B35",
            weight: isTimisoara ? 2 : 1,
            fillColor: isTimisoara ? "#FFEDD5" : "#E0F2FE",
            fillOpacity: isTimisoara ? 0.05 : 0.03,
          };
        }}
      />

      {issues.map((issue) => {
        // Verifică dacă coordonatele sunt în interiorul municipiului Timișoara
        const [lat, lng] = issue.position;
        if (!isPointInTimisoara(lat, lng)) {
          console.warn("Sesizare în afara municipiului Timișoara:", issue.id, issue.position);
          return null;
        }

        const statusLabel = getStatusLabel(issue.status);
        const icon = markerIcons[issue.status] ?? markerIcons.DEPUSA;
        const statusModifier = issue.status.toLowerCase();
        return (
          <Marker
            key={issue.id}
            position={issue.position}
            icon={icon}
            eventHandlers={{
              click: () => {
                loadReportDetails(Number(issue.id));
                onMarkerClick?.(issue.id);
              },
            }}
          >
            <Popup className="issue-popup">
              <div className="issue-popup-header">
                <h3>{issue.categoryName || issue.title}</h3>
              </div>

              <p className="issue-popup-description">{issue.description}</p>

              <div
                className={`issue-popup-status issue-status-${statusModifier}`}
              >
                {statusLabel}
              </div>

              <div className="issue-popup-meta">
                <div className="issue-popup-meta-item">
                  <span className="issue-popup-meta-label">Voturi</span>
                  <span className="issue-popup-meta-value">{issue.votes}</span>
                </div>
                {issue.updatedAtLabel && (
                  <div className="issue-popup-meta-item">
                    <span className="issue-popup-meta-label">Actualizată</span>
                    <span className="issue-popup-meta-value">
                      {issue.updatedAtLabel}
                    </span>
                  </div>
                )}
              </div>

              {issue.imageUrl && (
                <div className="issue-popup-image">
                  <img src={issue.imageUrl} alt={issue.title} />
                </div>
              )}
            </Popup>
          </Marker>
        );
      })}

      {alerte && alerte.length > 0 && alerte.map((alerta) => {
        if (!alerta.latitude || !alerta.longitude) {
          console.warn("Alertă fără coordonate:", alerta);
          return null;
        }
        const position: LatLngExpression = [alerta.latitude, alerta.longitude];
        
        // Verifică dacă coordonatele sunt în interiorul municipiului Timișoara
        if (!isPointInTimisoara(alerta.latitude, alerta.longitude)) {
          console.warn("Alertă în afara municipiului Timișoara - nu se afișează:", alerta.id, position);
          return null;
        }
        
        const alertaIcon = createAlertaIcon();
        return (
          <Marker
            key={`alerta-${alerta.id}`}
            position={position}
            icon={alertaIcon}
            zIndexOffset={1000}
            eventHandlers={{
              click: () => {
                console.log("Click pe alertă:", alerta.id);
                onAlertaClick?.(alerta);
              },
              add: (e) => {
                const marker = e.target;
                const latlng = marker.getLatLng();
                console.log("Marker alertă adăugat pe hartă:", alerta.id, "la:", latlng);
                // Verifică dacă elementul HTML există în DOM
                const el = marker.getElement();
                if (el) {
                  console.log("Element marker găsit în DOM:", el);
                  const pulseEl = el.querySelector('.alerta-marker-pulse');
                  if (pulseEl) {
                    console.log("Element pulse găsit:", pulseEl);
                  } else {
                    console.warn("Element pulse NU găsit în marker!");
                  }
                } else {
                  console.warn("Element marker NU găsit în DOM!");
                }
              },
            }}
          >
            <Popup className="alerta-popup">
              <div className="alerta-popup-header">
                <h3>🚨 {alerta.tipPericol}</h3>
              </div>
              <p className="alerta-popup-zone">
                <strong>Zonă:</strong> {alerta.zona}
              </p>
              <p className="alerta-popup-description">{alerta.descriere}</p>
              {alerta.createdAt && (
                <p className="alerta-popup-date">
                  <strong>Emisă:</strong> {new Date(alerta.createdAt).toLocaleString("ro-RO")}
                </p>
              )}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

