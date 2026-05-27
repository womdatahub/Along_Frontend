import { create } from "zustand";
import type {
  Endpoint,
  EndpointPermission,
  RolePermission,
  SelectorFn,
} from "@/types";
import { devtools } from "zustand/middleware";
import { requests } from "@/lib";
import { toast } from "sonner";

type PermissionType = {
  isFetching: boolean;
  isLoading: boolean;
  allEndpoints: Endpoint[];
  allEndpointsPermissions: EndpointPermission | null;
  singleRolePermission: Endpoint[];
  allRolePermissions: RolePermission | null;
  allAdminPermissions: Endpoint[];
  singleAdminPermission: Endpoint[];
  actions: {
    getSingleRolePermissions: (role: string) => Promise<void>;
    getAllRolePermissions: () => Promise<void>;
    getAllAdminPermissions: (adminID: string) => Promise<void>;
    getSingleAdminPermissions: (adminID: string) => Promise<void>;
    getAllEndpoints: () => Promise<void>;
    getEndpointPermissions: (endpointId: string) => Promise<void>;
    grantRolePermission: (data: {
      role: string;
      endpointIds: string[];
    }) => Promise<void>;
    revokeRolePermission: (data: {
      role: string;
      endpointIds: string[];
    }) => Promise<void>;
    grantAdminPermission: (data: {
      adminId: string;
      endpointIds: string[];
      expiresAt: string;
    }) => Promise<void>;
    revokeAdminPermission: (data: {
      adminId: string;
      endpointIds: string[];
    }) => Promise<void>;
  };
};

// /permissions/users/grant => grant single admin permission
// /permissions/roles/grant => grant a role permission

const initialState = {
  isLoading: false,
  isFetching: false,
  allEndpoints: [],
  allEndpointsPermissions: null,
  allRolePermissions: null,
  singleRolePermission: [],
  allAdminPermissions: [],
  singleAdminPermission: [],
};

export const usePermission = create<PermissionType>()(
  devtools((set) => ({
    ...initialState,
    actions: {
      getAllAdminPermissions: async (adminID) => {
        set({ isLoading: true });
        const { data, error } = await requests.permissions.getAdminPermissions(adminID);
        if (error) {
          set({ isLoading: false });
          return;
        }
        if (data) {
          set({ isLoading: false, allAdminPermissions: data.data.rolePermissions });
        }
      },
      getSingleAdminPermissions: async (adminID) => {
        set({ isFetching: true });
        const { data, error } = await requests.permissions.getAdminDirectPermissions(adminID);
        if (error) {
          set({ isFetching: false });
          return;
        }
        if (data) {
          set({ isFetching: false, singleAdminPermission: data.data.endpoints });
        }
      },
      getSingleRolePermissions: async (role) => {
        set({ isFetching: true });
        const { data, error } = await requests.permissions.getRolePermissions(role);
        if (error) {
          set({ isFetching: false });
          return;
        }
        if (data) {
          set({ isFetching: false, singleRolePermission: data.data.endpoints });
        }
        set({ isFetching: false });
      },
      getAllRolePermissions: async () => {
        set({ isLoading: true });
        const { data, error } = await requests.permissions.getAllRolePermissions();
        if (error) {
          set({ isLoading: false });
          return;
        }
        if (data) {
          set({ isLoading: false, allRolePermissions: data.data });
        }
      },
      getAllEndpoints: async () => {
        set({ isLoading: true });
        const { data, error } = await requests.permissions.getAllEndpoints();
        if (error) {
          set({ isLoading: false });
          return;
        }
        if (data) {
          set({ isLoading: false, allEndpoints: data.data });
        }
      },
      getEndpointPermissions: async (endpointId) => {
        set({ isLoading: true });
        const { data, error } = await requests.permissions.getEndpointPermissions(endpointId);
        if (error) {
          set({ isLoading: false });
          return;
        }
        if (data) {
          set({ isLoading: false, allEndpointsPermissions: data.data });
        }
      },
      grantRolePermission: async (rolePermissionData) => {
        set({ isLoading: true });
        const { data, error } = await requests.permissions.grantRolePermission(rolePermissionData);
        if (error) {
          set({ isLoading: false });
          return;
        }
        if (data) {
          set({ isLoading: false });
          toast.success(data.message ?? "Permissions granted");
        }
      },
      revokeRolePermission: async (revokePermissionData) => {
        if (revokePermissionData.endpointIds.length === 0) return;
        set({ isLoading: true });
        const { data, error } = await requests.permissions.revokeRolePermission(revokePermissionData);
        if (error) {
          set({ isLoading: false });
          return;
        }
        if (data) {
          set({ isLoading: false });
          toast.success(data.message ?? "Permissions revoked");
        }
      },
      grantAdminPermission: async (adminPermissionData) => {
        set({ isLoading: true });
        const { data, error } = await requests.permissions.grantAdminPermission(adminPermissionData);
        if (error) {
          set({ isLoading: false });
          return;
        }
        if (data) {
          set({ isLoading: false });
        }
      },
      revokeAdminPermission: async (revokeAdminPermissionData) => {
        if (revokeAdminPermissionData.endpointIds.length === 0) return;
        set({ isLoading: true });
        const { data, error } = await requests.permissions.revokeAdminPermission(revokeAdminPermissionData);
        if (error) {
          set({ isLoading: false });
          return;
        }
        if (data) {
          set({ isLoading: false });
          toast.success(data.message ?? "Permissions saved");
        }
      },
    },
  })),
);

export const usePermissions = <TResult>(
  selector: SelectorFn<PermissionType, TResult>,
) => {
  const state = usePermission(selector);

  return state;
};
