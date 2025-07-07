
export interface CalculateDeliveryParams {
  type: number;
  date: string;
  currency: number;
  lang: string;
  from_location: {
    code: number;
  };
  to_location: {
    code: number;
    postal_code?: string;
    city?: string;
    country_code?: string;
    region?: string;
    address?: string;
  };
  packages: Array<{
    number?: string;
    weight: number;
    length?: number;
    width?: number;
    height?: number;
    comment?: string;
  }>;
  services?: Array<{
    code: string;
    parameter?: string;
  }>;
}

export interface CdekCity {
  code: number;
  city: string;
  country_code: string;
  country: string;
  region: string;
  region_code: number;
  fias_guid: string;
  postal_codes: string[];
  longitude?: number;
  latitude?: number;
  time_zone: string;
}

export interface CdekDeliveryPoint {
  code: string;
  name: string;
  location: {
    country_code: string;
    region_code: number;
    region: string;
    city_code: number;
    city: string;
    postal_code: string;
    longitude: number;
    latitude: number;
    address: string;
    address_full: string;
  };
  nearest_station?: string;
  nearest_metro_station?: string;
  work_time: string;
  phones: Array<{
    number: string;
  }>;
  email?: string;
  note?: string;
  type: string;
  owner_code: string;
  take_only: boolean;
  is_handout: boolean;
  is_reception: boolean;
  have_cashless: boolean;
  have_cash: boolean;
  allowed_cod: boolean;
  site: string;
  office_image_list: Array<{
    url: string;
  }>;
  work_time_list: Array<{
    day: number;
    time: string;
  }>;
  weight_min?: number;
  weight_max?: number;
}

export interface CdekOrder {
  type: number;
  number?: string;
  tariff_code: number;
  comment?: string;
  developer_key?: string;
  shipment_point?: string;
  delivery_point?: string;
  date_invoice?: string;
  shipper_name?: string;
  shipper_address?: string;
  delivery_recipient_cost?: {
    value: number;
    vat_sum?: number;
    vat_rate?: number;
  };
  from_location: {
    code: number;
    postal_code?: string;
    country_code?: string;
    city?: string;
    address?: string;
  };
  to_location: {
    code: number;
    postal_code?: string;
    country_code?: string;
    city?: string;
    address?: string;
  };
  packages: Array<{
    number: string;
    weight: number;
    length?: number;
    width?: number;
    height?: number;
    comment?: string;
    items?: Array<{
      name: string;
      ware_key: string;
      payment: {
        value: number;
      };
      cost: number;
      weight: number;
      amount: number;
    }>;
  }>;
  services?: Array<{
    code: string;
    parameter?: string;
  }>;
}