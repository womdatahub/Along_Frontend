export type Endpoint = {
  path: string;
  method: string;
  category: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
};

export type EndpointPermission = {
  endpoint: Endpoint;
  rolesWithAccess: string[];
  usersWithAccess: string[];
};

export type RolePermission = {
  [key: string]: {
    role: string;
    endpoints: Endpoint[];
  };
};
