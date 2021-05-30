import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { BreadcumbLink } from '../../Components/BreadcrumbNav';
import { RootContext } from '../../Store/RootStore';
import ReactMarkdown from 'react-markdown';
import { IAuthorDb, IPaperDb } from '../../Database';

// Overrides Author to be of type IAuthor
interface IPaperList extends Omit<IPaperDb, 'author'> {
  author: IAuthorDb,
}

interface Props {
  RouterProps: RouteComponentProps<{
    id: string;
  }>,
  breadcrumbUpdate: (link: BreadcumbLink) => void,
}

export default function Page(props: Props): JSX.Element {
  // ROOT STORE
  const rootStore = useContext(RootContext);
  const { papers, authors } = rootStore.db;


  // ROUTER PARAMS
  const { id } = props.RouterProps.match.params;
  const { location } = props.RouterProps;

  // MEMOIZED PAGE
  const paper: IPaperList = React.useMemo(() => ({
    ...(papers[id] as IPaperDb),
    author: (authors[papers[id].author] as IAuthorDb),
  }), [ papers, authors ]);

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
    <div>
      <ReactMarkdown skipHtml>
        {paper.body}
      </ReactMarkdown>
    </div>
  );
}
