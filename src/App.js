import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import List from './Components/List'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
    <Routes>
     <Route path='/' element={<List></List>} ></Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
