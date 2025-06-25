import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import Portfolio from './pages/Dashboard3'
import TradePage from './pages/Trade'
import Login from './pages/Login'
import Register from './pages/Register'
import Account from './pages/Account'


function App() {

  return (
   <Router>
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/dashboard' element={<Portfolio />} />
      <Route path='/trade' element={<TradePage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path="/account" element={<Account />} />
    </Routes>
   </Router>
  )
}

export default App
