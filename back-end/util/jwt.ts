import jwt from 'jsonwebtoken';
import { Role } from '../types';

const generateJWTtoken = ({
  email,
  role
}: {
  email: string,
  role: Role
}): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresHours = process.env.JWT_EXPIRES_HOURS;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  if (!jwtExpiresHours) {
    throw new Error('JWT_EXPIRES_HOURS is not defined in environment variables');
  }

  const options = {
    expiresIn: `${jwtExpiresHours}h`,
    issuer: 'jeugdwerk'
  };

  try {
    return jwt.sign({
      email,
      role
    }, jwtSecret, options);
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw new Error('Something went wrong while generating JWT Token');
  }
}

export default {
  generateJWTtoken
};