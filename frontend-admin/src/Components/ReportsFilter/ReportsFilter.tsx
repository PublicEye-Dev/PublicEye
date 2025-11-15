import { useEffect, useState } from "react";
import "./ReportsFilter.css";
import { useReportStore } from "../../Store/reportStore";
import {
  mapFilterKeyToStatus,
  mapViewToPeriod,
} from "../../Utils/reportHelpers";
import type { Status } from "../../Types/report";

type LegendaView = "allTime" | "last30Days" | "lastYear";

const viewContent: Record<LegendaView, { title: string; linkText: string }> = {
  allTime: {
    title: "Sesizări depuse de la lansarea platformei",
    linkText: "Vezi ultimele 30 de zile",
  },
  last30Days: {
    title: "Sesizări depuse în ultimele 30 de zile",
    linkText: "Vezi ultimul an",
  },
  lastYear: {
    title: "Sesizări depuse în ultimul an",
    linkText: "Vezi de la lansarea platformei",
  },
};

const categoryKeys = [
  "depuse",
  "planificate",
  "inLucru",
  "rezolvate",
  "redirectionate",
] as const;

type CategoryKey = (typeof categoryKeys)[number];

const categoryDetails: Record<CategoryKey, { text: string; cssClass: string }> =
  {
    depuse: { text: "Depuse", cssClass: "legenda-punct--depuse" },
    planificate: {
      text: "Planificate",
      cssClass: "legenda-punct--planificate",
    },
    inLucru: { text: "În lucru", cssClass: "legenda-punct--in-lucru" },
    rezolvate: { text: "Rezolvate", cssClass: "legenda-punct--rezolvate" },
    redirectionate: {
      text: "Redirecționate",
      cssClass: "legenda-punct--redirectionate",
    },
  };

const initialVisibility: Record<CategoryKey, boolean> = {
  depuse: true,
  planificate: true,
  inLucru: true,
  rezolvate: true,
  redirectionate: true,
};

export default function ReportsFilter() {
  const [view, setView] = useState<LegendaView>("allTime");
  const [categoryVisibility, setCategoryVisibility] =
    useState(initialVisibility);
  const { setFilters } = useReportStore();

  useEffect(() => {
    const visibleStatuses = Object.entries(categoryVisibility)
      .filter(([_, isVisible]) => isVisible)
      .map(([key]) => mapFilterKeyToStatus(key))
      .filter((status): status is Status => status != null);

    setFilters({
      status: visibleStatuses.length ? visibleStatuses : undefined,
      period: mapViewToPeriod(view),
    });
  }, [view, categoryVisibility, setFilters]);

  const handleCycleView = () => {
    if (view === "allTime") {
      setView("last30Days");
    } else if (view === "last30Days") {
      setView("lastYear");
    } else {
      setView("allTime");
    }
  };

  const handleCategoryToggle = (key: CategoryKey) => {
    setCategoryVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const currentContent = viewContent[view];

  return (
    <div className="legenda-harta-container">
      <div className="legenda-header">
        <h4 className="legenda-titlu">{currentContent.title}</h4>
        <button className="legenda-link" onClick={handleCycleView}>
          {currentContent.linkText}
        </button>
      </div>

      <ul className="legenda-lista">
        {categoryKeys.map((key) => {
          const details = categoryDetails[key];
          const isVisible = categoryVisibility[key];

          return (
            <li
              key={key}
              className={`legenda-item ${isVisible ? "" : "is-hidden"}`}
            >
              <button
                className="legenda-buton-categorie"
                aria-pressed={isVisible}
                onClick={() => handleCategoryToggle(key)}
              >
                <span className={`legenda-punct ${details.cssClass}`} />
                <span className="legenda-text">{details.text}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

