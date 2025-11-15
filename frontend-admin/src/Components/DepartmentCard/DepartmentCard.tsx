import "./DepartmentCard.css";
import type { Department } from "../../Types/department";
import { FaBuilding } from "react-icons/fa";

interface DepartmentCardProps {
  department: Department;
  onView: (id: number) => void;
}

export default function DepartmentCard({
  department,
  onView,
}: DepartmentCardProps) {
  return (
    <div className="department-card">
      <div className="department-card-top">
        <div className="department-card-icon">
          <FaBuilding />
        </div>
      </div>
      <div className="department-card-bottom">
        <h3>{department.name}</h3>
        <p>{department.description || "Fără descriere disponibilă."}</p>
        <div className="department-card-buttons">
          <button
            type="button"
            className="department-btn department-btn-view"
            onClick={() => onView(department.id)}
          >
            Vezi departament
          </button>
        </div>
      </div>
    </div>
  );
}
