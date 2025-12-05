"use client";

import { Button, Card, CardContent, CardTitle } from "@/components";
import Image from "next/image";

const Page = () => {
  return (
    <section className="flex flex-col gap-8">
      <p className="text-4xl font-heebo">Riders</p>
      <div className="flex gap-8">
        <div className="flex gap-8">
          <div className="flex gap-2 flex-col">
            <p className="font-semibold text-xl">Pending Activation</p>
            <Card className="px-4 py-7 gap-1 ">
              <CardContent className="">
                <div className="flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/placeholder.jgp"
                      alt="image"
                      className="size-6 rounded-full object-cover"
                    />
                    <p className="text-sm font-medium">Mark Spencer</p>
                  </div>
                  <Button variant="link">Open</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Page;
