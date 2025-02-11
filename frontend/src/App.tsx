import { BrowserRouter as Router,Route,Routes,Navigate } from 'react-router-dom';
import Layout from './layouts/layout';
import Register from './pages/Register';
import Signin from './pages/Signin';
const App=()=>{
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Layout>
          <p>Home</p>
        </Layout>}/>
        <Route path="search" element={<Layout>
          <p>Search</p>
        </Layout>}/>
        <Route path="/register" element={<Layout>
          <Register/>
        </Layout>}/>
        <Route path="/signin" element={<Layout>
          <Signin/>
        </Layout>} />
        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    </Router>
  );
}
export default App;