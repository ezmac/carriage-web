import React, { useState, useRef } from 'react';
import { CSVLink } from 'react-csv';
import moment from 'moment';
import RideModal from '../../components/RideModal/RideModal';
import UnscheduledTable from '../../components/UserTables/UnscheduledTable';
import Schedule from '../../components/Schedule/Schedule';
import MiniCal from '../../components/MiniCal/MiniCal';
import Notification from '../../components/Notification/Notification';
import styles from './page.module.css';
import { useEmployees } from '../../context/EmployeesContext';
import ExportButton from '../../components/ExportButton/ExportButton';
import { useReq } from '../../context/req';
import { useDate } from '../../context/date';
import Collapsible from '../../components/Collapsible/Collapsible';

const Home = () => {
  const { drivers } = useEmployees();
  const { withDefaults } = useReq();

  const [downloadData, setDownloadData] = useState<string>('');
  const csvLink = useRef<CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }>(null);
  const { curDate } = useDate();
  const today = moment(curDate).format('YYYY-MM-DD');

  const downloadCSV = () => {
    fetch(`/api/rides/download?date=${today}`, withDefaults())
      .then((res) => res.text())
      .then((data) => {
        if (data === '') {
          setDownloadData('Name,Pick Up,From,To,Drop Off,Needs,Driver');
        } else {
          setDownloadData(data);
        }
        if (csvLink.current) {
          csvLink.current.link.click();
        }
      });
  };

  return (
    <main>
      <div className={styles.pageTitle}>
        <h1 className={styles.header}>Homepage</h1>
        <div className={styles.rightSection}>
          <CSVLink
            data={downloadData}
            filename={`scheduledRides_${today}.csv`}
            className='hidden'
            ref={csvLink}
            target='_blank'
            tabIndex={-1}>
               <ExportButton onClick={downloadCSV} />
            </CSVLink>
          <RideModal />
          <Notification />
        </div>
      </div>
      <MiniCal />
      <Schedule />
      <Collapsible title={'Unscheduled Rides'}>
        <UnscheduledTable drivers={drivers} />
      </Collapsible>
    </main>
  );
};

export default Home;
