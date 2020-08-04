import React from 'react';
import ReactModal from 'react-modal';
import SyncComponent from './syncComponent';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

ReactModal.setAppElement('#root');

class ExampleApp extends React.Component {
  constructor () {
    super();
    this.state = {
      showModal: false
    };
    
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }
  
  handleOpenModal () {
    this.setState({ showModal: true });
  }
  
  handleCloseModal () {
    this.setState({ showModal: false });
  }
  
  render () {
    return (<>
        <Button variant="contained" color="primary" onClick={this.handleOpenModal}>Sync Statements</Button>
        
        <ReactModal 
           isOpen={this.state.showModal}
           contentLabel="onRequestClose Example"
           style={{
            content: {
                top                   : '50%',
                left                  : '50%',
                right                 : 'auto',
                bottom                : 'auto',
                marginRight           : '-50%',
                transform             : 'translate(-50%, -50%)'
            }
          }}
           onRequestClose={this.handleCloseModal}
        >
            <p><SyncComponent/></p>
          <button onClick={this.handleCloseModal}>Close Modal</button>
        </ReactModal></>
    );
  }
}

export default ExampleApp;
