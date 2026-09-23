"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { ADMIN_PATH } from "@/lib/routes";

const TOO_MANY_REQUESTS_STATUS = 429;
const PASSWORD_HINT = "Porco";
const PASSWORD_HINT_EMOJI = "🐷";
const PASSWORD_HINT_SOUND = "Oinc! Oinc!";
const PASSWORD_HINT_ID = "login-password-hint";

function readField(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value : "";
}

function EyeIcon({ crossed }: { crossed: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {crossed ? <path d="M3 3l18 18" /> : null}
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useLayoutEffect(() => {
    const form = formRef.current;
    return () => {
      form?.reset();
      setPending(false);
      setPasswordVisible(false);
      setHintVisible(false);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    setPending(true);

    const { error: signInError } = await authClient.signIn.username({
      username: readField(form, "username").trim(),
      password: readField(form, "password"),
    });

    if (signInError) {
      setPending(false);
      toast.error(
        signInError.status === TOO_MANY_REQUESTS_STATUS
          ? "Muitas tentativas seguidas. Aguarde alguns segundos e tente de novo."
          : "Usuário ou senha incorretos.",
      );
      return;
    }

    toast.success("Login feito. Bem-vindo ao painel.");
    router.replace(ADMIN_PATH);
    router.refresh();
  }

  return (
    <form
      ref={formRef}
      className="admin-form login-form"
      onSubmit={handleSubmit}
    >
      <div className="admin-form__field">
        <label htmlFor="login-username">Usuário</label>
        <input
          id="login-username"
          name="username"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
        />
      </div>

      <div className="admin-form__field">
        <div className="login-form__label-row">
          <label htmlFor="login-password">Senha</label>
          <button
            type="button"
            className="login-form__link"
            aria-expanded={hintVisible}
            aria-controls={PASSWORD_HINT_ID}
            onClick={() => setHintVisible((visible) => !visible)}
          >
            {hintVisible ? "Ocultar dica" : "Dica de senha"}
          </button>
        </div>

        <div className="login-form__password">
          <input
            id="login-password"
            name="password"
            type={passwordVisible ? "text" : "password"}
            autoComplete="current-password"
            autoCapitalize="none"
            spellCheck={false}
            required
          />
          <button
            type="button"
            className="login-form__reveal"
            aria-label="Mostrar senha"
            aria-pressed={passwordVisible}
            aria-controls="login-password"
            onClick={() => setPasswordVisible((visible) => !visible)}
          >
            <EyeIcon crossed={passwordVisible} />
          </button>
        </div>

        <div
          id={PASSWORD_HINT_ID}
          className="login-form__hint-wrap"
          data-open={hintVisible}
          inert={!hintVisible}
        >
          <div className="login-form__hint-clip">
            <p className="login-form__hint">
              <span className="login-form__hint-label">Dica:</span>{" "}
              {PASSWORD_HINT}{" "}
              <span role="img" aria-label="porco">
                {PASSWORD_HINT_EMOJI}
              </span>{" "}
              <span className="login-form__hint-sound">
                {PASSWORD_HINT_SOUND}
              </span>
            </p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="btn login-form__submit"
        aria-disabled={pending || undefined}
      >
        {pending ? (
          "Entrando…"
        ) : (
          <>
            Entrar
            <span className="login-form__arrow" aria-hidden="true">
              →
            </span>
          </>
        )}
      </button>
    </form>
  );
}
