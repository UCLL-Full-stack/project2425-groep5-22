import router from "next/router";
import React, { useState } from "react";
import Button from "../Button";
import userService from "@/services/UserService";
import { User } from "@/types";
import { useTranslation } from 'next-i18next';

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
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
          setError(t('login.errorMessages.incorrectCredentials'));
        } else {
          setError(t('login.errorMessages.loginError'));
        }
        return;
      }

      sessionStorage.setItem("loggedInUser", JSON.stringify(result));
      router.push("/");
    } catch (error) {
      setError(t('login.errorMessages.loginError'));
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
        placeholder={t('login.form.emailPlaceholder')}
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
        placeholder={t('login.form.passwordPlaceholder')}
        required={true}
      />
      <Button loading={loading} className="w-full">{t('login.form.loginButton')}</Button>
    </form>
  );
};

export default LoginForm;