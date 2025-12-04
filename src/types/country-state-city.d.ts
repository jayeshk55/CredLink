declare module "country-state-city" {
  export interface City {
    name: string;
    stateCode: string;
    countryCode: string;
  }

  export interface State {
    name: string;
    isoCode: string;
    countryCode: string;
  }

  export class City {
    static getCitiesOfCountry(countryCode: string): City[];
  }

  export class State {
    static getStateByCodeAndCountry(stateCode: string, countryCode: string): State | undefined;
  }
}
