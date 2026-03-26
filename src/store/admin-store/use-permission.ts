import { create } from "zustand";
import type {
  Endpoint,
  EndpointPermission,
  RolePermission,
  SelectorFn,
} from "@/types";
import { devtools } from "zustand/middleware";
import { adminApiStr, callApi } from "@/lib";
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
        const path = adminApiStr(
          `/permissions/users/permissions?adminId=${adminID}`,
        );
        const { data, error } = await callApi<{ rolePermissions: Endpoint[] }>(
          path,
        );
        if (error) {
          set({ isLoading: false });
          toast.error(error.message);
          return;
        }
        if (data) {
          console.log(path, data);
          set({
            isLoading: false,
            allAdminPermissions: data.data.rolePermissions,
          });
          toast.success(
            data.message ?? "All admin permissions fetched successfully",
          );
        }
      },
      getSingleAdminPermissions: async (adminID) => {
        set({ isFetching: true });
        const path = adminApiStr(
          `/permissions/users/direct-permissions?adminId=${adminID}`,
        );
        const { data, error } = await callApi<{ endpoints: Endpoint[] }>(path);
        if (error) {
          set({ isFetching: false });
          toast.error(error.message);
          return;
        }
        if (data) {
          console.log(path, data);
          set({
            isFetching: false,
            singleAdminPermission: data.data.endpoints,
          });
          toast.success(
            data.message ?? "Single permission fetched successfully",
          );
        }
      },
      getSingleRolePermissions: async (role) => {
        set({ isFetching: true });
        const path = adminApiStr(`/permissions/roles/permissions?role=${role}`);
        const { data, error } = await callApi<{ endpoints: Endpoint[] }>(path);
        if (error) {
          set({ isFetching: false });
          toast.error(error.message);
          return;
        }
        if (data) {
          console.log(path, data);
          set({
            isFetching: false,
            singleRolePermission: data.data.endpoints,
          });
          toast.success(data.message ?? "Role permission fetched successfully");
        }
        set({ isFetching: false });
      },
      getAllRolePermissions: async () => {
        set({ isLoading: true });
        const path = adminApiStr("/permissions/roles");
        const { data, error } = await callApi<RolePermission>(path);
        if (error) {
          set({ isLoading: false });
          toast.error(error.message);
          return;
        }
        if (data) {
          console.log(path, data);
          set({ isLoading: false, allRolePermissions: data.data });
          toast.success(
            data.message ?? "All role permissions fetched successfully",
          );
        }
      },
      getAllEndpoints: async () => {
        set({ isLoading: true });
        const path = adminApiStr("/permissions/endpoints");
        const { data, error } = await callApi<Endpoint[]>(path);
        if (error) {
          set({ isLoading: false });
          toast.error(error.message);
          return;
        }
        if (data) {
          console.log(path, data);
          set({ isLoading: false, allEndpoints: data.data });
          toast.success(data.message ?? "All endpoints fetched successfully");
        }
      },
      getEndpointPermissions: async (endpointId) => {
        set({ isLoading: true });
        const path = adminApiStr(
          `permissions/endpoints/permissions?endpointId=${endpointId}`,
        );
        const { data, error } = await callApi<EndpointPermission>(path);
        if (error) {
          set({ isLoading: false });
          toast.error(error.message);
          return;
        }
        if (data) {
          console.log(path, data);
          set({ isLoading: false, allEndpointsPermissions: data.data });
          toast.success(
            data.message ?? "All endpoint permissions fetched successfully",
          );
        }
      },
      grantRolePermission: async (rolePermissionData) => {
        set({ isLoading: true });
        const path = adminApiStr("/permissions/roles/grant");
        const { data, error } = await callApi(path, rolePermissionData);
        if (error) {
          set({ isLoading: false });
          toast.error(error.message);
          return;
        }
        if (data) {
          console.log(path, data);
          set({ isLoading: false });
          toast.success(data.message ?? "Role granted");
        }
      },
      revokeRolePermission: async (revokePermissionData) => {
        if (revokePermissionData.endpointIds.length === 0) return;
        set({ isLoading: true });
        const path = adminApiStr("/permissions/roles/revoke");
        const { data, error } = await callApi(path, revokePermissionData);
        if (error) {
          set({ isLoading: false });
          toast.error(error.message);
          return;
        }
        if (data) {
          console.log(path, data);
          set({ isLoading: false });
          toast.success(data.message ?? "Role revoked");
        }
      },
      grantAdminPermission: async (adminPermissionData) => {
        set({ isLoading: true });
        const path = adminApiStr("/permissions/users/grant");
        const { data, error } = await callApi(path, adminPermissionData);
        if (error) {
          set({ isLoading: false });
          toast.error(error.message);
          return;
        }
        if (data) {
          console.log(path, data);
          set({ isLoading: false });
          toast.success(data.message ?? "Role granted");
        }
      },
      revokeAdminPermission: async (revokeAdminPermissionData) => {
        if (revokeAdminPermissionData.endpointIds.length === 0) return;
        set({ isLoading: true });
        const path = adminApiStr("/permissions/users/revoke");
        const { data, error } = await callApi(path, revokeAdminPermissionData);
        if (error) {
          set({ isLoading: false });
          toast.error(error.message);
          return;
        }
        if (data) {
          console.log(path, data);
          set({ isLoading: false });
          toast.success(data.message ?? "Role revoked");
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
