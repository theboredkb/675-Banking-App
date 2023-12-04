import { Button } from 'react-bootstrap'

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
            <Button variant='primary'>
                Customer Login
            </Button>
        </div>
      </div>
    );
}
 
export default Homepage;