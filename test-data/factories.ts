import { faker } from '@faker-js/faker';

// Fresh data on every run keeps tests independent of each other and of leftovers
// on the shared demo site. The values used show up in the HTML report steps.

export interface Employee {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  salary: string;
  department: string;
}

export function buildEmployee(overrides: Partial<Employee> = {}): Employee {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName, provider: 'example.com' }).toLowerCase(),
    age: String(faker.number.int({ min: 18, max: 65 })),
    salary: String(faker.number.int({ min: 1500, max: 15000 })),
    department: faker.helpers.arrayElement(['QA', 'Engineering', 'Finance', 'Support', 'Legal']),
    ...overrides,
  };
}

export type Gender = 'Male' | 'Female' | 'Other';
export type Hobby = 'Sports' | 'Reading' | 'Music';

export interface Student {
  firstName: string;
  lastName: string;
  gender: Gender;
  mobile: string;
  email?: string;
  dateOfBirth?: { day: number; month: string; year: number };
  subjects?: string[];
  hobbies?: Hobby[];
  picture?: string;
  address?: string;
  state?: string;
  city?: string;
}

// Only the fields the form marks as required.
export function buildStudent(overrides: Partial<Student> = {}): Student {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    gender: faker.helpers.arrayElement<Gender>(['Male', 'Female', 'Other']),
    mobile: faker.string.numeric(10),
    ...overrides,
  };
}

const STATES_AND_CITIES: Record<string, string[]> = {
  NCR: ['Delhi', 'Gurgaon', 'Noida'],
  'Uttar Pradesh': ['Agra', 'Lucknow', 'Merrut'],
  Haryana: ['Karnal', 'Panipat'],
  Rajasthan: ['Jaipur', 'Jaiselmer'],
};

export function buildFullStudent(overrides: Partial<Student> = {}): Student {
  const birthday = faker.date.birthdate({ min: 18, max: 30, mode: 'age' });
  const state = faker.helpers.objectKey(STATES_AND_CITIES);
  const base = buildStudent();
  return {
    ...base,
    email: faker.internet.email({ firstName: base.firstName, lastName: base.lastName, provider: 'example.com' }).toLowerCase(),
    dateOfBirth: {
      day: birthday.getDate(),
      month: birthday.toLocaleString('en-US', { month: 'long' }),
      year: birthday.getFullYear(),
    },
    subjects: faker.helpers.arrayElements(['Maths', 'English', 'Physics', 'Chemistry', 'Computer Science'], 2),
    hobbies: faker.helpers.arrayElements<Hobby>(['Sports', 'Reading', 'Music'], { min: 1, max: 2 }),
    address: faker.location.streetAddress(),
    state,
    city: faker.helpers.arrayElement(STATES_AND_CITIES[state]),
    ...overrides,
  };
}

export interface Credentials {
  userName: string;
  password: string;
}

// Book Store passwords need upper, lower, digit and special characters.
export function buildBookStoreUser(): Credentials {
  return {
    userName: `qa_${faker.internet.username().replace(/\W/g, '').toLowerCase()}_${faker.string.alphanumeric(6)}`,
    password: `${faker.string.alpha({ length: 1, casing: 'upper' })}${faker.string.alpha({ length: 5, casing: 'lower' })}@${faker.string.numeric(4)}`,
  };
}
