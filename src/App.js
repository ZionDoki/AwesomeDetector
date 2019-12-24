import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Dashboard from './dashboard/classDashboard';
import Login from './login';


class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      key: undefined,
    };
  }

 

  //login
  // setKey = (key, remember) => {
  //   this.setState({ key });
  //   if(remember)
  //     localStorage.setItem('local_key', key);
  // }

  render() {
    // const { key } = this.state;
    // const local_key = localStorage.getItem('local_key');
    console.log(document.cookie);
    return (
      <Router>
        <Switch>
          <Route exact path='/' render={() => <Redirect to='/dashboard' />} />
          <Route 
            path='/dashboard'
            render={({history, match}) => <Dashboard history={history} match={match} />}
          />
          <Route
            path="/login"
            render={({history, match}) => <Login history={history} match={match} />}
          />
        </Switch>
      </Router>
    );
    
  }
}

export default App;
