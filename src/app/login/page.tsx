"use client";
import ObjectUtil from "@/utils/ObjectUtil";
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

const SignInPage: FC = function () {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (event.target instanceof HTMLFormElement) {
      const formData = new FormData(event.target);
      const data = ObjectUtil.formDataToJson(formData);
      return JSON.stringify(data);
    }
  };
  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    const data: any = onSubmit(event);
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: data
    }).finally(() => {
      setLoading(false);
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data?.token);
      localStorage.setItem("role", data?.role);
      localStorage.setItem("user", JSON.stringify(data));
      if (data?.role === "STUDENT") {
        push("/process");
      } else {
        push("/processTeacher");
      }
      console.log("User login:", data);
    } else {
      console.error("Failed to create user");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12">
      <div className="my-6 flex items-center gap-x-1 lg:my-0">
        <img
          alt="Flowbite logo"
          src="https://flowbite.com/docs/images/logo.svg"
          className="mr-3 h-12"
        />
        <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
          Flowbite
        </span>
      </div>
      <Card
        imgSrc="/images/authentication/login.jpg"
        imgAlt=""
        className="w-full md:max-w-screen-sm [&>img]:hidden md:[&>img]:w-96 md:[&>img]:p-0 md:[&>*]:w-full md:[&>*]:p-16 lg:[&>img]:block dark:bg-gray-800">
        <form action="submit" onSubmit={login}>
          <div className="mb-4 flex flex-col gap-y-3">
            <Label htmlFor="username">Your username</Label>
            <TextInput
              id="username"
              name="username"
              placeholder="name@company.com"
              type="username"
            />
          </div>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="password">Your password</Label>
            <TextInput
              id="password"
              name="password"
              placeholder="Password"
              type="password"
            />
          </div>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-x-3">
              <Checkbox id="rememberMe" name="rememberMe" />
              <Label htmlFor="rememberMe">Remember me</Label>
            </div>
            <a
              href="#"
              className="w-1/2 text-right text-sm text-primary-600 dark:text-primary-300">
              Lost Password?
            </a>
          </div>
          <div className="mb-6">
            <Button type="submit" className="w-full lg:w-auto bg-blue-600">
              Login to your account
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Not registered?&nbsp;
            <a href="#" className="text-primary-600 dark:text-primary-300">
              Create account
            </a>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default SignInPage;
