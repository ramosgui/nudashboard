import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Chip from '@material-ui/core/Chip';


export default function TemporaryDrawer(props) {

  const [lastUpdateDate, setLastUpdateDate] = useState(null);

  useEffect(() => {
    var host = window.location.hostname;
    axios.get('http://' + host + ':5050/sync/last_updated', {}).then(res => {
      setLastUpdateDate(res.data.dt)
    });
  }, [lastUpdateDate, props.syncModalState])


  return (
    <div id="lastUpdate">
      <Chip style={{ color: '#EEEEEE', height: '45px' }}
        label={<div><div>Data da última sincronização</div><div>{lastUpdateDate}</div></div>}
        clickable
        variant="outlined"
      />
    </div>
  )
}