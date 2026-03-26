"use client";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Empty,
  EmptyHeader,
  EmptyTitle,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  RolesModal,
  RolesModalDisplay,
} from "@/components/";
import { cn } from "@/lib";
import { usePermission, useAdmin } from "@/store";
// import { AdminSearchIcon } from "@public/svgs";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";

const Page = () => {
  const [userORRoles, setUserOrRoles] = useState<"user" | "roles">("user");

  const {
    actions: {
      getAllActiveAdmins,
      getAllSuspendedAdmins,
      restoreAdmin,
      suspendAdmin,
    },
    allActiveAdmins,
    allSuspendedAdmins,
  } = useAdmin(
    useShallow((state) => ({
      actions: state.actions,
      allActiveAdmins: state.allActiveAdmins,
      allSuspendedAdmins: state.allSuspendedAdmins,
      isLoading: state.isLoading,
    })),
  );

  const allAdmins = useMemo(
    () => [...allActiveAdmins, ...allSuspendedAdmins],
    [allActiveAdmins, allSuspendedAdmins],
  );

  const {
    actions: {
      // getAllAdminPermissions,
      // getAllEndpoints,
      getAllRolePermissions,
      // getEndpointPermissions,
      getSingleAdminPermissions,
      getSingleRolePermissions,
      grantAdminPermission,
      grantRolePermission,
      revokeAdminPermission,
      revokeRolePermission,
    },
    allRolePermissions,
  } = usePermission(
    useShallow((state) => ({
      actions: state.actions,
      allRolePermissions: state.allRolePermissions,
      singleAdminPermission: state.singleAdminPermission,
      singleRolePermission: state.singleRolePermission,
    })),
  );

  useEffect(() => {
    getAllActiveAdmins();
    getAllSuspendedAdmins();
    getAllRolePermissions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className='flex flex-col gap-8'>
      <p className='text-2xl md:text-4xl font-heebo'>Roles and Permission</p>

      <div className='flex flex-col md:flex-row md:self-end gap-4 md:gap-7 md:items-center'>
        {/* <div className='flex gap-3 items-center px-3 py-2 rounded-full bg-white shadow-md md:min-w-[250px]'>
          <AdminSearchIcon />
          <input
            type='text'
            name='search'
            id='search'
            className='bg-transparent focus:outline-none flex-1'
            placeholder='Search'
          />
        </div> */}
        <div className='flex bg-white p-2 rounded-full'>
          <Button
            onClick={() => setUserOrRoles("user")}
            className={cn(
              "rounded-full transition-colors duration-300 shadow-none flex-1",
              userORRoles !== "user" &&
                "bg-transparent text-black hover:text-white",
            )}
          >
            Users
          </Button>
          <Button
            onClick={() => setUserOrRoles("roles")}
            className={cn(
              "rounded-full transition-colors duration-300 shadow-none flex-1",
              userORRoles !== "roles" &&
                "bg-transparent text-black hover:text-white",
            )}
          >
            Roles
          </Button>
        </div>
      </div>

      {userORRoles === "user" ? (
        <Card className='p-0 rounded-md'>
          <CardContent className='p-0 '>
            <Table>
              <TableHeader>
                <TableRow className='bg-[#E0E6E6] font-semibold text-base hover:bg-[#E0E6E6]'>
                  <TableHead className='text-[#768B8F]'>User</TableHead>
                  <TableHead className='text-[#768B8F]'>Role</TableHead>
                  <TableHead className='text-[#768B8F]'>Active</TableHead>
                  <TableHead className='text-[#768B8F]'>Action</TableHead>
                </TableRow>
              </TableHeader>

              {allAdmins.length === 0 ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} className='p-10'>
                      <Empty>
                        <EmptyHeader>
                          <EmptyTitle>No information found</EmptyTitle>
                        </EmptyHeader>
                      </Empty>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {allAdmins.map((admin, i) => {
                    return (
                      <TableRow key={i} className='last:border-b-0'>
                        <TableCell className='text-sm font-medium py-5'>
                          <div className='flex items-center gap-2'>
                            <div className='flex flex-col'>
                              <p className='font-medium text-xl'>
                                {admin.firstName} {admin.lastName}
                              </p>
                              <p className='text-sm font-light'>
                                {admin.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className='text-sm'>
                          <p className='bg-[#E0E6E6] px-3 py-1 rounded-full w-fit capitalize'>
                            {admin.role.toLowerCase().split("_").join(" ")}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={admin.status === "active"}
                            onCheckedChange={async (checked) => {
                              if (checked) {
                                await restoreAdmin({ adminId: admin.adminId });
                              } else {
                                await suspendAdmin({
                                  adminId: admin.adminId,
                                  reason:
                                    "Suspended from roles and permission page",
                                });
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <RolesModal
                            trigger={
                              <Button
                                onClick={async () =>
                                  await getSingleAdminPermissions(admin.adminId)
                                }
                                className='rounded-full'
                              >
                                Edit Role
                              </Button>
                            }
                            onNext={async (CHECKED_IDS, UNCHECKED_IDS) => {
                              await grantAdminPermission({
                                adminId: admin.adminId,
                                endpointIds: CHECKED_IDS,
                                expiresAt: new Date(
                                  Date.now() + 30 * 24 * 60 * 60 * 1000,
                                ).toISOString(),
                              });
                              await revokeAdminPermission({
                                adminId: admin.adminId,
                                endpointIds: UNCHECKED_IDS,
                              });
                            }}
                            role={admin.role.split("_").join(" ")}
                            title={`Edit Roles for ${admin.firstName} ${admin.lastName}`}
                            description="Select the Roles and permission you'd like this user to have."
                            type={"role"}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              )}
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className='flex border-b font-medium text-2xl pb-4'>
              <p>Roles</p>
            </div>
          </CardHeader>
          <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-6 pb-6'>
            {Object.keys(allRolePermissions ?? {}).map((role) => {
              return (
                <div
                  key={role}
                  className='flex flex-col md:flex-row bg-[#F4F4F4] justify-between md:items-center gap-5 rounded-2xl p-6'
                >
                  <div className='flex flex-col gap-1'>
                    <p className='text-xl font-bold capitalize'>
                      {role.split("_").join(" ")}
                    </p>
                    <div>
                      {(allRolePermissions ?? {})[role].endpoints
                        .slice(0, 3)
                        .map((endpoint, id) => (
                          <p key={id} className='text-sm font-light'>
                            {endpoint.description}
                          </p>
                        ))}
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <RolesModal
                      trigger={
                        <Button
                          onClick={async () =>
                            await getSingleRolePermissions(
                              role.toUpperCase().split(" ").join("_"),
                            )
                          }
                          className='bg-[#B3BFBF] hover:bg-[#B3BFBF]/90 rounded-full'
                        >
                          Edit permission
                        </Button>
                      }
                      onNext={async (CHECKED_IDS, UNCHECKED_IDS) => {
                        await grantRolePermission({
                          role: role.toUpperCase().split(" ").join("_"),
                          endpointIds: CHECKED_IDS,
                        });
                        await revokeRolePermission({
                          role: role.toUpperCase().split(" ").join("_"),
                          endpointIds: UNCHECKED_IDS,
                        });
                      }}
                      role={role.split("_").join(" ")}
                      title='Assign Permission to Role'
                      description="Assign permission you'd like this role to have."
                      type={"permission"}
                    />
                    <RolesModalDisplay
                      trigger={
                        <Button
                          onClick={async () =>
                            await getSingleRolePermissions(
                              role.toUpperCase().split(" ").join("_"),
                            )
                          }
                          className='bg-[#B3BFBF] hover:bg-[#B3BFBF]/90 rounded-full'
                        >
                          View all
                        </Button>
                      }
                      role={role.split("_").join(" ")}
                      title='Granted Permissions'
                      description={`Permissions for the ${role.split("_").join(" ")} role.`}
                      type={"permission"}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </section>
  );
};
export default Page;
