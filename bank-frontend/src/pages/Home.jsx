import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom';

const Homepage = () => {
    return (
      <div className="content">
        <div>
          <h1>Welcome to the 675 Bank</h1>
          <h2>Banking, reinvigorated.</h2>
        </div>
        <br></br>
        <div>
          <p>Serving %totalCustomers% customers since 2004.</p>
          <p>Protecting $%totalMoney% worth of assets.</p>
          <br></br>
          <br></br>
          <Link to="/Login">
            <Button variant="primary">Customer Login</Button>
          </Link>
        </div>
      </div>
    );
}
 
export default Homepage;