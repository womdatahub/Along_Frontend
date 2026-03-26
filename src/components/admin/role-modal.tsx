"use client";
import {
  Checkbox,
  Separator,
  Dialog,
  DialogTrigger,
  DialogContent,
  ButtonWithLoader,
  LoadingSpinner,
} from "@/components/";
import { usePermission } from "@/store";
import { RolePermission } from "@/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";

const tealCheckbox =
  "h-[15px] w-[15px] cursor-pointer rounded-sm border-gray-300 data-[state=checked]:bg-[#0f766e] data-[state=checked]:border-[#0f766e]";

export const RolesModal = ({
  onNext,
  role,
  title,
  description,
  trigger,
  type,
}: {
  onNext: (checked: string[], unchecked: string[]) => Promise<void>;
  role: string;
  title: string;
  description: string;
  trigger: React.ReactNode;
  type: "role" | "permission";
}) => {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {},
  );
  const [checkedPermissions, setCheckedPermissions] = useState<
    Record<string, boolean>
  >({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    allRolePermissions,
    isLoading,
    isFetching,
    singleAdminPermission,
    singleRolePermission,
  } = usePermission(
    useShallow((state) => ({
      allRolePermissions: state.allRolePermissions,
      isLoading: state.isLoading,
      isFetching: state.isFetching,
      singleRolePermission: state.singleRolePermission,
      singleAdminPermission: state.singleAdminPermission,
    })),
  );

  const currentPermissions = useMemo(() => {
    if (type === "permission") {
      return singleRolePermission;
    } else {
      return singleAdminPermission ?? [];
    }
  }, [singleRolePermission, singleAdminPermission, type]);

  const currentPermissionIds = new Set(
    (currentPermissions ?? []).map((ep) => ep.id),
  );

  const additionalMap = new Map<
    string,
    RolePermission[string]["endpoints"][number]
  >();
  Object.entries(allRolePermissions ?? {}).forEach(([, data]) => {
    data.endpoints.forEach((ep) => {
      if (!currentPermissionIds.has(ep.id) && !additionalMap.has(ep.id)) {
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

  const selectedGrouped = groupEndpoints(currentPermissions);
  const additionalGrouped = groupEndpoints(additionalEndpoints);

  const CHECKED_IDS = Object.entries(checkedPermissions)
    .filter(([, checked]) => checked)
    .map(([id]) => id);

  const UNCHECKED_IDS = Object.entries(checkedPermissions)
    .filter(([, checked]) => !checked)
    .map(([id]) => id);

  // Re-run whenever currentPermissions actually loads in from the store
  useEffect(() => {
    if (currentPermissions.length === 0) return;

    const initial: Record<string, boolean> = {};

    currentPermissions.forEach((ep) => {
      initial[ep.id] = ep.isActive;
    });

    additionalEndpoints.forEach((ep) => {
      initial[ep.id] = false;
    });

    setCheckedPermissions(initial);
    setOpenCategories({});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPermissions]);

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
  console.log(isFetching, "is fetching");
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      {isFetching ? (
        <DialogContent className='max-w-sm md:max-w-[840px] min-h-[50vh] p-0 overflow-y-auto overflow-x-hidden rounded-2xl gap-0 [&>button]:hidden flex justify-center items-center'>
          <LoadingSpinner />
        </DialogContent>
      ) : (
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
              shouldChildrenShowWhenSpinning
              isLoading={isLoading}
              className='rounded-full'
              onClick={() =>
                onNext(CHECKED_IDS, UNCHECKED_IDS).finally(() =>
                  setIsModalOpen(false),
                )
              }
            />
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export const RolesModalDisplay = ({
  role,
  title,
  description,
  trigger,
  type,
}: {
  role: string;
  title: string;
  description: string;
  trigger: React.ReactNode;
  type: "role" | "permission";
}) => {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {},
  );
  const {
    allRolePermissions,
    isFetching,
    singleAdminPermission,
    singleRolePermission,
  } = usePermission(
    useShallow((state) => ({
      allRolePermissions: state.allRolePermissions,
      isLoading: state.isLoading,
      isFetching: state.isFetching,
      singleRolePermission: state.singleRolePermission,
      singleAdminPermission: state.singleAdminPermission,
    })),
  );

  const currentPermissions = useMemo(() => {
    if (type === "permission") {
      return singleRolePermission;
    } else {
      return singleAdminPermission ?? [];
    }
  }, [singleRolePermission, singleAdminPermission, type]);

  const currentPermissionIds = new Set(
    (currentPermissions ?? []).map((ep) => ep.id),
  );

  const additionalMap = new Map<
    string,
    RolePermission[string]["endpoints"][number]
  >();
  Object.entries(allRolePermissions ?? {}).forEach(([, data]) => {
    data.endpoints.forEach((ep) => {
      if (!currentPermissionIds.has(ep.id) && !additionalMap.has(ep.id)) {
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

  const selectedGrouped = groupEndpoints(currentPermissions);

  useEffect(() => {
    if (currentPermissions.length === 0) return;

    const initial: Record<string, boolean> = {};

    currentPermissions.forEach((ep) => {
      initial[ep.id] = ep.isActive;
    });

    additionalEndpoints.forEach((ep) => {
      initial[ep.id] = false;
    });

    setOpenCategories({});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPermissions]);

  const toggleCategory = (cat: string, section: "role" | "additional") =>
    setOpenCategories((prev) => ({
      ...prev,
      [`${section}_${cat}`]: !prev[`${section}_${cat}`],
    }));

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
                  <label className='text-sm md:text-base text-gray-600 cursor-pointer'>
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
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      {isFetching ? (
        <DialogContent className='max-w-sm md:max-w-[840px] min-h-[50vh] p-0 overflow-y-auto overflow-x-hidden rounded-2xl gap-0 [&>button]:hidden flex justify-center items-center'>
          <LoadingSpinner />
        </DialogContent>
      ) : (
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
                Granted permissions
              </p>
              {renderGroup(selectedGrouped, "role")}
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};
