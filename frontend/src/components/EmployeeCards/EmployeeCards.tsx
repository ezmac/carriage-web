import React from 'react';
import { Link } from 'react-router-dom';
import Card, { CardInfo } from '../Card/Card';
import styles from './employeecards.module.css';
import { clock, phone, wheel, user } from '../../icons/userInfo/index';
import { Employee, AvailabilityType, Driver, Admin } from '../../types';
import { useEmployees } from '../../context/EmployeesContext';
import formatAvailability from '../../util/employee';

const formatPhone = (phoneNumber: string) => {
  const areaCode = phoneNumber.substring(0, 3);
  const firstPart = phoneNumber.substring(3, 6);
  const secondPart = phoneNumber.substring(6, 10);
  return `${areaCode}-${firstPart}-${secondPart}`;
};

type EmployeeCardProps = {
  id: string,
  employee: Employee
}

const EmployeeCard = ({
  id,
  employee: {
    firstName,
    lastName,
    email,
    phoneNumber,
    availability,
    admin,
    photoLink,
  },
}: EmployeeCardProps) => {
  const netId = email.split('@')[0];
  const fmtPhone = formatPhone(phoneNumber);
  const fmtAvailability = formatAvailability(availability);
  const fullName = `${firstName}_${lastName}`;

  const isAdmin = !availability;
  const isBoth = !isAdmin && admin; // admin and driver
  const role = (): string => {
    if (isBoth) return 'Admin • Driver';
    if (isAdmin) return 'Admin';
    return 'Driver';
  };

  const userInfo = {
    id,
    firstName,
    lastName,
    netId,
    phone: fmtPhone,
    availability: fmtAvailability,
    admin,
    photoLink,
  };


  return (
    <Link to={{ pathname: '/employees/employee/' + userInfo.id, state: userInfo }}
      style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card
        firstName={firstName}
        lastName={lastName}
        netId={netId}
        photoLink={photoLink}
      >
        <CardInfo icon={phone} alt="phone icon">
          <p>{fmtPhone}</p>
        </CardInfo>

        <CardInfo icon={clock} alt="clock icon">
          <div>
            {fmtAvailability
              ? fmtAvailability.map(([day, timeRange]) => (
                <p key={day}><b>{day}:</b> {timeRange}</p>
              )) : <p>N/A</p>}
          </div>
        </CardInfo>

        <CardInfo
          icon={isAdmin || isBoth ? user : wheel}
          alt={isAdmin || isBoth ? 'admin icon' : 'wheel icon'}
        >
          <p>{role()}</p>
        </CardInfo>
      </Card>
    </Link>
  );
};

const EmployeeCards = () => {
  const { admins, drivers } = useEmployees();

  const allDrivers = [...admins, ...drivers];
  allDrivers.sort((a: Admin, b: Admin) => {
    if (a.firstName < b.firstName) { return -1; }
    if (a.firstName > b.firstName) { return 1; }
    return 0;
  });

  return (
    <div className={styles.cardsContainer}>
      {allDrivers && allDrivers.map((driver) => (
        <EmployeeCard
          key={driver.id}
          id={driver.id}
          employee={driver}
        />
      ))}
    </div>
  );
};

export default EmployeeCards;
