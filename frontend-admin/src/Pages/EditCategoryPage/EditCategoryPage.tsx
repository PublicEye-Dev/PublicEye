import Navbar from "../../Components/Layout/Navbar/Navbar";
import EditCategoryCard from "../../Components/EditCategoryCard/EditCategoryCard";
import "./EditCategoryPage.css";


const EditCategoryPage = () => {
  return (
    <div className="manage-report-page-container">
    <div className="manage-report-page-header">
      <Navbar />
    </div>

    <div className="manage-report-page-content">
    <EditCategoryCard />
    </div>
</div>
  );
};

export default EditCategoryPage;