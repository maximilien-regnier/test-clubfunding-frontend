import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Layout from './components/Layout';
import ProjectsList from './pages/ProjectsList';
import ProjectDetails from './pages/ProjectDetails';
import ProjectNew from './pages/ProjectNew';
import ProjectEdit from './pages/ProjectEdit';
import TaskNew from './pages/TaskNew';
import TaskEdit from './pages/TaskEdit';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/projects" component={ProjectsList} />
          <Route exact path="/projects/new" component={ProjectNew} />
          <Route exact path="/projects/:id/edit" component={ProjectEdit} />
          <Route exact path="/tasks/new" component={TaskNew} />
          <Route exact path="/tasks/:id/edit" component={TaskEdit} />
          <Route path="/projects/:id" component={ProjectDetails} />
          <Redirect to="/projects" />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App
