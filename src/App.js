import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  Row,
  Col,
  Jumbotron,
  Button
} from 'reactstrap';

class App extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      name: '',
      company: '',
      blog: '',
      location: '',
      bio: '',
      city: '',
      inputCity: '',
      lat: '',
      lon: '',
      elevation: '',
      forecast: '',
      temperature: '',
      wind: '',
    };

    this.handleClick = this.handleClick.bind(this)

  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  async handleClick(e) {

    e.preventDefault();
    const newItem = document.getElementById("addInput");

    if (newItem.value !== "") {
      this.setState({
        inputCity: newItem.value
      })
    }

    let user_name = 'uncheckederror'
    if (this.state.name !== '') {
      this.setState({
        name: '',
        company: '',
        blog: '',
        location: '',
        bio: '',
        city: '',
        inputCity: '',
        lat: '',
        lon: '',
        elevation: '',
        forecast: '',
        temperature: '',
        wind: '',
      })
    } else {
      const response = await axios.get(`https://api.github.com/users/${user_name}`)
      this.setState({
        name: response.data.name,
        company: response.data.company,
        blog: response.data.blog,
        location: response.data.location,
        bio: response.data.bio
      })
      const city = await axios.get(`https://nominatim.openstreetmap.org/search?q=${this.state.inputCity}&format=json&limit=1`)
      this.setState({
        city: city.data[0].display_name,
        lat: city.data[0].lat,
        lon: city.data[0].lon
      })
      const weatherReport = await axios.get(`https://api.weather.gov/points/${this.state.lat},${this.state.lon}`)
      const forecast = await axios.get(`${weatherReport.data['properties'].forecast}`)
      const feetInMetersRatio = 3.281
      console.log(forecast.data['properties'])
      this.setState({
        elevation: forecast.data['properties'].elevation.value * feetInMetersRatio,
        forecast: forecast.data['properties'].periods[0].detailedForecast,
        temperature: `${forecast.data['properties'].periods[0].temperature} 
        ${forecast.data['properties'].periods[0].temperatureUnit} and 
        ${forecast.data['properties'].periods[0].temperatureTrend}`,
        wind: `Winds blowing from the ${forecast.data['properties'].periods[0].windDirection} 
        at ${forecast.data['properties'].periods[0].windSpeed}`,
      })
    }
  }

  render() {
    return (
      <div>
        <Navbar color="inverse" light expand="md">
          <NavbarBrand href="/">WhereToSki.XYZ</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/components/">About</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/uncheckederror">Github</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <Jumbotron>
          <Container>
            <Row>
              <Col>
                <div className="input-group mb-3">
                  <input type="text" className="form-control" id='addInput' placeholder="Enter your City here..." aria-label="Enter you city here" aria-describedby="button-addon2" />
                  <div className="input-group-append">
                    <Button tag="button" color="primary" size="large" onClick={this.handleClick}>Search</Button>
                  </div>
                </div>
                <div>
                  <p>
                    Query against open data APIs from the National Weather Service, Open Street Maps, and others to find the best Ski area to hit this weekend.
                  </p>
                  <p>{this.state.name}</p>
                  <p>{this.state.company}</p>
                  <p>{this.state.blog}</p>
                  <p>{this.state.location}</p>
                  <p>{this.state.bio}</p>
                  <p>{this.state.city}</p>
                  <p>{this.state.lat}</p>
                  <p>{this.state.lon}</p>
                  <p>{this.state.elevation}</p>
                  <p>{this.state.forecast}</p>
                  <p>{this.state.temperature}</p>
                  <p>{this.state.wind}</p>
                </div>
              </Col>
            </Row>
          </Container>
        </Jumbotron>
        <Container>
          <Row>
            <Col>
              <footer>
                <p className="text-center">Created by @uncheckederror</p>
              </footer>
            </Col>
          </Row>
        </Container>

      </div>
    );
  }
}

export default App;
