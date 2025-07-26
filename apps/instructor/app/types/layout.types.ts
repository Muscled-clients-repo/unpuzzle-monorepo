import { ReactNode } from "react";
import { MenuItem } from "./lib.types";

export interface SidebarProps {
  user?: User | null;
}

export interface RootState {
  sidebar: {
    persistent: boolean;
    isVisible: boolean;
  };
}

export interface SiteLayoutProps {
  children: ReactNode;
}

export interface User {
  id?: string;
  passwordEnabled?: boolean;
  totpEnabled?: boolean;
  backupCodeEnabled?: boolean;
  twoFactorEnabled?: boolean;
  banned?: boolean;
  locked?: boolean;
  createdAt?: number;
  updatedAt?: number;
  imageUrl?: string;
  hasImage?: boolean;
  primaryEmailAddressId?: string | null;
  primaryPhoneNumberId?: string | null;
  primaryWeb3WalletId?: string | null;
  lastSignInAt?: number | null;
  externalId?: string | null;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  publicMetadata?: {
    privileges: string;
  };
  privateMetadata?: Record<string, any>;
  unsafeMetadata?: Record<string, any>;
  emailAddresses?: {
    id: string;
    emailAddress: string;
    verification: {
      status: string;
      strategy: string;
      externalVerificationRedirectURL: string | null;
      attempts: number | null;
      expireAt: number | null;
      nonce: string | null;
      message: string | null;
    };
    linkedTo: {
      id: string;
      type: string;
    }[];
  }[];
  phoneNumbers?: any[];
  web3Wallets?: any[];
  externalAccounts?: {
    id: string;
    approvedScopes: string;
    emailAddress: string;
    imageUrl: string;
    username: string;
    publicMetadata: Record<string, any>;
    label: string | null;
    verification: {
      status: string;
      strategy: string;
      externalVerificationRedirectURL: string | null;
      attempts: number | null;
      expireAt: number | null;
      nonce: string | null;
      message: string | null;
    };
  }[];
  samlAccounts?: any[];
  lastActiveAt?: number | null;
  createOrganizationEnabled?: boolean;
  createOrganizationsLimit?: number | null;
  deleteSelfEnabled?: boolean;
  legalAcceptedAt?: number | null;
}
