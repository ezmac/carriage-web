import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableRow from '../TableComponents/TableRow';
import Form from '../UserForms/LocationsForm';
import { Location } from '../../types';
import styles from './table.module.css';

const Table = () => {
  const [locations, setLocations] = useState<Location[]>([]);

  const getExistingLocations = async () => {
    const locationsData = await axios.get('/api/locations')
      .then(({ data }) => data.data);
    setLocations(
      locationsData.map((location: any) => ({
        id: location.id,
        name: location.name,
        address: location.address,
        ...(location.tag && { tag: location.tag }),
      })),
    );
  };

  useEffect(() => {
    getExistingLocations();
  }, []);

  const addLocation = (newLocation: Location) => {
    const { id, ...body } = { ...newLocation };
    axios.post('/api/locations', body)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error('adding location failed');
        }
        const { data } = res;
        const validLocation = {
          id: data.id,
          name: data.name,
          address: data.address,
          ...(data.tag && { tag: data.tag }),
        };
        setLocations([...locations, validLocation]);
      })
      .catch((e) => console.error(e.message));
  };

  const deleteLocation = (locationId: string) => {
    axios.delete(`/api/locations/${locationId}`)
      .then((res) => {
        if (res.status === 200) {
          setLocations(locations.filter((l) => l.id !== locationId));
        } else {
          throw new Error('adding location failed');
        }
      })
      .catch((e) => console.error('removing location failed'));
  };

  const renderTableHeader = () => (
    <tr>
      <th className={styles.tableHeader}>Name</th>
      <th className={styles.tableHeader}>Address</th>
      <th className={styles.tableHeader}>Tag</th>
    </tr>
  );

  return (
    <div>
      <div>
        <h1 className={styles.formHeader}>Location Table</h1>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <tbody>
              {renderTableHeader()}
              {locations.map(({ id, name, address, tag }, index) => (
                <tr key={index}>
                  <TableRow
                    values={[
                      { data: name },
                      { data: address },
                      { data: '', tag },
                      {
                        data: 'Delete',
                        buttonHandler: () => deleteLocation(id),
                      },
                    ]}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Form onClick={addLocation} />
    </div>
  );
};

export default Table;
