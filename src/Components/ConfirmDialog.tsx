import React from 'react';
import {
  Button, Typography,
  Dialog, DialogActions, DialogContent, DialogTitle,
} from '@material-ui/core';


interface Props {
  title:      string,
  detail:     string,
  open:       boolean,
  onClose:    () => void,
  onConfirm:  () => void,
}

export default function ConfirmDialog({ open, title, detail, onClose, onConfirm }: Props): JSX.Element {
  return(
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant='subtitle1'>
          {detail}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onConfirm()} autoFocus color='primary'>
          Yes
        </Button>
        <Button onClick={onClose} autoFocus color='primary'>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}