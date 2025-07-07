import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Layout from './components/Layout';
import ProjectsList from './pages/ProjectsList';
import ProjectDetails from './pages/ProjectDetails';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/projects" component={ProjectsList} />
          <Route path="/projects/:id" component={ProjectDetails} />
          <Redirect to="/projects" />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App
