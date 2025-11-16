import React, { useState, useEffect, ReactElement } from 'react';
import './MyReports.css';
import { 
  FaCog, 
  FaCheckCircle,
  FaRegClock,     
  FaCalendarAlt, 
  FaShareSquare,
  FaTimesCircle,
} from "react-icons/fa";
import { getUserReports } from '../../Services/reportService';
import { getUserInfo } from '../../Services/accountService';
import type { Report, Status } from '../../Types/report';

interface StatusConfig {
  label: string;
  icon: ReactElement;
  statusBarClass: string;
  iconClass: string;
}

// Helper function pentru maparea status-urilor
const getStatusConfig = (status: Status): StatusConfig => {
  switch (status) {
    case 'DEPUSA':
      return {
        label: 'În așteptare',
        icon: <FaRegClock />,
        statusBarClass: 'in-asteptare',
        iconClass: 'in-asteptare',
      };
    case 'PLANIFICATA':
      return {
        label: 'Planificată',
        icon: <FaCalendarAlt />,
        statusBarClass: 'planificata',
        iconClass: 'planificata',
      };
    case 'IN_LUCRU':
      return {
        label: 'În lucru',
        icon: <FaCog />,
        statusBarClass: 'in-lucru',
        iconClass: 'in-lucru',
      };
    case 'REZOLVATA':
      return {
        label: 'Rezolvată',
        icon: <FaCheckCircle />,
        statusBarClass: 'rezolvata',
        iconClass: 'rezolvata',
      };
    case 'REDIRECTIONATA':
      return {
        label: 'Redirecționată',
        icon: <FaShareSquare />,
        statusBarClass: 'redirectionata',
        iconClass: 'redirectionata',
      };
    case 'RESPINSA':
      return {
        label: 'Respinsă',
        icon: <FaTimesCircle />,
        statusBarClass: 'respinsa',
        iconClass: 'respinsa',
      };
    default:
      return {
        label: 'Necunoscut',
        icon: <FaRegClock />,
        statusBarClass: 'in-asteptare',
        iconClass: 'in-asteptare',
      };
  }
};

// Helper function pentru formatarea ID-ului (SZN2025-019300)
const formatReportId = (id: number): string => {
  const currentYear = new Date().getFullYear();
  const paddedId = String(id).padStart(6, '0');
  return `SZN${currentYear}-${paddedId}`;
};

// Helper function pentru formatarea datei (DD.MM.YYYY)
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch (error) {
    return '';
  }
};

const MyReports: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserReports = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Obține informațiile utilizatorului curent pentru a lua ID-ul
                const userInfo = await getUserInfo();
                
                // Obține sesizările utilizatorului
                const userReports = await getUserReports(userInfo.id);
                
                // Sortează după data creării (cele mai noi primele)
                const sortedReports = [...userReports].sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                });
                
                setReports(sortedReports);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Eroare la încărcarea sesizărilor';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserReports();
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <div className="my-reports-page-container">
                <h2 className="my-reports-title">Sesizările mele</h2>
                <hr className="title-divider" />
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div className="loading-spinner"></div>
                    <p style={{ marginTop: '20px', color: '#555' }}>Se încarcă sesizările...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="my-reports-page-container">
                <h2 className="my-reports-title">Sesizările mele</h2>
                <hr className="title-divider" />
                <div className="error-message" style={{ 
                    padding: '20px', 
                    backgroundColor: '#f8d7da', 
                    color: '#721c24', 
                    borderRadius: '8px',
                    marginTop: '20px'
                }}>
                    {error}
                </div>
            </div>
        );
    }

    // Empty state
    if (reports.length === 0) {
        return (
            <div className="my-reports-page-container">
                <h2 className="my-reports-title">Sesizările mele</h2>
                <hr className="title-divider" />
                <div style={{ 
                    textAlign: 'center', 
                    padding: '60px 20px',
                    color: '#666'
                }}>
                    <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
                        Nu ați depus nicio sesizare încă
                    </p>
                    <p style={{ fontSize: '0.95rem', color: '#888' }}>
                        Când veți depune sesizări, acestea vor apărea aici
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-reports-page-container">
            <h2 className="my-reports-title">Sesizările mele</h2>
            <hr className="title-divider" />

            <div className="reports-list-container">
                {reports.map((report) => {
                    const statusConfig = getStatusConfig(report.status);
                    const createdDate = formatDate(report.createdAt);
                    const updatedDate = formatDate(report.updatedAt || report.createdAt);

                    return (
                        <div key={report.id} className="report-card">
                            <div className={`status-bar ${statusConfig.statusBarClass}`}></div>
                            <div className="report-content">
                                <div className="report-header">
                                    <span className="report-id">{formatReportId(report.id)}</span>
                                </div>
                                <h3 className="report-description">
                                    {report.description}
                                </h3>
                                {createdDate && (
                                    <span className="report-date-deposited">
                                        Depusă la {createdDate}
                                    </span>
                                )}
                                <div className="report-status">
                                    <span className={`status-icon ${statusConfig.iconClass}`}>
                                        {statusConfig.icon}
                                    </span>
                                    {updatedDate && (
                                        <>
                                            <span className="report-status-date">{updatedDate}</span>
                                            <span>-</span>
                                        </>
                                    )}
                                    <span className="report-status-label">{statusConfig.label}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyReports;