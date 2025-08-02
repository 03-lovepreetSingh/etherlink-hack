// components/InfiniteCarousel.tsx
"use client";
import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

// Programming Languages & Technologies Icons with Names - Extended List
const allItems = [
  // Programming Languages
  { icon: "logos:javascript", name: "JavaScript" },
  { icon: "logos:typescript", name: "TypeScript" },
  { icon: "logos:python", name: "Python" },
  { icon: "logos:java", name: "Java" },
  { icon: "logos:c-sharp", name: "C#" },
  { icon: "logos:c-plusplus", name: "C++" },
  { icon: "logos:c", name: "C" },
  { icon: "logos:go", name: "Go" },
  { icon: "logos:rust", name: "Rust" },
  { icon: "logos:php", name: "PHP" },
  { icon: "logos:ruby", name: "Ruby" },
  { icon: "logos:swift", name: "Swift" },
  { icon: "logos:kotlin", name: "Kotlin" },
  { icon: "logos:dart", name: "Dart" },
  { icon: "logos:scala", name: "Scala" },
  { icon: "logos:clojure", name: "Clojure" },
  { icon: "logos:elixir", name: "Elixir" },
  { icon: "logos:erlang", name: "Erlang" },
  { icon: "logos:haskell", name: "Haskell" },
  { icon: "logos:lua", name: "Lua" },
  { icon: "logos:perl", name: "Perl" },
  { icon: "logos:r-lang", name: "R" },
  { icon: "logos:matlab", name: "MATLAB" },
  { icon: "logos:julia", name: "Julia" },
  { icon: "simple-icons:cplusplus", name: "C++" },
  { icon: "simple-icons:csharp", name: "C#" },
  { icon: "simple-icons:assembly", name: "Assembly" },
  { icon: "simple-icons:fortran", name: "Fortran" },
  { icon: "simple-icons:cobol", name: "COBOL" },
  { icon: "simple-icons:pascal", name: "Pascal" },

  // Frontend Frameworks & Libraries
  { icon: "logos:react", name: "React" },
  { icon: "logos:vue", name: "Vue.js" },
  { icon: "logos:angular", name: "Angular" },
  { icon: "logos:svelte", name: "Svelte" },
  { icon: "logos:nextjs", name: "Next.js" },
  { icon: "logos:nuxtjs", name: "Nuxt.js" },
  { icon: "logos:gatsby", name: "Gatsby" },
  { icon: "logos:ember", name: "Ember.js" },
  { icon: "logos:backbone", name: "Backbone.js" },
  { icon: "logos:jquery", name: "jQuery" },
  { icon: "logos:alpinejs", name: "Alpine.js" },
  { icon: "logos:lit", name: "Lit" },
  { icon: "logos:stencil", name: "Stencil" },
  { icon: "logos:qwik", name: "Qwik" },
  { icon: "logos:solid", name: "SolidJS" },
  { icon: "logos:preact", name: "Preact" },
  { icon: "simple-icons:htmx", name: "HTMX" },
  { icon: "simple-icons:astro", name: "Astro" },
  { icon: "simple-icons:remix", name: "Remix" },
  { icon: "simple-icons:vite", name: "Vite" },

  // CSS Frameworks & Preprocessors
  { icon: "logos:css-3", name: "CSS3" },
  { icon: "logos:sass", name: "Sass" },
  { icon: "logos:less", name: "Less" },
  { icon: "logos:stylus", name: "Stylus" },
  { icon: "logos:tailwindcss", name: "Tailwind CSS" },
  { icon: "logos:bootstrap", name: "Bootstrap" },
  { icon: "logos:bulma", name: "Bulma" },
  { icon: "logos:materializecss", name: "Materialize" },
  { icon: "logos:foundation", name: "Foundation" },
  { icon: "logos:chakra-ui", name: "Chakra UI" },
  { icon: "simple-icons:mui", name: "Material-UI" },
  { icon: "simple-icons:antdesign", name: "Ant Design" },
  { icon: "simple-icons:styledcomponents", name: "Styled Components" },
  { icon: "simple-icons:emotion", name: "Emotion" },
  { icon: "simple-icons:postcss", name: "PostCSS" },

  // Backend Frameworks
  { icon: "logos:nodejs", name: "Node.js" },
  { icon: "logos:express", name: "Express.js" },
  { icon: "logos:nestjs", name: "NestJS" },
  { icon: "logos:django", name: "Django" },
  { icon: "logos:flask", name: "Flask" },
  { icon: "logos:fastapi", name: "FastAPI" },
  { icon: "logos:spring", name: "Spring" },
  { icon: "logos:laravel", name: "Laravel" },
  { icon: "logos:symfony", name: "Symfony" },
  { icon: "logos:codeigniter", name: "CodeIgniter" },
  { icon: "logos:rails", name: "Ruby on Rails" },
  { icon: "logos:sinatra", name: "Sinatra" },
  { icon: "logos:aspnet", name: "ASP.NET" },
  { icon: "logos:gin", name: "Gin" },
  { icon: "logos:fiber", name: "Fiber" },
  { icon: "logos:phoenix", name: "Phoenix" },
  { icon: "simple-icons:fastify", name: "Fastify" },
  { icon: "simple-icons:koa", name: "Koa" },
  { icon: "simple-icons:hapi", name: "Hapi" },
  { icon: "simple-icons:strapi", name: "Strapi" },

  // Mobile Development
  { icon: "logos:react", name: "React Native" },
  { icon: "logos:flutter", name: "Flutter" },
  { icon: "logos:ionic", name: "Ionic" },
  { icon: "logos:xamarin", name: "Xamarin" },
  { icon: "logos:cordova", name: "Cordova" },
  { icon: "logos:phonegap", name: "PhoneGap" },
  { icon: "logos:nativescript", name: "NativeScript" },
  { icon: "logos:android", name: "Android" },
  { icon: "logos:apple", name: "iOS" },
  { icon: "simple-icons:expo", name: "Expo" },
  { icon: "simple-icons:capacitor", name: "Capacitor" },
  { icon: "simple-icons:unity", name: "Unity" },
  { icon: "simple-icons:unrealengine", name: "Unreal Engine" },
  { icon: "simple-icons:godot", name: "Godot" },
  { icon: "simple-icons:tauri", name: "Tauri" },

  // Databases
  { icon: "logos:mysql", name: "MySQL" },
  { icon: "logos:postgresql", name: "PostgreSQL" },
  { icon: "logos:mongodb", name: "MongoDB" },
  { icon: "logos:redis", name: "Redis" },
  { icon: "logos:sqlite", name: "SQLite" },
  { icon: "logos:mariadb", name: "MariaDB" },
  { icon: "logos:oracle", name: "Oracle" },
  { icon: "logos:microsoft-sql-server", name: "SQL Server" },
  { icon: "logos:cassandra", name: "Cassandra" },
  { icon: "logos:elasticsearch", name: "Elasticsearch" },
  { icon: "logos:neo4j", name: "Neo4j" },
  { icon: "logos:couchdb", name: "CouchDB" },
  { icon: "logos:influxdb", name: "InfluxDB" },
  { icon: "logos:supabase", name: "Supabase" },
  { icon: "logos:planetscale", name: "PlanetScale" },
  { icon: "simple-icons:firebase", name: "Firebase" },
  { icon: "simple-icons:fauna", name: "Fauna" },
  { icon: "simple-icons:dgraph", name: "Dgraph" },
  { icon: "simple-icons:cockroachlabs", name: "CockroachDB" },
  { icon: "simple-icons:arangodb", name: "ArangoDB" },

  // Cloud & DevOps
  { icon: "logos:aws", name: "AWS" },
  { icon: "logos:google-cloud", name: "Google Cloud" },
  { icon: "logos:microsoft-azure", name: "Azure" },
  { icon: "logos:docker", name: "Docker" },
  { icon: "logos:kubernetes", name: "Kubernetes" },
  { icon: "logos:terraform", name: "Terraform" },
  { icon: "logos:ansible", name: "Ansible" },
  { icon: "logos:jenkins", name: "Jenkins" },
  { icon: "logos:gitlab-ci", name: "GitLab CI" },
  { icon: "logos:github-actions", name: "GitHub Actions" },
  { icon: "logos:circleci", name: "CircleCI" },
  { icon: "logos:travis-ci", name: "Travis CI" },
  { icon: "logos:vercel", name: "Vercel" },
  { icon: "logos:netlify", name: "Netlify" },
  { icon: "logos:heroku", name: "Heroku" },
  { icon: "logos:digitalocean", name: "DigitalOcean" },
  { icon: "simple-icons:railway", name: "Railway" },
  { icon: "simple-icons:render", name: "Render" },
  { icon: "simple-icons:fly", name: "Fly.io" },
  { icon: "simple-icons:cloudflare", name: "Cloudflare" },

  // Development Tools
  { icon: "logos:vscode", name: "VS Code" },
  { icon: "logos:webstorm", name: "WebStorm" },
  { icon: "logos:intellij-idea", name: "IntelliJ IDEA" },
  { icon: "logos:sublime-text", name: "Sublime Text" },
  { icon: "logos:atom", name: "Atom" },
  { icon: "logos:vim", name: "Vim" },
  { icon: "logos:emacs", name: "Emacs" },
  { icon: "logos:git", name: "Git" },
  { icon: "logos:github", name: "GitHub" },
  { icon: "logos:gitlab", name: "GitLab" },
  { icon: "logos:bitbucket", name: "Bitbucket" },
  { icon: "logos:npm", name: "npm" },
  { icon: "logos:yarn", name: "Yarn" },
  { icon: "logos:pnpm", name: "pnpm" },
  { icon: "logos:webpack", name: "Webpack" },
  { icon: "logos:vite", name: "Vite" },
  { icon: "logos:rollup", name: "Rollup" },
  { icon: "logos:parcel", name: "Parcel" },
  { icon: "logos:babel", name: "Babel" },
  { icon: "logos:eslint", name: "ESLint" },
  { icon: "logos:prettier", name: "Prettier" },
  { icon: "logos:jest", name: "Jest" },
  { icon: "logos:cypress", name: "Cypress" },
  { icon: "logos:playwright", name: "Playwright" },
  { icon: "logos:storybook", name: "Storybook" },
];

