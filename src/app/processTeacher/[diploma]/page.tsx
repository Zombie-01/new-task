"use client";

import { useEffect, useState } from "react";
import API from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { Button, Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import Header from "@/app/header";
import { useParams } from "next/navigation";

const userData = async (diploma: number) => {
  try {
    const response = await API({
      url: `/diploma/` + diploma,
      method: "GET"
    });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

const approveStep = async ({ stepNumber, diplomaId }: any) => {
  try {
    const response = await API({
      url: `diploma/approve`,
      method: "POST",
      body: { stepNumber, diplomaId }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const usermutation = useMutation({ mutationFn: userData });
  const approvalMutation = useMutation({ mutationFn: approveStep });
  const params = useParams();
  useEffect(() => {
    params && usermutation.mutate(+params?.diploma);
  }, []);

  useEffect(() => {
    if (usermutation.data) {
      setUser(usermutation.data);
    }
  }, [usermutation.data]);

  const handleApprove = (stepNumber: number) => {
    params &&
      approvalMutation.mutate(
        { stepNumber, diplomaId: +params?.diploma },
        {
          onSuccess: () => {
            usermutation.mutate(+params?.diploma); // Refresh user data after approval
          }
        }
      );
  };

  const steps = [
    { title: "step 1", icon: HiUserCircle },
    { title: "step 2", icon: MdDashboard },
    { title: "step 3", icon: HiAdjustments },
    { title: "step 4", icon: HiClipboardList },
    { title: "step 5" }
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-10">
      <Header />
      <Tabs aria-label="Tabs with icons" className="gap-10" style="underline">
        {steps.map((step, index) => {
          const stepData = user?.diploma?.steps?.find(
            (s: any) => s.stepNumber === index + 1
          );
          const isDisabled =
            !stepData ||
            (index > 0 &&
              user?.diploma?.steps[index - 1]?.status !== "APPROVED");

          return (
            <Tabs.Item
              key={index}
              title={step.title}
              icon={step.icon}
              disabled={isDisabled}>
              <div className="flex flex-col items-center">
                {stepData ? (
                  <>
                    <a
                      href={stepData.file}
                      download
                      className="mb-4 text-blue-500 underline">
                      Download File
                    </a>
                    <Button
                      color="green"
                      onClick={() => handleApprove(index + 1)}
                      disabled={stepData.status === "APPROVED"}>
                      Approve
                    </Button>
                    {stepData.status === "APPROVED" && (
                      <span className="mt-2 text-green-600">Approved</span>
                    )}
                    {stepData.status === "REJECTED" && (
                      <span className="mt-2 text-red-600">Rejected</span>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">
                    No data available for this step.
                  </p>
                )}
              </div>
            </Tabs.Item>
          );
        })}
      </Tabs>
    </main>
  );
}
