import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SharedState } from './context/SharedState';
import Navbar from './components/Navbar';
import Login from './components/User/Login';
import Signup from './components/User/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import MainBody from './components/Body/MainBody';
import AddCustomerModal from './components/AddCustomerModal';
axios.defaults.withCredentials = true

function App() {
  return (

    <div>
      <SharedState>
        <Router>
          <Navbar />
          <AddCustomerModal/>
          <ToastContainer />
          <>
            <Routes>
              <Route exact path="/" element={<MainBody />} />
              <Route exact path="/lenders" element={<MainBody />} />
              <Route exact path="/login" element={<Login />} />
              {/* <Route exact path="/signup" element={<Signup />} /> */}
            </Routes>
          </>
        </Router>
      </SharedState>

    </div>

  );
}

export default App;
