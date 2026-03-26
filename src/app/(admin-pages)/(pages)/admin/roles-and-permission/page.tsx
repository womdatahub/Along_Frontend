"use client";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Empty,
  EmptyHeader,
  EmptyTitle,
  SelectDropdown,
  Separator,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Dialog,
  DialogTrigger,
  DialogContent,
  ButtonWithLoader,
} from "@/components/";
import { cn } from "@/lib";
import { usePermission, useAdmin } from "@/store";
import { Endpoint, RolePermission } from "@/types";
import { AdminSearchIcon } from "@public/svgs";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

const Page = () => {
  const [userORRoles, setUserOrRoles] = useState<"user" | "roles">("user");

  const {
    actions: { getAllAdmins },
    allAdmins,
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
      getSingleAdminPermissions,
      getSingleRolePermissions,
      grantAdminPermission,
      grantRolePermission,
      revokeAdminPermission,
      revokeRolePermission,
    },
    allRolePermissions,
    singleAdminPermission,
    singleRolePermission,
  } = usePermission(
    useShallow((state) => ({
      actions: state.actions,
      allRolePermissions: state.allRolePermissions,
      singleAdminPermission: state.singleAdminPermission,
      singleRolePermission: state.singleRolePermission,
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

  console.log(singleRolePermission, "single role permission from page");

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
                              await getSingleAdminPermissions(admin.adminId);
                            }}
                            role={admin.role.split("_").join(" ")}
                            title={`Edit Roles for ${admin.firstName} ${admin.lastName}`}
                            description="Select the Roles and permission you'd like this user to have."
                            currentPermissions={singleAdminPermission}
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
                      await getSingleRolePermissions(
                        role.toUpperCase().split(" ").join("_"),
                      );
                    }}
                    role={role.split("_").join(" ")}
                    title='Assign Roles and Permission'
                    description="Assign the Roles and permission you'd like this user to have."
                    currentPermissions={[]}
                  />
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

const tealCheckbox =
  "h-[15px] w-[15px] cursor-pointer rounded-sm border-gray-300 data-[state=checked]:bg-[#0f766e] data-[state=checked]:border-[#0f766e]";
