import { getAuth, signOut } from "firebase/auth";
import { Nav } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

const Logout = ( {closeOff} ) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => { 
      navigate('/it-society');
    }).catch((error) => {
    })
  }
  
  return (
    <Nav.Link as={Link} onClick={() => { handleLogout(); closeOff();}}>Logout</Nav.Link>
  )
}

export default Logout;