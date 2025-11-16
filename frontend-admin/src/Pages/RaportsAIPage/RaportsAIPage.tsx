import { useState } from "react";
import Navbar from "../../Components/Layout/Navbar/Navbar";
import "./RaportsAIPage.css";
import { genereazaRaport } from "../../Services/adminRaportService";
import type { RaportGeneral } from "../../Types/raport";

export default function RaportsAIPage() {
	const [reportData, setReportData] = useState<RaportGeneral | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [startDate, setStartDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
	const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().slice(0, 10));

	const handleGenerateReport = async () => {
		setIsLoading(true);
		setError(null);
		setReportData(null);
		try {
			if (!startDate || !endDate) throw new Error("Selectați perioadele de început și sfârșit.");
			if (startDate > endDate) throw new Error("Data de început nu poate fi după data de sfârșit.");
			const data = await genereazaRaport({
				dataInceput: startDate,
				dataSfarsit: endDate,
			});
			setReportData(data);
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "A apărut o eroare la generarea raportului.";
			setError(message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="page-container">
			<div className="page-navbar">
				<Navbar />
			</div>

			<div className="reports-page">
				<header className="reports-header">
					<div>
						<h1 className="reports-title">Rapoarte AI</h1>
						<p className="reports-subtitle">Generează un sumar inteligent al sesizărilor într-un interval selectat</p>
					</div>
					{reportData && !isLoading && (
						<div className="range-badge">
							<span>Interval selectat:</span>
							<strong>{startDate}</strong>
							<span>→</span>
							<strong>{endDate}</strong>
						</div>
					)}
				</header>

				<section className="filters-card card">
					<h2 className="section-title">Configurare raport</h2>
					<div className="reports-filters">
						<div className="date-field">
							<label htmlFor="start-date">Data început</label>
							<input
								id="start-date"
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								disabled={isLoading}
							/>
						</div>
						<div className="date-field">
							<label htmlFor="end-date">Data sfârșit</label>
							<input
								id="end-date"
								type="date"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								disabled={isLoading}
							/>
						</div>
						<button
							type="button"
							className="reports-generate-button"
							onClick={handleGenerateReport}
							disabled={isLoading}
						>
							{isLoading ? "Se generează..." : "Generează Raport"}
						</button>
					</div>
				</section>

				{error && <div className="reports-error">{error}</div>}

				{isLoading && (
					<div className="loading-row">
						<div className="loading-spinner" />
						<span>Se generează raportul...</span>
					</div>
				)}

				{!reportData && !isLoading && !error && (
					<div className="reports-placeholder">
						Selectați intervalul și generați un raport. Rezultatele vor fi afișate aici sub formă de sumar, top probleme și zone fierbinți.
					</div>
				)}

				{reportData && !isLoading && (
					<div className="reports-content">
						<section className="card emphasis">
							<h2 className="section-title">Sumar Executiv</h2>
							{reportData.sumarExecutiv?.sumar ? (
								<blockquote className="reports-sumar">
									{reportData.sumarExecutiv.sumar}
								</blockquote>
							) : (
								<p className="muted">Nu există sumar.</p>
							)}
						</section>

						<section className="card">
							<h2 className="section-title">Top Probleme Identificate</h2>
							{reportData.topProbleme && reportData.topProbleme.length > 0 ? (
								<div className="table-wrapper">
									<table className="reports-table">
										<thead>
											<tr>
												<th>Categorie</th>
												<th>Nr. sesizări</th>
											</tr>
										</thead>
										<tbody>
											{reportData.topProbleme.map((row, idx) => (
												<tr key={`${row.categorie}-${idx}`}>
													<td>{row.categorie}</td>
													<td>{row.numarSesizari}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							) : (
								<p className="muted">Nu există date pentru top probleme.</p>
							)}
						</section>

						<section className="card">
							<h2 className="section-title">Zone Fierbinți</h2>
							{reportData.zoneFierbinti && reportData.zoneFierbinti.length > 0 ? (
								<div className="hotspots-grid">
									{reportData.zoneFierbinti.map((z, idx) => (
										<div className="hotspot-card" key={`${z.zona}-${idx}`}>
											<h3 className="hotspot-title">{z.zona}</h3>
											<p className="hotspot-description">{z.descriereProbleme}</p>
										</div>
									))}
								</div>
							) : (
								<p className="muted">Nu există zone fierbinți identificate.</p>
							)}
						</section>
					</div>
				)}
			</div>
		</div>
	);
}


