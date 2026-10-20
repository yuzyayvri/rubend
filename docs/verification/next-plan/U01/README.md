# Application and package acceptance

U01 is not complete. The full programme remains at U00's unresolved raw timing
acceptance gate. Preparatory browser checks can establish functional behavior
without promoting the lifecycle policy or changing solver defaults.

The actual model-worker failure lane passes. Its full records, source hashes,
cleanup, and screenshot are in
[the shared browser archive](../U00/u00-browser-profiles-v1/index.json).
Playback stops after a worker exception. Twenty Space presses and arrow seeks
leave pending requests at zero, the diagnostic timer advancing, and the retained
answer unchanged and exportable. All temporary tabs and owned processes stop.

`tests/u00-browser-driver.mjs` contains the rerunnable browser scenario.
`tests/ui-fixture-server.mjs model-failure RUN-ID` serves the current app with
a deliberate worker exception and a diagnostic-only DOM mirror. The bridge
does not expose session tokens. `tests/ui-fixture-session.mjs` checks delayed
startup abort, model-failure fixture delivery, incompatible readiness, origin
protection, and process cleanup without claiming real-browser execution.

Remaining work includes cancellation across profiles in the GUI, native death
during search, failure at rewind, repeated live seeks, context loss and recovery,
2D fallback, narrow layout, clipboard denial, downloaded records, saved state,
and isolated import/launch of the actual CI artifact. The earlier successful
CI export is not evidence for import and launch.
