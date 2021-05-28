import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    textAlign: 'center',
  },
});

function App(): JSX.Element {
  const styles = useStyles();
  
  return (
    <div className={styles.root}>
      <h1>BlogMap</h1>
    </div>
  );
}

export default App;
