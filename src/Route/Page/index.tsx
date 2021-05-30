import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { BreadcumbLink } from '../../Components/BreadcrumbNav';
import { RootContext } from '../../Store/RootStore';
import ReactMarkdown from 'react-markdown';
import { IAuthorDb, IPaperDb } from '../../Database';
import { makeStyles, Typography } from '@material-ui/core';

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
  },
});

// Overrides Author to be of type IAuthor
interface IPaperList extends Omit<IPaperDb, 'author' | 'createdAt' | 'updatedAt'> {
  author:     IAuthorDb,
  createdAt:  string,
  updatedAt:  string,
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
  const paper: IPaperList = React.useMemo(() => {
    const createdAt = new Date((papers[id] as IPaperDb).createdAt);
    const updatedAt = new Date((papers[id] as IPaperDb).updatedAt);

    return {
      ...(papers[id] as IPaperDb),
      author: (authors[papers[id].author] as IAuthorDb),
      createdAt: `${createdAt.toLocaleDateString()} - ${createdAt.toLocaleTimeString()}`,
      updatedAt: `${updatedAt.toLocaleDateString()} - ${updatedAt.toLocaleTimeString()}`,
    };
  }, [ papers, authors ]);

  // UPDATE ID BREADCRUMB
  React.useEffect(() => {
    const { papers } = rootStore.db;
    
    props.breadcrumbUpdate({
      name: papers[id] ? papers[id].title : 'Unknown',
      path: location.pathname,
      onPress: () => { return; }, // Do nothing
    });
  }, [ id ]);
  
  return (
    <div className={styles.root}>
      <Typography className={styles.metadata} variant='caption'>
        <em>by {paper.author.name} on {paper.createdAt}</em>
      </Typography>
      
      <ReactMarkdown skipHtml rawSourcePos>
        {paper.body}
      </ReactMarkdown>
    </div>
  );
}
