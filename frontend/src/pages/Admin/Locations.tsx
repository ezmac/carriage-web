import React, { useEffect, useState } from 'react';
import { useReq } from 'context/req';
import { Location } from 'types';
import LocationsTable from '../../components/UserTables/LocationsTable';
import styles from './page.module.css';
import Notification from '../../components/Notification/Notification';
import LocationModal from '../../components/LocationModal/LocationModal';

const Locations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const { withDefaults } = useReq();

  useEffect(() => {
    const getExistingLocations = async () => {
      const locationsData = await fetch('/api/locations', withDefaults())
        .then((res) => res.json())
        .then((data) => data.data);
      setLocations(locationsData);
    };
    getExistingLocations();
  }, [withDefaults]);

  const handleAddLocation = (newLocation: Location) => {
    setLocations([...locations, newLocation]);
  };

  return (
    <div>
      <div className={styles.pageTitle}>
        <h1 className={styles.header}>Locations</h1>
        <div className={styles.rightSection}>
          <LocationModal onAddLocation={handleAddLocation} />
          <Notification />
        </div>
      </div>
      <LocationsTable
        locations={locations}
        setLocations={setLocations}
      />
    </div>
  );
};

export default Locations;
