"use client";

import { useEffect, useState } from "react";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  AddNewAdminModal,
  EditRolesPermissionModal,
  ConfirmActionModal,
  ResetPasswordModal,
} from "@/components/";
import { AdminSearchIcon } from "@public/svgs";
import {
  UserPlus,
  RefreshCw,
  Shield,
  KeyRound,
  Trash2,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib";
import { useAdmin } from "@/store";
import { useShallow } from "zustand/shallow";

const Page = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const hasSelection = selectedId !== null;

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

  useEffect(() => {
    getAllAdmins();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className='flex flex-col gap-8'>
      <p className='text-2xl md:text-4xl font-heebo'>Admins</p>

      <div
        className={cn(
          "rounded-xl md:rounded-3xl border flex flex-col gap-4 py-4 bg-white transition-all duration-200",
          hasSelection
            ? "border-[#4A9CA0] border-2 shadow-[0_0_0_1px_#4A9CA0]"
            : "border-gray-300",
        )}
      >
        <div className='flex flex-col md:flex-row justify-between gap-5 md:items-center px-2 md:px-6'>
          <p className='text-xl text-left font-medium'>Active Admins</p>
          <div className='flex items-center gap-5'>
            <div className='flex gap-3 items-center px-3 py-2 rounded-full bg-[#EAEAEA] w-full md:min-w-[325px]'>
              <AdminSearchIcon />
              <input
                type='text'
                name='search'
                id='search'
                className='bg-transparent focus:outline-none'
                placeholder='Search'
              />
            </div>
          </div>
        </div>

        <div className='flex items-center justify-between px-2 md:px-6 flex-wrap gap-3'>
          <div className='flex items-center gap-1 flex-wrap font-medium'>
            <AddNewAdminModal
              trigger={
                <button className='flex cursor-pointer items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors'>
                  <UserPlus size={14} />
                  Create new admin
                </button>
              }
            />

            <button
              onClick={getAllAdmins}
              disabled={isLoading}
              className='flex cursor-pointer items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:text-gray-300 disabled:cursor-not-allowed"'
            >
              <RefreshCw size={14} />
              Refresh
            </button>

            <EditRolesPermissionModal
              trigger={
                <button
                  disabled={!hasSelection}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                    hasSelection
                      ? "text-gray-700 hover:bg-gray-100 cursor-pointer"
                      : "text-gray-300 cursor-not-allowed",
                  )}
                >
                  <Shield size={14} />
                  Manage Roles
                </button>
              }
            />

            <ResetPasswordModal
              trigger={
                <button
                  disabled={!hasSelection}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                    hasSelection
                      ? "text-gray-700 hover:bg-gray-100 cursor-pointer"
                      : "text-gray-300 cursor-not-allowed",
                  )}
                >
                  <KeyRound size={14} />
                  Reset Password
                </button>
              }
            />

            <ConfirmActionModal
              trigger={
                <button
                  disabled={!hasSelection}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                    hasSelection
                      ? "text-red-500 hover:bg-red-50 cursor-pointer"
                      : "text-gray-300 cursor-not-allowed",
                  )}
                >
                  <Trash2 size={14} />
                  Delete User
                </button>
              }
              confirmActionFunction={() => {}}
              description='Are you sure you want to delete this user?'
              title='Delete User'
              type='delete'
            />
          </div>

          <button className='flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors'>
            <SlidersHorizontal size={14} />
            Filter by:
            <ChevronRight size={13} className='text-gray-400' />
          </button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className='bg-[#E0E6E6] font-semibold text-base hover:bg-[#E0E6E6]'>
              <TableHead className='w-10' />
              <TableHead className='text-[#768B8F]'>Display Name</TableHead>
              <TableHead className='text-[#768B8F]'>User name</TableHead>
              <TableHead className='text-[#768B8F]'>Roles</TableHead>
            </TableRow>
          </TableHeader>

          {allAdmins.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={8} className='p-10'>
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
                const isSelected = selectedId === i;
                return (
                  <TableRow
                    key={i}
                    onClick={() => setSelectedId(isSelected ? null : i)}
                    className={cn(
                      "last:border-b-0 cursor-pointer transition-colors",
                      isSelected ? "bg-[#EAF4F4]" : "hover:bg-gray-50",
                    )}
                  >
                    <TableCell className='w-10'>
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className='flex items-center justify-center'
                      >
                        <input
                          type='checkbox'
                          checked={isSelected}
                          onChange={() => setSelectedId(isSelected ? null : i)}
                          className='w-4 h-4 accent-[#4A9CA0] cursor-pointer'
                        />
                      </div>
                    </TableCell>

                    <TableCell className='text-sm font-medium py-5'>
                      <p>
                        {admin.firstName} {admin.lastName}
                      </p>
                    </TableCell>
                    <TableCell className='text-sm font-medium'>
                      {admin.email}
                    </TableCell>
                    <TableCell className='text-sm font-medium'>
                      {admin.role.split("_").join(" ")}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </div>
    </section>
  );
};

export default Page;
