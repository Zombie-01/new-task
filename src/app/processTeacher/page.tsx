"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Checkbox, Label, Pagination, Table } from "flowbite-react";
import Actions from "@/partials/actions/actions";
import API from "@/utils/api";
import EmptyState from "../admin/components/emptyState";
import TableLoader from "../admin/components/loader/tableLoader";
import { useMutation } from "@tanstack/react-query";
import Header from "../header";
import { useRouter } from "next/navigation";

const CTable = <T extends unknown>({
  datas,
  heads,
  isLoading
}: any): JSX.Element => {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow"></div>
            <Table className="w-full rounded-xl border-collapse overflow-hidden shadow-[0 0 20px rgba(0,0,0,0.5)] ">
              <Table.Head className="bg-[rgba(0,0,0,0.2)]">
                <Table.HeadCell>
                  <Label htmlFor="select-all" className="sr-only">
                    Select all
                  </Label>
                  <Checkbox id="select-all" name="select-all" />
                </Table.HeadCell>
                {heads?.map((head: any, index: number) => (
                  <Table.HeadCell
                    className="p-4 bg-[rgba(255,255,255,0.2)] text-left "
                    key={index}
                    colSpan={head.colspan}>
                    {head.label}
                  </Table.HeadCell>
                ))}
              </Table.Head>
              <Table.Body>
                {isLoading ? (
                  <TableLoader />
                ) : datas?.length > 0 ? (
                  datas?.map((data: any, index: number) => (
                    <Table.Row
                      className=" hover:bg-[rgba(255,255,255,0.3)] tr-pseudo"
                      key={index}
                      onClick={() =>
                        router.push("/processTeacher/" + data?.id)
                      }>
                      <Table.Cell className="w-4 p-4">
                        <div className="flex items-center">
                          <input
                            id={`checkbox-${index}`}
                            aria-describedby="checkbox-1"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 bg-gray-50 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                          />
                          <label
                            htmlFor={`checkbox-${index}`}
                            className="sr-only">
                            checkbox
                          </label>
                        </div>
                      </Table.Cell>
                      {heads?.map((head: any, idx: number) => (
                        <Table.Cell
                          key={idx}
                          className="p-4 relative bg-[rgba(255,255,255,0.2)] ">
                          <div>
                            {head.name === "created_at" &&
                            (data as any)[head.name]
                              ? moment((data as any)[head.name]).format(
                                  "YYYY-MM-DD HH:mm:ss"
                                )
                              : (data as any)[head.name] || "-"}
                          </div>
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={6} className="p-0">
                      <EmptyState />
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};
const userData = async () => {
  try {
    const response = await API({
      url: `me`,
      method: "GET"
    });
    const user = response;

    // Fetch diplomas where the user is a teacher
    if (user.role === "TEACHER") {
      const diplomasResponse = await API({
        url: `/diploma/teacher`,
        method: "GET"
      });
      user.teacherDiplomas = diplomasResponse;
    }

    return user;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "An error occurred");
  }
};

const Home = () => {
  const [user, setUser] = useState<any>(null);
  const usermutation = useMutation({ mutationFn: userData });

  useEffect(() => {
    usermutation.mutate();
  }, []);

  useEffect(() => {
    if (usermutation.data) {
      setUser(usermutation.data);
    }
  }, [usermutation.data]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-10 ">
      <Header />
      {user && user.role === "TEACHER" && (
        <CTable
          datas={user.teacherDiplomas}
          heads={[
            { name: "name", label: "Diploma Name" },
            { name: "student", label: "Student" },
            { name: "status", label: "Status" },
            { name: "finalPoints", label: "Final Points" },
            { name: "created_at", label: "Created At" }
          ]}
          isLoading={usermutation.isPending}
        />
      )}
    </main>
  );
};

export default Home;
