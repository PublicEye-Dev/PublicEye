import React, { useState } from 'react';
import './CreatePetition.css';

interface PetitionData {
  title: string;
  recipient: string;
  contextProblem: string;
  contextSolution: string;
  image: File | null;
  fullName: string;
  contactInfo: string;
}

const CreatePetition: React.FC = () => {
  const [formData, setFormData] = useState<PetitionData>({
    title: '',
    recipient: '',
    contextProblem: '',
    contextSolution: '',
    image: null,
    fullName: '',
    contactInfo: '',
  });

  const [isAnonymous, setIsAnonymous] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAnonymousChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsAnonymous(checked);
    if (checked) {
      setFormData((prevData) => ({
        ...prevData,
        fullName: '',
        contactInfo: '',
      }));
    }
  };

  let isFormValid = false;

  const baseFieldsValid =
    formData.title.trim() !== '' &&
    formData.recipient.trim() !== '' &&
    formData.contextProblem.trim() !== '' &&
    formData.contextSolution.trim() !== '' &&
    formData.image !== null;

  if (isAnonymous) {
    isFormValid = baseFieldsValid;
  } else {
    const initiatorFieldsValid =
      formData.fullName.trim() !== '' &&
      formData.contactInfo.trim() !== '';

    isFormValid = baseFieldsValid && initiatorFieldsValid;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      console.warn("Form is not valid!");
      return;
    }
    console.log("Petition data to submit:", formData);
    // ... submit logic here
  };

  return (
    <div className="petition-page">
      <form className="petition-form-container" onSubmit={handleSubmit}>
        
        {/* --- 1. Image Upload --- */}
        <div className="image-upload-area">
          <label htmlFor="image-upload">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Previzualizare" 
                className="image-preview"
              />
            ) : (
              <span>+ Click pentru a încărca o imagine</span> 
            )}
          </label>
          <input
            type="file"
            id="image-upload"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>

        {/* --- 2. Header (Title & Recipient) --- */}
        <header className="header-form-section">
          <input
            type="text"
            name="title"
            className="title-input"
            placeholder="Titlul Petiției*" 
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="recipient"
            className="recipient-input"
            placeholder="Către: [Numele Destinatarului]*" 
            value={formData.recipient}
            onChange={handleChange}
            required
          />
        </header>

        {/* --- 3. Context (Why is this important?) --- */}
        <section className="context-form-section">
          <h3 className="context-title">De ce este important?</h3> 
          <div className="context-text-inputs">
            <textarea
              name="contextProblem"
              placeholder="Scurt text (Problema)...*" 
              value={formData.contextProblem}
              onChange={handleChange}
              rows={3}
              required
            />
            <textarea
              name="contextSolution"
              placeholder="Scurt text (Soluția)...*" 
              value={formData.contextSolution}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>
        </section>

        {/* --- 4. Initiator Info --- */}
        <section className="initiator-form-section">
          <h3 className="initiator-title">Informații Inițiator</h3> 
          
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="anonymous"
              name="anonymous"
              checked={isAnonymous}
              onChange={handleAnonymousChange}
            />
            <label htmlFor="anonymous">Petiție Anonimă</label> 
          </div>

          <div className="initiator-fields">
            <input
              type="text"
              name="fullName"
              placeholder="Nume complet*" 
              value={formData.fullName}
              onChange={handleChange}
              disabled={isAnonymous}
              required={!isAnonymous}
              className="initiator-input"
            />
            <input
              type="text"
              name="contactInfo"
              placeholder="Nr. de telefon / Email*" 
              value={formData.contactInfo}
              onChange={handleChange}
              disabled={isAnonymous}
              required={!isAnonymous}
              className="initiator-input"
            />
          </div>
        </section>

        {/* --- 5. Submit Button --- */}
        <div className="submit-button-container">
          <button
            type="submit"
            className="submit-button"
            disabled={!isFormValid}
          >
            Creează Petiția
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreatePetition;