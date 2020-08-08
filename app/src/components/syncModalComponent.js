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

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [openQrCode, setQrCode] = React.useState(false);
  const [getUuid, setUuid] = React.useState(null);

  const [{ values, loading }, handleChange, handleSubmit] = useForm();

  const enviarQr = () => {
    axios.post('http://localhost:5050/sync', { 'cpf': values.cpf, 'password': values.password, 'qr_uuid': getUuid }).then(res => {
    })
    handleClose();
    handleQrClose();
  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleQrOpen = () => {
    setQrCode(true);
  }

  const handleQrClose = () => {
    setQrCode(false);
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Sync Transactions
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Sync Transactions</DialogTitle>


        {openQrCode ?
          <DialogContent>
            <DialogContentText>
              Utilize esse QRCode para sincronizar suas transações. Após o mesmo escaneado, clique em "Submit".
            </DialogContentText>
            <QrCode varTeste={setUuid} reqParams={{ 'cpf': values.cpf, 'password': values.password, 'qr_uuid': getUuid }} closeDialog={handleClose} />
            <DialogActions>
              <form noValidate autoComplete="off" onSubmit={handleSubmit(enviarQr)}>
                <Button onClick={() => { handleClose(); handleQrClose(); }} color="primary">Cancel</Button>
                <Button type="submit" color="primary">{loading ? "Submitting..." : "Submit"}</Button></form>
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
              <Button onClick={() => { handleClose(); handleQrClose(); }} color="primary">Cancel</Button>
              <button onClick={handleQrOpen} color="primary">Continue</button>
            </DialogActions>
          </DialogContent>



        }
      </Dialog>
    </div>
  );
}