// const RolesModal = ({
//   onNext,
//   role,
//   title,
//   description,
//   trigger,
// }: {
//   onNext: (checked: string[], unchecked: string[]) => Promise<void>;
//   role: string;
//   title: string;
//   description: string;
//   trigger: React.ReactNode;
// }) => {
//   const [selectedRole] = useState(role);
//   const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
//     {},
//   );
//   const [checkedPermissions, setCheckedPermissions] = useState<
//     Record<string, boolean>
//   >({});

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const { allRolePermissions } = usePermission(
//     useShallow((state) => ({
//       allRolePermissions: state.allRolePermissions,
//     })),
//   );

//   const selectedRoleKey = selectedRole.toUpperCase().split(" ").join("_");

//   const selectedRoleEndpoints =
//     allRolePermissions?.[selectedRoleKey]?.endpoints ?? [];

//   const selectedRoleIds = new Set(selectedRoleEndpoints.map((ep) => ep.id));

//   const additionalMap = new Map<
//     string,
//     RolePermission[string]["endpoints"][number]
//   >();
//   Object.entries(allRolePermissions ?? {}).forEach(([role, data]) => {
//     if (role === selectedRoleKey) return;
//     data.endpoints.forEach((ep) => {
//       if (!selectedRoleIds.has(ep.id) && !additionalMap.has(ep.id)) {
//         additionalMap.set(ep.id, ep);
//       }
//     });
//   });

//   const additionalEndpoints = Array.from(additionalMap.values());

//   const groupEndpoints = (endpoints: typeof additionalEndpoints) =>
//     endpoints.reduce<Record<string, typeof additionalEndpoints>>((acc, ep) => {
//       if (!acc[ep.category]) acc[ep.category] = [];
//       acc[ep.category].push(ep);
//       return acc;
//     }, {});

//   const selectedGrouped = groupEndpoints(selectedRoleEndpoints);
//   const additionalGrouped = groupEndpoints(additionalEndpoints);

//   // Checked and unchecked IDs
//   const CHECKED_IDS = Object.entries(checkedPermissions)
//     .filter(([, checked]) => checked)
//     .map(([id]) => id);

//   const UNCHECKED_IDS = Object.entries(checkedPermissions)
//     .filter(([, checked]) => !checked)
//     .map(([id]) => id);

//   useEffect(() => {
//     const initial: Record<string, boolean> = {};
//     selectedRoleEndpoints.forEach((ep) => {
//       initial[ep.id] = true;
//     });
//     additionalEndpoints.forEach((ep) => {
//       initial[ep.id] = false;
//     });
//     setCheckedPermissions(initial);
//     setOpenCategories({});
//   }, [selectedRoleKey]);

//   const toggleCategory = (cat: string, section: "role" | "additional") =>
//     setOpenCategories((prev) => ({
//       ...prev,
//       [`${section}_${cat}`]: !prev[`${section}_${cat}`],
//     }));

//   const togglePermission = (id: string) =>
//     setCheckedPermissions((prev) => ({ ...prev, [id]: !prev[id] }));

//   const formatCategory = (cat: string) =>
//     cat
//       .split("_")
//       .map((w) => w[0] + w.slice(1).toLowerCase())
//       .join(" ");

//   const renderGroup = (
//     grouped: Record<string, typeof additionalEndpoints>,
//     section: "role" | "additional",
//   ) =>
//     Object.entries(grouped).map(([category, endpoints]) => {
//       const key = `${section}_${category}`;
//       const isOpen = openCategories[key] ?? false;
//       return (
//         <div key={key} className='border-t border-gray-200'>
//           <button
//             type='button'
//             onClick={() => toggleCategory(category, section)}
//             className='flex items-center justify-between w-full py-3 text-left'
//           >
//             <span className='text-sm md:text-base font-medium text-gray-700'>
//               {formatCategory(category)}
//             </span>
//             {isOpen ? (
//               <ChevronUp size={15} className='text-gray-400' />
//             ) : (
//               <ChevronDown size={15} className='text-gray-400' />
//             )}
//           </button>

//           {isOpen && (
//             <div className='flex flex-col gap-3 pb-4 pl-0.5'>
//               {endpoints.map((ep) => (
//                 <div key={ep.id} className='flex items-center gap-2.5'>
//                   <Checkbox
//                     checked={checkedPermissions[ep.id] ?? false}
//                     onCheckedChange={() => togglePermission(ep.id)}
//                     className={tealCheckbox}
//                   />
//                   <label
//                     className='text-sm md:text-base text-gray-600 cursor-pointer'
//                     onClick={() => togglePermission(ep.id)}
//                   >
//                     {ep.description}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       );
//     });

//   return (
//     <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//       <DialogTrigger asChild>{trigger}</DialogTrigger>

//       <DialogContent className='max-w-sm md:max-w-[840px] max-h-[80vh] p-0 overflow-y-auto overflow-x-hidden rounded-2xl gap-0 [&>button]:hidden'>
//         <div className='flex-1 px-8 pt-8 pb-6 flex flex-col overflow-hidden'>
//           <h2 className='text-[22px] font-bold text-gray-900 leading-tight mb-1'>
//             {title}
//           </h2>
//           <p className='text-[13px] text-gray-500 mb-6'>{description}</p>

//           <div className='mb-1'>
//             <p className='text-xl font-bold'>Role: {role}</p>
//           </div>

//           <Separator className='my-5' />

//           <div className='flex-1 overflow-y-auto border-r border-gray-200 pr-3 -mr-3'>
//             <p className='text-base md:text-lg font-semibold text-gray-800 mb-3'>
//               Role permissions
//             </p>
//             {renderGroup(selectedGrouped, "role")}

//             <p className='text-base md:text-lg font-semibold text-gray-800 mt-6 mb-3'>
//               Additional permissions
//             </p>
//             {renderGroup(additionalGrouped, "additional")}

//             {Object.keys(additionalGrouped).length === 0 && (
//               <p className='text-[13px] text-gray-400 py-4'>
//                 No additional permissions available for this role.
//               </p>
//             )}
//           </div>
//         </div>

//         <Separator />
//         <div className='flex items-center justify-between px-8 py-4'>

//           <ButtonWithLoader
//             text='Save'
//             isLoading={false}
//             className='rounded-full'
//             onClick={() =>
//               onNext(CHECKED_IDS, UNCHECKED_IDS).finally(() =>
//                 setIsModalOpen(false),
//               )
//             }
//           />
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

const RolesModal = ({
  onNext,
  role,
  title,
  description,
  trigger,
  currentPermissions,
}: {
  onNext: (checked: string[], unchecked: string[]) => Promise<void>;
  role: string;
  title: string;
  description: string;
  trigger: React.ReactNode;
  currentPermissions: Endpoint[];
}) => {
  const [selectedRole] = useState(role);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {},
  );
  const [checkedPermissions, setCheckedPermissions] = useState<
    Record<string, boolean>
  >({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { allRolePermissions } = usePermission(
    useShallow((state) => ({
      allRolePermissions: state.allRolePermissions,
      isLoading: state.isLoading,
      isFetching: state.isFetching,
    })),
  );

  const currentPermissionsMap = new Map(
    currentPermissions.map((ep) => [ep.id, ep.isActive]),
  );

  const selectedRoleKey = selectedRole.toUpperCase().split(" ").join("_");

  const selectedRoleEndpoints =
    allRolePermissions?.[selectedRoleKey]?.endpoints ?? [];

  const selectedRoleIds = new Set(selectedRoleEndpoints.map((ep) => ep.id));

  const additionalMap = new Map<
    string,
    RolePermission[string]["endpoints"][number]
  >();
  Object.entries(allRolePermissions ?? {}).forEach(([role, data]) => {
    if (role === selectedRoleKey) return;
    data.endpoints.forEach((ep) => {
      if (!selectedRoleIds.has(ep.id) && !additionalMap.has(ep.id)) {
        additionalMap.set(ep.id, ep);
      }
    });
  });

  const additionalEndpoints = Array.from(additionalMap.values());

  const groupEndpoints = (endpoints: typeof additionalEndpoints) =>
    endpoints.reduce<Record<string, typeof additionalEndpoints>>((acc, ep) => {
      if (!acc[ep.category]) acc[ep.category] = [];
      acc[ep.category].push(ep);
      return acc;
    }, {});

  const selectedGrouped = groupEndpoints(selectedRoleEndpoints);
  const additionalGrouped = groupEndpoints(additionalEndpoints);

  const CHECKED_IDS = Object.entries(checkedPermissions)
    .filter(([, checked]) => checked)
    .map(([id]) => id);

  const UNCHECKED_IDS = Object.entries(checkedPermissions)
    .filter(([, checked]) => !checked)
    .map(([id]) => id);

  useEffect(() => {
    const initial: Record<string, boolean> = {};

    selectedRoleEndpoints.forEach((ep) => {
      initial[ep.id] = currentPermissionsMap.has(ep.id)
        ? (currentPermissionsMap.get(ep.id) ?? true)
        : true;
    });

    additionalEndpoints.forEach((ep) => {
      initial[ep.id] = currentPermissionsMap.has(ep.id)
        ? (currentPermissionsMap.get(ep.id) ?? false)
        : false;
    });

    setCheckedPermissions(initial);
    setOpenCategories({});
  }, [selectedRoleKey]);

  const toggleCategory = (cat: string, section: "role" | "additional") =>
    setOpenCategories((prev) => ({
      ...prev,
      [`${section}_${cat}`]: !prev[`${section}_${cat}`],
    }));

  const togglePermission = (id: string) =>
    setCheckedPermissions((prev) => ({ ...prev, [id]: !prev[id] }));

  const formatCategory = (cat: string) =>
    cat
      .split("_")
      .map((w) => w[0] + w.slice(1).toLowerCase())
      .join(" ");

  const renderGroup = (
    grouped: Record<string, typeof additionalEndpoints>,
    section: "role" | "additional",
  ) =>
    Object.entries(grouped).map(([category, endpoints]) => {
      const key = `${section}_${category}`;
      const isOpen = openCategories[key] ?? false;
      return (
        <div key={key} className='border-t border-gray-200'>
          <button
            type='button'
            onClick={() => toggleCategory(category, section)}
            className='flex items-center justify-between w-full py-3 text-left'
          >
            <span className='text-sm md:text-base font-medium text-gray-700'>
              {formatCategory(category)}
            </span>
            {isOpen ? (
              <ChevronUp size={15} className='text-gray-400' />
            ) : (
              <ChevronDown size={15} className='text-gray-400' />
            )}
          </button>

          {isOpen && (
            <div className='flex flex-col gap-3 pb-4 pl-0.5'>
              {endpoints.map((ep) => (
                <div key={ep.id} className='flex items-center gap-2.5'>
                  <Checkbox
                    checked={checkedPermissions[ep.id] ?? false}
                    onCheckedChange={() => togglePermission(ep.id)}
                    className={tealCheckbox}
                  />
                  <label
                    className='text-sm md:text-base text-gray-600 cursor-pointer'
                    onClick={() => togglePermission(ep.id)}
                  >
                    {ep.description}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    });

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className='max-w-sm md:max-w-[840px] max-h-[80vh] p-0 overflow-y-auto overflow-x-hidden rounded-2xl gap-0 [&>button]:hidden'>
        <div className='flex-1 px-8 pt-8 pb-6 flex flex-col overflow-hidden'>
          <h2 className='text-[22px] font-bold text-gray-900 leading-tight mb-1'>
            {title}
          </h2>
          <p className='text-[13px] text-gray-500 mb-6'>{description}</p>

          <div className='mb-1'>
            <p className='text-xl font-bold'>Role: {role}</p>
          </div>

          <Separator className='my-5' />

          <div className='flex-1 overflow-y-auto border-r border-gray-200 pr-3 -mr-3'>
            <p className='text-base md:text-lg font-semibold text-gray-800 mb-3'>
              Role permissions
            </p>
            {renderGroup(selectedGrouped, "role")}

            <p className='text-base md:text-lg font-semibold text-gray-800 mt-6 mb-3'>
              Additional permissions
            </p>
            {renderGroup(additionalGrouped, "additional")}

            {Object.keys(additionalGrouped).length === 0 && (
              <p className='text-[13px] text-gray-400 py-4'>
                No additional permissions available for this role.
              </p>
            )}
          </div>
        </div>

        <Separator />
        <div className='flex items-center justify-between px-8 py-4'>
          <ButtonWithLoader
            text='Save'
            isLoading={false}
            className='rounded-full'
            onClick={() =>
              onNext(CHECKED_IDS, UNCHECKED_IDS).finally(() =>
                setIsModalOpen(false),
              )
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
