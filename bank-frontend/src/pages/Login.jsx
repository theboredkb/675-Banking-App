import { Link } from "react-router-dom";
import {Card, Form, Button, FloatingLabel} from "react-bootstrap";
import { useState } from "react";

const LoginPage = () => {
    const [validated, setValidated] = useState(false);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const handleValidation = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        // event.stopPropagation();

        if (isFormValid() && validateEmail() && validatePassword()) {
          //Check if all passes
          console.log("[OK] Form validation success");
        } else {
          console.log("[ERROR] Form validation failure");
        }
      }

      setValidated(true);
    };

    return (
      <Card className="loginForm">
        <Card.Title>Login</Card.Title>
        <Card.Body>
          {/* Login form provided by react-bootstrap */}
          <Form noValidate validated={validated} onSubmit={handleValidation}>
            {/* Email Address form */}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <FloatingLabel
                required
                className="mb-3"
                controlId="formBasicEmail"
                label="Email Address">
                <Form.Control
                  required
                  type="email"
                  placeholder="Email Address"
                  value={email || ""}
                  onChange={(event) => setEmail(event.target.value)}
                  isInvalid={email !== null && email !== "" && !validateEmail()}
                />

                <Form.Control.Feedback type="invalid">
                  {email === null
                    ? "Enter an email address"
                    : "Enter a valid email address"}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>

            {/* Password form */}
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <FloatingLabel
                required
                className="mb-3"
                controlId="formBasicPassword"
                label="Password">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password || ""}
                  onChange={(event) => setPassword(event.target.value)}
                  isInvalid={
                    password !== null && password !== "" && !validatePassword()
                  }
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <p> </p>
              <Button variant="primary" type="submit">
                Log in
              </Button>
              
              <br></br>
              <br></br>

              <Link to="/">
                <a>Return Home</a>
              </Link>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    );
}
 
export default LoginPage;