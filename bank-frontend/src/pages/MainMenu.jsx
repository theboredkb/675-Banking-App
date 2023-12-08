import { Link } from "react-router-dom";
import { Card, Form, Button, FloatingLabel, ListGroup } from "react-bootstrap";
import { useState } from "react";

const MainMenuPage = () => {
  return (
    <>
      <Card className="mainMenu">
        <Card.Header>
          <Card.Title>Welcome %username%</Card.Title>
        </Card.Header>

        <Card.Body>
          <Link to="/">
            <a>Logout</a>
          </Link>
          <h1>$%totalAccountBalance%</h1>
          <h3>Total Balance</h3>
          <Link to="/transactions">
            <a>Make a Withdrawl or Deposit</a>
          </Link>
          <br></br>
          <br></br>

          <h3>Recent Transactions</h3>
          <ListGroup>
            <ListGroup.Item>
              <h3>Deposit</h3>
              <p>$100</p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Withdrawl</h3>
              <p>$25</p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Withdrawl</h3>
              <p>$45</p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Withdrawl</h3>
              <p>$80</p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Deposit</h3>
              <p>$700</p>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </>
  );
};

export default MainMenuPage;
