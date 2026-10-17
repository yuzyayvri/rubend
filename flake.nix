{
  description = "Rubend: a proof-driven Rubik's cube solver in Bend 2";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/55bfb4d7437bd4e09ab7cba58a43bd68eb310044";
    bend.url = "github:bendlang/bend/7e120d5bd257ed3704daf1301b02fd17f5d1fb9d";
    bend.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, nixpkgs, bend }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
      bendPackage = bend.packages.${system}.default;
      leanExact = pkgs.stdenv.mkDerivation {
        pname = "lean-verdict";
        version = "4.34.0";
        src = pkgs.fetchurl {
          url = "https://github.com/leanprover/lean4/releases/download/v4.34.0/lean-4.34.0-linux.tar.zst";
          sha256 = "caaa98356098c85dc0fcbbd28e1ec66f39eb6551829972b752ff20e1286b646b";
        };
        nativeBuildInputs = [ pkgs.autoPatchelfHook pkgs.zstd ];
        buildInputs = [ pkgs.stdenv.cc.cc.lib pkgs.gmp pkgs.zlib pkgs.libuv pkgs.openssl ];
        dontBuild = true;
        dontStrip = true;
        installPhase = ''
          runHook preInstall
          mkdir -p $out
          cp -r . $out/
          runHook postInstall
        '';
        meta.license = pkgs.lib.licenses.asl20;
      };
      kernel = pkgs.stdenv.mkDerivation {
        pname = "rubend-bendtt";
        version = "2.0.37";
        dontUnpack = true;
        nativeBuildInputs = [ leanExact pkgs.autoPatchelfHook ];
        buildInputs = [ pkgs.stdenv.cc.cc.lib ];
        buildPhase = ''
          cp ${bendPackage}/libexec/bend/bend2/bendtt.lean bendtt.lean
          lean -c bendtt.c bendtt.lean
          leanc -O3 -DNDEBUG bendtt.c -o bendtt
        '';
        installPhase = ''
          mkdir -p $out/bin
          cp bendtt $out/bin/bendtt
        '';
        meta.license = pkgs.lib.licenses.asl20;
      };
      tools = [ bendPackage pkgs.clang pkgs.nodejs_24 pkgs.git pkgs.just pkgs.coreutils leanExact kernel ];
      rubend = pkgs.buildNpmPackage {
        pname = "rubend";
        version = (builtins.fromJSON (builtins.readFile ./package.json)).version;
        src = self;
        nodejs = pkgs.nodejs_24;
        npmDepsHash = "sha256-UdVqJLfQ0wq+ZA3cZpnCLmtXrshlWYZbhFLrjkvsZNE=";
        npmFlags = [ "--ignore-scripts" ];
        nativeBuildInputs = [ bendPackage pkgs.clang pkgs.makeWrapper pkgs.autoPatchelfHook ];
        buildInputs = [ pkgs.stdenv.cc.cc.lib ];
        BENDTT = "${kernel}/bin/bendtt";
        BEND_NO_TELEMETRY = "1";
        doCheck = true;
        checkPhase = ''
          runHook preCheck
          node tests/block-layout.mjs
          bend src/block-table.bend -o build/block-table.mjs
          node tests/block-table.mjs
          bend tests/block-codec.bend -o build/block-codec-test
          build/block-codec-test --threads 1
          node tests/core.mjs
          node tests/exact.mjs
          node tests/export.mjs
          bend tests/joint-cache.bend -o build/joint-cache-test
          node tests/joint-cache.mjs
          bend bench/audit.bend -o build/audit
          build/audit --threads 1
          runHook postCheck
        '';
        installPhase = ''
          runHook preInstall
          mkdir -p $out/share/rubend/apps $out/share/rubend/build $out/bin
          cp apps/*.mjs $out/share/rubend/apps/
          cp build/model.mjs build/cubie.mjs build/notation.mjs build/symmetry.mjs build/packed-symmetry.mjs build/coordinates.mjs build/manifest.json build/rubend $out/share/rubend/build/
          cp -r build/web $out/share/rubend/build/
          cp LICENSE README.md THIRD_PARTY_NOTICES.md $out/share/rubend/
          cp -r licenses $out/share/rubend/
          makeWrapper ${pkgs.nodejs_24}/bin/node $out/bin/rubend \
            --chdir $out/share/rubend \
            --prefix PATH : ${pkgs.lib.makeBinPath [ pkgs.coreutils ]} \
            --add-flags $out/share/rubend/apps/server.mjs
          makeWrapper $out/share/rubend/build/rubend $out/bin/rubend-cli
          runHook postInstall
        '';
        preFixup = ''
          sealRubendBuild() {
            ${pkgs.nodejs_24}/bin/node scripts/manifest.mjs seal $out/share/rubend/build/manifest.json $out/share/rubend/build/rubend
          }
          postFixupHooks+=(sealRubendBuild)
        '';
        meta = {
          description = "A local proof-driven Rubik's cube workbench in Bend 2";
          license = pkgs.lib.licenses.gpl3Plus;
          mainProgram = "rubend";
          platforms = [ system ];
        };
      };
    in {
      packages.${system} = {
        default = rubend;
        inherit rubend;
        bend = bendPackage;
        bendtt = kernel;
        lean-verdict = leanExact;
      };
      apps.${system}.default = {
        type = "app";
        program = "${rubend}/bin/rubend";
        meta.description = "Rubend local 3D cube workbench";
      };
      devShells.${system}.default = pkgs.mkShell {
        packages = tools;
        BENDTT = "${kernel}/bin/bendtt";
        BEND_NO_TELEMETRY = "1";
      };
      checks.${system} = {
      runtime = pkgs.runCommand "rubend-runtime-check" {
        nativeBuildInputs = [ pkgs.nodejs_24 pkgs.coreutils ];
        RUBEND_APP_COMMAND = "${rubend}/bin/rubend";
        RUBEND_BINARY = "${rubend}/share/rubend/build/rubend";
      } ''
        cp -r ${self} source
        chmod u+w source
        cp -r ${rubend}/share/rubend/build source/
        chmod -R u+w source
        cd source
        node tests/package.mjs ${rubend}/share/rubend/build
        node tests/http.mjs
        node tests/engine.mjs
        mkdir -p $out
        cp build/evidence/http.json build/evidence/engine.json $out/
      '';
      setup = pkgs.runCommand "rubend-setup-check" {
        nativeBuildInputs = tools;
        BENDTT = "${kernel}/bin/bendtt";
        BEND_NO_TELEMETRY = "1";
      } ''
        cp -r ${self} source
        chmod -R u+w source
        cd source
        node scripts/check.mjs
        mkdir -p $out
        cp build/setup-check.json $out/setup-check.json
      '';
      };
    };
}
