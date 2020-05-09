import React from 'react';

import '../styles/rider-dashboard.css';

const SideBar = () => {
  return (
    <>
      <div className="sideBar">
        <div className="icon_bucket">
          <div className="current_oval"></div>
          <p>Dashboard</p>
        </div>
        <div className="icon_bucket">
          <div className="oval"></div>
          <p>Today</p>
        </div>
        <div className="icon_bucket">
          <div className="oval"></div>
          <p>Metrics</p>
        </div>
        <div className="icon_bucket">
          <div className="oval"></div>
          <p>Settings</p>
        </div>
      </div>
    </>
  )
}

const RidesTable = () => {
  return (
    <table>
      <tr>
        <th></th>
        <th>Martha</th>
        <th>Mindy</th>
        <th>Kevin</th>
        <th>James</th>
        <th>Joshua</th>
        <th>Tina</th>
        <th>David</th>
      </tr>
      <tr>
        <td>8 AM</td>
      </tr>
      <tr>
        <td>9 AM</td>
      </tr>
      <tr>
        <td>10 AM</td>
      </tr>
      <tr>
        <td>11 AM</td>
      </tr>
      <tr>
        <td>12 PM</td>
      </tr>
    </table>
  )
}

const UnscheduledRides = () => {
  return (
    <div className="unscheduled_rides">
      <div className="scheduled_header_div">
        <h3 className="scheduled_h3">Unscheduled Rides</h3>
      </div>
      <table>
        <tr>
          <th></th>
          <th>Time</th>
          <th>Passenger</th>
          <th>Pickup Location</th>
          <th>Dropoff Location</th>
          <th>Needs</th>
        </tr>
        <tr>
          <td>8:20 AM</td>
          <td>Rose L.</td>
          <td>Eddygate Ctown</td>
          <td>Hollister Hall West</td>
          <td>Crutches</td>
          <td>
            <button> Edit</button>
          </td>
          <td>
            <button> Assign</button>
          </td>
        </tr>
        <tr>
          <td>8:20 AM</td>
          <td>Rose L.</td>
          <td>Eddygate Ctown</td>
          <td>Hollister Hall West</td>
          <td>Crutches</td>
          <td>
            <button> Edit</button>
          </td>
          <td>
            <button> Assign</button>
          </td>
        </tr>
      </table>
    </div>
  )
}

const ScheduledRides = () => {
  return (
    <div className="scheduled_rides">
      <div className="scheduled_header_div">
        <h3 className="scheduled_h3">Scheduled Rides</h3>
      </div>
    </div>
  )
}

const Dashboard = () => {
  return (
    <>
      <div className="flex-container">
        <SideBar />
        {/* display - sidebar + rides */}
        <div className="mainDisplay">
          <div className="schedule">
            <div className="schedule_header">
              <div>
                <h1 id="schedule_h1">Schedule</h1>
                <h2 id="date">March 11, 2020</h2>
              </div>
              <div className="header_buttons">
                <button>Add Rides</button>
                <button>Export</button>
              </div>
            </div>
            < RidesTable />
          </div>
          < UnscheduledRides />
          <ScheduledRides />
        </div>
      </div>
    </>
  )
};

export default Dashboard;