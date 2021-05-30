import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { 
  makeStyles,
} from '@material-ui/core';

// COMPONENTS
import { BreadcumbLink, RenderBreadcrumbs } from '../Components/BreadcrumbNav';

// CONTEXT STORE
import { RootContext, DefaultRootContext } from '../Store/RootStore';
import * as DbActions from '../Store/Actions/Database.actions';
import { rootReducer } from '../Store/Reducers/RootReducer';

// ROUTES
import Page from './Page';
import Home from './Home';


const useStyles = makeStyles(theme => ({
  root: {
    padding: '30px 20vw',
    textAlign: 'center',
  },
  lineBreak: {
    borderTop: '#B3B3B3 1px solid',
    width: '100%',
    opacity: 0.2,
  },
  link: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));


function App(): JSX.Element {
  const styles = useStyles();
  
  // Initial Store State
  const [ rootStoreState, rootStoreDispatch ] = React.useReducer(rootReducer, DefaultRootContext);

  // Breadcrumb State
  const [ breadState, setBreadState ] = React.useState<BreadcumbLink[]>([]);
  
  /** Init Root Store with Actions on App Mount */
  React.useEffect(() => {
    rootStoreDispatch({
      type: 'SET_INIT_STORE',
      data: {
        uri: {
          backend: process.env.REACT_APP_BACKEND_URI as string,
          setBackendUri: (state, uri) => DbActions.setBackendUri(uri, state, rootStoreDispatch),
        },

        db: {
          ...rootStoreState.db,
          addAuthor: (state, author) => DbActions.addAuthor(author, state, rootStoreDispatch),
          modAuthor: (state, author) => DbActions.modAuthor(author, state, rootStoreDispatch),
          remAuthor: (state, author) => DbActions.remAuthor(author, state, rootStoreDispatch),

          addPaper: (state, paper) => DbActions.addPaper(paper, state, rootStoreDispatch),
          modPaper: (state, paper) => DbActions.modPaper(paper, state, rootStoreDispatch),
          remPaper: (state, paper) => DbActions.remPaper(paper, state, rootStoreDispatch),
        },
      },
    });
  }, []);

  /** Initial DB Sync */
  React.useEffect(() => {
    // Sync with Remote DB
    if (!rootStoreState.db.synced && rootStoreState.uri.backend.length) {
      DbActions.populateDatabaseStore(rootStoreState, rootStoreDispatch);
    }
  }, [ rootStoreState ]);


  // METHODS
  const setLinkDepth = (index: number, link: BreadcumbLink): void => {
    // Root Depth
    if (index === 0)
      setBreadState([]);
    // Append Value
    else
      setBreadState(breadState.slice(0, index).concat(link));
  };
  
  return (
    <RootContext.Provider value={rootStoreState}>
      <div className={styles.root}>
        <Router>
          <RenderBreadcrumbs links={breadState} />
          <hr className={styles.lineBreak} />

          <Switch>
            <Route exact path='/' render={(props) => (
              <Home
                RouterProps={props}
                breadcrumbUpdate={link => setLinkDepth(0, link)}
              />
            )} />
            <Route path='/page/:id' render={(props) => (
              <Page
                RouterProps={props}
                breadcrumbUpdate={link => setLinkDepth(1, link)}
              />
            )} />
          </Switch>
        </Router>
      </div>
    </RootContext.Provider>
  );
}

export default App;
