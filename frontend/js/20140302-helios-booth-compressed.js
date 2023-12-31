(function () {
  var initializing = false,
    fnTest = /xyz/.test(function () {
      xyz;
    })
      ? /\b_super\b/
      : /.*/;
  this.Class = function () {};
  Class.extend = function (prop) {
    var _super = this.prototype;
    initializing = true;
    var prototype = new this();
    initializing = false;
    for (var name in prop) {
      prototype[name] =
        typeof prop[name] == "function" &&
        typeof _super[name] == "function" &&
        fnTest.test(prop[name])
          ? (function (name, fn) {
              return function () {
                var tmp = this._super;
                this._super = _super[name];
                var ret = fn.apply(this, arguments);
                this._super = tmp;
                return ret;
              };
            })(name, prop[name])
          : prop[name];
    }
    function Class() {
      if (!initializing && this.init) this.init.apply(this, arguments);
    }
    Class.prototype = prototype;
    Class.constructor = Class;
    Class.extend = arguments.callee;
    return Class;
  };
})();
BigIntDummy = Class.extend({
  init: function (value, radix) {
    if (radix != 10) throw "in dummy, only radix=10, here radix=" + radix;
    this.value = value;
  },
  toString: function () {
    return this.value;
  },
  toJSONObject: function () {
    return this.value;
  },
  add: function (other) {
    throw "dummy, no add!";
  },
  bitLength: function () {
    throw "dummy, nobitlength!";
  },
  mod: function (modulus) {
    throw "dummy, no mod!";
  },
  equals: function (other) {
    throw "dummy, no equals!";
  },
  modPow: function (exp, modulus) {
    throw "dummy, no modpow!";
  },
  negate: function () {
    throw "dummy, no negate!";
  },
  multiply: function (other) {
    throw "dummy, no multiply!";
  },
  modInverse: function (modulus) {
    throw "dummy, no modInverse";
  },
});
BigIntDummy.use_applet = false;
BigIntDummy.is_dummy = true;
BigIntDummy.in_browser = false;
BigIntDummy.fromJSONObject = function (s) {
  return new BigIntDummy(s, 10);
};
BigIntDummy.fromInt = function (i) {
  return BigIntDummy.fromJSONObject("" + i);
};
BigIntDummy.ZERO = new BigIntDummy("0", 10);
BigIntDummy.ONE = new BigIntDummy("1", 10);
BigIntDummy.TWO = new BigIntDummy("2", 10);
BigIntDummy.FORTY_TWO = new BigIntDummy("42", 10);
BigIntDummy.ready_p = true;
BigIntDummy.setup = function (callback, fail_callback) {
  callback();
};
var dbits;
var canary = 0xdeadbeefcafe;
var j_lm = (canary & 16777215) == 15715070;
function BigInteger(a, b, c) {
  this.arr = new Array();
  if (a != null)
    if ("number" == typeof a) this.fromNumber(a, b, c);
    else if (b == null && "string" != typeof a) this.fromString(a, 256);
    else this.fromString(a, b);
}
function nbi() {
  return new BigInteger(null);
}
function am1(i, x, w, j, c, n) {
  while (--n >= 0) {
    var v = x * this.arr[i++] + w.arr[j] + c;
    c = Math.floor(v / 67108864);
    w.arr[j++] = v & 67108863;
  }
  return c;
}
function am2(i, x, w, j, c, n) {
  var xl = x & 32767,
    xh = x >> 15;
  while (--n >= 0) {
    var l = this.arr[i] & 32767;
    var h = this.arr[i++] >> 15;
    var m = xh * l + h * xl;
    l = xl * l + ((m & 32767) << 15) + w.arr[j] + (c & 1073741823);
    c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
    w.arr[j++] = l & 1073741823;
  }
  return c;
}
function am3(i, x, w, j, c, n) {
  var xl = x & 16383,
    xh = x >> 14;
  while (--n >= 0) {
    var l = this.arr[i] & 16383;
    var h = this.arr[i++] >> 14;
    var m = xh * l + h * xl;
    l = xl * l + ((m & 16383) << 14) + w.arr[j] + c;
    c = (l >> 28) + (m >> 14) + xh * h;
    w.arr[j++] = l & 268435455;
  }
  return c;
}
if (j_lm && navigator.appName == "Microsoft Internet Explorer") {
  BigInteger.prototype.am = am2;
  dbits = 30;
} else if (j_lm && navigator.appName != "Netscape") {
  BigInteger.prototype.am = am1;
  dbits = 26;
} else {
  BigInteger.prototype.am = am3;
  dbits = 28;
}
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = (1 << dbits) - 1;
BigInteger.prototype.DV = 1 << dbits;
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr, vv;
rr = "0".charCodeAt(0);
for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
function int2char(n) {
  return BI_RM.charAt(n);
}
function intAt(s, i) {
  var c = BI_RC[s.charCodeAt(i)];
  return c == null ? -1 : c;
}
function bnpCopyTo(r) {
  for (var i = this.t - 1; i >= 0; --i) r.arr[i] = this.arr[i];
  r.t = this.t;
  r.s = this.s;
}
function bnpFromInt(x) {
  this.t = 1;
  this.s = x < 0 ? -1 : 0;
  if (x > 0) this.arr[0] = x;
  else if (x < -1) this.arr[0] = x + DV;
  else this.t = 0;
}
function nbv(i) {
  var r = nbi();
  r.fromInt(i);
  return r;
}
function bnpFromString(s, b) {
  var k;
  if (b == 16) k = 4;
  else if (b == 8) k = 3;
  else if (b == 256) k = 8;
  else if (b == 2) k = 1;
  else if (b == 32) k = 5;
  else if (b == 4) k = 2;
  else {
    this.fromRadix(s, b);
    return;
  }
  this.t = 0;
  this.s = 0;
  var i = s.length,
    mi = false,
    sh = 0;
  while (--i >= 0) {
    var x = k == 8 ? s[i] & 255 : intAt(s, i);
    if (x < 0) {
      if (s.charAt(i) == "-") mi = true;
      continue;
    }
    mi = false;
    if (sh == 0) this.arr[this.t++] = x;
    else if (sh + k > this.DB) {
      this.arr[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
      this.arr[this.t++] = x >> (this.DB - sh);
    } else this.arr[this.t - 1] |= x << sh;
    sh += k;
    if (sh >= this.DB) sh -= this.DB;
  }
  if (k == 8 && (s[0] & 128) != 0) {
    this.s = -1;
    if (sh > 0) this.arr[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh;
  }
  this.clamp();
  if (mi) BigInteger.ZERO.subTo(this, this);
}
function bnpClamp() {
  var c = this.s & this.DM;
  while (this.t > 0 && this.arr[this.t - 1] == c) --this.t;
}
function bnToString(b) {
  if (this.s < 0) return "-" + this.negate().toString(b);
  var k;
  if (b == 16) k = 4;
  else if (b == 8) k = 3;
  else if (b == 2) k = 1;
  else if (b == 32) k = 5;
  else if (b == 4) k = 2;
  else return this.toRadix(b);
  var km = (1 << k) - 1,
    d,
    m = false,
    r = "",
    i = this.t;
  var p = this.DB - ((i * this.DB) % k);
  if (i-- > 0) {
    if (p < this.DB && (d = this.arr[i] >> p) > 0) {
      m = true;
      r = int2char(d);
    }
    while (i >= 0) {
      if (p < k) {
        d = (this.arr[i] & ((1 << p) - 1)) << (k - p);
        d |= this.arr[--i] >> (p += this.DB - k);
      } else {
        d = (this.arr[i] >> (p -= k)) & km;
        if (p <= 0) {
          p += this.DB;
          --i;
        }
      }
      if (d > 0) m = true;
      if (m) r += int2char(d);
    }
  }
  return m ? r : "0";
}
function bnNegate() {
  var r = nbi();
  BigInteger.ZERO.subTo(this, r);
  return r;
}
function bnAbs() {
  return this.s < 0 ? this.negate() : this;
}
function bnCompareTo(a) {
  var r = this.s - a.s;
  if (r != 0) return r;
  var i = this.t;
  r = i - a.t;
  if (r != 0) return r;
  while (--i >= 0) if ((r = this.arr[i] - a.arr[i]) != 0) return r;
  return 0;
}
function nbits(x) {
  var r = 1,
    t;
  if ((t = x >>> 16) != 0) {
    x = t;
    r += 16;
  }
  if ((t = x >> 8) != 0) {
    x = t;
    r += 8;
  }
  if ((t = x >> 4) != 0) {
    x = t;
    r += 4;
  }
  if ((t = x >> 2) != 0) {
    x = t;
    r += 2;
  }
  if ((t = x >> 1) != 0) {
    x = t;
    r += 1;
  }
  return r;
}
function bnBitLength() {
  if (this.t <= 0) return 0;
  return (
    this.DB * (this.t - 1) + nbits(this.arr[this.t - 1] ^ (this.s & this.DM))
  );
}
function bnpDLShiftTo(n, r) {
  var i;
  for (i = this.t - 1; i >= 0; --i) r.arr[i + n] = this.arr[i];
  for (i = n - 1; i >= 0; --i) r.arr[i] = 0;
  r.t = this.t + n;
  r.s = this.s;
}
function bnpDRShiftTo(n, r) {
  for (var i = n; i < this.t; ++i) r.arr[i - n] = this.arr[i];
  r.t = Math.max(this.t - n, 0);
  r.s = this.s;
}
function bnpLShiftTo(n, r) {
  var bs = n % this.DB;
  var cbs = this.DB - bs;
  var bm = (1 << cbs) - 1;
  var ds = Math.floor(n / this.DB),
    c = (this.s << bs) & this.DM,
    i;
  for (i = this.t - 1; i >= 0; --i) {
    r.arr[i + ds + 1] = (this.arr[i] >> cbs) | c;
    c = (this.arr[i] & bm) << bs;
  }
  for (i = ds - 1; i >= 0; --i) r.arr[i] = 0;
  r.arr[ds] = c;
  r.t = this.t + ds + 1;
  r.s = this.s;
  r.clamp();
}
function bnpRShiftTo(n, r) {
  r.s = this.s;
  var ds = Math.floor(n / this.DB);
  if (ds >= this.t) {
    r.t = 0;
    return;
  }
  var bs = n % this.DB;
  var cbs = this.DB - bs;
  var bm = (1 << bs) - 1;
  r.arr[0] = this.arr[ds] >> bs;
  for (var i = ds + 1; i < this.t; ++i) {
    r.arr[i - ds - 1] |= (this.arr[i] & bm) << cbs;
    r.arr[i - ds] = this.arr[i] >> bs;
  }
  if (bs > 0) r.arr[this.t - ds - 1] |= (this.s & bm) << cbs;
  r.t = this.t - ds;
  r.clamp();
}
function bnpSubTo(a, r) {
  var i = 0,
    c = 0,
    m = Math.min(a.t, this.t);
  while (i < m) {
    c += this.arr[i] - a.arr[i];
    r.arr[i++] = c & this.DM;
    c >>= this.DB;
  }
  if (a.t < this.t) {
    c -= a.s;
    while (i < this.t) {
      c += this.arr[i];
      r.arr[i++] = c & this.DM;
      c >>= this.DB;
    }
    c += this.s;
  } else {
    c += this.s;
    while (i < a.t) {
      c -= a.arr[i];
      r.arr[i++] = c & this.DM;
      c >>= this.DB;
    }
    c -= a.s;
  }
  r.s = c < 0 ? -1 : 0;
  if (c < -1) r.arr[i++] = this.DV + c;
  else if (c > 0) r.arr[i++] = c;
  r.t = i;
  r.clamp();
}
function bnpMultiplyTo(a, r) {
  var x = this.abs(),
    y = a.abs();
  var i = x.t;
  r.t = i + y.t;
  while (--i >= 0) r.arr[i] = 0;
  for (i = 0; i < y.t; ++i) r.arr[i + x.t] = x.am(0, y.arr[i], r, i, 0, x.t);
  r.s = 0;
  r.clamp();
  if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
}
function bnpSquareTo(r) {
  var x = this.abs();
  var i = (r.t = 2 * x.t);
  while (--i >= 0) r.arr[i] = 0;
  for (i = 0; i < x.t - 1; ++i) {
    var c = x.am(i, x.arr[i], r, 2 * i, 0, 1);
    if (
      (r.arr[i + x.t] += x.am(
        i + 1,
        2 * x.arr[i],
        r,
        2 * i + 1,
        c,
        x.t - i - 1
      )) >= x.DV
    ) {
      r.arr[i + x.t] -= x.DV;
      r.arr[i + x.t + 1] = 1;
    }
  }
  if (r.t > 0) r.arr[r.t - 1] += x.am(i, x.arr[i], r, 2 * i, 0, 1);
  r.s = 0;
  r.clamp();
}
function bnpDivRemTo(m, q, r) {
  var pm = m.abs();
  if (pm.t <= 0) return;
  var pt = this.abs();
  if (pt.t < pm.t) {
    if (q != null) q.fromInt(0);
    if (r != null) this.copyTo(r);
    return;
  }
  if (r == null) r = nbi();
  var y = nbi(),
    ts = this.s,
    ms = m.s;
  var nsh = this.DB - nbits(pm.arr[pm.t - 1]);
  if (nsh > 0) {
    pm.lShiftTo(nsh, y);
    pt.lShiftTo(nsh, r);
  } else {
    pm.copyTo(y);
    pt.copyTo(r);
  }
  var ys = y.t;
  var y0 = y.arr[ys - 1];
  if (y0 == 0) return;
  var yt = y0 * (1 << this.F1) + (ys > 1 ? y.arr[ys - 2] >> this.F2 : 0);
  var d1 = this.FV / yt,
    d2 = (1 << this.F1) / yt,
    e = 1 << this.F2;
  var i = r.t,
    j = i - ys,
    t = q == null ? nbi() : q;
  y.dlShiftTo(j, t);
  if (r.compareTo(t) >= 0) {
    r.arr[r.t++] = 1;
    r.subTo(t, r);
  }
  BigInteger.ONE.dlShiftTo(ys, t);
  t.subTo(y, y);
  while (y.t < ys) y.arr[y.t++] = 0;
  while (--j >= 0) {
    var qd =
      r.arr[--i] == y0
        ? this.DM
        : Math.floor(r.arr[i] * d1 + (r.arr[i - 1] + e) * d2);
    if ((r.arr[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
      y.dlShiftTo(j, t);
      r.subTo(t, r);
      while (r.arr[i] < --qd) r.subTo(t, r);
    }
  }
  if (q != null) {
    r.drShiftTo(ys, q);
    if (ts != ms) BigInteger.ZERO.subTo(q, q);
  }
  r.t = ys;
  r.clamp();
  if (nsh > 0) r.rShiftTo(nsh, r);
  if (ts < 0) BigInteger.ZERO.subTo(r, r);
}
function bnMod(a) {
  var r = nbi();
  this.abs().divRemTo(a, null, r);
  if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
  return r;
}
function Classic(m) {
  this.m = m;
}
function cConvert(x) {
  if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
  else return x;
}
function cRevert(x) {
  return x;
}
function cReduce(x) {
  x.divRemTo(this.m, null, x);
}
function cMulTo(x, y, r) {
  x.multiplyTo(y, r);
  this.reduce(r);
}
function cSqrTo(x, r) {
  x.squareTo(r);
  this.reduce(r);
}
Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;
function bnpInvDigit() {
  if (this.t < 1) return 0;
  var x = this.arr[0];
  if ((x & 1) == 0) return 0;
  var y = x & 3;
  y = (y * (2 - (x & 15) * y)) & 15;
  y = (y * (2 - (x & 255) * y)) & 255;
  y = (y * (2 - (((x & 65535) * y) & 65535))) & 65535;
  y = (y * (2 - ((x * y) % this.DV))) % this.DV;
  return y > 0 ? this.DV - y : -y;
}
function Montgomery(m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp & 32767;
  this.mph = this.mp >> 15;
  this.um = (1 << (m.DB - 15)) - 1;
  this.mt2 = 2 * m.t;
}
function montConvert(x) {
  var r = nbi();
  x.abs().dlShiftTo(this.m.t, r);
  r.divRemTo(this.m, null, r);
  if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
  return r;
}
function montRevert(x) {
  var r = nbi();
  x.copyTo(r);
  this.reduce(r);
  return r;
}
function montReduce(x) {
  while (x.t <= this.mt2) x.arr[x.t++] = 0;
  for (var i = 0; i < this.m.t; ++i) {
    var j = x.arr[i] & 32767;
    var u0 =
      (j * this.mpl +
        (((j * this.mph + (x.arr[i] >> 15) * this.mpl) & this.um) << 15)) &
      x.DM;
    j = i + this.m.t;
    x.arr[j] += this.m.am(0, u0, x, i, 0, this.m.t);
    while (x.arr[j] >= x.DV) {
      x.arr[j] -= x.DV;
      x.arr[++j]++;
    }
  }
  x.clamp();
  x.drShiftTo(this.m.t, x);
  if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
}
function montSqrTo(x, r) {
  x.squareTo(r);
  this.reduce(r);
}
function montMulTo(x, y, r) {
  x.multiplyTo(y, r);
  this.reduce(r);
}
Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;
function bnpIsEven() {
  return (this.t > 0 ? this.arr[0] & 1 : this.s) == 0;
}
function bnpExp(e, z) {
  if (e > 4294967295 || e < 1) return BigInteger.ONE;
  var r = nbi(),
    r2 = nbi(),
    g = z.convert(this),
    i = nbits(e) - 1;
  g.copyTo(r);
  while (--i >= 0) {
    z.sqrTo(r, r2);
    if ((e & (1 << i)) > 0) z.mulTo(r2, g, r);
    else {
      var t = r;
      r = r2;
      r2 = t;
    }
  }
  return z.revert(r);
}
function bnModPowInt(e, m) {
  var z;
  if (e < 256 || m.isEven()) z = new Classic(m);
  else z = new Montgomery(m);
  return this.exp(e, z);
}
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);
function bnClone() {
  var r = nbi();
  this.copyTo(r);
  return r;
}
function bnIntValue() {
  if (this.s < 0) {
    if (this.t == 1) return this.arr[0] - this.DV;
    else if (this.t == 0) return -1;
  } else if (this.t == 1) return this.arr[0];
  else if (this.t == 0) return 0;
  return ((this.arr[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this.arr[0];
}
function bnByteValue() {
  return this.t == 0 ? this.s : (this.arr[0] << 24) >> 24;
}
function bnShortValue() {
  return this.t == 0 ? this.s : (this.arr[0] << 16) >> 16;
}
function bnpChunkSize(r) {
  return Math.floor((Math.LN2 * this.DB) / Math.log(r));
}
function bnSigNum() {
  if (this.s < 0) return -1;
  else if (this.t <= 0 || (this.t == 1 && this.arr[0] <= 0)) return 0;
  else return 1;
}
function bnpToRadix(b) {
  if (b == null) b = 10;
  if (this.signum() == 0 || b < 2 || b > 36) return "0";
  var cs = this.chunkSize(b);
  var a = Math.pow(b, cs);
  var d = nbv(a),
    y = nbi(),
    z = nbi(),
    r = "";
  this.divRemTo(d, y, z);
  while (y.signum() > 0) {
    r = (a + z.intValue()).toString(b).substr(1) + r;
    y.divRemTo(d, y, z);
  }
  return z.intValue().toString(b) + r;
}
function bnpFromRadix(s, b) {
  this.fromInt(0);
  if (b == null) b = 10;
  var cs = this.chunkSize(b);
  var d = Math.pow(b, cs),
    mi = false,
    j = 0,
    w = 0;
  for (var i = 0; i < s.length; ++i) {
    var x = intAt(s, i);
    if (x < 0) {
      if (s.charAt(i) == "-" && this.signum() == 0) mi = true;
      continue;
    }
    w = b * w + x;
    if (++j >= cs) {
      this.dMultiply(d);
      this.dAddOffset(w, 0);
      j = 0;
      w = 0;
    }
  }
  if (j > 0) {
    this.dMultiply(Math.pow(b, j));
    this.dAddOffset(w, 0);
  }
  if (mi) BigInteger.ZERO.subTo(this, this);
}
function bnpFromNumber(a, b, c) {
  if ("number" == typeof b) {
    if (a < 2) this.fromInt(1);
    else {
      this.fromNumber(a, c);
      if (!this.testBit(a - 1))
        this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
      if (this.isEven()) this.dAddOffset(1, 0);
      while (!this.isProbablePrime(b)) {
        this.dAddOffset(2, 0);
        if (this.bitLength() > a)
          this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
      }
    }
  } else {
    var x = new Array(),
      t = a & 7;
    x.length = (a >> 3) + 1;
    b.nextBytes(x);
    if (t > 0) x.arr[0] &= (1 << t) - 1;
    else x.arr[0] = 0;
    this.fromString(x, 256);
  }
}
function bnToByteArray() {
  var i = this.t,
    r = new Array();
  r.arr[0] = this.s;
  var p = this.DB - ((i * this.DB) % 8),
    d,
    k = 0;
  if (i-- > 0) {
    if (p < this.DB && (d = this.arr[i] >> p) != (this.s & this.DM) >> p)
      r.arr[k++] = d | (this.s << (this.DB - p));
    while (i >= 0) {
      if (p < 8) {
        d = (this.arr[i] & ((1 << p) - 1)) << (8 - p);
        d |= this.arr[--i] >> (p += this.DB - 8);
      } else {
        d = (this.arr[i] >> (p -= 8)) & 255;
        if (p <= 0) {
          p += this.DB;
          --i;
        }
      }
      if ((d & 128) != 0) d |= -256;
      if (k == 0 && (this.s & 128) != (d & 128)) ++k;
      if (k > 0 || d != this.s) r.arr[k++] = d;
    }
  }
  return r;
}
function bnEquals(a) {
  return this.compareTo(a) == 0;
}
function bnMin(a) {
  return this.compareTo(a) < 0 ? this : a;
}
function bnMax(a) {
  return this.compareTo(a) > 0 ? this : a;
}
function bnpBitwiseTo(a, op, r) {
  var i,
    f,
    m = Math.min(a.t, this.t);
  for (i = 0; i < m; ++i) r.arr[i] = op(this.arr[i], a.arr[i]);
  if (a.t < this.t) {
    f = a.s & this.DM;
    for (i = m; i < this.t; ++i) r.arr[i] = op(this.arr[i], f);
    r.t = this.t;
  } else {
    f = this.s & this.DM;
    for (i = m; i < a.t; ++i) r.arr[i] = op(f, a.arr[i]);
    r.t = a.t;
  }
  r.s = op(this.s, a.s);
  r.clamp();
}
function op_and(x, y) {
  return x & y;
}
function bnAnd(a) {
  var r = nbi();
  this.bitwiseTo(a, op_and, r);
  return r;
}
function op_or(x, y) {
  return x | y;
}
function bnOr(a) {
  var r = nbi();
  this.bitwiseTo(a, op_or, r);
  return r;
}
function op_xor(x, y) {
  return x ^ y;
}
function bnXor(a) {
  var r = nbi();
  this.bitwiseTo(a, op_xor, r);
  return r;
}
function op_andnot(x, y) {
  return x & ~y;
}
function bnAndNot(a) {
  var r = nbi();
  this.bitwiseTo(a, op_andnot, r);
  return r;
}
function bnNot() {
  var r = nbi();
  for (var i = 0; i < this.t; ++i) r.arr[i] = this.DM & ~this.arr[i];
  r.t = this.t;
  r.s = ~this.s;
  return r;
}
function bnShiftLeft(n) {
  var r = nbi();
  if (n < 0) this.rShiftTo(-n, r);
  else this.lShiftTo(n, r);
  return r;
}
function bnShiftRight(n) {
  var r = nbi();
  if (n < 0) this.lShiftTo(-n, r);
  else this.rShiftTo(n, r);
  return r;
}
function lbit(x) {
  if (x == 0) return -1;
  var r = 0;
  if ((x & 65535) == 0) {
    x >>= 16;
    r += 16;
  }
  if ((x & 255) == 0) {
    x >>= 8;
    r += 8;
  }
  if ((x & 15) == 0) {
    x >>= 4;
    r += 4;
  }
  if ((x & 3) == 0) {
    x >>= 2;
    r += 2;
  }
  if ((x & 1) == 0) ++r;
  return r;
}
function bnGetLowestSetBit() {
  for (var i = 0; i < this.t; ++i)
    if (this.arr[i] != 0) return i * this.DB + lbit(this.arr[i]);
  if (this.s < 0) return this.t * this.DB;
  return -1;
}
function cbit(x) {
  var r = 0;
  while (x != 0) {
    x &= x - 1;
    ++r;
  }
  return r;
}
function bnBitCount() {
  var r = 0,
    x = this.s & this.DM;
  for (var i = 0; i < this.t; ++i) r += cbit(this.arr[i] ^ x);
  return r;
}
function bnTestBit(n) {
  var j = Math.floor(n / this.DB);
  if (j >= this.t) return this.s != 0;
  return (this.arr[j] & (1 << n % this.DB)) != 0;
}
function bnpChangeBit(n, op) {
  var r = BigInteger.ONE.shiftLeft(n);
  this.bitwiseTo(r, op, r);
  return r;
}
function bnSetBit(n) {
  return this.changeBit(n, op_or);
}
function bnClearBit(n) {
  return this.changeBit(n, op_andnot);
}
function bnFlipBit(n) {
  return this.changeBit(n, op_xor);
}
function bnpAddTo(a, r) {
  var i = 0,
    c = 0,
    m = Math.min(a.t, this.t);
  while (i < m) {
    c += this.arr[i] + a.arr[i];
    r.arr[i++] = c & this.DM;
    c >>= this.DB;
  }
  if (a.t < this.t) {
    c += a.s;
    while (i < this.t) {
      c += this.arr[i];
      r.arr[i++] = c & this.DM;
      c >>= this.DB;
    }
    c += this.s;
  } else {
    c += this.s;
    while (i < a.t) {
      c += a.arr[i];
      r.arr[i++] = c & this.DM;
      c >>= this.DB;
    }
    c += a.s;
  }
  r.s = c < 0 ? -1 : 0;
  if (c > 0) r.arr[i++] = c;
  else if (c < -1) r.arr[i++] = this.DV + c;
  r.t = i;
  r.clamp();
}
function bnAdd(a) {
  var r = nbi();
  this.addTo(a, r);
  return r;
}
function bnSubtract(a) {
  var r = nbi();
  this.subTo(a, r);
  return r;
}
function bnMultiply(a) {
  var r = nbi();
  this.multiplyTo(a, r);
  return r;
}
function bnDivide(a) {
  var r = nbi();
  this.divRemTo(a, r, null);
  return r;
}
function bnRemainder(a) {
  var r = nbi();
  this.divRemTo(a, null, r);
  return r;
}
function bnDivideAndRemainder(a) {
  var q = nbi(),
    r = nbi();
  this.divRemTo(a, q, r);
  return new Array(q, r);
}
function bnpDMultiply(n) {
  this.arr[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
  ++this.t;
  this.clamp();
}
function bnpDAddOffset(n, w) {
  if (n == 0) return;
  while (this.t <= w) this.arr[this.t++] = 0;
  this.arr[w] += n;
  while (this.arr[w] >= this.DV) {
    this.arr[w] -= this.DV;
    if (++w >= this.t) this.arr[this.t++] = 0;
    ++this.arr[w];
  }
}
function NullExp() {}
function nNop(x) {
  return x;
}
function nMulTo(x, y, r) {
  x.multiplyTo(y, r);
}
function nSqrTo(x, r) {
  x.squareTo(r);
}
NullExp.prototype.convert = nNop;
NullExp.prototype.revert = nNop;
NullExp.prototype.mulTo = nMulTo;
NullExp.prototype.sqrTo = nSqrTo;
function bnPow(e) {
  return this.exp(e, new NullExp());
}
function bnpMultiplyLowerTo(a, n, r) {
  var i = Math.min(this.t + a.t, n);
  r.s = 0;
  r.t = i;
  while (i > 0) r.arr[--i] = 0;
  var j;
  for (j = r.t - this.t; i < j; ++i)
    r.arr[i + this.t] = this.am(0, a.arr[i], r, i, 0, this.t);
  for (j = Math.min(a.t, n); i < j; ++i) this.am(0, a.arr[i], r, i, 0, n - i);
  r.clamp();
}
function bnpMultiplyUpperTo(a, n, r) {
  --n;
  var i = (r.t = this.t + a.t - n);
  r.s = 0;
  while (--i >= 0) r.arr[i] = 0;
  for (i = Math.max(n - this.t, 0); i < a.t; ++i)
    r.arr[this.t + i - n] = this.am(n - i, a.arr[i], r, 0, 0, this.t + i - n);
  r.clamp();
  r.drShiftTo(1, r);
}
function Barrett(m) {
  this.r2 = nbi();
  this.q3 = nbi();
  BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
  this.mu = this.r2.divide(m);
  this.m = m;
}
function barrettConvert(x) {
  if (x.s < 0 || x.t > 2 * this.m.t) return x.mod(this.m);
  else if (x.compareTo(this.m) < 0) return x;
  else {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r;
  }
}
function barrettRevert(x) {
  return x;
}
function barrettReduce(x) {
  x.drShiftTo(this.m.t - 1, this.r2);
  if (x.t > this.m.t + 1) {
    x.t = this.m.t + 1;
    x.clamp();
  }
  this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
  this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
  while (x.compareTo(this.r2) < 0) x.dAddOffset(1, this.m.t + 1);
  x.subTo(this.r2, x);
  while (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
}
function barrettSqrTo(x, r) {
  x.squareTo(r);
  this.reduce(r);
}
function barrettMulTo(x, y, r) {
  x.multiplyTo(y, r);
  this.reduce(r);
}
Barrett.prototype.convert = barrettConvert;
Barrett.prototype.revert = barrettRevert;
Barrett.prototype.reduce = barrettReduce;
Barrett.prototype.mulTo = barrettMulTo;
Barrett.prototype.sqrTo = barrettSqrTo;
function bnModPow(e, m) {
  var i = e.bitLength(),
    k,
    r = nbv(1),
    z;
  if (i <= 0) return r;
  else if (i < 18) k = 1;
  else if (i < 48) k = 3;
  else if (i < 144) k = 4;
  else if (i < 768) k = 5;
  else k = 6;
  if (i < 8) z = new Classic(m);
  else if (m.isEven()) z = new Barrett(m);
  else z = new Montgomery(m);
  var g = new Array(),
    n = 3,
    k1 = k - 1,
    km = (1 << k) - 1;
  g[1] = z.convert(this);
  if (k > 1) {
    var g2 = nbi();
    z.sqrTo(g[1], g2);
    while (n <= km) {
      g[n] = nbi();
      z.mulTo(g2, g[n - 2], g[n]);
      n += 2;
    }
  }
  var j = e.t - 1,
    w,
    is1 = true,
    r2 = nbi(),
    t;
  i = nbits(e.arr[j]) - 1;
  while (j >= 0) {
    if (i >= k1) w = (e.arr[j] >> (i - k1)) & km;
    else {
      w = (e.arr[j] & ((1 << (i + 1)) - 1)) << (k1 - i);
      if (j > 0) w |= e.arr[j - 1] >> (this.DB + i - k1);
    }
    n = k;
    while ((w & 1) == 0) {
      w >>= 1;
      --n;
    }
    if ((i -= n) < 0) {
      i += this.DB;
      --j;
    }
    if (is1) {
      g[w].copyTo(r);
      is1 = false;
    } else {
      while (n > 1) {
        z.sqrTo(r, r2);
        z.sqrTo(r2, r);
        n -= 2;
      }
      if (n > 0) z.sqrTo(r, r2);
      else {
        t = r;
        r = r2;
        r2 = t;
      }
      z.mulTo(r2, g[w], r);
    }
    while (j >= 0 && (e.arr[j] & (1 << i)) == 0) {
      z.sqrTo(r, r2);
      t = r;
      r = r2;
      r2 = t;
      if (--i < 0) {
        i = this.DB - 1;
        --j;
      }
    }
  }
  return z.revert(r);
}
function bnGCD(a) {
  var x = this.s < 0 ? this.negate() : this.clone();
  var y = a.s < 0 ? a.negate() : a.clone();
  if (x.compareTo(y) < 0) {
    var t = x;
    x = y;
    y = t;
  }
  var i = x.getLowestSetBit(),
    g = y.getLowestSetBit();
  if (g < 0) return x;
  if (i < g) g = i;
  if (g > 0) {
    x.rShiftTo(g, x);
    y.rShiftTo(g, y);
  }
  while (x.signum() > 0) {
    if ((i = x.getLowestSetBit()) > 0) x.rShiftTo(i, x);
    if ((i = y.getLowestSetBit()) > 0) y.rShiftTo(i, y);
    if (x.compareTo(y) >= 0) {
      x.subTo(y, x);
      x.rShiftTo(1, x);
    } else {
      y.subTo(x, y);
      y.rShiftTo(1, y);
    }
  }
  if (g > 0) y.lShiftTo(g, y);
  return y;
}
function bnpModInt(n) {
  if (n <= 0) return 0;
  var d = this.DV % n,
    r = this.s < 0 ? n - 1 : 0;
  if (this.t > 0)
    if (d == 0) r = this.arr[0] % n;
    else for (var i = this.t - 1; i >= 0; --i) r = (d * r + this.arr[i]) % n;
  return r;
}
function bnModInverse(m) {
  var ac = m.isEven();
  if ((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
  var u = m.clone(),
    v = this.clone();
  var a = nbv(1),
    b = nbv(0),
    c = nbv(0),
    d = nbv(1);
  while (u.signum() != 0) {
    while (u.isEven()) {
      u.rShiftTo(1, u);
      if (ac) {
        if (!a.isEven() || !b.isEven()) {
          a.addTo(this, a);
          b.subTo(m, b);
        }
        a.rShiftTo(1, a);
      } else if (!b.isEven()) b.subTo(m, b);
      b.rShiftTo(1, b);
    }
    while (v.isEven()) {
      v.rShiftTo(1, v);
      if (ac) {
        if (!c.isEven() || !d.isEven()) {
          c.addTo(this, c);
          d.subTo(m, d);
        }
        c.rShiftTo(1, c);
      } else if (!d.isEven()) d.subTo(m, d);
      d.rShiftTo(1, d);
    }
    if (u.compareTo(v) >= 0) {
      u.subTo(v, u);
      if (ac) a.subTo(c, a);
      b.subTo(d, b);
    } else {
      v.subTo(u, v);
      if (ac) c.subTo(a, c);
      d.subTo(b, d);
    }
  }
  if (v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
  if (d.compareTo(m) >= 0) return d.subtract(m);
  if (d.signum() < 0) d.addTo(m, d);
  else return d;
  if (d.signum() < 0) return d.add(m);
  else return d;
}
var lowprimes = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151,
  157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233,
  239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317,
  331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419,
  421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503,
  509,
];
var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
function bnIsProbablePrime(t) {
  var i,
    x = this.abs();
  if (x.t == 1 && x.arr[0] <= lowprimes[lowprimes.length - 1]) {
    for (i = 0; i < lowprimes.length; ++i)
      if (x.arr[0] == lowprimes[i]) return true;
    return false;
  }
  if (x.isEven()) return false;
  i = 1;
  while (i < lowprimes.length) {
    var m = lowprimes[i],
      j = i + 1;
    while (j < lowprimes.length && m < lplim) m *= lowprimes[j++];
    m = x.modInt(m);
    while (i < j) if (m % lowprimes[i++] == 0) return false;
  }
  return x.millerRabin(t);
}
function bnpMillerRabin(t) {
  var n1 = this.subtract(BigInteger.ONE);
  var k = n1.getLowestSetBit();
  if (k <= 0) return false;
  var r = n1.shiftRight(k);
  t = (t + 1) >> 1;
  if (t > lowprimes.length) t = lowprimes.length;
  var a = nbi();
  for (var i = 0; i < t; ++i) {
    a.fromInt(lowprimes[i]);
    var y = a.modPow(r, this);
    if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
      var j = 1;
      while (j++ < k && y.compareTo(n1) != 0) {
        y = y.modPowInt(2, this);
        if (y.compareTo(BigInteger.ONE) == 0) return false;
      }
      if (y.compareTo(n1) != 0) return false;
    }
  }
  return true;
}
BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.toRadix = bnpToRadix;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.fromNumber = bnpFromNumber;
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
BigInteger.prototype.changeBit = bnpChangeBit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
BigInteger.prototype.modInt = bnpModInt;
BigInteger.prototype.millerRabin = bnpMillerRabin;
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.byteValue = bnByteValue;
BigInteger.prototype.shortValue = bnShortValue;
BigInteger.prototype.signum = bnSigNum;
BigInteger.prototype.toByteArray = bnToByteArray;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.min = bnMin;
BigInteger.prototype.max = bnMax;
BigInteger.prototype.and = bnAnd;
BigInteger.prototype.or = bnOr;
BigInteger.prototype.xor = bnXor;
BigInteger.prototype.andNot = bnAndNot;
BigInteger.prototype.not = bnNot;
BigInteger.prototype.shiftLeft = bnShiftLeft;
BigInteger.prototype.shiftRight = bnShiftRight;
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
BigInteger.prototype.bitCount = bnBitCount;
BigInteger.prototype.testBit = bnTestBit;
BigInteger.prototype.setBit = bnSetBit;
BigInteger.prototype.clearBit = bnClearBit;
BigInteger.prototype.flipBit = bnFlipBit;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.remainder = bnRemainder;
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.modInverse = bnModInverse;
BigInteger.prototype.pow = bnPow;
BigInteger.prototype.gcd = bnGCD;
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
("use strict");
function q(a) {
  throw a;
}
var t = void 0,
  u = !1;
var sjcl = {
  cipher: {},
  hash: {},
  keyexchange: {},
  mode: {},
  misc: {},
  codec: {},
  exception: {
    corrupt: function (a) {
      this.toString = function () {
        return "CORRUPT: " + this.message;
      };
      this.message = a;
    },
    invalid: function (a) {
      this.toString = function () {
        return "INVALID: " + this.message;
      };
      this.message = a;
    },
    bug: function (a) {
      this.toString = function () {
        return "BUG: " + this.message;
      };
      this.message = a;
    },
    notReady: function (a) {
      this.toString = function () {
        return "NOT READY: " + this.message;
      };
      this.message = a;
    },
  },
};
"undefined" != typeof module && module.exports && (module.exports = sjcl);
sjcl.cipher.aes = function (a) {
  this.j[0][0][0] || this.D();
  var b,
    c,
    d,
    e,
    f = this.j[0][4],
    g = this.j[1];
  b = a.length;
  var h = 1;
  4 !== b &&
    6 !== b &&
    8 !== b &&
    q(new sjcl.exception.invalid("invalid aes key size"));
  this.a = [(d = a.slice(0)), (e = [])];
  for (a = b; a < 4 * b + 28; a++) {
    c = d[a - 1];
    if (0 === a % b || (8 === b && 4 === a % b))
      (c =
        (f[c >>> 24] << 24) ^
        (f[(c >> 16) & 255] << 16) ^
        (f[(c >> 8) & 255] << 8) ^
        f[c & 255]),
        0 === a % b &&
          ((c = (c << 8) ^ (c >>> 24) ^ (h << 24)),
          (h = (h << 1) ^ (283 * (h >> 7))));
    d[a] = d[a - b] ^ c;
  }
  for (b = 0; a; b++, a--)
    (c = d[b & 3 ? a : a - 4]),
      (e[b] =
        4 >= a || 4 > b
          ? c
          : g[0][f[c >>> 24]] ^
            g[1][f[(c >> 16) & 255]] ^
            g[2][f[(c >> 8) & 255]] ^
            g[3][f[c & 255]]);
};
sjcl.cipher.aes.prototype = {
  encrypt: function (a) {
    return y(this, a, 0);
  },
  decrypt: function (a) {
    return y(this, a, 1);
  },
  j: [
    [[], [], [], [], []],
    [[], [], [], [], []],
  ],
  D: function () {
    var a = this.j[0],
      b = this.j[1],
      c = a[4],
      d = b[4],
      e,
      f,
      g,
      h = [],
      l = [],
      k,
      n,
      m,
      p;
    for (e = 0; 256 > e; e++) l[(h[e] = (e << 1) ^ (283 * (e >> 7))) ^ e] = e;
    for (f = g = 0; !c[f]; f ^= k || 1, g = l[g] || 1) {
      m = g ^ (g << 1) ^ (g << 2) ^ (g << 3) ^ (g << 4);
      m = (m >> 8) ^ (m & 255) ^ 99;
      c[f] = m;
      d[m] = f;
      n = h[(e = h[(k = h[f])])];
      p = (16843009 * n) ^ (65537 * e) ^ (257 * k) ^ (16843008 * f);
      n = (257 * h[m]) ^ (16843008 * m);
      for (e = 0; 4 > e; e++)
        (a[e][f] = n = (n << 24) ^ (n >>> 8)),
          (b[e][m] = p = (p << 24) ^ (p >>> 8));
    }
    for (e = 0; 5 > e; e++) (a[e] = a[e].slice(0)), (b[e] = b[e].slice(0));
  },
};
function y(a, b, c) {
  4 !== b.length && q(new sjcl.exception.invalid("invalid aes block size"));
  var d = a.a[c],
    e = b[0] ^ d[0],
    f = b[c ? 3 : 1] ^ d[1],
    g = b[2] ^ d[2];
  b = b[c ? 1 : 3] ^ d[3];
  var h,
    l,
    k,
    n = d.length / 4 - 2,
    m,
    p = 4,
    s = [0, 0, 0, 0];
  h = a.j[c];
  a = h[0];
  var r = h[1],
    v = h[2],
    w = h[3],
    x = h[4];
  for (m = 0; m < n; m++)
    (h =
      a[e >>> 24] ^ r[(f >> 16) & 255] ^ v[(g >> 8) & 255] ^ w[b & 255] ^ d[p]),
      (l =
        a[f >>> 24] ^
        r[(g >> 16) & 255] ^
        v[(b >> 8) & 255] ^
        w[e & 255] ^
        d[p + 1]),
      (k =
        a[g >>> 24] ^
        r[(b >> 16) & 255] ^
        v[(e >> 8) & 255] ^
        w[f & 255] ^
        d[p + 2]),
      (b =
        a[b >>> 24] ^
        r[(e >> 16) & 255] ^
        v[(f >> 8) & 255] ^
        w[g & 255] ^
        d[p + 3]),
      (p += 4),
      (e = h),
      (f = l),
      (g = k);
  for (m = 0; 4 > m; m++)
    (s[c ? 3 & -m : m] =
      (x[e >>> 24] << 24) ^
      (x[(f >> 16) & 255] << 16) ^
      (x[(g >> 8) & 255] << 8) ^
      x[b & 255] ^
      d[p++]),
      (h = e),
      (e = f),
      (f = g),
      (g = b),
      (b = h);
  return s;
}
sjcl.bitArray = {
  bitSlice: function (a, b, c) {
    a = sjcl.bitArray.O(a.slice(b / 32), 32 - (b & 31)).slice(1);
    return c === t ? a : sjcl.bitArray.clamp(a, c - b);
  },
  extract: function (a, b, c) {
    var d = Math.floor((-b - c) & 31);
    return (
      (((b + c - 1) ^ b) & -32
        ? (a[(b / 32) | 0] << (32 - d)) ^ (a[(b / 32 + 1) | 0] >>> d)
        : a[(b / 32) | 0] >>> d) &
      ((1 << c) - 1)
    );
  },
  concat: function (a, b) {
    if (0 === a.length || 0 === b.length) return a.concat(b);
    var c = a[a.length - 1],
      d = sjcl.bitArray.getPartial(c);
    return 32 === d
      ? a.concat(b)
      : sjcl.bitArray.O(b, d, c | 0, a.slice(0, a.length - 1));
  },
  bitLength: function (a) {
    var b = a.length;
    return 0 === b ? 0 : 32 * (b - 1) + sjcl.bitArray.getPartial(a[b - 1]);
  },
  clamp: function (a, b) {
    if (32 * a.length < b) return a;
    a = a.slice(0, Math.ceil(b / 32));
    var c = a.length;
    b &= 31;
    0 < c &&
      b &&
      (a[c - 1] = sjcl.bitArray.partial(
        b,
        a[c - 1] & (2147483648 >> (b - 1)),
        1
      ));
    return a;
  },
  partial: function (a, b, c) {
    return 32 === a ? b : (c ? b | 0 : b << (32 - a)) + 1099511627776 * a;
  },
  getPartial: function (a) {
    return Math.round(a / 1099511627776) || 32;
  },
  equal: function (a, b) {
    if (sjcl.bitArray.bitLength(a) !== sjcl.bitArray.bitLength(b)) return u;
    var c = 0,
      d;
    for (d = 0; d < a.length; d++) c |= a[d] ^ b[d];
    return 0 === c;
  },
  O: function (a, b, c, d) {
    var e;
    e = 0;
    for (d === t && (d = []); 32 <= b; b -= 32) d.push(c), (c = 0);
    if (0 === b) return d.concat(a);
    for (e = 0; e < a.length; e++)
      d.push(c | (a[e] >>> b)), (c = a[e] << (32 - b));
    e = a.length ? a[a.length - 1] : 0;
    a = sjcl.bitArray.getPartial(e);
    d.push(sjcl.bitArray.partial((b + a) & 31, 32 < b + a ? c : d.pop(), 1));
    return d;
  },
  k: function (a, b) {
    return [a[0] ^ b[0], a[1] ^ b[1], a[2] ^ b[2], a[3] ^ b[3]];
  },
};
sjcl.codec.utf8String = {
  fromBits: function (a) {
    var b = "",
      c = sjcl.bitArray.bitLength(a),
      d,
      e;
    for (d = 0; d < c / 8; d++)
      0 === (d & 3) && (e = a[d / 4]),
        (b += String.fromCharCode(e >>> 24)),
        (e <<= 8);
    return decodeURIComponent(escape(b));
  },
  toBits: function (a) {
    a = unescape(encodeURIComponent(a));
    var b = [],
      c,
      d = 0;
    for (c = 0; c < a.length; c++)
      (d = (d << 8) | a.charCodeAt(c)), 3 === (c & 3) && (b.push(d), (d = 0));
    c & 3 && b.push(sjcl.bitArray.partial(8 * (c & 3), d));
    return b;
  },
};
sjcl.codec.hex = {
  fromBits: function (a) {
    var b = "",
      c;
    for (c = 0; c < a.length; c++)
      b += ((a[c] | 0) + 0xf00000000000).toString(16).substr(4);
    return b.substr(0, sjcl.bitArray.bitLength(a) / 4);
  },
  toBits: function (a) {
    var b,
      c = [],
      d;
    a = a.replace(/\s|0x/g, "");
    d = a.length;
    a += "00000000";
    for (b = 0; b < a.length; b += 8) c.push(parseInt(a.substr(b, 8), 16) ^ 0);
    return sjcl.bitArray.clamp(c, 4 * d);
  },
};
sjcl.codec.base64 = {
  I: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  fromBits: function (a, b, c) {
    var d = "",
      e = 0,
      f = sjcl.codec.base64.I,
      g = 0,
      h = sjcl.bitArray.bitLength(a);
    c && (f = f.substr(0, 62) + "-_");
    for (c = 0; 6 * d.length < h; )
      (d += f.charAt((g ^ (a[c] >>> e)) >>> 26)),
        6 > e ? ((g = a[c] << (6 - e)), (e += 26), c++) : ((g <<= 6), (e -= 6));
    for (; d.length & 3 && !b; ) d += "=";
    return d;
  },
  toBits: function (a, b) {
    a = a.replace(/\s|=/g, "");
    var c = [],
      d,
      e = 0,
      f = sjcl.codec.base64.I,
      g = 0,
      h;
    b && (f = f.substr(0, 62) + "-_");
    for (d = 0; d < a.length; d++)
      (h = f.indexOf(a.charAt(d))),
        0 > h && q(new sjcl.exception.invalid("this isn't base64!")),
        26 < e
          ? ((e -= 26), c.push(g ^ (h >>> e)), (g = h << (32 - e)))
          : ((e += 6), (g ^= h << (32 - e)));
    e & 56 && c.push(sjcl.bitArray.partial(e & 56, g, 1));
    return c;
  },
};
sjcl.codec.base64url = {
  fromBits: function (a) {
    return sjcl.codec.base64.fromBits(a, 1, 1);
  },
  toBits: function (a) {
    return sjcl.codec.base64.toBits(a, 1);
  },
};
sjcl.hash.sha256 = function (a) {
  this.a[0] || this.D();
  a
    ? ((this.q = a.q.slice(0)), (this.m = a.m.slice(0)), (this.g = a.g))
    : this.reset();
};
sjcl.hash.sha256.hash = function (a) {
  return new sjcl.hash.sha256().update(a).finalize();
};
sjcl.hash.sha256.prototype = {
  blockSize: 512,
  reset: function () {
    this.q = this.M.slice(0);
    this.m = [];
    this.g = 0;
    return this;
  },
  update: function (a) {
    "string" === typeof a && (a = sjcl.codec.utf8String.toBits(a));
    var b,
      c = (this.m = sjcl.bitArray.concat(this.m, a));
    b = this.g;
    a = this.g = b + sjcl.bitArray.bitLength(a);
    for (b = (512 + b) & -512; b <= a; b += 512) z(this, c.splice(0, 16));
    return this;
  },
  finalize: function () {
    var a,
      b = this.m,
      c = this.q,
      b = sjcl.bitArray.concat(b, [sjcl.bitArray.partial(1, 1)]);
    for (a = b.length + 2; a & 15; a++) b.push(0);
    b.push(Math.floor(this.g / 4294967296));
    for (b.push(this.g | 0); b.length; ) z(this, b.splice(0, 16));
    this.reset();
    return c;
  },
  M: [],
  a: [],
  D: function () {
    function a(a) {
      return (4294967296 * (a - Math.floor(a))) | 0;
    }
    var b = 0,
      c = 2,
      d;
    a: for (; 64 > b; c++) {
      for (d = 2; d * d <= c; d++) if (0 === c % d) continue a;
      8 > b && (this.M[b] = a(Math.pow(c, 0.5)));
      this.a[b] = a(Math.pow(c, 1 / 3));
      b++;
    }
  },
};
function z(a, b) {
  var c,
    d,
    e,
    f = b.slice(0),
    g = a.q,
    h = a.a,
    l = g[0],
    k = g[1],
    n = g[2],
    m = g[3],
    p = g[4],
    s = g[5],
    r = g[6],
    v = g[7];
  for (c = 0; 64 > c; c++)
    16 > c
      ? (d = f[c])
      : ((d = f[(c + 1) & 15]),
        (e = f[(c + 14) & 15]),
        (d = f[c & 15] =
          (((d >>> 7) ^ (d >>> 18) ^ (d >>> 3) ^ (d << 25) ^ (d << 14)) +
            ((e >>> 17) ^ (e >>> 19) ^ (e >>> 10) ^ (e << 15) ^ (e << 13)) +
            f[c & 15] +
            f[(c + 9) & 15]) |
          0)),
      (d =
        d +
        v +
        ((p >>> 6) ^
          (p >>> 11) ^
          (p >>> 25) ^
          (p << 26) ^
          (p << 21) ^
          (p << 7)) +
        (r ^ (p & (s ^ r))) +
        h[c]),
      (v = r),
      (r = s),
      (s = p),
      (p = (m + d) | 0),
      (m = n),
      (n = k),
      (k = l),
      (l =
        (d +
          ((k & n) ^ (m & (k ^ n))) +
          ((k >>> 2) ^
            (k >>> 13) ^
            (k >>> 22) ^
            (k << 30) ^
            (k << 19) ^
            (k << 10))) |
        0);
  g[0] = (g[0] + l) | 0;
  g[1] = (g[1] + k) | 0;
  g[2] = (g[2] + n) | 0;
  g[3] = (g[3] + m) | 0;
  g[4] = (g[4] + p) | 0;
  g[5] = (g[5] + s) | 0;
  g[6] = (g[6] + r) | 0;
  g[7] = (g[7] + v) | 0;
}
sjcl.mode.ccm = {
  name: "ccm",
  encrypt: function (a, b, c, d, e) {
    var f,
      g = b.slice(0),
      h = sjcl.bitArray,
      l = h.bitLength(c) / 8,
      k = h.bitLength(g) / 8;
    e = e || 64;
    d = d || [];
    7 > l && q(new sjcl.exception.invalid("ccm: iv must be at least 7 bytes"));
    for (f = 2; 4 > f && k >>> (8 * f); f++);
    f < 15 - l && (f = 15 - l);
    c = h.clamp(c, 8 * (15 - f));
    b = sjcl.mode.ccm.K(a, b, c, d, e, f);
    g = sjcl.mode.ccm.n(a, g, c, b, e, f);
    return h.concat(g.data, g.tag);
  },
  decrypt: function (a, b, c, d, e) {
    e = e || 64;
    d = d || [];
    var f = sjcl.bitArray,
      g = f.bitLength(c) / 8,
      h = f.bitLength(b),
      l = f.clamp(b, h - e),
      k = f.bitSlice(b, h - e),
      h = (h - e) / 8;
    7 > g && q(new sjcl.exception.invalid("ccm: iv must be at least 7 bytes"));
    for (b = 2; 4 > b && h >>> (8 * b); b++);
    b < 15 - g && (b = 15 - g);
    c = f.clamp(c, 8 * (15 - b));
    l = sjcl.mode.ccm.n(a, l, c, k, e, b);
    a = sjcl.mode.ccm.K(a, l.data, c, d, e, b);
    f.equal(l.tag, a) ||
      q(new sjcl.exception.corrupt("ccm: tag doesn't match"));
    return l.data;
  },
  K: function (a, b, c, d, e, f) {
    var g = [],
      h = sjcl.bitArray,
      l = h.k;
    e /= 8;
    (e % 2 || 4 > e || 16 < e) &&
      q(new sjcl.exception.invalid("ccm: invalid tag length"));
    (4294967295 < d.length || 4294967295 < b.length) &&
      q(new sjcl.exception.bug("ccm: can't deal with 4GiB or more data"));
    f = [h.partial(8, (d.length ? 64 : 0) | ((e - 2) << 2) | (f - 1))];
    f = h.concat(f, c);
    f[3] |= h.bitLength(b) / 8;
    f = a.encrypt(f);
    if (d.length) {
      c = h.bitLength(d) / 8;
      65279 >= c
        ? (g = [h.partial(16, c)])
        : 4294967295 >= c && (g = h.concat([h.partial(16, 65534)], [c]));
      g = h.concat(g, d);
      for (d = 0; d < g.length; d += 4)
        f = a.encrypt(l(f, g.slice(d, d + 4).concat([0, 0, 0])));
    }
    for (d = 0; d < b.length; d += 4)
      f = a.encrypt(l(f, b.slice(d, d + 4).concat([0, 0, 0])));
    return h.clamp(f, 8 * e);
  },
  n: function (a, b, c, d, e, f) {
    var g,
      h = sjcl.bitArray;
    g = h.k;
    var l = b.length,
      k = h.bitLength(b);
    c = h
      .concat([h.partial(8, f - 1)], c)
      .concat([0, 0, 0])
      .slice(0, 4);
    d = h.bitSlice(g(d, a.encrypt(c)), 0, e);
    if (!l) return { tag: d, data: [] };
    for (g = 0; g < l; g += 4)
      c[3]++,
        (e = a.encrypt(c)),
        (b[g] ^= e[0]),
        (b[g + 1] ^= e[1]),
        (b[g + 2] ^= e[2]),
        (b[g + 3] ^= e[3]);
    return { tag: d, data: h.clamp(b, k) };
  },
};
sjcl.mode.ocb2 = {
  name: "ocb2",
  encrypt: function (a, b, c, d, e, f) {
    128 !== sjcl.bitArray.bitLength(c) &&
      q(new sjcl.exception.invalid("ocb iv must be 128 bits"));
    var g,
      h = sjcl.mode.ocb2.G,
      l = sjcl.bitArray,
      k = l.k,
      n = [0, 0, 0, 0];
    c = h(a.encrypt(c));
    var m,
      p = [];
    d = d || [];
    e = e || 64;
    for (g = 0; g + 4 < b.length; g += 4)
      (m = b.slice(g, g + 4)),
        (n = k(n, m)),
        (p = p.concat(k(c, a.encrypt(k(c, m))))),
        (c = h(c));
    m = b.slice(g);
    b = l.bitLength(m);
    g = a.encrypt(k(c, [0, 0, 0, b]));
    m = l.clamp(k(m.concat([0, 0, 0]), g), b);
    n = k(n, k(m.concat([0, 0, 0]), g));
    n = a.encrypt(k(n, k(c, h(c))));
    d.length && (n = k(n, f ? d : sjcl.mode.ocb2.pmac(a, d)));
    return p.concat(l.concat(m, l.clamp(n, e)));
  },
  decrypt: function (a, b, c, d, e, f) {
    128 !== sjcl.bitArray.bitLength(c) &&
      q(new sjcl.exception.invalid("ocb iv must be 128 bits"));
    e = e || 64;
    var g = sjcl.mode.ocb2.G,
      h = sjcl.bitArray,
      l = h.k,
      k = [0, 0, 0, 0],
      n = g(a.encrypt(c)),
      m,
      p,
      s = sjcl.bitArray.bitLength(b) - e,
      r = [];
    d = d || [];
    for (c = 0; c + 4 < s / 32; c += 4)
      (m = l(n, a.decrypt(l(n, b.slice(c, c + 4))))),
        (k = l(k, m)),
        (r = r.concat(m)),
        (n = g(n));
    p = s - 32 * c;
    m = a.encrypt(l(n, [0, 0, 0, p]));
    m = l(m, h.clamp(b.slice(c), p).concat([0, 0, 0]));
    k = l(k, m);
    k = a.encrypt(l(k, l(n, g(n))));
    d.length && (k = l(k, f ? d : sjcl.mode.ocb2.pmac(a, d)));
    h.equal(h.clamp(k, e), h.bitSlice(b, s)) ||
      q(new sjcl.exception.corrupt("ocb: tag doesn't match"));
    return r.concat(h.clamp(m, p));
  },
  pmac: function (a, b) {
    var c,
      d = sjcl.mode.ocb2.G,
      e = sjcl.bitArray,
      f = e.k,
      g = [0, 0, 0, 0],
      h = a.encrypt([0, 0, 0, 0]),
      h = f(h, d(d(h)));
    for (c = 0; c + 4 < b.length; c += 4)
      (h = d(h)), (g = f(g, a.encrypt(f(h, b.slice(c, c + 4)))));
    c = b.slice(c);
    128 > e.bitLength(c) &&
      ((h = f(h, d(h))), (c = e.concat(c, [-2147483648, 0, 0, 0])));
    g = f(g, c);
    return a.encrypt(f(d(f(h, d(h))), g));
  },
  G: function (a) {
    return [
      (a[0] << 1) ^ (a[1] >>> 31),
      (a[1] << 1) ^ (a[2] >>> 31),
      (a[2] << 1) ^ (a[3] >>> 31),
      (a[3] << 1) ^ (135 * (a[0] >>> 31)),
    ];
  },
};
sjcl.mode.gcm = {
  name: "gcm",
  encrypt: function (a, b, c, d, e) {
    var f = b.slice(0);
    b = sjcl.bitArray;
    d = d || [];
    a = sjcl.mode.gcm.n(!0, a, f, d, c, e || 128);
    return b.concat(a.data, a.tag);
  },
  decrypt: function (a, b, c, d, e) {
    var f = b.slice(0),
      g = sjcl.bitArray,
      h = g.bitLength(f);
    e = e || 128;
    d = d || [];
    e <= h
      ? ((b = g.bitSlice(f, h - e)), (f = g.bitSlice(f, 0, h - e)))
      : ((b = f), (f = []));
    a = sjcl.mode.gcm.n(u, a, f, d, c, e);
    g.equal(a.tag, b) ||
      q(new sjcl.exception.corrupt("gcm: tag doesn't match"));
    return a.data;
  },
  U: function (a, b) {
    var c,
      d,
      e,
      f,
      g,
      h = sjcl.bitArray.k;
    e = [0, 0, 0, 0];
    f = b.slice(0);
    for (c = 0; 128 > c; c++) {
      (d = 0 !== (a[Math.floor(c / 32)] & (1 << (31 - (c % 32))))) &&
        (e = h(e, f));
      g = 0 !== (f[3] & 1);
      for (d = 3; 0 < d; d--) f[d] = (f[d] >>> 1) | ((f[d - 1] & 1) << 31);
      f[0] >>>= 1;
      g && (f[0] ^= -520093696);
    }
    return e;
  },
  f: function (a, b, c) {
    var d,
      e = c.length;
    b = b.slice(0);
    for (d = 0; d < e; d += 4)
      (b[0] ^= 4294967295 & c[d]),
        (b[1] ^= 4294967295 & c[d + 1]),
        (b[2] ^= 4294967295 & c[d + 2]),
        (b[3] ^= 4294967295 & c[d + 3]),
        (b = sjcl.mode.gcm.U(b, a));
    return b;
  },
  n: function (a, b, c, d, e, f) {
    var g,
      h,
      l,
      k,
      n,
      m,
      p,
      s,
      r = sjcl.bitArray;
    m = c.length;
    p = r.bitLength(c);
    s = r.bitLength(d);
    h = r.bitLength(e);
    g = b.encrypt([0, 0, 0, 0]);
    96 === h
      ? ((e = e.slice(0)), (e = r.concat(e, [1])))
      : ((e = sjcl.mode.gcm.f(g, [0, 0, 0, 0], e)),
        (e = sjcl.mode.gcm.f(g, e, [
          0,
          0,
          Math.floor(h / 4294967296),
          h & 4294967295,
        ])));
    h = sjcl.mode.gcm.f(g, [0, 0, 0, 0], d);
    n = e.slice(0);
    d = h.slice(0);
    a || (d = sjcl.mode.gcm.f(g, h, c));
    for (k = 0; k < m; k += 4)
      n[3]++,
        (l = b.encrypt(n)),
        (c[k] ^= l[0]),
        (c[k + 1] ^= l[1]),
        (c[k + 2] ^= l[2]),
        (c[k + 3] ^= l[3]);
    c = r.clamp(c, p);
    a && (d = sjcl.mode.gcm.f(g, h, c));
    a = [
      Math.floor(s / 4294967296),
      s & 4294967295,
      Math.floor(p / 4294967296),
      p & 4294967295,
    ];
    d = sjcl.mode.gcm.f(g, d, a);
    l = b.encrypt(e);
    d[0] ^= l[0];
    d[1] ^= l[1];
    d[2] ^= l[2];
    d[3] ^= l[3];
    return { tag: r.bitSlice(d, 0, f), data: c };
  },
};
sjcl.misc.hmac = function (a, b) {
  this.L = b = b || sjcl.hash.sha256;
  var c = [[], []],
    d,
    e = b.prototype.blockSize / 32;
  this.o = [new b(), new b()];
  a.length > e && (a = b.hash(a));
  for (d = 0; d < e; d++)
    (c[0][d] = a[d] ^ 909522486), (c[1][d] = a[d] ^ 1549556828);
  this.o[0].update(c[0]);
  this.o[1].update(c[1]);
};
sjcl.misc.hmac.prototype.encrypt = sjcl.misc.hmac.prototype.mac = function (a) {
  a = new this.L(this.o[0]).update(a).finalize();
  return new this.L(this.o[1]).update(a).finalize();
};
sjcl.misc.pbkdf2 = function (a, b, c, d, e) {
  c = c || 1e3;
  (0 > d || 0 > c) && q(sjcl.exception.invalid("invalid params to pbkdf2"));
  "string" === typeof a && (a = sjcl.codec.utf8String.toBits(a));
  e = e || sjcl.misc.hmac;
  a = new e(a);
  var f,
    g,
    h,
    l,
    k = [],
    n = sjcl.bitArray;
  for (l = 1; 32 * k.length < (d || 1); l++) {
    e = f = a.encrypt(n.concat(b, [l]));
    for (g = 1; g < c; g++) {
      f = a.encrypt(f);
      for (h = 0; h < f.length; h++) e[h] ^= f[h];
    }
    k = k.concat(e);
  }
  d && (k = n.clamp(k, d));
  return k;
};
sjcl.prng = function (a) {
  this.b = [new sjcl.hash.sha256()];
  this.h = [0];
  this.F = 0;
  this.t = {};
  this.C = 0;
  this.J = {};
  this.N = this.c = this.i = this.T = 0;
  this.a = [0, 0, 0, 0, 0, 0, 0, 0];
  this.e = [0, 0, 0, 0];
  this.A = t;
  this.B = a;
  this.p = u;
  this.z = { progress: {}, seeded: {} };
  this.l = this.S = 0;
  this.u = 1;
  this.w = 2;
  this.Q = 65536;
  this.H = [0, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024];
  this.R = 3e4;
  this.P = 80;
};
sjcl.prng.prototype = {
  randomWords: function (a, b) {
    var c = [],
      d;
    d = this.isReady(b);
    var e;
    d === this.l && q(new sjcl.exception.notReady("generator isn't seeded"));
    if (d & this.w) {
      d = !(d & this.u);
      e = [];
      var f = 0,
        g;
      this.N = e[0] = new Date().valueOf() + this.R;
      for (g = 0; 16 > g; g++) e.push((4294967296 * Math.random()) | 0);
      for (
        g = 0;
        g < this.b.length &&
        !((e = e.concat(this.b[g].finalize())),
        (f += this.h[g]),
        (this.h[g] = 0),
        !d && this.F & (1 << g));
        g++
      );
      this.F >= 1 << this.b.length &&
        (this.b.push(new sjcl.hash.sha256()), this.h.push(0));
      this.c -= f;
      f > this.i && (this.i = f);
      this.F++;
      this.a = sjcl.hash.sha256.hash(this.a.concat(e));
      this.A = new sjcl.cipher.aes(this.a);
      for (
        d = 0;
        4 > d && !((this.e[d] = (this.e[d] + 1) | 0), this.e[d]);
        d++
      );
    }
    for (d = 0; d < a; d += 4)
      0 === (d + 1) % this.Q && A(this),
        (e = B(this)),
        c.push(e[0], e[1], e[2], e[3]);
    A(this);
    return c.slice(0, a);
  },
  setDefaultParanoia: function (a) {
    this.B = a;
  },
  addEntropy: function (a, b, c) {
    c = c || "user";
    var d,
      e,
      f = new Date().valueOf(),
      g = this.t[c],
      h = this.isReady(),
      l = 0;
    d = this.J[c];
    d === t && (d = this.J[c] = this.T++);
    g === t && (g = this.t[c] = 0);
    this.t[c] = (this.t[c] + 1) % this.b.length;
    switch (typeof a) {
      case "number":
        b === t && (b = 1);
        this.b[g].update([d, this.C++, 1, b, f, 1, a | 0]);
        break;
      case "object":
        c = Object.prototype.toString.call(a);
        if ("[object Uint32Array]" === c) {
          e = [];
          for (c = 0; c < a.length; c++) e.push(a[c]);
          a = e;
        } else {
          "[object Array]" !== c && (l = 1);
          for (c = 0; c < a.length && !l; c++)
            "number" != typeof a[c] && (l = 1);
        }
        if (!l) {
          if (b === t)
            for (c = b = 0; c < a.length; c++)
              for (e = a[c]; 0 < e; ) b++, (e >>>= 1);
          this.b[g].update([d, this.C++, 2, b, f, a.length].concat(a));
        }
        break;
      case "string":
        b === t && (b = a.length);
        this.b[g].update([d, this.C++, 3, b, f, a.length]);
        this.b[g].update(a);
        break;
      default:
        l = 1;
    }
    l &&
      q(
        new sjcl.exception.bug(
          "random: addEntropy only supports number, array of numbers or string"
        )
      );
    this.h[g] += b;
    this.c += b;
    h === this.l &&
      (this.isReady() !== this.l && C("seeded", Math.max(this.i, this.c)),
      C("progress", this.getProgress()));
  },
  isReady: function (a) {
    a = this.H[a !== t ? a : this.B];
    return this.i && this.i >= a
      ? this.h[0] > this.P && new Date().valueOf() > this.N
        ? this.w | this.u
        : this.u
      : this.c >= a
      ? this.w | this.l
      : this.l;
  },
  getProgress: function (a) {
    a = this.H[a ? a : this.B];
    return this.i >= a ? 1 : this.c > a ? 1 : this.c / a;
  },
  startCollectors: function () {
    this.p ||
      (window.addEventListener
        ? (window.addEventListener("load", this.r, u),
          window.addEventListener("mousemove", this.s, u))
        : document.attachEvent
        ? (document.attachEvent("onload", this.r),
          document.attachEvent("onmousemove", this.s))
        : q(new sjcl.exception.bug("can't attach event")),
      (this.p = !0));
  },
  stopCollectors: function () {
    this.p &&
      (window.removeEventListener
        ? (window.removeEventListener("load", this.r, u),
          window.removeEventListener("mousemove", this.s, u))
        : window.detachEvent &&
          (window.detachEvent("onload", this.r),
          window.detachEvent("onmousemove", this.s)),
      (this.p = u));
  },
  addEventListener: function (a, b) {
    this.z[a][this.S++] = b;
  },
  removeEventListener: function (a, b) {
    var c,
      d,
      e = this.z[a],
      f = [];
    for (d in e) e.hasOwnProperty(d) && e[d] === b && f.push(d);
    for (c = 0; c < f.length; c++) (d = f[c]), delete e[d];
  },
  s: function (a) {
    sjcl.random.addEntropy(
      [a.x || a.clientX || a.offsetX || 0, a.y || a.clientY || a.offsetY || 0],
      2,
      "mouse"
    );
  },
  r: function () {
    sjcl.random.addEntropy(new Date().valueOf(), 2, "loadtime");
  },
};
function C(a, b) {
  var c,
    d = sjcl.random.z[a],
    e = [];
  for (c in d) d.hasOwnProperty(c) && e.push(d[c]);
  for (c = 0; c < e.length; c++) e[c](b);
}
function A(a) {
  a.a = B(a).concat(B(a));
  a.A = new sjcl.cipher.aes(a.a);
}
function B(a) {
  for (var b = 0; 4 > b && !((a.e[b] = (a.e[b] + 1) | 0), a.e[b]); b++);
  return a.A.encrypt(a.e);
}
sjcl.random = new sjcl.prng(6);
try {
  var D = new Uint32Array(32);
  crypto.getRandomValues(D);
  sjcl.random.addEntropy(D, 1024, "crypto['getRandomValues']");
} catch (E) {}
sjcl.json = {
  defaults: {
    v: 1,
    iter: 1e3,
    ks: 128,
    ts: 64,
    mode: "ccm",
    adata: "",
    cipher: "aes",
  },
  encrypt: function (a, b, c, d) {
    c = c || {};
    d = d || {};
    var e = sjcl.json,
      f = e.d({ iv: sjcl.random.randomWords(4, 0) }, e.defaults),
      g;
    e.d(f, c);
    c = f.adata;
    "string" === typeof f.salt && (f.salt = sjcl.codec.base64.toBits(f.salt));
    "string" === typeof f.iv && (f.iv = sjcl.codec.base64.toBits(f.iv));
    (!sjcl.mode[f.mode] ||
      !sjcl.cipher[f.cipher] ||
      ("string" === typeof a && 100 >= f.iter) ||
      (64 !== f.ts && 96 !== f.ts && 128 !== f.ts) ||
      (128 !== f.ks && 192 !== f.ks && 256 !== f.ks) ||
      2 > f.iv.length ||
      4 < f.iv.length) &&
      q(new sjcl.exception.invalid("json encrypt: invalid parameters"));
    "string" === typeof a &&
      ((g = sjcl.misc.cachedPbkdf2(a, f)),
      (a = g.key.slice(0, f.ks / 32)),
      (f.salt = g.salt));
    "string" === typeof b && (b = sjcl.codec.utf8String.toBits(b));
    "string" === typeof c && (c = sjcl.codec.utf8String.toBits(c));
    g = new sjcl.cipher[f.cipher](a);
    e.d(d, f);
    d.key = a;
    f.ct = sjcl.mode[f.mode].encrypt(g, b, f.iv, c, f.ts);
    return e.encode(f);
  },
  decrypt: function (a, b, c, d) {
    c = c || {};
    d = d || {};
    var e = sjcl.json;
    b = e.d(e.d(e.d({}, e.defaults), e.decode(b)), c, !0);
    var f;
    c = b.adata;
    "string" === typeof b.salt && (b.salt = sjcl.codec.base64.toBits(b.salt));
    "string" === typeof b.iv && (b.iv = sjcl.codec.base64.toBits(b.iv));
    (!sjcl.mode[b.mode] ||
      !sjcl.cipher[b.cipher] ||
      ("string" === typeof a && 100 >= b.iter) ||
      (64 !== b.ts && 96 !== b.ts && 128 !== b.ts) ||
      (128 !== b.ks && 192 !== b.ks && 256 !== b.ks) ||
      !b.iv ||
      2 > b.iv.length ||
      4 < b.iv.length) &&
      q(new sjcl.exception.invalid("json decrypt: invalid parameters"));
    "string" === typeof a &&
      ((f = sjcl.misc.cachedPbkdf2(a, b)),
      (a = f.key.slice(0, b.ks / 32)),
      (b.salt = f.salt));
    "string" === typeof c && (c = sjcl.codec.utf8String.toBits(c));
    f = new sjcl.cipher[b.cipher](a);
    c = sjcl.mode[b.mode].decrypt(f, b.ct, b.iv, c, b.ts);
    e.d(d, b);
    d.key = a;
    return sjcl.codec.utf8String.fromBits(c);
  },
  encode: function (a) {
    var b,
      c = "{",
      d = "";
    for (b in a)
      if (a.hasOwnProperty(b))
        switch (
          (b.match(/^[a-z0-9]+$/i) ||
            q(new sjcl.exception.invalid("json encode: invalid property name")),
          (c += d + '"' + b + '":'),
          (d = ","),
          typeof a[b])
        ) {
          case "number":
          case "boolean":
            c += a[b];
            break;
          case "string":
            c += '"' + escape(a[b]) + '"';
            break;
          case "object":
            c += '"' + sjcl.codec.base64.fromBits(a[b], 0) + '"';
            break;
          default:
            q(new sjcl.exception.bug("json encode: unsupported type"));
        }
    return c + "}";
  },
  decode: function (a) {
    a = a.replace(/\s/g, "");
    a.match(/^\{.*\}$/) ||
      q(new sjcl.exception.invalid("json decode: this isn't json!"));
    a = a.replace(/^\{|\}$/g, "").split(/,/);
    var b = {},
      c,
      d;
    for (c = 0; c < a.length; c++)
      (d = a[c].match(
        /^(?:(["']?)([a-z][a-z0-9]*)\1):(?:(\d+)|"([a-z0-9+\/%*_.@=\-]*)")$/i
      )) || q(new sjcl.exception.invalid("json decode: this isn't json!")),
        (b[d[2]] = d[3]
          ? parseInt(d[3], 10)
          : d[2].match(/^(ct|salt|iv)$/)
          ? sjcl.codec.base64.toBits(d[4])
          : unescape(d[4]));
    return b;
  },
  d: function (a, b, c) {
    a === t && (a = {});
    if (b === t) return a;
    for (var d in b)
      b.hasOwnProperty(d) &&
        (c &&
          a[d] !== t &&
          a[d] !== b[d] &&
          q(new sjcl.exception.invalid("required parameter overridden")),
        (a[d] = b[d]));
    return a;
  },
  X: function (a, b) {
    var c = {},
      d;
    for (d in a) a.hasOwnProperty(d) && a[d] !== b[d] && (c[d] = a[d]);
    return c;
  },
  W: function (a, b) {
    var c = {},
      d;
    for (d = 0; d < b.length; d++) a[b[d]] !== t && (c[b[d]] = a[b[d]]);
    return c;
  },
};
sjcl.encrypt = sjcl.json.encrypt;
sjcl.decrypt = sjcl.json.decrypt;
sjcl.misc.V = {};
sjcl.misc.cachedPbkdf2 = function (a, b) {
  var c = sjcl.misc.V,
    d;
  b = b || {};
  d = b.iter || 1e3;
  c = c[a] = c[a] || {};
  d = c[d] = c[d] || {
    firstSalt:
      b.salt && b.salt.length ? b.salt.slice(0) : sjcl.random.randomWords(2, 0),
  };
  c = b.salt === t ? d.firstSalt : b.salt;
  d[c] = d[c] || sjcl.misc.pbkdf2(a, c, b.iter);
  return { key: d[c].slice(0), salt: c.slice(0) };
};
(function () {
  var p = this,
    C = p._,
    m = {},
    i = Array.prototype,
    n = Object.prototype,
    f = i.slice,
    D = i.unshift,
    E = n.toString,
    l = n.hasOwnProperty,
    s = i.forEach,
    t = i.map,
    u = i.reduce,
    v = i.reduceRight,
    w = i.filter,
    x = i.every,
    y = i.some,
    o = i.indexOf,
    z = i.lastIndexOf;
  n = Array.isArray;
  var F = Object.keys,
    q = Function.prototype.bind,
    b = function (a) {
      return new j(a);
    };
  typeof module !== "undefined" && module.exports
    ? ((module.exports = b), (b._ = b))
    : (p._ = b);
  b.VERSION = "1.1.6";
  var h =
    (b.each =
    b.forEach =
      function (a, c, d) {
        if (a != null)
          if (s && a.forEach === s) a.forEach(c, d);
          else if (b.isNumber(a.length))
            for (var e = 0, k = a.length; e < k; e++) {
              if (c.call(d, a[e], e, a) === m) break;
            }
          else
            for (e in a) if (l.call(a, e) && c.call(d, a[e], e, a) === m) break;
      });
  b.map = function (a, c, b) {
    var e = [];
    if (a == null) return e;
    if (t && a.map === t) return a.map(c, b);
    h(a, function (a, g, G) {
      e[e.length] = c.call(b, a, g, G);
    });
    return e;
  };
  b.reduce =
    b.foldl =
    b.inject =
      function (a, c, d, e) {
        var k = d !== void 0;
        a == null && (a = []);
        if (u && a.reduce === u)
          return e && (c = b.bind(c, e)), k ? a.reduce(c, d) : a.reduce(c);
        h(a, function (a, b, f) {
          !k && b === 0 ? ((d = a), (k = !0)) : (d = c.call(e, d, a, b, f));
        });
        if (!k)
          throw new TypeError("Reduce of empty array with no initial value");
        return d;
      };
  b.reduceRight = b.foldr = function (a, c, d, e) {
    a == null && (a = []);
    if (v && a.reduceRight === v)
      return (
        e && (c = b.bind(c, e)),
        d !== void 0 ? a.reduceRight(c, d) : a.reduceRight(c)
      );
    a = (b.isArray(a) ? a.slice() : b.toArray(a)).reverse();
    return b.reduce(a, c, d, e);
  };
  b.find = b.detect = function (a, c, b) {
    var e;
    A(a, function (a, g, f) {
      if (c.call(b, a, g, f)) return (e = a), !0;
    });
    return e;
  };
  b.filter = b.select = function (a, c, b) {
    var e = [];
    if (a == null) return e;
    if (w && a.filter === w) return a.filter(c, b);
    h(a, function (a, g, f) {
      c.call(b, a, g, f) && (e[e.length] = a);
    });
    return e;
  };
  b.reject = function (a, c, b) {
    var e = [];
    if (a == null) return e;
    h(a, function (a, g, f) {
      c.call(b, a, g, f) || (e[e.length] = a);
    });
    return e;
  };
  b.every = b.all = function (a, c, b) {
    var e = !0;
    if (a == null) return e;
    if (x && a.every === x) return a.every(c, b);
    h(a, function (a, g, f) {
      if (!(e = e && c.call(b, a, g, f))) return m;
    });
    return e;
  };
  var A =
    (b.some =
    b.any =
      function (a, c, d) {
        c || (c = b.identity);
        var e = !1;
        if (a == null) return e;
        if (y && a.some === y) return a.some(c, d);
        h(a, function (a, b, f) {
          if ((e = c.call(d, a, b, f))) return m;
        });
        return e;
      });
  b.include = b.contains = function (a, c) {
    var b = !1;
    if (a == null) return b;
    if (o && a.indexOf === o) return a.indexOf(c) != -1;
    A(a, function (a) {
      if ((b = a === c)) return !0;
    });
    return b;
  };
  b.invoke = function (a, c) {
    var d = f.call(arguments, 2);
    return b.map(a, function (a) {
      return (c.call ? c || a : a[c]).apply(a, d);
    });
  };
  b.pluck = function (a, c) {
    return b.map(a, function (a) {
      return a[c];
    });
  };
  b.max = function (a, c, d) {
    if (!c && b.isArray(a)) return Math.max.apply(Math, a);
    var e = { computed: -Infinity };
    h(a, function (a, b, f) {
      b = c ? c.call(d, a, b, f) : a;
      b >= e.computed && (e = { value: a, computed: b });
    });
    return e.value;
  };
  b.min = function (a, c, d) {
    if (!c && b.isArray(a)) return Math.min.apply(Math, a);
    var e = { computed: Infinity };
    h(a, function (a, b, f) {
      b = c ? c.call(d, a, b, f) : a;
      b < e.computed && (e = { value: a, computed: b });
    });
    return e.value;
  };
  b.sortBy = function (a, c, d) {
    return b.pluck(
      b
        .map(a, function (a, b, f) {
          return { value: a, criteria: c.call(d, a, b, f) };
        })
        .sort(function (a, b) {
          var c = a.criteria,
            d = b.criteria;
          return c < d ? -1 : c > d ? 1 : 0;
        }),
      "value"
    );
  };
  b.sortedIndex = function (a, c, d) {
    d || (d = b.identity);
    for (var e = 0, f = a.length; e < f; ) {
      var g = (e + f) >> 1;
      d(a[g]) < d(c) ? (e = g + 1) : (f = g);
    }
    return e;
  };
  b.toArray = function (a) {
    if (!a) return [];
    if (a.toArray) return a.toArray();
    if (b.isArray(a)) return a;
    if (b.isArguments(a)) return f.call(a);
    return b.values(a);
  };
  b.size = function (a) {
    return b.toArray(a).length;
  };
  b.first = b.head = function (a, b, d) {
    return b != null && !d ? f.call(a, 0, b) : a[0];
  };
  b.rest = b.tail = function (a, b, d) {
    return f.call(a, b == null || d ? 1 : b);
  };
  b.last = function (a) {
    return a[a.length - 1];
  };
  b.compact = function (a) {
    return b.filter(a, function (a) {
      return !!a;
    });
  };
  b.flatten = function (a) {
    return b.reduce(
      a,
      function (a, d) {
        if (b.isArray(d)) return a.concat(b.flatten(d));
        a[a.length] = d;
        return a;
      },
      []
    );
  };
  b.without = function (a) {
    var c = f.call(arguments, 1);
    return b.filter(a, function (a) {
      return !b.include(c, a);
    });
  };
  b.uniq = b.unique = function (a, c) {
    return b.reduce(
      a,
      function (a, e, f) {
        if (0 == f || (c === !0 ? b.last(a) != e : !b.include(a, e)))
          a[a.length] = e;
        return a;
      },
      []
    );
  };
  b.intersect = function (a) {
    var c = f.call(arguments, 1);
    return b.filter(b.uniq(a), function (a) {
      return b.every(c, function (c) {
        return b.indexOf(c, a) >= 0;
      });
    });
  };
  b.zip = function () {
    for (
      var a = f.call(arguments),
        c = b.max(b.pluck(a, "length")),
        d = Array(c),
        e = 0;
      e < c;
      e++
    )
      d[e] = b.pluck(a, "" + e);
    return d;
  };
  b.indexOf = function (a, c, d) {
    if (a == null) return -1;
    var e;
    if (d) return (d = b.sortedIndex(a, c)), a[d] === c ? d : -1;
    if (o && a.indexOf === o) return a.indexOf(c);
    d = 0;
    for (e = a.length; d < e; d++) if (a[d] === c) return d;
    return -1;
  };
  b.lastIndexOf = function (a, b) {
    if (a == null) return -1;
    if (z && a.lastIndexOf === z) return a.lastIndexOf(b);
    for (var d = a.length; d--; ) if (a[d] === b) return d;
    return -1;
  };
  b.range = function (a, b, d) {
    arguments.length <= 1 && ((b = a || 0), (a = 0));
    d = arguments[2] || 1;
    for (
      var e = Math.max(Math.ceil((b - a) / d), 0), f = 0, g = Array(e);
      f < e;

    )
      (g[f++] = a), (a += d);
    return g;
  };
  b.bind = function (a, b) {
    if (a.bind === q && q) return q.apply(a, f.call(arguments, 1));
    var d = f.call(arguments, 2);
    return function () {
      return a.apply(b, d.concat(f.call(arguments)));
    };
  };
  b.bindAll = function (a) {
    var c = f.call(arguments, 1);
    c.length == 0 && (c = b.functions(a));
    h(c, function (c) {
      a[c] = b.bind(a[c], a);
    });
    return a;
  };
  b.memoize = function (a, c) {
    var d = {};
    c || (c = b.identity);
    return function () {
      var b = c.apply(this, arguments);
      return l.call(d, b) ? d[b] : (d[b] = a.apply(this, arguments));
    };
  };
  b.delay = function (a, b) {
    var d = f.call(arguments, 2);
    return setTimeout(function () {
      return a.apply(a, d);
    }, b);
  };
  b.defer = function (a) {
    return b.delay.apply(b, [a, 1].concat(f.call(arguments, 1)));
  };
  var B = function (a, b, d) {
    var e;
    return function () {
      var f = this,
        g = arguments,
        h = function () {
          e = null;
          a.apply(f, g);
        };
      d && clearTimeout(e);
      if (d || !e) e = setTimeout(h, b);
    };
  };
  b.throttle = function (a, b) {
    return B(a, b, !1);
  };
  b.debounce = function (a, b) {
    return B(a, b, !0);
  };
  b.once = function (a) {
    var b = !1,
      d;
    return function () {
      if (b) return d;
      b = !0;
      return (d = a.apply(this, arguments));
    };
  };
  b.wrap = function (a, b) {
    return function () {
      var d = [a].concat(f.call(arguments));
      return b.apply(this, d);
    };
  };
  b.compose = function () {
    var a = f.call(arguments);
    return function () {
      for (var b = f.call(arguments), d = a.length - 1; d >= 0; d--)
        b = [a[d].apply(this, b)];
      return b[0];
    };
  };
  b.after = function (a, b) {
    return function () {
      if (--a < 1) return b.apply(this, arguments);
    };
  };
  b.keys =
    F ||
    function (a) {
      if (a !== Object(a)) throw new TypeError("Invalid object");
      var b = [],
        d;
      for (d in a) l.call(a, d) && (b[b.length] = d);
      return b;
    };
  b.values = function (a) {
    return b.map(a, b.identity);
  };
  b.functions = b.methods = function (a) {
    return b
      .filter(b.keys(a), function (c) {
        return b.isFunction(a[c]);
      })
      .sort();
  };
  b.extend = function (a) {
    h(f.call(arguments, 1), function (b) {
      for (var d in b) b[d] !== void 0 && (a[d] = b[d]);
    });
    return a;
  };
  b.defaults = function (a) {
    h(f.call(arguments, 1), function (b) {
      for (var d in b) a[d] == null && (a[d] = b[d]);
    });
    return a;
  };
  b.clone = function (a) {
    return b.isArray(a) ? a.slice() : b.extend({}, a);
  };
  b.tap = function (a, b) {
    b(a);
    return a;
  };
  b.isEqual = function (a, c) {
    if (a === c) return !0;
    var d = typeof a;
    if (d != typeof c) return !1;
    if (a == c) return !0;
    if ((!a && c) || (a && !c)) return !1;
    if (a._chain) a = a._wrapped;
    if (c._chain) c = c._wrapped;
    if (a.isEqual) return a.isEqual(c);
    if (b.isDate(a) && b.isDate(c)) return a.getTime() === c.getTime();
    if (b.isNaN(a) && b.isNaN(c)) return !1;
    if (b.isRegExp(a) && b.isRegExp(c))
      return (
        a.source === c.source &&
        a.global === c.global &&
        a.ignoreCase === c.ignoreCase &&
        a.multiline === c.multiline
      );
    if (d !== "object") return !1;
    if (a.length && a.length !== c.length) return !1;
    d = b.keys(a);
    var e = b.keys(c);
    if (d.length != e.length) return !1;
    for (var f in a) if (!(f in c) || !b.isEqual(a[f], c[f])) return !1;
    return !0;
  };
  b.isEmpty = function (a) {
    if (b.isArray(a) || b.isString(a)) return a.length === 0;
    for (var c in a) if (l.call(a, c)) return !1;
    return !0;
  };
  b.isElement = function (a) {
    return !!(a && a.nodeType == 1);
  };
  b.isArray =
    n ||
    function (a) {
      return E.call(a) === "[object Array]";
    };
  b.isArguments = function (a) {
    return !(!a || !l.call(a, "callee"));
  };
  b.isFunction = function (a) {
    return !(!a || !a.constructor || !a.call || !a.apply);
  };
  b.isString = function (a) {
    return !!(a === "" || (a && a.charCodeAt && a.substr));
  };
  b.isNumber = function (a) {
    return !!(a === 0 || (a && a.toExponential && a.toFixed));
  };
  b.isNaN = function (a) {
    return a !== a;
  };
  b.isBoolean = function (a) {
    return a === !0 || a === !1;
  };
  b.isDate = function (a) {
    return !(!a || !a.getTimezoneOffset || !a.setUTCFullYear);
  };
  b.isRegExp = function (a) {
    return !(
      !a ||
      !a.test ||
      !a.exec ||
      !(a.ignoreCase || a.ignoreCase === !1)
    );
  };
  b.isNull = function (a) {
    return a === null;
  };
  b.isUndefined = function (a) {
    return a === void 0;
  };
  b.noConflict = function () {
    p._ = C;
    return this;
  };
  b.identity = function (a) {
    return a;
  };
  b.times = function (a, b, d) {
    for (var e = 0; e < a; e++) b.call(d, e);
  };
  b.mixin = function (a) {
    h(b.functions(a), function (c) {
      H(c, (b[c] = a[c]));
    });
  };
  var I = 0;
  b.uniqueId = function (a) {
    var b = I++;
    return a ? a + b : b;
  };
  b.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
  };
  b.template = function (a, c) {
    var d = b.templateSettings;
    d =
      "var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('" +
      a
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(d.interpolate, function (a, b) {
          return "'," + b.replace(/\\'/g, "'") + ",'";
        })
        .replace(d.evaluate || null, function (a, b) {
          return (
            "');" +
            b.replace(/\\'/g, "'").replace(/[\r\n\t]/g, " ") +
            "__p.push('"
          );
        })
        .replace(/\r/g, "\\r")
        .replace(/\n/g, "\\n")
        .replace(/\t/g, "\\t") +
      "');}return __p.join('');";
    d = new Function("obj", d);
    return c ? d(c) : d;
  };
  var j = function (a) {
    this._wrapped = a;
  };
  b.prototype = j.prototype;
  var r = function (a, c) {
      return c ? b(a).chain() : a;
    },
    H = function (a, c) {
      j.prototype[a] = function () {
        var a = f.call(arguments);
        D.call(a, this._wrapped);
        return r(c.apply(b, a), this._chain);
      };
    };
  b.mixin(b);
  h(
    ["pop", "push", "reverse", "shift", "sort", "splice", "unshift"],
    function (a) {
      var b = i[a];
      j.prototype[a] = function () {
        b.apply(this._wrapped, arguments);
        return r(this._wrapped, this._chain);
      };
    }
  );
  h(["concat", "join", "slice"], function (a) {
    var b = i[a];
    j.prototype[a] = function () {
      return r(b.apply(this._wrapped, arguments), this._chain);
    };
  });
  j.prototype.chain = function () {
    this._chain = !0;
    return this;
  };
  j.prototype.value = function () {
    return this._wrapped;
  };
})();
(function () {
  if (window.jQuery) var _jQuery = window.jQuery;
  var jQuery = (window.jQuery = function (selector, context) {
    return new jQuery.prototype.init(selector, context);
  });
  if (window.$) var _$ = window.$;
  window.$ = jQuery;
  var quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#(\w+)$/;
  var isSimple = /^.[^:#\[\.]*$/;
  jQuery.fn = jQuery.prototype = {
    init: function (selector, context) {
      selector = selector || document;
      if (selector.nodeType) {
        this[0] = selector;
        this.length = 1;
        return this;
      } else if (typeof selector == "string") {
        var match = quickExpr.exec(selector);
        if (match && (match[1] || !context)) {
          if (match[1]) selector = jQuery.clean([match[1]], context);
          else {
            var elem = document.getElementById(match[3]);
            if (elem)
              if (elem.id != match[3]) return jQuery().find(selector);
              else {
                this[0] = elem;
                this.length = 1;
                return this;
              }
            else selector = [];
          }
        } else return new jQuery(context).find(selector);
      } else if (jQuery.isFunction(selector))
        return new jQuery(document)[jQuery.fn.ready ? "ready" : "load"](
          selector
        );
      return this.setArray(
        (selector.constructor == Array && selector) ||
          ((selector.jquery ||
            (selector.length &&
              selector != window &&
              !selector.nodeType &&
              selector[0] != undefined &&
              selector[0].nodeType)) &&
            jQuery.makeArray(selector)) || [selector]
      );
    },
    jquery: "1.2.2",
    size: function () {
      return this.length;
    },
    length: 0,
    get: function (num) {
      return num == undefined ? jQuery.makeArray(this) : this[num];
    },
    pushStack: function (elems) {
      var ret = jQuery(elems);
      ret.prevObject = this;
      return ret;
    },
    setArray: function (elems) {
      this.length = 0;
      Array.prototype.push.apply(this, elems);
      return this;
    },
    each: function (callback, args) {
      return jQuery.each(this, callback, args);
    },
    index: function (elem) {
      var ret = -1;
      this.each(function (i) {
        if (this == elem) ret = i;
      });
      return ret;
    },
    attr: function (name, value, type) {
      var options = name;
      if (name.constructor == String)
        if (value == undefined)
          return (
            (this.length && jQuery[type || "attr"](this[0], name)) || undefined
          );
        else {
          options = {};
          options[name] = value;
        }
      return this.each(function (i) {
        for (name in options)
          jQuery.attr(
            type ? this.style : this,
            name,
            jQuery.prop(this, options[name], type, i, name)
          );
      });
    },
    css: function (key, value) {
      if ((key == "width" || key == "height") && parseFloat(value) < 0)
        value = undefined;
      return this.attr(key, value, "curCSS");
    },
    text: function (text) {
      if (typeof text != "object" && text != null)
        return this.empty().append(
          ((this[0] && this[0].ownerDocument) || document).createTextNode(text)
        );
      var ret = "";
      jQuery.each(text || this, function () {
        jQuery.each(this.childNodes, function () {
          if (this.nodeType != 8)
            ret += this.nodeType != 1 ? this.nodeValue : jQuery.fn.text([this]);
        });
      });
      return ret;
    },
    wrapAll: function (html) {
      if (this[0])
        jQuery(html, this[0].ownerDocument)
          .clone()
          .insertBefore(this[0])
          .map(function () {
            var elem = this;
            while (elem.firstChild) elem = elem.firstChild;
            return elem;
          })
          .append(this);
      return this;
    },
    wrapInner: function (html) {
      return this.each(function () {
        jQuery(this).contents().wrapAll(html);
      });
    },
    wrap: function (html) {
      return this.each(function () {
        jQuery(this).wrapAll(html);
      });
    },
    append: function () {
      return this.domManip(arguments, true, false, function (elem) {
        if (this.nodeType == 1) this.appendChild(elem);
      });
    },
    prepend: function () {
      return this.domManip(arguments, true, true, function (elem) {
        if (this.nodeType == 1) this.insertBefore(elem, this.firstChild);
      });
    },
    before: function () {
      return this.domManip(arguments, false, false, function (elem) {
        this.parentNode.insertBefore(elem, this);
      });
    },
    after: function () {
      return this.domManip(arguments, false, true, function (elem) {
        this.parentNode.insertBefore(elem, this.nextSibling);
      });
    },
    end: function () {
      return this.prevObject || jQuery([]);
    },
    find: function (selector) {
      var elems = jQuery.map(this, function (elem) {
        return jQuery.find(selector, elem);
      });
      return this.pushStack(
        /[^+>] [^+>]/.test(selector) || selector.indexOf("..") > -1
          ? jQuery.unique(elems)
          : elems
      );
    },
    clone: function (events) {
      var ret = this.map(function () {
        if (jQuery.browser.msie && !jQuery.isXMLDoc(this)) {
          var clone = this.cloneNode(true),
            container = document.createElement("div"),
            container2 = document.createElement("div");
          container.appendChild(clone);
          container2.innerHTML = container.innerHTML;
          return container2.firstChild;
        } else return this.cloneNode(true);
      });
      var clone = ret
        .find("*")
        .andSelf()
        .each(function () {
          if (this[expando] != undefined) this[expando] = null;
        });
      if (events === true)
        this.find("*")
          .andSelf()
          .each(function (i) {
            if (this.nodeType == 3) return;
            var events = jQuery.data(this, "events");
            for (var type in events)
              for (var handler in events[type])
                jQuery.event.add(
                  clone[i],
                  type,
                  events[type][handler],
                  events[type][handler].data
                );
          });
      return ret;
    },
    filter: function (selector) {
      return this.pushStack(
        (jQuery.isFunction(selector) &&
          jQuery.grep(this, function (elem, i) {
            return selector.call(elem, i);
          })) ||
          jQuery.multiFilter(selector, this)
      );
    },
    not: function (selector) {
      if (selector.constructor == String)
        if (isSimple.test(selector))
          return this.pushStack(jQuery.multiFilter(selector, this, true));
        else selector = jQuery.multiFilter(selector, this);
      var isArrayLike =
        selector.length &&
        selector[selector.length - 1] !== undefined &&
        !selector.nodeType;
      return this.filter(function () {
        return isArrayLike
          ? jQuery.inArray(this, selector) < 0
          : this != selector;
      });
    },
    add: function (selector) {
      return !selector
        ? this
        : this.pushStack(
            jQuery.merge(
              this.get(),
              selector.constructor == String
                ? jQuery(selector).get()
                : selector.length != undefined &&
                  (!selector.nodeName || jQuery.nodeName(selector, "form"))
                ? selector
                : [selector]
            )
          );
    },
    is: function (selector) {
      return selector ? jQuery.multiFilter(selector, this).length > 0 : false;
    },
    hasClass: function (selector) {
      return this.is("." + selector);
    },
    val: function (value) {
      if (value == undefined) {
        if (this.length) {
          var elem = this[0];
          if (jQuery.nodeName(elem, "select")) {
            var index = elem.selectedIndex,
              values = [],
              options = elem.options,
              one = elem.type == "select-one";
            if (index < 0) return null;
            for (
              var i = one ? index : 0, max = one ? index + 1 : options.length;
              i < max;
              i++
            ) {
              var option = options[i];
              if (option.selected) {
                value =
                  jQuery.browser.msie && !option.attributes.value.specified
                    ? option.text
                    : option.value;
                if (one) return value;
                values.push(value);
              }
            }
            return values;
          } else return (this[0].value || "").replace(/\r/g, "");
        }
        return undefined;
      }
      return this.each(function () {
        if (this.nodeType != 1) return;
        if (value.constructor == Array && /radio|checkbox/.test(this.type))
          this.checked =
            jQuery.inArray(this.value, value) >= 0 ||
            jQuery.inArray(this.name, value) >= 0;
        else if (jQuery.nodeName(this, "select")) {
          var values = value.constructor == Array ? value : [value];
          jQuery("option", this).each(function () {
            this.selected =
              jQuery.inArray(this.value, values) >= 0 ||
              jQuery.inArray(this.text, values) >= 0;
          });
          if (!values.length) this.selectedIndex = -1;
        } else this.value = value;
      });
    },
    html: function (value) {
      return value == undefined
        ? this.length
          ? this[0].innerHTML
          : null
        : this.empty().append(value);
    },
    replaceWith: function (value) {
      return this.after(value).remove();
    },
    eq: function (i) {
      return this.slice(i, i + 1);
    },
    slice: function () {
      return this.pushStack(Array.prototype.slice.apply(this, arguments));
    },
    map: function (callback) {
      return this.pushStack(
        jQuery.map(this, function (elem, i) {
          return callback.call(elem, i, elem);
        })
      );
    },
    andSelf: function () {
      return this.add(this.prevObject);
    },
    domManip: function (args, table, reverse, callback) {
      var clone = this.length > 1,
        elems;
      return this.each(function () {
        if (!elems) {
          elems = jQuery.clean(args, this.ownerDocument);
          if (reverse) elems.reverse();
        }
        var obj = this;
        if (
          table &&
          jQuery.nodeName(this, "table") &&
          jQuery.nodeName(elems[0], "tr")
        )
          obj =
            this.getElementsByTagName("tbody")[0] ||
            this.appendChild(this.ownerDocument.createElement("tbody"));
        var scripts = jQuery([]);
        jQuery.each(elems, function () {
          var elem = clone ? jQuery(this).clone(true)[0] : this;
          if (jQuery.nodeName(elem, "script")) {
            scripts = scripts.add(elem);
          } else {
            if (elem.nodeType == 1)
              scripts = scripts.add(jQuery("script", elem).remove());
            callback.call(obj, elem);
          }
        });
        scripts.each(evalScript);
      });
    },
  };
  jQuery.prototype.init.prototype = jQuery.prototype;
  function evalScript(i, elem) {
    if (elem.src)
      jQuery.ajax({ url: elem.src, async: false, dataType: "script" });
    else
      jQuery.globalEval(elem.text || elem.textContent || elem.innerHTML || "");
    if (elem.parentNode) elem.parentNode.removeChild(elem);
  }
  jQuery.extend = jQuery.fn.extend = function () {
    var target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false,
      options;
    if (target.constructor == Boolean) {
      deep = target;
      target = arguments[1] || {};
      i = 2;
    }
    if (typeof target != "object" && typeof target != "function") target = {};
    if (length == 1) {
      target = this;
      i = 0;
    }
    for (; i < length; i++)
      if ((options = arguments[i]) != null)
        for (var name in options) {
          if (target === options[name]) continue;
          if (
            deep &&
            options[name] &&
            typeof options[name] == "object" &&
            target[name] &&
            !options[name].nodeType
          )
            target[name] = jQuery.extend(target[name], options[name]);
          else if (options[name] != undefined) target[name] = options[name];
        }
    return target;
  };
  var expando = "jQuery" + new Date().getTime(),
    uuid = 0,
    windowData = {};
  var exclude = /z-?index|font-?weight|opacity|zoom|line-?height/i;
  jQuery.extend({
    noConflict: function (deep) {
      window.$ = _$;
      if (deep) window.jQuery = _jQuery;
      return jQuery;
    },
    isFunction: function (fn) {
      return (
        !!fn &&
        typeof fn != "string" &&
        !fn.nodeName &&
        fn.constructor != Array &&
        /function/i.test(fn + "")
      );
    },
    isXMLDoc: function (elem) {
      return (
        (elem.documentElement && !elem.body) ||
        (elem.tagName && elem.ownerDocument && !elem.ownerDocument.body)
      );
    },
    globalEval: function (data) {
      data = jQuery.trim(data);
      if (data) {
        var head =
            document.getElementsByTagName("head")[0] ||
            document.documentElement,
          script = document.createElement("script");
        script.type = "text/javascript";
        if (jQuery.browser.msie) script.text = data;
        else script.appendChild(document.createTextNode(data));
        head.appendChild(script);
        head.removeChild(script);
      }
    },
    nodeName: function (elem, name) {
      return elem.nodeName && elem.nodeName.toUpperCase() == name.toUpperCase();
    },
    cache: {},
    data: function (elem, name, data) {
      elem = elem == window ? windowData : elem;
      var id = elem[expando];
      if (!id) id = elem[expando] = ++uuid;
      if (name && !jQuery.cache[id]) jQuery.cache[id] = {};
      if (data != undefined) jQuery.cache[id][name] = data;
      return name ? jQuery.cache[id][name] : id;
    },
    removeData: function (elem, name) {
      elem = elem == window ? windowData : elem;
      var id = elem[expando];
      if (name) {
        if (jQuery.cache[id]) {
          delete jQuery.cache[id][name];
          name = "";
          for (name in jQuery.cache[id]) break;
          if (!name) jQuery.removeData(elem);
        }
      } else {
        try {
          delete elem[expando];
        } catch (e) {
          if (elem.removeAttribute) elem.removeAttribute(expando);
        }
        delete jQuery.cache[id];
      }
    },
    each: function (object, callback, args) {
      if (args) {
        if (object.length == undefined) {
          for (var name in object)
            if (callback.apply(object[name], args) === false) break;
        } else
          for (var i = 0, length = object.length; i < length; i++)
            if (callback.apply(object[i], args) === false) break;
      } else {
        if (object.length == undefined) {
          for (var name in object)
            if (callback.call(object[name], name, object[name]) === false)
              break;
        } else
          for (
            var i = 0, length = object.length, value = object[0];
            i < length && callback.call(value, i, value) !== false;
            value = object[++i]
          ) {}
      }
      return object;
    },
    prop: function (elem, value, type, i, name) {
      if (jQuery.isFunction(value)) value = value.call(elem, i);
      return value &&
        value.constructor == Number &&
        type == "curCSS" &&
        !exclude.test(name)
        ? value + "px"
        : value;
    },
    className: {
      add: function (elem, classNames) {
        jQuery.each((classNames || "").split(/\s+/), function (i, className) {
          if (
            elem.nodeType == 1 &&
            !jQuery.className.has(elem.className, className)
          )
            elem.className += (elem.className ? " " : "") + className;
        });
      },
      remove: function (elem, classNames) {
        if (elem.nodeType == 1)
          elem.className =
            classNames != undefined
              ? jQuery
                  .grep(elem.className.split(/\s+/), function (className) {
                    return !jQuery.className.has(classNames, className);
                  })
                  .join(" ")
              : "";
      },
      has: function (elem, className) {
        return (
          jQuery.inArray(
            className,
            (elem.className || elem).toString().split(/\s+/)
          ) > -1
        );
      },
    },
    swap: function (elem, options, callback) {
      var old = {};
      for (var name in options) {
        old[name] = elem.style[name];
        elem.style[name] = options[name];
      }
      callback.call(elem);
      for (var name in options) elem.style[name] = old[name];
    },
    css: function (elem, name, force) {
      if (name == "width" || name == "height") {
        var val,
          props = {
            position: "absolute",
            visibility: "hidden",
            display: "block",
          },
          which = name == "width" ? ["Left", "Right"] : ["Top", "Bottom"];
        function getWH() {
          val = name == "width" ? elem.offsetWidth : elem.offsetHeight;
          var padding = 0,
            border = 0;
          jQuery.each(which, function () {
            padding +=
              parseFloat(jQuery.curCSS(elem, "padding" + this, true)) || 0;
            border +=
              parseFloat(
                jQuery.curCSS(elem, "border" + this + "Width", true)
              ) || 0;
          });
          val -= Math.round(padding + border);
        }
        if (jQuery(elem).is(":visible")) getWH();
        else jQuery.swap(elem, props, getWH);
        return Math.max(0, val);
      }
      return jQuery.curCSS(elem, name, force);
    },
    curCSS: function (elem, name, force) {
      var ret;
      function color(elem) {
        if (!jQuery.browser.safari) return false;
        var ret = document.defaultView.getComputedStyle(elem, null);
        return !ret || ret.getPropertyValue("color") == "";
      }
      if (name == "opacity" && jQuery.browser.msie) {
        ret = jQuery.attr(elem.style, "opacity");
        return ret == "" ? "1" : ret;
      }
      if (jQuery.browser.opera && name == "display") {
        var save = elem.style.display;
        elem.style.display = "block";
        elem.style.display = save;
      }
      if (name.match(/float/i)) name = styleFloat;
      if (!force && elem.style && elem.style[name]) ret = elem.style[name];
      else if (document.defaultView && document.defaultView.getComputedStyle) {
        if (name.match(/float/i)) name = "float";
        name = name.replace(/([A-Z])/g, "-$1").toLowerCase();
        var getComputedStyle = document.defaultView.getComputedStyle(
          elem,
          null
        );
        if (getComputedStyle && !color(elem))
          ret = getComputedStyle.getPropertyValue(name);
        else {
          var swap = [],
            stack = [];
          for (var a = elem; a && color(a); a = a.parentNode) stack.unshift(a);
          for (var i = 0; i < stack.length; i++)
            if (color(stack[i])) {
              swap[i] = stack[i].style.display;
              stack[i].style.display = "block";
            }
          ret =
            name == "display" && swap[stack.length - 1] != null
              ? "none"
              : (getComputedStyle && getComputedStyle.getPropertyValue(name)) ||
                "";
          for (var i = 0; i < swap.length; i++)
            if (swap[i] != null) stack[i].style.display = swap[i];
        }
        if (name == "opacity" && ret == "") ret = "1";
      } else if (elem.currentStyle) {
        var camelCase = name.replace(/\-(\w)/g, function (all, letter) {
          return letter.toUpperCase();
        });
        ret = elem.currentStyle[name] || elem.currentStyle[camelCase];
        if (!/^\d+(px)?$/i.test(ret) && /^\d/.test(ret)) {
          var style = elem.style.left,
            runtimeStyle = elem.runtimeStyle.left;
          elem.runtimeStyle.left = elem.currentStyle.left;
          elem.style.left = ret || 0;
          ret = elem.style.pixelLeft + "px";
          elem.style.left = style;
          elem.runtimeStyle.left = runtimeStyle;
        }
      }
      return ret;
    },
    clean: function (elems, context) {
      var ret = [];
      context = context || document;
      if (typeof context.createElement == "undefined")
        context =
          context.ownerDocument ||
          (context[0] && context[0].ownerDocument) ||
          document;
      jQuery.each(elems, function (i, elem) {
        if (!elem) return;
        if (elem.constructor == Number) elem = elem.toString();
        if (typeof elem == "string") {
          elem = elem.replace(/(<(\w+)[^>]*?)\/>/g, function (all, front, tag) {
            return tag.match(
              /^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i
            )
              ? all
              : front + "></" + tag + ">";
          });
          var tags = jQuery.trim(elem).toLowerCase(),
            div = context.createElement("div");
          var wrap = (!tags.indexOf("<opt") && [
            1,
            "<select multiple='multiple'>",
            "</select>",
          ]) ||
            (!tags.indexOf("<leg") && [1, "<fieldset>", "</fieldset>"]) ||
            (tags.match(/^<(thead|tbody|tfoot|colg|cap)/) && [
              1,
              "<table>",
              "</table>",
            ]) ||
            (!tags.indexOf("<tr") && [
              2,
              "<table><tbody>",
              "</tbody></table>",
            ]) ||
            ((!tags.indexOf("<td") || !tags.indexOf("<th")) && [
              3,
              "<table><tbody><tr>",
              "</tr></tbody></table>",
            ]) ||
            (!tags.indexOf("<col") && [
              2,
              "<table><tbody></tbody><colgroup>",
              "</colgroup></table>",
            ]) ||
            (jQuery.browser.msie && [1, "div<div>", "</div>"]) || [0, "", ""];
          div.innerHTML = wrap[1] + elem + wrap[2];
          while (wrap[0]--) div = div.lastChild;
          if (jQuery.browser.msie) {
            var tbody =
              !tags.indexOf("<table") && tags.indexOf("<tbody") < 0
                ? div.firstChild && div.firstChild.childNodes
                : wrap[1] == "<table>" && tags.indexOf("<tbody") < 0
                ? div.childNodes
                : [];
            for (var j = tbody.length - 1; j >= 0; --j)
              if (
                jQuery.nodeName(tbody[j], "tbody") &&
                !tbody[j].childNodes.length
              )
                tbody[j].parentNode.removeChild(tbody[j]);
            if (/^\s/.test(elem))
              div.insertBefore(
                context.createTextNode(elem.match(/^\s*/)[0]),
                div.firstChild
              );
          }
          elem = jQuery.makeArray(div.childNodes);
        }
        if (
          elem.length === 0 &&
          !jQuery.nodeName(elem, "form") &&
          !jQuery.nodeName(elem, "select")
        )
          return;
        if (
          elem[0] == undefined ||
          jQuery.nodeName(elem, "form") ||
          elem.options
        )
          ret.push(elem);
        else ret = jQuery.merge(ret, elem);
      });
      return ret;
    },
    attr: function (elem, name, value) {
      if (!elem || elem.nodeType == 3 || elem.nodeType == 8) return undefined;
      var fix = jQuery.isXMLDoc(elem) ? {} : jQuery.props;
      if (name == "selected" && jQuery.browser.safari)
        elem.parentNode.selectedIndex;
      if (fix[name]) {
        if (value != undefined) elem[fix[name]] = value;
        return elem[fix[name]];
      } else if (jQuery.browser.msie && name == "style")
        return jQuery.attr(elem.style, "cssText", value);
      else if (
        value == undefined &&
        jQuery.browser.msie &&
        jQuery.nodeName(elem, "form") &&
        (name == "action" || name == "method")
      )
        return elem.getAttributeNode(name).nodeValue;
      else if (elem.tagName) {
        if (value != undefined) {
          if (
            name == "type" &&
            jQuery.nodeName(elem, "input") &&
            elem.parentNode
          )
            throw "type property can't be changed";
          elem.setAttribute(name, "" + value);
        }
        if (
          jQuery.browser.msie &&
          /href|src/.test(name) &&
          !jQuery.isXMLDoc(elem)
        )
          return elem.getAttribute(name, 2);
        return elem.getAttribute(name);
      } else {
        if (name == "opacity" && jQuery.browser.msie) {
          if (value != undefined) {
            elem.zoom = 1;
            elem.filter =
              (elem.filter || "").replace(/alpha\([^)]*\)/, "") +
              (parseFloat(value).toString() == "NaN"
                ? ""
                : "alpha(opacity=" + value * 100 + ")");
          }
          return elem.filter && elem.filter.indexOf("opacity=") >= 0
            ? (
                parseFloat(elem.filter.match(/opacity=([^)]*)/)[1]) / 100
              ).toString()
            : "";
        }
        name = name.replace(/-([a-z])/gi, function (all, letter) {
          return letter.toUpperCase();
        });
        if (value != undefined) elem[name] = value;
        return elem[name];
      }
    },
    trim: function (text) {
      return (text || "").replace(/^\s+|\s+$/g, "");
    },
    makeArray: function (array) {
      var ret = [];
      if (typeof array != "array")
        for (var i = 0, length = array.length; i < length; i++)
          ret.push(array[i]);
      else ret = array.slice(0);
      return ret;
    },
    inArray: function (elem, array) {
      for (var i = 0, length = array.length; i < length; i++)
        if (array[i] == elem) return i;
      return -1;
    },
    merge: function (first, second) {
      if (jQuery.browser.msie) {
        for (var i = 0; second[i]; i++)
          if (second[i].nodeType != 8) first.push(second[i]);
      } else for (var i = 0; second[i]; i++) first.push(second[i]);
      return first;
    },
    unique: function (array) {
      var ret = [],
        done = {};
      try {
        for (var i = 0, length = array.length; i < length; i++) {
          var id = jQuery.data(array[i]);
          if (!done[id]) {
            done[id] = true;
            ret.push(array[i]);
          }
        }
      } catch (e) {
        ret = array;
      }
      return ret;
    },
    grep: function (elems, callback, inv) {
      if (typeof callback == "string")
        callback = eval("false||function(a,i){return " + callback + "}");
      var ret = [];
      for (var i = 0, length = elems.length; i < length; i++)
        if ((!inv && callback(elems[i], i)) || (inv && !callback(elems[i], i)))
          ret.push(elems[i]);
      return ret;
    },
    map: function (elems, callback) {
      var ret = [];
      for (var i = 0, length = elems.length; i < length; i++) {
        var value = callback(elems[i], i);
        if (value !== null && value != undefined) {
          if (value.constructor != Array) value = [value];
          ret = ret.concat(value);
        }
      }
      return ret;
    },
  });
  var userAgent = navigator.userAgent.toLowerCase();
  jQuery.browser = {
    version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
    safari: /webkit/.test(userAgent),
    opera: /opera/.test(userAgent),
    msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
    mozilla:
      /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent),
  };
  var styleFloat = jQuery.browser.msie ? "styleFloat" : "cssFloat";
  jQuery.extend({
    boxModel: !jQuery.browser.msie || document.compatMode == "CSS1Compat",
    props: {
      for: "htmlFor",
      class: "className",
      float: styleFloat,
      cssFloat: styleFloat,
      styleFloat: styleFloat,
      innerHTML: "innerHTML",
      className: "className",
      value: "value",
      disabled: "disabled",
      checked: "checked",
      readonly: "readOnly",
      selected: "selected",
      maxlength: "maxLength",
      selectedIndex: "selectedIndex",
      defaultValue: "defaultValue",
      tagName: "tagName",
      nodeName: "nodeName",
    },
  });
  jQuery.each(
    {
      parent: "elem.parentNode",
      parents: "jQuery.dir(elem,'parentNode')",
      next: "jQuery.nth(elem,2,'nextSibling')",
      prev: "jQuery.nth(elem,2,'previousSibling')",
      nextAll: "jQuery.dir(elem,'nextSibling')",
      prevAll: "jQuery.dir(elem,'previousSibling')",
      siblings: "jQuery.sibling(elem.parentNode.firstChild,elem)",
      children: "jQuery.sibling(elem.firstChild)",
      contents:
        "jQuery.nodeName(elem,'iframe')?elem.contentDocument||elem.contentWindow.document:jQuery.makeArray(elem.childNodes)",
    },
    function (name, fn) {
      fn = eval("false||function(elem){return " + fn + "}");
      jQuery.fn[name] = function (selector) {
        var ret = jQuery.map(this, fn);
        if (selector && typeof selector == "string")
          ret = jQuery.multiFilter(selector, ret);
        return this.pushStack(jQuery.unique(ret));
      };
    }
  );
  jQuery.each(
    {
      appendTo: "append",
      prependTo: "prepend",
      insertBefore: "before",
      insertAfter: "after",
      replaceAll: "replaceWith",
    },
    function (name, original) {
      jQuery.fn[name] = function () {
        var args = arguments;
        return this.each(function () {
          for (var i = 0, length = args.length; i < length; i++)
            jQuery(args[i])[original](this);
        });
      };
    }
  );
  jQuery.each(
    {
      removeAttr: function (name) {
        jQuery.attr(this, name, "");
        if (this.nodeType == 1) this.removeAttribute(name);
      },
      addClass: function (classNames) {
        jQuery.className.add(this, classNames);
      },
      removeClass: function (classNames) {
        jQuery.className.remove(this, classNames);
      },
      toggleClass: function (classNames) {
        jQuery.className[
          jQuery.className.has(this, classNames) ? "remove" : "add"
        ](this, classNames);
      },
      remove: function (selector) {
        if (!selector || jQuery.filter(selector, [this]).r.length) {
          jQuery("*", this)
            .add(this)
            .each(function () {
              jQuery.event.remove(this);
              jQuery.removeData(this);
            });
          if (this.parentNode) this.parentNode.removeChild(this);
        }
      },
      empty: function () {
        jQuery(">*", this).remove();
        while (this.firstChild) this.removeChild(this.firstChild);
      },
    },
    function (name, fn) {
      jQuery.fn[name] = function () {
        return this.each(fn, arguments);
      };
    }
  );
  jQuery.each(["Height", "Width"], function (i, name) {
    var type = name.toLowerCase();
    jQuery.fn[type] = function (size) {
      return this[0] == window
        ? (jQuery.browser.opera && document.body["client" + name]) ||
            (jQuery.browser.safari && window["inner" + name]) ||
            (document.compatMode == "CSS1Compat" &&
              document.documentElement["client" + name]) ||
            document.body["client" + name]
        : this[0] == document
        ? Math.max(
            Math.max(
              document.body["scroll" + name],
              document.documentElement["scroll" + name]
            ),
            Math.max(
              document.body["offset" + name],
              document.documentElement["offset" + name]
            )
          )
        : size == undefined
        ? this.length
          ? jQuery.css(this[0], type)
          : null
        : this.css(type, size.constructor == String ? size : size + "px");
    };
  });
  var chars =
      jQuery.browser.safari && parseInt(jQuery.browser.version) < 417
        ? "(?:[\\w*_-]|\\\\.)"
        : "(?:[\\wĨ-￿*_-]|\\\\.)",
    quickChild = new RegExp("^>\\s*(" + chars + "+)"),
    quickID = new RegExp("^(" + chars + "+)(#)(" + chars + "+)"),
    quickClass = new RegExp("^([#.]?)(" + chars + "*)");
  jQuery.extend({
    expr: {
      "": "m[2]=='*'||jQuery.nodeName(a,m[2])",
      "#": "a.getAttribute('id')==m[2]",
      ":": {
        lt: "i<m[3]-0",
        gt: "i>m[3]-0",
        nth: "m[3]-0==i",
        eq: "m[3]-0==i",
        first: "i==0",
        last: "i==r.length-1",
        even: "i%2==0",
        odd: "i%2",
        "first-child": "a.parentNode.getElementsByTagName('*')[0]==a",
        "last-child":
          "jQuery.nth(a.parentNode.lastChild,1,'previousSibling')==a",
        "only-child": "!jQuery.nth(a.parentNode.lastChild,2,'previousSibling')",
        parent: "a.firstChild",
        empty: "!a.firstChild",
        contains:
          "(a.textContent||a.innerText||jQuery(a).text()||'').indexOf(m[3])>=0",
        visible:
          '"hidden"!=a.type&&jQuery.css(a,"display")!="none"&&jQuery.css(a,"visibility")!="hidden"',
        hidden:
          '"hidden"==a.type||jQuery.css(a,"display")=="none"||jQuery.css(a,"visibility")=="hidden"',
        enabled: "!a.disabled",
        disabled: "a.disabled",
        checked: "a.checked",
        selected: "a.selected||jQuery.attr(a,'selected')",
        text: "'text'==a.type",
        radio: "'radio'==a.type",
        checkbox: "'checkbox'==a.type",
        file: "'file'==a.type",
        password: "'password'==a.type",
        submit: "'submit'==a.type",
        image: "'image'==a.type",
        reset: "'reset'==a.type",
        button: '"button"==a.type||jQuery.nodeName(a,"button")',
        input: "/input|select|textarea|button/i.test(a.nodeName)",
        has: "jQuery.find(m[3],a).length",
        header: "/h\\d/i.test(a.nodeName)",
        animated:
          "jQuery.grep(jQuery.timers,function(fn){return a==fn.elem;}).length",
      },
    },
    parse: [
      /^(\[) *@?([\w-]+) *([!*$^~=]*) *('?"?)(.*?)\4 *\]/,
      /^(:)([\w-]+)\("?'?(.*?(\(.*?\))?[^(]*?)"?'?\)/,
      new RegExp("^([:.#]*)(" + chars + "+)"),
    ],
    multiFilter: function (expr, elems, not) {
      var old,
        cur = [];
      while (expr && expr != old) {
        old = expr;
        var f = jQuery.filter(expr, elems, not);
        expr = f.t.replace(/^\s*,\s*/, "");
        cur = not ? (elems = f.r) : jQuery.merge(cur, f.r);
      }
      return cur;
    },
    find: function (t, context) {
      if (typeof t != "string") return [t];
      if (context && context.nodeType != 1 && context.nodeType != 9) return [];
      context = context || document;
      var ret = [context],
        done = [],
        last,
        nodeName;
      while (t && last != t) {
        var r = [];
        last = t;
        t = jQuery.trim(t);
        var foundToken = false;
        var re = quickChild;
        var m = re.exec(t);
        if (m) {
          nodeName = m[1].toUpperCase();
          for (var i = 0; ret[i]; i++)
            for (var c = ret[i].firstChild; c; c = c.nextSibling)
              if (
                c.nodeType == 1 &&
                (nodeName == "*" || c.nodeName.toUpperCase() == nodeName)
              )
                r.push(c);
          ret = r;
          t = t.replace(re, "");
          if (t.indexOf(" ") == 0) continue;
          foundToken = true;
        } else {
          re = /^([>+~])\s*(\w*)/i;
          if ((m = re.exec(t)) != null) {
            r = [];
            var merge = {};
            nodeName = m[2].toUpperCase();
            m = m[1];
            for (var j = 0, rl = ret.length; j < rl; j++) {
              var n =
                m == "~" || m == "+" ? ret[j].nextSibling : ret[j].firstChild;
              for (; n; n = n.nextSibling)
                if (n.nodeType == 1) {
                  var id = jQuery.data(n);
                  if (m == "~" && merge[id]) break;
                  if (!nodeName || n.nodeName.toUpperCase() == nodeName) {
                    if (m == "~") merge[id] = true;
                    r.push(n);
                  }
                  if (m == "+") break;
                }
            }
            ret = r;
            t = jQuery.trim(t.replace(re, ""));
            foundToken = true;
          }
        }
        if (t && !foundToken) {
          if (!t.indexOf(",")) {
            if (context == ret[0]) ret.shift();
            done = jQuery.merge(done, ret);
            r = ret = [context];
            t = " " + t.substr(1, t.length);
          } else {
            var re2 = quickID;
            var m = re2.exec(t);
            if (m) {
              m = [0, m[2], m[3], m[1]];
            } else {
              re2 = quickClass;
              m = re2.exec(t);
            }
            m[2] = m[2].replace(/\\/g, "");
            var elem = ret[ret.length - 1];
            if (
              m[1] == "#" &&
              elem &&
              elem.getElementById &&
              !jQuery.isXMLDoc(elem)
            ) {
              var oid = elem.getElementById(m[2]);
              if (
                (jQuery.browser.msie || jQuery.browser.opera) &&
                oid &&
                typeof oid.id == "string" &&
                oid.id != m[2]
              )
                oid = jQuery('[@id="' + m[2] + '"]', elem)[0];
              ret = r =
                oid && (!m[3] || jQuery.nodeName(oid, m[3])) ? [oid] : [];
            } else {
              for (var i = 0; ret[i]; i++) {
                var tag =
                  m[1] == "#" && m[3]
                    ? m[3]
                    : m[1] != "" || m[0] == ""
                    ? "*"
                    : m[2];
                if (tag == "*" && ret[i].nodeName.toLowerCase() == "object")
                  tag = "param";
                r = jQuery.merge(r, ret[i].getElementsByTagName(tag));
              }
              if (m[1] == ".") r = jQuery.classFilter(r, m[2]);
              if (m[1] == "#") {
                var tmp = [];
                for (var i = 0; r[i]; i++)
                  if (r[i].getAttribute("id") == m[2]) {
                    tmp = [r[i]];
                    break;
                  }
                r = tmp;
              }
              ret = r;
            }
            t = t.replace(re2, "");
          }
        }
        if (t) {
          var val = jQuery.filter(t, r);
          ret = r = val.r;
          t = jQuery.trim(val.t);
        }
      }
      if (t) ret = [];
      if (ret && context == ret[0]) ret.shift();
      done = jQuery.merge(done, ret);
      return done;
    },
    classFilter: function (r, m, not) {
      m = " " + m + " ";
      var tmp = [];
      for (var i = 0; r[i]; i++) {
        var pass = (" " + r[i].className + " ").indexOf(m) >= 0;
        if ((!not && pass) || (not && !pass)) tmp.push(r[i]);
      }
      return tmp;
    },
    filter: function (t, r, not) {
      var last;
      while (t && t != last) {
        last = t;
        var p = jQuery.parse,
          m;
        for (var i = 0; p[i]; i++) {
          m = p[i].exec(t);
          if (m) {
            t = t.substring(m[0].length);
            m[2] = m[2].replace(/\\/g, "");
            break;
          }
        }
        if (!m) break;
        if (m[1] == ":" && m[2] == "not")
          r = isSimple.test(m[3])
            ? jQuery.filter(m[3], r, true).r
            : jQuery(r).not(m[3]);
        else if (m[1] == ".") r = jQuery.classFilter(r, m[2], not);
        else if (m[1] == "[") {
          var tmp = [],
            type = m[3];
          for (var i = 0, rl = r.length; i < rl; i++) {
            var a = r[i],
              z = a[jQuery.props[m[2]] || m[2]];
            if (z == null || /href|src|selected/.test(m[2]))
              z = jQuery.attr(a, m[2]) || "";
            if (
              ((type == "" && !!z) ||
                (type == "=" && z == m[5]) ||
                (type == "!=" && z != m[5]) ||
                (type == "^=" && z && !z.indexOf(m[5])) ||
                (type == "$=" && z.substr(z.length - m[5].length) == m[5]) ||
                ((type == "*=" || type == "~=") && z.indexOf(m[5]) >= 0)) ^ not
            )
              tmp.push(a);
          }
          r = tmp;
        } else if (m[1] == ":" && m[2] == "nth-child") {
          var merge = {},
            tmp = [],
            test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
              (m[3] == "even" && "2n") ||
                (m[3] == "odd" && "2n+1") ||
                (!/\D/.test(m[3]) && "0n+" + m[3]) ||
                m[3]
            ),
            first = test[1] + (test[2] || 1) - 0,
            last = test[3] - 0;
          for (var i = 0, rl = r.length; i < rl; i++) {
            var node = r[i],
              parentNode = node.parentNode,
              id = jQuery.data(parentNode);
            if (!merge[id]) {
              var c = 1;
              for (var n = parentNode.firstChild; n; n = n.nextSibling)
                if (n.nodeType == 1) n.nodeIndex = c++;
              merge[id] = true;
            }
            var add = false;
            if (first == 0) {
              if (node.nodeIndex == last) add = true;
            } else if (
              (node.nodeIndex - last) % first == 0 &&
              (node.nodeIndex - last) / first >= 0
            )
              add = true;
            if (add ^ not) tmp.push(node);
          }
          r = tmp;
        } else {
          var f = jQuery.expr[m[1]];
          if (typeof f != "string") f = jQuery.expr[m[1]][m[2]];
          f = eval("false||function(a,i){return " + f + "}");
          r = jQuery.grep(r, f, not);
        }
      }
      return { r: r, t: t };
    },
    dir: function (elem, dir) {
      var matched = [];
      var cur = elem[dir];
      while (cur && cur != document) {
        if (cur.nodeType == 1) matched.push(cur);
        cur = cur[dir];
      }
      return matched;
    },
    nth: function (cur, result, dir, elem) {
      result = result || 1;
      var num = 0;
      for (; cur; cur = cur[dir])
        if (cur.nodeType == 1 && ++num == result) break;
      return cur;
    },
    sibling: function (n, elem) {
      var r = [];
      for (; n; n = n.nextSibling) {
        if (n.nodeType == 1 && (!elem || n != elem)) r.push(n);
      }
      return r;
    },
  });
  jQuery.event = {
    add: function (elem, types, handler, data) {
      if (elem.nodeType == 3 || elem.nodeType == 8) return;
      if (jQuery.browser.msie && elem.setInterval != undefined) elem = window;
      if (!handler.guid) handler.guid = this.guid++;
      if (data != undefined) {
        var fn = handler;
        handler = function () {
          return fn.apply(this, arguments);
        };
        handler.data = data;
        handler.guid = fn.guid;
      }
      var events =
          jQuery.data(elem, "events") || jQuery.data(elem, "events", {}),
        handle =
          jQuery.data(elem, "handle") ||
          jQuery.data(elem, "handle", function () {
            var val;
            if (typeof jQuery == "undefined" || jQuery.event.triggered)
              return val;
            val = jQuery.event.handle.apply(arguments.callee.elem, arguments);
            return val;
          });
      handle.elem = elem;
      jQuery.each(types.split(/\s+/), function (index, type) {
        var parts = type.split(".");
        type = parts[0];
        handler.type = parts[1];
        var handlers = events[type];
        if (!handlers) {
          handlers = events[type] = {};
          if (
            !jQuery.event.special[type] ||
            jQuery.event.special[type].setup.call(elem) === false
          ) {
            if (elem.addEventListener)
              elem.addEventListener(type, handle, false);
            else if (elem.attachEvent) elem.attachEvent("on" + type, handle);
          }
        }
        handlers[handler.guid] = handler;
        jQuery.event.global[type] = true;
      });
      elem = null;
    },
    guid: 1,
    global: {},
    remove: function (elem, types, handler) {
      if (elem.nodeType == 3 || elem.nodeType == 8) return;
      var events = jQuery.data(elem, "events"),
        ret,
        index;
      if (events) {
        if (types == undefined)
          for (var type in events) this.remove(elem, type);
        else {
          if (types.type) {
            handler = types.handler;
            types = types.type;
          }
          jQuery.each(types.split(/\s+/), function (index, type) {
            var parts = type.split(".");
            type = parts[0];
            if (events[type]) {
              if (handler) delete events[type][handler.guid];
              else
                for (handler in events[type])
                  if (!parts[1] || events[type][handler].type == parts[1])
                    delete events[type][handler];
              for (ret in events[type]) break;
              if (!ret) {
                if (
                  !jQuery.event.special[type] ||
                  jQuery.event.special[type].teardown.call(elem) === false
                ) {
                  if (elem.removeEventListener)
                    elem.removeEventListener(
                      type,
                      jQuery.data(elem, "handle"),
                      false
                    );
                  else if (elem.detachEvent)
                    elem.detachEvent("on" + type, jQuery.data(elem, "handle"));
                }
                ret = null;
                delete events[type];
              }
            }
          });
        }
        for (ret in events) break;
        if (!ret) {
          var handle = jQuery.data(elem, "handle");
          if (handle) handle.elem = null;
          jQuery.removeData(elem, "events");
          jQuery.removeData(elem, "handle");
        }
      }
    },
    trigger: function (type, data, elem, donative, extra) {
      data = jQuery.makeArray(data || []);
      if (!elem) {
        if (this.global[type])
          jQuery("*").add([window, document]).trigger(type, data);
      } else {
        if (elem.nodeType == 3 || elem.nodeType == 8) return undefined;
        var val,
          ret,
          fn = jQuery.isFunction(elem[type] || null),
          event = !data[0] || !data[0].preventDefault;
        if (event) data.unshift(this.fix({ type: type, target: elem }));
        data[0].type = type;
        if (jQuery.isFunction(jQuery.data(elem, "handle")))
          val = jQuery.data(elem, "handle").apply(elem, data);
        if (
          !fn &&
          elem["on" + type] &&
          elem["on" + type].apply(elem, data) === false
        )
          val = false;
        if (event) data.shift();
        if (extra && jQuery.isFunction(extra)) {
          ret = extra.apply(elem, val == null ? data : data.concat(val));
          if (ret !== undefined) val = ret;
        }
        if (
          fn &&
          donative !== false &&
          val !== false &&
          !(jQuery.nodeName(elem, "a") && type == "click")
        ) {
          this.triggered = true;
          try {
            elem[type]();
          } catch (e) {}
        }
        this.triggered = false;
      }
      return val;
    },
    handle: function (event) {
      var val;
      event = jQuery.event.fix(event || window.event || {});
      var parts = event.type.split(".");
      event.type = parts[0];
      var handlers =
          jQuery.data(this, "events") &&
          jQuery.data(this, "events")[event.type],
        args = Array.prototype.slice.call(arguments, 1);
      args.unshift(event);
      for (var j in handlers) {
        var handler = handlers[j];
        args[0].handler = handler;
        args[0].data = handler.data;
        if (!parts[1] || handler.type == parts[1]) {
          var ret = handler.apply(this, args);
          if (val !== false) val = ret;
          if (ret === false) {
            event.preventDefault();
            event.stopPropagation();
          }
        }
      }
      if (jQuery.browser.msie)
        event.target =
          event.preventDefault =
          event.stopPropagation =
          event.handler =
          event.data =
            null;
      return val;
    },
    fix: function (event) {
      var originalEvent = event;
      event = jQuery.extend({}, originalEvent);
      event.preventDefault = function () {
        if (originalEvent.preventDefault) originalEvent.preventDefault();
        originalEvent.returnValue = false;
      };
      event.stopPropagation = function () {
        if (originalEvent.stopPropagation) originalEvent.stopPropagation();
        originalEvent.cancelBubble = true;
      };
      if (!event.target) event.target = event.srcElement || document;
      if (event.target.nodeType == 3)
        event.target = originalEvent.target.parentNode;
      if (!event.relatedTarget && event.fromElement)
        event.relatedTarget =
          event.fromElement == event.target
            ? event.toElement
            : event.fromElement;
      if (event.pageX == null && event.clientX != null) {
        var doc = document.documentElement,
          body = document.body;
        event.pageX =
          event.clientX +
          ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
          (doc.clientLeft || 0);
        event.pageY =
          event.clientY +
          ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
          (doc.clientTop || 0);
      }
      if (
        !event.which &&
        (event.charCode || event.charCode === 0
          ? event.charCode
          : event.keyCode)
      )
        event.which = event.charCode || event.keyCode;
      if (!event.metaKey && event.ctrlKey) event.metaKey = event.ctrlKey;
      if (!event.which && event.button)
        event.which =
          event.button & 1
            ? 1
            : event.button & 2
            ? 3
            : event.button & 4
            ? 2
            : 0;
      return event;
    },
    special: {
      ready: {
        setup: function () {
          bindReady();
          return;
        },
        teardown: function () {
          return;
        },
      },
      mouseenter: {
        setup: function () {
          if (jQuery.browser.msie) return false;
          jQuery(this).bind(
            "mouseover",
            jQuery.event.special.mouseenter.handler
          );
          return true;
        },
        teardown: function () {
          if (jQuery.browser.msie) return false;
          jQuery(this).unbind(
            "mouseover",
            jQuery.event.special.mouseenter.handler
          );
          return true;
        },
        handler: function (event) {
          if (withinElement(event, this)) return true;
          arguments[0].type = "mouseenter";
          return jQuery.event.handle.apply(this, arguments);
        },
      },
      mouseleave: {
        setup: function () {
          if (jQuery.browser.msie) return false;
          jQuery(this).bind(
            "mouseout",
            jQuery.event.special.mouseleave.handler
          );
          return true;
        },
        teardown: function () {
          if (jQuery.browser.msie) return false;
          jQuery(this).unbind(
            "mouseout",
            jQuery.event.special.mouseleave.handler
          );
          return true;
        },
        handler: function (event) {
          if (withinElement(event, this)) return true;
          arguments[0].type = "mouseleave";
          return jQuery.event.handle.apply(this, arguments);
        },
      },
    },
  };
  jQuery.fn.extend({
    bind: function (type, data, fn) {
      return type == "unload"
        ? this.one(type, data, fn)
        : this.each(function () {
            jQuery.event.add(this, type, fn || data, fn && data);
          });
    },
    one: function (type, data, fn) {
      return this.each(function () {
        jQuery.event.add(
          this,
          type,
          function (event) {
            jQuery(this).unbind(event);
            return (fn || data).apply(this, arguments);
          },
          fn && data
        );
      });
    },
    unbind: function (type, fn) {
      return this.each(function () {
        jQuery.event.remove(this, type, fn);
      });
    },
    trigger: function (type, data, fn) {
      return this.each(function () {
        jQuery.event.trigger(type, data, this, true, fn);
      });
    },
    triggerHandler: function (type, data, fn) {
      if (this[0]) return jQuery.event.trigger(type, data, this[0], false, fn);
      return undefined;
    },
    toggle: function () {
      var args = arguments;
      return this.click(function (event) {
        this.lastToggle = 0 == this.lastToggle ? 1 : 0;
        event.preventDefault();
        return args[this.lastToggle].apply(this, arguments) || false;
      });
    },
    hover: function (fnOver, fnOut) {
      return this.bind("mouseenter", fnOver).bind("mouseleave", fnOut);
    },
    ready: function (fn) {
      bindReady();
      if (jQuery.isReady) fn.call(document, jQuery);
      else
        jQuery.readyList.push(function () {
          return fn.call(this, jQuery);
        });
      return this;
    },
  });
  jQuery.extend({
    isReady: false,
    readyList: [],
    ready: function () {
      if (!jQuery.isReady) {
        jQuery.isReady = true;
        if (jQuery.readyList) {
          jQuery.each(jQuery.readyList, function () {
            this.apply(document);
          });
          jQuery.readyList = null;
        }
        jQuery(document).triggerHandler("ready");
      }
    },
  });
  var readyBound = false;
  function bindReady() {
    if (readyBound) return;
    readyBound = true;
    if (document.addEventListener && !jQuery.browser.opera)
      document.addEventListener("DOMContentLoaded", jQuery.ready, false);
    if (jQuery.browser.msie && window == top)
      (function () {
        if (jQuery.isReady) return;
        try {
          document.documentElement.doScroll("left");
        } catch (error) {
          setTimeout(arguments.callee, 0);
          return;
        }
        jQuery.ready();
      })();
    if (jQuery.browser.opera)
      document.addEventListener(
        "DOMContentLoaded",
        function () {
          if (jQuery.isReady) return;
          for (var i = 0; i < document.styleSheets.length; i++)
            if (document.styleSheets[i].disabled) {
              setTimeout(arguments.callee, 0);
              return;
            }
          jQuery.ready();
        },
        false
      );
    if (jQuery.browser.safari) {
      var numStyles;
      (function () {
        if (jQuery.isReady) return;
        if (
          document.readyState != "loaded" &&
          document.readyState != "complete"
        ) {
          setTimeout(arguments.callee, 0);
          return;
        }
        if (numStyles === undefined)
          numStyles = jQuery("style, link[rel=stylesheet]").length;
        if (document.styleSheets.length != numStyles) {
          setTimeout(arguments.callee, 0);
          return;
        }
        jQuery.ready();
      })();
    }
    jQuery.event.add(window, "load", jQuery.ready);
  }
  jQuery.each(
    (
      "blur,focus,load,resize,scroll,unload,click,dblclick," +
      "mousedown,mouseup,mousemove,mouseover,mouseout,change,select," +
      "submit,keydown,keypress,keyup,error"
    ).split(","),
    function (i, name) {
      jQuery.fn[name] = function (fn) {
        return fn ? this.bind(name, fn) : this.trigger(name);
      };
    }
  );
  var withinElement = function (event, elem) {
    var parent = event.relatedTarget;
    while (parent && parent != elem)
      try {
        parent = parent.parentNode;
      } catch (error) {
        parent = elem;
      }
    return parent == elem;
  };
  jQuery(window).bind("unload", function () {
    jQuery("*").add(document).unbind();
  });
  jQuery.fn.extend({
    load: function (url, params, callback) {
      if (jQuery.isFunction(url)) return this.bind("load", url);
      var off = url.indexOf(" ");
      if (off >= 0) {
        var selector = url.slice(off, url.length);
        url = url.slice(0, off);
      }
      callback = callback || function () {};
      var type = "GET";
      if (params)
        if (jQuery.isFunction(params)) {
          callback = params;
          params = null;
        } else {
          params = jQuery.param(params);
          type = "POST";
        }
      var self = this;
      jQuery.ajax({
        url: url,
        type: type,
        dataType: "html",
        data: params,
        complete: function (res, status) {
          if (status == "success" || status == "notmodified")
            self.html(
              selector
                ? jQuery("<div/>")
                    .append(
                      res.responseText.replace(/<script(.|\s)*?\/script>/g, "")
                    )
                    .find(selector)
                : res.responseText
            );
          self.each(callback, [res.responseText, status, res]);
        },
      });
      return this;
    },
    serialize: function () {
      return jQuery.param(this.serializeArray());
    },
    serializeArray: function () {
      return this.map(function () {
        return jQuery.nodeName(this, "form")
          ? jQuery.makeArray(this.elements)
          : this;
      })
        .filter(function () {
          return (
            this.name &&
            !this.disabled &&
            (this.checked ||
              /select|textarea/i.test(this.nodeName) ||
              /text|hidden|password/i.test(this.type))
          );
        })
        .map(function (i, elem) {
          var val = jQuery(this).val();
          return val == null
            ? null
            : val.constructor == Array
            ? jQuery.map(val, function (val, i) {
                return { name: elem.name, value: val };
              })
            : { name: elem.name, value: val };
        })
        .get();
    },
  });
  jQuery.each(
    "ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","),
    function (i, o) {
      jQuery.fn[o] = function (f) {
        return this.bind(o, f);
      };
    }
  );
  var jsc = new Date().getTime();
  jQuery.extend({
    get: function (url, data, callback, type) {
      if (jQuery.isFunction(data)) {
        callback = data;
        data = null;
      }
      return jQuery.ajax({
        type: "GET",
        url: url,
        data: data,
        success: callback,
        dataType: type,
      });
    },
    getScript: function (url, callback) {
      return jQuery.get(url, null, callback, "script");
    },
    getJSON: function (url, data, callback) {
      return jQuery.get(url, data, callback, "json");
    },
    post: function (url, data, callback, type) {
      if (jQuery.isFunction(data)) {
        callback = data;
        data = {};
      }
      return jQuery.ajax({
        type: "POST",
        url: url,
        data: data,
        success: callback,
        dataType: type,
      });
    },
    ajaxSetup: function (settings) {
      jQuery.extend(jQuery.ajaxSettings, settings);
    },
    ajaxSettings: {
      global: true,
      type: "GET",
      timeout: 0,
      contentType: "application/x-www-form-urlencoded",
      processData: true,
      async: true,
      data: null,
      username: null,
      password: null,
      accepts: {
        xml: "application/xml, text/xml",
        html: "text/html",
        script: "text/javascript, application/javascript",
        json: "application/json, text/javascript",
        text: "text/plain",
        _default: "*/*",
      },
    },
    lastModified: {},
    ajax: function (s) {
      var jsonp,
        jsre = /=\?(&|$)/g,
        status,
        data;
      s = jQuery.extend(
        true,
        s,
        jQuery.extend(true, {}, jQuery.ajaxSettings, s)
      );
      if (s.data && s.processData && typeof s.data != "string")
        s.data = jQuery.param(s.data);
      if (s.dataType == "jsonp") {
        if (s.type.toLowerCase() == "get") {
          if (!s.url.match(jsre))
            s.url +=
              (s.url.match(/\?/) ? "&" : "?") + (s.jsonp || "callback") + "=?";
        } else if (!s.data || !s.data.match(jsre))
          s.data =
            (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
        s.dataType = "json";
      }
      if (
        s.dataType == "json" &&
        ((s.data && s.data.match(jsre)) || s.url.match(jsre))
      ) {
        jsonp = "jsonp" + jsc++;
        if (s.data) s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1");
        s.url = s.url.replace(jsre, "=" + jsonp + "$1");
        s.dataType = "script";
        window[jsonp] = function (tmp) {
          data = tmp;
          success();
          complete();
          window[jsonp] = undefined;
          try {
            delete window[jsonp];
          } catch (e) {}
          if (head) head.removeChild(script);
        };
      }
      if (s.dataType == "script" && s.cache == null) s.cache = false;
      if (s.cache === false && s.type.toLowerCase() == "get") {
        var ts = new Date().getTime();
        var ret = s.url.replace(/(\?|&)_=.*?(&|$)/, "$1_=" + ts + "$2");
        s.url =
          ret +
          (ret == s.url ? (s.url.match(/\?/) ? "&" : "?") + "_=" + ts : "");
      }
      if (s.data && s.type.toLowerCase() == "get") {
        s.url += (s.url.match(/\?/) ? "&" : "?") + s.data;
        s.data = null;
      }
      if (s.global && !jQuery.active++) jQuery.event.trigger("ajaxStart");
      if (
        (!s.url.indexOf("http") || !s.url.indexOf("//")) &&
        (s.dataType == "script" || s.dataType == "json") &&
        s.type.toLowerCase() == "get"
      ) {
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.src = s.url;
        if (s.scriptCharset) script.charset = s.scriptCharset;
        if (!jsonp) {
          var done = false;
          script.onload = script.onreadystatechange = function () {
            if (
              !done &&
              (!this.readyState ||
                this.readyState == "loaded" ||
                this.readyState == "complete")
            ) {
              done = true;
              success();
              complete();
              head.removeChild(script);
            }
          };
        }
        head.appendChild(script);
        return undefined;
      }
      var requestDone = false;
      var xml = window.ActiveXObject
        ? new ActiveXObject("Microsoft.XMLHTTP")
        : new XMLHttpRequest();
      xml.open(s.type, s.url, s.async, s.username, s.password);
      try {
        if (s.data) xml.setRequestHeader("Content-Type", s.contentType);
        if (s.ifModified)
          xml.setRequestHeader(
            "If-Modified-Since",
            jQuery.lastModified[s.url] || "Thu, 01 Jan 1970 00:00:00 GMT"
          );
        xml.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xml.setRequestHeader(
          "Accept",
          s.dataType && s.accepts[s.dataType]
            ? s.accepts[s.dataType] + ", */*"
            : s.accepts._default
        );
      } catch (e) {}
      if (s.beforeSend) s.beforeSend(xml);
      if (s.global) jQuery.event.trigger("ajaxSend", [xml, s]);
      var onreadystatechange = function (isTimeout) {
        if (
          !requestDone &&
          xml &&
          (xml.readyState == 4 || isTimeout == "timeout")
        ) {
          requestDone = true;
          if (ival) {
            clearInterval(ival);
            ival = null;
          }
          status =
            (isTimeout == "timeout" && "timeout") ||
            (!jQuery.httpSuccess(xml) && "error") ||
            (s.ifModified &&
              jQuery.httpNotModified(xml, s.url) &&
              "notmodified") ||
            "success";
          if (status == "success") {
            try {
              data = jQuery.httpData(xml, s.dataType);
            } catch (e) {
              status = "parsererror";
            }
          }
          if (status == "success") {
            var modRes;
            try {
              modRes = xml.getResponseHeader("Last-Modified");
            } catch (e) {}
            if (s.ifModified && modRes) jQuery.lastModified[s.url] = modRes;
            if (!jsonp) success();
          } else jQuery.handleError(s, xml, status);
          complete();
          if (s.async) xml = null;
        }
      };
      if (s.async) {
        var ival = setInterval(onreadystatechange, 13);
        if (s.timeout > 0)
          setTimeout(function () {
            if (xml) {
              xml.abort();
              if (!requestDone) onreadystatechange("timeout");
            }
          }, s.timeout);
      }
      try {
        xml.send(s.data);
      } catch (e) {
        jQuery.handleError(s, xml, null, e);
      }
      if (!s.async) onreadystatechange();
      function success() {
        if (s.success) s.success(data, status);
        if (s.global) jQuery.event.trigger("ajaxSuccess", [xml, s]);
      }
      function complete() {
        if (s.complete) s.complete(xml, status);
        if (s.global) jQuery.event.trigger("ajaxComplete", [xml, s]);
        if (s.global && !--jQuery.active) jQuery.event.trigger("ajaxStop");
      }
      return xml;
    },
    handleError: function (s, xml, status, e) {
      if (s.error) s.error(xml, status, e);
      if (s.global) jQuery.event.trigger("ajaxError", [xml, s, e]);
    },
    active: 0,
    httpSuccess: function (r) {
      try {
        return (
          (!r.status && location.protocol == "file:") ||
          (r.status >= 200 && r.status < 300) ||
          r.status == 304 ||
          r.status == 1223 ||
          (jQuery.browser.safari && r.status == undefined)
        );
      } catch (e) {}
      return false;
    },
    httpNotModified: function (xml, url) {
      try {
        var xmlRes = xml.getResponseHeader("Last-Modified");
        return (
          xml.status == 304 ||
          xmlRes == jQuery.lastModified[url] ||
          (jQuery.browser.safari && xml.status == undefined)
        );
      } catch (e) {}
      return false;
    },
    httpData: function (r, type) {
      var ct = r.getResponseHeader("content-type");
      var xml = type == "xml" || (!type && ct && ct.indexOf("xml") >= 0);
      var data = xml ? r.responseXML : r.responseText;
      if (xml && data.documentElement.tagName == "parsererror")
        throw "parsererror";
      if (type == "script") jQuery.globalEval(data);
      if (type == "json") data = eval("(" + data + ")");
      return data;
    },
    param: function (a) {
      var s = [];
      if (a.constructor == Array || a.jquery)
        jQuery.each(a, function () {
          s.push(
            encodeURIComponent(this.name) + "=" + encodeURIComponent(this.value)
          );
        });
      else
        for (var j in a)
          if (a[j] && a[j].constructor == Array)
            jQuery.each(a[j], function () {
              s.push(encodeURIComponent(j) + "=" + encodeURIComponent(this));
            });
          else s.push(encodeURIComponent(j) + "=" + encodeURIComponent(a[j]));
      return s.join("&").replace(/%20/g, "+");
    },
  });
  jQuery.fn.extend({
    show: function (speed, callback) {
      return speed
        ? this.animate(
            { height: "show", width: "show", opacity: "show" },
            speed,
            callback
          )
        : this.filter(":hidden")
            .each(function () {
              this.style.display = this.oldblock || "";
              if (jQuery.css(this, "display") == "none") {
                var elem = jQuery("<" + this.tagName + " />").appendTo("body");
                this.style.display = elem.css("display");
                if (this.style.display == "none") this.style.display = "block";
                elem.remove();
              }
            })
            .end();
    },
    hide: function (speed, callback) {
      return speed
        ? this.animate(
            { height: "hide", width: "hide", opacity: "hide" },
            speed,
            callback
          )
        : this.filter(":visible")
            .each(function () {
              this.oldblock = this.oldblock || jQuery.css(this, "display");
              this.style.display = "none";
            })
            .end();
    },
    _toggle: jQuery.fn.toggle,
    toggle: function (fn, fn2) {
      return jQuery.isFunction(fn) && jQuery.isFunction(fn2)
        ? this._toggle(fn, fn2)
        : fn
        ? this.animate(
            { height: "toggle", width: "toggle", opacity: "toggle" },
            fn,
            fn2
          )
        : this.each(function () {
            jQuery(this)[jQuery(this).is(":hidden") ? "show" : "hide"]();
          });
    },
    slideDown: function (speed, callback) {
      return this.animate({ height: "show" }, speed, callback);
    },
    slideUp: function (speed, callback) {
      return this.animate({ height: "hide" }, speed, callback);
    },
    slideToggle: function (speed, callback) {
      return this.animate({ height: "toggle" }, speed, callback);
    },
    fadeIn: function (speed, callback) {
      return this.animate({ opacity: "show" }, speed, callback);
    },
    fadeOut: function (speed, callback) {
      return this.animate({ opacity: "hide" }, speed, callback);
    },
    fadeTo: function (speed, to, callback) {
      return this.animate({ opacity: to }, speed, callback);
    },
    animate: function (prop, speed, easing, callback) {
      var optall = jQuery.speed(speed, easing, callback);
      return this[optall.queue === false ? "each" : "queue"](function () {
        if (this.nodeType != 1) return false;
        var opt = jQuery.extend({}, optall);
        var hidden = jQuery(this).is(":hidden"),
          self = this;
        for (var p in prop) {
          if ((prop[p] == "hide" && hidden) || (prop[p] == "show" && !hidden))
            return jQuery.isFunction(opt.complete) && opt.complete.apply(this);
          if (p == "height" || p == "width") {
            opt.display = jQuery.css(this, "display");
            opt.overflow = this.style.overflow;
          }
        }
        if (opt.overflow != null) this.style.overflow = "hidden";
        opt.curAnim = jQuery.extend({}, prop);
        jQuery.each(prop, function (name, val) {
          var e = new jQuery.fx(self, opt, name);
          if (/toggle|show|hide/.test(val))
            e[val == "toggle" ? (hidden ? "show" : "hide") : val](prop);
          else {
            var parts = val.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),
              start = e.cur(true) || 0;
            if (parts) {
              var end = parseFloat(parts[2]),
                unit = parts[3] || "px";
              if (unit != "px") {
                self.style[name] = (end || 1) + unit;
                start = ((end || 1) / e.cur(true)) * start;
                self.style[name] = start + unit;
              }
              if (parts[1]) end = (parts[1] == "-=" ? -1 : 1) * end + start;
              e.custom(start, end, unit);
            } else e.custom(start, val, "");
          }
        });
        return true;
      });
    },
    queue: function (type, fn) {
      if (jQuery.isFunction(type) || (type && type.constructor == Array)) {
        fn = type;
        type = "fx";
      }
      if (!type || (typeof type == "string" && !fn))
        return queue(this[0], type);
      return this.each(function () {
        if (fn.constructor == Array) queue(this, type, fn);
        else {
          queue(this, type).push(fn);
          if (queue(this, type).length == 1) fn.apply(this);
        }
      });
    },
    stop: function (clearQueue, gotoEnd) {
      var timers = jQuery.timers;
      if (clearQueue) this.queue([]);
      this.each(function () {
        for (var i = timers.length - 1; i >= 0; i--)
          if (timers[i].elem == this) {
            if (gotoEnd) timers[i](true);
            timers.splice(i, 1);
          }
      });
      if (!gotoEnd) this.dequeue();
      return this;
    },
  });
  var queue = function (elem, type, array) {
    if (!elem) return undefined;
    type = type || "fx";
    var q = jQuery.data(elem, type + "queue");
    if (!q || array)
      q = jQuery.data(
        elem,
        type + "queue",
        array ? jQuery.makeArray(array) : []
      );
    return q;
  };
  jQuery.fn.dequeue = function (type) {
    type = type || "fx";
    return this.each(function () {
      var q = queue(this, type);
      q.shift();
      if (q.length) q[0].apply(this);
    });
  };
  jQuery.extend({
    speed: function (speed, easing, fn) {
      var opt =
        speed && speed.constructor == Object
          ? speed
          : {
              complete:
                fn || (!fn && easing) || (jQuery.isFunction(speed) && speed),
              duration: speed,
              easing:
                (fn && easing) ||
                (easing && easing.constructor != Function && easing),
            };
      opt.duration =
        (opt.duration && opt.duration.constructor == Number
          ? opt.duration
          : { slow: 600, fast: 200 }[opt.duration]) || 400;
      opt.old = opt.complete;
      opt.complete = function () {
        if (opt.queue !== false) jQuery(this).dequeue();
        if (jQuery.isFunction(opt.old)) opt.old.apply(this);
      };
      return opt;
    },
    easing: {
      linear: function (p, n, firstNum, diff) {
        return firstNum + diff * p;
      },
      swing: function (p, n, firstNum, diff) {
        return (-Math.cos(p * Math.PI) / 2 + 0.5) * diff + firstNum;
      },
    },
    timers: [],
    timerId: null,
    fx: function (elem, options, prop) {
      this.options = options;
      this.elem = elem;
      this.prop = prop;
      if (!options.orig) options.orig = {};
    },
  });
  jQuery.fx.prototype = {
    update: function () {
      if (this.options.step)
        this.options.step.apply(this.elem, [this.now, this]);
      (jQuery.fx.step[this.prop] || jQuery.fx.step._default)(this);
      if (this.prop == "height" || this.prop == "width")
        this.elem.style.display = "block";
    },
    cur: function (force) {
      if (this.elem[this.prop] != null && this.elem.style[this.prop] == null)
        return this.elem[this.prop];
      var r = parseFloat(jQuery.css(this.elem, this.prop, force));
      return r && r > -1e4
        ? r
        : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0;
    },
    custom: function (from, to, unit) {
      this.startTime = new Date().getTime();
      this.start = from;
      this.end = to;
      this.unit = unit || this.unit || "px";
      this.now = this.start;
      this.pos = this.state = 0;
      this.update();
      var self = this;
      function t(gotoEnd) {
        return self.step(gotoEnd);
      }
      t.elem = this.elem;
      jQuery.timers.push(t);
      if (jQuery.timerId == null) {
        jQuery.timerId = setInterval(function () {
          var timers = jQuery.timers;
          for (var i = 0; i < timers.length; i++)
            if (!timers[i]()) timers.splice(i--, 1);
          if (!timers.length) {
            clearInterval(jQuery.timerId);
            jQuery.timerId = null;
          }
        }, 13);
      }
    },
    show: function () {
      this.options.orig[this.prop] = jQuery.attr(this.elem.style, this.prop);
      this.options.show = true;
      this.custom(0, this.cur());
      if (this.prop == "width" || this.prop == "height")
        this.elem.style[this.prop] = "1px";
      jQuery(this.elem).show();
    },
    hide: function () {
      this.options.orig[this.prop] = jQuery.attr(this.elem.style, this.prop);
      this.options.hide = true;
      this.custom(this.cur(), 0);
    },
    step: function (gotoEnd) {
      var t = new Date().getTime();
      if (gotoEnd || t > this.options.duration + this.startTime) {
        this.now = this.end;
        this.pos = this.state = 1;
        this.update();
        this.options.curAnim[this.prop] = true;
        var done = true;
        for (var i in this.options.curAnim)
          if (this.options.curAnim[i] !== true) done = false;
        if (done) {
          if (this.options.display != null) {
            this.elem.style.overflow = this.options.overflow;
            this.elem.style.display = this.options.display;
            if (jQuery.css(this.elem, "display") == "none")
              this.elem.style.display = "block";
          }
          if (this.options.hide) this.elem.style.display = "none";
          if (this.options.hide || this.options.show)
            for (var p in this.options.curAnim)
              jQuery.attr(this.elem.style, p, this.options.orig[p]);
        }
        if (done && jQuery.isFunction(this.options.complete))
          this.options.complete.apply(this.elem);
        return false;
      } else {
        var n = t - this.startTime;
        this.state = n / this.options.duration;
        this.pos = jQuery.easing[
          this.options.easing || (jQuery.easing.swing ? "swing" : "linear")
        ](this.state, n, 0, 1, this.options.duration);
        this.now = this.start + (this.end - this.start) * this.pos;
        this.update();
      }
      return true;
    },
  };
  jQuery.fx.step = {
    scrollLeft: function (fx) {
      fx.elem.scrollLeft = fx.now;
    },
    scrollTop: function (fx) {
      fx.elem.scrollTop = fx.now;
    },
    opacity: function (fx) {
      jQuery.attr(fx.elem.style, "opacity", fx.now);
    },
    _default: function (fx) {
      fx.elem.style[fx.prop] = fx.now + fx.unit;
    },
  };
  jQuery.fn.offset = function () {
    var left = 0,
      top = 0,
      elem = this[0],
      results;
    if (elem)
      with (jQuery.browser) {
        var parent = elem.parentNode,
          offsetChild = elem,
          offsetParent = elem.offsetParent,
          doc = elem.ownerDocument,
          safari2 = safari && parseInt(version) < 522,
          fixed = jQuery.css(elem, "position") == "fixed";
        if (elem.getBoundingClientRect) {
          var box = elem.getBoundingClientRect();
          add(
            box.left +
              Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft),
            box.top +
              Math.max(doc.documentElement.scrollTop, doc.body.scrollTop)
          );
          add(-doc.documentElement.clientLeft, -doc.documentElement.clientTop);
        } else {
          add(elem.offsetLeft, elem.offsetTop);
          while (offsetParent) {
            add(offsetParent.offsetLeft, offsetParent.offsetTop);
            if (
              (mozilla && !/^t(able|d|h)$/i.test(offsetParent.tagName)) ||
              (safari && !safari2)
            )
              border(offsetParent);
            if (!fixed && jQuery.css(offsetParent, "position") == "fixed")
              fixed = true;
            offsetChild = /^body$/i.test(offsetParent.tagName)
              ? offsetChild
              : offsetParent;
            offsetParent = offsetParent.offsetParent;
          }
          while (
            parent &&
            parent.tagName &&
            !/^body|html$/i.test(parent.tagName)
          ) {
            if (!/^inline|table.*$/i.test(jQuery.css(parent, "display")))
              add(-parent.scrollLeft, -parent.scrollTop);
            if (mozilla && jQuery.css(parent, "overflow") != "visible")
              border(parent);
            parent = parent.parentNode;
          }
          if (
            (safari2 &&
              (fixed || jQuery.css(offsetChild, "position") == "absolute")) ||
            (mozilla && jQuery.css(offsetChild, "position") != "absolute")
          )
            add(-doc.body.offsetLeft, -doc.body.offsetTop);
          if (fixed)
            add(
              Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft),
              Math.max(doc.documentElement.scrollTop, doc.body.scrollTop)
            );
        }
        results = { top: top, left: left };
      }
    function border(elem) {
      add(
        jQuery.curCSS(elem, "borderLeftWidth", true),
        jQuery.curCSS(elem, "borderTopWidth", true)
      );
    }
    function add(l, t) {
      left += parseInt(l) || 0;
      top += parseInt(t) || 0;
    }
    return results;
  };
})();
new (function (settings) {
  var $separator = settings.separator || "&";
  var $spaces = settings.spaces === false ? false : true;
  var $suffix = settings.suffix === false ? "" : "[]";
  var $prefix = settings.prefix === false ? false : true;
  var $hash = $prefix ? (settings.hash === true ? "#" : "?") : "";
  var $numbers = settings.numbers === false ? false : true;
  jQuery.query = new (function () {
    var is = function (o, t) {
      return o != undefined && o !== null && (!!t ? o.constructor == t : true);
    };
    var parse = function (path) {
      var m,
        rx = /\[([^[]*)\]/g,
        match = /^(\S+?)(\[\S*\])?$/.exec(path),
        base = match[1],
        tokens = [];
      while ((m = rx.exec(match[2]))) tokens.push(m[1]);
      return [base, tokens];
    };
    var set = function (target, tokens, value) {
      var o,
        token = tokens.shift();
      if (typeof target != "object") target = null;
      if (token === "") {
        if (!target) target = [];
        if (is(target, Array)) {
          target.push(
            tokens.length == 0 ? value : set(null, tokens.slice(0), value)
          );
        } else if (is(target, Object)) {
          var i = 0;
          while (target[i++] != null);
          target[--i] =
            tokens.length == 0 ? value : set(target[i], tokens.slice(0), value);
        } else {
          target = [];
          target.push(
            tokens.length == 0 ? value : set(null, tokens.slice(0), value)
          );
        }
      } else if (token && token.match(/^\s*[0-9]+\s*$/)) {
        var index = parseInt(token, 10);
        if (!target) target = [];
        target[index] =
          tokens.length == 0
            ? value
            : set(target[index], tokens.slice(0), value);
      } else if (token) {
        var index = token.replace(/^\s*|\s*$/g, "");
        if (!target) target = {};
        if (is(target, Array)) {
          var temp = {};
          for (var i = 0; i < target.length; ++i) {
            temp[i] = target[i];
          }
          target = temp;
        }
        target[index] =
          tokens.length == 0
            ? value
            : set(target[index], tokens.slice(0), value);
      } else {
        return value;
      }
      return target;
    };
    var queryObject = function (a) {
      var self = this;
      self.keys = {};
      if (a.queryObject) {
        jQuery.each(a.get(), function (key, val) {
          self.SET(key, val);
        });
      } else {
        jQuery.each(arguments, function () {
          var q = "" + this;
          q = q.replace(/^[?#]/, "");
          q = q.replace(/[;&]$/, "");
          if ($spaces) q = q.replace(/[+]/g, " ");
          jQuery.each(q.split(/[&;]/), function () {
            var key = decodeURIComponent(this.split("=")[0]);
            var val = decodeURIComponent(this.split("=")[1]);
            if (!key) return;
            if ($numbers) {
              if (/^[+-]?[0-9]+\.[0-9]*$/.test(val)) val = parseFloat(val);
              else if (/^[+-]?[0-9]+$/.test(val)) val = parseInt(val, 10);
            }
            val = !val && val !== 0 ? true : val;
            if (val !== false && val !== true && typeof val != "number")
              val = val;
            self.SET(key, val);
          });
        });
      }
      return self;
    };
    queryObject.prototype = {
      queryObject: true,
      has: function (key, type) {
        var value = this.get(key);
        return is(value, type);
      },
      GET: function (key) {
        if (!is(key)) return this.keys;
        var parsed = parse(key),
          base = parsed[0],
          tokens = parsed[1];
        var target = this.keys[base];
        while (target != null && tokens.length != 0) {
          target = target[tokens.shift()];
        }
        return typeof target == "number" ? target : target || "";
      },
      get: function (key) {
        var target = this.GET(key);
        if (is(target, Object)) return jQuery.extend(true, {}, target);
        else if (is(target, Array)) return target.slice(0);
        return target;
      },
      SET: function (key, val) {
        var value = !is(val) ? null : val;
        var parsed = parse(key),
          base = parsed[0],
          tokens = parsed[1];
        var target = this.keys[base];
        this.keys[base] = set(target, tokens.slice(0), value);
        return this;
      },
      set: function (key, val) {
        return this.copy().SET(key, val);
      },
      REMOVE: function (key) {
        return this.SET(key, null).COMPACT();
      },
      remove: function (key) {
        return this.copy().REMOVE(key);
      },
      EMPTY: function () {
        var self = this;
        jQuery.each(self.keys, function (key, value) {
          delete self.keys[key];
        });
        return self;
      },
      load: function (url) {
        var hash = url.replace(/^.*?[#](.+?)(?:\?.+)?$/, "$1");
        var search = url.replace(/^.*?[?](.+?)(?:#.+)?$/, "$1");
        return new queryObject(
          url.length == search.length ? "" : search,
          url.length == hash.length ? "" : hash
        );
      },
      empty: function () {
        return this.copy().EMPTY();
      },
      copy: function () {
        return new queryObject(this);
      },
      COMPACT: function () {
        function build(orig) {
          var obj =
            typeof orig == "object" ? (is(orig, Array) ? [] : {}) : orig;
          if (typeof orig == "object") {
            function add(o, key, value) {
              if (is(o, Array)) o.push(value);
              else o[key] = value;
            }
            jQuery.each(orig, function (key, value) {
              if (!is(value)) return true;
              add(obj, key, build(value));
            });
          }
          return obj;
        }
        this.keys = build(this.keys);
        return this;
      },
      compact: function () {
        return this.copy().COMPACT();
      },
      toString: function () {
        var i = 0,
          queryString = [],
          chunks = [],
          self = this;
        var addFields = function (arr, key, value) {
          if (!is(value) || value === false) return;
          var o = [encodeURIComponent(key)];
          if (value !== true) {
            o.push("=");
            o.push(encodeURIComponent(value));
          }
          arr.push(o.join(""));
        };
        var build = function (obj, base) {
          var newKey = function (key) {
            return !base || base == ""
              ? [key].join("")
              : [base, "[", key, "]"].join("");
          };
          jQuery.each(obj, function (key, value) {
            if (typeof value == "object") build(value, newKey(key));
            else addFields(chunks, newKey(key), value);
          });
        };
        build(this.keys);
        if (chunks.length > 0) queryString.push($hash);
        queryString.push(chunks.join($separator));
        return queryString.join("");
      },
    };
    return new queryObject(location.search, location.hash);
  })();
})(jQuery.query || {});
eval(
  (function (p, a, c, k, e, r) {
    e = function (c) {
      return (
        (c < a ? "" : e(parseInt(c / a))) +
        ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
      );
    };
    if (!"".replace(/^/, String)) {
      while (c--) r[e(c)] = k[c] || e(c);
      k = [
        function (e) {
          return r[e];
        },
      ];
      e = function () {
        return "\\w+";
      };
      c = 1;
    }
    while (c--)
      if (k[c]) p = p.replace(new RegExp("\\b" + e(c) + "\\b", "g"), k[c]);
    return p;
  })(
    "9(2Q.8&&!2Q.8.2V){(7(){5 A=7(s,q,j){4.1t=[];4.1w={};4.2v=C;4.1A={};4.15={};4.j=8.1q({2r:17,2S:3F,2b:17,2O:17},j);4.2K(s,q);9(s){4.1h(4.15['1E'],q)}4.15=C};A.f.1X='0.6.6';A.f.2K=7(s,q){5 2x=/\\{#33 *(\\w*?)\\}/g;5 2u,1y,B;5 1k=C;2n((2u=2x.3J(s))!=C){1k=2x.1k;1y=2u[1];B=s.2i('{#/33 '+1y+'}',1k);9(B==-1){13 c 16('Z: A \"'+1y+'\" 28 1F 3t.');}4.15[1y]=s.23(1k,B)}9(1k===C){4.15['1E']=s;a}H(5 i 1D 4.15){9(i!='1E'){4.1A[i]=c A()}}H(5 i 1D 4.15){9(i!='1E'){4.1A[i].1h(4.15[i],8.1q({},q||{},4.1A||{}));4.15[i]=C}}};A.f.1h=7(s,q){9(s==1r){4.1t.z(c 18('',1));a}s=s.L(/[\\n\\r]/g,'');s=s.L(/\\{\\*.*?\\*\\}/g,'');4.2v=8.1q({},4.1A||{},q||{});5 h=4.1t;5 I=s.1f(/\\{#.*?\\}/g);5 O=0,B=0;5 e;5 19=0;5 1Q=0;H(5 i=0,l=(I)?(I.G):(0);i<l;++i){9(19){B=s.2i('{#/1m}');9(B==-1){13 c 16(\"Z: 31 3P 2Z 1m.\");}9(B>O){h.z(c 18(s.23(O,B),1))}O=B+11;19=0;i=8.3O('{#/1m}',I);2X}B=s.2i(I[i],O);9(B>O){h.z(c 18(s.23(O,B),19))}5 3M=I[i].1f(/\\{#([\\w\\/]+).*?\\}/);5 2q=J.$1;2U(2q){y'3I':++1Q;h.1M();y'9':e=c 1i(I[i],h);h.z(e);h=e;N;y'1b':h.1M();N;y'/9':2n(1Q){h=h.1J();--1Q}y'/H':y'/2h':h=h.1J();N;y'2h':e=c 1l(I[i],h);h.z(e);h=e;N;y'2g':h.z(c 2e(I[i],4.2v));N;y'b':h.z(c 2d(I[i]));N;y'2a':h.z(c 29(I[i]));N;y'3w':h.z(c 18('{'));N;y'3v':h.z(c 18('}'));N;y'1m':19=1;N;y'/1m':13 c 16(\"Z: 31 2N 2Z 1m.\");2M:13 c 16('Z: 3s 3r '+2q+'.');}O=B+I[i].G}9(s.G>O){h.z(c 18(s.3p(O),19))}};A.f.F=7(d,b,x){5 $T=4.1s(d,{21:4.j.2S,2y:4.j.2r});5 $P=8.1q(4.1w,b);9(4.j.2b){$P=4.1s($P,{21:4.j.2b,2y:17})}5 $Q=x;$Q.1X=4.1X;5 X='';H(5 i=0,l=4.1t.G;i<l;++i){X+=4.1t[i].F($T,$P,$Q)}a X};A.f.2p=7(1v,1B){4.1w[1v]=1B};A.f.2C=7(2W){a 2W.L(/&/g,'&3c;').L(/>/g,'&36;').L(/</g,'&2A;').L(/\"/g,'&37;').L(/'/g,'&#39;')};A.f.1s=7(d,1p){9(d==C){a d}2U(d.2z){y 1U:5 o={};H(5 i 1D d){o[i]=4.1s(d[i],1p)}a o;y 3V:5 o=[];H(5 i=0,l=d.G;i<l;++i){o[i]=4.1s(d[i],1p)}a o;y 35:a(1p.21)?(4.2C(d)):(d);y 3U:9(1p.2y){13 c 16(\"Z: 3T 3S 1F 3R.\");}2M:a d}};5 18=7(2w,19){4.1R=2w;4.34=19};18.f.F=7(d,b,x){5 t=4.1R;9(!4.34){5 $T=d;5 $P=b;5 $Q=x;t=t.L(/\\{(.*?)\\}/g,7(3Q,32){5 12=14(32);9(1z 12=='7'){5 j=8.E(x,'1d').j;9(j.2r||!j.2O){a''}1b{12=12($T,$P,$Q)}}a(12===1r)?(\"\"):(35(12))})}a t};5 1i=7(R,1P){4.1O=1P;R.1f(/\\{#(?:1b)*9 (.*?)\\}/);4.30=J.$1;4.1c=[];4.1e=[];4.1n=4.1c};1i.f.z=7(e){4.1n.z(e)};1i.f.1J=7(){a 4.1O};1i.f.1M=7(){4.1n=4.1e};1i.f.F=7(d,b,x){5 $T=d;5 $P=b;5 $Q=x;5 2t=(14(4.30))?(4.1c):(4.1e);5 X='';H(5 i=0,l=2t.G;i<l;++i){X+=2t[i].F(d,b,x)}a X};5 1l=7(R,1P){4.1O=1P;R.1f(/\\{#2h (.+?) 3N (\\w+?)( .+)*\\}/);4.2Y=J.$1;4.m=J.$2;4.V=J.$3||C;9(4.V!==C){5 o=4.V.3L(/[= ]/);9(o[0]===''){o.3K()}4.V={};H(5 i=0,l=o.G;i<l;i+=2){4.V[o[i]]=o[i+1]}}1b{4.V={}}4.1c=[];4.1e=[];4.1n=4.1c};1l.f.z=7(e){4.1n.z(e)};1l.f.1J=7(){a 4.1O};1l.f.1M=7(){4.1n=4.1e};1l.f.F=7(d,b,x){5 $T=d;5 $P=b;5 $Q=x;5 K=14(4.2Y);5 1x=[];5 2o=1z K;9(2o=='2T'){5 2m=[];8.10(K,7(k,v){1x.z(k);2m.z(v)});K=2m}5 s=2l(14(4.V.2N)||0);5 1o=2l(14(4.V.1o)||1);5 e=K.G;5 X='';5 i,l;9(4.V.K){5 12=s+2l(14(4.V.K));e=(12>e)?(e):(12)}9(e>s){5 Y=0;5 2k=3H.3G((e-s)/1o);5 1j,1K;H(;s<e;s+=1o,++Y){1j=1x[s];1K=K[s];9((2o=='2T')&&(1j 1D 1U)&&(1U[1j]===$T[1j])){2X}5 p=$T[4.m]=1K;p.$1T=s;p.$Y=Y;p.$1I=(Y==0);p.$1N=(s+1o>=e);p.$1H=2k;$T[4.m+'$1T']=s;$T[4.m+'$Y']=Y;$T[4.m+'$1I']=(Y==0);$T[4.m+'$1N']=(s+1o>=e);$T[4.m+'$1H']=2k;$T[4.m+'$1x']=1j;$T[4.m+'$1z']=1z 1K;H(i=0,l=4.1c.G;i<l;++i){X+=4.1c[i].F($T,b,x)}D p.$1T;D p.$Y;D p.$1I;D p.$1N;D p.$1H;D $T[4.m+'$1T'];D $T[4.m+'$Y'];D $T[4.m+'$1I'];D $T[4.m+'$1N'];D $T[4.m+'$1H'];D $T[4.m+'$1x'];D $T[4.m+'$1z'];D $T[4.m]}}1b{H(i=0,l=4.1e.G;i<l;++i){X+=4.1e[i].F($T,b,x)}}a X};5 2e=7(R,q){R.1f(/\\{#2g (.*?)(?: 3E=(.*?))?\\}/);4.2f=q[J.$1];9(4.2f==1r){13 c 16('Z: 3D 3C 2g: '+J.$1);}4.2R=J.$2};2e.f.F=7(d,b,x){5 $T=d;a 4.2f.F(14(4.2R),b,x)};5 2d=7(R){R.1f(/\\{#b 1v=(\\w*?) 1B=(.*?)\\}/);4.m=J.$1;4.1R=J.$2};2d.f.F=7(d,b,x){5 $T=d;5 $P=b;5 $Q=x;b[4.m]=14(4.1R);a''};5 29=7(R){R.1f(/\\{#2a 3B=(.*?)\\}/);4.2c=14(J.$1);4.26=4.2c.G;9(4.26<=0){13 c 16('Z: 2a 3z 3y 3x');}4.1V=0;4.27=-1};29.f.F=7(d,b,x){5 1W=8.E(x,'1u');9(1W!=4.27){4.27=1W;4.1V=0}5 i=4.1V++%4.26;a 4.2c[i]};8.M.1h=7(s,q,j){9(s.2z===A){8(4).10(7(){8.E(4,'1d',s);8.E(4,'1u',0)})}1b{8(4).10(7(){8.E(4,'1d',c A(s,q,j));8.E(4,'1u',0)})}};8.M.3u=7(1g,q,j){5 s=8.1Y({1a:1g,25:17}).2L;8(4).1h(s,q,j)};8.M.3q=7(24,q,j){5 s=$('#'+24).2w();9(s==C){s=$('#'+24).2J();s=s.L(/&2A;/g,\"<\").L(/&36;/g,\">\")}s=8.3o(s);s=s.L(/^<\\!\\[3n\\[([\\s\\S]*)\\]\\]>$/3m,'$1');8(4).1h(s,q,j)};8.M.3l=7(){5 K=0;8(4).10(7(){9(8.E(4,'1d')){++K}});a K};8.M.3k=7(){8(4).2P();8(4).10(7(){8.2I(4,'1d')})};8.M.2p=7(1v,1B){8(4).10(7(){5 t=8.E(4,'1d');9(t===1r){13 c 16('Z: A 28 1F 2H.');}t.2p(1v,1B)})};8.M.22=7(d,b){8(4).10(7(){5 t=8.E(4,'1d');9(t===1r){13 c 16('Z: A 28 1F 2H.');}8.E(4,'1u',8.E(4,'1u')+1);8(4).2J(t.F(d,b,4))})};8.M.3j=7(1g,b){5 W=4;5 s=8.1Y({1a:1g,25:17,3i:17,3h:'3A',3g:7(d){8(W).22(d,b)}})};5 1L=7(1a,b,1C,1G,U){4.2G=1a;4.1w=b;4.2F=1C;4.2E=1G;4.U=U;4.20=C;5 W=4;8(U).10(7(){8.E(4,'2j',W)});4.1Z()};1L.f.1Z=7(){4.2D();9(4.U.G==0){a}5 W=4;8.3f(4.2G,4.2E,7(d){8(W.U).22(d,W.1w)});4.20=3e(7(){W.1Z()},4.2F)};1L.f.2D=7(){4.U=8.2B(4.U,7(o){9(8.3d.3b){5 n=o.2s;2n(n&&n!=3a){n=n.2s}a n!=C}1b{a o.2s!=C}})};8.M.38=7(1a,b,1C,1G){5 u=c 1L(1a,b,1C,1G,4);a u.20};8.M.2P=7(){8(4).10(7(){5 1S=8.E(4,'2j');9(1S==C){a}5 W=4;1S.U=8.2B(1S.U,7(o){a o!=W});8.2I(4,'2j')})};8.1q({2V:7(s,q,j){a c A(s,q,j)},3W:7(1g,q,j){5 s=8.1Y({1a:1g,25:17}).2L;a c A(s,q,j)}})})(8)}",
    62,
    245,
    "||||this|var||function|jQuery|if|return|param|new|||prototype||node||settings|||_name||||includes|||||||element|case|push|Template|se|null|delete|data|get|length|for|op|RegExp|count|replace|fn|break|ss|||oper|||objs|_option|that|ret|iteration|jTemplates|each||tmp|throw|eval|_templates_code|Error|false|TextNode|literalMode|url|else|_onTrue|jTemplate|_onFalse|match|url_|setTemplate|opIF|ckey|lastIndex|opFOREACH|literal|_currentState|step|filter|extend|undefined|cloneData|_tree|jTemplateSID|name|_param|key|tname|typeof|_templates|value|interval|in|MAIN|not|args|total|first|getParent|cval|Updater|switchToElse|last|_parent|par|elseif_level|_value|updater|index|Object|_index|sid|version|ajax|run|timer|escapeData|processTemplate|substring|elementName|async|_length|_lastSessionID|is|Cycle|cycle|filter_params|_values|UserParam|Include|_template|include|foreach|indexOf|jTemplateUpdater|_total|Number|arr|while|mode|setParam|op_|disallow_functions|parentNode|tab|iter|_includes|val|reg|noFunc|constructor|lt|grep|escapeHTML|detectDeletedNodes|_args|_interval|_url|defined|removeData|html|splitTemplates|responseText|default|begin|runnable_functions|processTemplateStop|window|_root|filter_data|object|switch|createTemplate|txt|continue|_arg|of|_cond|No|__a1|template|_literalMode|String|gt|quot|processTemplateStart||document|msie|amp|browser|setTimeout|getJSON|success|dataType|cache|processTemplateURL|removeTemplate|hasTemplate|im|CDATA|trim|substr|setTemplateElement|tag|unknown|closed|setTemplateURL|rdelim|ldelim|elements|no|has|json|values|find|Cannot|root|true|ceil|Math|elseif|exec|shift|split|ppp|as|inArray|end|__a0|allowed|are|Functions|Function|Array|createTemplateURL".split(
      "|"
    ),
    0,
    {}
  )
);
(function ($) {
  function toIntegersAtLease(n) {
    return n < 10 ? "0" + n : n;
  }
  Date.prototype.toJSON = function (date) {
    return (
      date.getUTCFullYear() +
      "-" +
      toIntegersAtLease(date.getUTCMonth() + 1) +
      "-" +
      toIntegersAtLease(date.getUTCDate())
    );
  };
  var escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
  var meta = {
    "\b": "\\b",
    "	": "\\t",
    "\n": "\\n",
    "\f": "\\f",
    "\r": "\\r",
    '"': '\\"',
    "\\": "\\\\",
  };
  $.quoteString = function (string) {
    if (escapeable.test(string)) {
      return (
        '"' +
        string.replace(escapeable, function (a) {
          var c = meta[a];
          if (typeof c === "string") {
            return c;
          }
          c = a.charCodeAt();
          return (
            "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16)
          );
        }) +
        '"'
      );
    }
    return '"' + string + '"';
  };
  $.toJSON = function (o) {
    var type = typeof o;
    if (type == "undefined") return "null";
    else if (type == "number" || type == "boolean") return o + "";
    else if (o === null) return "null";
    if (type == "string") {
      return $.quoteString(o);
    }
    if (type == "object" && typeof o.toJSONObject == "function")
      return $.toJSON(o.toJSONObject());
    if (type != "function" && typeof o.length == "number") {
      var ret = [];
      for (var i = 0; i < o.length; i++) {
        ret.push($.toJSON(o[i]));
      }
      return "[" + ret.join(", ") + "]";
    }
    if (type == "function") {
      throw new TypeError(
        "Unable to convert object of type 'function' to json."
      );
    }
    ret = [];
    for (var k in o) {
      var name;
      var type = typeof k;
      if (type == "number") name = '"' + k + '"';
      else if (type == "string") name = $.quoteString(k);
      else continue;
      val = $.toJSON(o[k]);
      if (typeof val != "string") {
        continue;
      }
      ret.push(name + ": " + val);
    }
    return "{" + ret.join(", ") + "}";
  };
  $.evalJSON = function (src) {
    return eval("(" + src + ")");
  };
  $.secureEvalJSON = function (src) {
    var filtered = src;
    filtered = filtered.replace(/\\["\\\/bfnrtu]/g, "@");
    filtered = filtered.replace(
      /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
      "]"
    );
    filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, "");
    if (/^[\],:{}\s]*$/.test(filtered)) return eval("(" + src + ")");
    else throw new SyntaxError("Error parsing JSON, source is not valid.");
  };
})(jQuery);
var USE_SJCL = true;
if (USE_SJCL) {
  var BigInt = BigInteger;
  BigInt.TWO = new BigInt("2", 10);
  BigInt.setup = function (callback, fail_callback) {
    callback();
  };
  BigInt.prototype.toJSONObject = function () {
    return this.toString();
  };
} else {
  BigInt = Class.extend({
    init: function (value, radix) {
      if (value == null) {
        throw "null value!";
      }
      if (USE_SJCL) {
        this._java_bigint = new BigInteger(value, radix);
      } else if (BigInt.use_applet) {
        this._java_bigint = BigInt.APPLET.newBigInteger(value, radix);
      } else {
        try {
          this._java_bigint = new java.math.BigInteger(value, radix);
        } catch (e) {
          throw TypeError;
        }
      }
    },
    toString: function () {
      return this._java_bigint.toString() + "";
    },
    toJSONObject: function () {
      return this.toString();
    },
    add: function (other) {
      return BigInt._from_java_object(
        this._java_bigint.add(other._java_bigint)
      );
    },
    bitLength: function () {
      return this._java_bigint.bitLength();
    },
    mod: function (modulus) {
      return BigInt._from_java_object(
        this._java_bigint.mod(modulus._java_bigint)
      );
    },
    equals: function (other) {
      return this._java_bigint.equals(other._java_bigint);
    },
    modPow: function (exp, modulus) {
      return BigInt._from_java_object(
        this._java_bigint.modPow(exp._java_bigint, modulus._java_bigint)
      );
    },
    negate: function () {
      return BigInt._from_java_object(this._java_bigint.negate());
    },
    multiply: function (other) {
      return BigInt._from_java_object(
        this._java_bigint.multiply(other._java_bigint)
      );
    },
    modInverse: function (modulus) {
      return BigInt._from_java_object(
        this._java_bigint.modInverse(modulus._java_bigint)
      );
    },
  });
  BigInt.ready_p = false;
  BigInt._from_java_object = function (jo) {
    var obj = new BigInt("0", 10);
    obj._java_bigint = jo;
    return obj;
  };
  function check_applet() {
    var is_ns4 = navigator.appName == "Netscape" && navigator.appVersion < "5";
    var str_workaround = navigator.appName == "Opera";
    BigInt.is_ie = navigator.appName == "Microsoft Internet Explorer";
    var use_applet =
      BigInt.is_ie ||
      (!is_ns4 && navigator.platform.substr(0, 5) == "Linux") ||
      str_workaround ||
      typeof java == "undefined";
    if (use_applet) {
      var applet_base = JSCRYPTO_HOME;
      var applet_html =
        '<applet codebase="' +
        applet_base +
        '" mayscript name="bigint" code="bigint.class" width=1 height=1 id="bigint_applet"></applet>';
      $("#applet_div").html(applet_html);
    }
    return use_applet;
  }
  BigInt._setup = function () {
    if (BigInt.use_applet) {
      BigInt.APPLET = document.applets["bigint"];
    }
    try {
      BigInt.ZERO = new BigInt("0", 10);
      BigInt.ONE = new BigInt("1", 10);
      BigInt.TWO = new BigInt("2", 10);
      BigInt.FORTY_TWO = new BigInt("42", 10);
      BigInt.ready_p = true;
    } catch (e) {
      if (this.num_invocations == null) this.num_invocations = 0;
      this.num_invocations += 1;
      if (this.num_invocations > 5) {
        if (!USE_SJCL) {
          USE_SJCL = true;
          this.num_invocations = 1;
          BigInt.use_applet = false;
        } else {
          if (BigInt.setup_interval)
            window.clearInterval(BigInt.setup_interval);
          if (BigInt.setup_fail) {
            BigInt.setup_fail();
          } else {
            alert("bigint failed!");
          }
        }
      }
      return;
    }
    if (BigInt.setup_interval) window.clearInterval(BigInt.setup_interval);
    if (BigInt.setup_callback) BigInt.setup_callback();
  };
  BigInt.setup = function (callback, fail_callback) {
    if (callback) BigInt.setup_callback = callback;
    if (fail_callback) BigInt.setup_fail = fail_callback;
    BigInt.setup_interval = window.setInterval("BigInt._setup()", 1e3);
  };
}
BigInt.fromJSONObject = function (s) {
  return new BigInt(s, 10);
};
BigInt.fromInt = function (i) {
  return BigInt.fromJSONObject("" + i);
};
BigInt.use_applet = false;
Random = {};
Random.GENERATOR = null;
Random.setupGenerator = function () {};
Random.getRandomInteger = function (max) {
  var bit_length = max.bitLength();
  Random.setupGenerator();
  var random;
  random = sjcl.random.randomWords(bit_length / 32, 0);
  var rand_bi = new BigInt(sjcl.codec.hex.fromBits(random), 16);
  return rand_bi.mod(max);
  return BigInt._from_java_object(random).mod(max);
};
ElGamal = {};
ElGamal.Params = Class.extend({
  init: function (p, q, g) {
    this.p = p;
    this.q = q;
    this.g = g;
  },
  generate: function () {
    var x = Random.getRandomInteger(this.q);
    var y = this.g.modPow(x, this.p);
    var pk = new ElGamal.PublicKey(this.p, this.q, this.g, y);
    var sk = new ElGamal.SecretKey(x, pk);
    return sk;
  },
  toJSONObject: function () {
    return {
      g: this.g.toJSONObject(),
      p: this.p.toJSONObject(),
      q: this.q.toJSONObject(),
    };
  },
});
ElGamal.Params.fromJSONObject = function (d) {
  var params = new ElGamal.Params();
  params.p = BigInt.fromJSONObject(d.p);
  params.q = BigInt.fromJSONObject(d.q);
  params.g = BigInt.fromJSONObject(d.g);
  return params;
};
ElGamal.PublicKey = Class.extend({
  init: function (p, q, g, y) {
    this.p = p;
    this.q = q;
    this.g = g;
    this.y = y;
  },
  toJSONObject: function () {
    return {
      g: this.g.toJSONObject(),
      p: this.p.toJSONObject(),
      q: this.q.toJSONObject(),
      y: this.y.toJSONObject(),
    };
  },
  verifyKnowledgeOfSecretKey: function (proof, challenge_generator) {
    if (challenge_generator != null) {
      if (!proof.challenge.equals(challenge_generator(proof.commitment))) {
        return false;
      }
    }
    var check = this.g
      .modPow(proof.response, this.p)
      .equals(
        this.y
          .modPow(proof.challenge, this.p)
          .multiply(proof.commitment)
          .mod(this.p)
      );
    return check;
  },
  verifyDecryptionFactor: function (
    ciphertext,
    decryption_factor,
    decryption_proof,
    challenge_generator
  ) {
    return decryption_proof.verify(
      this.g,
      ciphertext.alpha,
      this.y,
      decryption_factor,
      this.p,
      this.q,
      challenge_generator
    );
  },
  multiply: function (other) {
    if (other == 0 || other == 1) {
      return this;
    }
    if (!this.p.equals(other.p)) throw "mismatched params";
    if (!this.g.equals(other.g)) throw "mismatched params";
    var new_pk = new ElGamal.PublicKey(
      this.p,
      this.q,
      this.g,
      this.y.multiply(other.y).mod(this.p)
    );
    return new_pk;
  },
  equals: function (other) {
    return (
      this.p.equals(other.p) &&
      this.q.equals(other.q) &&
      this.g.equals(other.g) &&
      this.y.equals(other.y)
    );
  },
});
ElGamal.PublicKey.fromJSONObject = function (d) {
  var pk = new ElGamal.PublicKey();
  pk.p = BigInt.fromJSONObject(d.p);
  pk.q = BigInt.fromJSONObject(d.q);
  pk.g = BigInt.fromJSONObject(d.g);
  pk.y = BigInt.fromJSONObject(d.y);
  return pk;
};
ElGamal.SecretKey = Class.extend({
  init: function (x, pk) {
    this.x = x;
    this.pk = pk;
  },
  toJSONObject: function () {
    return { public_key: this.pk.toJSONObject(), x: this.x.toJSONObject() };
  },
  decryptionFactor: function (ciphertext) {
    var decryption_factor = ciphertext.alpha.modPow(this.x, this.pk.p);
    return decryption_factor;
  },
  decrypt: function (ciphertext, decryption_factor) {
    if (!decryption_factor)
      decryption_factor = this.decryptionFactor(ciphertext);
    return ciphertext.decrypt([decryption_factor]);
  },
  decryptAndProve: function (ciphertext, challenge_generator) {
    var dec_factor_and_proof = this.decryptionFactorAndProof(
      ciphertext,
      challenge_generator
    );
    var plaintext = this.decrypt(
      ciphertext,
      dec_factor_and_proof.decryption_factor
    );
    return {
      plaintext: plaintext,
      proof: dec_factor_and_proof.decryption_proof,
    };
  },
  decryptionFactorAndProof: function (ciphertext, challenge_generator) {
    var decryption_factor = this.decryptionFactor(ciphertext);
    var proof = ElGamal.Proof.generate(
      this.pk.g,
      ciphertext.alpha,
      this.x,
      this.pk.p,
      this.pk.q,
      challenge_generator
    );
    return { decryption_factor: decryption_factor, decryption_proof: proof };
  },
  proveKnowledge: function (challenge_generator) {
    var w = Random.getRandomInteger(this.pk.q);
    var s = this.pk.g.modPow(w, this.pk.p);
    var challenge = challenge_generator(s);
    var response = w.add(this.x.multiply(challenge)).mod(this.pk.q);
    return new ElGamal.DLogProof(s, challenge, response);
  },
});
ElGamal.SecretKey.fromJSONObject = function (d) {
  var sk = new ElGamal.SecretKey();
  sk.pk = ElGamal.PublicKey.fromJSONObject(d.public_key);
  sk.x = BigInt.fromJSONObject(d.x);
  return sk;
};
ElGamal.Ciphertext = Class.extend({
  init: function (alpha, beta, pk) {
    this.alpha = alpha;
    this.beta = beta;
    this.pk = pk;
  },
  toString: function () {
    return this.alpha.toString() + "," + this.beta.toString();
  },
  toJSONObject: function () {
    return { alpha: this.alpha.toJSONObject(), beta: this.beta.toJSONObject() };
  },
  multiply: function (other) {
    if (other == 1) return this;
    return new ElGamal.Ciphertext(
      this.alpha.multiply(other.alpha).mod(this.pk.p),
      this.beta.multiply(other.beta).mod(this.pk.p),
      this.pk
    );
  },
  decrypt: function (list_of_dec_factors) {
    var running_decryption = this.beta;
    var self = this;
    _(list_of_dec_factors).each(function (dec_factor) {
      running_decryption = dec_factor
        .modInverse(self.pk.p)
        .multiply(running_decryption)
        .mod(self.pk.p);
    });
    return new ElGamal.Plaintext(running_decryption, this.pk, false);
  },
  generateProof: function (plaintext, randomness, challenge_generator) {
    var proof = ElGamal.Proof.generate(
      this.pk.g,
      this.pk.y,
      randomness,
      this.pk.p,
      this.pk.q,
      challenge_generator
    );
    return proof;
  },
  simulateProof: function (plaintext, challenge) {
    var beta_over_plaintext = this.beta
      .multiply(plaintext.m.modInverse(this.pk.p))
      .mod(this.pk.p);
    return ElGamal.Proof.simulate(
      this.pk.g,
      this.pk.y,
      this.alpha,
      beta_over_plaintext,
      this.pk.p,
      this.pk.q,
      challenge
    );
  },
  verifyProof: function (plaintext, proof, challenge_generator) {
    var beta_over_m = this.beta
      .multiply(plaintext.m.modInverse(this.pk.p))
      .mod(this.pk.p);
    return proof.verify(
      this.pk.g,
      this.pk.y,
      this.alpha,
      beta_over_m,
      this.pk.p,
      this.pk.q,
      challenge_generator
    );
  },
  verifyDecryptionProof: function (plaintext, proof, challenge_generator) {
    var beta_over_m = this.beta
      .multiply(plaintext.m.modInverse(this.pk.p))
      .mod(this.pk.p);
    return proof.verify(
      this.pk.g,
      this.alpha,
      this.pk.y,
      beta_over_m,
      this.pk.p,
      this.pk.q,
      challenge_generator
    );
  },
  generateDisjunctiveProof: function (
    list_of_plaintexts,
    real_index,
    randomness,
    challenge_generator
  ) {
    var self = this;
    var proofs = _(list_of_plaintexts).map(function (plaintext, p_num) {
      if (p_num == real_index) {
        return {};
      } else {
        return self.simulateProof(plaintext);
      }
    });
    var real_proof = this.generateProof(
      list_of_plaintexts[real_index],
      randomness,
      function (commitment) {
        proofs[real_index] = { commitment: commitment };
        var commitments = _(proofs).map(function (proof) {
          return proof.commitment;
        });
        var disjunctive_challenge = challenge_generator(commitments);
        var real_challenge = disjunctive_challenge;
        _(proofs).each(function (proof, proof_num) {
          if (proof_num != real_index)
            real_challenge = real_challenge.add(proof.challenge.negate());
        });
        return real_challenge.mod(self.pk.q);
      }
    );
    proofs[real_index] = real_proof;
    return new ElGamal.DisjunctiveProof(proofs);
  },
  verifyDisjunctiveProof: function (
    list_of_plaintexts,
    disj_proof,
    challenge_generator
  ) {
    var result = true;
    var proofs = disj_proof.proofs;
    for (var i = 0; i < list_of_plaintexts.length; i++) {
      if (!this.verifyProof(list_of_plaintexts[i], proofs[i])) return false;
    }
    var commitments = _(proofs).map(function (proof) {
      return proof.commitment;
    });
    var expected_challenge = challenge_generator(commitments);
    var sum = new BigInt("0", 10);
    var self = this;
    _(proofs).each(function (proof) {
      sum = sum.add(proof.challenge).mod(self.pk.q);
    });
    return expected_challenge.equals(sum);
  },
  equals: function (other) {
    return this.alpha.equals(other.alpha) && this.beta.equals(other.beta);
  },
});
ElGamal.Ciphertext.fromJSONObject = function (d, pk) {
  return new ElGamal.Ciphertext(
    BigInt.fromJSONObject(d.alpha),
    BigInt.fromJSONObject(d.beta),
    pk
  );
};
ElGamal.Plaintext = Class.extend({
  init: function (m, pk, encode_m) {
    if (m == null) {
      alert("oy null m");
      return;
    }
    this.pk = pk;
    if (encode_m) {
      var y = m.add(BigInt.ONE);
      var test = y.modPow(pk.q, pk.p);
      if (test.equals(BigInt.ONE)) {
        this.m = y;
      } else {
        this.m = y.negate().mod(pk.p);
      }
    } else {
      this.m = m;
    }
  },
  getPlaintext: function () {
    var y;
    if (this.m.compareTo(this.pk.q) < 0) {
      y = this.m;
    } else {
      y = this.m.negate().mod(this.pk.p);
    }
    return y.subtract(BigInt.ONE);
  },
  getM: function () {
    return this.m;
  },
});
ElGamal.Proof = Class.extend({
  init: function (A, B, challenge, response) {
    this.commitment = {};
    this.commitment.A = A;
    this.commitment.B = B;
    this.challenge = challenge;
    this.response = response;
  },
  toJSONObject: function () {
    return {
      challenge: this.challenge.toJSONObject(),
      commitment: {
        A: this.commitment.A.toJSONObject(),
        B: this.commitment.B.toJSONObject(),
      },
      response: this.response.toJSONObject(),
    };
  },
  verify: function (
    little_g,
    little_h,
    big_g,
    big_h,
    p,
    q,
    challenge_generator
  ) {
    var first_check = little_g
      .modPow(this.response, p)
      .equals(
        big_g.modPow(this.challenge, p).multiply(this.commitment.A).mod(p)
      );
    var second_check = little_h
      .modPow(this.response, p)
      .equals(
        big_h.modPow(this.challenge, p).multiply(this.commitment.B).mod(p)
      );
    var third_check = true;
    if (challenge_generator) {
      third_check = this.challenge.equals(challenge_generator(this.commitment));
    }
    return first_check && second_check && third_check;
  },
});
ElGamal.Proof.fromJSONObject = function (d) {
  return new ElGamal.Proof(
    BigInt.fromJSONObject(d.commitment.A),
    BigInt.fromJSONObject(d.commitment.B),
    BigInt.fromJSONObject(d.challenge),
    BigInt.fromJSONObject(d.response)
  );
};
ElGamal.Proof.generate = function (
  little_g,
  little_h,
  x,
  p,
  q,
  challenge_generator
) {
  var w = Random.getRandomInteger(q);
  var proof = new ElGamal.Proof();
  proof.commitment.A = little_g.modPow(w, p);
  proof.commitment.B = little_h.modPow(w, p);
  proof.challenge = challenge_generator(proof.commitment);
  proof.response = w.add(x.multiply(proof.challenge)).mod(q);
  return proof;
};
ElGamal.Proof.simulate = function (
  little_g,
  little_h,
  big_g,
  big_h,
  p,
  q,
  challenge
) {
  if (challenge == null) {
    challenge = Random.getRandomInteger(q);
  }
  var response = Random.getRandomInteger(q);
  var A = big_g
    .modPow(challenge, p)
    .modInverse(p)
    .multiply(little_g.modPow(response, p))
    .mod(p);
  var B = big_h
    .modPow(challenge, p)
    .modInverse(p)
    .multiply(little_h.modPow(response, p))
    .mod(p);
  return new ElGamal.Proof(A, B, challenge, response);
};
ElGamal.DisjunctiveProof = Class.extend({
  init: function (list_of_proofs) {
    this.proofs = list_of_proofs;
  },
  toJSONObject: function () {
    return _(this.proofs).map(function (proof) {
      return proof.toJSONObject();
    });
  },
});
ElGamal.DisjunctiveProof.fromJSONObject = function (d) {
  if (d == null) return null;
  return new ElGamal.DisjunctiveProof(
    _(d).map(function (p) {
      return ElGamal.Proof.fromJSONObject(p);
    })
  );
};
ElGamal.encrypt = function (pk, plaintext, r) {
  if (plaintext.getM().equals(BigInt.ZERO))
    throw "Can't encrypt 0 with El Gamal";
  if (!r) r = Random.getRandomInteger(pk.q);
  var alpha = pk.g.modPow(r, pk.p);
  var beta = pk.y.modPow(r, pk.p).multiply(plaintext.m).mod(pk.p);
  return new ElGamal.Ciphertext(alpha, beta, pk);
};
ElGamal.DLogProof = Class.extend({
  init: function (commitment, challenge, response) {
    this.commitment = commitment;
    this.challenge = challenge;
    this.response = response;
  },
  toJSONObject: function () {
    return {
      challenge: this.challenge.toJSONObject(),
      commitment: this.commitment.toJSONObject(),
      response: this.response.toJSONObject(),
    };
  },
});
ElGamal.DLogProof.fromJSONObject = function (d) {
  return new ElGamal.DLogProof(
    BigInt.fromJSONObject(d.commitment || d.s),
    BigInt.fromJSONObject(d.challenge),
    BigInt.fromJSONObject(d.response)
  );
};
ElGamal.disjunctive_challenge_generator = function (commitments) {
  var strings_to_hash = [];
  _(commitments).each(function (commitment) {
    strings_to_hash[strings_to_hash.length] = commitment.A.toJSONObject();
    strings_to_hash[strings_to_hash.length] = commitment.B.toJSONObject();
  });
  return new BigInt(hex_sha1(strings_to_hash.join(",")), 16);
};
ElGamal.fiatshamir_challenge_generator = function (commitment) {
  return ElGamal.disjunctive_challenge_generator([commitment]);
};
ElGamal.fiatshamir_dlog_challenge_generator = function (commitment) {
  return new BigInt(hex_sha1(commitment.toJSONObject()), 16);
};
var hexcase = 0;
var b64pad = "";
var chrsz = 8;
function hex_sha1(s) {
  return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
}
function b64_sha1(s) {
  return binb2b64(core_sha1(str2binb(s), s.length * chrsz));
}
function str_sha1(s) {
  return binb2str(core_sha1(str2binb(s), s.length * chrsz));
}
function hex_hmac_sha1(key, data) {
  return binb2hex(core_hmac_sha1(key, data));
}
function b64_hmac_sha1(key, data) {
  return binb2b64(core_hmac_sha1(key, data));
}
function str_hmac_sha1(key, data) {
  return binb2str(core_hmac_sha1(key, data));
}
function sha1_vm_test() {
  return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
}
function core_sha1(x, len) {
  x[len >> 5] |= 128 << (24 - (len % 32));
  x[(((len + 64) >> 9) << 4) + 15] = len;
  var w = Array(80);
  var a = 1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d = 271733878;
  var e = -1009589776;
  for (var i = 0; i < x.length; i += 16) {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;
    var olde = e;
    for (var j = 0; j < 80; j++) {
      if (j < 16) w[j] = x[i + j];
      else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
      var t = safe_add(
        safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
        safe_add(safe_add(e, w[j]), sha1_kt(j))
      );
      e = d;
      d = c;
      c = rol(b, 30);
      b = a;
      a = t;
    }
    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
    e = safe_add(e, olde);
  }
  return Array(a, b, c, d, e);
}
function sha1_ft(t, b, c, d) {
  if (t < 20) return (b & c) | (~b & d);
  if (t < 40) return b ^ c ^ d;
  if (t < 60) return (b & c) | (b & d) | (c & d);
  return b ^ c ^ d;
}
function sha1_kt(t) {
  return t < 20
    ? 1518500249
    : t < 40
    ? 1859775393
    : t < 60
    ? -1894007588
    : -899497514;
}
function core_hmac_sha1(key, data) {
  var bkey = str2binb(key);
  if (bkey.length > 16) bkey = core_sha1(bkey, key.length * chrsz);
  var ipad = Array(16),
    opad = Array(16);
  for (var i = 0; i < 16; i++) {
    ipad[i] = bkey[i] ^ 909522486;
    opad[i] = bkey[i] ^ 1549556828;
  }
  var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
  return core_sha1(opad.concat(hash), 512 + 160);
}
function safe_add(x, y) {
  var lsw = (x & 65535) + (y & 65535);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 65535);
}
function rol(num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt));
}
function str2binb(str) {
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for (var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i >> 5] |=
      (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - (i % 32));
  return bin;
}
function binb2str(bin) {
  var str = "";
  var mask = (1 << chrsz) - 1;
  for (var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode(
      (bin[i >> 5] >>> (32 - chrsz - (i % 32))) & mask
    );
  return str;
}
function binb2hex(binarray) {
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for (var i = 0; i < binarray.length * 4; i++) {
    str +=
      hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8 + 4)) & 15) +
      hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8)) & 15);
  }
  return str;
}
function binb2b64(binarray) {
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for (var i = 0; i < binarray.length * 4; i += 3) {
    var triplet =
      (((binarray[i >> 2] >> (8 * (3 - (i % 4)))) & 255) << 16) |
      (((binarray[(i + 1) >> 2] >> (8 * (3 - ((i + 1) % 4)))) & 255) << 8) |
      ((binarray[(i + 2) >> 2] >> (8 * (3 - ((i + 2) % 4)))) & 255);
    for (var j = 0; j < 4; j++) {
      if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> (6 * (3 - j))) & 63);
    }
  }
  return str;
}
var chrsz = 8;
var hexcase = 0;
function safe_add(x, y) {
  var lsw = (x & 65535) + (y & 65535);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 65535);
}
function S(X, n) {
  return (X >>> n) | (X << (32 - n));
}
function R(X, n) {
  return X >>> n;
}
function Ch(x, y, z) {
  return (x & y) ^ (~x & z);
}
function Maj(x, y, z) {
  return (x & y) ^ (x & z) ^ (y & z);
}
function Sigma0256(x) {
  return S(x, 2) ^ S(x, 13) ^ S(x, 22);
}
function Sigma1256(x) {
  return S(x, 6) ^ S(x, 11) ^ S(x, 25);
}
function Gamma0256(x) {
  return S(x, 7) ^ S(x, 18) ^ R(x, 3);
}
function Gamma1256(x) {
  return S(x, 17) ^ S(x, 19) ^ R(x, 10);
}
function Sigma0512(x) {
  return S(x, 28) ^ S(x, 34) ^ S(x, 39);
}
function Sigma1512(x) {
  return S(x, 14) ^ S(x, 18) ^ S(x, 41);
}
function Gamma0512(x) {
  return S(x, 1) ^ S(x, 8) ^ R(x, 7);
}
function Gamma1512(x) {
  return S(x, 19) ^ S(x, 61) ^ R(x, 6);
}
function core_sha256(m, l) {
  var K = new Array(
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
  );
  var HASH = new Array(
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  );
  var W = new Array(64);
  var a, b, c, d, e, f, g, h, i, j;
  var T1, T2;
  m[l >> 5] |= 128 << (24 - (l % 32));
  m[(((l + 64) >> 9) << 4) + 15] = l;
  for (var i = 0; i < m.length; i += 16) {
    a = HASH[0];
    b = HASH[1];
    c = HASH[2];
    d = HASH[3];
    e = HASH[4];
    f = HASH[5];
    g = HASH[6];
    h = HASH[7];
    for (var j = 0; j < 64; j++) {
      if (j < 16) W[j] = m[j + i];
      else
        W[j] = safe_add(
          safe_add(
            safe_add(Gamma1256(W[j - 2]), W[j - 7]),
            Gamma0256(W[j - 15])
          ),
          W[j - 16]
        );
      T1 = safe_add(
        safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]),
        W[j]
      );
      T2 = safe_add(Sigma0256(a), Maj(a, b, c));
      h = g;
      g = f;
      f = e;
      e = safe_add(d, T1);
      d = c;
      c = b;
      b = a;
      a = safe_add(T1, T2);
    }
    HASH[0] = safe_add(a, HASH[0]);
    HASH[1] = safe_add(b, HASH[1]);
    HASH[2] = safe_add(c, HASH[2]);
    HASH[3] = safe_add(d, HASH[3]);
    HASH[4] = safe_add(e, HASH[4]);
    HASH[5] = safe_add(f, HASH[5]);
    HASH[6] = safe_add(g, HASH[6]);
    HASH[7] = safe_add(h, HASH[7]);
  }
  return HASH;
}
function core_sha512(m, l) {
  var K = new Array(
    0x428a2f98d728b000,
    0x7137449123ef6400,
    0xb5c0fbcfec4d3800,
    0xe9b5dba58189d800,
    413170340833845e4,
    0x59f111f1b605d000,
    0x923f82a4af195000,
    0xab1c5ed5da6d8000,
    0xd807aa98a3030000,
    0x12835b0145707000,
    0x243185be4ee4b200,
    0x550c7dc3d5ffb400,
    0x72be5d74f27b8800,
    0x80deb1fe3b169800,
    0x9bdc06a725c71000,
    0xc19bf174cf692800,
    0xe49b69c19ef14800,
    0xefbe4786384f2800,
    0xfc19dc68b8cd580,
    0x240ca1cc77ac9c00,
    0x2de92c6f592b0200,
    0x4a7484aa6ea6e400,
    0x5cb0a9dcbd41fc00,
    0x76f988da83115400,
    0x983e5152ee66e000,
    0xa831c66d2db43000,
    0xb00327c898fb2000,
    0xbf597fc7beef1000,
    0xc6e00bf33da89000,
    0xd5a79147930aa800,
    0x6ca6351e0038280,
    0x142929670a0e6e00,
    0x27b70a8546d23000,
    0x2e1b21385c26ca00,
    0x4d2c6dfc5ac42c00,
    0x53380d139d95b400,
    0x650a73548baf6400,
    0x766a0abb3c77b400,
    935025697698701e4,
    0x92722c8514823800,
    0xa2bfe8a14cf10000,
    0xa81a664bbc423000,
    0xc24b8b70d0f89800,
    0xc76c51a30654c000,
    0xd192e819d6ef5000,
    0xd69906245565a800,
    0xf40e358557712000,
    0x106aa07032bbd200,
    0x19a4c116b8d2d100,
    0x1e376c085141ab00,
    0x2748774cdf8eec00,
    0x34b0bcb5e19b4800,
    0x391c0cb3c5c95a00,
    0x4ed8aa4ae3418c00,
    0x5b9cca4f7763e400,
    0x682e6ff3d6b2b800,
    0x748f82ee5defb400,
    0x78a5636f43173000,
    0x84c87814a1f0a800,
    0x8cc702081a643800,
    0x90befffa23632000,
    0xa4506cebde82c000,
    0xbef9a3f7b2c67800,
    0xc67178f2e3725000,
    0xca273eceea266000,
    0xd186b8c721c0c000,
    0xeada7dd6cde0e800,
    0xf57d4f7fee6ed000,
    0x6f067aa72176fc0,
    0xa637dc5a2c89880,
    0x113f9804bef90e00,
    0x1b710b35131c4700,
    0x28db77f523047e00,
    0x32caab7b40c72400,
    0x3c9ebe0a15c9be00,
    0x431d67c49c100c00,
    0x4cc5d4becb3e4400,
    0x597f299cfc658000,
    0x5fcb6fab3ad6fc00,
    0x6c44198c4a475800
  );
  var HASH = new Array(
    0x6a09e667f3bcc800,
    0xbb67ae8584caa800,
    0x3c6ef372fe94f800,
    0xa54ff53a5f1d3800,
    0x510e527fade68400,
    0x9b05688c2b3e7000,
    0x1f83d9abfb41bd00,
    0x5be0cd19137e2000
  );
  var W = new Array(80);
  var a, b, c, d, e, f, g, h, i, j;
  var T1, T2;
}
function str2binb(str) {
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for (var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - (i % 32));
  return bin;
}
function binb2str(bin) {
  var str = "";
  var mask = (1 << chrsz) - 1;
  for (var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i >> 5] >>> (24 - (i % 32))) & mask);
  return str;
}
function binb2hex(binarray) {
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for (var i = 0; i < binarray.length * 4; i++) {
    str +=
      hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8 + 4)) & 15) +
      hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8)) & 15);
  }
  return str;
}
function binb2b64(binarray) {
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for (var i = 0; i < binarray.length * 4; i += 3) {
    var triplet =
      (((binarray[i >> 2] >> (8 * (3 - (i % 4)))) & 255) << 16) |
      (((binarray[(i + 1) >> 2] >> (8 * (3 - ((i + 1) % 4)))) & 255) << 8) |
      ((binarray[(i + 2) >> 2] >> (8 * (3 - ((i + 2) % 4)))) & 255);
    for (var j = 0; j < 4; j++) {
      if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> (6 * (3 - j))) & 63);
    }
  }
  return str;
}
function hex_sha256(s) {
  return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}
