import React from "react";
import Navbar from "../../Components/Layout/Navbar/Navbar";
import ViewDepartment from "../../Components/ViewDepartment/ViewDepartment";

const ViewDepartmentPage: React.FC = () => {
    return (
        <div className="page-container">
            <div className="page-navbar">
                <Navbar />
            </div>

            <div className="page-card">
                <ViewDepartment />
            </div>
        </div>
    )
};

export default ViewDepartmentPage;