export interface SumarExecutiv {
	name: string | undefined;
	sumar: string;
}

export interface TopProblema {
	categorie: string;
	numarSesizari: number;
}

export interface ZonaFierbinte {
	zona: string;
	descriereProbleme: string;
}

export interface RaportGeneral {
	sumarExecutiv: {
		sumar: string;
	};
	topProbleme: TopProblema[];
	zoneFierbinti: ZonaFierbinte[];
}

export interface RaportRequest {
	dataInceput: string; // ISO date (yyyy-MM-dd)
	dataSfarsit: string; // ISO date (yyyy-MM-dd)
}


