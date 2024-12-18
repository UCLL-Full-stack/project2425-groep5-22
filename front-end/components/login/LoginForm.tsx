import router from "next/router";
import React, { useState } from "react";
import Button from "../Button";
import userService from "@/services/UserService";
import { User } from "@/types";

const LoginForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User>({
    email: "",
    password: ""
  });

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await userService.loginUser(user);
      const result = await response.json();

      if (!response.ok) {
        if (result.message === "Username or password is incorrect.") {
          setError("Email en/of wachtwoord is incorrect");
        } else {
          setError("Er is iets misgelopen, probeer later opnieuw");
        }
        return;
      }

      sessionStorage.setItem("loggedInUser", JSON.stringify(result));
      router.push("/");
    } catch (error) {
      setError("Er is iets misgelopen, probeer later opnieuw");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <p className="text-center text-red-500">
        {error ? error : ""}
      </p>
      <input
        className="input"
        type="email"
        value={user.email}
        onChange={(e) =>
          setUser((prev) => ({
            ...prev,
            email: e.target.value,
          }))
        }
        name="email"
        placeholder="Email"
        required={true}
      />
      <input
        className="input"
        type="password"
        value={user.password}
        onChange={(e) =>
          setUser((prev) => ({
            ...prev,
            password: e.target.value,
          }))
        }
        name="password"
        placeholder="Wachtwoord"
        required={true}
      />
      <Button loading={loading} className="w-full">Inloggen</Button>
    </form>
  );
};

export default LoginForm;