// Split items into 5 arrays
const chunkSize = Math.ceil(allItems.length / 5);
const items1 = allItems.slice(0, chunkSize);
const items2 = allItems.slice(chunkSize, chunkSize * 2);
const items3 = allItems.slice(chunkSize * 2, chunkSize * 3);
const items4 = allItems.slice(chunkSize * 3, chunkSize * 4);
const items5 = allItems.slice(chunkSize * 4);

export default function InfiniteCarousel() {
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);
  const scrollRef3 = useRef<HTMLDivElement>(null);
  const scrollRef4 = useRef<HTMLDivElement>(null);
  const scrollRef5 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const refs = [scrollRef1, scrollRef2, scrollRef3, scrollRef4, scrollRef5];
    const speeds = [1, -1, 1, -1, 1]; // Alternating directions
    const animationFrameIds: number[] = [];

    refs.forEach((ref, index) => {
      const el = ref.current;
      if (!el) return;

      const scrollSpeed = 0.5 * speeds[index]; // Adjust base speed
      let currentPosition = speeds[index] > 0 ? 0 : el.scrollWidth / 2;

      const scroll = () => {
        if (speeds[index] > 0) {
          // Scrolling right
          if (currentPosition >= el.scrollWidth / 2) {
            currentPosition = 0;
          } else {
            currentPosition += Math.abs(scrollSpeed);
          }
        } else {
          // Scrolling left
          if (currentPosition <= 0) {
            currentPosition = el.scrollWidth / 2;
          } else {
            currentPosition += scrollSpeed; // scrollSpeed is negative
          }
        }
        
        el.scrollLeft = currentPosition;
        animationFrameIds[index] = requestAnimationFrame(scroll);
      };

      scroll();
    });

    return () => {
      animationFrameIds.forEach(id => cancelAnimationFrame(id));
    };
  }, []);

  const renderRow = (items: typeof items1, ref: React.RefObject<HTMLDivElement>) => (
    <div ref={ref} className="   relative w-full overflow-hidden py-2">
      <div className="flex gap-3 whitespace-nowrap">
        {/* Duplicate items for seamless loop */}
        {[...items, ...items].map((logo, index) => (
          <div key={index} className="flex items-center gap-3 rounded-full p-2 bg-neutral-900 shrink-0">
            <Icon
              icon={logo.icon}
              width={20}
              height={20}
            />
            <div className="text-[12px] text-white">
              {logo.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full [mask-image:linear-gradient(to_right,transparent,black_25%,black_75%,transparent)]  overflow-hidden space-y-4">
      {renderRow(items1, scrollRef1 as React.RefObject<HTMLDivElement>)}
      {renderRow(items2, scrollRef2)}
      {renderRow(items3, scrollRef3)}
      {renderRow(items4, scrollRef4)}
      {renderRow(items5, scrollRef5)}
    </div>
  );
}