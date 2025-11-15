import React from "react";
import { Link } from "react-router-dom";
import "./CardControlPanel.css";


interface ServiceCardProps {
 icon: React.ReactNode;
 title: string;
 description: string;
 to: string; 
}

const CardControlPanel: React.FC<ServiceCardProps> = ({icon, title, description, to}) => {
    return (<Link to={to} className="service-card">

 {/* Containerul pentru iconiță */}
 <div className="card-icon-container">
{icon}
</div>

{/* Containerul pentru text */}
<div className="card-content">
<h3 className="card-title">{title}</h3>
<p className="card-description">{description}</p>
</div>
</Link>)
}

export default CardControlPanel;