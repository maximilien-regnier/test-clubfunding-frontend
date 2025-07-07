import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Layout from './components/Layout';
import ProjectsList from './pages/ProjectsList';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/projects" component={ProjectsList} />
          <Redirect to="/projects" />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App
