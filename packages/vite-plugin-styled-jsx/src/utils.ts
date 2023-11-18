/*
  cyrb53a (c) 2023 bryc (github.com/bryc)
  License: Public domain. Attribution appreciated.
  The original cyrb53 has a slight mixing bias in the low bits of h1.
  This shouldn't be a huge problem, but I want to try to improve it.
  This new version should have improved avalanche behavior, but
  it is not quite final, I may still find improvements.
  So don't expect it to always produce the same output.
*/
export function computeHash(str: string, seed = 0): string {
  let h1 = 0xde_ad_be_ef ^ seed,
    h2 = 0x41_c6_ce_57 ^ seed;
  for (let i = 0, ch = 0; i < str.length; i++) {
    // eslint-disable-next-line unicorn/prefer-code-point
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 0x85_eb_ca_77);
    h2 = Math.imul(h2 ^ ch, 0xc2_b2_ae_3d);
  }
  h1 ^= Math.imul(h1 ^ (h2 >>> 15), 0x73_5a_2d_97);
  h2 ^= Math.imul(h2 ^ (h1 >>> 15), 0xca_f6_49_a9);
  h1 ^= h2 >>> 16;
  h2 ^= h1 >>> 16;
  return (2_097_152 * (h2 >>> 0) + (h1 >>> 11)).toString(36);
}
