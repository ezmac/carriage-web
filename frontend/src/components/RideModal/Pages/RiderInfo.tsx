import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import cn from 'classnames';
import { ObjectType, Location, NewRider } from '../../../types';
import { ModalPageProps } from '../../Modal/types';
import { Button, Input } from '../../FormElements/FormElements';
import styles from '../ridemodal.module.css';
import { useReq } from '../../../context/req';
import {useRiders} from '../../../context/RidersContext';

const RiderInfoPage = ({ onBack, onSubmit }: ModalPageProps) => {
  const { register, errors, handleSubmit } = useForm();
  const [nameToId, setNameToId] = useState<ObjectType>({});
  const [locationToId, setLocationToId] = useState<ObjectType>({});
  const { withDefaults } = useReq();
  const locations = Object.keys(locationToId).sort();
  const {riders} = useRiders();

  const beforeSubmit = ({ name, pickupLoc, dropoffLoc }: ObjectType) => {
    const rider = nameToId[name.toLowerCase()];
    const startLocation = locationToId[pickupLoc] ?? pickupLoc;
    const endLocation = locationToId[dropoffLoc] ?? dropoffLoc;
    onSubmit({ rider, startLocation, endLocation });
  };

  useEffect(() => {

        const nameToIdObj = riders.reduce((acc: ObjectType, r:NewRider) => {
          const fullName = `${r.firstName} ${r.lastName}`.toLowerCase();
          acc[fullName] = r.id;
          return acc;
        }, {});
        setNameToId(nameToIdObj);

    fetch('/api/locations', withDefaults())
      .then((res) => res.json())
      .then(({ data }: { data: Location[] }) => {
        const locationToIdObj = data.reduce((acc: ObjectType, l) => {
          acc[l.name] = l.id;
          return acc;
        }, {});
        setLocationToId(locationToIdObj);
      });
  }, [withDefaults, riders]);

  return (
    <form onSubmit={handleSubmit(beforeSubmit)} className={styles.form}>
      <div className={cn(styles.inputContainer, styles.rider)}>
        <div className={styles.name}>
          <Input
            name="name"
            type="text"
            placeholder="Name"
            className={styles.nameInput}
            ref={register({
              required: true,
              validate: (name: string) => (
                nameToId[name.toLowerCase()] !== undefined
              ),
            })}
          />
          {errors.name && <p className={styles.error}>Rider not found</p>}
        </div>
        <div className={styles.pickupLocation}>
          <Input
            name="pickupLoc"
            type="text"
            placeholder="Pickup Location"
            list="locations"
            ref={register({ required: true })}
          />
          {errors.pickupLoc && <p className={styles.error}>Please enter a location</p>}
          <datalist id="locations">
            {locations.map((l) => (
              l === 'Custom' ? null : <option key={l}>{l}</option>
            ))}
          </datalist>
        </div>
        <div className={styles.dropoffLocation}>
          <Input
            name="dropoffLoc"
            type="text"
            placeholder="Dropoff Location"
            list="locations"
            ref={register({ required: true })}
          />
          {errors.dropoffLoc && <p className={styles.error}>Please enter a location</p>}
          <datalist id="locations">
            {locations.map((l) => (
              l === 'Custom' ? null : <option key={l}>{l}</option>
            ))}
          </datalist>
        </div>
      </div>
      <div className={styles.btnContainer}>
        <Button outline type="button" onClick={onBack}>Back</Button>
        <Button type="submit">Add a Ride</Button>
      </div>
    </form>
  );
};

export default RiderInfoPage;
