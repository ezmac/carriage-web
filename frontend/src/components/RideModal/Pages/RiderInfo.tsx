import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import cn from 'classnames';
import { ObjectType, Rider, Location } from '../../../types';
import { ModalPageProps } from '../../Modal/types';
import { Button, Input } from '../../FormElements/FormElements';
import styles from '../ridemodal.module.css';
import { useReq } from '../../../context/req';

const RiderInfoPage = ({ onBack, onSubmit }: ModalPageProps) => {
  const { register, errors, handleSubmit } = useForm();
  const [nameToId, setNameToId] = useState<ObjectType>({});
  const [locationToId, setLocationToId] = useState<ObjectType>({});
  const { withDefaults } = useReq();
  const locations = Object.keys(locationToId).sort();

  const beforeSubmit = ({ name, pickupLoc, dropoffLoc }: ObjectType) => {
    const rider = nameToId[name.toLowerCase()];
    const startLocation = locationToId[pickupLoc] ?? pickupLoc;
    const endLocation = locationToId[dropoffLoc] ?? dropoffLoc;
    onSubmit({ rider, startLocation, endLocation });
  };

  useEffect(() => {
    fetch('/api/riders', withDefaults())
      .then((res) => res.json())
      .then(({ data }: { data: Rider[] }) => {
        const nameToIdObj = data.reduce((acc: ObjectType, r) => {
          const fullName = `${r.firstName} ${r.lastName}`.toLowerCase();
          acc[fullName] = r.id;
          return acc;
        }, {});
        setNameToId(nameToIdObj);
      });

    fetch('/api/locations', withDefaults())
      .then((res) => res.json())
      .then(({ data }: { data: Location[] }) => {
        const locationToIdObj = data.reduce((acc: ObjectType, l) => {
          acc[l.name] = l.id;
          return acc;
        }, {});
        setLocationToId(locationToIdObj);
      });
  }, [withDefaults]);

  return (
    <form onSubmit={handleSubmit(beforeSubmit)} className={styles.form}>
      <div className={cn(styles.inputContainer, styles.rider)}>
        <div className={styles.name}>
          {errors.name && <p className={styles.error}>Rider not found</p>}
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
        </div>
        <div className={styles.pickupLocation}>
          {errors.pickupLoc && <p className={styles.error}>Please enter a location</p>}
          <Input
            name="pickupLoc"
            type="text"
            placeholder="Pickup Location"
            list="locations"
            ref={register({ required: true })}
          />
          <datalist id="locations">
            {locations.map((l) => (
              l === 'Custom' ? null : <option key={l}>{l}</option>
            ))}
          </datalist>
        </div>
        <div className={styles.dropoffLocation}>
          {errors.dropoffLoc && <p className={styles.error}>Please enter a location</p>}
          <Input
            name="dropoffLoc"
            type="text"
            placeholder="Dropoff Location"
            list="locations"
            ref={register({ required: true })}
          />
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
