import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../Store/authStore";
import IdentifierInput from "../../Components/Auth/IndentifierInput/IdentifierInput";
import CodeInput from "../../Components/Auth/CodeInput/CodeInput";
import "./LoginPage.css";
import Navbar from "../../Components/Layout/Navbar/Navbar";

export default function LoginPage() {
  const { step, token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (step === "authenticated" && token) {
      navigate("/");
    }
  }, [step, token, navigate]);

  return (
  

    <div className="login-page-container">
      <header className="login-navbar">
        <Navbar />
      </header>
      
    <div className="login-page">
     
  
      <div className="login-container">
        
        
        <div className="login-header">
          <h1>Autentificare</h1>
          <p>Înainte de a continua, vă rugăm să vă autentificați</p>
        </div>

        <div className="login-content">
          {step === "idle" && <IdentifierInput />}
          {(step === "waiting-code" || step === "verifying-code") && (
            <CodeInput />
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
