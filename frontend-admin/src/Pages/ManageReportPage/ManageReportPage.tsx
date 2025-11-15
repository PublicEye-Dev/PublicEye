import Navbar from "../../Components/Layout/Navbar/Navbar";
import ManageReportCard from "../../Components/ManageReportCard/ManageReportCard";
import "./ManageReportPage.css";


const ManageReportPage = () => {
  return (
    <div className="manage-report-page-container">
    <div className="manage-report-page-header">
      <Navbar />
    </div>

    <div className="manage-report-page-content">
    <ManageReportCard />
    </div>
</div>
  );
};

export default ManageReportPage;