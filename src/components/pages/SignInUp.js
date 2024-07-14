import { getAuth } from "firebase/auth";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { Container, Tabs, Tab, Form, Button, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { set, ref as dbRef } from "firebase/database";
import { database } from '../../firebase.js';
import { useEffect } from "react";

const SignInUp = ({ defaultKey = 'login', loggedUser }) => {
  const navigate = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleSignup = (event) => {

    event.preventDefault();
    let email = event.target[0].value
    let password = event.target[1].value

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        set(dbRef(database, `users/${user.uid}`), {
          email: user.email,
          userId: user.uid
        });
        navigate('/it-society')
        email = '';
        password = '';
      })
      .catch((error) => {
        //pass
      });
  }

  const handleLogin = (event) => {
    event.preventDefault();
    let email = event.target[0].value
    let password = event.target[1].value

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate('/it-society');
        email = '';
        password = '';
      })
      .catch((error) => {
        //pass
      });
  }

  const handleGoogleSignIn = () => {
    navigate('/it-society')
    signInWithRedirect(auth, provider);
  }

  useEffect(() => {
    if(loggedUser) {
      navigate('/it-society');
    }
  })

  return (
    <Container className="mt-3" style={{ maxWidth: 600 }}>
      <Tabs
        defaultActiveKey={defaultKey}
        className="mb-3"
        justify
      >
        <Tab eventKey="login" title="Login" tabClassName="text-reset">
          <Form onSubmit={handleLogin}>
            <Row>
              <Form.Group className="mb-3" controlId="loginEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group className="mb-3" controlId="loginPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
            </Row>
            <Row className="justify-content-center">
              <Button variant="outline-dark" type="submit" style={{ maxWidth: '50%' }}>
                Login
              </Button>
            </Row>
          </Form>
          <Row className=" mt-2 justify-content-center">
              or
          </Row>
          <Row className=" mt-2 justify-content-center">
            <Button variant="outline-dark" onClick={handleGoogleSignIn} style={{ maxWidth: '50%' }}>
              Sign in with Google
            </Button>
          </Row>
        </Tab>
        <Tab eventKey="signup" title="Sign Up" tabClassName="text-reset">
          <Form onSubmit={handleSignup}>
            <Form.Group className="mb-3" controlId="signUpEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="signUpPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Row className="justify-content-center">
              <Button variant="outline-dark" type="submit" style={{ maxWidth: '50%' }}>
                Sign Up
              </Button>
            </Row>
          </Form>
          <Row className=" mt-2 justify-content-center">
              or
          </Row>
          <Row className=" mt-2 justify-content-center">
            <Button variant="outline-dark" onClick={handleGoogleSignIn} style={{ maxWidth: '50%' }}>
              Sign in with Google
            </Button>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  )
}

export default SignInUp;