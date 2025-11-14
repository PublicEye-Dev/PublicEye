import React,{useState} from 'react';
import './ProfileCard.css';

const ProfileCard: React.FC = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');


    const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Datele de trimis:", { name, phone, email });
  };
    return ( <div className="profile-card">
      
      {/* Secțiunea de Antet */}
      <div className="profile-header">
        <h1>Contul meu</h1>
        <p>Actualizați informațiile contului </p>
        
      </div>
      
      {/* Linia albastră de diviziune */}
      <hr className="divider-line" />
      
      {/* Formularul de profil */}
      <form className="profile-form" onSubmit={handleSubmit}>
        
        {/* Grupul "Nume" */}
        <div className="form-group">
          <label htmlFor="nume">Nume</label>
          <input 
            type="text" 
            id="nume" 
            placeholder="Completați numele d-voastră"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        {/* Grupul "Telefon" */}
        <div className="form-group">
          <label htmlFor="telefon">Telefon</label>
          <input 
            type="tel" 
            id="telefon" 
            placeholder="Completați numărul de telefon"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        
        {/* Grupul "Email" */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            placeholder="Completați adresa d-voastră de email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        {/* Butonul de Salvare */}
        <div className="form-actions">
             <button type="submit" className="save-button">Salvează Modificările</button>
        </div>
        
      </form>
    </div>


    );
}

export default ProfileCard;
