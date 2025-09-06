import { Address } from "../addresses/types";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  address: Address;
}

export type Pagination = {
  pageNumber: number;
  pageSize: number;
  totalUsers: number;
};
