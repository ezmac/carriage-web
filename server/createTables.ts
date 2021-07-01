import dynamoose from 'dynamoose';
import config from './config';
import { Admin } from './models/admin';
import { Driver } from './models/driver';
import { Location } from './models/location';
import { Ride } from './models/ride';
import { Rider } from './models/rider';
import { Stats } from './models/stats';
import { Subscription } from './models/subscription';
import { Vehicle } from './models/vehicle';

const port = process.env.PORT || 3001;

dynamoose.aws.sdk.config.update(config);
if (process.env.DYNAMODB_URL) {
  console.log("Dynamoose local mode engaged");
//  dynamoose.local()
  dynamoose.aws.ddb.local(process.env.DYNAMODB_URL);
}
else {
  dynamoose.aws.sdk.config.update(config);
}

console.log(Admin.alreadyCreated);
console.log(Driver.alreadyCreated);
console.log(Location.alreadyCreated);
console.log(Ride.alreadyCreated);

console.log(Rider.alreadyCreated);
console.log(Subscription.alreadyCreated);
console.log(Stats.alreadyCreated);
console.log(Vehicle.alreadyCreated);
