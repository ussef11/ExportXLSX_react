import React, { useEffect, useState } from 'react';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import './App.css';

function App() {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  const [data, setData] = useState([]);
  const [db, setDb] = useState('');
  const [df, setDf] = useState('');


  const getWsCols = (data) => [
    { wch: Math.max(...data.map(item => item.numerodeparc?.length || 0)) },
    { wch: 12 },  // lat
    { wch: 12 },  // lon
    { wch: Math.max(...data.map(item => item.ntag?.length || 0)) },
    { wch: Math.max(...data.map(item => item.type?.length || 0)) },
    { wch: 20 },  // date
    { wch: 10 },  // status
    { wch: 10 }   // remplacent
  ];

  const exportToCSV = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "frontend_lang=fr_FR");
    const raw = JSON.stringify({
      "db": db,
      "df": df
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    try {
      const response = await fetch("http://rabat.geodaki.com:5000/api/getalltag", requestOptions);
      const result = await response.json();
      setData(result);
      const ws = XLSX.utils.json_to_sheet(result);
      ws['!cols'] = getWsCols(result);
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const dataBlob = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(dataBlob, 'Data_fBacs' + fileExtension);
    }catch (error)
    {
      console.error(error);
    }
  };


  return (
    <div className="App">
      <div className='dvinp'> 
      <div style={{margin:" 19px"}}>
        <label>Debut : </label>
        <input  onChange={(e) => setDb(e.target.value)} value={db} type='date' />
      </div>
      <div style={{margin:" 19px"}}>
        <label>Fin : </label>
        <input style={{marginLeft: "17px"}} onChange={(e) => setDf(e.target.value)} value={df} type='date' />
      </div>
      <div className='btndv'>

      <button onClick={exportToCSV}>
        Export Data
      </button>
      </div>
</div>      

    </div>
  );
}

export default App;
