interface DataItem {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: { lat: string; lng: string };
  };
  phone: string;
  website: string;
  company: { name: string; catchPhrase: string; bs: string };
}

interface ModalItem {
  name: string;
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: {
    lat: string;
    lng: string;
  };
  companyName: string;
  catchPhrase: string;
  bs: string;
}

interface DefaultState {
  data: DataItem[] | [];
  tableData: DataItem[] | [];
}

export type { DataItem, ModalItem, DefaultState };
