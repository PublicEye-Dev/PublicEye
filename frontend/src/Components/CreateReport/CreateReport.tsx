import React, { useEffect, useMemo, useState } from 'react';
import './CreateReport.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { createReport } from '../../Services/reportService';
import type { ReportCreateRequest } from '../../Types/report';
import { getCategoriesList, getSubcategoriesList, type CategoryItem, type SubcategoryItem } from '../../Services/categoryService';
import { useAuthStore } from '../../Store/authStore';
import { getUserInfo } from '../../Services/accountService';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const CreateReport: React.FC = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();

  const [userId, setUserId] = useState<number | null>(user?.id ?? null);

  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [subcategoryId, setSubcategoryId] = useState<number | ''>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialLat = query.get('lat');
  const initialLng = query.get('lng');
  const latitude = initialLat ? Number(initialLat) : undefined;
  const longitude = initialLng ? Number(initialLng) : undefined;

  // Asigură-te că avem userId când există token
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!token) return; // nu e autentificat
      if (user?.id) {
        setUserId(user.id);
        return;
      }
      try {
        const info = await getUserInfo();
        if (mounted) setUserId(info.id);
      } catch {
        // ignoră, va cădea pe ramura de lipsă autentificare la submit
      }
    })();
    return () => {
      mounted = false;
    };
  }, [token, user?.id]);

  // Load categories
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await getCategoriesList();
        if (mounted) setCategories(list);
      } catch (e) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        setError(e instanceof Error ? e.message : 'Nu s-au putut încărca categoriile');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Load subcategories when category changes
  useEffect(() => {
    if (categoryId === '' || categoryId == null) {
      setSubcategories([]);
      setSubcategoryId('');
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const list = await getSubcategoriesList(Number(categoryId));
        if (mounted) setSubcategories(list);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Nu s-au putut încărca subcategoriile');
      }
    })();
    return () => {
      mounted = false;
    };
  }, [categoryId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError('Trebuie să fii autentificat.');
      return;
    }
    if (categoryId === '' || subcategoryId === '') {
      setError('Selectează categoria și subcategoria.');
      return;
    }
    if (!userId) {
      setError('Nu s-a putut identifica utilizatorul. Reautentifică-te.');
      return;
    }

    const payload: ReportCreateRequest = {
      description: description.trim(),
      categoryId: Number(categoryId),
      subcategoryId: Number(subcategoryId),
      userId: userId,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
    };

    setIsLoading(true);
    try {
      await createReport(payload, imageFile);
      navigate('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Eroare la trimiterea sesizării');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="report-container">
      <form className=" form-group report-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="file-upload-section">
            <div className="file-upload-label-container">
              <label>Poze sau filmări</label>
            </div>
            <div className="file-upload-box">
              <input
                type="file"
                id="file-upload"
                accept="image/*,video/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="file-upload" className="file-upload-label">
                <span className="upload-icon">📷</span>
                <p>Adaugă fișier (opțional), max. 25 MB</p>
              </label>
            </div>
          </div>
        </div>

        <div className="form-group ">
          <div className="description-section">
            <div className="description-label-container">
              <label htmlFor="description">Descriere *</label>
            </div>
            <textarea
              id="description"
              rows={5}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="category-label-container">
            <div className="category-section">
              <label htmlFor="category">Categorie *</label>
            </div>
            <select
              id="category"
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
            >
              <option value="" disabled>Alege o categorie</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <div className="subcategory-label-container">
            <div className="subcategory-section">
              <label htmlFor="subcategory">Subcategorie *</label>
            </div>
            <select
              id="subcategory"
              required
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value ? Number(e.target.value) : '')}
              disabled={categoryId === ''}
            >
              <option value="" disabled>Alege o subcategorie</option>
              {subcategories.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {latitude != null && longitude != null && (
          <div className="form-group">
            <div className="category-label-container">
              <div className="subcategory-section">
                <label>Locație selectată</label>
              </div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                {latitude.toFixed(5)}, {longitude.toFixed(5)}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div style={{ color: '#b91c1c', fontSize: 14, marginBottom: 8 }}>{error}</div>
        )}

        <div className="form-actions">
          <button type="submit" className="button-primary" disabled={isLoading}>
            {isLoading ? 'Se trimite...' : 'Trimite'}
          </button>
          <button type="button" className="button-secondary" onClick={handleCancel}>
            Renunță
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReport;