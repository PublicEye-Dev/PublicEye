import Navbar from "../../Components/Layout/Navbar/Navbar";
import ManageReportCard from "../../Components/ManageReportCard/ManageReportCard";
import "./ManageReportPage.css";
import { useParams } from "react-router-dom";

const ManageReportPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="manage-report-page-container">
      <div className="manage-report-page-header">
        <Navbar />
      </div>

      <div className="manage-report-page-content">
        <ManageReportCard reportId={id ? Number(id) : undefined} />
      </div>
    </div>
  );
};

export default ManageReportPage;