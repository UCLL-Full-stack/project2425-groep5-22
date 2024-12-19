
import router from "next/router";
import React, { useState } from "react";
import Button from "../Button";
import userService from "@/services/UserService";
import { User } from "@/types";
import { useTranslation } from 'next-i18next';

const SignupForm: React.FC = () => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User>({
    email: "",
    username: "",
    password: "",
  });

  const validateForm = (): boolean => {
    if (!user.username || !user.username.trim()) {
      setError(t('signup.form.validation.usernameRequired'));
      return false;
    }
    if (user.username.includes(" ") || /[^a-zA-Z0-9_-]/.test(user.username)) {
      setError(t('signup.form.validation.usernameInvalid'));
      return false;
    }
    if (!user.email || !user.email.trim()) {
      setError(t('signup.form.validation.emailRequired'));
      return false;
    }
    if (!user.password || !user.password.trim()) {
      setError(t('signup.form.validation.passwordRequired'));
      return false;
    }
    return true;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await userService.createUser(user);
      const result = await response.json();

      if (!response.ok) {
        if (result.message.includes("already exists")) {
          setError(t('signup.errorMessages.userExists'));
        } else {
          setError(t('signup.errorMessages.signupError'));
        }
        setLoading(false);
        return;
      }

      // After successful signup, log the user in
      const loginResponse = await userService.loginUser({
        email: user.email,
        password: user.password
      });
      const loginResult = await loginResponse.json();

      if (loginResponse.ok) {
        sessionStorage.setItem("loggedInUser", JSON.stringify(loginResult));
        router.push("/");
      }
    } catch (error) {
      setError(t('signup.errorMessages.signupError'));
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
        type="text"
        value={user.username}
        onChange={(e) =>
          setUser((prev) => ({
            ...prev,
            username: e.target.value,
          }))
        }
        name="username"
        placeholder={t('signup.form.usernamePlaceholder')}
        required={true}
      />
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
        placeholder={t('signup.form.emailPlaceholder')}
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
        placeholder={t('signup.form.passwordPlaceholder')}
        required={true}
      />
      <Button loading={loading} className="w-full">{t('signup.form.signupButton')}</Button>
    </form>
  );
};

export default SignupForm;