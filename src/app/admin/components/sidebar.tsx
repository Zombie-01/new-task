"use client";

import { Sidebar, TextInput } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  HiChartPie,
  HiSearch,
  HiShoppingBag,
  HiUsers,
  HiOutlineDocument
} from "react-icons/hi";

const AdminSidebar: FC = function () {
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    if (window) {
      const newPage = window?.location?.pathname;

      setCurrentPage(newPage);
    }
  }, []);

  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example">
      <div className="flex h-full flex-col justify-between py-2">
        <div>
          <form className="pb-3 md:hidden">
            <TextInput
              icon={HiSearch}
              type="search"
              placeholder="Search"
              required
              size={32}
            />
          </form>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                href="/admin/dashboard"
                icon={HiChartPie}
                className={
                  "/admin/dashboard" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }>
                Dashboard
              </Sidebar.Item>

              <Sidebar.Item
                href="/admin/users"
                icon={HiUsers}
                className={
                  "/admin/users" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }>
                Users
              </Sidebar.Item>
              <Sidebar.Item
                href="/admin/diploma"
                icon={HiOutlineDocument}
                className={
                  "/admin/diploma" === currentPage
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }>
                Diploma
              </Sidebar.Item>
              {/* <Sidebar.Item href="/authentication/sign-in" icon={HiLogin}>
                Sign in
              </Sidebar.Item>
              <Sidebar.Item href="/authentication/sign-up" icon={HiPencil}>
                Sign up
              </Sidebar.Item> */}
            </Sidebar.ItemGroup>
            {/* <Sidebar.ItemGroup>
              <Sidebar.Item
                href="https://github.com/themesberg/flowbite-react/"
                icon={HiClipboard}
              >
                Docs
              </Sidebar.Item>
              <Sidebar.Item
                href="https://flowbite-react.com/"
                icon={HiCollection}
              >
                Components
              </Sidebar.Item>
              <Sidebar.Item
                href="https://github.com/themesberg/flowbite-react/issues"
                icon={HiInformationCircle}
              >
                Help
              </Sidebar.Item>
            </Sidebar.ItemGroup> */}
          </Sidebar.Items>
        </div>
      </div>
    </Sidebar>
  );
};

export default AdminSidebar;
