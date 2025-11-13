import React, { useState } from 'react';
import '../ReportsFilter/ReportsFilter.css';



type LegendaView = 'allTime' | 'last30Days' | 'lastYear';

const viewContent: Record<LegendaView, { title: string; linkText: string }> = {
  allTime: {
    title: 'Sesizări depuse de la lansarea platformei',
    linkText: 'Vezi ultimele 30 de zile',
  },
  last30Days: {
    title: 'Sesizări depuse în ultimele 30 de zile',
    linkText: 'Vezi ultimul an',
  },
  lastYear: {
    title: 'Sesizări depuse în ultimul an',
    linkText: 'Vezi de la lansarea platformei',
  },
};

const categoryKeys = [
  'depuse',
  'planificate',
  'inLucru',
  'rezolvate',
  'redirectionate',
] as const;

type CategoryKey = typeof categoryKeys[number];

const categoryDetails: Record<CategoryKey, { text: string; cssClass: string }> = {
  depuse: { text: 'Depuse', cssClass: 'legenda-punct--depuse' },
  planificate: { text: 'Planificate', cssClass: 'legenda-punct--planificate' },
  inLucru: { text: 'În lucru', cssClass: 'legenda-punct--in-lucru' },
  rezolvate: { text: 'Rezolvate', cssClass: 'legenda-punct--rezolvate' },
  redirectionate: {
    text: 'Redirecționate',
    cssClass: 'legenda-punct--redirectionate',
  },
};

const initialVisibility: Record<CategoryKey, boolean> = {
  depuse: true,
  planificate: true,
  inLucru: true,
  rezolvate: true,
  redirectionate: true,
};



const ReportsFilter: React.FC = () => {

  
  const [view, setView] = useState<LegendaView>('allTime');
  const [categoryVisibility, setCategoryVisibility] = useState(initialVisibility);

  const handleCycleView = () => {
    
    if (view === 'allTime') {
      setView('last30Days');
     
    } else if (view === 'last30Days') {
      setView('lastYear');
    
    } else {
      setView('allTime');
     
    }
  };

  const handleCategoryToggle = (key: CategoryKey) => {
   
    const newState = {
      ...categoryVisibility,
      [key]: !categoryVisibility[key], 
    };
    setCategoryVisibility(newState);

    console.log(`Ai comutat ${key}. Noua stare:`, newState);
    
  };

  const currentContent = viewContent[view];

  
  return (
    <div className="legenda-harta-container">
      {/* --- Secțiunea de sus (Titlu și Link) --- */}
      <div className="legenda-header">
        <h4 className="legenda-titlu">{currentContent.title}</h4>
        <button className="legenda-link" onClick={handleCycleView}>
          {currentContent.linkText}
        </button>
      </div>

      {/* --- Lista cu legenda --- */}
      <ul className="legenda-lista">
        {
          // Mapăm peste cheile definite pentru a crea lista
          categoryKeys.map((key) => {
            const details = categoryDetails[key];
            const isVisible = categoryVisibility[key];

            return (
              <li
                key={key}
                // Adăugăm o clasă 'is-hidden' dacă nu e vizibil
                className={`legenda-item ${isVisible ? '' : 'is-hidden'}`}
              >
                {/* Tot rândul este un singur buton */}
                <button
                  className="legenda-buton-categorie"
                  onClick={() => handleCategoryToggle(key)}
                  aria-pressed={isVisible} // Pentru accesibilitate
                >
                  <span className={`legenda-punct ${details.cssClass}`}></span>
                  <span className="legenda-text">{details.text}</span>
                </button>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

export default ReportsFilter;