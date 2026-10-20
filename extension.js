(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __esm = (fn, res, err2) => function __init() {
    if (err2) throw err2[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err2 = [e], e;
    }
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // node_modules/@noble/hashes/_u64.js
  function fromBig(n, le = false) {
    if (le)
      return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
    return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
  }
  function split(lst, le = false) {
    const len = lst.length;
    let Ah = new Uint32Array(len);
    let Al = new Uint32Array(len);
    for (let i2 = 0; i2 < len; i2++) {
      const { h, l } = fromBig(lst[i2], le);
      [Ah[i2], Al[i2]] = [h, l];
    }
    return [Ah, Al];
  }
  function setU64FromNum(view, byteOffset, n, isLE) {
    const h = fromNumH(n);
    const l = fromNumL(n);
    view.setUint32(byteOffset, isLE ? l : h, isLE);
    view.setUint32(byteOffset + 4, isLE ? h : l, isLE);
  }
  function add(Ah, Al, Bh, Bl) {
    const l = (Al >>> 0) + (Bl >>> 0);
    return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
  }
  var U32_MASK64, _32n, fromNumH, fromNumL, shrSH, shrSL, rotrSH, rotrSL, rotrBH, rotrBL, add3L, add3H, add4L, add4H, add5L, add5H;
  var init_u64 = __esm({
    "node_modules/@noble/hashes/_u64.js"() {
      U32_MASK64 = /* @__PURE__ */ (() => BigInt(2 ** 32 - 1))();
      _32n = /* @__PURE__ */ BigInt(32);
      fromNumH = (n) => n / 2 ** 32 | 0;
      fromNumL = (n) => n >>> 0;
      shrSH = (h, _l, s) => h >>> s;
      shrSL = (h, l, s) => h << 32 - s | l >>> s;
      rotrSH = (h, l, s) => h >>> s | l << 32 - s;
      rotrSL = (h, l, s) => h << 32 - s | l >>> s;
      rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
      rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
      add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
      add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
      add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
      add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
      add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
      add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
    }
  });

  // node_modules/@noble/hashes/utils.js
  function isBytes(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
  }
  function anumber(n, title = "") {
    if (typeof n !== "number")
      throw new TypeError(atitle(title) + "expected number, got " + typeof n);
    if (!Number.isSafeInteger(n) || n < 0)
      throw new RangeError(atitle(title) + "expected integer >= 0, got " + n);
    return n;
  }
  function abytes(value, length, title = "") {
    if (isBytes(value) && (length === void 0 || value.length === length))
      return value;
    if (length !== void 0)
      anumber(length, "length");
    const bytes = isBytes(value);
    const ofLen = length !== void 0 ? ` of length ${length}` : "";
    const got = bytes ? `length=${value.length}` : `type=${typeof value}`;
    const message = atitle(title) + "expected Uint8Array" + ofLen + ", got " + got;
    if (!bytes)
      throw new TypeError(message);
    throw new RangeError(message);
  }
  function aexists(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("hash was destroyed");
    if (checkFinished && instance.finished)
      throw new Error("digest() was already called");
  }
  function aoutput(out, instance) {
    abytes(out, void 0, "output");
    const min = instance.outputLen;
    if (!(out.length >= min)) {
      throw new RangeError('"output" expected length >= ' + min);
    }
  }
  function clean(...arrays) {
    for (let i2 = 0; i2 < arrays.length; i2++) {
      arrays[i2].fill(0);
    }
  }
  function createView(arr) {
    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
  }
  function rotr(word, shift) {
    return word << 32 - shift | word >>> shift;
  }
  function checkOpts(defaults, opts, title = "opts") {
    aopts(defaults, "defaults");
    if (opts !== void 0)
      aopts(opts, title);
    const merged = Object.assign(/* @__PURE__ */ Object.create(null), defaults, opts);
    return merged;
  }
  function createHasher(hashCons, info = {}) {
    if (typeof hashCons !== "function")
      throw new TypeError('"hashCons" expected function, got type=' + typeof hashCons);
    info = checkOpts({}, info, "info");
    const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
    const tmp = hashCons(void 0);
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.canXOF = tmp.canXOF;
    hashC.create = (opts) => hashCons(opts);
    Object.assign(hashC, info);
    return Object.freeze(hashC);
  }
  var atitle, aobject, aopts, oidNist;
  var init_utils = __esm({
    "node_modules/@noble/hashes/utils.js"() {
      atitle = (title) => title ? `"${title}" ` : "";
      aobject = (value, label) => {
        if (value === null || typeof value !== "object" || Array.isArray(value))
          throw new TypeError((label === "object" ? "" : `"${label}" `) + "expected object, got type=" + typeof value);
      };
      aopts = (value, label) => {
        aobject(value, label);
        const proto = Object.getPrototypeOf(value);
        if (proto !== Object.prototype && proto !== null)
          throw new TypeError(`"${label}" expected plain object`);
        if (Object.hasOwn(value, "__proto__"))
          throw new TypeError(`"${label}.__proto__" is not allowed`);
      };
      oidNist = (suffix) => ({
        // Current NIST hashAlgs suffixes used here fit in one DER subidentifier octet.
        // Larger suffix values would need base-128 OID encoding and a different length byte.
        oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix])
      });
    }
  });

  // node_modules/@noble/hashes/_md.js
  function Chi(a, b, c) {
    return a & b ^ ~a & c;
  }
  function Maj(a, b, c) {
    return a & b ^ a & c ^ b & c;
  }
  var HashMD, SHA256_IV, SHA224_IV, SHA384_IV, SHA512_IV;
  var init_md = __esm({
    "node_modules/@noble/hashes/_md.js"() {
      init_u64();
      init_utils();
      HashMD = class {
        constructor(blockLen, outputLen, padOffset, isLE) {
          __publicField(this, "blockLen");
          __publicField(this, "outputLen");
          __publicField(this, "canXOF", false);
          __publicField(this, "padOffset");
          __publicField(this, "isLE");
          // For partial updates less than block size
          __publicField(this, "buffer");
          __publicField(this, "view");
          __publicField(this, "finished", false);
          __publicField(this, "length", 0);
          __publicField(this, "pos", 0);
          __publicField(this, "destroyed", false);
          this.blockLen = blockLen;
          this.outputLen = outputLen;
          this.padOffset = padOffset;
          this.isLE = isLE;
          this.buffer = new Uint8Array(blockLen);
          this.view = createView(this.buffer);
        }
        update(data) {
          aexists(this);
          abytes(data);
          const { view, buffer, blockLen } = this;
          const len = data.length;
          let processed = false;
          for (let pos = 0; pos < len; ) {
            const take = Math.min(blockLen - this.pos, len - pos);
            if (take === blockLen) {
              const dataView = createView(data);
              for (; blockLen <= len - pos; pos += blockLen)
                this.process(dataView, pos);
              processed = true;
              continue;
            }
            buffer.set(pos === 0 && take === len ? data : data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
              this.process(view, 0);
              this.pos = 0;
              processed = true;
            }
          }
          this.length += data.length;
          if (processed)
            this.roundClean();
          return this;
        }
        digestInto(out) {
          aexists(this);
          aoutput(out, this);
          this.finished = true;
          const { buffer, view, blockLen, isLE } = this;
          let { pos } = this;
          buffer[pos++] = 128;
          buffer.fill(0, pos);
          if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            buffer.fill(0);
          }
          setU64FromNum(view, blockLen - 8, this.length * 8, isLE);
          this.process(view, 0);
          this.roundClean();
          const oview = out === buffer ? view : createView(out);
          const len = this.outputLen;
          const outLen = len / 4;
          const state = this.get();
          if (len % 4 || outLen > state.length)
            throw new Error("invalid outputLen");
          for (let i2 = 0; i2 < outLen; i2++)
            oview.setUint32(4 * i2, state[i2], isLE);
        }
        digest() {
          const { buffer, outputLen } = this;
          this.digestInto(buffer);
          const res = buffer.slice(0, outputLen);
          this.destroy();
          return res;
        }
        _cloneIntoMeta(to) {
          const { buffer, length, finished, destroyed, pos } = this;
          to.destroyed = destroyed;
          to.finished = finished;
          to.length = length;
          to.pos = pos;
          if (pos)
            to.buffer.set(buffer);
          return to;
        }
        clone() {
          return this._cloneInto();
        }
      };
      SHA256_IV = /* @__PURE__ */ Uint32Array.from([
        1779033703,
        3144134277,
        1013904242,
        2773480762,
        1359893119,
        2600822924,
        528734635,
        1541459225
      ]);
      SHA224_IV = /* @__PURE__ */ Uint32Array.from([
        3238371032,
        914150663,
        812702999,
        4144912697,
        4290775857,
        1750603025,
        1694076839,
        3204075428
      ]);
      SHA384_IV = /* @__PURE__ */ Uint32Array.from([
        3418070365,
        3238371032,
        1654270250,
        914150663,
        2438529370,
        812702999,
        355462360,
        4144912697,
        1731405415,
        4290775857,
        2394180231,
        1750603025,
        3675008525,
        1694076839,
        1203062813,
        3204075428
      ]);
      SHA512_IV = /* @__PURE__ */ Uint32Array.from([
        1779033703,
        4089235720,
        3144134277,
        2227873595,
        1013904242,
        4271175723,
        2773480762,
        1595750129,
        1359893119,
        2917565137,
        2600822924,
        725511199,
        528734635,
        4215389547,
        1541459225,
        327033209
      ]);
    }
  });

  // node_modules/@noble/hashes/sha2.js
  var sha2_exports = {};
  __export(sha2_exports, {
    _SHA224: () => _SHA224,
    _SHA256: () => _SHA256,
    _SHA384: () => _SHA384,
    _SHA512: () => _SHA512,
    _SHA512_224: () => _SHA512_224,
    _SHA512_256: () => _SHA512_256,
    sha224: () => sha224,
    sha256: () => sha256,
    sha384: () => sha384,
    sha512: () => sha512,
    sha512_224: () => sha512_224,
    sha512_256: () => sha512_256
  });
  var SHA256_K, SHA256_W, SHA2_32B, _SHA256, _SHA224, K512, SHA512_Kh, SHA512_Kl, SHA512_W_H, SHA512_W_L, SHA2_64B, _SHA512, _SHA384, T224_IV, T256_IV, _SHA512_224, _SHA512_256, sha256, sha224, sha512, sha384, sha512_256, sha512_224;
  var init_sha2 = __esm({
    "node_modules/@noble/hashes/sha2.js"() {
      init_md();
      init_u64();
      init_utils();
      SHA256_K = /* @__PURE__ */ Uint32Array.from([
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
      ]);
      SHA256_W = /* @__PURE__ */ new Uint32Array(64);
      SHA2_32B = class extends HashMD {
        constructor(outputLen, IV) {
          super(64, outputLen, 8, false);
          // We cannot use array here since array allows indexing by variable
          // which means optimizer/compiler cannot use registers.
          // Numeric initializers matter: starting the fields as `undefined` changes
          // V8's field representation and makes sha256 3x slower (measured).
          __publicField(this, "A", 0);
          __publicField(this, "B", 0);
          __publicField(this, "C", 0);
          __publicField(this, "D", 0);
          __publicField(this, "E", 0);
          __publicField(this, "F", 0);
          __publicField(this, "G", 0);
          __publicField(this, "H", 0);
          this.A = IV[0] | 0;
          this.B = IV[1] | 0;
          this.C = IV[2] | 0;
          this.D = IV[3] | 0;
          this.E = IV[4] | 0;
          this.F = IV[5] | 0;
          this.G = IV[6] | 0;
          this.H = IV[7] | 0;
        }
        get() {
          const { A, B, C, D, E, F, G, H } = this;
          return [A, B, C, D, E, F, G, H];
        }
        // prettier-ignore
        set(A, B, C, D, E, F, G, H) {
          this.A = A | 0;
          this.B = B | 0;
          this.C = C | 0;
          this.D = D | 0;
          this.E = E | 0;
          this.F = F | 0;
          this.G = G | 0;
          this.H = H | 0;
        }
        _cloneInto(to) {
          (to || (to = new this.constructor())).set(...this.get());
          return this._cloneIntoMeta(to);
        }
        process(view, offset) {
          for (let i2 = 0; i2 < 16; i2++, offset += 4)
            SHA256_W[i2] = view.getUint32(offset, false);
          for (let i2 = 16; i2 < 64; i2++) {
            const W15 = SHA256_W[i2 - 15];
            const W2 = SHA256_W[i2 - 2];
            const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
            const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
            SHA256_W[i2] = s1 + SHA256_W[i2 - 7] + s0 + SHA256_W[i2 - 16] | 0;
          }
          let { A, B, C, D, E, F, G, H } = this;
          for (let i2 = 0; i2 < 64; i2++) {
            const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
            const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i2] + SHA256_W[i2] | 0;
            const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
            const T2 = sigma0 + Maj(A, B, C) | 0;
            H = G;
            G = F;
            F = E;
            E = D + T1 | 0;
            D = C;
            C = B;
            B = A;
            A = T1 + T2 | 0;
          }
          A = A + this.A | 0;
          B = B + this.B | 0;
          C = C + this.C | 0;
          D = D + this.D | 0;
          E = E + this.E | 0;
          F = F + this.F | 0;
          G = G + this.G | 0;
          H = H + this.H | 0;
          this.set(A, B, C, D, E, F, G, H);
        }
        roundClean() {
          clean(SHA256_W);
        }
        destroy() {
          this.destroyed = true;
          this.set(0, 0, 0, 0, 0, 0, 0, 0);
          clean(this.buffer);
        }
      };
      _SHA256 = class extends SHA2_32B {
        constructor() {
          super(32, SHA256_IV);
        }
      };
      _SHA224 = class extends SHA2_32B {
        constructor() {
          super(28, SHA224_IV);
        }
      };
      K512 = /* @__PURE__ */ (() => split([
        "0x428a2f98d728ae22",
        "0x7137449123ef65cd",
        "0xb5c0fbcfec4d3b2f",
        "0xe9b5dba58189dbbc",
        "0x3956c25bf348b538",
        "0x59f111f1b605d019",
        "0x923f82a4af194f9b",
        "0xab1c5ed5da6d8118",
        "0xd807aa98a3030242",
        "0x12835b0145706fbe",
        "0x243185be4ee4b28c",
        "0x550c7dc3d5ffb4e2",
        "0x72be5d74f27b896f",
        "0x80deb1fe3b1696b1",
        "0x9bdc06a725c71235",
        "0xc19bf174cf692694",
        "0xe49b69c19ef14ad2",
        "0xefbe4786384f25e3",
        "0x0fc19dc68b8cd5b5",
        "0x240ca1cc77ac9c65",
        "0x2de92c6f592b0275",
        "0x4a7484aa6ea6e483",
        "0x5cb0a9dcbd41fbd4",
        "0x76f988da831153b5",
        "0x983e5152ee66dfab",
        "0xa831c66d2db43210",
        "0xb00327c898fb213f",
        "0xbf597fc7beef0ee4",
        "0xc6e00bf33da88fc2",
        "0xd5a79147930aa725",
        "0x06ca6351e003826f",
        "0x142929670a0e6e70",
        "0x27b70a8546d22ffc",
        "0x2e1b21385c26c926",
        "0x4d2c6dfc5ac42aed",
        "0x53380d139d95b3df",
        "0x650a73548baf63de",
        "0x766a0abb3c77b2a8",
        "0x81c2c92e47edaee6",
        "0x92722c851482353b",
        "0xa2bfe8a14cf10364",
        "0xa81a664bbc423001",
        "0xc24b8b70d0f89791",
        "0xc76c51a30654be30",
        "0xd192e819d6ef5218",
        "0xd69906245565a910",
        "0xf40e35855771202a",
        "0x106aa07032bbd1b8",
        "0x19a4c116b8d2d0c8",
        "0x1e376c085141ab53",
        "0x2748774cdf8eeb99",
        "0x34b0bcb5e19b48a8",
        "0x391c0cb3c5c95a63",
        "0x4ed8aa4ae3418acb",
        "0x5b9cca4f7763e373",
        "0x682e6ff3d6b2b8a3",
        "0x748f82ee5defb2fc",
        "0x78a5636f43172f60",
        "0x84c87814a1f0ab72",
        "0x8cc702081a6439ec",
        "0x90befffa23631e28",
        "0xa4506cebde82bde9",
        "0xbef9a3f7b2c67915",
        "0xc67178f2e372532b",
        "0xca273eceea26619c",
        "0xd186b8c721c0c207",
        "0xeada7dd6cde0eb1e",
        "0xf57d4f7fee6ed178",
        "0x06f067aa72176fba",
        "0x0a637dc5a2c898a6",
        "0x113f9804bef90dae",
        "0x1b710b35131c471b",
        "0x28db77f523047d84",
        "0x32caab7b40c72493",
        "0x3c9ebe0a15c9bebc",
        "0x431d67c49c100d4c",
        "0x4cc5d4becb3e42b6",
        "0x597f299cfc657e2a",
        "0x5fcb6fab3ad6faec",
        "0x6c44198c4a475817"
      ].map((n) => BigInt(n))))();
      SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
      SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
      SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
      SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
      SHA2_64B = class extends HashMD {
        constructor(outputLen, IV) {
          super(128, outputLen, 16, false);
          // We cannot use array here since array allows indexing by variable
          // which means optimizer/compiler cannot use registers.
          // h -- high 32 bits, l -- low 32 bits
          // Numeric initializers matter: starting the fields as `undefined` changes
          // V8's field representation and slows hashing down (measured on sha256).
          __publicField(this, "Ah", 0);
          __publicField(this, "Al", 0);
          __publicField(this, "Bh", 0);
          __publicField(this, "Bl", 0);
          __publicField(this, "Ch", 0);
          __publicField(this, "Cl", 0);
          __publicField(this, "Dh", 0);
          __publicField(this, "Dl", 0);
          __publicField(this, "Eh", 0);
          __publicField(this, "El", 0);
          __publicField(this, "Fh", 0);
          __publicField(this, "Fl", 0);
          __publicField(this, "Gh", 0);
          __publicField(this, "Gl", 0);
          __publicField(this, "Hh", 0);
          __publicField(this, "Hl", 0);
          this.Ah = IV[0] | 0;
          this.Al = IV[1] | 0;
          this.Bh = IV[2] | 0;
          this.Bl = IV[3] | 0;
          this.Ch = IV[4] | 0;
          this.Cl = IV[5] | 0;
          this.Dh = IV[6] | 0;
          this.Dl = IV[7] | 0;
          this.Eh = IV[8] | 0;
          this.El = IV[9] | 0;
          this.Fh = IV[10] | 0;
          this.Fl = IV[11] | 0;
          this.Gh = IV[12] | 0;
          this.Gl = IV[13] | 0;
          this.Hh = IV[14] | 0;
          this.Hl = IV[15] | 0;
        }
        // prettier-ignore
        get() {
          const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
          return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
        }
        // prettier-ignore
        set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
          this.Ah = Ah | 0;
          this.Al = Al | 0;
          this.Bh = Bh | 0;
          this.Bl = Bl | 0;
          this.Ch = Ch | 0;
          this.Cl = Cl | 0;
          this.Dh = Dh | 0;
          this.Dl = Dl | 0;
          this.Eh = Eh | 0;
          this.El = El | 0;
          this.Fh = Fh | 0;
          this.Fl = Fl | 0;
          this.Gh = Gh | 0;
          this.Gl = Gl | 0;
          this.Hh = Hh | 0;
          this.Hl = Hl | 0;
        }
        _cloneInto(to) {
          (to || (to = new this.constructor())).set(...this.get());
          return this._cloneIntoMeta(to);
        }
        process(view, offset) {
          for (let i2 = 0; i2 < 16; i2++, offset += 4) {
            SHA512_W_H[i2] = view.getUint32(offset);
            SHA512_W_L[i2] = view.getUint32(offset += 4);
          }
          for (let i2 = 16; i2 < 80; i2++) {
            const W15h = SHA512_W_H[i2 - 15] | 0;
            const W15l = SHA512_W_L[i2 - 15] | 0;
            const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
            const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
            const W2h = SHA512_W_H[i2 - 2] | 0;
            const W2l = SHA512_W_L[i2 - 2] | 0;
            const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
            const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
            const SUMl = add4L(s0l, s1l, SHA512_W_L[i2 - 7], SHA512_W_L[i2 - 16]);
            const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i2 - 7], SHA512_W_H[i2 - 16]);
            SHA512_W_H[i2] = SUMh | 0;
            SHA512_W_L[i2] = SUMl | 0;
          }
          let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
          for (let i2 = 0; i2 < 80; i2++) {
            const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
            const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
            const CHIh = Eh & Fh ^ ~Eh & Gh;
            const CHIl = El & Fl ^ ~El & Gl;
            const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i2], SHA512_W_L[i2]);
            const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i2], SHA512_W_H[i2]);
            const T1l = T1ll | 0;
            const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
            const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
            const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
            const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
            Hh = Gh | 0;
            Hl = Gl | 0;
            Gh = Fh | 0;
            Gl = Fl | 0;
            Fh = Eh | 0;
            Fl = El | 0;
            ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
            Dh = Ch | 0;
            Dl = Cl | 0;
            Ch = Bh | 0;
            Cl = Bl | 0;
            Bh = Ah | 0;
            Bl = Al | 0;
            const All = add3L(T1l, sigma0l, MAJl);
            Ah = add3H(All, T1h, sigma0h, MAJh);
            Al = All | 0;
          }
          ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
          ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
          ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
          ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
          ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
          ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
          ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
          ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
          this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
        }
        roundClean() {
          clean(SHA512_W_H, SHA512_W_L);
        }
        destroy() {
          this.destroyed = true;
          clean(this.buffer);
          this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
      };
      _SHA512 = class extends SHA2_64B {
        constructor() {
          super(64, SHA512_IV);
        }
      };
      _SHA384 = class extends SHA2_64B {
        constructor() {
          super(48, SHA384_IV);
        }
      };
      T224_IV = /* @__PURE__ */ Uint32Array.from([
        2352822216,
        424955298,
        1944164710,
        2312950998,
        502970286,
        855612546,
        1738396948,
        1479516111,
        258812777,
        2077511080,
        2011393907,
        79989058,
        1067287976,
        1780299464,
        286451373,
        2446758561
      ]);
      T256_IV = /* @__PURE__ */ Uint32Array.from([
        573645204,
        4230739756,
        2673172387,
        3360449730,
        596883563,
        1867755857,
        2520282905,
        1497426621,
        2519219938,
        2827943907,
        3193839141,
        1401305490,
        721525244,
        746961066,
        246885852,
        2177182882
      ]);
      _SHA512_224 = class extends SHA2_64B {
        constructor() {
          super(28, T224_IV);
        }
      };
      _SHA512_256 = class extends SHA2_64B {
        constructor() {
          super(32, T256_IV);
        }
      };
      sha256 = /* @__PURE__ */ createHasher(
        () => new _SHA256(),
        /* @__PURE__ */ oidNist(1)
      );
      sha224 = /* @__PURE__ */ createHasher(
        () => new _SHA224(),
        /* @__PURE__ */ oidNist(4)
      );
      sha512 = /* @__PURE__ */ createHasher(
        () => new _SHA512(),
        /* @__PURE__ */ oidNist(3)
      );
      sha384 = /* @__PURE__ */ createHasher(
        () => new _SHA384(),
        /* @__PURE__ */ oidNist(2)
      );
      sha512_256 = /* @__PURE__ */ createHasher(
        () => new _SHA512_256(),
        /* @__PURE__ */ oidNist(6)
      );
      sha512_224 = /* @__PURE__ */ createHasher(
        () => new _SHA512_224(),
        /* @__PURE__ */ oidNist(5)
      );
    }
  });

  // settings-button.js
  function attachSettingsButton(open) {
    const button = document.createElement("button");
    button.type = "button";
    button.id = "marinara-github-settings-button";
    button.setAttribute("aria-label", "GitHub \uD655\uC7A5 \uAD00\uB9AC");
    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-4.3 1.3-4.3-2.5-6-3m12 6v-3.9a3.4 3.4 0 0 0-.9-2.7c3-.3 6.2-1.5 6.2-6.9a5.4 5.4 0 0 0-1.5-3.8 5 5 0 0 0-.1-3.8s-1.2-.4-4 1.5a13.3 13.3 0 0 0-7.2 0C4.7.5 3.5.9 3.5.9a5 5 0 0 0-.1 3.8A5.4 5.4 0 0 0 2 8.5c0 5.4 3.2 6.6 6.2 6.9a3.4 3.4 0 0 0-.9 2.7V22" transform="translate(2 0) scale(.85)"/></svg><span>GitHub \uD655\uC7A5 \uAD00\uB9AC</span>';
    button.onclick = open;
    function sync() {
      const section = document.getElementById("settings-section-external-extensions");
      const folder = section?.querySelector("svg.lucide-folder-open")?.closest("button") || section && [...section.querySelectorAll("button")].find((b) => /확장 폴더 가져오기|Import (?:Extension )?Folder/i.test(b.textContent));
      if (!folder) {
        if (button.isConnected) button.remove();
        return;
      }
      if (button.className !== folder.className) button.className = folder.className;
      if (button.parentElement !== folder.parentElement || folder.nextElementSibling !== button) folder.after(button);
    }
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });
    sync();
    return { focus: () => button.isConnected && button.focus(), destroy: () => {
      observer.disconnect();
      button.remove();
    } };
  }

  // node_modules/fflate/esm/browser.js
  var u8 = Uint8Array;
  var u16 = Uint16Array;
  var i32 = Int32Array;
  var fleb = new u8([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    0,
    /* unused */
    0,
    0,
    /* impossible */
    0
  ]);
  var fdeb = new u8([
    0,
    0,
    0,
    0,
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    4,
    5,
    5,
    6,
    6,
    7,
    7,
    8,
    8,
    9,
    9,
    10,
    10,
    11,
    11,
    12,
    12,
    13,
    13,
    /* unused */
    0,
    0
  ]);
  var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
  var freb = function(eb, start) {
    var b = new u16(31);
    for (var i2 = 0; i2 < 31; ++i2) {
      b[i2] = start += 1 << eb[i2 - 1];
    }
    var r = new i32(b[30]);
    for (var i2 = 1; i2 < 30; ++i2) {
      for (var j = b[i2]; j < b[i2 + 1]; ++j) {
        r[j] = j - b[i2] << 5 | i2;
      }
    }
    return { b, r };
  };
  var _a = freb(fleb, 2);
  var fl = _a.b;
  var revfl = _a.r;
  fl[28] = 258, revfl[258] = 28;
  var _b = freb(fdeb, 0);
  var fd = _b.b;
  var revfd = _b.r;
  var rev = new u16(32768);
  for (i = 0; i < 32768; ++i) {
    x = (i & 43690) >> 1 | (i & 21845) << 1;
    x = (x & 52428) >> 2 | (x & 13107) << 2;
    x = (x & 61680) >> 4 | (x & 3855) << 4;
    rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
  }
  var x;
  var i;
  var hMap = (function(cd, mb, r) {
    var s = cd.length;
    var i2 = 0;
    var l = new u16(mb);
    for (; i2 < s; ++i2) {
      if (cd[i2])
        ++l[cd[i2] - 1];
    }
    var le = new u16(mb);
    for (i2 = 1; i2 < mb; ++i2) {
      le[i2] = le[i2 - 1] + l[i2 - 1] << 1;
    }
    var co;
    if (r) {
      co = new u16(1 << mb);
      var rvb = 15 - mb;
      for (i2 = 0; i2 < s; ++i2) {
        if (cd[i2]) {
          var sv = i2 << 4 | cd[i2];
          var r_1 = mb - cd[i2];
          var v = le[cd[i2] - 1]++ << r_1;
          for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
            co[rev[v] >> rvb] = sv;
          }
        }
      }
    } else {
      co = new u16(s);
      for (i2 = 0; i2 < s; ++i2) {
        if (cd[i2]) {
          co[i2] = rev[le[cd[i2] - 1]++] >> 15 - cd[i2];
        }
      }
    }
    return co;
  });
  var flt = new u8(288);
  for (i = 0; i < 144; ++i)
    flt[i] = 8;
  var i;
  for (i = 144; i < 256; ++i)
    flt[i] = 9;
  var i;
  for (i = 256; i < 280; ++i)
    flt[i] = 7;
  var i;
  for (i = 280; i < 288; ++i)
    flt[i] = 8;
  var i;
  var fdt = new u8(32);
  for (i = 0; i < 32; ++i)
    fdt[i] = 5;
  var i;
  var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
  var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
  var max = function(a) {
    var m = a[0];
    for (var i2 = 1; i2 < a.length; ++i2) {
      if (a[i2] > m)
        m = a[i2];
    }
    return m;
  };
  var bits = function(d, p, m) {
    var o = p / 8 | 0;
    return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
  };
  var bits16 = function(d, p) {
    var o = p / 8 | 0;
    return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
  };
  var shft = function(p) {
    return (p + 7) / 8 | 0;
  };
  var slc = function(v, s, e) {
    if (s == null || s < 0)
      s = 0;
    if (e == null || e > v.length)
      e = v.length;
    return new u8(v.subarray(s, e));
  };
  var ec = [
    "unexpected EOF",
    "invalid block type",
    "invalid length/literal",
    "invalid distance",
    "stream finished",
    "no stream handler",
    ,
    // determined by compression function
    "no callback",
    "invalid UTF-8 data",
    "extra field too long",
    "date not in range 1980-2099",
    "filename too long",
    "stream finishing",
    "invalid zip data"
    // determined by unknown compression method
  ];
  var err = function(ind, msg, nt) {
    var e = new Error(msg || ec[ind]);
    e.code = ind;
    if (Error.captureStackTrace)
      Error.captureStackTrace(e, err);
    if (!nt)
      throw e;
    return e;
  };
  var inflt = function(dat, st, buf, dict) {
    var sl = dat.length, dl = dict ? dict.length : 0;
    if (!sl || st.f && !st.l)
      return buf || new u8(0);
    var noBuf = !buf;
    var resize = noBuf || st.i != 2;
    var noSt = st.i;
    if (noBuf)
      buf = new u8(sl * 3);
    var cbuf = function(l2) {
      var bl = buf.length;
      if (l2 > bl) {
        var nbuf = new u8(Math.max(bl * 2, l2));
        nbuf.set(buf);
        buf = nbuf;
      }
    };
    var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
    var tbts = sl * 8;
    do {
      if (!lm) {
        final = bits(dat, pos, 1);
        var type = bits(dat, pos + 1, 3);
        pos += 3;
        if (!type) {
          var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
          if (t > sl) {
            if (noSt)
              err(0);
            break;
          }
          if (resize)
            cbuf(bt + l);
          buf.set(dat.subarray(s, t), bt);
          st.b = bt += l, st.p = pos = t * 8, st.f = final;
          continue;
        } else if (type == 1)
          lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
        else if (type == 2) {
          var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
          var tl = hLit + bits(dat, pos + 5, 31) + 1;
          pos += 14;
          var ldt = new u8(tl);
          var clt = new u8(19);
          for (var i2 = 0; i2 < hcLen; ++i2) {
            clt[clim[i2]] = bits(dat, pos + i2 * 3, 7);
          }
          pos += hcLen * 3;
          var clb = max(clt), clbmsk = (1 << clb) - 1;
          var clm = hMap(clt, clb, 1);
          for (var i2 = 0; i2 < tl; ) {
            var r = clm[bits(dat, pos, clbmsk)];
            pos += r & 15;
            var s = r >> 4;
            if (s < 16) {
              ldt[i2++] = s;
            } else {
              var c = 0, n = 0;
              if (s == 16)
                n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i2 - 1];
              else if (s == 17)
                n = 3 + bits(dat, pos, 7), pos += 3;
              else if (s == 18)
                n = 11 + bits(dat, pos, 127), pos += 7;
              while (n--)
                ldt[i2++] = c;
            }
          }
          var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
          lbt = max(lt);
          dbt = max(dt);
          lm = hMap(lt, lbt, 1);
          dm = hMap(dt, dbt, 1);
        } else
          err(1);
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
      }
      if (resize)
        cbuf(bt + 131072);
      var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
      var lpos = pos;
      for (; ; lpos = pos) {
        var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
        pos += c & 15;
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (!c)
          err(2);
        if (sym < 256)
          buf[bt++] = sym;
        else if (sym == 256) {
          lpos = pos, lm = null;
          break;
        } else {
          var add2 = sym - 254;
          if (sym > 264) {
            var i2 = sym - 257, b = fleb[i2];
            add2 = bits(dat, pos, (1 << b) - 1) + fl[i2];
            pos += b;
          }
          var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
          if (!d)
            err(3);
          pos += d & 15;
          var dt = fd[dsym];
          if (dsym > 3) {
            var b = fdeb[dsym];
            dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
          }
          if (pos > tbts) {
            if (noSt)
              err(0);
            break;
          }
          if (resize)
            cbuf(bt + 131072);
          var end = bt + add2;
          if (bt < dt) {
            var shift = dl - dt, dend = Math.min(dt, end);
            if (shift + bt < 0)
              err(3);
            for (; bt < dend; ++bt)
              buf[bt] = dict[shift + bt];
          }
          for (; bt < end; ++bt)
            buf[bt] = buf[bt - dt];
        }
      }
      st.l = lm, st.p = lpos, st.b = bt, st.f = final;
      if (lm)
        final = 1, st.m = lbt, st.d = dm, st.n = dbt;
    } while (!final);
    return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
  };
  var et = /* @__PURE__ */ new u8(0);
  var b2 = function(d, b) {
    return d[b] | d[b + 1] << 8;
  };
  var b4 = function(d, b) {
    return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
  };
  var b8 = function(d, b) {
    return b4(d, b) + b4(d, b + 4) * 4294967296;
  };
  function inflateSync(data, opts) {
    return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
  }
  var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
  var tds = 0;
  try {
    td.decode(et, { stream: true });
    tds = 1;
  } catch (e) {
  }
  var dutf8 = function(d) {
    for (var r = "", i2 = 0; ; ) {
      var c = d[i2++];
      var eb = (c > 127) + (c > 223) + (c > 239);
      if (i2 + eb > d.length)
        return { s: r, r: slc(d, i2 - 1) };
      if (!eb)
        r += String.fromCharCode(c);
      else if (eb == 3) {
        c = ((c & 15) << 18 | (d[i2++] & 63) << 12 | (d[i2++] & 63) << 6 | d[i2++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
      } else if (eb & 1)
        r += String.fromCharCode((c & 31) << 6 | d[i2++] & 63);
      else
        r += String.fromCharCode((c & 15) << 12 | (d[i2++] & 63) << 6 | d[i2++] & 63);
    }
  };
  function strFromU8(dat, latin1) {
    if (latin1) {
      var r = "";
      for (var i2 = 0; i2 < dat.length; i2 += 16384)
        r += String.fromCharCode.apply(null, dat.subarray(i2, i2 + 16384));
      return r;
    } else if (td) {
      return td.decode(dat);
    } else {
      var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
      if (r.length)
        err(8);
      return s;
    }
  }
  var slzh = function(d, b) {
    return b + 30 + b2(d, b + 26) + b2(d, b + 28);
  };
  var zh = function(d, b, z) {
    var fnl = b2(d, b + 28), efl = b2(d, b + 30), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl;
    var _a2 = z64hs(d, es, efl, z, b4(d, b + 20), b4(d, b + 24), b4(d, b + 42)), sc = _a2[0], su = _a2[1], off = _a2[2];
    return [b2(d, b + 10), sc, su, fn, es + efl + b2(d, b + 32), off];
  };
  var z64hs = function(d, b, l, z, sc, su, off) {
    var nsc = sc == 4294967295, nsu = su == 4294967295, noff = off == 4294967295, e = b + l;
    var nf = nsc + nsu + noff;
    if (z && nf) {
      for (; b + 4 < e; b += 4 + b2(d, b + 2)) {
        if (b2(d, b) == 1) {
          return [
            nsc ? b8(d, b + 4 + 8 * nsu) : sc,
            nsu ? b8(d, b + 4) : su,
            noff ? b8(d, b + 4 + 8 * (nsu + nsc)) : off,
            1
          ];
        }
      }
      if (z < 2)
        err(13);
    }
    return [sc, su, off, 0];
  };
  function unzipSync(data, opts) {
    var files = {};
    var e = data.length - 22;
    for (; b4(data, e) != 101010256; --e) {
      if (!e || data.length - e > 65558)
        err(13);
    }
    ;
    var c = b2(data, e + 8);
    if (!c)
      return {};
    var o = b4(data, e + 16);
    var z = b4(data, e - 20) == 117853008;
    if (z) {
      var ze = b4(data, e - 12);
      z = b4(data, ze) == 101075792;
      if (z) {
        c = b4(data, ze + 32);
        o = b4(data, ze + 48);
      }
    }
    var fltr = opts && opts.filter;
    for (var i2 = 0; i2 < c; ++i2) {
      var _a2 = zh(data, o, z), c_2 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
      o = no;
      if (!fltr || fltr({
        name: fn,
        size: sc,
        originalSize: su,
        compression: c_2
      })) {
        if (!c_2)
          files[fn] = slc(data, b, b + sc);
        else if (c_2 == 8)
          files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
        else
          err(14, "unknown compression type " + c_2);
      }
    }
    return files;
  }

  // core.js
  var CAPS = ["read_active_characters", "read_active_persona", "full_page_access"];
  var LIMIT = 8 * 1024 * 1024;
  function parseRepo(value) {
    const u = new URL(value.trim());
    if (u.protocol !== "https:" || u.hostname !== "github.com" || u.port || u.username || u.password || u.search || u.hash) throw Error("https://github.com/\uC18C\uC720\uC790/\uC800\uC7A5\uC18C \uD615\uC2DD\uC73C\uB85C \uC785\uB825\uD558\uC138\uC694.");
    const parts = u.pathname.replace(/\/$/, "").split("/").filter(Boolean);
    if (parts.length !== 2 || parts.some((x2) => !/^[\w.-]+$/.test(x2))) throw Error("\uC800\uC7A5\uC18C\uC758 \uAE30\uBCF8 \uC8FC\uC18C\uB97C \uC785\uB825\uD558\uC138\uC694.");
    return parts[0] + "/" + parts[1].replace(/\.git$/, "");
  }
  async function remote(url, binary = false) {
    const u = new URL(url);
    if (!["api.github.com", "github.com", "raw.githubusercontent.com", "release-assets.githubusercontent.com", "objects.githubusercontent.com"].includes(u.hostname) || u.protocol !== "https:" || u.username || u.password || u.port) throw Error("\uD5C8\uC6A9\uB418\uC9C0 \uC54A\uC740 \uB2E4\uC6B4\uB85C\uB4DC \uC8FC\uC18C\uC785\uB2C8\uB2E4.");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25e3);
    try {
      const r = await fetch(url, { credentials: "omit", referrerPolicy: "no-referrer", headers: { Accept: binary ? "application/octet-stream" : "application/vnd.github+json" }, signal: controller.signal });
      if ([401, 404].includes(r.status)) throw Error("\uC811\uADFC \uBD88\uAC00: \uBE44\uACF5\uAC1C\xB7\uC0AD\uC81C\uB41C \uC800\uC7A5\uC18C \uB610\uB294 \uD30C\uC77C\uC785\uB2C8\uB2E4. \uD655\uC778\uC744 \uAC74\uB108\uB701\uB2C8\uB2E4.");
      if (r.status === 403 || r.status === 429) throw Error("\uC811\uADFC \uC81C\uD55C \uB610\uB294 GitHub \uC870\uD68C \uD55C\uB3C4 \uCD08\uACFC\uC785\uB2C8\uB2E4. \uB098\uC911\uC5D0 \uB2E4\uC2DC \uD655\uC778\uD558\uC138\uC694.");
      if (!r.ok) throw Error("GitHub \uC751\uB2F5 \uC624\uB958 (" + r.status + ")");
      const reader = r.body.getReader();
      let size = 0;
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > LIMIT) {
          await reader.cancel();
          throw Error("\uB2E4\uC6B4\uB85C\uB4DC\uAC00 8MB \uC81C\uD55C\uC744 \uB118\uC2B5\uB2C8\uB2E4.");
        }
        chunks.push(value);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const c of chunks) {
        bytes.set(c, offset);
        offset += c.length;
      }
      return binary ? bytes : JSON.parse(new TextDecoder().decode(bytes));
    } catch (e) {
      if (e.name === "AbortError") throw Error("GitHub \uC694\uCCAD \uC2DC\uAC04\uC774 \uCD08\uACFC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
      if (e instanceof TypeError) throw Error("GitHub \uC5F0\uACB0\uC774 \uCC28\uB2E8\uB418\uC5C8\uAC70\uB098 \uBE0C\uB77C\uC6B0\uC800\uC5D0\uC11C \uB2E4\uC6B4\uB85C\uB4DC\uB97C \uD5C8\uC6A9\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");
      throw e;
    } finally {
      clearTimeout(timer);
    }
  }
  function safePath(path) {
    if (typeof path !== "string" || !path || path.startsWith("/") || /[\\\x00-\x1f:]/.test(path) || path.split("/").some((p) => p === ".." || p === "." || !p)) throw Error("\uC798\uBABB\uB41C \uD328\uD0A4\uC9C0 \uACBD\uB85C\uC785\uB2C8\uB2E4.");
    return path;
  }
  function unzip(bytes) {
    let total = 0, count = 0;
    const result = unzipSync(bytes, { filter: (file) => {
      if (file.name.endsWith("/")) return false;
      safePath(file.name);
      total += file.originalSize;
      if (total > LIMIT || ++count > 200) throw Error("\uC555\uCD95 \uD574\uC81C \uD06C\uAE30 \uB610\uB294 \uD30C\uC77C \uC218 \uC81C\uD55C \uCD08\uACFC");
      return true;
    } });
    return new Map(Object.entries(result).map(([p, b]) => [p, strFromU8(b)]));
  }
  async function normalize(raw, read) {
    const envelope = raw.manifest || raw;
    const c = envelope.config || envelope;
    if (!["marinara.personal-extension", "marinara.personal-server-extension", "marinara.extension", "marinara.server-extension"].includes(envelope.kind)) throw Error("\uB9C8\uB9AC\uB098\uB77C \uD655\uC7A5 \uB9E4\uB2C8\uD398\uC2A4\uD2B8\uAC00 \uC544\uB2D9\uB2C8\uB2E4.");
    if (typeof c.name !== "string" || !c.name.trim() || c.name.length > 200) throw Error("\uD655\uC7A5 \uC774\uB984\uC774 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");
    const runtime = c.runtime === "server" || envelope.kind.includes("server") ? "server" : "client";
    let capabilities = c.capabilities ?? (envelope.kind === "marinara.extension" ? ["full_page_access"] : []);
    if (!Array.isArray(capabilities) || capabilities.some((x2) => !CAPS.includes(x2))) throw Error("\uC9C0\uC6D0\uD558\uC9C0 \uC54A\uB294 \uD655\uC7A5 \uAD8C\uD55C\uC785\uB2C8\uB2E4.");
    capabilities = CAPS.filter((x2) => capabilities.includes(x2));
    if (runtime === "server" && capabilities.length) throw Error("\uC11C\uBC84 \uD655\uC7A5\uC5D0\uB294 \uBE0C\uB77C\uC6B0\uC800 \uAD8C\uD55C\uC744 \uC0AC\uC6A9\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    async function code(paths, inline) {
      if (paths !== void 0) {
        const list = Array.isArray(paths) ? paths : [paths];
        if (!list.length || list.length > 40) throw Error("\uD30C\uC77C \uBAA9\uB85D \uC624\uB958");
        return (await Promise.all(list.map((p) => read(safePath(p))))).join("\n\n");
      }
      if (inline != null && typeof inline !== "string") throw Error("\uCF54\uB4DC\uB294 \uBB38\uC790\uC5F4\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4.");
      return inline || null;
    }
    const js = runtime === "client" ? await code(c.jsPath ?? c.jsPaths, c.js) : null;
    const css = runtime === "client" ? await code(c.cssPath ?? c.cssPaths, c.css) : null;
    const serverJs = runtime === "server" ? await code(c.serverJsPath ?? c.serverJsPaths ?? c.jsPath ?? c.jsPaths, c.serverJs ?? c.js) : null;
    if (runtime === "client" ? !js?.trim() && !css?.trim() : !serverJs?.trim()) throw Error("\uC2E4\uD589 \uD30C\uC77C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.");
    const out = { name: c.name.trim(), version: c.version == null ? null : String(c.version), description: typeof c.description === "string" ? c.description : "", runtime, capabilities, js, css, serverJs };
    if (out.version?.length > 64 || out.description.length > 2e3 || new TextEncoder().encode(JSON.stringify(out)).length > LIMIT) throw Error("\uD328\uD0A4\uC9C0 \uD06C\uAE30 \uB610\uB294 \uBA54\uD0C0\uB370\uC774\uD130 \uC81C\uD55C \uCD08\uACFC");
    return out;
  }
  async function fingerprint(p) {
    const arr = p.runtime === "server" ? ["server", "", "", p.serverJs ?? ""] : ["client", p.css ?? "", p.js ?? "", ""];
    const caps = CAPS.filter((x2) => (p.capabilities || []).includes(x2));
    if (caps.length) arr.push(caps);
    const bytes = new TextEncoder().encode(JSON.stringify(arr));
    const { sha256: sha2562 } = await Promise.resolve().then(() => (init_sha2(), sha2_exports));
    return "sha256:" + Array.from(sha2562(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
  }
  async function discover(repo) {
    const info = await remote("https://api.github.com/repos/" + repo);
    if (info.private) throw Error("\uBE44\uACF5\uAC1C \uC800\uC7A5\uC18C\uB294 \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");
    const commit = await remote("https://api.github.com/repos/" + repo + "/commits/" + encodeURIComponent(info.default_branch));
    const tree = await remote("https://api.github.com/repos/" + repo + "/git/trees/" + commit.sha + "?recursive=1");
    if (tree.truncated) throw Error("\uC800\uC7A5\uC18C\uAC00 \uB108\uBB34 \uD07D\uB2C8\uB2E4. \uD655\uC7A5 \uC804\uC6A9 \uC800\uC7A5\uC18C\uB97C \uC0AC\uC6A9\uD558\uC138\uC694.");
    const files = tree.tree.filter((x2) => x2.type === "blob");
    const choices = files.filter((x2) => /(^|\/)manifest\.json$/i.test(x2.path) && !/(^|\/)(node_modules|\.git)\//.test(x2.path)).map((x2) => ({ mode: "manifest", path: x2.path, label: x2.path }));
    choices.push(...files.filter((x2) => /\.personal-extension\.zip$/i.test(x2.path)).map((x2) => ({ mode: "zip", path: x2.path, label: x2.path })));
    try {
      const releases = await remote("https://api.github.com/repos/" + repo + "/releases?per_page=5");
      for (const r of releases.filter((x2) => !x2.draft && !x2.prerelease).slice(0, 1)) for (const a of r.assets.filter((x2) => /\.zip$/i.test(x2.name))) choices.unshift({ mode: "release", path: a.name, assetId: a.id, tag: r.tag_name, label: r.tag_name + " / " + a.name, notes: r.body || "" });
    } catch (e) {
      if (!String(e.message).includes("\uC811\uADFC \uBD88\uAC00")) throw e;
    }
    if (!choices.length) throw Error("manifest.json \uB610\uB294 \uC124\uCE58 \uAC00\uB2A5\uD55C ZIP\uC744 \uCC3E\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
    return { repo, sha: commit.sha, files, choices };
  }
  async function loadPackage(snapshot, choice) {
    const { repo, files } = snapshot;
    let total = 0;
    async function blob(path, binary = false) {
      const item = files.find((x2) => x2.path === safePath(path));
      if (!item || item.mode === "120000") throw Error("\uD328\uD0A4\uC9C0 \uD30C\uC77C\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4: " + path);
      total += item.size || 0;
      if (total > LIMIT) throw Error("\uD328\uD0A4\uC9C0\uAC00 8MB\uB97C \uB118\uC2B5\uB2C8\uB2E4.");
      const b = await remote("https://api.github.com/repos/" + repo + "/git/blobs/" + item.sha);
      if (b.encoding !== "base64") throw Error("\uC9C0\uC6D0\uD558\uC9C0 \uC54A\uB294 GitHub \uD30C\uC77C \uC778\uCF54\uB529");
      const bytes = Uint8Array.from(atob(b.content.replace(/\s/g, "")), (c) => c.charCodeAt(0));
      return binary ? bytes : new TextDecoder().decode(bytes);
    }
    let payload;
    if (choice.mode === "manifest") {
      const base = choice.path.slice(0, choice.path.lastIndexOf("/") + 1);
      payload = await normalize(JSON.parse(await blob(choice.path)), (p) => blob(base + p));
    } else {
      const bytes = choice.mode === "release" ? await remote("https://api.github.com/repos/" + repo + "/releases/assets/" + choice.assetId, true) : await blob(choice.path, true);
      const map = unzip(bytes);
      const manifests = [...map.keys()].filter((p) => /(^|\/)manifest\.json$/i.test(p));
      if (manifests.length !== 1) throw Error("ZIP\uC5D0\uB294 manifest.json\uC774 \uD558\uB098 \uC788\uC5B4\uC57C \uD569\uB2C8\uB2E4.");
      const path = manifests[0], base = path.slice(0, path.lastIndexOf("/") + 1);
      payload = await normalize(JSON.parse(map.get(path)), async (p) => {
        if (!map.has(base + p)) throw Error("ZIP \uD30C\uC77C \uB204\uB77D: " + p);
        return map.get(base + p);
      });
    }
    return { payload, hash: await fingerprint(payload), repo, choice, sha: snapshot.sha };
  }

  // extension.js
  (async () => {
    const host = marinara;
    const mount = document.createElement("div");
    mount.id = "marinara-github-manager";
    document.body.append(mount);
    const shadow = mount.attachShadow({ mode: "open" });
    shadow.innerHTML = `<style>
 :host{all:initial;font:13px/1.5 system-ui,sans-serif;color:#263142}*{box-sizing:border-box}button,input,select{font:inherit}button{cursor:pointer;border:1px solid #d4dae5;border-radius:8px;padding:7px 10px;background:#fff;color:#263142}button:hover{background:#eef2fc}button:disabled{opacity:.5;cursor:wait}button.primary{background:#445ec7;color:white;border-color:#445ec7}.veil{position:fixed;inset:0;background:#17203966;z-index:9991;display:grid;place-items:center;padding:12px}.panel{background:#f8f9fd;border:1px solid #dbe0ea;border-radius:14px;width:min(640px,100%);max-height:88dvh;display:flex;flex-direction:column;box-shadow:0 12px 40px #0003}.head{display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid #e0e4ec}.head strong{flex:1;font-size:15px}.body{padding:14px;overflow:auto;min-height:0}.row{display:flex;gap:7px;align-items:center;flex-wrap:wrap}.row input{flex:1;min-width:150px}.card{background:white;border:1px solid #dde2ec;border-radius:10px;padding:12px;margin:10px 0}.name{font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;flex:1}.small{color:#657087;font-size:12px;overflow-wrap:anywhere}.status{white-space:pre-wrap;overflow-wrap:anywhere;margin:8px 0;color:#44547b}input,select{border:1px solid #ccd3df;border-radius:7px;padding:8px;background:white;color:#263142;width:100%}pre{max-height:220px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;background:#eef1f7;padding:10px;font:11px/1.45 monospace}label{display:block;margin:8px 0}.hidden{display:none!important}h3{font-size:14px;margin:0 0 8px}hr{border:0;border-top:1px solid #e0e4ec;margin:14px 0}.danger{color:#a3443c}@media(max-width:420px){.body{padding:10px}.panel{max-height:92dvh}.head{padding:10px}.row button{padding:7px 8px}}
 </style><div class="veil hidden"><section class="panel" role="dialog" aria-modal="true" aria-label="GitHub \uD655\uC7A5 \uAD00\uB9AC"><div class="head"><strong>GitHub \uD655\uC7A5 \uAD00\uB9AC</strong><button class="close" aria-label="\uB2EB\uAE30">\u2715</button></div><div class="body"><div class="row"><input class="url" aria-label="GitHub \uC800\uC7A5\uC18C \uC8FC\uC18C" placeholder="https://github.com/owner/repo"><button class="find primary">\uD328\uD0A4\uC9C0 \uCC3E\uAE30</button></div><p class="small">\uACF5\uAC1C \uC800\uC7A5\uC18C \uC804\uC6A9 \xB7 \uB85C\uADF8\uC778 \uC694\uCCAD \uC5C6\uC74C \xB7 \uC218\uB3D9 \uD655\uC778</p><div class="status" role="status"></div><div class="preview"></div><hr><div class="row"><strong class="name">\uC124\uCE58\uB41C \uD655\uC7A5</strong><button class="refresh">\uBAA9\uB85D \uC0C8\uB85C\uACE0\uCE68</button><button class="all">\uC804\uCCB4 \uD655\uC778</button></div><div class="list"></div><p class="small">\uC124\uCE58\xB7\uC5C5\uB370\uC774\uD2B8 \uD6C4 \uB9C8\uB9AC\uB098\uB77C \uC124\uC815 \u2192 Addons \u2192 External Extensions\uC5D0\uC11C \uAC80\uD1A0 \uBC0F \uC2E4\uD589\uD558\uC138\uC694. \uC804\uCCB4 \uD398\uC774\uC9C0 \uD655\uC7A5\uC740 \uC801\uC6A9 \uD6C4 \uC0C8\uB85C\uACE0\uCE68\uC774 \uD544\uC694\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.</p></div></section></div>`;
    const q = (s) => shadow.querySelector(s), status = (t) => q(".status").textContent = t;
    let links = {}, extensions = [], busy = false, closed = false;
    const pending = /* @__PURE__ */ new Map();
    function el(tag, text, cls) {
      const n = document.createElement(tag);
      if (text != null) n.textContent = text;
      if (cls) n.className = cls;
      return n;
    }
    function button(text, fn) {
      const b = el("button", text);
      b.onclick = () => run(fn);
      return b;
    }
    async function run(fn) {
      if (busy || closed) return;
      busy = true;
      shadow.querySelectorAll("button:not(.close)").forEach((b) => b.disabled = true);
      try {
        await fn();
      } catch (e) {
        status(e.message || String(e));
      } finally {
        busy = false;
        shadow.querySelectorAll("button").forEach((b) => b.disabled = false);
      }
    }
    async function api(path = "", method = "GET", body) {
      if (closed) throw Error("\uAD00\uB9AC \uD655\uC7A5\uC774 \uC885\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
      if (!/^\/(?:[\w-]+(?:\/rollback)?)?$/.test(path) && path !== "") throw Error("\uC798\uBABB\uB41C \uB0B4\uBD80 \uC694\uCCAD");
      const headers = { "Content-Type": "application/json" };
      const secret = localStorage.getItem("marinara_admin_secret")?.trim();
      if (secret) headers["X-Admin-Secret"] = secret;
      if (method !== "GET") headers["x-marinara-csrf"] = "1";
      const r = await fetch("/api/personal-extensions" + path, { method, headers, credentials: "same-origin", cache: "no-store", body: body ? JSON.stringify(body) : void 0 });
      const data = await r.json().catch(() => null);
      if (!r.ok) {
        if (r.status === 403) throw Error("\uB9C8\uB9AC\uB098\uB77C \uAD00\uB9AC\uC790 \uC811\uADFC \uB610\uB294 \uC678\uBD80 \uD655\uC7A5 \uD5C8\uC6A9 \uC124\uC815\uC744 \uD655\uC778\uD558\uC138\uC694. GitHub \uB85C\uADF8\uC778\uC740 \uD544\uC694\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");
        throw Error(typeof data?.error === "string" ? data.error : "\uB9C8\uB9AC\uB098\uB77C \uC694\uCCAD \uC624\uB958 (" + r.status + ")");
      }
      return data;
    }
    async function save() {
      await host.storage.patch({ githubManagerLinks: links });
    }
    async function refresh() {
      extensions = await api();
      render();
    }
    function render() {
      const list = q(".list");
      list.replaceChildren();
      for (const ext of extensions) {
        if (ext.id === host.extension.id || ext.source === "professor_mari") continue;
        const card = el("div", null, "card"), row = el("div", null, "row");
        row.append(el("span", ext.name, "name"), el("span", (ext.version || "\uBC84\uC804 \uC5C6\uC74C") + " \xB7 " + (ext.enabled ? "\uC2E4\uD589 \uC911" : "\uBE44\uD65C\uC131"), "small"));
        card.append(row);
        const link = links[ext.id];
        if (link) card.append(el("div", link.repo + " / " + link.path, "small"));
        const actions = el("div", null, "row");
        actions.style.marginTop = "8px";
        actions.append(button(link ? "\uC8FC\uC18C \uBCC0\uACBD" : "GitHub \uC8FC\uC18C \uC5F0\uACB0", () => connectForm(ext)));
        if (link) {
          actions.append(button("\uC5C5\uB370\uC774\uD2B8 \uD655\uC778", () => check(ext)));
          actions.append(button("\uC5F0\uACB0 \uD574\uC81C", async () => {
            delete links[ext.id];
            pending.delete(ext.id);
            await save();
            render();
          }));
        }
        if (pending.has(ext.id)) actions.append(button("\uC5C5\uB370\uC774\uD2B8 \uBCF4\uAE30", () => preview(pending.get(ext.id), ext)));
        const rev2 = (ext.revisions || [])[0];
        if (rev2) actions.append(button("\uC774\uC804 \uCF54\uB4DC \uBCF5\uAD6C", () => reviewRollback(ext, rev2)));
        card.append(actions);
        if (link?.message) card.append(el("div", link.message, "status"));
        list.append(card);
      }
      if (!list.childNodes.length) list.append(el("p", "\uC5F0\uACB0\uD560 \uC678\uBD80 \uD655\uC7A5\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.", "small"));
    }
    function connectForm(ext) {
      q(".preview").replaceChildren();
      const box = el("div", null, "card");
      box.append(el("h3", ext.name + " \xB7 GitHub \uC5F0\uACB0"));
      const input = el("input");
      input.placeholder = "https://github.com/owner/repo";
      input.value = links[ext.id] ? "https://github.com/" + links[ext.id].repo : "";
      input.setAttribute("aria-label", "\uC5F0\uACB0\uD560 \uC800\uC7A5\uC18C \uC8FC\uC18C");
      box.append(input, button("\uD328\uD0A4\uC9C0 \uCC3E\uAE30", () => find(input.value, ext, true)));
      q(".preview").append(box);
    }
    async function find(url, ext = null, linkOnly = false) {
      status("\uACF5\uAC1C \uC800\uC7A5\uC18C\uC758 \uD328\uD0A4\uC9C0\uB97C \uCC3E\uB294 \uC911\u2026");
      const snap = await discover(parseRepo(url));
      if (closed) return;
      const box = el("div", null, "card");
      box.append(el("h3", "\uC124\uCE58 \uB300\uC0C1 \uC120\uD0DD"));
      const select = el("select");
      select.setAttribute("aria-label", "\uD655\uC7A5 \uD328\uD0A4\uC9C0");
      snap.choices.forEach((c, i2) => {
        const o = el("option", c.label);
        o.value = i2;
        select.append(o);
      });
      box.append(select, button("\uB0B4\uC6A9 \uD655\uC778", async () => {
        status("\uD328\uD0A4\uC9C0\uB97C \uAC80\uC99D\uD558\uB294 \uC911\u2026");
        const p = await loadPackage(snap, snap.choices[Number(select.value)]);
        await preview(p, ext, linkOnly);
      }));
      q(".preview").replaceChildren(box);
      status("\uD328\uD0A4\uC9C0\uB97C \uC120\uD0DD\uD558\uC138\uC694. \uB9B4\uB9AC\uC2A4 \uB2E4\uC6B4\uB85C\uB4DC\uAC00 \uBE0C\uB77C\uC6B0\uC800\uC5D0\uC11C \uCC28\uB2E8\uB418\uBA74 \uC800\uC7A5\uC18C\uC758 \uB9E4\uB2C8\uD398\uC2A4\uD2B8\uB97C \uC120\uD0DD\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.");
    }
    function metadata(p) {
      return { repo: p.repo, mode: p.choice.mode, path: p.choice.path, sha: p.sha, tag: p.choice.tag || null, installedHash: p.hash, checkedAt: (/* @__PURE__ */ new Date()).toISOString(), message: "\uC5F0\uACB0\uB428" };
    }
    async function preview(p, ext = null, linkOnly = false) {
      const box = el("div", null, "card");
      box.append(el("h3", p.payload.name), el("p", (ext?.version || "\uBBF8\uC124\uCE58") + " \u2192 " + (p.payload.version || "\uBC84\uC804 \uC5C6\uC74C"), "small"), el("p", p.repo + " \xB7 " + (p.choice.tag || p.sha.slice(0, 10)), "small"), el("p", "\uC694\uCCAD \uAD8C\uD55C: " + (p.payload.capabilities.join(", ") || "\uC0CC\uB4DC\uBC15\uC2A4 \uAE30\uBCF8 \uAD8C\uD55C"), "small"));
      if (p.payload.description) box.append(el("p", p.payload.description));
      if (p.choice.notes) box.append(el("pre", p.choice.notes));
      if (ext && links[ext.id]?.installedHash && links[ext.id].installedHash !== ext.contentHash) box.append(el("p", "\uB85C\uCEEC \uCF54\uB4DC\uAC00 \uC124\uCE58 \uB2F9\uC2DC\uC640 \uB2E4\uB985\uB2C8\uB2E4. \uC5C5\uB370\uC774\uD2B8\uD558\uBA74 \uD604\uC7AC \uC218\uC815 \uC0AC\uD56D\uC744 \uB36E\uC5B4\uC501\uB2C8\uB2E4. \uC774\uC804 \uCF54\uB4DC\uB294 \uBCF8\uCCB4 \uB9AC\uBE44\uC804\uC5D0 \uBCF4\uAD00\uB429\uB2C8\uB2E4.", "danger"));
      const details = el("details");
      details.append(el("summary", "\uB2E4\uC6B4\uB85C\uB4DC\uD55C \uCF54\uB4DC \uBCF4\uAE30"), el("pre", JSON.stringify(p.payload, null, 2)));
      box.append(details);
      if (linkOnly) {
        if (ext.name !== p.payload.name || ext.runtime !== p.payload.runtime) throw Error("\uC120\uD0DD\uD55C \uD328\uD0A4\uC9C0\uC758 \uC774\uB984 \uB610\uB294 \uC2E4\uD589 \uBC29\uC2DD\uC774 \uAE30\uC874 \uD655\uC7A5\uACFC \uB2E4\uB985\uB2C8\uB2E4.");
        if (ext.contentHash !== p.hash) box.append(el("p", "\uD604\uC7AC \uCF54\uB4DC\uC640 \uC6D0\uACA9 \uCF54\uB4DC\uAC00 \uB2E4\uB985\uB2C8\uB2E4. \uC5F0\uACB0\uB9CC \uD558\uBA70, \uC2E4\uC81C \uC124\uCE58\uBCF8\uC73C\uB85C \uAE30\uB85D\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.", "small"));
        box.append(button("\uC774 \uC800\uC7A5\uC18C \uC5F0\uACB0", async () => {
          links[ext.id] = { ...metadata(p), installedHash: ext.contentHash, message: "\uC5F0\uACB0\uB428 \xB7 \uC5C5\uB370\uC774\uD2B8 \uD655\uC778\uC744 \uB20C\uB7EC \uBE44\uAD50\uD558\uC138\uC694." };
          await save();
          q(".preview").replaceChildren();
          render();
          status("\uC8FC\uC18C\uB97C \uC5F0\uACB0\uD588\uC2B5\uB2C8\uB2E4. \uAE30\uC874 \uCF54\uB4DC\uB294 \uBCC0\uACBD\uD558\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.");
        }));
      } else box.append(button(ext ? "\uC5C5\uB370\uC774\uD2B8 \uC124\uCE58" : "\uC124\uCE58", () => apply(p, ext)));
      box.append(button("\uB2EB\uAE30", () => q(".preview").replaceChildren()));
      q(".preview").replaceChildren(box);
      status("\uD328\uD0A4\uC9C0\uB97C \uD655\uC778\uD55C \uD6C4 \uC124\uCE58\uD558\uC138\uC694. \uC2E4\uD589 \uC2B9\uC778\uC740 \uB9C8\uB9AC\uB098\uB77C \uAE30\uBCF8 \uD654\uBA74\uC5D0\uC11C \uC9C4\uD589\uD569\uB2C8\uB2E4.");
    }
    async function check(ext) {
      const link = links[ext.id];
      status(ext.name + " \uC5C5\uB370\uC774\uD2B8 \uD655\uC778 \uC911\u2026");
      try {
        const snap = await discover(link.repo);
        const choice = snap.choices.find((c) => c.mode === link.mode && c.path === link.path);
        if (!choice) throw Error("\uC5F0\uACB0\uB41C \uD328\uD0A4\uC9C0\uAC00 \uC5C6\uC5B4 \uD655\uC778\uC744 \uAC74\uB108\uB701\uB2C8\uB2E4. \uBC30\uD3EC \uACBD\uB85C\uAC00 \uBC14\uB00C\uC5C8\uB2E4\uBA74 \uC8FC\uC18C\uB97C \uB2E4\uC2DC \uC5F0\uACB0\uD558\uC138\uC694.");
        const p = await loadPackage(snap, choice);
        const latest = (await api()).find((x2) => x2.id === ext.id);
        if (!latest) throw Error("\uD655\uC7A5\uC774 \uC0AD\uC81C\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
        link.checkedAt = (/* @__PURE__ */ new Date()).toISOString();
        if (p.hash === latest.contentHash) {
          pending.delete(ext.id);
          link.message = "\uCD5C\uC2E0 \uCF54\uB4DC \xB7 " + (/* @__PURE__ */ new Date()).toLocaleString();
        } else {
          pending.set(ext.id, p);
          link.message = "\uBCC0\uACBD \uBC1C\uACAC: " + (latest.version || "?") + " \u2192 " + (p.payload.version || "?");
        }
        await save();
        render();
        status(ext.name + ": " + link.message);
      } catch (e) {
        pending.delete(ext.id);
        link.message = e.message;
        await save();
        render();
        throw e;
      }
    }
    async function apply(p, original) {
      if (original?.id === host.extension.id) throw Error("\uC774 \uAD00\uB9AC \uD655\uC7A5 \uC790\uCCB4\uB294 \uAE30\uBCF8 \uC784\uD3EC\uD2B8 \uAE30\uB2A5\uC73C\uB85C \uC5C5\uB370\uC774\uD2B8\uD558\uC138\uC694.");
      const current = await api();
      let updated;
      if (original) {
        const fresh = current.find((x2) => x2.id === original.id);
        if (!fresh) throw Error("\uD655\uC7A5\uC774 \uC0AD\uC81C\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
        if (fresh.contentHash !== original.contentHash) throw Error("\uAC80\uD1A0 \uC911 \uAE30\uC874 \uCF54\uB4DC\uAC00 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uBAA9\uB85D\uACFC \uC5C5\uB370\uC774\uD2B8\uB97C \uB2E4\uC2DC \uD655\uC778\uD558\uC138\uC694.");
        if (fresh.name !== p.payload.name || fresh.runtime !== p.payload.runtime) throw Error("\uC774\uB984\uC774\uB098 \uC2E4\uD589 \uBC29\uC2DD\uC774 \uBC14\uB010 \uD328\uD0A4\uC9C0\uB294 \uC790\uB3D9 \uAD50\uCCB4\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.");
        if (p.hash === fresh.contentHash) throw Error("\uC774\uBBF8 \uAC19\uC740 \uCF54\uB4DC\uC785\uB2C8\uB2E4.");
        await api("/" + fresh.id, "PATCH", { enabled: false });
        try {
          updated = await api("/" + fresh.id, "PATCH", p.payload);
        } catch (e) {
          throw Error("\uCF54\uB4DC \uC801\uC6A9\uC744 \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uD655\uC7A5\uC740 \uBE44\uD65C\uC131 \uC0C1\uD0DC\uC785\uB2C8\uB2E4. \uBAA9\uB85D\uC744 \uC0C8\uB85C\uACE0\uCE68\uD574 \uBC84\uC804\uACFC \uB9AC\uBE44\uC804\uC744 \uD655\uC778\uD558\uC138\uC694. " + e.message);
        }
      } else {
        if (current.some((x2) => x2.name.toLowerCase() === p.payload.name.toLowerCase())) throw Error("\uAC19\uC740 \uC774\uB984\uC758 \uD655\uC7A5\uC774 \uC788\uC2B5\uB2C8\uB2E4. \uD574\uB2F9 \uD56D\uBAA9\uC5D0 GitHub \uC8FC\uC18C\uB97C \uC5F0\uACB0\uD558\uC138\uC694.");
        updated = await api("", "POST", p.payload);
      }
      if (updated.enabled || updated.contentHash !== p.hash) throw Error("\uC124\uCE58 \uACB0\uACFC\uAC00 \uC608\uC0C1\uACFC \uB2E4\uB985\uB2C8\uB2E4. \uAE30\uBCF8 \uD655\uC7A5 \uD654\uBA74\uC5D0\uC11C \uD655\uC778\uD558\uC138\uC694.");
      links[updated.id] = metadata(p);
      pending.delete(updated.id);
      await save();
      q(".preview").replaceChildren();
      await refresh();
      if (original) {
        const reloadBox = el("div", null, "card");
        reloadBox.append(el("p", "\uC5C5\uB370\uC774\uD2B8\uAC00 \uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC774\uC804 \uBC84\uC804\uC758 \uC2E4\uD589\uC744 \uC644\uC804\uD788 \uC885\uB8CC\uD558\uACE0 \uAE30\uBCF8 \uD655\uC7A5 \uBAA9\uB85D\uC744 \uAC31\uC2E0\uD558\uB824\uBA74 \uC0C8\uB85C\uACE0\uCE68\uD558\uC138\uC694."), button("\uD398\uC774\uC9C0 \uC0C8\uB85C\uACE0\uCE68", () => location.reload()));
        q(".preview").replaceChildren(reloadBox);
      }
      status("\uC124\uCE58 \uC644\uB8CC \xB7 \uBE44\uD65C\uC131 \uC0C1\uD0DC\uC785\uB2C8\uB2E4. \uB9C8\uB9AC\uB098\uB77C \uAE30\uBCF8 \uD655\uC7A5 \uD654\uBA74\uC5D0\uC11C \uC0C8 \uCF54\uB4DC\uB97C \uAC80\uD1A0\uD558\uACE0 \uC2E4\uD589\uD558\uC138\uC694. \uD544\uC694\uD558\uBA74 \uD398\uC774\uC9C0\uB97C \uC0C8\uB85C\uACE0\uCE68\uD558\uC138\uC694.");
    }
    function reviewRollback(ext, rev2) {
      const box = el("div", null, "card");
      box.append(el("h3", "\uC774\uC804 \uCF54\uB4DC \uBCF5\uAD6C"), el("p", ext.name + " \u2192 " + (rev2.version || "\uC774\uC804 \uBC84\uC804")), el("p", "\uD655\uC7A5 \uB370\uC774\uD130\uB294 \uB418\uB3CC\uB9AC\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uBCF5\uAD6C\uD55C \uCF54\uB4DC\uB3C4 \uAE30\uBCF8 \uD654\uBA74\uC5D0\uC11C \uB2E4\uC2DC \uC2B9\uC778\uD574\uC57C \uD569\uB2C8\uB2E4.", "small"), button("\uBCF5\uAD6C", async () => {
        await api("/" + ext.id + "/rollback", "POST", { contentHash: rev2.contentHash });
        pending.delete(ext.id);
        await refresh();
        q(".preview").replaceChildren();
        status("\uC774\uC804 \uCF54\uB4DC\uB97C \uBCF5\uAD6C\uD588\uC2B5\uB2C8\uB2E4. \uAE30\uBCF8 \uD655\uC7A5 \uD654\uBA74\uC5D0\uC11C \uAC80\uD1A0 \uD6C4 \uC2E4\uD589\uD558\uC138\uC694.");
      }), button("\uCDE8\uC18C", () => q(".preview").replaceChildren()));
      q(".preview").replaceChildren(box);
    }
    const launcher = attachSettingsButton(() => {
      q(".veil").classList.remove("hidden");
      q(".close").focus();
      run(async () => {
        const data = await host.storage.get();
        links = data.githubManagerLinks || {};
        await refresh();
      });
    });
    q(".close").onclick = () => {
      q(".veil").classList.add("hidden");
      launcher.focus();
    };
    q(".find").onclick = () => run(() => find(q(".url").value));
    q(".refresh").onclick = () => run(refresh);
    q(".all").onclick = () => run(async () => {
      await refresh();
      let failed = 0;
      for (const ext of extensions) {
        if (!links[ext.id] || ext.id === host.extension.id) continue;
        try {
          await check(ext);
        } catch {
          failed++;
        }
      }
      status("\uC804\uCCB4 \uD655\uC778 \uC644\uB8CC" + (failed ? " \xB7 " + failed + "\uAC1C \uAC74\uB108\uB700" : ""));
    });
    shadow.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        q(".veil").classList.add("hidden");
        launcher.focus();
      }
      if (e.key === "Tab" && !q(".veil").classList.contains("hidden")) {
        const nodes = [...q(".panel").querySelectorAll("button,input,select,summary")].filter((n) => !n.disabled && n.getClientRects().length);
        const first = nodes[0], last = nodes.at(-1);
        if (e.shiftKey && shadow.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && shadow.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    });
    host.onCleanup(() => {
      closed = true;
      launcher.destroy();
      mount.remove();
    });
  })().catch((e) => marinara.log.error("GitHub extension manager failed", e));
})();
