import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { BreadcumbLink } from '../../Components/BreadcrumbNav';
import { RootContext } from '../../Store/RootStore';
import ReactMarkdown from 'react-markdown';
import { IAuthorDb, IPaper, IPaperDb } from '../../Database';
import { MoreVertOutlined as MenuIcon } from '@material-ui/icons';
import ConfirmDialog from '../../Components/ConfirmDialog';

const useStyles = makeStyles({
  root: {
    textAlign: 'left',
    '& hr': {
      opacity: 0.2,
    },
    '& h1, h2, h3, h4, h5, h6': {
      margin: '8px 0px',
    },
  },
  metadata: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

// Overrides Author to be of type IAuthor
interface IPaperList extends Omit<IPaperDb, 'createdAt' | 'updatedAt'> {
  createdAt:  string,
  updatedAt:  string,
}

interface MenuState {
  isOpen: boolean,
  anchor: HTMLElement | null,
}

interface PaperModState {
  openConfirm:  boolean,
  isEdit:       boolean,
}

interface Props {
  RouterProps: RouteComponentProps<{
    id: string;
  }>,
  breadcrumbUpdate: (link: BreadcumbLink) => void,
}

export default function Page(props: Props): JSX.Element {
  const styles = useStyles();
  
  // ROOT STORE
  const rootStore = useContext(RootContext);
  const { papers, authors } = rootStore.db;

  // ROUTER PARAMS
  const { id } = props.RouterProps.match.params;
  const { location } = props.RouterProps;

  // MEMOIZED PAGE
  const [ paper, author ]: [IPaperList | null, IAuthorDb | null ] = React.useMemo(() => {
    // Not found
    if (!papers[id]) {
      return [ null, null ];
    }

    const createdAt = new Date((papers[id] as IPaperDb).createdAt);
    const updatedAt = new Date((papers[id] as IPaperDb).updatedAt);

    return [ {
      ...(papers[id] as IPaperDb),
      createdAt: `${createdAt.toLocaleDateString()} - ${createdAt.toLocaleTimeString()}`,
      updatedAt: `${updatedAt.toLocaleDateString()} - ${updatedAt.toLocaleTimeString()}`,
    }, {
      ...authors[papers[id].author],
      _id: papers[id].author,
    } as IAuthorDb ];
  }, [ papers, authors ]);

  // UPDATE ID BREADCRUMB
  React.useEffect(() => {
    const { papers } = rootStore.db;
    
    props.breadcrumbUpdate({
      name: papers[id] ? papers[id].title : 'Unknown',
      path: location.pathname,
      onPress: () => { return; }, // Do nothing
    });
  }, [ id, papers ]);

  // MENU STATE / METHODS
  const [ menuState, setMenuState ] = React.useState<MenuState>({
    isOpen: false,
    anchor: null,
  });
  
  const closePageMenu = () => {
    setMenuState({
      isOpen: false,
      anchor: null,
    });
  };
  const showPageMenu = (e: React.MouseEvent<HTMLElement>) => {
    setMenuState({
      isOpen: true,
      anchor: e.currentTarget,
    });
  };

  // PAPER MOD STATE / METHODS
  const [ modState, setModState ] = React.useState<PaperModState>({
    openConfirm: false, isEdit: false,
  });
  const onCloseConfirmDialog = () => {
    setModState({
      ...modState,
      openConfirm: false,
    });
  };
  const onConfirmedPageRemove = (page: IPaperList) => {
    setModState({
      ...modState,
      openConfirm: false,
    });
    rootStore.db.remPaper(rootStore, page as any);
  };

  
  // RENDER METHODS
  const renderMenu = (): JSX.Element => {
    return (
      <div>
        <IconButton
          size='small'
          onClick={e => showPageMenu(e)}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          open={menuState.isOpen}
          anchorEl={menuState.anchor}
          keepMounted
          onClose={closePageMenu}
        >
          <MenuItem onClick={() => {
            closePageMenu();
          }}>Edit</MenuItem>
          <MenuItem onClick={() => {
            setModState({ ...modState, openConfirm: true });
            closePageMenu();
          }}>Remove</MenuItem>
        </Menu>
      </div>
    );
  };

  const renderNotFound = (): JSX.Element => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h2>Page Not Found</h2>
      </div>
    );
  };
  
  return (
    <div className={styles.root}>
      {paper === null || author === null
        ? renderNotFound()
        : <>
          <Typography className={styles.metadata} variant='caption'>
            {renderMenu()}<em>by {author.name} on {paper.createdAt}</em>
          </Typography>

          <ReactMarkdown skipHtml rawSourcePos>
            {paper.body}
          </ReactMarkdown>

          <ConfirmDialog
            detail='Removing this page is permanent and connot be undone'
            title={`Are you sure you want to Remove "${paper.title}"?`}
            onClose={onCloseConfirmDialog}
            onConfirm={() => onConfirmedPageRemove(paper)}
            open={modState.openConfirm}
          />
        </>}
    </div>
  );
}
