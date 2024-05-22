"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button, Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import Header from "../header";
import API from "@/utils/api";
import { CForm } from "../form/baseForm";
import { PFormInput } from "@/partials";
import Loader from "../admin/components/loader";

type Step = {
  id: number;
  diplomaId: number;
  status: string;
  stepNumber: number;
  file: string;
};

type User = {
  id: number;
  role: string;
  steps: Step[];
};

type FormJsonElement = {
  label: string;
  name: string;
  type: string;
  inputtype: string;
  required: boolean;
};

const formJson: FormJsonElement[] = [
  {
    label: "name",
    name: "name",
    type: "string",
    inputtype: "text",
    required: true
  },
  {
    label: "teacherId",
    name: "teacherId",
    type: "number",
    inputtype: "number",
    required: true
  },
  {
    label: "diploma",
    name: "diploma",
    type: "file",
    inputtype: "file",
    required: true
  }
];

const userData = async () => {
  try {
    const response = await API({
      url: `me`,
      method: "GET"
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

export default function Home() {
  const [user, setUser] = useState<Array<User> | []>([]);
  const usermutation = useMutation({ mutationFn: userData });

  useEffect(() => {
    usermutation.mutate();
  }, []);

  useEffect(() => {
    if (usermutation.data) {
      setUser(usermutation.data);
    }
  }, [usermutation.data]);

  const renderForm = (stepNumber: number) => (
    <CForm
      method="post"
      name="diplomaForm"
      validate_schema={formJson}
      url={"diploma/create"}>
      <input type="hidden" name="stepNumber" value={stepNumber + 1} />

      <input
        type="hidden"
        name="diplomaId"
        value={user?.length > 0 ? user[0]?.id : 1}
      />
      {formJson.map((element: any, index: number) => (
        <PFormInput key={index} {...element} />
      ))}
      <Button color="blue" type="submit">
        SUBMIT
      </Button>
    </CForm>
  );

  const renderStep = (stepNumber: number) => {
    const stepData = user[0]?.steps?.find(
      (step) => step.stepNumber === stepNumber
    );
    if (stepData) {
      return (
        <div>
          {formJson.map((element, index) => (
            <div key={index}>
              <strong>{element.label}:</strong>{" "}
              {stepData[element.name as keyof Step] ??
                (element.name === "diploma" && stepData.file ? (
                  <a href={stepData.file} download>
                    Download File
                  </a>
                ) : (
                  "N/A"
                ))}
            </div>
          ))}
          {stepData.status === "APPROVED" && (
            <p className="text-green-600">Approved</p>
          )}
        </div>
      );
    } else {
      return renderForm(stepNumber);
    }
  };

  const steps = [
    { title: "step 1", icon: HiUserCircle },
    { title: "step 2", icon: MdDashboard },
    { title: "step 3", icon: HiAdjustments },
    { title: "step 4", icon: HiClipboardList },
    { title: "step 5" }
  ];

  console.log(user);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-10 ">
      <Header />
      <Tabs aria-label="Tabs with icons" className="gap-10" style="underline">
        {user?.length > 0 ? (
          steps.map((step, index) => {
            const isDisabled =
              user[0]?.steps?.length < index &&
              user[0]?.steps?.[index - 1]?.status !== "APPROVED";
            return (
              <Tabs.Item
                key={index}
                title={step.title}
                icon={step.icon}
                disabled={isDisabled}>
                {renderStep(index + 1)}
              </Tabs.Item>
            );
          })
        ) : (
          <Loader />
        )}
      </Tabs>
    </main>
  );
}
