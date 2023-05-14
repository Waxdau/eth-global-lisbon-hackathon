import { Routes, Route, Link } from 'react-router-dom';
import SideBar from './components/Sidebar';
import Propose from './routes/Propose';
import Create from './routes/Create';
import Sign from './routes/Sign';
import Wallet from './routes/Wallet';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<SideBar />}>
          <Route index element={<Create />} />
          <Route path="propose" element={<Propose />} />
          <Route path="sign" element={<Sign />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
