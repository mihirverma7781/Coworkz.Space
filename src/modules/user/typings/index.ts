/* eslint-disable @typescript-eslint/no-namespace */
declare namespace NUser {
  namespace Body {
    interface IBasicDetails {
      firstName: string;
      lastName: string;
      location: string;
      profileUrl?: string;
      workAuthorization?: EWorkAuthorization;
      profileHeadline: string;
      profileDescription?: string;
      mobileVisible?: boolean;
      whatsappUpdates?: boolean;
    }

    enum EWorkAuthorization {
      "Citizen",
      "Resident",
      "Work Viza",
      "Need Sponsership",
    }
  }
}

export default NUser;
