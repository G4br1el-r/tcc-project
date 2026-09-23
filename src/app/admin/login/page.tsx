import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/admin/LoginForm";
import { MAIN_CONTENT_ID } from "@/lib/a11y";
import { BRAND_MONOGRAM, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = { title: "Entrar" };

export default function AdminLoginPage() {
  return (
    <main id={MAIN_CONTENT_ID} className="login">
      <section className="login__aside" aria-labelledby="login-title">
        <a href="/" className="login__brand">
          <Image
            src={BRAND_MONOGRAM.src}
            alt=""
            width={BRAND_MONOGRAM.width}
            height={BRAND_MONOGRAM.height}
            className="login__mark"
            loading="eager"
          />
          <span>{SITE_NAME}</span>
        </a>

        <div className="login__intro">
          <p className="login__eyebrow">Área restrita</p>
          <h1 id="login-title" className="login__title">
            Painel
            <span className="login__title-dot" aria-hidden="true">
              .
            </span>
          </h1>
          <p className="login__lead">
            Gerencie as perguntas frequentes exibidas na landing.
          </p>
        </div>

        <p className="login__note">Acesso exclusivo da equipe.</p>
      </section>

      <section className="login__panel" aria-labelledby="login-form-title">
        <div className="login__card">
          <h2 id="login-form-title" className="login__heading">
            Entrar
          </h2>
          <p className="login__subtitle">
            Use o usuário e a senha cadastrados para a equipe.
          </p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