function b64_sha256(s) {
  return binb2b64(core_sha256(str2binb(s), s.length * chrsz));
}
function str_sha256(s) {
  return binb2str(core_sha256(str2binb(s), s.length * chrsz));
}
var UTILS = {};
UTILS.array_remove_value = function (arr, val) {
  var new_arr = [];
  _(arr).each(function (v, i) {
    if (v != val) {
      new_arr.push(v);
    }
  });
  return new_arr;
};
UTILS.select_element_content = function (element) {
  var range;
  if (window.getSelection) {
    var sel = window.getSelection();
    range = document.createRange();
    range.selectNodeContents(element);
    sel.removeAllRanges();
    sel.addRange(range);
  } else {
    document.selection.empty();
    range = document.body.createTextRange();
    range.moveToElementText(el);
    range.select();
  }
};
UTILS.PROGRESS = Class.extend({
  init: function () {
    this.n_ticks = 0;
    this.current_tick = 0;
  },
  addTicks: function (n_ticks) {
    this.n_ticks += n_ticks;
  },
  tick: function () {
    this.current_tick += 1;
  },
  progress: function () {
    return Math.round((this.current_tick / this.n_ticks) * 100);
  },
});
UTILS.object_sort_keys = function (obj) {
  var new_obj = {};
  _(_.keys(obj)).each(function (k) {
    new_obj[k] = obj[k];
  });
  return new_obj;
};
HELIOS = {};
HELIOS.get_bogus_public_key = function () {
  return ElGamal.PublicKey.fromJSONObject(
    JSON.parse(
      '{"g": "14887492224963187634282421537186040801304008017743492304481737382571933937568724473847106029915040150784031882206090286938661464458896494215273989547889201144857352611058572236578734319505128042602372864570426550855201448111746579871811249114781674309062693442442368697449970648232621880001709535143047913661432883287150003429802392229361583608686643243349727791976247247948618930423866180410558458272606627111270040091203073580238905303994472202930783207472394578498507764703191288249547659899997131166130259700604433891232298182348403175947450284433411265966789131024573629546048637848902243503970966798589660808533", "p": "16328632084933010002384055033805457329601614771185955389739167309086214800406465799038583634953752941675645562182498120750264980492381375579367675648771293800310370964745767014243638518442553823973482995267304044326777047662957480269391322789378384619428596446446984694306187644767462460965622580087564339212631775817895958409016676398975671266179637898557687317076177218843233150695157881061257053019133078545928983562221396313169622475509818442661047018436264806901023966236718367204710755935899013750306107738002364137917426595737403871114187750804346564731250609196846638183903982387884578266136503697493474682071", "q": "61329566248342901292543872769978950870633559608669337131139375508370458778917", "y": "8049609819434159960341080485505898805169812475728892670296439571117039276506298996734003515763387841154083296559889658342770776712289026341097211553854451556820509582109412351633111518323196286638684857563764318086496248973278960517204721786711381246407429787246857335714789053255852788270719245108665072516217144567856965465184127683058484847896371648547639041764249621310049114411288049569523544645318180042074181845024934696975226908854019646138985505600641910417380245960080668869656287919893859172484656506039729440079008919716011166605004711585860172862472422362509002423715947870815838511146670204726187094944"}'
    )
  );
};
HELIOS.Election = Class.extend({
  init: function () {},
  toJSONObject: function () {
    var json_obj = {
      uuid: this.uuid,
      description: this.description,
      short_name: this.short_name,
      name: this.name,
      public_key: this.public_key.toJSONObject(),
      questions: this.questions,
      cast_url: this.cast_url,
      frozen_at: this.frozen_at,
      openreg: this.openreg,
      voters_hash: this.voters_hash,
      use_voter_aliases: this.use_voter_aliases,
      voting_starts_at: this.voting_starts_at,
      voting_ends_at: this.voting_ends_at,
    };
    return UTILS.object_sort_keys(json_obj);
  },
  get_hash: function () {
    if (this.election_hash) return this.election_hash;
    return b64_sha256(this.toJSON());
  },
  toJSON: function () {
    return JSON.stringify(this.toJSONObject());
  },
});
HELIOS.Election.fromJSONString = function (raw_json) {
  var json_object = JSON.parse(raw_json);
  var election = HELIOS.Election.fromJSONObject(json_object);
  election.election_hash = b64_sha256(raw_json);
  return election;
};
HELIOS.Election.fromJSONObject = function (d) {
  var el = new HELIOS.Election();
  _.extend(el, d);
  if (!el.questions) el.questions = [];
  if (el.public_key) {
    el.public_key = ElGamal.PublicKey.fromJSONObject(el.public_key);
  } else {
    el.public_key = HELIOS.get_bogus_public_key();
    el.BOGUS_P = true;
  }
  return el;
};
HELIOS.Election.setup = function (election) {
  return ELECTION.fromJSONObject(election);
};
BALLOT = {};
BALLOT.pretty_choices = function (election, ballot) {
  var questions = election.questions;
  var answers = ballot.answers;
  var choices = _(questions).map(function (q, q_num) {
    return _(answers[q_num]).map(function (ans) {
      return questions[q_num].answers[ans];
    });
  });
  return choices;
};
UTILS.open_window_with_content = function (content, mime_type) {
  if (!mime_type) mime_type = "text/plain";
  if (BigInt.is_ie) {
    w = window.open("");
    w.document.open(mime_type);
    w.document.write(content);
    w.document.close();
  } else {
    w = window.open("data:" + mime_type + "," + encodeURIComponent(content));
  }
};
UTILS.generate_plaintexts = function (pk, min, max) {
  var last_plaintext = BigInt.ONE;
  var plaintexts = [];
  if (min == null) min = 0;
  for (var i = 0; i <= max; i++) {
    if (i >= min)
      plaintexts.push(new ElGamal.Plaintext(last_plaintext, pk, false));
    last_plaintext = last_plaintext.multiply(pk.g).mod(pk.p);
  }
  return plaintexts;
};
HELIOS.EncryptedAnswer = Class.extend({
  init: function (question, answer, pk, progress) {
    if (question == null) return;
    this.answer = answer;
    var enc_result = this.doEncryption(question, answer, pk, null, progress);
    this.choices = enc_result.choices;
    this.randomness = enc_result.randomness;
    this.individual_proofs = enc_result.individual_proofs;
    this.overall_proof = enc_result.overall_proof;
  },
  doEncryption: function (question, answer, pk, randomness, progress) {
    var choices = [];
    var individual_proofs = [];
    var overall_proof = null;
    var plaintexts = null;
    if (question.max != null) {
      plaintexts = UTILS.generate_plaintexts(pk, question.min, question.max);
    }
    var zero_one_plaintexts = UTILS.generate_plaintexts(pk, 0, 1);
    var generate_new_randomness = false;
    if (!randomness) {
      randomness = [];
      generate_new_randomness = true;
    }
    var num_selected_answers = 0;
    for (var i = 0; i < question.answers.length; i++) {
      var index, plaintext_index;
      if (_(answer).include(i)) {
        plaintext_index = 1;
        num_selected_answers += 1;
      } else {
        plaintext_index = 0;
      }
      if (generate_new_randomness) {
        randomness[i] = Random.getRandomInteger(pk.q);
      }
      choices[i] = ElGamal.encrypt(
        pk,
        zero_one_plaintexts[plaintext_index],
        randomness[i]
      );
      if (generate_new_randomness) {
        individual_proofs[i] = choices[i].generateDisjunctiveProof(
          zero_one_plaintexts,
          plaintext_index,
          randomness[i],
          ElGamal.disjunctive_challenge_generator
        );
      }
      if (progress) progress.tick();
    }
    if (generate_new_randomness && question.max != null) {
      var hom_sum = choices[0];
      var rand_sum = randomness[0];
      for (var i = 1; i < question.answers.length; i++) {
        hom_sum = hom_sum.multiply(choices[i]);
        rand_sum = rand_sum.add(randomness[i]).mod(pk.q);
      }
      var overall_plaintext_index = num_selected_answers;
      if (question.min) overall_plaintext_index -= question.min;
      overall_proof = hom_sum.generateDisjunctiveProof(
        plaintexts,
        overall_plaintext_index,
        rand_sum,
        ElGamal.disjunctive_challenge_generator
      );
      if (progress) {
        for (var i = 0; i < question.max; i++) progress.tick();
      }
    }
    return {
      choices: choices,
      randomness: randomness,
      individual_proofs: individual_proofs,
      overall_proof: overall_proof,
    };
  },
  clearPlaintexts: function () {
    this.answer = null;
    this.randomness = null;
  },
  verifyEncryption: function (question, pk) {
    var result = this.doEncryption(question, this.answer, pk, this.randomness);
    if (result.choices.length != this.choices.length) {
      return false;
    }
    for (var i = 0; i < result.choices.length; i++) {
      if (!result.choices[i].equals(this.choices[i])) {
        return false;
      }
    }
    return true;
  },
  toString: function () {
    var choices_strings = _(this.choices).map(function (c) {
      return c.toString();
    });
    return choices_strings.join("|");
  },
  toJSONObject: function (include_plaintext) {
    var return_obj = {
      choices: _(this.choices).map(function (choice) {
        return choice.toJSONObject();
      }),
      individual_proofs: _(this.individual_proofs).map(function (disj_proof) {
        return disj_proof.toJSONObject();
      }),
    };
    if (this.overall_proof != null) {
      return_obj.overall_proof = this.overall_proof.toJSONObject();
    } else {
      return_obj.overall_proof = null;
    }
    if (include_plaintext) {
      return_obj.answer = this.answer;
      return_obj.randomness = _(this.randomness).map(function (r) {
        return r.toJSONObject();
      });
    }
    return return_obj;
  },
});
HELIOS.EncryptedAnswer.fromJSONObject = function (d, election) {
  var ea = new HELIOS.EncryptedAnswer();
  ea.choices = _(d.choices).map(function (choice) {
    return ElGamal.Ciphertext.fromJSONObject(choice, election.public_key);
  });
  ea.individual_proofs = _(d.individual_proofs).map(function (p) {
    return ElGamal.DisjunctiveProof.fromJSONObject(p);
  });
  ea.overall_proof = ElGamal.DisjunctiveProof.fromJSONObject(d.overall_proof);
  if (d.randomness) {
    ea.randomness = _(d.randomness).map(function (r) {
      return BigInt.fromJSONObject(r);
    });
    ea.answer = d.answer;
  }
  return ea;
};
HELIOS.EncryptedVote = Class.extend({
  init: function (election, answers, progress) {
    if (election == null) return;
    this.election_uuid = election.uuid;
    this.election_hash = election.get_hash();
    this.election = election;
    if (answers == null) return;
    var n_questions = election.questions.length;
    this.encrypted_answers = [];
    if (progress) {
      _(election.questions).each(function (q, q_num) {
        progress.addTicks(q.answers.length);
        if (q.max != null) progress.addTicks(q.max);
      });
      progress.addTicks(0, n_questions);
    }
    for (var i = 0; i < n_questions; i++) {
      this.encrypted_answers[i] = new HELIOS.EncryptedAnswer(
        election.questions[i],
        answers[i],
        election.public_key,
        progress
      );
    }
  },
  toString: function () {
    var answer_strings = _(this.encrypted_answers).map(function (a) {
      return a.toString();
    });
    return answer_strings.join("//");
  },
  clearPlaintexts: function () {
    _(this.encrypted_answers).each(function (ea) {
      ea.clearPlaintexts();
    });
  },
  verifyEncryption: function (questions, pk) {
    var overall_result = true;
    _(this.encrypted_answers).each(function (ea, i) {
      overall_result = overall_result && ea.verifyEncryption(questions[i], pk);
    });
    return overall_result;
  },
  toJSONObject: function (include_plaintext) {
    var answers = _(this.encrypted_answers).map(function (ea, i) {
      return ea.toJSONObject(include_plaintext);
    });
    return {
      answers: answers,
      election_hash: this.election_hash,
      election_uuid: this.election_uuid,
    };
  },
  get_hash: function () {
    return b64_sha256(JSON.stringify(this.toJSONObject()));
  },
  get_audit_trail: function () {
    return this.toJSONObject(true);
  },
  verifyProofs: function (pk, outcome_callback) {
    var zero_or_one = UTILS.generate_plaintexts(pk, 0, 1);
    var VALID_P = true;
    var self = this;
    _(this.encrypted_answers).each(function (enc_answer, ea_num) {
      var overall_result = 1;
      var max = self.election.questions[ea_num].max;
      _(enc_answer.choices).each(function (choice, choice_num) {
        var result = choice.verifyDisjunctiveProof(
          zero_or_one,
          enc_answer.individual_proofs[choice_num],
          ElGamal.disjunctive_challenge_generator
        );
        outcome_callback(ea_num, choice_num, result, choice);
        VALID_P = VALID_P && result;
        if (max != null) overall_result = choice.multiply(overall_result);
      });
      if (max != null) {
        var plaintexts = UTILS.generate_plaintexts(
          pk,
          self.election.questions[ea_num].min,
          self.election.questions[ea_num].max
        );
        var overall_check = overall_result.verifyDisjunctiveProof(
          plaintexts,
          enc_answer.overall_proof,
          ElGamal.disjunctive_challenge_generator
        );
        outcome_callback(ea_num, null, overall_check, null);
        VALID_P = VALID_P && overall_check;
      } else {
        VALID_P = VALID_P && enc_answer.overall_proof == null;
      }
    });
    return VALID_P;
  },
});
HELIOS.EncryptedVote.fromJSONObject = function (d, election) {
  if (d == null) return null;
  var ev = new HELIOS.EncryptedVote(election);
  ev.encrypted_answers = _(d.answers).map(function (ea) {
    return HELIOS.EncryptedAnswer.fromJSONObject(ea, election);
  });
  ev.election_hash = d.election_hash;
  ev.election_uuid = d.election_uuid;
  return ev;
};
HELIOS.EncryptedVote.fromEncryptedAnswers = function (election, enc_answers) {
  var enc_vote = new HELIOS.EncryptedVote(election, null);
  enc_vote.encrypted_answers = [];
  _(enc_answers).each(function (enc_answer, answer_num) {
    enc_vote.encrypted_answers[answer_num] = enc_answer;
  });
  return enc_vote;
};
HELIOS.Tally = Class.extend({
  init: function (raw_tally, num_tallied) {
    this.tally = raw_tally;
    this.num_tallied = num_tallied;
  },
  toJSONObject: function () {
    var tally_json_obj = _(this.tally).map(function (one_q) {
      return _(one_q).map(function (one_a) {
        return one_a.toJSONObject();
      });
    });
    return { num_tallied: this.num_tallied, tally: tally_json_obj };
  },
});
HELIOS.Tally.fromJSONObject = function (d, public_key) {
  var num_tallied = d["num_tallied"];
  var raw_tally = _(d["tally"]).map(function (one_q) {
    return _(one_q).map(function (one_a) {
      var new_val = ElGamal.Ciphertext.fromJSONObject(one_a, public_key);
      return new_val;
    });
  });
  return new HELIOS.Tally(raw_tally, num_tallied);
};
HELIOS.jsonify_list_of_lists = function (lol) {
  if (!lol) return null;
  return _(lol).map(function (sublist) {
    return _(sublist).map(function (item) {
      return item.toJSONObject();
    });
  });
};
HELIOS.dejsonify_list_of_lists = function (lol, item_dejsonifier) {
  if (!lol) return null;
  return _(lol).map(function (sublist) {
    return _(sublist).map(function (item) {
      return item_dejsonifier(item);
    });
  });
};
HELIOS.Trustee = Class.extend({
  init: function (
    uuid,
    public_key,
    public_key_hash,
    pok,
    decryption_factors,
    decryption_proofs
  ) {
    this.uuid = uuid;
    this.public_key = public_key;
    this.public_key_hash = public_key_hash;
    this.pok = pok;
    this.decryption_factors = decryption_factors;
    this.decryption_proofs = decryption_proofs;
  },
  toJSONObject: function () {
    return {
      decryption_factors: HELIOS.jsonify_list_of_lists(this.decryption_factors),
      decryption_proofs: HELIOS.jsonify_list_of_list(this.decryption_proofs),
      email: this.email,
      name: this.name,
      pok: this.pok.toJSONObject(),
      public_key: this.public_key.toJSONObject(),
    };
  },
});
HELIOS.Trustee.fromJSONObject = function (d) {
  return new HELIOS.Trustee(
    d.uuid,
    ElGamal.PublicKey.fromJSONObject(d.public_key),
    d.public_key_hash,
    ElGamal.DLogProof.fromJSONObject(d.pok),
    HELIOS.dejsonify_list_of_lists(d.decryption_factors, BigInt.fromJSONObject),
    HELIOS.dejsonify_list_of_lists(
      d.decryption_proofs,
      ElGamal.Proof.fromJSONObject
    )
  );
};
