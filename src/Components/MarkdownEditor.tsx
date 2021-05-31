import React from 'react';
import { 
  Button,
  createMuiTheme,
  Dialog, DialogActions, DialogContent, DialogTitle,
  makeStyles,
  TextField,
  ThemeProvider,
  Typography,
} from '@material-ui/core';
import { IPaper } from '../Database';

// SCOPED STYLES
const useStyles = makeStyles({
  contentCtx: {
    border: 'rgba(179, 179, 179, 0.4) 1px solid',
    borderRadius: '5px',
    margin: '20px',
  },
  titleInput: {
    borderBottom: 'rgba(179, 179, 179, 0) solid 1px',
    backgroundColor: 'red',
    '&:hover': {
      borderBottom: 'rgba(179, 179, 179, 1) solid 1px',
    },
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  contentInput: {
    fontWeight: 'bold',
  },
  error: {
    color: '#F54F6D',
    display: 'flex',
    fontWeight: 'bold',
  },
});
const inputOverrideTheme = createMuiTheme({
  overrides: {
    MuiInput: {
      underline: {
          '&:before': {
          transition: 'border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          borderBottom: '1px solid rgba(0, 0, 0, 0)',
        },
      },
    },
  },
});

interface InputError {
  isError:  boolean,
  errorStr: string,
}
const DefaultInputError: InputError = { isError: false, errorStr: '' };

interface Props {
  isOpen: boolean,
  onClose: (message?: string) => void,
  onSubmit: (page: IPaper) => Promise<IPaper>,
  editPaper?: IPaper,
}

interface State {
  title:        string,
  titleError:   InputError,
  
  body:         string,
  bodyError:    InputError,

  author:       string,
  authorError:  InputError,

  category:     string,
  
  generalError: InputError,
}


export default function MarkdownEditor(props: Props): JSX.Element {
  const styles = useStyles();
  const { editPaper } = props;
  const [ state, setState ] = React.useState<State>({
    title: editPaper ? editPaper.title : 'Untitled Page',
    titleError: DefaultInputError,
    body: editPaper ? editPaper.body : '',
    bodyError: DefaultInputError,
    author: editPaper ? editPaper.author : '',
    authorError: DefaultInputError,
    category: editPaper ? editPaper.category || '' : '',
    generalError: DefaultInputError,
  });

  // METHODS
  const setInputValue = (val: string) => {
    setState({
      ...state,
      body: val,
    });
  };
  const setTitleValue = (val: string) => {
    setState({
      ...state,
      title: val,
    });
  };
  const setAuthorValue = (val: string) => {
    setState({
      ...state,
      author: val,
    });
  };
  const setCatagoryValue = (val: string) => {
    // Max 64 length
    if (val.length > 64)
      return;
    
    setState({
      ...state,
      category: val,
    });
  };
  
  const onSubmit = () => {
    const {
      author, body, title, category,
    } = state;
    const { editPaper } = props;
    
    // Reset Error State
    setState({
      ...state,
      titleError: DefaultInputError,
      bodyError: DefaultInputError,
      authorError: DefaultInputError,
      generalError: DefaultInputError,
    });
    
    // No Empty Inputs
    [ [ 'author', author ], [ 'body', body ], [ title, 'title' ] ].forEach(elt => {
      const [ key, val ] = elt;
      
      !val && setState({
        ...state,
        [`${key}Error`]: {
          isError: true,
          errorStr: 'Input cannot be empty!',
        },
      });
    });
    
    props.onSubmit({
      title,
      body,
      author,                       // NOTE: Author name to be looked up and mapped/created new ID
      category: category ? category : undefined,
      tags: [],                     // TODO:
      type: 'Article',              // TODO:
    })
      .then(newPaper => props.onClose(`New Paper '${newPaper.title}' ${editPaper ? 'Modified' : 'Added'}`))
      .catch(err => {
        console.log(`${editPaper ? 'Edit' : 'Add'} Paper Error: `, err);
        setState({
          ...state,
          generalError: {
            isError: true,
            errorStr: err.data.err || 'Internal Error',
          },
        });
      });
  };
  
  return (
    <Dialog
      fullWidth
      maxWidth='md'
      open={props.isOpen}
      onClose={() => props.onClose()}
    >
      <DialogTitle>
        <ThemeProvider theme={inputOverrideTheme}>
          <TextField
            fullWidth
            multiline
            value={state.title}
            onChange={event => setTitleValue(event.target.value)}
            inputProps={{
              className: `code ${styles.title}`,
            }}
            error={state.titleError.isError}
            helperText={state.titleError.isError && state.titleError.errorStr}
          />
        </ThemeProvider>
      </DialogTitle>
      <DialogContent className={styles.contentCtx}>
        <Typography className={styles.contentInput}>
          Body:
        </Typography>

        <TextField
          fullWidth
          multiline
          value={state.body}
          onChange={event => setInputValue(event.target.value)}
          inputProps={{
            className: 'code',
          }}
          error={state.bodyError.isError}
          helperText={state.bodyError.isError && state.bodyError.errorStr}
        />

        <TextField
          placeholder='Catagory (Optional)'
          style={{ marginTop: '15px', marginRight: '10px', alignSelf: 'flex-end' }}
          value={state.category}
          onChange={event => setCatagoryValue(event.target.value)}
          inputProps={{
            className: 'code',
          }}
        />
        
        <TextField
          placeholder='Author'
          style={{ marginTop: '15px', alignSelf: 'flex-end' }}
          value={state.author}
          onChange={event => setAuthorValue(event.target.value)}
          inputProps={{
            className: 'code',
          }}
          error={state.authorError.isError}
          helperText={state.authorError.isError && state.authorError.errorStr}
        />
      </DialogContent>

      <DialogContent>
      {state.generalError.isError && (
        <Typography variant='caption' className={styles.error}>
          {state.generalError.errorStr}
        </Typography>
      )}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => props.onClose()} autoFocus color='primary'>
          Close
        </Button>
        <Button onClick={onSubmit} autoFocus color='primary'>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}