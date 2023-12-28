import React, {useState} from 'react';
import { useRouter } from 'next/router';
const Enregistrement = () => {
  // State to track if the container is in sign-up mode
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  // Event handlers
  const handleSignUpClick = () => {
    setIsSignUpMode(true);
  };
  const handleSignInClick = () => {
    setIsSignUpMode(false);
  };
  const router = useRouter();

  const goBack = () => {
    router.push('/');
  };
  return (
    <div>

      <button id="return-button" className="btn transparent" onClick={goBack}>Retour</button>


      <div className={`container_sign_in ${isSignUpMode ? 'sign-up-mode' : ''}`}>
        <div className="forms-container">
          <div className="signin-signup">
            <form action="#" className="sign-in-form">
              <h2 className="title">Connexion</h2>
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input type="text" placeholder="Email" />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Mot de passe" />
              </div>
              <input type="submit" value="Connexion" className="btn solid" />
              <p className="social-text">Connectez-vous avez vos réseaux</p>
              <div className="social-media">
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-google"></i>
                </a>
              </div>
            </form>
            <form action="#" className="sign-up-form">
              <h2 className="title">Inscription</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input type="text" placeholder="Nom" />
              </div>
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input type="email" placeholder="Email" />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Mot de passe" />
              </div>
              <input type="submit" className="btn" value="Valider" />
              <p className="social-text">Inscrivez-vous avec vos réseaux</p>
              <div className="social-media">
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-google"></i>
                </a>
              </div>
            </form>
          </div>
        </div>
        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>Pas encore adhérent ?</h3>
              <p>
                N'attendez plus, rejoignez-nous au plus vite en appuyant sur le bouton !
              </p>
              <button className="btn transparent" id="sign-up-btn" onClick={handleSignUpClick}>
                Inscrivez-vous
              </button>
            </div>
            <img src="img/log.svg" className="image" alt="" />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>Déjà adhérent ?</h3>
              <p>
                Accédez à votre espace client dès maintenant !
              </p>
              <button className="btn transparent" id="sign-in-btn" onClick={handleSignInClick}>
                Connexion
              </button>
            </div>
            <img src="img/register.svg" className="image" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Enregistrement;