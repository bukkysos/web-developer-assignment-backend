import { connection } from "../connection";

import {
  selectCountOfUsersTemplate,
  selectUsersTemplate,
} from "./query-templates";
import { User } from "./types";

export const getUsersCount = (): Promise<number> =>
  new Promise((resolve, reject) => {
    connection.get<{ count: number }>(
      selectCountOfUsersTemplate,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.count);
      }
    );
  });

export const getUsers = async (
  pageNumber: number,
  pageSize: number
): Promise<User[]> => {
  const result = await new Promise((resolve, reject) => {
     connection.all<User>(
      selectUsersTemplate,
      [pageNumber * pageSize, pageSize],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  }) as User[];

  return buildUsersWithAddresses(result);
}

/**
 * @description function to build users with their addresses as sqllite3 returns flat rows
 * Builds an array of users with their associated addresses from the raw database rows.
 * @param rows The raw database rows.
 * @returns An array of users with their addresses.
 */
const buildUsersWithAddresses = (rows: any[]): User[] => rows.map(row => ({
  id: row.id,
  name: row.name,
  username: row.username,
  email: row.email,
  phone: row.phone,
  address: {
    id: row.address_id,
    userId: row.address_user_id,
    street: row.address_street,
    state: row.address_state,
    city: row.address_city,
    zipcode: row.address_zipcode,
  }
})) as User[];
