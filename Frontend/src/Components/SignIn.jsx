import { useAuth0 } from '@auth0/auth0-react';

const SignIn = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({
      screen_hint: "login", // Ensures it's a login experience
    });
  };

  return (
    <button onClick={handleLogin} style={buttonStyle}>
      Sign In
    </button>
  );
};

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  backgroundColor: "#0070f3",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
};

export default SignIn;
