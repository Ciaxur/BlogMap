import React from 'react';
import { makeStyles } from '@material-ui/core';

// CONTEXT STORE
import { RootContext, DefaultRootContext } from '../Store/RootStore';
import * as DbActions from '../Store/Actions/Database.actions';
import { rootReducer } from '../Store/Reducers/RootReducer';

const useStyles = makeStyles({
  root: {
    textAlign: 'center',
  },
});

function App(): JSX.Element {
  const styles = useStyles();
  
  // Initial Store State
  const [ rootStoreState, rootStoreDispatch ] = React.useReducer(rootReducer, DefaultRootContext);

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
  

  return (
    <RootContext.Provider value={rootStoreState}>
      <div className={styles.root}>
        <h1>BlogMap</h1>
      </div>
    </RootContext.Provider>
  );
}

export default App;
