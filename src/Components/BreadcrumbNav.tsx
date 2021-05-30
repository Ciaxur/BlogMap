import React from 'react';
import { Link } from 'react-router-dom';
import { 
  makeStyles, Breadcrumbs,
} from '@material-ui/core';
import { 
  HomeOutlined as HomeIcon,
  PagesOutlined as PagesIcon,
} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  link: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));

export interface BreadcumbLink {
  name:     string,
  path:     string,
  onPress:  () => void,
}

interface Props {
  links: BreadcumbLink[],
}

export function RenderBreadcrumbs(props: Props): JSX.Element {
  const styles = useStyles();
  const { links } = props;
  
  return(
    <Breadcrumbs className={styles.container}>
      <Link to='/' className={styles.link}>
        <HomeIcon className={styles.icon} />
        Home
      </Link>
      {links.map(link => (
        <Link to={link.path} className={styles.link}>
          <PagesIcon className={styles.icon} />
          {link.name}
        </Link>
      ))}
    </Breadcrumbs>
  );
}