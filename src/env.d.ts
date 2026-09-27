interface ImportMetaEnv {
  /** "true" on the github.io preview build: show [[TODO]] placeholders. */
  readonly PUBLIC_SHOW_TODOS?: string;
  /** Web3Forms access key (Phase 6). Public by design. */
  readonly PUBLIC_WEB3FORMS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
