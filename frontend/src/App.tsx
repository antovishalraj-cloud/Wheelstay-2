import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Pages */
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SpaceDetails from './pages/SpaceDetails';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import BookingDetails from './pages/BookingDetails';
import CarDetails from './pages/CarDetails';
import DriverProfile from './pages/DriverProfile';
import MyBookings from './pages/MyBookings';
import MyProfile from './pages/MyProfile';
import AddSpace from './pages/AddSpace';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Landing */}
        <Route exact path="/home" component={Home} />

        {/* Auth */}
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />

        {/* Car Owner Flow */}
        <Route exact path="/cardetails" component={CarDetails} />
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/spacedetails/:id" component={SpaceDetails} />
        <Route exact path="/booking/:id" component={Booking} />
        <Route exact path="/payment/:id/:hours/:amount" component={Payment} />
        <Route exact path="/payment-success/:id/:hours/:amount" component={PaymentSuccess} />
        <Route exact path="/driver-profile" component={DriverProfile} />
        <Route exact path="/my-bookings" component={MyBookings} />

        {/* Space Owner Flow */}
        <Route exact path="/myprofile" component={MyProfile} />
        <Route exact path="/booking-details/:spaceId" component={BookingDetails} />
        <Route exact path="/addspace" component={AddSpace} />

        {/* Default redirect */}
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
