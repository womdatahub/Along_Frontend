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
} from "@/components/";
import { cn } from "@/lib";
import { usePermission, useAdmin } from "@/store";
import { AdminSearchIcon } from "@public/svgs";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

const Page = () => {
  const [userORRoles, setUserOrRoles] = useState<"user" | "roles">("user");

  const {
    actions: { getAllAdmins },
    allAdmins,
    isLoading,
  } = useAdmin(
    useShallow((state) => ({
      actions: state.actions,
      allAdmins: state.allAdmins,
      isLoading: state.isLoading,
    })),
  );

  const {
    actions: {
      // getAllAdminPermissions,
      // getAllEndpoints,
      getAllRolePermissions,
      // getEndpointPermissions,
      // getSingleAdminPermissions,
      // getSingleRolePermissions,
    },
    allRolePermissions,
  } = usePermission(
    useShallow((state) => ({
      actions: state.actions,
      allRolePermissions: state.allRolePermissions,
    })),
  );

  useEffect(() => {
    getAllAdmins();

    // getAllAdminPermissions();
    // getAllEndpoints();
    getAllRolePermissions();
    // getEndpointPermissions();
    // getSingleAdminPermissions("adminId");
    // getSingleRolePermissions("roleId");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className='flex flex-col gap-8'>
      <p className='text-2xl md:text-4xl font-heebo'>Roles and Permission</p>

      <div className='flex flex-col md:flex-row md:self-end gap-4 md:gap-7 md:items-center'>
        <div className='flex gap-3 items-center px-3 py-2 rounded-full bg-white shadow-md md:min-w-[250px]'>
          <AdminSearchIcon />
          <input
            type='text'
            name='search'
            id='search'
            className='bg-transparent focus:outline-none flex-1'
            placeholder='Search'
          />
        </div>
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
                            {/* <Image
                              src='/images/about-vision.png'
                              alt='Profile image'
                              className='rounded-full size-12 object-cover'
                              width={42}
                              height={42}
                            /> */}
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
                          <Switch checked={admin.status === "active"} />
                        </TableCell>
                        <TableCell>
                          <Button className='rounded-full'>Edit Role</Button>
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
                  <Button className='bg-[#B3BFBF] hover:bg-[#B3BFBF]/90 rounded-full'>
                    Edit permission
                  </Button>
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
