import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';

import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';


const app = new Clarifai.App({
  apiKey: '89bc2b8bf86945b19b2da10a23ecd114'
});

const particle =
{
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (user) => {
    this.setState({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        entries: user.entries,
        joined: user.joined
      }
    })
  }

  onInputChange = (event) => {

    this.setState({ input: event.target.value });

  }

  componentDidMount() {
    fetch('http://localhost:3000/') // Accessing base root route
      .then(res => res.json())         // to get all users
      .then(console.log);
    // By default fetch uses get method...
  }

  calculateFaceLocation(data) {

    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    }

  }

  displayFaceBorder = (box) => {

    this.setState({ box: box });
  }

  onButtonSubmit = () => {

    this.setState({ imageUrl: this.state.input });

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image',
            {
              method: 'put',
              headers: { 'Content-type': 'Application/Json' },
              body: JSON.stringify(
                {
                  id: this.state.user.id
                }
              )
            })
            .then(res => res.json())
            .then(count => {
              this.setState({
                user: {
                  entries: count
                }
              })
            })
          this.displayFaceBorder(this.calculateFaceLocation(response))
        }
      }

      )
      .catch(err => console.log(err));

  }

  onRouteChange = (route) => {

    if (route === 'signout')
      this.setState({ isSignedIn: false })
    else if (route === 'home')
      this.setState({ isSignedIn: true })

    this.setState({ route: route });
  }


  render() {
    return (

      <div className="App" >
        <Particles className="particles"
          params={particle}
        />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
        {
          this.state.route === 'home'
            ? <div><Logo />
              
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
            </div>
            :
            (
              this.state.route === 'signin' ?
                <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            )

        }
      </div>

    );

  }

}

export default App;
