import { Button, makeStyles, Snackbar } from '@material-ui/core';
import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { BreadcumbLink } from '../../Components/BreadcrumbNav';
import { IAuthorDb, IPaper, IPaperDb } from '../../Database';
import { RootContext } from '../../Store/RootStore';
import {
  AddCircleOutline as PlusIcon,
} from '@material-ui/icons';

// COMPONENTS
import MarkdownEditor from '../../Components/MarkdownEditor';


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

interface State {
  isAddNewPage: boolean,

  openSnackbar: boolean,
  snackbarStr:  string,
}

export default function Home(props: Props): JSX.Element {
  // HOOKS & HOME STATE
  const [ state, setState ] = React.useState<State>({
    isAddNewPage: false,

    openSnackbar: false,
    snackbarStr: '',
  });
  const styles = useStyles();
  
  // ROUTER PARAMS
  const { location } = props.RouterProps;

  // ROOT STORE
  const rootStore = React.useContext(RootContext);
  const { papers, authors } = rootStore.db;
  
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

  // METHODS
  const toggleNewPage = (message?: string) => {
    console.log('Message', message);
    setState({
      ...state,
      isAddNewPage: !state.isAddNewPage,
      openSnackbar: message ? true : state.openSnackbar,
      snackbarStr: message ? message : state.snackbarStr,
    });
  };

  const submitNewPage = async (page: IPaper): Promise<IPaper> => {
    const { addAuthor, addPaper } = rootStore.db;
    
    // Try to Map Author to Page
    try {
      const authorDbEntry = Object
        .values(authors)
        .filter(val => val.name.toLocaleLowerCase() === page.author.toLocaleLowerCase());

      if (!authorDbEntry.length) {
        const author = await addAuthor(rootStore, {
          name: page.author,
        });
        page.author = author._id;
      } else {
        page.author = (authorDbEntry[0] as IAuthorDb)._id;
      }
    } catch (e) {
      return Promise.reject(e);
    }
    
    // Add Paper with mapped Author
    return addPaper(rootStore, page);
  };

  const closeSnackbar = () => {
    setState({
      ...state,
      openSnackbar: false,
      snackbarStr: '',
    });
  };
  
  return(
    <div className={styles.root}>
      <h2 style={{ alignSelf: 'center' }}>Blog Map</h2>
      <Button onClick={() => toggleNewPage()} style={{ alignSelf: 'flex-end' }}>
        <PlusIcon /> Add Page
      </Button>
      
      {paperList.map(val => (
        <Link to={`/page/${val._id}`} key={val._id}>
          <h3>{val.title}</h3>
        </Link>
      ))}

      {/* MARKDOWN EDITOR DIALOG */}
      {<MarkdownEditor 
        isOpen={state.isAddNewPage}
        onClose={toggleNewPage}
        onSubmit={submitNewPage}
      />}

      {/* SNACKBAR */}
      <Snackbar 
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={state.openSnackbar}
        autoHideDuration={2500}
        onClose={closeSnackbar}
        message={state.snackbarStr}
      />
    </div>
  );
}