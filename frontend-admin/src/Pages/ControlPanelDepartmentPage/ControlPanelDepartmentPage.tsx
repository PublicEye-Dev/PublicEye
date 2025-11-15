import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Layout/Navbar/Navbar";
import "./ControlPanelDepartmentPage.css";
import AddDepartmentModal from "../../Components/AddDepartmentModal/AddDepartmentModal";
import AddOperatorModal from "../../Components/AddOperatorModal/AddOperatorModal";
import { useDepartmentStore } from "../../Store/departmentStore";
import DepartmentCard from "../../Components/DepartmentCard/DepartmentCard";

const ControlPanelDepartamentPage: React.FC = () => {
  const navigate = useNavigate();
  const [isDepartmentModalOpen, setDepartmentModalOpen] = useState(false);
  const [isOperatorModalOpen, setOperatorModalOpen] = useState(false);

  const { departments, isLoading, error, fetchDepartments } =
    useDepartmentStore();

  useEffect(() => {
    void fetchDepartments();
  }, [fetchDepartments]);

  return (
    <div className="page-container">
      <div className="page-navbar">
        <Navbar />
      </div>

      <div className="control-panel-container">
        <div className="add-department-container">
          <div className="title">
            <h4>Gestionare departamente</h4>
            <p>Administrează structurile Primăriei și operatorii aferenți.</p>
          </div>
          <div>
            <button
              className="add-operator-button"
              onClick={() => setOperatorModalOpen(true)}
            >
              Adaugă operator
            </button>
            <button
              className="add-department-button"
              onClick={() => setDepartmentModalOpen(true)}
            >
              Adaugă departament
            </button>
          </div>
        </div>

        {error && <div className="department-error">{error}</div>}

        {isLoading ? (
          <div className="department-loading">Se încarcă departamentele...</div>
        ) : (
          <div className="control-panel-grid">
            {departments.map((department) => (
              <DepartmentCard
                key={department.id}
                department={department}
                onView={(id) => navigate(`/departament-admin/${id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <AddDepartmentModal
        isOpen={isDepartmentModalOpen}
        onClose={() => setDepartmentModalOpen(false)}
      />
      <AddOperatorModal
        isOpen={isOperatorModalOpen}
        onClose={() => setOperatorModalOpen(false)}
      />
    </div>
  );
};

export default ControlPanelDepartamentPage;
