import { makeStyles } from '@material-ui/core';
import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { BreadcumbLink } from '../../Components/BreadcrumbNav';
import { IPaperDb } from '../../Database';
import { RootContext } from '../../Store/RootStore';

// SCOPED STYLES
const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});


interface Props {
  // eslint-disable-next-line @typescript-eslint/ban-types
  RouterProps: RouteComponentProps<{}>,
  breadcrumbUpdate: (link: BreadcumbLink) => void,
}

export default function Home(props: Props): JSX.Element {
  const styles = useStyles();
  
  // ROUTER PARAMS
  const { location } = props.RouterProps;

  // ROOT STORE
  const rootStore = React.useContext(RootContext);
  const { papers } = rootStore.db;
  
  // UPDATE ID BREADCRUMB
  React.useEffect(() => {
    props.breadcrumbUpdate({
      name: 'Home',
      path: location.pathname,
      onPress: () => { return; }, // Do nothing
    });
  }, []);

  // MEMOIZED PAPER LIST
  const paperList: IPaperDb[] = React.useMemo(() => {
    return Object.values(papers as { [id: string]: IPaperDb })
      .map(val => ({
        ...val,
      }));
  }, [ papers ]);
  
  return(
    <div className={styles.root}>
      <h2 style={{ alignSelf: 'center' }}>BlogMap</h2>
      
      {paperList.map(val => (
        <Link to={`/page/${val._id}`} key={val._id}>
          <h3>{val.title}</h3>
        </Link>
      ))}
    </div>
  );
}