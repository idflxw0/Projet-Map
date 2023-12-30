import React, {useState} from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGoogle, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { Router } from "../Backend/Router";
const Enregistrement = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const routers = useRouter();

  // Event handlers for the sign-up and sign-in forms
  const handleSignInSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!signInEmail || !signInPassword) {
      console.log('Email and password are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost/backend/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: signInEmail, password: signInPassword }),
      });

      const result = await response.json();

      if (result.error) {
        console.error('Login failed:', result.error);
      } else {
        console.log('Login successful:', result);
        alert('Login successful!'); // Or any other logic for successful login
      }
    } catch (error) {
      console.error('An error occurred while logging in.', error);
    }
  };


  const handleSignUpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Implement your sign-up logic here
    console.log("Signing up with", signUpName, signUpEmail, signUpPassword);
  };
  const resetForm = () => {
    setSignInEmail('');
    setSignInPassword('');
    setSignUpName('');
    setSignUpEmail('');
    setSignUpPassword('');
  }

  const handleSignUpClick = () => {
    setIsSignUpMode(true);
  };
  const handleSignInClick = () => {
    setIsSignUpMode(false);
  };
  const goBack = () => {
    routers.push('/');
  };


  return (
    <div>

      <button id="return-button" className="btn transparent" onClick={goBack}>Retour</button>


      <div className={`container_sign_in ${isSignUpMode ? 'sign-up-mode' : ''}`}>
        <div className="forms-container">
          <div className="signin-signup">
            {/*Sign-in- Form*/}
            <form className="sign-in-form" onSubmit={handleSignInSubmit}>
              <h2 className="title">Connexion</h2>
              <div className="input-field">
                <FontAwesomeIcon className={"fontAwesomeIcon"} icon={faEnvelope} />
                <input type="text" placeholder="Email" value={signInEmail}
                       onChange={(e) => setSignInEmail(e.target.value)} />
              </div>
              <div className="input-field">
                <FontAwesomeIcon className={"fontAwesomeIcon"} icon={faLock} />
                <input type="password" placeholder="Mot de passe" value={signInPassword}
                       onChange={(e) => setSignInPassword(e.target.value)} />
              </div>
              <input type="submit" value="Connexion" className="btn solid" />
              <p className="social-text">Connectez-vous avez vos réseaux</p>
              <div className="social-media">

                <a href="#" className="social-icon">
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a href="#" className="social-icon">
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </a>
                <a href="#" className="social-icon">
                  <FontAwesomeIcon icon={faGoogle} />
                </a>
              </div>
            </form>


            {/*Sign-up- Form*/}
            <form className="sign-up-form" onSubmit={handleSignUpSubmit}>
              <h2 className="title">Inscription</h2>
              <div className="input-field">
                <FontAwesomeIcon className={"fontAwesomeIcon"} icon={faUser} />
                <input type="text" placeholder="Nom" value={signUpName}
                       onChange={(e) => setSignUpName(e.target.value)} />
              </div>
              <div className="input-field">
                <FontAwesomeIcon className={"fontAwesomeIcon"} icon={faEnvelope} />
                <input type="email" placeholder="Email" value={signUpEmail}
                       onChange={(e) => setSignUpEmail(e.target.value)} />
              </div>
              <div className="input-field">
                <FontAwesomeIcon className={"fontAwesomeIcon"} icon={faLock} />
                <input type="password" placeholder="Mot de passe" value={signUpPassword}
                       onChange={(e) => setSignUpPassword(e.target.value)} />
              </div>
              <input type="submit" className="btn" value="Valider" />
              <p className="social-text">Inscrivez-vous avec vos réseaux</p>
              <div className="social-media">
                <a href="#" className="social-icon">
                  <FontAwesomeIcon icon={faFacebookF} />

                </a>
                <a href="#" className="social-icon">
                  <FontAwesomeIcon icon={faLinkedinIn} />

                </a>
                <a href="#" className="social-icon">
                  <FontAwesomeIcon icon={faGoogle} />
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