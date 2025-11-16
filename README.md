### PublicEye — README

Aplicație full‑stack pentru sesizări, petiții și alerte generate cu agent AI pe baza sesizărilor. Utilizatorii pot crea și vota petiții, iar administratorii pot modera, actualiza statusul și publica răspunsuri oficiale.

## Stack tehnic
- Backend: Spring Boot 3, Spring Security (JWT), Hibernate, HikariCP, PostgreSQL
- Frontend: React + TypeScript (`frontend`) și aplicație separată de admin (`frontend-admin`)
- Build/dev: Node.js (frontend), Maven Wrapper (backend)

## Structură
- `backend/` — API REST (autentificare, petiții, voturi, filtrare, administrare)
- `frontend/` — aplicația publică (listare, creare, detalii, vot)
- `frontend-admin/` — interfața de administrare (status, răspunsuri oficiale, moderare)

## Cerințe
- Node.js 18+
- Java 17+ (sau 21)
- PostgreSQL 14+

## Configurare backend
1) Creează baza de date:
```sql
CREATE DATABASE publiceye;
```
2) Variabile de mediu (sau `application.properties`):
```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/publiceye
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
JWT_SECRET=schimba-asta
```
3) Pornire:
```
cd backend
./mvnw spring-boot:run    # Windows: mvnw.cmd spring-boot:run
```
Backend: `http://localhost:8080`.

## Configurare frontend (public)
```
cd frontend
npm install
npm run dev
```
Aplicația pornește (de regulă) pe `http://localhost:5173`. Setează baza URL a API-ului în servicii dacă este diferită.

## Configurare frontend-admin
```
cd frontend-admin
npm install
npm run dev
```
La fel, ajustează baza URL pentru API dacă e necesar.

## Funcționalități
- Utilizator:
  - Creare, listare, filtrare petiții/sesizări
  - Voturi
  - Detalii petiție: status și răspuns oficial
- AI/Alerting:
  - Generare alerte pe baza sesizărilor (agent AI)
- Administrator:
  - Moderare petiții
  - Schimbare status: `ACTIVE` | `CLOSED` | `BANNED`
  - Publicare răspuns oficial

## Rute API (indicativ)
- `GET /api/petitions` — listare/filtrare
- `GET /api/petitions/{id}` — detalii
- `POST /api/petitions` — creare (autentificat)
- `PUT /api/petitions/{id}` — actualizare (admin)
- `POST /api/auth/login` — autentificare, returnează JWT

## Securitate și CORS
- Autentificare prin JWT (`Authorization: Bearer <token>`).
- În dev, permite originurile frontend în configurarea CORS a backend-ului dacă e necesar.

## Troubleshooting
- 401/403: verifică JWT-ul și rolul (user/admin).
- Conexiune DB: verifică variabilele `SPRING_DATASOURCE_*` și că PostgreSQL rulează.
- CORS: asigură-te că originurile frontend sunt permise.

## Scripturi utile
- Backend:
  - `./mvnw clean package`
  - `./mvnw test`
- Frontend / Frontend-admin:
  - `npm run dev`
  - `npm run build`
  - `npm run preview`

## Licență
Proiect intern/educațional. Actualizează această secțiune conform politicilor tale.


