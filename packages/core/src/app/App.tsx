import { type Component, createSignal } from "solid-js";
import logo from "~/assets/logo.svg";
import { Versions } from "~/shared";

export const App: Component = () => {
  const [count, setCount] = createSignal(0);

  return (
    <div class="container">
      <Versions />
      <button onClick={() => setCount((v) => v + 1)}>{count()}</button>

      <img class="hero-logo" src={logo} alt="logo" />
      <h2 class="hero-text" style={{ color: "green" }}>
        You{"'"}ve successfully asn Elroject with Solid and TypeScript
      </h2>
      <p class="hero-tagline">
        Please try pressing <code>F12</code> to open the devTool
      </p>

      <div class="links">
        <div class="link-item">
          <a target="_blank" href="https://electron-vite.org" rel="noopener noreferrer">
            Documentation
          </a>
        </div>
        <div class="link-item link-dot">•</div>
        <div class="link-item">
          <a target="_blank" href="https://github.com/alex8088/electron-vite" rel="noopener noreferrer">
            Getting Help
          </a>
        </div>
        <div class="link-item link-dot">•</div>
        <div class="link-item">
          <a
            target="_blank"
            href="https://github.com/alex8088/quick-start/tree/master/packages/create-electron"
            rel="noopener noreferrer"
          >
            create-electron
          </a>
        </div>
      </div>

      <div class="features">
        <div class="feature-item">
          <article>
            <h2 class="title">Configuring</h2>
            <p class="detail">
              Config with <span>electron.vite.config.ts</span> and refer to the{" "}
              <a target="_blank" href="https://electron-vite.org/config" rel="noopener noreferrer">
                config guide
              </a>
              .
            </p>
          </article>
        </div>
        <div class="feature-item">
          <article>
            <h2 class="title">HMR</h2>
            <p class="detail">
              Edit <span>src/renderer</span> files to test HMR. See{" "}
              <a target="_blank" href="https://electron-vite.org/guide/hmr.html" rel="noopener noreferrer">
                docs
              </a>
              .
            </p>
          </article>
        </div>
        <div class="feature-item">
          <article>
            <h2 class="title">Hot Reloading</h2>
            <p class="detail">
              Run{" "}
              <span>
                {"'"}electron-vite dev --watch{"'"}
              </span>{" "}
              to enable. See{" "}
              <a target="_blank" href="https://electron-vite.org/guide/hot-reloading.html" rel="noopener noreferrer">
                docs
              </a>
              .
            </p>
          </article>
        </div>
        <div class="feature-item">
          <article>
            <h2 class="title">Debugging</h2>
            <p class="detail">
              Check out <span>.vscode/launch.json</span>. See{" "}
              <a target="_blank" href="https://electron-vite.org/guide/debugging.html" rel="noopener noreferrer">
                docs
              </a>
              .
            </p>
          </article>
        </div>
        <div class="feature-item">
          <article>
            <h2 class="title">Source Code Protection</h2>
            <p class="detail">
              Supported via built-in plugin <span>bytecodePlugin</span>. See{" "}
              <a
                target="_blank"
                href="https://electron-vite.org/guide/source-code-protection.html"
                rel="noopener noreferrer"
              >
                docs
              </a>
              .
            </p>
          </article>
        </div>
        <div class="feature-item">
          <article>
            <h2 class="title">Packaging</h2>
            <p class="detail">
              Use{" "}
              <a target="_blank" href="https://www.electron.build" rel="noopener noreferrer">
                electron-builder
              </a>{" "}
              and pre-configured to pack your app.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
};
