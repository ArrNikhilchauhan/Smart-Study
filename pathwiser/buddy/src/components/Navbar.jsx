// src/components/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="nav">
      <div className='logo' onClick={() => navigate('/')}>PathWiser</div>
        <ul className='list'>
          <li onClick={() => navigate('/exam')}>Exam prep</li>
          <li onClick={() => navigate('/code')}>Code Debugger</li>
          <li onClick={() => navigate('/roadmap')}>Roadmap</li>
          <li onClick={() => navigate('/ask')} className='askk'>Ask anything</li>
          <li onClick={() => navigate('/notes')} className='notes'>summarize NOtes</li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;