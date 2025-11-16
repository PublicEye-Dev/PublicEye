import React, { useState, useEffect } from 'react';
import './ProfileCard.css';
import { getUserInfo, updateUserInfo } from '../../Services/accountService';
import type { UserDto } from '../../Types/user';

const ProfileCard: React.FC = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [userData, setUserData] = useState<UserDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<{
        name?: string;
        phone?: string;
        email?: string;
    }>({});

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            setIsFetching(true);
            setError(null);
            try {
                const data: UserDto = await getUserInfo();
                setUserData(data);
                setName(data.fullName ?? '');
                setPhone(data.phoneNumber ?? '');
                setEmail(data.email ?? '');
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Eroare la încărcarea datelor utilizatorului';
                setError(errorMessage);
            } finally {
                setIsFetching(false);
            }
        };

        fetchUserData();
    }, []);

    // Validate form fields (doar formatul email dacă este completat)
    const validateForm = (): boolean => {
        const errors: {
            name?: string;
            phone?: string;
            email?: string;
        } = {};

        // Validare format email doar dacă este completat
        if (email.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.trim())) {
                errors.email = 'Format email invalid';
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);
        setValidationErrors({});

        // Validate form
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            if (!userData) {
                throw new Error('Datele utilizatorului nu sunt disponibile');
            }

            const userDto: UserDto = {
                id: userData.id,
                fullName: name.trim() || null,
                phoneNumber: phone.trim() || null,
                email: email.trim() || null,
                role: userData.role,
                departmentId: userData.departmentId,
                departmentName: userData.departmentName,
            };

            const updatedData = await updateUserInfo(userDto);
            setUserData(updatedData);
            setSuccess('Modificările au fost salvate cu succes!');
            
            // Clear success message after 5 seconds
            setTimeout(() => {
                setSuccess(null);
            }, 5000);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Eroare la salvarea modificărilor';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading state while fetching initial data
    if (isFetching) {
        return (
            <div className="profile-card">
                <div className="profile-header">
                    <h1>Contul meu</h1>
                    <p>Actualizați informațiile contului</p>
                </div>
                <hr className="divider-line" />
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div className="loading-spinner"></div>
                    <p style={{ marginTop: '20px', color: '#555' }}>Se încarcă datele...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-card">
            {/* Secțiunea de Antet */}
            <div className="profile-header">
                <h1>Contul meu</h1>
                <p>Actualizați informațiile contului</p>
            </div>

            {/* Linia albastră de diviziune */}
            <hr className="divider-line" />

            {/* Success Message */}
            {success && (
                <div className="message success-message">
                    {success}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="message error-message">
                    {error}
                </div>
            )}

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
                        disabled={isLoading}
                    />
                    {validationErrors.name && (
                        <span className="validation-error">{validationErrors.name}</span>
                    )}
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
                        disabled={isLoading}
                    />
                    {validationErrors.phone && (
                        <span className="validation-error">{validationErrors.phone}</span>
                    )}
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
                        disabled={isLoading}
                    />
                    {validationErrors.email && (
                        <span className="validation-error">{validationErrors.email}</span>
                    )}
                </div>

                {/* Butonul de Salvare */}
                <div className="form-actions">
                    <button
                        type="submit"
                        className="save-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="button-spinner"></span>
                                Se salvează...
                            </>
                        ) : (
                            'Salvează Modificările'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileCard;
