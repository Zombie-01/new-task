import { Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import CommentSection from "./comment";

export function SideBar({ data, step, setStep }: any) {
  console.log(data);
  return (
    <Tabs
      aria-label="Tabs with icons"
      className="flex flex-col gap-10"
      style="underline">
      <Tabs.Item title="step 1" icon={HiUserCircle}>
        <CommentSection stepId={1} />
      </Tabs.Item>
      <Tabs.Item disabled={data?.length < 1} title="step 2" icon={MdDashboard}>
        step 2
      </Tabs.Item>
      <Tabs.Item
        disabled={data?.length < 2}
        title="step 3"
        icon={HiAdjustments}>
        step 3
      </Tabs.Item>
      <Tabs.Item
        disabled={data?.length < 3}
        title="step 4"
        icon={HiClipboardList}>
        step 4
      </Tabs.Item>
      <Tabs.Item disabled={data?.length < 4} title="step 5">
        step 5
      </Tabs.Item>
    </Tabs>
  );
}
