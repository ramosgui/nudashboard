import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import QrCode from './qrCodeComponent';
import useForm from '../hooks/useForm';
import axios from 'axios'

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function FormDialog(props) {
  const classes = useStyles();

  const [openQrCode, setQrCode] = React.useState(false);
  const [getUuid, setUuid] = React.useState(null);

  const [{ values, loading }, handleChange, handleSubmit] = useForm();

  const [openBackDrop, setOpenBackDrop] = React.useState(false);

  const enviarQr = () => {
    var host = window.location.hostname;
    axios.post('http://'+host+':5050/sync', { 'cpf': values.cpf, 'password': values.password, 'qr_uuid': getUuid }).then(res => {
      props.toggleState();
      handleQrClose();
      props.openSnackBar()
      handleCloseBackDrop();
    })
  };

  const handleQrOpen = () => {
    setQrCode(true);
  }

  const handleQrClose = () => {
    setQrCode(false);
  }

  const handleToggleBackDrop = () => {
    setOpenBackDrop(!openBackDrop);
  }

  const handleCloseBackDrop = () => {
    setOpenBackDrop(false)
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={props.toggleState}>
        Sync Transactions
      </Button>
      <Dialog open={props.state} onClose={props.toggleState} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Sync Transactions</DialogTitle>


        {openQrCode ?
          <DialogContent>
            <DialogContentText>
              Utilize esse QRCode para sincronizar suas transações. Após o mesmo escaneado, clique em "Submit".
            </DialogContentText>
            <QrCode varTeste={setUuid} reqParams={{ 'cpf': values.cpf, 'password': values.password, 'qr_uuid': getUuid }} closeDialog={props.toggleState} />
            <DialogActions>
              <form noValidate autoComplete="off" onSubmit={handleSubmit(enviarQr)}>
                <Button onClick={() => { props.toggleState(); handleQrClose(); }} color="primary">Cancel</Button>
                <Button onClick={handleToggleBackDrop} type="submit" color="primary">{loading ? "Submitting..." : "Submit"}</Button></form>
                <Backdrop className={classes.backdrop} open={openBackDrop} onClick={handleCloseBackDrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
            </DialogActions>

          </DialogContent> :
          <DialogContent>

            <TextField onChange={handleChange}
              autoFocus
              required
              margin="dense"
              id="cpf"
              name='cpf'
              label="CPF"
              fullWidth
            />
            <TextField onChange={handleChange}
              required
              margin="dense"
              id="password"
              name="password"
              label="Senha"
              type="password"
              fullWidth
            />

            <DialogActions>
              <Button onClick={() => { props.toggleState(); handleQrClose(); }} color="primary">Cancel</Button>
              <button onClick={handleQrOpen} color="primary">Continue</button>
            </DialogActions>
            
          </DialogContent>
        }
      </Dialog>
      
    </div>
  );
}