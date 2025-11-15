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
import "./TimisoaraMap.css";
import rawGeoJson from "../../Data/Map/export.geojson?raw";
import type { ReportIssue, Status } from "../../Types/report";
import { getStatusLabel } from "../../Utils/reportHelpers";
import { useReportStore } from "../../Store/reportStore";

type FeatureProperties = { name?: string; [key: string]: unknown };

type TimisoaraMapProps = {
  issues?: ReportIssue[];
  onMarkerClick?: (issueId: string) => void;
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

const boundaryMask = timisoaraBoundary
  ? createMaskFeature(timisoaraBoundary)
  : null;

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
const fallbackBounds = L.latLngBounds([
  [45.6, 20.9],
  [45.95, 21.4],
]);

export default function TimisoaraMap({
  issues = [],
  onMarkerClick,
}: TimisoaraMapProps) {
  const { loadReportDetails } = useReportStore();
  const mapRef = useRef<LeafletMap | null>(null);

  const maxBounds = useMemo(() => {
    if (!timisoaraBoundary) {
      return fallbackBounds;
    }
    const layer = L.geoJSON(timisoaraBoundary);
    const bounds = layer.getBounds().pad(0.08);
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

      {issues.map((issue) => {
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
    </MapContainer>
  );
}
