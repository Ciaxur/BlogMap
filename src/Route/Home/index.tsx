import { Button, Chip, makeStyles, Snackbar, TextField } from '@material-ui/core';
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
  pageActions: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  paperEntry: {
    display: 'flex',
    alignItems: 'center',
  },
  paperEntryContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    width: '100%',
    justifyContent: 'space-between',
  },
  whitespace: {
    width: '10px',
    opacity: 0,
  },
});


interface Props {
  // eslint-disable-next-line @typescript-eslint/ban-types
  RouterProps: RouteComponentProps<{}>,
  breadcrumbUpdate: (link: BreadcumbLink) => void,
}

interface State {
  isAddNewPage: boolean,
  filterTags:   string[],
  filterTitle:  string,

  openSnackbar: boolean,
  snackbarStr:  string,
}

export default function Home(props: Props): JSX.Element {
  // HOOKS & HOME STATE
  const [ state, setState ] = React.useState<State>({
    isAddNewPage: false,
    filterTags: [],
    filterTitle: '',

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
      .filter(val => (state.filterTags.length
        ? val.tags.some(tag => state.filterTags.includes(tag))    // filter by tags
        : true)       // no filtering
        && (state.filterTitle
          ? val.title.match(new RegExp(state.filterTitle, 'gi'))  // filter by title
          : true      // no filtering)
        ),
      )
      .map(val => ({
        ...val,
      }));
  }, [ papers, state.filterTags, state.filterTitle ]);

  // METHODS
  const toggleNewPage = (message?: string) => {
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

  const parseDate = (date: string | Date): string => {
    return new Date(date).toDateString();
  };

  const addTagFilter = (tag: string) => {
    if (state.filterTags.includes(tag))
      return;
    
    setState({
      ...state,
      filterTags: state.filterTags.concat(tag),
    });
  };

  const remTagFilter = (tag: string) => {
    setState({
      ...state,
      filterTags: state.filterTags.filter(elt => elt !== tag),
    });
  };

  const filterByTitle = (pattern: string) => {
    setState({
      ...state,
      filterTitle: pattern,
    });
  };
  
  return(
    <div className={styles.root}>
      <h2 style={{ alignSelf: 'center' }}>Blog Map</h2>
      <div className={styles.pageActions}>
        <TextField 
          size='small'
          placeholder='Search'
          onChange={e => filterByTitle(e.target.value)}
        />
        <div>
          {state.filterTags.map((tag, idx) => (
            <Chip
              key={idx}
              style={{ margin: 2 }}
              variant='outlined'
              label={tag}
              size='small'
              color='primary'
              onDelete={() => remTagFilter(tag)}
            />
          ))}
          <Button onClick={() => toggleNewPage()}>
            <PlusIcon /> Add Page
        </Button>
        </div>
      </div>
      
      {paperList
        .sort((a, b) => (new Date(b.createdAt).getTime()) - (new Date(a.createdAt).getTime()))
        .map(val => (<div key={val._id} className={styles.paperEntryContainer}>
          <Link className={styles.paperEntry} to={`/page/${val._id}`} key={val._id}>
            <h3>{val.title}</h3>
            <hr className={styles.whitespace} />
            <em>( {parseDate(val.createdAt)} )</em>
          </Link>
          <div>
            {val.tags.map((tag, idx) => (
              <Chip
                key={idx}
                style={{ margin: 2 }}
                variant='outlined'
                label={tag}
                size='small'
                onClick={() => addTagFilter(tag)}
              />
            ))}
            {(val.category &&
              <Chip
                color='primary'
                style={{ margin: 2 }}
                variant='outlined'
                size='small'
                label={val.category}
              />
            )}
          </div>
        </div>))}

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