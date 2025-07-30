export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Operation' | 'Finance';
  isActive: boolean;
}

export interface Offer {
  id: string;
  title: string;
  code: string;
  client: string;
  location: string;
  pax: number;
  startDate: string;
  endDate: string;
  days: number;
  totalPrice: number;
  pricePerPerson: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined' | 'Completed';
  optionComment?: string;
  createdBy: string;
  createdOn: string;
  lastEditedBy?: string;
  lastEditedOn?: string;
  isFollowUp: boolean;
  isDeleted: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: NavigationItem[];
  roles: User['role'][];
}