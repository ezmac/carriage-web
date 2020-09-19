import React from 'react';
import { Passenger } from '../../types/index';
import './unscheduledTable.css';


function renderTableHeader() {
  return (
    <tr>
      <th></th>
      <th className="tableHeader">Time</th>
      <th className="tableHeader">Passenger</th>
      <th className="tableHeader">Pickup Location</th>
      <th className="tableHeader">Dropoff Location</th>
      <th className="tableHeader">Needs</th>
    </tr>
  );
}

const Table = () => {
  const passengers = [
    { startTime: '8:20am', endTime: '8:40am', name: 'Rose Lisborn', pickupLocation: 'Eddygate', pickupTag: 'Ctown', dropoffLocation: 'Hollister Hall', dropoffTag: 'West', needs: 'Crutches' },
    { startTime: '8:30am', endTime: '8:50am', name: 'Rose Lisborn', pickupLocation: 'Eddygate', pickupTag: 'Ctown', dropoffLocation: 'Hollister Hall', dropoffTag: 'West', needs: 'Crutches' },
    { startTime: '9:10am', endTime: '9:40am', name: 'Rose Lisborn', pickupLocation: 'Eddygate', pickupTag: 'Ctown', dropoffLocation: 'Hollister Hall', dropoffTag: 'West', needs: 'Crutches' },
    { startTime: '9:30am', endTime: '9:50am', name: 'Rose Lisborn', pickupLocation: 'Eddygate', pickupTag: 'Ctown', dropoffLocation: 'Hollister Hall', dropoffTag: 'West', needs: 'Crutches' },
    { startTime: '10:10am', endTime: '10:30am', name: 'Rose Lisborn', pickupLocation: 'Eddygate', pickupTag: 'Ctown', dropoffLocation: 'Hollister Hall', dropoffTag: 'West', needs: 'Crutches' },

  ];

  function renderTableData(allPassengers: Passenger[]) {
    let currentTime = '';
    return allPassengers.map((rider, index) => {
      const { startTime, endTime, name, pickupLocation, pickupTag,
        dropoffLocation, dropoffTag, needs } = rider;
      const colon = startTime.indexOf(':');
      const timeOfDay = startTime.substring(startTime.indexOf('m') - 1).toUpperCase();
      const startHour = startTime.substring(0, colon) + timeOfDay;
      if (startHour !== currentTime) {
        currentTime = startHour;
      } else {
        currentTime = '';
      }

      const timeframe = currentTime;
      return (
        <tr key={index}>
          <td className="cell">{timeframe}</td>
          <td className="cell"><span style={{ fontWeight: 'bold' }}>{startTime}</span> <br></br> <span style={{ color: '#707070' }}>-- {endTime}</span></td>
          <td className="passInfo cell firstCell">{name}</td>
          <td className="passInfo cell"><span>{pickupLocation}</span> <span style={{ background: '#D5F2EA', borderRadius: '10px', padding: '5px' }}>{pickupTag}</span></td>
          <td className="passInfo cell"><span>{dropoffLocation}</span> <span style={{ background: '#FFD8DE', borderRadius: '10px', padding: '5px' }}>{dropoffTag}</span></td>
          <td className="passInfo cell lastCell">{needs}</td>
        </tr >
      );
    });
  }

  return (
    <>
      <div>
        <h1 className="formHeader">Unscheduled Rides</h1>
        <table cellSpacing='0' className="table" >
          <tbody>
            {renderTableHeader()}
            {renderTableData(passengers)}
          </tbody>
        </table>
      </div >
    </>
  );
};

export default Table;
