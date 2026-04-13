import { useAuth } from './Context/Authcontext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard/Dashboard';
import './styles/Full.css';

function App() {
  const { user } = useAuth();

  return (
    <>
      <>
      {!user && <Auth />}
      {user && <Dashboard />}
    </>
    </>
  )
}

export default App
