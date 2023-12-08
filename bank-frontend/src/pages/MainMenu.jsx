import { Link } from "react-router-dom";
import { Card, Form, Button, FloatingLabel, ListGroup } from "react-bootstrap";
import { useEffect, useState } from "react";

const MainMenuPage = () => {
  
  const [info, setUserInfo] = useState([]);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/user/userinfo");
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        } else {
          throw new Error('Failed to fetch user info');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);
  return (
    <>
      <Card className="mainMenu">
        <Card.Header>
          <Card.Title>Welcome {info.first_name} {info.last_name}</Card.Title>
        </Card.Header>

        <Card.Body>
        <Link to="/">
            <a>Logout</a>
        </Link>
          <h1>$ {info.balance}</h1>
          <h3>Total Balance</h3>

          <br></br>
          <br></br>

          <h3>Recent Transactions</h3>
          <ListGroup>
            <ListGroup.Item>
              <h3>Deposit</h3>
              <p>$100</p>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </>
  );
};

export default MainMenuPage;
