import { useState } from "react";

function Auth({ onAuthenticated, apiUrl }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiUrl}/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "register"
            ? { name, email, password }
            : { email, password }
        ),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to authenticate.");
      onAuthenticated(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-brand">🧠 ThoughtSpace</div>
        <p className="auth-eyebrow">A quieter place for useful thoughts</p>
        <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="auth-copy">
          {mode === "login"
            ? "Sign in to explore, post, and follow the conversations that matter."
            : "Create an account to keep your thoughts and conversations together."}
        </p>

        <form onSubmit={submit} className="auth-form">
          {mode === "register" && (
            <label>
              Name
              <input value={name} onChange={(event) => setName(event.target.value)} required />
            </label>
          )}
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          className="auth-switch"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
        >
          {mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}
        </button>
      </section>
    </main>
  );
}

export default Auth;
