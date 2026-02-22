"use client";

import {
  Button,
  Card,
  CardContent,
  Empty,
  EmptyHeader,
  EmptyTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components";

const isEmpty = true;
const Page = () => {
  return (
    <section className='flex flex-col gap-8'>
      <p className='text-4xl font-heebo'>Market Place</p>

      <Card className='border border-gray-300 flex flex-col gap-4 py-4'>
        <CardContent className='p-0 gap-4 flex flex-col'>
          <div className='flex justify-between gap-5 items-center px-6'>
            <p className='text-xl font-medium'>Fare Engine Profile</p>
            <div className='flex items-center gap-5'>
              <Button className='rounded-full'>Add New</Button>
              <Button variant={"ghost"} className='rounded-full'>
                Batch Delete
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className='bg-[#E0E6E6] font-semibold text-base hover:bg-[#E0E6E6]'>
                <TableHead className='text-[#768B8F] pl-6'>
                  Profile Name
                </TableHead>
                <TableHead className='text-[#768B8F]'>Timestamp</TableHead>
                <TableHead className='text-[#768B8F]'>Base Fare %</TableHead>
                <TableHead className='text-[#768B8F]'>
                  Surge Multiplier %
                </TableHead>
                <TableHead className='text-[#768B8F]'>
                  Driver to Rider Fee %
                </TableHead>
                <TableHead className='text-[#768B8F]'>Base Haggle %</TableHead>
                <TableHead className='text-[#768B8F]'>Max Haggle %</TableHead>
                <TableHead className='text-[#768B8F]'>Action</TableHead>
              </TableRow>
            </TableHeader>

            {isEmpty ? (
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
                {alertTables.map((alert, i) => {
                  return (
                    <TableRow key={i} className='last:border-b-0'>
                      <TableCell className=' text-sm font-medium pl-6'>
                        {alert.type}
                      </TableCell>
                      <TableCell className=' text-sm font-medium'>
                        {alert.timeStamp}
                      </TableCell>
                      <TableCell className=' text-sm font-medium'>
                        {alert.tripID}
                      </TableCell>
                      <TableCell className=' text-sm font-medium'>
                        {alert.initiator}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            )}
          </Table>
        </CardContent>
      </Card>
      <Card className='border border-gray-300 flex flex-col gap-4 py-4'>
        <CardContent className='p-0 gap-4 flex flex-col'>
          <div className='flex justify-between gap-5 items-center px-6 pb-3 border-b-[1px] border-b-gray-300'>
            <p className='text-xl font-medium'>Promotion and Vouchers</p>
          </div>
          <Table>
            {isEmpty ? (
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
                {alertTables.map((alert, i) => {
                  return (
                    <TableRow key={i} className='last:border-b-0'>
                      <TableCell className=' text-sm font-medium pl-6'>
                        {alert.type}
                      </TableCell>
                      <TableCell className=' text-sm font-medium'>
                        {alert.timeStamp}
                      </TableCell>
                      <TableCell className=' text-sm font-medium'>
                        {alert.tripID}
                      </TableCell>
                      <TableCell className=' text-sm font-medium'>
                        {alert.initiator}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            )}
          </Table>
        </CardContent>
      </Card>
      <Card className='border border-gray-300 flex flex-col gap-4 py-4'>
        <CardContent className='p-0 gap-4 flex flex-col'>
          <div className='flex justify-between gap-5 items-center px-6'>
            <p className='text-xl font-medium'>Active Promo</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className='bg-[#E0E6E6] font-semibold text-base hover:bg-[#E0E6E6]'>
                <TableHead className='text-[#768B8F] pl-6'>
                  Promo type
                </TableHead>
                <TableHead className='text-[#768B8F]'>Category</TableHead>
                <TableHead className='text-[#768B8F]'>Duration</TableHead>
                <TableHead className='text-[#768B8F]'>Promo unit</TableHead>
              </TableRow>
            </TableHeader>

            {isEmpty ? (
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
                {alertTables.map((alert, i) => {
                  return (
                    <TableRow key={i} className='last:border-b-0'>
                      <TableCell className=' text-sm font-medium pl-6'>
                        {alert.type}
                      </TableCell>
                      <TableCell className=' text-sm font-medium'>
                        {alert.timeStamp}
                      </TableCell>
                      <TableCell className=' text-sm font-medium'>
                        {alert.tripID}
                      </TableCell>
                      <TableCell className=' text-sm font-medium'>
                        {alert.initiator}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            )}
          </Table>
        </CardContent>
      </Card>
    </section>
  );
};
export default Page;

type Alert = {
  type: string;
  timeStamp: string;
  tripID: string;
  initiator: string;
};

const alertTables: Alert[] = [];
