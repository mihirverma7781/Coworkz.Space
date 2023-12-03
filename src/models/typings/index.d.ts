/* eslint-disable @typescript-eslint/no-namespace */
declare namespace NModel {
  interface IUserModel {
    tenetID: string;
    email: string;
    isEmailVerified: boolean;
    is2FAEnabled: boolean;
    isOnboarded: boolean;
    number: string;
    isNumberVerified: boolean;
    password?: string;
    basicDetails?: IBasicDetails;
    workDetails?: IWorkDetails[];
    educationalDetails?: IEducationDetails[];
    certificationDetails?: ICertificationDetails[];
    socialHandles?: ISocialDetails;
    skills?: string[];
  }

  interface IBasicDetails {
    firstName: string;
    lastName: string;
    location: string;
    profileUrl?: string;
    workAuthorization?: EWorkAuthorization;
    profileHeadline: string;
    profileDescription?: string;
    mobileVisible: boolean;
    whatsappUpdates: boolean;
  }

  interface IWorkDetails {
    employer: string;
    employerLocation: string;
    industry: string;
    designation: string;
    workDescription: string;
    currentlyWorking: string;
    from: {
      month: number;
      year: number;
    };
    to: {
      month: number;
      year: number;
    };
  }

  interface IEducationDetails {
    educationLevel: EducationalLevel;
    degree: string;
    board: string;
    institute: string;
    completionYear: number;
    specialization: string;
  }

  interface ICertificationDetails {
    certificationName: string;
    issuingAuthority: string;
    issueDate: {
      month: number;
      year: number;
    };
  }

  interface ISocialDetails {
    facebook: string;
    linkedIn: string;
    dribbble: string;
    behance: string;
    twitter: string;
  }

  enum EWorkAuthorization {
    "Citizen",
    "Resident",
    "Work Viza",
    "Need Sponsership",
  }

  enum EducationalLevel {
    "Matriculation",
    "Under Graduate",
    "Graduate",
    "Post Graduate",
    "Doctrate",
  }
}

export default NModel;
