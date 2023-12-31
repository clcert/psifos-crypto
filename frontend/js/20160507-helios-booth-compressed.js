!(function () {
  var a = !1,
    b = /xyz/.test(function () {
      xyz;
    })
      ? /\b_super\b/
      : /.*/;
  (this.Class = function () {}),
    (Class.extend = function (c) {
      function d() {
        !a && this.init && this.init.apply(this, arguments);
      }
      var e = this.prototype;
      a = !0;
      var f = new this();
      a = !1;
      for (var g in c)
        f[g] =
          "function" == typeof c[g] && "function" == typeof e[g] && b.test(c[g])
            ? (function (a, b) {
                return function () {
                  var c = this._super;
                  this._super = e[a];
                  var d = b.apply(this, arguments);
                  return (this._super = c), d;
                };
              })(g, c[g])
            : c[g];
      return (
        (d.prototype = f), (d.constructor = d), (d.extend = arguments.callee), d
      );
    });
})();
(BigIntDummy = Class.extend({
  init: function (a, b) {
    if (10 != b) throw "in dummy, only radix=10, here radix=" + b;
    this.value = a;
  },
  toString: function () {
    return this.value;
  },
  toJSONObject: function () {
    return this.value;
  },
  add: function (a) {
    throw "dummy, no add!";
  },
  bitLength: function () {
    throw "dummy, nobitlength!";
  },
  mod: function (a) {
    throw "dummy, no mod!";
  },
  equals: function (a) {
    throw "dummy, no equals!";
  },
  modPow: function (a, b) {
    throw "dummy, no modpow!";
  },
  negate: function () {
    throw "dummy, no negate!";
  },
  multiply: function (a) {
    throw "dummy, no multiply!";
  },
  modInverse: function (a) {
    throw "dummy, no modInverse";
  },
})),
  (BigIntDummy.use_applet = !1),
  (BigIntDummy.is_dummy = !0),
  (BigIntDummy.in_browser = !1),
  (BigIntDummy.fromJSONObject = function (a) {
    return new BigIntDummy(a, 10);
  }),
  (BigIntDummy.fromInt = function (a) {
    return BigIntDummy.fromJSONObject("" + a);
  }),
  (BigIntDummy.ZERO = new BigIntDummy("0", 10)),
  (BigIntDummy.ONE = new BigIntDummy("1", 10)),
  (BigIntDummy.TWO = new BigIntDummy("2", 10)),
  (BigIntDummy.FORTY_TWO = new BigIntDummy("42", 10)),
  (BigIntDummy.ready_p = !0),
  (BigIntDummy.setup = function (a, b) {
    a();
  });
function BigInteger(a, b, c) {
  (this.arr = new Array()),
    null != a &&
      ("number" == typeof a
        ? this.fromNumber(a, b, c)
        : null == b && "string" != typeof a
        ? this.fromString(a, 256)
        : this.fromString(a, b));
}
function nbi() {
  return new BigInteger(null);
}
function am1(a, b, c, d, e, f) {
  for (; --f >= 0; ) {
    var g = b * this.arr[a++] + c.arr[d] + e;
    (e = Math.floor(g / 67108864)), (c.arr[d++] = 67108863 & g);
  }
  return e;
}
function am2(a, b, c, d, e, f) {
  for (var g = 32767 & b, h = b >> 15; --f >= 0; ) {
    var i = 32767 & this.arr[a],
      j = this.arr[a++] >> 15,
      k = h * i + j * g;
    (i = g * i + ((32767 & k) << 15) + c.arr[d] + (1073741823 & e)),
      (e = (i >>> 30) + (k >>> 15) + h * j + (e >>> 30)),
      (c.arr[d++] = 1073741823 & i);
  }
  return e;
}
function am3(a, b, c, d, e, f) {
  for (var g = 16383 & b, h = b >> 14; --f >= 0; ) {
    var i = 16383 & this.arr[a],
      j = this.arr[a++] >> 14,
      k = h * i + j * g;
    (i = g * i + ((16383 & k) << 14) + c.arr[d] + e),
      (e = (i >> 28) + (k >> 14) + h * j),
      (c.arr[d++] = 268435455 & i);
  }
  return e;
}
function int2char(a) {
  return BI_RM.charAt(a);
}
function intAt(a, b) {
  var c = BI_RC[a.charCodeAt(b)];
  return null == c ? -1 : c;
}
function bnpCopyTo(a) {
  for (var b = this.t - 1; b >= 0; --b) a.arr[b] = this.arr[b];
  (a.t = this.t), (a.s = this.s);
}
function bnpFromInt(a) {
  (this.t = 1),
    (this.s = 0 > a ? -1 : 0),
    a > 0 ? (this.arr[0] = a) : -1 > a ? (this.arr[0] = a + DV) : (this.t = 0);
}
function nbv(a) {
  var b = nbi();
  return b.fromInt(a), b;
}
function bnpFromString(a, b) {
  var c;
  if (16 == b) c = 4;
  else if (8 == b) c = 3;
  else if (256 == b) c = 8;
  else if (2 == b) c = 1;
  else if (32 == b) c = 5;
  else {
    if (4 != b) return void this.fromRadix(a, b);
    c = 2;
  }
  (this.t = 0), (this.s = 0);
  for (var d = a.length, e = !1, f = 0; --d >= 0; ) {
    var g = 8 == c ? 255 & a[d] : intAt(a, d);
    0 > g
      ? "-" == a.charAt(d) && (e = !0)
      : ((e = !1),
        0 == f
          ? (this.arr[this.t++] = g)
          : f + c > this.DB
          ? ((this.arr[this.t - 1] |= (g & ((1 << (this.DB - f)) - 1)) << f),
            (this.arr[this.t++] = g >> (this.DB - f)))
          : (this.arr[this.t - 1] |= g << f),
        (f += c),
        f >= this.DB && (f -= this.DB));
  }
  8 == c &&
    0 != (128 & a[0]) &&
    ((this.s = -1),
    f > 0 && (this.arr[this.t - 1] |= ((1 << (this.DB - f)) - 1) << f)),
    this.clamp(),
    e && BigInteger.ZERO.subTo(this, this);
}
function bnpClamp() {
  for (var a = this.s & this.DM; this.t > 0 && this.arr[this.t - 1] == a; )
    --this.t;
}
function bnToString(a) {
  if (this.s < 0) return "-" + this.negate().toString(a);
  var b;
  if (16 == a) b = 4;
  else if (8 == a) b = 3;
  else if (2 == a) b = 1;
  else if (32 == a) b = 5;
  else {
    if (4 != a) return this.toRadix(a);
    b = 2;
  }
  var c,
    d = (1 << b) - 1,
    e = !1,
    f = "",
    g = this.t,
    h = this.DB - ((g * this.DB) % b);
  if (g-- > 0)
    for (
      h < this.DB &&
      (c = this.arr[g] >> h) > 0 &&
      ((e = !0), (f = int2char(c)));
      g >= 0;

    )
      b > h
        ? ((c = (this.arr[g] & ((1 << h) - 1)) << (b - h)),
          (c |= this.arr[--g] >> (h += this.DB - b)))
        : ((c = (this.arr[g] >> (h -= b)) & d),
          0 >= h && ((h += this.DB), --g)),
        c > 0 && (e = !0),
        e && (f += int2char(c));
  return e ? f : "0";
}
function bnNegate() {
  var a = nbi();
  return BigInteger.ZERO.subTo(this, a), a;
}
function bnAbs() {
  return this.s < 0 ? this.negate() : this;
}
function bnCompareTo(a) {
  var b = this.s - a.s;
  if (0 != b) return b;
  var c = this.t;
  if (((b = c - a.t), 0 != b)) return b;
  for (; --c >= 0; ) if (0 != (b = this.arr[c] - a.arr[c])) return b;
  return 0;
}
function nbits(a) {
  var b,
    c = 1;
  return (
    0 != (b = a >>> 16) && ((a = b), (c += 16)),
    0 != (b = a >> 8) && ((a = b), (c += 8)),
    0 != (b = a >> 4) && ((a = b), (c += 4)),
    0 != (b = a >> 2) && ((a = b), (c += 2)),
    0 != (b = a >> 1) && ((a = b), (c += 1)),
    c
  );
}
function bnBitLength() {
  return this.t <= 0
    ? 0
    : this.DB * (this.t - 1) + nbits(this.arr[this.t - 1] ^ (this.s & this.DM));
}
function bnpDLShiftTo(a, b) {
  var c;
  for (c = this.t - 1; c >= 0; --c) b.arr[c + a] = this.arr[c];
  for (c = a - 1; c >= 0; --c) b.arr[c] = 0;
  (b.t = this.t + a), (b.s = this.s);
}
function bnpDRShiftTo(a, b) {
  for (var c = a; c < this.t; ++c) b.arr[c - a] = this.arr[c];
  (b.t = Math.max(this.t - a, 0)), (b.s = this.s);
}
function bnpLShiftTo(a, b) {
  var c,
    d = a % this.DB,
    e = this.DB - d,
    f = (1 << e) - 1,
    g = Math.floor(a / this.DB),
    h = (this.s << d) & this.DM;
  for (c = this.t - 1; c >= 0; --c)
    (b.arr[c + g + 1] = (this.arr[c] >> e) | h), (h = (this.arr[c] & f) << d);
  for (c = g - 1; c >= 0; --c) b.arr[c] = 0;
  (b.arr[g] = h), (b.t = this.t + g + 1), (b.s = this.s), b.clamp();
}
function bnpRShiftTo(a, b) {
  b.s = this.s;
  var c = Math.floor(a / this.DB);
  if (c >= this.t) return void (b.t = 0);
  var d = a % this.DB,
    e = this.DB - d,
    f = (1 << d) - 1;
  b.arr[0] = this.arr[c] >> d;
  for (var g = c + 1; g < this.t; ++g)
    (b.arr[g - c - 1] |= (this.arr[g] & f) << e),
      (b.arr[g - c] = this.arr[g] >> d);
  d > 0 && (b.arr[this.t - c - 1] |= (this.s & f) << e),
    (b.t = this.t - c),
    b.clamp();
}
function bnpSubTo(a, b) {
  for (var c = 0, d = 0, e = Math.min(a.t, this.t); e > c; )
    (d += this.arr[c] - a.arr[c]), (b.arr[c++] = d & this.DM), (d >>= this.DB);
  if (a.t < this.t) {
    for (d -= a.s; c < this.t; )
      (d += this.arr[c]), (b.arr[c++] = d & this.DM), (d >>= this.DB);
    d += this.s;
  } else {
    for (d += this.s; c < a.t; )
      (d -= a.arr[c]), (b.arr[c++] = d & this.DM), (d >>= this.DB);
    d -= a.s;
  }
  (b.s = 0 > d ? -1 : 0),
    -1 > d ? (b.arr[c++] = this.DV + d) : d > 0 && (b.arr[c++] = d),
    (b.t = c),
    b.clamp();
}
function bnpMultiplyTo(a, b) {
  var c = this.abs(),
    d = a.abs(),
    e = c.t;
  for (b.t = e + d.t; --e >= 0; ) b.arr[e] = 0;
  for (e = 0; e < d.t; ++e) b.arr[e + c.t] = c.am(0, d.arr[e], b, e, 0, c.t);
  (b.s = 0), b.clamp(), this.s != a.s && BigInteger.ZERO.subTo(b, b);
}
function bnpSquareTo(a) {
  for (var b = this.abs(), c = (a.t = 2 * b.t); --c >= 0; ) a.arr[c] = 0;
  for (c = 0; c < b.t - 1; ++c) {
    var d = b.am(c, b.arr[c], a, 2 * c, 0, 1);
    (a.arr[c + b.t] += b.am(
      c + 1,
      2 * b.arr[c],
      a,
      2 * c + 1,
      d,
      b.t - c - 1
    )) >= b.DV && ((a.arr[c + b.t] -= b.DV), (a.arr[c + b.t + 1] = 1));
  }
  a.t > 0 && (a.arr[a.t - 1] += b.am(c, b.arr[c], a, 2 * c, 0, 1)),
    (a.s = 0),
    a.clamp();
}
function bnpDivRemTo(a, b, c) {
  var d = a.abs();
  if (!(d.t <= 0)) {
    var e = this.abs();
    if (e.t < d.t)
      return null != b && b.fromInt(0), void (null != c && this.copyTo(c));
    null == c && (c = nbi());
    var f = nbi(),
      g = this.s,
      h = a.s,
      i = this.DB - nbits(d.arr[d.t - 1]);
    i > 0 ? (d.lShiftTo(i, f), e.lShiftTo(i, c)) : (d.copyTo(f), e.copyTo(c));
    var j = f.t,
      k = f.arr[j - 1];
    if (0 != k) {
      var l = k * (1 << this.F1) + (j > 1 ? f.arr[j - 2] >> this.F2 : 0),
        m = this.FV / l,
        n = (1 << this.F1) / l,
        o = 1 << this.F2,
        p = c.t,
        q = p - j,
        r = null == b ? nbi() : b;
      for (
        f.dlShiftTo(q, r),
          c.compareTo(r) >= 0 && ((c.arr[c.t++] = 1), c.subTo(r, c)),
          BigInteger.ONE.dlShiftTo(j, r),
          r.subTo(f, f);
        f.t < j;

      )
        f.arr[f.t++] = 0;
      for (; --q >= 0; ) {
        var s =
          c.arr[--p] == k
            ? this.DM
            : Math.floor(c.arr[p] * m + (c.arr[p - 1] + o) * n);
        if ((c.arr[p] += f.am(0, s, c, q, 0, j)) < s)
          for (f.dlShiftTo(q, r), c.subTo(r, c); c.arr[p] < --s; )
            c.subTo(r, c);
      }
      null != b && (c.drShiftTo(j, b), g != h && BigInteger.ZERO.subTo(b, b)),
        (c.t = j),
        c.clamp(),
        i > 0 && c.rShiftTo(i, c),
        0 > g && BigInteger.ZERO.subTo(c, c);
    }
  }
}
function bnMod(a) {
  var b = nbi();
  return (
    this.abs().divRemTo(a, null, b),
    this.s < 0 && b.compareTo(BigInteger.ZERO) > 0 && a.subTo(b, b),
    b
  );
}
function Classic(a) {
  this.m = a;
}
function cConvert(a) {
  return a.s < 0 || a.compareTo(this.m) >= 0 ? a.mod(this.m) : a;
}
function cRevert(a) {
  return a;
}
function cReduce(a) {
  a.divRemTo(this.m, null, a);
}
function cMulTo(a, b, c) {
  a.multiplyTo(b, c), this.reduce(c);
}
function cSqrTo(a, b) {
  a.squareTo(b), this.reduce(b);
}
function bnpInvDigit() {
  if (this.t < 1) return 0;
  var a = this.arr[0];
  if (0 == (1 & a)) return 0;
  var b = 3 & a;
  return (
    (b = (b * (2 - (15 & a) * b)) & 15),
    (b = (b * (2 - (255 & a) * b)) & 255),
    (b = (b * (2 - (((65535 & a) * b) & 65535))) & 65535),
    (b = (b * (2 - ((a * b) % this.DV))) % this.DV),
    b > 0 ? this.DV - b : -b
  );
}
function Montgomery(a) {
  (this.m = a),
    (this.mp = a.invDigit()),
    (this.mpl = 32767 & this.mp),
    (this.mph = this.mp >> 15),
    (this.um = (1 << (a.DB - 15)) - 1),
    (this.mt2 = 2 * a.t);
}
function montConvert(a) {
  var b = nbi();
  return (
    a.abs().dlShiftTo(this.m.t, b),
    b.divRemTo(this.m, null, b),
    a.s < 0 && b.compareTo(BigInteger.ZERO) > 0 && this.m.subTo(b, b),
    b
  );
}
function montRevert(a) {
  var b = nbi();
  return a.copyTo(b), this.reduce(b), b;
}
function montReduce(a) {
  for (; a.t <= this.mt2; ) a.arr[a.t++] = 0;
  for (var b = 0; b < this.m.t; ++b) {
    var c = 32767 & a.arr[b],
      d =
        (c * this.mpl +
          (((c * this.mph + (a.arr[b] >> 15) * this.mpl) & this.um) << 15)) &
        a.DM;
    for (
      c = b + this.m.t, a.arr[c] += this.m.am(0, d, a, b, 0, this.m.t);
      a.arr[c] >= a.DV;

    )
      (a.arr[c] -= a.DV), a.arr[++c]++;
  }
  a.clamp(),
    a.drShiftTo(this.m.t, a),
    a.compareTo(this.m) >= 0 && a.subTo(this.m, a);
}
function montSqrTo(a, b) {
  a.squareTo(b), this.reduce(b);
}
function montMulTo(a, b, c) {
  a.multiplyTo(b, c), this.reduce(c);
}
function bnpIsEven() {
  return 0 == (this.t > 0 ? 1 & this.arr[0] : this.s);
}
function bnpExp(a, b) {
  if (a > 4294967295 || 1 > a) return BigInteger.ONE;
  var c = nbi(),
    d = nbi(),
    e = b.convert(this),
    f = nbits(a) - 1;
  for (e.copyTo(c); --f >= 0; )
    if ((b.sqrTo(c, d), (a & (1 << f)) > 0)) b.mulTo(d, e, c);
    else {
      var g = c;
      (c = d), (d = g);
    }
  return b.revert(c);
}
function bnModPowInt(a, b) {
  var c;
  return (
    (c = 256 > a || b.isEven() ? new Classic(b) : new Montgomery(b)),
    this.exp(a, c)
  );
}
var dbits,
  canary = 0xdeadbeefcafe,
  j_lm = 15715070 == (16777215 & canary);
j_lm && "Microsoft Internet Explorer" == navigator.appName
  ? ((BigInteger.prototype.am = am2), (dbits = 30))
  : j_lm && "Netscape" != navigator.appName
  ? ((BigInteger.prototype.am = am1), (dbits = 26))
  : ((BigInteger.prototype.am = am3), (dbits = 28)),
  (BigInteger.prototype.DB = dbits),
  (BigInteger.prototype.DM = (1 << dbits) - 1),
  (BigInteger.prototype.DV = 1 << dbits);
var BI_FP = 52;
(BigInteger.prototype.FV = Math.pow(2, BI_FP)),
  (BigInteger.prototype.F1 = BI_FP - dbits),
  (BigInteger.prototype.F2 = 2 * dbits - BI_FP);
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz",
  BI_RC = new Array(),
  rr,
  vv;
for (rr = "0".charCodeAt(0), vv = 0; 9 >= vv; ++vv) BI_RC[rr++] = vv;
for (rr = "a".charCodeAt(0), vv = 10; 36 > vv; ++vv) BI_RC[rr++] = vv;
for (rr = "A".charCodeAt(0), vv = 10; 36 > vv; ++vv) BI_RC[rr++] = vv;
(Classic.prototype.convert = cConvert),
  (Classic.prototype.revert = cRevert),
  (Classic.prototype.reduce = cReduce),
  (Classic.prototype.mulTo = cMulTo),
  (Classic.prototype.sqrTo = cSqrTo),
  (Montgomery.prototype.convert = montConvert),
  (Montgomery.prototype.revert = montRevert),
  (Montgomery.prototype.reduce = montReduce),
  (Montgomery.prototype.mulTo = montMulTo),
  (Montgomery.prototype.sqrTo = montSqrTo),
  (BigInteger.prototype.copyTo = bnpCopyTo),
  (BigInteger.prototype.fromInt = bnpFromInt),
  (BigInteger.prototype.fromString = bnpFromString),
  (BigInteger.prototype.clamp = bnpClamp),
  (BigInteger.prototype.dlShiftTo = bnpDLShiftTo),
  (BigInteger.prototype.drShiftTo = bnpDRShiftTo),
  (BigInteger.prototype.lShiftTo = bnpLShiftTo),
  (BigInteger.prototype.rShiftTo = bnpRShiftTo),
  (BigInteger.prototype.subTo = bnpSubTo),
  (BigInteger.prototype.multiplyTo = bnpMultiplyTo),
  (BigInteger.prototype.squareTo = bnpSquareTo),
  (BigInteger.prototype.divRemTo = bnpDivRemTo),
  (BigInteger.prototype.invDigit = bnpInvDigit),
  (BigInteger.prototype.isEven = bnpIsEven),
  (BigInteger.prototype.exp = bnpExp),
  (BigInteger.prototype.toString = bnToString),
  (BigInteger.prototype.negate = bnNegate),
  (BigInteger.prototype.abs = bnAbs),
  (BigInteger.prototype.compareTo = bnCompareTo),
  (BigInteger.prototype.bitLength = bnBitLength),
  (BigInteger.prototype.mod = bnMod),
  (BigInteger.prototype.modPowInt = bnModPowInt),
  (BigInteger.ZERO = nbv(0)),
  (BigInteger.ONE = nbv(1));
function bnClone() {
  var a = nbi();
  return this.copyTo(a), a;
}
function bnIntValue() {
  if (this.s < 0) {
    if (1 == this.t) return this.arr[0] - this.DV;
    if (0 == this.t) return -1;
  } else {
    if (1 == this.t) return this.arr[0];
    if (0 == this.t) return 0;
  }
  return ((this.arr[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this.arr[0];
}
function bnByteValue() {
  return 0 == this.t ? this.s : (this.arr[0] << 24) >> 24;
}
function bnShortValue() {
  return 0 == this.t ? this.s : (this.arr[0] << 16) >> 16;
}
function bnpChunkSize(a) {
  return Math.floor((Math.LN2 * this.DB) / Math.log(a));
}
function bnSigNum() {
  return this.s < 0
    ? -1
    : this.t <= 0 || (1 == this.t && this.arr[0] <= 0)
    ? 0
    : 1;
}
function bnpToRadix(a) {
  if ((null == a && (a = 10), 0 == this.signum() || 2 > a || a > 36))
    return "0";
  var b = this.chunkSize(a),
    c = Math.pow(a, b),
    d = nbv(c),
    e = nbi(),
    f = nbi(),
    g = "";
  for (this.divRemTo(d, e, f); e.signum() > 0; )
    (g = (c + f.intValue()).toString(a).substr(1) + g), e.divRemTo(d, e, f);
  return f.intValue().toString(a) + g;
}
function bnpFromRadix(a, b) {
  this.fromInt(0), null == b && (b = 10);
  for (
    var c = this.chunkSize(b), d = Math.pow(b, c), e = !1, f = 0, g = 0, h = 0;
    h < a.length;
    ++h
  ) {
    var i = intAt(a, h);
    0 > i
      ? "-" == a.charAt(h) && 0 == this.signum() && (e = !0)
      : ((g = b * g + i),
        ++f >= c &&
          (this.dMultiply(d), this.dAddOffset(g, 0), (f = 0), (g = 0)));
  }
  f > 0 && (this.dMultiply(Math.pow(b, f)), this.dAddOffset(g, 0)),
    e && BigInteger.ZERO.subTo(this, this);
}
function bnpFromNumber(a, b, c) {
  if ("number" == typeof b)
    if (2 > a) this.fromInt(1);
    else
      for (
        this.fromNumber(a, c),
          this.testBit(a - 1) ||
            this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this),
          this.isEven() && this.dAddOffset(1, 0);
        !this.isProbablePrime(b);

      )
        this.dAddOffset(2, 0),
          this.bitLength() > a &&
            this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
  else {
    var d = new Array(),
      e = 7 & a;
    (d.length = (a >> 3) + 1),
      b.nextBytes(d),
      e > 0 ? (d.arr[0] &= (1 << e) - 1) : (d.arr[0] = 0),
      this.fromString(d, 256);
  }
}
function bnToByteArray() {
  var a = this.t,
    b = new Array();
  b.arr[0] = this.s;
  var c,
    d = this.DB - ((a * this.DB) % 8),
    e = 0;
  if (a-- > 0)
    for (
      d < this.DB &&
      (c = this.arr[a] >> d) != (this.s & this.DM) >> d &&
      (b.arr[e++] = c | (this.s << (this.DB - d)));
      a >= 0;

    )
      8 > d
        ? ((c = (this.arr[a] & ((1 << d) - 1)) << (8 - d)),
          (c |= this.arr[--a] >> (d += this.DB - 8)))
        : ((c = (this.arr[a] >> (d -= 8)) & 255),
          0 >= d && ((d += this.DB), --a)),
        0 != (128 & c) && (c |= -256),
        0 == e && (128 & this.s) != (128 & c) && ++e,
        (e > 0 || c != this.s) && (b.arr[e++] = c);
  return b;
}
function bnEquals(a) {
  return 0 == this.compareTo(a);
}
function bnMin(a) {
  return this.compareTo(a) < 0 ? this : a;
}
function bnMax(a) {
  return this.compareTo(a) > 0 ? this : a;
}
function bnpBitwiseTo(a, b, c) {
  var d,
    e,
    f = Math.min(a.t, this.t);
  for (d = 0; f > d; ++d) c.arr[d] = b(this.arr[d], a.arr[d]);
  if (a.t < this.t) {
    for (e = a.s & this.DM, d = f; d < this.t; ++d)
      c.arr[d] = b(this.arr[d], e);
    c.t = this.t;
  } else {
    for (e = this.s & this.DM, d = f; d < a.t; ++d) c.arr[d] = b(e, a.arr[d]);
    c.t = a.t;
  }
  (c.s = b(this.s, a.s)), c.clamp();
}
function op_and(a, b) {
  return a & b;
}
function bnAnd(a) {
  var b = nbi();
  return this.bitwiseTo(a, op_and, b), b;
}
function op_or(a, b) {
  return a | b;
}
function bnOr(a) {
  var b = nbi();
  return this.bitwiseTo(a, op_or, b), b;
}
function op_xor(a, b) {
  return a ^ b;
}
function bnXor(a) {
  var b = nbi();
  return this.bitwiseTo(a, op_xor, b), b;
}
function op_andnot(a, b) {
  return a & ~b;
}
function bnAndNot(a) {
  var b = nbi();
  return this.bitwiseTo(a, op_andnot, b), b;
}
function bnNot() {
  for (var a = nbi(), b = 0; b < this.t; ++b) a.arr[b] = this.DM & ~this.arr[b];
  return (a.t = this.t), (a.s = ~this.s), a;
}
function bnShiftLeft(a) {
  var b = nbi();
  return 0 > a ? this.rShiftTo(-a, b) : this.lShiftTo(a, b), b;
}
function bnShiftRight(a) {
  var b = nbi();
  return 0 > a ? this.lShiftTo(-a, b) : this.rShiftTo(a, b), b;
}
function lbit(a) {
  if (0 == a) return -1;
  var b = 0;
  return (
    0 == (65535 & a) && ((a >>= 16), (b += 16)),
    0 == (255 & a) && ((a >>= 8), (b += 8)),
    0 == (15 & a) && ((a >>= 4), (b += 4)),
    0 == (3 & a) && ((a >>= 2), (b += 2)),
    0 == (1 & a) && ++b,
    b
  );
}
function bnGetLowestSetBit() {
  for (var a = 0; a < this.t; ++a)
    if (0 != this.arr[a]) return a * this.DB + lbit(this.arr[a]);
  return this.s < 0 ? this.t * this.DB : -1;
}
function cbit(a) {
  for (var b = 0; 0 != a; ) (a &= a - 1), ++b;
  return b;
}
function bnBitCount() {
  for (var a = 0, b = this.s & this.DM, c = 0; c < this.t; ++c)
    a += cbit(this.arr[c] ^ b);
  return a;
}
function bnTestBit(a) {
  var b = Math.floor(a / this.DB);
  return b >= this.t ? 0 != this.s : 0 != (this.arr[b] & (1 << a % this.DB));
}
function bnpChangeBit(a, b) {
  var c = BigInteger.ONE.shiftLeft(a);
  return this.bitwiseTo(c, b, c), c;
}
function bnSetBit(a) {
  return this.changeBit(a, op_or);
}
function bnClearBit(a) {
  return this.changeBit(a, op_andnot);
}
function bnFlipBit(a) {
  return this.changeBit(a, op_xor);
}
function bnpAddTo(a, b) {
  for (var c = 0, d = 0, e = Math.min(a.t, this.t); e > c; )
    (d += this.arr[c] + a.arr[c]), (b.arr[c++] = d & this.DM), (d >>= this.DB);
  if (a.t < this.t) {
    for (d += a.s; c < this.t; )
      (d += this.arr[c]), (b.arr[c++] = d & this.DM), (d >>= this.DB);
    d += this.s;
  } else {
    for (d += this.s; c < a.t; )
      (d += a.arr[c]), (b.arr[c++] = d & this.DM), (d >>= this.DB);
    d += a.s;
  }
  (b.s = 0 > d ? -1 : 0),
    d > 0 ? (b.arr[c++] = d) : -1 > d && (b.arr[c++] = this.DV + d),
    (b.t = c),
    b.clamp();
}
function bnAdd(a) {
  var b = nbi();
  return this.addTo(a, b), b;
}
function bnSubtract(a) {
  var b = nbi();
  return this.subTo(a, b), b;
}
function bnMultiply(a) {
  var b = nbi();
  return this.multiplyTo(a, b), b;
}
function bnDivide(a) {
  var b = nbi();
  return this.divRemTo(a, b, null), b;
}
function bnRemainder(a) {
  var b = nbi();
  return this.divRemTo(a, null, b), b;
}
function bnDivideAndRemainder(a) {
  var b = nbi(),
    c = nbi();
  return this.divRemTo(a, b, c), new Array(b, c);
}
function bnpDMultiply(a) {
  (this.arr[this.t] = this.am(0, a - 1, this, 0, 0, this.t)),
    ++this.t,
    this.clamp();
}
function bnpDAddOffset(a, b) {
  if (0 != a) {
    for (; this.t <= b; ) this.arr[this.t++] = 0;
    for (this.arr[b] += a; this.arr[b] >= this.DV; )
      (this.arr[b] -= this.DV),
        ++b >= this.t && (this.arr[this.t++] = 0),
        ++this.arr[b];
  }
}
function NullExp() {}
function nNop(a) {
  return a;
}
function nMulTo(a, b, c) {
  a.multiplyTo(b, c);
}
function nSqrTo(a, b) {
  a.squareTo(b);
}
function bnPow(a) {
  return this.exp(a, new NullExp());
}
function bnpMultiplyLowerTo(a, b, c) {
  var d = Math.min(this.t + a.t, b);
  for (c.s = 0, c.t = d; d > 0; ) c.arr[--d] = 0;
  var e;
  for (e = c.t - this.t; e > d; ++d)
    c.arr[d + this.t] = this.am(0, a.arr[d], c, d, 0, this.t);
  for (e = Math.min(a.t, b); e > d; ++d) this.am(0, a.arr[d], c, d, 0, b - d);
  c.clamp();
}
function bnpMultiplyUpperTo(a, b, c) {
  --b;
  var d = (c.t = this.t + a.t - b);
  for (c.s = 0; --d >= 0; ) c.arr[d] = 0;
  for (d = Math.max(b - this.t, 0); d < a.t; ++d)
    c.arr[this.t + d - b] = this.am(b - d, a.arr[d], c, 0, 0, this.t + d - b);
  c.clamp(), c.drShiftTo(1, c);
}
function Barrett(a) {
  (this.r2 = nbi()),
    (this.q3 = nbi()),
    BigInteger.ONE.dlShiftTo(2 * a.t, this.r2),
    (this.mu = this.r2.divide(a)),
    (this.m = a);
}
function barrettConvert(a) {
  if (a.s < 0 || a.t > 2 * this.m.t) return a.mod(this.m);
  if (a.compareTo(this.m) < 0) return a;
  var b = nbi();
  return a.copyTo(b), this.reduce(b), b;
}
function barrettRevert(a) {
  return a;
}
function barrettReduce(a) {
  for (
    a.drShiftTo(this.m.t - 1, this.r2),
      a.t > this.m.t + 1 && ((a.t = this.m.t + 1), a.clamp()),
      this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3),
      this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
    a.compareTo(this.r2) < 0;

  )
    a.dAddOffset(1, this.m.t + 1);
  for (a.subTo(this.r2, a); a.compareTo(this.m) >= 0; ) a.subTo(this.m, a);
}
function barrettSqrTo(a, b) {
  a.squareTo(b), this.reduce(b);
}
function barrettMulTo(a, b, c) {
  a.multiplyTo(b, c), this.reduce(c);
}
function bnModPow(a, b) {
  var c,
    d,
    e = a.bitLength(),
    f = nbv(1);
  if (0 >= e) return f;
  (c = 18 > e ? 1 : 48 > e ? 3 : 144 > e ? 4 : 768 > e ? 5 : 6),
    (d =
      8 > e ? new Classic(b) : b.isEven() ? new Barrett(b) : new Montgomery(b));
  var g = new Array(),
    h = 3,
    i = c - 1,
    j = (1 << c) - 1;
  if (((g[1] = d.convert(this)), c > 1)) {
    var k = nbi();
    for (d.sqrTo(g[1], k); j >= h; )
      (g[h] = nbi()), d.mulTo(k, g[h - 2], g[h]), (h += 2);
  }
  var l,
    m,
    n = a.t - 1,
    o = !0,
    p = nbi();
  for (e = nbits(a.arr[n]) - 1; n >= 0; ) {
    for (
      e >= i
        ? (l = (a.arr[n] >> (e - i)) & j)
        : ((l = (a.arr[n] & ((1 << (e + 1)) - 1)) << (i - e)),
          n > 0 && (l |= a.arr[n - 1] >> (this.DB + e - i))),
        h = c;
      0 == (1 & l);

    )
      (l >>= 1), --h;
    if (((e -= h) < 0 && ((e += this.DB), --n), o)) g[l].copyTo(f), (o = !1);
    else {
      for (; h > 1; ) d.sqrTo(f, p), d.sqrTo(p, f), (h -= 2);
      h > 0 ? d.sqrTo(f, p) : ((m = f), (f = p), (p = m)), d.mulTo(p, g[l], f);
    }
    for (; n >= 0 && 0 == (a.arr[n] & (1 << e)); )
      d.sqrTo(f, p),
        (m = f),
        (f = p),
        (p = m),
        --e < 0 && ((e = this.DB - 1), --n);
  }
  return d.revert(f);
}
function bnGCD(a) {
  var b = this.s < 0 ? this.negate() : this.clone(),
    c = a.s < 0 ? a.negate() : a.clone();
  if (b.compareTo(c) < 0) {
    var d = b;
    (b = c), (c = d);
  }
  var e = b.getLowestSetBit(),
    f = c.getLowestSetBit();
  if (0 > f) return b;
  for (
    f > e && (f = e), f > 0 && (b.rShiftTo(f, b), c.rShiftTo(f, c));
    b.signum() > 0;

  )
    (e = b.getLowestSetBit()) > 0 && b.rShiftTo(e, b),
      (e = c.getLowestSetBit()) > 0 && c.rShiftTo(e, c),
      b.compareTo(c) >= 0
        ? (b.subTo(c, b), b.rShiftTo(1, b))
        : (c.subTo(b, c), c.rShiftTo(1, c));
  return f > 0 && c.lShiftTo(f, c), c;
}
function bnpModInt(a) {
  if (0 >= a) return 0;
  var b = this.DV % a,
    c = this.s < 0 ? a - 1 : 0;
  if (this.t > 0)
    if (0 == b) c = this.arr[0] % a;
    else for (var d = this.t - 1; d >= 0; --d) c = (b * c + this.arr[d]) % a;
  return c;
}
function bnModInverse(a) {
  var b = a.isEven();
  if ((this.isEven() && b) || 0 == a.signum()) return BigInteger.ZERO;
  for (
    var c = a.clone(),
      d = this.clone(),
      e = nbv(1),
      f = nbv(0),
      g = nbv(0),
      h = nbv(1);
    0 != c.signum();

  ) {
    for (; c.isEven(); )
      c.rShiftTo(1, c),
        b
          ? ((e.isEven() && f.isEven()) || (e.addTo(this, e), f.subTo(a, f)),
            e.rShiftTo(1, e))
          : f.isEven() || f.subTo(a, f),
        f.rShiftTo(1, f);
    for (; d.isEven(); )
      d.rShiftTo(1, d),
        b
          ? ((g.isEven() && h.isEven()) || (g.addTo(this, g), h.subTo(a, h)),
            g.rShiftTo(1, g))
          : h.isEven() || h.subTo(a, h),
        h.rShiftTo(1, h);
    c.compareTo(d) >= 0
      ? (c.subTo(d, c), b && e.subTo(g, e), f.subTo(h, f))
      : (d.subTo(c, d), b && g.subTo(e, g), h.subTo(f, h));
  }
  return 0 != d.compareTo(BigInteger.ONE)
    ? BigInteger.ZERO
    : h.compareTo(a) >= 0
    ? h.subtract(a)
    : h.signum() < 0
    ? (h.addTo(a, h), h.signum() < 0 ? h.add(a) : h)
    : h;
}
function bnIsProbablePrime(a) {
  var b,
    c = this.abs();
  if (1 == c.t && c.arr[0] <= lowprimes[lowprimes.length - 1]) {
    for (b = 0; b < lowprimes.length; ++b)
      if (c.arr[0] == lowprimes[b]) return !0;
    return !1;
  }
  if (c.isEven()) return !1;
  for (b = 1; b < lowprimes.length; ) {
    for (var d = lowprimes[b], e = b + 1; e < lowprimes.length && lplim > d; )
      d *= lowprimes[e++];
    for (d = c.modInt(d); e > b; ) if (d % lowprimes[b++] == 0) return !1;
  }
  return c.millerRabin(a);
}
function bnpMillerRabin(a) {
  var b = this.subtract(BigInteger.ONE),
    c = b.getLowestSetBit();
  if (0 >= c) return !1;
  var d = b.shiftRight(c);
  (a = (a + 1) >> 1), a > lowprimes.length && (a = lowprimes.length);
  for (var e = nbi(), f = 0; a > f; ++f) {
    e.fromInt(lowprimes[f]);
    var g = e.modPow(d, this);
    if (0 != g.compareTo(BigInteger.ONE) && 0 != g.compareTo(b)) {
      for (var h = 1; h++ < c && 0 != g.compareTo(b); )
        if (((g = g.modPowInt(2, this)), 0 == g.compareTo(BigInteger.ONE)))
          return !1;
      if (0 != g.compareTo(b)) return !1;
    }
  }
  return !0;
}
(NullExp.prototype.convert = nNop),
  (NullExp.prototype.revert = nNop),
  (NullExp.prototype.mulTo = nMulTo),
  (NullExp.prototype.sqrTo = nSqrTo),
  (Barrett.prototype.convert = barrettConvert),
  (Barrett.prototype.revert = barrettRevert),
  (Barrett.prototype.reduce = barrettReduce),
  (Barrett.prototype.mulTo = barrettMulTo),
  (Barrett.prototype.sqrTo = barrettSqrTo);
var lowprimes = [
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
    73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151,
    157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233,
    239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317,
    331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419,
    421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503,
    509,
  ],
  lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
(BigInteger.prototype.chunkSize = bnpChunkSize),
  (BigInteger.prototype.toRadix = bnpToRadix),
  (BigInteger.prototype.fromRadix = bnpFromRadix),
  (BigInteger.prototype.fromNumber = bnpFromNumber),
  (BigInteger.prototype.bitwiseTo = bnpBitwiseTo),
  (BigInteger.prototype.changeBit = bnpChangeBit),
  (BigInteger.prototype.addTo = bnpAddTo),
  (BigInteger.prototype.dMultiply = bnpDMultiply),
  (BigInteger.prototype.dAddOffset = bnpDAddOffset),
  (BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo),
  (BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo),
  (BigInteger.prototype.modInt = bnpModInt),
  (BigInteger.prototype.millerRabin = bnpMillerRabin),
  (BigInteger.prototype.clone = bnClone),
  (BigInteger.prototype.intValue = bnIntValue),
  (BigInteger.prototype.byteValue = bnByteValue),
  (BigInteger.prototype.shortValue = bnShortValue),
  (BigInteger.prototype.signum = bnSigNum),
  (BigInteger.prototype.toByteArray = bnToByteArray),
  (BigInteger.prototype.equals = bnEquals),
  (BigInteger.prototype.min = bnMin),
  (BigInteger.prototype.max = bnMax),
  (BigInteger.prototype.and = bnAnd),
  (BigInteger.prototype.or = bnOr),
  (BigInteger.prototype.xor = bnXor),
  (BigInteger.prototype.andNot = bnAndNot),
  (BigInteger.prototype.not = bnNot),
  (BigInteger.prototype.shiftLeft = bnShiftLeft),
  (BigInteger.prototype.shiftRight = bnShiftRight),
  (BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit),
  (BigInteger.prototype.bitCount = bnBitCount),
  (BigInteger.prototype.testBit = bnTestBit),
  (BigInteger.prototype.setBit = bnSetBit),
  (BigInteger.prototype.clearBit = bnClearBit),
  (BigInteger.prototype.flipBit = bnFlipBit),
  (BigInteger.prototype.add = bnAdd),
  (BigInteger.prototype.subtract = bnSubtract),
  (BigInteger.prototype.multiply = bnMultiply),
  (BigInteger.prototype.divide = bnDivide),
  (BigInteger.prototype.remainder = bnRemainder),
  (BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder),
  (BigInteger.prototype.modPow = bnModPow),
  (BigInteger.prototype.modInverse = bnModInverse),
  (BigInteger.prototype.pow = bnPow),
  (BigInteger.prototype.gcd = bnGCD),
  (BigInteger.prototype.isProbablePrime = bnIsProbablePrime);
("use strict");
function q(a) {
  throw a;
}
function y(a, b, c) {
  4 !== b.length && q(new sjcl.exception.invalid("invalid aes block size"));
  var d = a.a[c],
    e = b[0] ^ d[0],
    f = b[c ? 3 : 1] ^ d[1],
    g = b[2] ^ d[2];
  b = b[c ? 1 : 3] ^ d[3];
  var h,
    i,
    j,
    k,
    l = d.length / 4 - 2,
    m = 4,
    n = [0, 0, 0, 0];
  (h = a.j[c]), (a = h[0]);
  var o = h[1],
    p = h[2],
    r = h[3],
    s = h[4];
  for (k = 0; l > k; k++)
    (h =
      a[e >>> 24] ^ o[(f >> 16) & 255] ^ p[(g >> 8) & 255] ^ r[255 & b] ^ d[m]),
      (i =
        a[f >>> 24] ^
        o[(g >> 16) & 255] ^
        p[(b >> 8) & 255] ^
        r[255 & e] ^
        d[m + 1]),
      (j =
        a[g >>> 24] ^
        o[(b >> 16) & 255] ^
        p[(e >> 8) & 255] ^
        r[255 & f] ^
        d[m + 2]),
      (b =
        a[b >>> 24] ^
        o[(e >> 16) & 255] ^
        p[(f >> 8) & 255] ^
        r[255 & g] ^
        d[m + 3]),
      (m += 4),
      (e = h),
      (f = i),
      (g = j);
  for (k = 0; 4 > k; k++)
    (n[c ? 3 & -k : k] =
      (s[e >>> 24] << 24) ^
      (s[(f >> 16) & 255] << 16) ^
      (s[(g >> 8) & 255] << 8) ^
      s[255 & b] ^
      d[m++]),
      (h = e),
      (e = f),
      (f = g),
      (g = b),
      (b = h);
  return n;
}
function z(a, b) {
  var c,
    d,
    e,
    f = b.slice(0),
    g = a.q,
    h = a.a,
    i = g[0],
    j = g[1],
    k = g[2],
    l = g[3],
    m = g[4],
    n = g[5],
    o = g[6],
    p = g[7];
  for (c = 0; 64 > c; c++)
    16 > c
      ? (d = f[c])
      : ((d = f[(c + 1) & 15]),
        (e = f[(c + 14) & 15]),
        (d = f[15 & c] =
          (((d >>> 7) ^ (d >>> 18) ^ (d >>> 3) ^ (d << 25) ^ (d << 14)) +
            ((e >>> 17) ^ (e >>> 19) ^ (e >>> 10) ^ (e << 15) ^ (e << 13)) +
            f[15 & c] +
            f[(c + 9) & 15]) |
          0)),
      (d =
        d +
        p +
        ((m >>> 6) ^
          (m >>> 11) ^
          (m >>> 25) ^
          (m << 26) ^
          (m << 21) ^
          (m << 7)) +
        (o ^ (m & (n ^ o))) +
        h[c]),
      (p = o),
      (o = n),
      (n = m),
      (m = (l + d) | 0),
      (l = k),
      (k = j),
      (j = i),
      (i =
        (d +
          ((j & k) ^ (l & (j ^ k))) +
          ((j >>> 2) ^
            (j >>> 13) ^
            (j >>> 22) ^
            (j << 30) ^
            (j << 19) ^
            (j << 10))) |
        0);
  (g[0] = (g[0] + i) | 0),
    (g[1] = (g[1] + j) | 0),
    (g[2] = (g[2] + k) | 0),
    (g[3] = (g[3] + l) | 0),
    (g[4] = (g[4] + m) | 0),
    (g[5] = (g[5] + n) | 0),
    (g[6] = (g[6] + o) | 0),
    (g[7] = (g[7] + p) | 0);
}
function C(a, b) {
  var c,
    d = sjcl.random.z[a],
    e = [];
  for (c in d) d.hasOwnProperty(c) && e.push(d[c]);
  for (c = 0; c < e.length; c++) e[c](b);
}
function A(a) {
  (a.a = B(a).concat(B(a))), (a.A = new sjcl.cipher.aes(a.a));
}
function B(a) {
  for (var b = 0; 4 > b && ((a.e[b] = (a.e[b] + 1) | 0), !a.e[b]); b++);
  return a.A.encrypt(a.e);
}
var t = void 0,
  u = !1,
  sjcl = {
    cipher: {},
    hash: {},
    keyexchange: {},
    mode: {},
    misc: {},
    codec: {},
    exception: {
      corrupt: function (a) {
        (this.toString = function () {
          return "CORRUPT: " + this.message;
        }),
          (this.message = a);
      },
      invalid: function (a) {
        (this.toString = function () {
          return "INVALID: " + this.message;
        }),
          (this.message = a);
      },
      bug: function (a) {
        (this.toString = function () {
          return "BUG: " + this.message;
        }),
          (this.message = a);
      },
      notReady: function (a) {
        (this.toString = function () {
          return "NOT READY: " + this.message;
        }),
          (this.message = a);
      },
    },
  };
"undefined" != typeof module && module.exports && (module.exports = sjcl),
  (sjcl.cipher.aes = function (a) {
    this.j[0][0][0] || this.D();
    var b,
      c,
      d,
      e,
      f = this.j[0][4],
      g = this.j[1];
    b = a.length;
    var h = 1;
    for (
      4 !== b &&
        6 !== b &&
        8 !== b &&
        q(new sjcl.exception.invalid("invalid aes key size")),
        this.a = [(d = a.slice(0)), (e = [])],
        a = b;
      4 * b + 28 > a;
      a++
    )
      (c = d[a - 1]),
        (0 === a % b || (8 === b && 4 === a % b)) &&
          ((c =
            (f[c >>> 24] << 24) ^
            (f[(c >> 16) & 255] << 16) ^
            (f[(c >> 8) & 255] << 8) ^
            f[255 & c]),
          0 === a % b &&
            ((c = (c << 8) ^ (c >>> 24) ^ (h << 24)),
            (h = (h << 1) ^ (283 * (h >> 7))))),
        (d[a] = d[a - b] ^ c);
    for (b = 0; a; b++, a--)
      (c = d[3 & b ? a : a - 4]),
        (e[b] =
          4 >= a || 4 > b
            ? c
            : g[0][f[c >>> 24]] ^
              g[1][f[(c >> 16) & 255]] ^
              g[2][f[(c >> 8) & 255]] ^
              g[3][f[255 & c]]);
  }),
  (sjcl.cipher.aes.prototype = {
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
      var a,
        b,
        c,
        d,
        e,
        f,
        g,
        h = this.j[0],
        i = this.j[1],
        j = h[4],
        k = i[4],
        l = [],
        m = [];
      for (a = 0; 256 > a; a++) m[(l[a] = (a << 1) ^ (283 * (a >> 7))) ^ a] = a;
      for (b = c = 0; !j[b]; b ^= d || 1, c = m[c] || 1)
        for (
          f = c ^ (c << 1) ^ (c << 2) ^ (c << 3) ^ (c << 4),
            f = (f >> 8) ^ (255 & f) ^ 99,
            j[b] = f,
            k[f] = b,
            e = l[(a = l[(d = l[b])])],
            g = (16843009 * e) ^ (65537 * a) ^ (257 * d) ^ (16843008 * b),
            e = (257 * l[f]) ^ (16843008 * f),
            a = 0;
          4 > a;
          a++
        )
          (h[a][b] = e = (e << 24) ^ (e >>> 8)),
            (i[a][f] = g = (g << 24) ^ (g >>> 8));
      for (a = 0; 5 > a; a++) (h[a] = h[a].slice(0)), (i[a] = i[a].slice(0));
    },
  }),
  (sjcl.bitArray = {
    bitSlice: function (a, b, c) {
      return (
        (a = sjcl.bitArray.O(a.slice(b / 32), 32 - (31 & b)).slice(1)),
        c === t ? a : sjcl.bitArray.clamp(a, c - b)
      );
    },
    extract: function (a, b, c) {
      var d = Math.floor((-b - c) & 31);
      return (
        (-32 & ((b + c - 1) ^ b)
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
        : sjcl.bitArray.O(b, d, 0 | c, a.slice(0, a.length - 1));
    },
    bitLength: function (a) {
      var b = a.length;
      return 0 === b ? 0 : 32 * (b - 1) + sjcl.bitArray.getPartial(a[b - 1]);
    },
    clamp: function (a, b) {
      if (32 * a.length < b) return a;
      a = a.slice(0, Math.ceil(b / 32));
      var c = a.length;
      return (
        (b &= 31),
        c > 0 &&
          b &&
          (a[c - 1] = sjcl.bitArray.partial(
            b,
            a[c - 1] & (2147483648 >> (b - 1)),
            1
          )),
        a
      );
    },
    partial: function (a, b, c) {
      return 32 === a ? b : (c ? 0 | b : b << (32 - a)) + 1099511627776 * a;
    },
    getPartial: function (a) {
      return Math.round(a / 1099511627776) || 32;
    },
    equal: function (a, b) {
      if (sjcl.bitArray.bitLength(a) !== sjcl.bitArray.bitLength(b)) return u;
      var c,
        d = 0;
      for (c = 0; c < a.length; c++) d |= a[c] ^ b[c];
      return 0 === d;
    },
    O: function (a, b, c, d) {
      var e;
      for (e = 0, d === t && (d = []); b >= 32; b -= 32) d.push(c), (c = 0);
      if (0 === b) return d.concat(a);
      for (e = 0; e < a.length; e++)
        d.push(c | (a[e] >>> b)), (c = a[e] << (32 - b));
      return (
        (e = a.length ? a[a.length - 1] : 0),
        (a = sjcl.bitArray.getPartial(e)),
        d.push(
          sjcl.bitArray.partial((b + a) & 31, b + a > 32 ? c : d.pop(), 1)
        ),
        d
      );
    },
    k: function (a, b) {
      return [a[0] ^ b[0], a[1] ^ b[1], a[2] ^ b[2], a[3] ^ b[3]];
    },
  }),
  (sjcl.codec.utf8String = {
    fromBits: function (a) {
      var b,
        c,
        d = "",
        e = sjcl.bitArray.bitLength(a);
      for (b = 0; e / 8 > b; b++)
        0 === (3 & b) && (c = a[b / 4]),
          (d += String.fromCharCode(c >>> 24)),
          (c <<= 8);
      return decodeURIComponent(escape(d));
    },
    toBits: function (a) {
      a = unescape(encodeURIComponent(a));
      var b,
        c = [],
        d = 0;
      for (b = 0; b < a.length; b++)
        (d = (d << 8) | a.charCodeAt(b)), 3 === (3 & b) && (c.push(d), (d = 0));
      return 3 & b && c.push(sjcl.bitArray.partial(8 * (3 & b), d)), c;
    },
  }),
  (sjcl.codec.hex = {
    fromBits: function (a) {
      var b,
        c = "";
      for (b = 0; b < a.length; b++)
        c += ((0 | a[b]) + 0xf00000000000).toString(16).substr(4);
      return c.substr(0, sjcl.bitArray.bitLength(a) / 4);
    },
    toBits: function (a) {
      var b,
        c,
        d = [];
      for (
        a = a.replace(/\s|0x/g, ""), c = a.length, a += "00000000", b = 0;
        b < a.length;
        b += 8
      )
        d.push(0 ^ parseInt(a.substr(b, 8), 16));
      return sjcl.bitArray.clamp(d, 4 * c);
    },
  }),
  (sjcl.codec.base64 = {
    I: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    fromBits: function (a, b, c) {
      var d = "",
        e = 0,
        f = sjcl.codec.base64.I,
        g = 0,
        h = sjcl.bitArray.bitLength(a);
      for (c && (f = f.substr(0, 62) + "-_"), c = 0; 6 * d.length < h; )
        (d += f.charAt((g ^ (a[c] >>> e)) >>> 26)),
          6 > e
            ? ((g = a[c] << (6 - e)), (e += 26), c++)
            : ((g <<= 6), (e -= 6));
      for (; 3 & d.length && !b; ) d += "=";
      return d;
    },
    toBits: function (a, b) {
      a = a.replace(/\s|=/g, "");
      var c,
        d,
        e = [],
        f = 0,
        g = sjcl.codec.base64.I,
        h = 0;
      for (b && (g = g.substr(0, 62) + "-_"), c = 0; c < a.length; c++)
        (d = g.indexOf(a.charAt(c))),
          0 > d && q(new sjcl.exception.invalid("this isn't base64!")),
          f > 26
            ? ((f -= 26), e.push(h ^ (d >>> f)), (h = d << (32 - f)))
            : ((f += 6), (h ^= d << (32 - f)));
      return 56 & f && e.push(sjcl.bitArray.partial(56 & f, h, 1)), e;
    },
  }),
  (sjcl.codec.base64url = {
    fromBits: function (a) {
      return sjcl.codec.base64.fromBits(a, 1, 1);
    },
    toBits: function (a) {
      return sjcl.codec.base64.toBits(a, 1);
    },
  }),
  (sjcl.hash.sha256 = function (a) {
    this.a[0] || this.D(),
      a
        ? ((this.q = a.q.slice(0)), (this.m = a.m.slice(0)), (this.g = a.g))
        : this.reset();
  }),
  (sjcl.hash.sha256.hash = function (a) {
    return new sjcl.hash.sha256().update(a).finalize();
  }),
  (sjcl.hash.sha256.prototype = {
    blockSize: 512,
    reset: function () {
      return (this.q = this.M.slice(0)), (this.m = []), (this.g = 0), this;
    },
    update: function (a) {
      "string" == typeof a && (a = sjcl.codec.utf8String.toBits(a));
      var b,
        c = (this.m = sjcl.bitArray.concat(this.m, a));
      for (
        b = this.g,
          a = this.g = b + sjcl.bitArray.bitLength(a),
          b = (512 + b) & -512;
        a >= b;
        b += 512
      )
        z(this, c.splice(0, 16));
      return this;
    },
    finalize: function () {
      var a,
        b = this.m,
        c = this.q,
        b = sjcl.bitArray.concat(b, [sjcl.bitArray.partial(1, 1)]);
      for (a = b.length + 2; 15 & a; a++) b.push(0);
      for (
        b.push(Math.floor(this.g / 4294967296)), b.push(0 | this.g);
        b.length;

      )
        z(this, b.splice(0, 16));
      return this.reset(), c;
    },
    M: [],
    a: [],
    D: function () {
      function a(a) {
        return (4294967296 * (a - Math.floor(a))) | 0;
      }
      var b,
        c = 0,
        d = 2;
      a: for (; 64 > c; d++) {
        for (b = 2; d >= b * b; b++) if (0 === d % b) continue a;
        8 > c && (this.M[c] = a(Math.pow(d, 0.5))),
          (this.a[c] = a(Math.pow(d, 1 / 3))),
          c++;
      }
    },
  }),
  (sjcl.mode.ccm = {
    name: "ccm",
    encrypt: function (a, b, c, d, e) {
      var f,
        g = b.slice(0),
        h = sjcl.bitArray,
        i = h.bitLength(c) / 8,
        j = h.bitLength(g) / 8;
      for (
        e = e || 64,
          d = d || [],
          7 > i &&
            q(new sjcl.exception.invalid("ccm: iv must be at least 7 bytes")),
          f = 2;
        4 > f && j >>> (8 * f);
        f++
      );
      return (
        15 - i > f && (f = 15 - i),
        (c = h.clamp(c, 8 * (15 - f))),
        (b = sjcl.mode.ccm.K(a, b, c, d, e, f)),
        (g = sjcl.mode.ccm.n(a, g, c, b, e, f)),
        h.concat(g.data, g.tag)
      );
    },
    decrypt: function (a, b, c, d, e) {
      (e = e || 64), (d = d || []);
      var f = sjcl.bitArray,
        g = f.bitLength(c) / 8,
        h = f.bitLength(b),
        i = f.clamp(b, h - e),
        j = f.bitSlice(b, h - e),
        h = (h - e) / 8;
      for (
        7 > g &&
          q(new sjcl.exception.invalid("ccm: iv must be at least 7 bytes")),
          b = 2;
        4 > b && h >>> (8 * b);
        b++
      );
      return (
        15 - g > b && (b = 15 - g),
        (c = f.clamp(c, 8 * (15 - b))),
        (i = sjcl.mode.ccm.n(a, i, c, j, e, b)),
        (a = sjcl.mode.ccm.K(a, i.data, c, d, e, b)),
        f.equal(i.tag, a) ||
          q(new sjcl.exception.corrupt("ccm: tag doesn't match")),
        i.data
      );
    },
    K: function (a, b, c, d, e, f) {
      var g = [],
        h = sjcl.bitArray,
        i = h.k;
      if (
        ((e /= 8),
        (e % 2 || 4 > e || e > 16) &&
          q(new sjcl.exception.invalid("ccm: invalid tag length")),
        (4294967295 < d.length || 4294967295 < b.length) &&
          q(new sjcl.exception.bug("ccm: can't deal with 4GiB or more data")),
        (f = [h.partial(8, (d.length ? 64 : 0) | ((e - 2) << 2) | (f - 1))]),
        (f = h.concat(f, c)),
        (f[3] |= h.bitLength(b) / 8),
        (f = a.encrypt(f)),
        d.length)
      )
        for (
          c = h.bitLength(d) / 8,
            65279 >= c
              ? (g = [h.partial(16, c)])
              : 4294967295 >= c && (g = h.concat([h.partial(16, 65534)], [c])),
            g = h.concat(g, d),
            d = 0;
          d < g.length;
          d += 4
        )
          f = a.encrypt(i(f, g.slice(d, d + 4).concat([0, 0, 0])));
      for (d = 0; d < b.length; d += 4)
        f = a.encrypt(i(f, b.slice(d, d + 4).concat([0, 0, 0])));
      return h.clamp(f, 8 * e);
    },
    n: function (a, b, c, d, e, f) {
      var g,
        h = sjcl.bitArray;
      g = h.k;
      var i = b.length,
        j = h.bitLength(b);
      if (
        ((c = h
          .concat([h.partial(8, f - 1)], c)
          .concat([0, 0, 0])
          .slice(0, 4)),
        (d = h.bitSlice(g(d, a.encrypt(c)), 0, e)),
        !i)
      )
        return { tag: d, data: [] };
      for (g = 0; i > g; g += 4)
        c[3]++,
          (e = a.encrypt(c)),
          (b[g] ^= e[0]),
          (b[g + 1] ^= e[1]),
          (b[g + 2] ^= e[2]),
          (b[g + 3] ^= e[3]);
      return { tag: d, data: h.clamp(b, j) };
    },
  }),
  (sjcl.mode.ocb2 = {
    name: "ocb2",
    encrypt: function (a, b, c, d, e, f) {
      128 !== sjcl.bitArray.bitLength(c) &&
        q(new sjcl.exception.invalid("ocb iv must be 128 bits"));
      var g,
        h = sjcl.mode.ocb2.G,
        i = sjcl.bitArray,
        j = i.k,
        k = [0, 0, 0, 0];
      c = h(a.encrypt(c));
      var l,
        m = [];
      for (d = d || [], e = e || 64, g = 0; g + 4 < b.length; g += 4)
        (l = b.slice(g, g + 4)),
          (k = j(k, l)),
          (m = m.concat(j(c, a.encrypt(j(c, l))))),
          (c = h(c));
      return (
        (l = b.slice(g)),
        (b = i.bitLength(l)),
        (g = a.encrypt(j(c, [0, 0, 0, b]))),
        (l = i.clamp(j(l.concat([0, 0, 0]), g), b)),
        (k = j(k, j(l.concat([0, 0, 0]), g))),
        (k = a.encrypt(j(k, j(c, h(c))))),
        d.length && (k = j(k, f ? d : sjcl.mode.ocb2.pmac(a, d))),
        m.concat(i.concat(l, i.clamp(k, e)))
      );
    },
    decrypt: function (a, b, c, d, e, f) {
      128 !== sjcl.bitArray.bitLength(c) &&
        q(new sjcl.exception.invalid("ocb iv must be 128 bits")),
        (e = e || 64);
      var g,
        h,
        i = sjcl.mode.ocb2.G,
        j = sjcl.bitArray,
        k = j.k,
        l = [0, 0, 0, 0],
        m = i(a.encrypt(c)),
        n = sjcl.bitArray.bitLength(b) - e,
        o = [];
      for (d = d || [], c = 0; n / 32 > c + 4; c += 4)
        (g = k(m, a.decrypt(k(m, b.slice(c, c + 4))))),
          (l = k(l, g)),
          (o = o.concat(g)),
          (m = i(m));
      return (
        (h = n - 32 * c),
        (g = a.encrypt(k(m, [0, 0, 0, h]))),
        (g = k(g, j.clamp(b.slice(c), h).concat([0, 0, 0]))),
        (l = k(l, g)),
        (l = a.encrypt(k(l, k(m, i(m))))),
        d.length && (l = k(l, f ? d : sjcl.mode.ocb2.pmac(a, d))),
        j.equal(j.clamp(l, e), j.bitSlice(b, n)) ||
          q(new sjcl.exception.corrupt("ocb: tag doesn't match")),
        o.concat(j.clamp(g, h))
      );
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
      return (
        (c = b.slice(c)),
        128 > e.bitLength(c) &&
          ((h = f(h, d(h))), (c = e.concat(c, [-2147483648, 0, 0, 0]))),
        (g = f(g, c)),
        a.encrypt(f(d(f(h, d(h))), g))
      );
    },
    G: function (a) {
      return [
        (a[0] << 1) ^ (a[1] >>> 31),
        (a[1] << 1) ^ (a[2] >>> 31),
        (a[2] << 1) ^ (a[3] >>> 31),
        (a[3] << 1) ^ (135 * (a[0] >>> 31)),
      ];
    },
  }),
  (sjcl.mode.gcm = {
    name: "gcm",
    encrypt: function (a, b, c, d, e) {
      var f = b.slice(0);
      return (
        (b = sjcl.bitArray),
        (d = d || []),
        (a = sjcl.mode.gcm.n(!0, a, f, d, c, e || 128)),
        b.concat(a.data, a.tag)
      );
    },
    decrypt: function (a, b, c, d, e) {
      var f = b.slice(0),
        g = sjcl.bitArray,
        h = g.bitLength(f);
      return (
        (e = e || 128),
        (d = d || []),
        h >= e
          ? ((b = g.bitSlice(f, h - e)), (f = g.bitSlice(f, 0, h - e)))
          : ((b = f), (f = [])),
        (a = sjcl.mode.gcm.n(u, a, f, d, c, e)),
        g.equal(a.tag, b) ||
          q(new sjcl.exception.corrupt("gcm: tag doesn't match")),
        a.data
      );
    },
    U: function (a, b) {
      var c,
        d,
        e,
        f,
        g,
        h = sjcl.bitArray.k;
      for (e = [0, 0, 0, 0], f = b.slice(0), c = 0; 128 > c; c++) {
        for (
          (d = 0 !== (a[Math.floor(c / 32)] & (1 << (31 - (c % 32))))) &&
            (e = h(e, f)),
            g = 0 !== (1 & f[3]),
            d = 3;
          d > 0;
          d--
        )
          f[d] = (f[d] >>> 1) | ((1 & f[d - 1]) << 31);
        (f[0] >>>= 1), g && (f[0] ^= -520093696);
      }
      return e;
    },
    f: function (a, b, c) {
      var d,
        e = c.length;
      for (b = b.slice(0), d = 0; e > d; d += 4)
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
        i,
        j,
        k,
        l,
        m,
        n,
        o = sjcl.bitArray;
      for (
        l = c.length,
          m = o.bitLength(c),
          n = o.bitLength(d),
          h = o.bitLength(e),
          g = b.encrypt([0, 0, 0, 0]),
          96 === h
            ? ((e = e.slice(0)), (e = o.concat(e, [1])))
            : ((e = sjcl.mode.gcm.f(g, [0, 0, 0, 0], e)),
              (e = sjcl.mode.gcm.f(g, e, [
                0,
                0,
                Math.floor(h / 4294967296),
                4294967295 & h,
              ]))),
          h = sjcl.mode.gcm.f(g, [0, 0, 0, 0], d),
          k = e.slice(0),
          d = h.slice(0),
          a || (d = sjcl.mode.gcm.f(g, h, c)),
          j = 0;
        l > j;
        j += 4
      )
        k[3]++,
          (i = b.encrypt(k)),
          (c[j] ^= i[0]),
          (c[j + 1] ^= i[1]),
          (c[j + 2] ^= i[2]),
          (c[j + 3] ^= i[3]);
      return (
        (c = o.clamp(c, m)),
        a && (d = sjcl.mode.gcm.f(g, h, c)),
        (a = [
          Math.floor(n / 4294967296),
          4294967295 & n,
          Math.floor(m / 4294967296),
          4294967295 & m,
        ]),
        (d = sjcl.mode.gcm.f(g, d, a)),
        (i = b.encrypt(e)),
        (d[0] ^= i[0]),
        (d[1] ^= i[1]),
        (d[2] ^= i[2]),
        (d[3] ^= i[3]),
        { tag: o.bitSlice(d, 0, f), data: c }
      );
    },
  }),
  (sjcl.misc.hmac = function (a, b) {
    this.L = b = b || sjcl.hash.sha256;
    var c,
      d = [[], []],
      e = b.prototype.blockSize / 32;
    for (
      this.o = [new b(), new b()], a.length > e && (a = b.hash(a)), c = 0;
      e > c;
      c++
    )
      (d[0][c] = 909522486 ^ a[c]), (d[1][c] = 1549556828 ^ a[c]);
    this.o[0].update(d[0]), this.o[1].update(d[1]);
  }),
  (sjcl.misc.hmac.prototype.encrypt = sjcl.misc.hmac.prototype.mac =
    function (a) {
      return (
        (a = new this.L(this.o[0]).update(a).finalize()),
        new this.L(this.o[1]).update(a).finalize()
      );
    }),
  (sjcl.misc.pbkdf2 = function (a, b, c, d, e) {
    (c = c || 1e3),
      (0 > d || 0 > c) && q(sjcl.exception.invalid("invalid params to pbkdf2")),
      "string" == typeof a && (a = sjcl.codec.utf8String.toBits(a)),
      (e = e || sjcl.misc.hmac),
      (a = new e(a));
    var f,
      g,
      h,
      i,
      j = [],
      k = sjcl.bitArray;
    for (i = 1; 32 * j.length < (d || 1); i++) {
      for (e = f = a.encrypt(k.concat(b, [i])), g = 1; c > g; g++)
        for (f = a.encrypt(f), h = 0; h < f.length; h++) e[h] ^= f[h];
      j = j.concat(e);
    }
    return d && (j = k.clamp(j, d)), j;
  }),
  (sjcl.prng = function (a) {
    (this.b = [new sjcl.hash.sha256()]),
      (this.h = [0]),
      (this.F = 0),
      (this.t = {}),
      (this.C = 0),
      (this.J = {}),
      (this.N = this.c = this.i = this.T = 0),
      (this.a = [0, 0, 0, 0, 0, 0, 0, 0]),
      (this.e = [0, 0, 0, 0]),
      (this.A = t),
      (this.B = a),
      (this.p = u),
      (this.z = { progress: {}, seeded: {} }),
      (this.l = this.S = 0),
      (this.u = 1),
      (this.w = 2),
      (this.Q = 65536),
      (this.H = [0, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024]),
      (this.R = 3e4),
      (this.P = 80);
  }),
  (sjcl.prng.prototype = {
    randomWords: function (a, b) {
      var c,
        d = [];
      c = this.isReady(b);
      var e;
      if (
        (c === this.l &&
          q(new sjcl.exception.notReady("generator isn't seeded")),
        c & this.w)
      ) {
        (c = !(c & this.u)), (e = []);
        var f,
          g = 0;
        for (this.N = e[0] = new Date().valueOf() + this.R, f = 0; 16 > f; f++)
          e.push((4294967296 * Math.random()) | 0);
        for (
          f = 0;
          f < this.b.length &&
          ((e = e.concat(this.b[f].finalize())),
          (g += this.h[f]),
          (this.h[f] = 0),
          !(!c && this.F & (1 << f)));
          f++
        );
        for (
          this.F >= 1 << this.b.length &&
            (this.b.push(new sjcl.hash.sha256()), this.h.push(0)),
            this.c -= g,
            g > this.i && (this.i = g),
            this.F++,
            this.a = sjcl.hash.sha256.hash(this.a.concat(e)),
            this.A = new sjcl.cipher.aes(this.a),
            c = 0;
          4 > c && ((this.e[c] = (this.e[c] + 1) | 0), !this.e[c]);
          c++
        );
      }
      for (c = 0; a > c; c += 4)
        0 === (c + 1) % this.Q && A(this),
          (e = B(this)),
          d.push(e[0], e[1], e[2], e[3]);
      return A(this), d.slice(0, a);
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
        i = 0;
      switch (
        ((d = this.J[c]),
        d === t && (d = this.J[c] = this.T++),
        g === t && (g = this.t[c] = 0),
        (this.t[c] = (this.t[c] + 1) % this.b.length),
        typeof a)
      ) {
        case "number":
          b === t && (b = 1),
            this.b[g].update([d, this.C++, 1, b, f, 1, 0 | a]);
          break;
        case "object":
          if (
            ((c = Object.prototype.toString.call(a)),
            "[object Uint32Array]" === c)
          ) {
            for (e = [], c = 0; c < a.length; c++) e.push(a[c]);
            a = e;
          } else
            for (
              "[object Array]" !== c && (i = 1), c = 0;
              c < a.length && !i;
              c++
            )
              "number" != typeof a[c] && (i = 1);
          if (!i) {
            if (b === t)
              for (c = b = 0; c < a.length; c++)
                for (e = a[c]; e > 0; ) b++, (e >>>= 1);
            this.b[g].update([d, this.C++, 2, b, f, a.length].concat(a));
          }
          break;
        case "string":
          b === t && (b = a.length),
            this.b[g].update([d, this.C++, 3, b, f, a.length]),
            this.b[g].update(a);
          break;
        default:
          i = 1;
      }
      i &&
        q(
          new sjcl.exception.bug(
            "random: addEntropy only supports number, array of numbers or string"
          )
        ),
        (this.h[g] += b),
        (this.c += b),
        h === this.l &&
          (this.isReady() !== this.l && C("seeded", Math.max(this.i, this.c)),
          C("progress", this.getProgress()));
    },
    isReady: function (a) {
      return (
        (a = this.H[a !== t ? a : this.B]),
        this.i && this.i >= a
          ? this.h[0] > this.P && new Date().valueOf() > this.N
            ? this.w | this.u
            : this.u
          : this.c >= a
          ? this.w | this.l
          : this.l
      );
    },
    getProgress: function (a) {
      return (
        (a = this.H[a ? a : this.B]),
        this.i >= a ? 1 : this.c > a ? 1 : this.c / a
      );
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
        [
          a.x || a.clientX || a.offsetX || 0,
          a.y || a.clientY || a.offsetY || 0,
        ],
        2,
        "mouse"
      );
    },
    r: function () {
      sjcl.random.addEntropy(new Date().valueOf(), 2, "loadtime");
    },
  }),
  (sjcl.random = new sjcl.prng(6));
try {
  var D = new Uint32Array(32);
  crypto.getRandomValues(D),
    sjcl.random.addEntropy(D, 1024, "crypto['getRandomValues']");
} catch (E) {}
(sjcl.json = {
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
    (c = c || {}), (d = d || {});
    var e,
      f = sjcl.json,
      g = f.d({ iv: sjcl.random.randomWords(4, 0) }, f.defaults);
    return (
      f.d(g, c),
      (c = g.adata),
      "string" == typeof g.salt && (g.salt = sjcl.codec.base64.toBits(g.salt)),
      "string" == typeof g.iv && (g.iv = sjcl.codec.base64.toBits(g.iv)),
      (!sjcl.mode[g.mode] ||
        !sjcl.cipher[g.cipher] ||
        ("string" == typeof a && 100 >= g.iter) ||
        (64 !== g.ts && 96 !== g.ts && 128 !== g.ts) ||
        (128 !== g.ks && 192 !== g.ks && 256 !== g.ks) ||
        2 > g.iv.length ||
        4 < g.iv.length) &&
        q(new sjcl.exception.invalid("json encrypt: invalid parameters")),
      "string" == typeof a &&
        ((e = sjcl.misc.cachedPbkdf2(a, g)),
        (a = e.key.slice(0, g.ks / 32)),
        (g.salt = e.salt)),
      "string" == typeof b && (b = sjcl.codec.utf8String.toBits(b)),
      "string" == typeof c && (c = sjcl.codec.utf8String.toBits(c)),
      (e = new sjcl.cipher[g.cipher](a)),
      f.d(d, g),
      (d.key = a),
      (g.ct = sjcl.mode[g.mode].encrypt(e, b, g.iv, c, g.ts)),
      f.encode(g)
    );
  },
  decrypt: function (a, b, c, d) {
    (c = c || {}), (d = d || {});
    var e = sjcl.json;
    b = e.d(e.d(e.d({}, e.defaults), e.decode(b)), c, !0);
    var f;
    return (
      (c = b.adata),
      "string" == typeof b.salt && (b.salt = sjcl.codec.base64.toBits(b.salt)),
      "string" == typeof b.iv && (b.iv = sjcl.codec.base64.toBits(b.iv)),
      (!sjcl.mode[b.mode] ||
        !sjcl.cipher[b.cipher] ||
        ("string" == typeof a && 100 >= b.iter) ||
        (64 !== b.ts && 96 !== b.ts && 128 !== b.ts) ||
        (128 !== b.ks && 192 !== b.ks && 256 !== b.ks) ||
        !b.iv ||
        2 > b.iv.length ||
        4 < b.iv.length) &&
        q(new sjcl.exception.invalid("json decrypt: invalid parameters")),
      "string" == typeof a &&
        ((f = sjcl.misc.cachedPbkdf2(a, b)),
        (a = f.key.slice(0, b.ks / 32)),
        (b.salt = f.salt)),
      "string" == typeof c && (c = sjcl.codec.utf8String.toBits(c)),
      (f = new sjcl.cipher[b.cipher](a)),
      (c = sjcl.mode[b.mode].decrypt(f, b.ct, b.iv, c, b.ts)),
      e.d(d, b),
      (d.key = a),
      sjcl.codec.utf8String.fromBits(c)
    );
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
    (a = a.replace(/\s/g, "")),
      a.match(/^\{.*\}$/) ||
        q(new sjcl.exception.invalid("json decode: this isn't json!")),
      (a = a.replace(/^\{|\}$/g, "").split(/,/));
    var b,
      c,
      d = {};
    for (b = 0; b < a.length; b++)
      (c = a[b].match(
        /^(?:(["']?)([a-z][a-z0-9]*)\1):(?:(\d+)|"([a-z0-9+\/%*_.@=\-]*)")$/i
      )) || q(new sjcl.exception.invalid("json decode: this isn't json!")),
        (d[c[2]] = c[3]
          ? parseInt(c[3], 10)
          : c[2].match(/^(ct|salt|iv)$/)
          ? sjcl.codec.base64.toBits(c[4])
          : unescape(c[4]));
    return d;
  },
  d: function (a, b, c) {
    if ((a === t && (a = {}), b === t)) return a;
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
    var c,
      d = {};
    for (c in a) a.hasOwnProperty(c) && a[c] !== b[c] && (d[c] = a[c]);
    return d;
  },
  W: function (a, b) {
    var c,
      d = {};
    for (c = 0; c < b.length; c++) a[b[c]] !== t && (d[b[c]] = a[b[c]]);
    return d;
  },
}),
  (sjcl.encrypt = sjcl.json.encrypt),
  (sjcl.decrypt = sjcl.json.decrypt),
  (sjcl.misc.V = {}),
  (sjcl.misc.cachedPbkdf2 = function (a, b) {
    var c,
      d = sjcl.misc.V;
    return (
      (b = b || {}),
      (c = b.iter || 1e3),
      (d = d[a] = d[a] || {}),
      (c = d[c] =
        d[c] || {
          firstSalt:
            b.salt && b.salt.length
              ? b.salt.slice(0)
              : sjcl.random.randomWords(2, 0),
        }),
      (d = b.salt === t ? c.firstSalt : b.salt),
      (c[d] = c[d] || sjcl.misc.pbkdf2(a, d, b.iter)),
      { key: c[d].slice(0), salt: d.slice(0) }
    );
  });
!(function () {
  var a = this,
    b = a._,
    c = {},
    d = Array.prototype,
    e = Object.prototype,
    f = d.slice,
    g = d.unshift,
    h = e.toString,
    i = e.hasOwnProperty,
    j = d.forEach,
    k = d.map,
    l = d.reduce,
    m = d.reduceRight,
    n = d.filter,
    o = d.every,
    p = d.some,
    q = d.indexOf,
    r = d.lastIndexOf;
  e = Array.isArray;
  var s = Object.keys,
    t = Function.prototype.bind,
    u = function (a) {
      return new z(a);
    };
  "undefined" != typeof module && module.exports
    ? ((module.exports = u), (u._ = u))
    : (a._ = u),
    (u.VERSION = "1.1.6");
  var v =
    (u.each =
    u.forEach =
      function (a, b, d) {
        if (null != a)
          if (j && a.forEach === j) a.forEach(b, d);
          else if (u.isNumber(a.length))
            for (
              var e = 0, f = a.length;
              f > e && b.call(d, a[e], e, a) !== c;
              e++
            );
          else
            for (e in a) if (i.call(a, e) && b.call(d, a[e], e, a) === c) break;
      });
  (u.map = function (a, b, c) {
    var d = [];
    return null == a
      ? d
      : k && a.map === k
      ? a.map(b, c)
      : (v(a, function (a, e, f) {
          d[d.length] = b.call(c, a, e, f);
        }),
        d);
  }),
    (u.reduce =
      u.foldl =
      u.inject =
        function (a, b, c, d) {
          var e = void 0 !== c;
          if ((null == a && (a = []), l && a.reduce === l))
            return d && (b = u.bind(b, d)), e ? a.reduce(b, c) : a.reduce(b);
          if (
            (v(a, function (a, f, g) {
              e || 0 !== f ? (c = b.call(d, c, a, f, g)) : ((c = a), (e = !0));
            }),
            !e)
          )
            throw new TypeError("Reduce of empty array with no initial value");
          return c;
        }),
    (u.reduceRight = u.foldr =
      function (a, b, c, d) {
        return (
          null == a && (a = []),
          m && a.reduceRight === m
            ? (d && (b = u.bind(b, d)),
              void 0 !== c ? a.reduceRight(b, c) : a.reduceRight(b))
            : ((a = (u.isArray(a) ? a.slice() : u.toArray(a)).reverse()),
              u.reduce(a, b, c, d))
        );
      }),
    (u.find = u.detect =
      function (a, b, c) {
        var d;
        return (
          w(a, function (a, e, f) {
            return b.call(c, a, e, f) ? ((d = a), !0) : void 0;
          }),
          d
        );
      }),
    (u.filter = u.select =
      function (a, b, c) {
        var d = [];
        return null == a
          ? d
          : n && a.filter === n
          ? a.filter(b, c)
          : (v(a, function (a, e, f) {
              b.call(c, a, e, f) && (d[d.length] = a);
            }),
            d);
      }),
    (u.reject = function (a, b, c) {
      var d = [];
      return null == a
        ? d
        : (v(a, function (a, e, f) {
            b.call(c, a, e, f) || (d[d.length] = a);
          }),
          d);
    }),
    (u.every = u.all =
      function (a, b, d) {
        var e = !0;
        return null == a
          ? e
          : o && a.every === o
          ? a.every(b, d)
          : (v(a, function (a, f, g) {
              return (e = e && b.call(d, a, f, g)) ? void 0 : c;
            }),
            e);
      });
  var w =
    (u.some =
    u.any =
      function (a, b, d) {
        b || (b = u.identity);
        var e = !1;
        return null == a
          ? e
          : p && a.some === p
          ? a.some(b, d)
          : (v(a, function (a, f, g) {
              return (e = b.call(d, a, f, g)) ? c : void 0;
            }),
            e);
      });
  (u.include = u.contains =
    function (a, b) {
      var c = !1;
      return null == a
        ? c
        : q && a.indexOf === q
        ? -1 != a.indexOf(b)
        : (w(a, function (a) {
            return (c = a === b) ? !0 : void 0;
          }),
          c);
    }),
    (u.invoke = function (a, b) {
      var c = f.call(arguments, 2);
      return u.map(a, function (a) {
        return (b.call ? b || a : a[b]).apply(a, c);
      });
    }),
    (u.pluck = function (a, b) {
      return u.map(a, function (a) {
        return a[b];
      });
    }),
    (u.max = function (a, b, c) {
      if (!b && u.isArray(a)) return Math.max.apply(Math, a);
      var d = { computed: -(1 / 0) };
      return (
        v(a, function (a, e, f) {
          (e = b ? b.call(c, a, e, f) : a),
            e >= d.computed && (d = { value: a, computed: e });
        }),
        d.value
      );
    }),
    (u.min = function (a, b, c) {
      if (!b && u.isArray(a)) return Math.min.apply(Math, a);
      var d = { computed: 1 / 0 };
      return (
        v(a, function (a, e, f) {
          (e = b ? b.call(c, a, e, f) : a),
            e < d.computed && (d = { value: a, computed: e });
        }),
        d.value
      );
    }),
    (u.sortBy = function (a, b, c) {
      return u.pluck(
        u
          .map(a, function (a, d, e) {
            return { value: a, criteria: b.call(c, a, d, e) };
          })
          .sort(function (a, b) {
            var c = a.criteria,
              d = b.criteria;
            return d > c ? -1 : c > d ? 1 : 0;
          }),
        "value"
      );
    }),
    (u.sortedIndex = function (a, b, c) {
      c || (c = u.identity);
      for (var d = 0, e = a.length; e > d; ) {
        var f = (d + e) >> 1;
        c(a[f]) < c(b) ? (d = f + 1) : (e = f);
      }
      return d;
    }),
    (u.toArray = function (a) {
      return a
        ? a.toArray
          ? a.toArray()
          : u.isArray(a)
          ? a
          : u.isArguments(a)
          ? f.call(a)
          : u.values(a)
        : [];
    }),
    (u.size = function (a) {
      return u.toArray(a).length;
    }),
    (u.first = u.head =
      function (a, b, c) {
        return null == b || c ? a[0] : f.call(a, 0, b);
      }),
    (u.rest = u.tail =
      function (a, b, c) {
        return f.call(a, null == b || c ? 1 : b);
      }),
    (u.last = function (a) {
      return a[a.length - 1];
    }),
    (u.compact = function (a) {
      return u.filter(a, function (a) {
        return !!a;
      });
    }),
    (u.flatten = function (a) {
      return u.reduce(
        a,
        function (a, b) {
          return u.isArray(b) ? a.concat(u.flatten(b)) : ((a[a.length] = b), a);
        },
        []
      );
    }),
    (u.without = function (a) {
      var b = f.call(arguments, 1);
      return u.filter(a, function (a) {
        return !u.include(b, a);
      });
    }),
    (u.uniq = u.unique =
      function (a, b) {
        return u.reduce(
          a,
          function (a, c, d) {
            return (
              (0 != d && (b === !0 ? u.last(a) == c : u.include(a, c))) ||
                (a[a.length] = c),
              a
            );
          },
          []
        );
      }),
    (u.intersect = function (a) {
      var b = f.call(arguments, 1);
      return u.filter(u.uniq(a), function (a) {
        return u.every(b, function (b) {
          return u.indexOf(b, a) >= 0;
        });
      });
    }),
    (u.zip = function () {
      for (
        var a = f.call(arguments),
          b = u.max(u.pluck(a, "length")),
          c = Array(b),
          d = 0;
        b > d;
        d++
      )
        c[d] = u.pluck(a, "" + d);
      return c;
    }),
    (u.indexOf = function (a, b, c) {
      if (null == a) return -1;
      var d;
      if (c) return (c = u.sortedIndex(a, b)), a[c] === b ? c : -1;
      if (q && a.indexOf === q) return a.indexOf(b);
      for (c = 0, d = a.length; d > c; c++) if (a[c] === b) return c;
      return -1;
    }),
    (u.lastIndexOf = function (a, b) {
      if (null == a) return -1;
      if (r && a.lastIndexOf === r) return a.lastIndexOf(b);
      for (var c = a.length; c--; ) if (a[c] === b) return c;
      return -1;
    }),
    (u.range = function (a, b, c) {
      arguments.length <= 1 && ((b = a || 0), (a = 0)), (c = arguments[2] || 1);
      for (
        var d = Math.max(Math.ceil((b - a) / c), 0), e = 0, f = Array(d);
        d > e;

      )
        (f[e++] = a), (a += c);
      return f;
    }),
    (u.bind = function (a, b) {
      if (a.bind === t && t) return t.apply(a, f.call(arguments, 1));
      var c = f.call(arguments, 2);
      return function () {
        return a.apply(b, c.concat(f.call(arguments)));
      };
    }),
    (u.bindAll = function (a) {
      var b = f.call(arguments, 1);
      return (
        0 == b.length && (b = u.functions(a)),
        v(b, function (b) {
          a[b] = u.bind(a[b], a);
        }),
        a
      );
    }),
    (u.memoize = function (a, b) {
      var c = {};
      return (
        b || (b = u.identity),
        function () {
          var d = b.apply(this, arguments);
          return i.call(c, d) ? c[d] : (c[d] = a.apply(this, arguments));
        }
      );
    }),
    (u.delay = function (a, b) {
      var c = f.call(arguments, 2);
      return setTimeout(function () {
        return a.apply(a, c);
      }, b);
    }),
    (u.defer = function (a) {
      return u.delay.apply(u, [a, 1].concat(f.call(arguments, 1)));
    });
  var x = function (a, b, c) {
    var d;
    return function () {
      var e = this,
        f = arguments,
        g = function () {
          (d = null), a.apply(e, f);
        };
      c && clearTimeout(d), (c || !d) && (d = setTimeout(g, b));
    };
  };
  (u.throttle = function (a, b) {
    return x(a, b, !1);
  }),
    (u.debounce = function (a, b) {
      return x(a, b, !0);
    }),
    (u.once = function (a) {
      var b,
        c = !1;
      return function () {
        return c ? b : ((c = !0), (b = a.apply(this, arguments)));
      };
    }),
    (u.wrap = function (a, b) {
      return function () {
        var c = [a].concat(f.call(arguments));
        return b.apply(this, c);
      };
    }),
    (u.compose = function () {
      var a = f.call(arguments);
      return function () {
        for (var b = f.call(arguments), c = a.length - 1; c >= 0; c--)
          b = [a[c].apply(this, b)];
        return b[0];
      };
    }),
    (u.after = function (a, b) {
      return function () {
        return --a < 1 ? b.apply(this, arguments) : void 0;
      };
    }),
    (u.keys =
      s ||
      function (a) {
        if (a !== Object(a)) throw new TypeError("Invalid object");
        var b,
          c = [];
        for (b in a) i.call(a, b) && (c[c.length] = b);
        return c;
      }),
    (u.values = function (a) {
      return u.map(a, u.identity);
    }),
    (u.functions = u.methods =
      function (a) {
        return u
          .filter(u.keys(a), function (b) {
            return u.isFunction(a[b]);
          })
          .sort();
      }),
    (u.extend = function (a) {
      return (
        v(f.call(arguments, 1), function (b) {
          for (var c in b) void 0 !== b[c] && (a[c] = b[c]);
        }),
        a
      );
    }),
    (u.defaults = function (a) {
      return (
        v(f.call(arguments, 1), function (b) {
          for (var c in b) null == a[c] && (a[c] = b[c]);
        }),
        a
      );
    }),
    (u.clone = function (a) {
      return u.isArray(a) ? a.slice() : u.extend({}, a);
    }),
    (u.tap = function (a, b) {
      return b(a), a;
    }),
    (u.isEqual = function (a, b) {
      if (a === b) return !0;
      var c = typeof a;
      if (c != typeof b) return !1;
      if (a == b) return !0;
      if ((!a && b) || (a && !b)) return !1;
      if (
        (a._chain && (a = a._wrapped), b._chain && (b = b._wrapped), a.isEqual)
      )
        return a.isEqual(b);
      if (u.isDate(a) && u.isDate(b)) return a.getTime() === b.getTime();
      if (u.isNaN(a) && u.isNaN(b)) return !1;
      if (u.isRegExp(a) && u.isRegExp(b))
        return (
          a.source === b.source &&
          a.global === b.global &&
          a.ignoreCase === b.ignoreCase &&
          a.multiline === b.multiline
        );
      if ("object" !== c) return !1;
      if (a.length && a.length !== b.length) return !1;
      c = u.keys(a);
      var d = u.keys(b);
      if (c.length != d.length) return !1;
      for (var e in a) if (!(e in b && u.isEqual(a[e], b[e]))) return !1;
      return !0;
    }),
    (u.isEmpty = function (a) {
      if (u.isArray(a) || u.isString(a)) return 0 === a.length;
      for (var b in a) if (i.call(a, b)) return !1;
      return !0;
    }),
    (u.isElement = function (a) {
      return !(!a || 1 != a.nodeType);
    }),
    (u.isArray =
      e ||
      function (a) {
        return "[object Array]" === h.call(a);
      }),
    (u.isArguments = function (a) {
      return !(!a || !i.call(a, "callee"));
    }),
    (u.isFunction = function (a) {
      return !!(a && a.constructor && a.call && a.apply);
    }),
    (u.isString = function (a) {
      return !!("" === a || (a && a.charCodeAt && a.substr));
    }),
    (u.isNumber = function (a) {
      return !!(0 === a || (a && a.toExponential && a.toFixed));
    }),
    (u.isNaN = function (a) {
      return a !== a;
    }),
    (u.isBoolean = function (a) {
      return a === !0 || a === !1;
    }),
    (u.isDate = function (a) {
      return !(!a || !a.getTimezoneOffset || !a.setUTCFullYear);
    }),
    (u.isRegExp = function (a) {
      return !(
        !a ||
        !a.test ||
        !a.exec ||
        (!a.ignoreCase && a.ignoreCase !== !1)
      );
    }),
    (u.isNull = function (a) {
      return null === a;
    }),
    (u.isUndefined = function (a) {
      return void 0 === a;
    }),
    (u.noConflict = function () {
      return (a._ = b), this;
    }),
    (u.identity = function (a) {
      return a;
    }),
    (u.times = function (a, b, c) {
      for (var d = 0; a > d; d++) b.call(c, d);
    }),
    (u.mixin = function (a) {
      v(u.functions(a), function (b) {
        B(b, (u[b] = a[b]));
      });
    });
  var y = 0;
  (u.uniqueId = function (a) {
    var b = y++;
    return a ? a + b : b;
  }),
    (u.templateSettings = {
      evaluate: /<%([\s\S]+?)%>/g,
      interpolate: /<%=([\s\S]+?)%>/g,
    }),
    (u.template = function (a, b) {
      var c = u.templateSettings;
      return (
        (c =
          "var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('" +
          a
            .replace(/\\/g, "\\\\")
            .replace(/'/g, "\\'")
            .replace(c.interpolate, function (a, b) {
              return "'," + b.replace(/\\'/g, "'") + ",'";
            })
            .replace(c.evaluate || null, function (a, b) {
              return (
                "');" +
                b.replace(/\\'/g, "'").replace(/[\r\n\t]/g, " ") +
                "__p.push('"
              );
            })
            .replace(/\r/g, "\\r")
            .replace(/\n/g, "\\n")
            .replace(/\t/g, "\\t") +
          "');}return __p.join('');"),
        (c = new Function("obj", c)),
        b ? c(b) : c
      );
    });
  var z = function (a) {
    this._wrapped = a;
  };
  u.prototype = z.prototype;
  var A = function (a, b) {
      return b ? u(a).chain() : a;
    },
    B = function (a, b) {
      z.prototype[a] = function () {
        var a = f.call(arguments);
        return g.call(a, this._wrapped), A(b.apply(u, a), this._chain);
      };
    };
  u.mixin(u),
    v(
      ["pop", "push", "reverse", "shift", "sort", "splice", "unshift"],
      function (a) {
        var b = d[a];
        z.prototype[a] = function () {
          return (
            b.apply(this._wrapped, arguments), A(this._wrapped, this._chain)
          );
        };
      }
    ),
    v(["concat", "join", "slice"], function (a) {
      var b = d[a];
      z.prototype[a] = function () {
        return A(b.apply(this._wrapped, arguments), this._chain);
      };
    }),
    (z.prototype.chain = function () {
      return (this._chain = !0), this;
    }),
    (z.prototype.value = function () {
      return this._wrapped;
    });
})();
!(function () {
  function evalScript(a, b) {
    b.src
      ? jQuery.ajax({ url: b.src, async: !1, dataType: "script" })
      : jQuery.globalEval(b.text || b.textContent || b.innerHTML || ""),
      b.parentNode && b.parentNode.removeChild(b);
  }
  function now() {
    return +new Date();
  }
  function num(a, b) {
    return (a[0] && parseInt(jQuery.curCSS(a[0], b, !0), 10)) || 0;
  }
  function bindReady() {
    if (!readyBound) {
      if (
        ((readyBound = !0),
        document.addEventListener &&
          !jQuery.browser.opera &&
          document.addEventListener("DOMContentLoaded", jQuery.ready, !1),
        jQuery.browser.msie &&
          window == top &&
          (function () {
            if (!jQuery.isReady) {
              try {
                document.documentElement.doScroll("left");
              } catch (a) {
                return void setTimeout(arguments.callee, 0);
              }
              jQuery.ready();
            }
          })(),
        jQuery.browser.opera &&
          document.addEventListener(
            "DOMContentLoaded",
            function () {
              if (!jQuery.isReady) {
                for (var a = 0; a < document.styleSheets.length; a++)
                  if (document.styleSheets[a].disabled)
                    return void setTimeout(arguments.callee, 0);
                jQuery.ready();
              }
            },
            !1
          ),
        jQuery.browser.safari)
      ) {
        var a;
        !(function () {
          return jQuery.isReady
            ? void 0
            : "loaded" != document.readyState &&
              "complete" != document.readyState
            ? void setTimeout(arguments.callee, 0)
            : (a === undefined &&
                (a = jQuery("style, link[rel=stylesheet]").length),
              document.styleSheets.length != a
                ? void setTimeout(arguments.callee, 0)
                : void jQuery.ready());
        })();
      }
      jQuery.event.add(window, "load", jQuery.ready);
    }
  }
  var _jQuery = window.jQuery,
    _$ = window.$,
    jQuery =
      (window.jQuery =
      window.$ =
        function (a, b) {
          return new jQuery.fn.init(a, b);
        }),
    quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#(\w+)$/,
    isSimple = /^.[^:#\[\.]*$/,
    undefined;
  (jQuery.fn = jQuery.prototype =
    {
      init: function (a, b) {
        if (((a = a || document), a.nodeType))
          return (this[0] = a), (this.length = 1), this;
        if ("string" == typeof a) {
          var c = quickExpr.exec(a);
          if (!c || (!c[1] && b)) return jQuery(b).find(a);
          if (c[1]) a = jQuery.clean([c[1]], b);
          else {
            var d = document.getElementById(c[3]);
            if (d) return d.id != c[3] ? jQuery().find(a) : jQuery(d);
            a = [];
          }
        } else if (jQuery.isFunction(a))
          return jQuery(document)[jQuery.fn.ready ? "ready" : "load"](a);
        return this.setArray(jQuery.makeArray(a));
      },
      jquery: "1.2.6",
      size: function () {
        return this.length;
      },
      length: 0,
      get: function (a) {
        return a == undefined ? jQuery.makeArray(this) : this[a];
      },
      pushStack: function (a) {
        var b = jQuery(a);
        return (b.prevObject = this), b;
      },
      setArray: function (a) {
        return (this.length = 0), Array.prototype.push.apply(this, a), this;
      },
      each: function (a, b) {
        return jQuery.each(this, a, b);
      },
      index: function (a) {
        return jQuery.inArray(a && a.jquery ? a[0] : a, this);
      },
      attr: function (a, b, c) {
        var d = a;
        if (a.constructor == String) {
          if (b === undefined)
            return this[0] && jQuery[c || "attr"](this[0], a);
          (d = {}), (d[a] = b);
        }
        return this.each(function (b) {
          for (a in d)
            jQuery.attr(
              c ? this.style : this,
              a,
              jQuery.prop(this, d[a], c, b, a)
            );
        });
      },
      css: function (a, b) {
        return (
          ("width" == a || "height" == a) &&
            parseFloat(b) < 0 &&
            (b = undefined),
          this.attr(a, b, "curCSS")
        );
      },
      text: function (a) {
        if ("object" != typeof a && null != a)
          return this.empty().append(
            ((this[0] && this[0].ownerDocument) || document).createTextNode(a)
          );
        var b = "";
        return (
          jQuery.each(a || this, function () {
            jQuery.each(this.childNodes, function () {
              8 != this.nodeType &&
                (b +=
                  1 != this.nodeType ? this.nodeValue : jQuery.fn.text([this]));
            });
          }),
          b
        );
      },
      wrapAll: function (a) {
        return (
          this[0] &&
            jQuery(a, this[0].ownerDocument)
              .clone()
              .insertBefore(this[0])
              .map(function () {
                for (var a = this; a.firstChild; ) a = a.firstChild;
                return a;
              })
              .append(this),
          this
        );
      },
      wrapInner: function (a) {
        return this.each(function () {
          jQuery(this).contents().wrapAll(a);
        });
      },
      wrap: function (a) {
        return this.each(function () {
          jQuery(this).wrapAll(a);
        });
      },
      append: function () {
        return this.domManip(arguments, !0, !1, function (a) {
          1 == this.nodeType && this.appendChild(a);
        });
      },
      prepend: function () {
        return this.domManip(arguments, !0, !0, function (a) {
          1 == this.nodeType && this.insertBefore(a, this.firstChild);
        });
      },
      before: function () {
        return this.domManip(arguments, !1, !1, function (a) {
          this.parentNode.insertBefore(a, this);
        });
      },
      after: function () {
        return this.domManip(arguments, !1, !0, function (a) {
          this.parentNode.insertBefore(a, this.nextSibling);
        });
      },
      end: function () {
        return this.prevObject || jQuery([]);
      },
      find: function (a) {
        var b = jQuery.map(this, function (b) {
          return jQuery.find(a, b);
        });
        return this.pushStack(
          /[^+>] [^+>]/.test(a) || a.indexOf("..") > -1 ? jQuery.unique(b) : b
        );
      },
      clone: function (a) {
        var b = this.map(function () {
            if (jQuery.browser.msie && !jQuery.isXMLDoc(this)) {
              var a = this.cloneNode(!0),
                b = document.createElement("div");
              return b.appendChild(a), jQuery.clean([b.innerHTML])[0];
            }
            return this.cloneNode(!0);
          }),
          c = b
            .find("*")
            .andSelf()
            .each(function () {
              this[expando] != undefined && (this[expando] = null);
            });
        return (
          a === !0 &&
            this.find("*")
              .andSelf()
              .each(function (a) {
                if (3 != this.nodeType) {
                  var b = jQuery.data(this, "events");
                  for (var d in b)
                    for (var e in b[d])
                      jQuery.event.add(c[a], d, b[d][e], b[d][e].data);
                }
              }),
          b
        );
      },
      filter: function (a) {
        return this.pushStack(
          (jQuery.isFunction(a) &&
            jQuery.grep(this, function (b, c) {
              return a.call(b, c);
            })) ||
            jQuery.multiFilter(a, this)
        );
      },
      not: function (a) {
        if (a.constructor == String) {
          if (isSimple.test(a))
            return this.pushStack(jQuery.multiFilter(a, this, !0));
          a = jQuery.multiFilter(a, this);
        }
        var b = a.length && a[a.length - 1] !== undefined && !a.nodeType;
        return this.filter(function () {
          return b ? jQuery.inArray(this, a) < 0 : this != a;
        });
      },
      add: function (a) {
        return this.pushStack(
          jQuery.unique(
            jQuery.merge(
              this.get(),
              "string" == typeof a ? jQuery(a) : jQuery.makeArray(a)
            )
          )
        );
      },
      is: function (a) {
        return !!a && jQuery.multiFilter(a, this).length > 0;
      },
      hasClass: function (a) {
        return this.is("." + a);
      },
      val: function (a) {
        if (a == undefined) {
          if (this.length) {
            var b = this[0];
            if (jQuery.nodeName(b, "select")) {
              var c = b.selectedIndex,
                d = [],
                e = b.options,
                f = "select-one" == b.type;
              if (0 > c) return null;
              for (var g = f ? c : 0, h = f ? c + 1 : e.length; h > g; g++) {
                var i = e[g];
                if (i.selected) {
                  if (
                    ((a =
                      jQuery.browser.msie && !i.attributes.value.specified
                        ? i.text
                        : i.value),
                    f)
                  )
                    return a;
                  d.push(a);
                }
              }
              return d;
            }
            return (this[0].value || "").replace(/\r/g, "");
          }
          return undefined;
        }
        return (
          a.constructor == Number && (a += ""),
          this.each(function () {
            if (1 == this.nodeType)
              if (a.constructor == Array && /radio|checkbox/.test(this.type))
                this.checked =
                  jQuery.inArray(this.value, a) >= 0 ||
                  jQuery.inArray(this.name, a) >= 0;
              else if (jQuery.nodeName(this, "select")) {
                var b = jQuery.makeArray(a);
                jQuery("option", this).each(function () {
                  this.selected =
                    jQuery.inArray(this.value, b) >= 0 ||
                    jQuery.inArray(this.text, b) >= 0;
                }),
                  b.length || (this.selectedIndex = -1);
              } else this.value = a;
          })
        );
      },
      html: function (a) {
        return a == undefined
          ? this[0]
            ? this[0].innerHTML
            : null
          : this.empty().append(a);
      },
      replaceWith: function (a) {
        return this.after(a).remove();
      },
      eq: function (a) {
        return this.slice(a, a + 1);
      },
      slice: function () {
        return this.pushStack(Array.prototype.slice.apply(this, arguments));
      },
      map: function (a) {
        return this.pushStack(
          jQuery.map(this, function (b, c) {
            return a.call(b, c, b);
          })
        );
      },
      andSelf: function () {
        return this.add(this.prevObject);
      },
      data: function (a, b) {
        var c = a.split(".");
        if (((c[1] = c[1] ? "." + c[1] : ""), b === undefined)) {
          var d = this.triggerHandler("getData" + c[1] + "!", [c[0]]);
          return (
            d === undefined && this.length && (d = jQuery.data(this[0], a)),
            d === undefined && c[1] ? this.data(c[0]) : d
          );
        }
        return this.trigger("setData" + c[1] + "!", [c[0], b]).each(
          function () {
            jQuery.data(this, a, b);
          }
        );
      },
      removeData: function (a) {
        return this.each(function () {
          jQuery.removeData(this, a);
        });
      },
      domManip: function (a, b, c, d) {
        var e,
          f = this.length > 1;
        return this.each(function () {
          e || ((e = jQuery.clean(a, this.ownerDocument)), c && e.reverse());
          var g = this;
          b &&
            jQuery.nodeName(this, "table") &&
            jQuery.nodeName(e[0], "tr") &&
            (g =
              this.getElementsByTagName("tbody")[0] ||
              this.appendChild(this.ownerDocument.createElement("tbody")));
          var h = jQuery([]);
          jQuery.each(e, function () {
            var a = f ? jQuery(this).clone(!0)[0] : this;
            jQuery.nodeName(a, "script")
              ? (h = h.add(a))
              : (1 == a.nodeType && (h = h.add(jQuery("script", a).remove())),
                d.call(g, a));
          }),
            h.each(evalScript);
        });
      },
    }),
    (jQuery.fn.init.prototype = jQuery.fn),
    (jQuery.extend = jQuery.fn.extend =
      function () {
        var a,
          b = arguments[0] || {},
          c = 1,
          d = arguments.length,
          e = !1;
        for (
          b.constructor == Boolean &&
            ((e = b), (b = arguments[1] || {}), (c = 2)),
            "object" != typeof b && "function" != typeof b && (b = {}),
            d == c && ((b = this), --c);
          d > c;
          c++
        )
          if (null != (a = arguments[c]))
            for (var f in a) {
              var g = b[f],
                h = a[f];
              b !== h &&
                (e && h && "object" == typeof h && !h.nodeType
                  ? (b[f] = jQuery.extend(
                      e,
                      g || (null != h.length ? [] : {}),
                      h
                    ))
                  : h !== undefined && (b[f] = h));
            }
        return b;
      });
  var expando = "jQuery" + now(),
    uuid = 0,
    windowData = {},
    exclude = /z-?index|font-?weight|opacity|zoom|line-?height/i,
    defaultView = document.defaultView || {};
  jQuery.extend({
    noConflict: function (a) {
      return (window.$ = _$), a && (window.jQuery = _jQuery), jQuery;
    },
    isFunction: function (a) {
      return (
        !!a &&
        "string" != typeof a &&
        !a.nodeName &&
        a.constructor != Array &&
        /^[\s[]?function/.test(a + "")
      );
    },
    isXMLDoc: function (a) {
      return (
        (a.documentElement && !a.body) ||
        (a.tagName && a.ownerDocument && !a.ownerDocument.body)
      );
    },
    globalEval: function (a) {
      if ((a = jQuery.trim(a))) {
        var b =
            document.getElementsByTagName("head")[0] ||
            document.documentElement,
          c = document.createElement("script");
        (c.type = "text/javascript"),
          jQuery.browser.msie
            ? (c.text = a)
            : c.appendChild(document.createTextNode(a)),
          b.insertBefore(c, b.firstChild),
          b.removeChild(c);
      }
    },
    nodeName: function (a, b) {
      return a.nodeName && a.nodeName.toUpperCase() == b.toUpperCase();
    },
    cache: {},
    data: function (a, b, c) {
      a = a == window ? windowData : a;
      var d = a[expando];
      return (
        d || (d = a[expando] = ++uuid),
        b && !jQuery.cache[d] && (jQuery.cache[d] = {}),
        c !== undefined && (jQuery.cache[d][b] = c),
        b ? jQuery.cache[d][b] : d
      );
    },
    removeData: function (a, b) {
      a = a == window ? windowData : a;
      var c = a[expando];
      if (b) {
        if (jQuery.cache[c]) {
          delete jQuery.cache[c][b], (b = "");
          for (b in jQuery.cache[c]) break;
          b || jQuery.removeData(a);
        }
      } else {
        try {
          delete a[expando];
        } catch (d) {
          a.removeAttribute && a.removeAttribute(expando);
        }
        delete jQuery.cache[c];
      }
    },
    each: function (a, b, c) {
      var d,
        e = 0,
        f = a.length;
      if (c)
        if (f == undefined) {
          for (d in a) if (b.apply(a[d], c) === !1) break;
        } else for (; f > e && b.apply(a[e++], c) !== !1; );
      else if (f == undefined) {
        for (d in a) if (b.call(a[d], d, a[d]) === !1) break;
      } else for (var g = a[0]; f > e && b.call(g, e, g) !== !1; g = a[++e]);
      return a;
    },
    prop: function (a, b, c, d, e) {
      return (
        jQuery.isFunction(b) && (b = b.call(a, d)),
        b && b.constructor == Number && "curCSS" == c && !exclude.test(e)
          ? b + "px"
          : b
      );
    },
    className: {
      add: function (a, b) {
        jQuery.each((b || "").split(/\s+/), function (b, c) {
          1 != a.nodeType ||
            jQuery.className.has(a.className, c) ||
            (a.className += (a.className ? " " : "") + c);
        });
      },
      remove: function (a, b) {
        1 == a.nodeType &&
          (a.className =
            b != undefined
              ? jQuery
                  .grep(a.className.split(/\s+/), function (a) {
                    return !jQuery.className.has(b, a);
                  })
                  .join(" ")
              : "");
      },
      has: function (a, b) {
        return (
          jQuery.inArray(b, (a.className || a).toString().split(/\s+/)) > -1
        );
      },
    },
    swap: function (a, b, c) {
      var d = {};
      for (var e in b) (d[e] = a.style[e]), (a.style[e] = b[e]);
      c.call(a);
      for (var e in b) a.style[e] = d[e];
    },
    css: function (a, b, c) {
      function d() {
        e = "width" == b ? a.offsetWidth : a.offsetHeight;
        var c = 0,
          d = 0;
        jQuery.each(g, function () {
          (c += parseFloat(jQuery.curCSS(a, "padding" + this, !0)) || 0),
            (d +=
              parseFloat(jQuery.curCSS(a, "border" + this + "Width", !0)) || 0);
        }),
          (e -= Math.round(c + d));
      }
      if ("width" == b || "height" == b) {
        var e,
          f = { position: "absolute", visibility: "hidden", display: "block" },
          g = "width" == b ? ["Left", "Right"] : ["Top", "Bottom"];
        return (
          jQuery(a).is(":visible") ? d() : jQuery.swap(a, f, d), Math.max(0, e)
        );
      }
      return jQuery.curCSS(a, b, c);
    },
    curCSS: function (a, b, c) {
      function d(a) {
        if (!jQuery.browser.safari) return !1;
        var b = defaultView.getComputedStyle(a, null);
        return !b || "" == b.getPropertyValue("color");
      }
      var e,
        f = a.style;
      if ("opacity" == b && jQuery.browser.msie)
        return (e = jQuery.attr(f, "opacity")), "" == e ? "1" : e;
      if (jQuery.browser.opera && "display" == b) {
        var g = f.outline;
        (f.outline = "0 solid black"), (f.outline = g);
      }
      if ((b.match(/float/i) && (b = styleFloat), !c && f && f[b])) e = f[b];
      else if (defaultView.getComputedStyle) {
        b.match(/float/i) && (b = "float"),
          (b = b.replace(/([A-Z])/g, "-$1").toLowerCase());
        var h = defaultView.getComputedStyle(a, null);
        if (h && !d(a)) e = h.getPropertyValue(b);
        else {
          for (var i = [], j = [], k = a, l = 0; k && d(k); k = k.parentNode)
            j.unshift(k);
          for (; l < j.length; l++)
            d(j[l]) &&
              ((i[l] = j[l].style.display), (j[l].style.display = "block"));
          for (
            e =
              "display" == b && null != i[j.length - 1]
                ? "none"
                : (h && h.getPropertyValue(b)) || "",
              l = 0;
            l < i.length;
            l++
          )
            null != i[l] && (j[l].style.display = i[l]);
        }
        "opacity" == b && "" == e && (e = "1");
      } else if (a.currentStyle) {
        var m = b.replace(/\-(\w)/g, function (a, b) {
          return b.toUpperCase();
        });
        if (
          ((e = a.currentStyle[b] || a.currentStyle[m]),
          !/^\d+(px)?$/i.test(e) && /^\d/.test(e))
        ) {
          var n = f.left,
            o = a.runtimeStyle.left;
          (a.runtimeStyle.left = a.currentStyle.left),
            (f.left = e || 0),
            (e = f.pixelLeft + "px"),
            (f.left = n),
            (a.runtimeStyle.left = o);
        }
      }
      return e;
    },
    clean: function (a, b) {
      var c = [];
      return (
        (b = b || document),
        "undefined" == typeof b.createElement &&
          (b = b.ownerDocument || (b[0] && b[0].ownerDocument) || document),
        jQuery.each(a, function (a, d) {
          if (d) {
            if ((d.constructor == Number && (d += ""), "string" == typeof d)) {
              d = d.replace(/(<(\w+)[^>]*?)\/>/g, function (a, b, c) {
                return c.match(
                  /^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i
                )
                  ? a
                  : b + "></" + c + ">";
              });
              var e = jQuery.trim(d).toLowerCase(),
                f = b.createElement("div"),
                g = (!e.indexOf("<opt") && [
                  1,
                  "<select multiple='multiple'>",
                  "</select>",
                ]) ||
                  (!e.indexOf("<leg") && [1, "<fieldset>", "</fieldset>"]) ||
                  (e.match(/^<(thead|tbody|tfoot|colg|cap)/) && [
                    1,
                    "<table>",
                    "</table>",
                  ]) ||
                  (!e.indexOf("<tr") && [
                    2,
                    "<table><tbody>",
                    "</tbody></table>",
                  ]) ||
                  ((!e.indexOf("<td") || !e.indexOf("<th")) && [
                    3,
                    "<table><tbody><tr>",
                    "</tr></tbody></table>",
                  ]) ||
                  (!e.indexOf("<col") && [
                    2,
                    "<table><tbody></tbody><colgroup>",
                    "</colgroup></table>",
                  ]) ||
                  (jQuery.browser.msie && [1, "div<div>", "</div>"]) || [
                    0,
                    "",
                    "",
                  ];
              for (f.innerHTML = g[1] + d + g[2]; g[0]--; ) f = f.lastChild;
              if (jQuery.browser.msie) {
                for (
                  var h =
                      !e.indexOf("<table") && e.indexOf("<tbody") < 0
                        ? f.firstChild && f.firstChild.childNodes
                        : "<table>" == g[1] && e.indexOf("<tbody") < 0
                        ? f.childNodes
                        : [],
                    i = h.length - 1;
                  i >= 0;
                  --i
                )
                  jQuery.nodeName(h[i], "tbody") &&
                    !h[i].childNodes.length &&
                    h[i].parentNode.removeChild(h[i]);
                /^\s/.test(d) &&
                  f.insertBefore(
                    b.createTextNode(d.match(/^\s*/)[0]),
                    f.firstChild
                  );
              }
              d = jQuery.makeArray(f.childNodes);
            }
            (0 !== d.length ||
              jQuery.nodeName(d, "form") ||
              jQuery.nodeName(d, "select")) &&
              (d[0] == undefined || jQuery.nodeName(d, "form") || d.options
                ? c.push(d)
                : (c = jQuery.merge(c, d)));
          }
        }),
        c
      );
    },
    attr: function (a, b, c) {
      if (!a || 3 == a.nodeType || 8 == a.nodeType) return undefined;
      var d = !jQuery.isXMLDoc(a),
        e = c !== undefined,
        f = jQuery.browser.msie;
      if (((b = (d && jQuery.props[b]) || b), a.tagName)) {
        var g = /href|src|style/.test(b);
        if (
          ("selected" == b &&
            jQuery.browser.safari &&
            a.parentNode.selectedIndex,
          b in a && d && !g)
        ) {
          if (e) {
            if ("type" == b && jQuery.nodeName(a, "input") && a.parentNode)
              throw "type property can't be changed";
            a[b] = c;
          }
          return jQuery.nodeName(a, "form") && a.getAttributeNode(b)
            ? a.getAttributeNode(b).nodeValue
            : a[b];
        }
        if (f && d && "style" == b) return jQuery.attr(a.style, "cssText", c);
        e && a.setAttribute(b, "" + c);
        var h = f && d && g ? a.getAttribute(b, 2) : a.getAttribute(b);
        return null === h ? undefined : h;
      }
      return f && "opacity" == b
        ? (e &&
            ((a.zoom = 1),
            (a.filter =
              (a.filter || "").replace(/alpha\([^)]*\)/, "") +
              (parseInt(c) + "" == "NaN"
                ? ""
                : "alpha(opacity=" + 100 * c + ")"))),
          a.filter && a.filter.indexOf("opacity=") >= 0
            ? parseFloat(a.filter.match(/opacity=([^)]*)/)[1]) / 100 + ""
            : "")
        : ((b = b.replace(/-([a-z])/gi, function (a, b) {
            return b.toUpperCase();
          })),
          e && (a[b] = c),
          a[b]);
    },
    trim: function (a) {
      return (a || "").replace(/^\s+|\s+$/g, "");
    },
    makeArray: function (a) {
      var b = [];
      if (null != a) {
        var c = a.length;
        if (null == c || a.split || a.setInterval || a.call) b[0] = a;
        else for (; c; ) b[--c] = a[c];
      }
      return b;
    },
    inArray: function (a, b) {
      for (var c = 0, d = b.length; d > c; c++) if (b[c] === a) return c;
      return -1;
    },
    merge: function (a, b) {
      var c,
        d = 0,
        e = a.length;
      if (jQuery.browser.msie)
        for (; (c = b[d++]); ) 8 != c.nodeType && (a[e++] = c);
      else for (; (c = b[d++]); ) a[e++] = c;
      return a;
    },
    unique: function (a) {
      var b = [],
        c = {};
      try {
        for (var d = 0, e = a.length; e > d; d++) {
          var f = jQuery.data(a[d]);
          c[f] || ((c[f] = !0), b.push(a[d]));
        }
      } catch (g) {
        b = a;
      }
      return b;
    },
    grep: function (a, b, c) {
      for (var d = [], e = 0, f = a.length; f > e; e++)
        !c != !b(a[e], e) && d.push(a[e]);
      return d;
    },
    map: function (a, b) {
      for (var c = [], d = 0, e = a.length; e > d; d++) {
        var f = b(a[d], d);
        null != f && (c[c.length] = f);
      }
      return c.concat.apply([], c);
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
    boxModel: !jQuery.browser.msie || "CSS1Compat" == document.compatMode,
    props: {
      for: "htmlFor",
      class: "className",
      float: styleFloat,
      cssFloat: styleFloat,
      styleFloat: styleFloat,
      readonly: "readOnly",
      maxlength: "maxLength",
      cellspacing: "cellSpacing",
    },
  }),
    jQuery.each(
      {
        parent: function (a) {
          return a.parentNode;
        },
        parents: function (a) {
          return jQuery.dir(a, "parentNode");
        },
        next: function (a) {
          return jQuery.nth(a, 2, "nextSibling");
        },
        prev: function (a) {
          return jQuery.nth(a, 2, "previousSibling");
        },
        nextAll: function (a) {
          return jQuery.dir(a, "nextSibling");
        },
        prevAll: function (a) {
          return jQuery.dir(a, "previousSibling");
        },
        siblings: function (a) {
          return jQuery.sibling(a.parentNode.firstChild, a);
        },
        children: function (a) {
          return jQuery.sibling(a.firstChild);
        },
        contents: function (a) {
          return jQuery.nodeName(a, "iframe")
            ? a.contentDocument || a.contentWindow.document
            : jQuery.makeArray(a.childNodes);
        },
      },
      function (a, b) {
        jQuery.fn[a] = function (a) {
          var c = jQuery.map(this, b);
          return (
            a && "string" == typeof a && (c = jQuery.multiFilter(a, c)),
            this.pushStack(jQuery.unique(c))
          );
        };
      }
    ),
    jQuery.each(
      {
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith",
      },
      function (a, b) {
        jQuery.fn[a] = function () {
          var a = arguments;
          return this.each(function () {
            for (var c = 0, d = a.length; d > c; c++) jQuery(a[c])[b](this);
          });
        };
      }
    ),
    jQuery.each(
      {
        removeAttr: function (a) {
          jQuery.attr(this, a, ""),
            1 == this.nodeType && this.removeAttribute(a);
        },
        addClass: function (a) {
          jQuery.className.add(this, a);
        },
        removeClass: function (a) {
          jQuery.className.remove(this, a);
        },
        toggleClass: function (a) {
          jQuery.className[jQuery.className.has(this, a) ? "remove" : "add"](
            this,
            a
          );
        },
        remove: function (a) {
          (!a || jQuery.filter(a, [this]).r.length) &&
            (jQuery("*", this)
              .add(this)
              .each(function () {
                jQuery.event.remove(this), jQuery.removeData(this);
              }),
            this.parentNode && this.parentNode.removeChild(this));
        },
        empty: function () {
          for (jQuery(">*", this).remove(); this.firstChild; )
            this.removeChild(this.firstChild);
        },
      },
      function (a, b) {
        jQuery.fn[a] = function () {
          return this.each(b, arguments);
        };
      }
    ),
    jQuery.each(["Height", "Width"], function (a, b) {
      var c = b.toLowerCase();
      jQuery.fn[c] = function (a) {
        return this[0] == window
          ? (jQuery.browser.opera && document.body["client" + b]) ||
              (jQuery.browser.safari && window["inner" + b]) ||
              ("CSS1Compat" == document.compatMode &&
                document.documentElement["client" + b]) ||
              document.body["client" + b]
          : this[0] == document
          ? Math.max(
              Math.max(
                document.body["scroll" + b],
                document.documentElement["scroll" + b]
              ),
              Math.max(
                document.body["offset" + b],
                document.documentElement["offset" + b]
              )
            )
          : a == undefined
          ? this.length
            ? jQuery.css(this[0], c)
            : null
          : this.css(c, a.constructor == String ? a : a + "px");
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
      "": function (a, b, c) {
        return "*" == c[2] || jQuery.nodeName(a, c[2]);
      },
      "#": function (a, b, c) {
        return a.getAttribute("id") == c[2];
      },
      ":": {
        lt: function (a, b, c) {
          return b < c[3] - 0;
        },
        gt: function (a, b, c) {
          return b > c[3] - 0;
        },
        nth: function (a, b, c) {
          return c[3] - 0 == b;
        },
        eq: function (a, b, c) {
          return c[3] - 0 == b;
        },
        first: function (a, b) {
          return 0 == b;
        },
        last: function (a, b, c, d) {
          return b == d.length - 1;
        },
        even: function (a, b) {
          return b % 2 == 0;
        },
        odd: function (a, b) {
          return b % 2;
        },
        "first-child": function (a) {
          return a.parentNode.getElementsByTagName("*")[0] == a;
        },
        "last-child": function (a) {
          return jQuery.nth(a.parentNode.lastChild, 1, "previousSibling") == a;
        },
        "only-child": function (a) {
          return !jQuery.nth(a.parentNode.lastChild, 2, "previousSibling");
        },
        parent: function (a) {
          return a.firstChild;
        },
        empty: function (a) {
          return !a.firstChild;
        },
        contains: function (a, b, c) {
          return (
            (a.textContent || a.innerText || jQuery(a).text() || "").indexOf(
              c[3]
            ) >= 0
          );
        },
        visible: function (a) {
          return (
            "hidden" != a.type &&
            "none" != jQuery.css(a, "display") &&
            "hidden" != jQuery.css(a, "visibility")
          );
        },
        hidden: function (a) {
          return (
            "hidden" == a.type ||
            "none" == jQuery.css(a, "display") ||
            "hidden" == jQuery.css(a, "visibility")
          );
        },
        enabled: function (a) {
          return !a.disabled;
        },
        disabled: function (a) {
          return a.disabled;
        },
        checked: function (a) {
          return a.checked;
        },
        selected: function (a) {
          return a.selected || jQuery.attr(a, "selected");
        },
        text: function (a) {
          return "text" == a.type;
        },
        radio: function (a) {
          return "radio" == a.type;
        },
        checkbox: function (a) {
          return "checkbox" == a.type;
        },
        file: function (a) {
          return "file" == a.type;
        },
        password: function (a) {
          return "password" == a.type;
        },
        submit: function (a) {
          return "submit" == a.type;
        },
        image: function (a) {
          return "image" == a.type;
        },
        reset: function (a) {
          return "reset" == a.type;
        },
        button: function (a) {
          return "button" == a.type || jQuery.nodeName(a, "button");
        },
        input: function (a) {
          return /input|select|textarea|button/i.test(a.nodeName);
        },
        has: function (a, b, c) {
          return jQuery.find(c[3], a).length;
        },
        header: function (a) {
          return /h\d/i.test(a.nodeName);
        },
        animated: function (a) {
          return jQuery.grep(jQuery.timers, function (b) {
            return a == b.elem;
          }).length;
        },
      },
    },
    parse: [
      /^(\[) *@?([\w-]+) *([!*$^~=]*) *('?"?)(.*?)\4 *\]/,
      /^(:)([\w-]+)\("?'?(.*?(\(.*?\))?[^(]*?)"?'?\)/,
      new RegExp("^([:.#]*)(" + chars + "+)"),
    ],
    multiFilter: function (a, b, c) {
      for (var d, e = []; a && a != d; ) {
        d = a;
        var f = jQuery.filter(a, b, c);
        (a = f.t.replace(/^\s*,\s*/, "")),
          (e = c ? (b = f.r) : jQuery.merge(e, f.r));
      }
      return e;
    },
    find: function (a, b) {
      if ("string" != typeof a) return [a];
      if (b && 1 != b.nodeType && 9 != b.nodeType) return [];
      b = b || document;
      for (var c, d, e = [b], f = []; a && c != a; ) {
        var g = [];
        (c = a), (a = jQuery.trim(a));
        var h = !1,
          i = quickChild,
          j = i.exec(a);
        if (j) {
          d = j[1].toUpperCase();
          for (var k = 0; e[k]; k++)
            for (var l = e[k].firstChild; l; l = l.nextSibling)
              1 != l.nodeType ||
                ("*" != d && l.nodeName.toUpperCase() != d) ||
                g.push(l);
          if (((e = g), (a = a.replace(i, "")), 0 == a.indexOf(" "))) continue;
          h = !0;
        } else if (((i = /^([>+~])\s*(\w*)/i), null != (j = i.exec(a)))) {
          g = [];
          var m = {};
          (d = j[2].toUpperCase()), (j = j[1]);
          for (var n = 0, o = e.length; o > n; n++)
            for (
              var p = "~" == j || "+" == j ? e[n].nextSibling : e[n].firstChild;
              p;
              p = p.nextSibling
            )
              if (1 == p.nodeType) {
                var q = jQuery.data(p);
                if ("~" == j && m[q]) break;
                if (
                  ((d && p.nodeName.toUpperCase() != d) ||
                    ("~" == j && (m[q] = !0), g.push(p)),
                  "+" == j)
                )
                  break;
              }
          (e = g), (a = jQuery.trim(a.replace(i, ""))), (h = !0);
        }
        if (a && !h)
          if (a.indexOf(",")) {
            var r = quickID,
              j = r.exec(a);
            j
              ? (j = [0, j[2], j[3], j[1]])
              : ((r = quickClass), (j = r.exec(a))),
              (j[2] = j[2].replace(/\\/g, ""));
            var s = e[e.length - 1];
            if ("#" == j[1] && s && s.getElementById && !jQuery.isXMLDoc(s)) {
              var t = s.getElementById(j[2]);
              (jQuery.browser.msie || jQuery.browser.opera) &&
                t &&
                "string" == typeof t.id &&
                t.id != j[2] &&
                (t = jQuery('[@id="' + j[2] + '"]', s)[0]),
                (e = g = !t || (j[3] && !jQuery.nodeName(t, j[3])) ? [] : [t]);
            } else {
              for (var k = 0; e[k]; k++) {
                var u =
                  "#" == j[1] && j[3]
                    ? j[3]
                    : "" != j[1] || "" == j[0]
                    ? "*"
                    : j[2];
                "*" == u &&
                  "object" == e[k].nodeName.toLowerCase() &&
                  (u = "param"),
                  (g = jQuery.merge(g, e[k].getElementsByTagName(u)));
              }
              if (
                ("." == j[1] && (g = jQuery.classFilter(g, j[2])), "#" == j[1])
              ) {
                for (var v = [], k = 0; g[k]; k++)
                  if (g[k].getAttribute("id") == j[2]) {
                    v = [g[k]];
                    break;
                  }
                g = v;
              }
              e = g;
            }
            a = a.replace(r, "");
          } else
            b == e[0] && e.shift(),
              (f = jQuery.merge(f, e)),
              (g = e = [b]),
              (a = " " + a.substr(1, a.length));
        if (a) {
          var w = jQuery.filter(a, g);
          (e = g = w.r), (a = jQuery.trim(w.t));
        }
      }
      return (
        a && (e = []), e && b == e[0] && e.shift(), (f = jQuery.merge(f, e))
      );
    },
    classFilter: function (a, b, c) {
      b = " " + b + " ";
      for (var d = [], e = 0; a[e]; e++) {
        var f = (" " + a[e].className + " ").indexOf(b) >= 0;
        ((!c && f) || (c && !f)) && d.push(a[e]);
      }
      return d;
    },
    filter: function (t, r, not) {
      for (var last; t && t != last; ) {
        last = t;
        for (var p = jQuery.parse, m, i = 0; p[i]; i++)
          if ((m = p[i].exec(t))) {
            (t = t.substring(m[0].length)), (m[2] = m[2].replace(/\\/g, ""));
            break;
          }
        if (!m) break;
        if (":" == m[1] && "not" == m[2])
          r = isSimple.test(m[3])
            ? jQuery.filter(m[3], r, !0).r
            : jQuery(r).not(m[3]);
        else if ("." == m[1]) r = jQuery.classFilter(r, m[2], not);
        else if ("[" == m[1]) {
          for (var tmp = [], type = m[3], i = 0, rl = r.length; rl > i; i++) {
            var a = r[i],
              z = a[jQuery.props[m[2]] || m[2]];
            (null == z || /href|src|selected/.test(m[2])) &&
              (z = jQuery.attr(a, m[2]) || ""),
              (("" == type && !!z) ||
                ("=" == type && z == m[5]) ||
                ("!=" == type && z != m[5]) ||
                ("^=" == type && z && !z.indexOf(m[5])) ||
                ("$=" == type && z.substr(z.length - m[5].length) == m[5]) ||
                (("*=" == type || "~=" == type) && z.indexOf(m[5]) >= 0)) ^
                not && tmp.push(a);
          }
          r = tmp;
        } else if (":" == m[1] && "nth-child" == m[2]) {
          for (
            var merge = {},
              tmp = [],
              test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
                ("even" == m[3] && "2n") ||
                  ("odd" == m[3] && "2n+1") ||
                  (!/\D/.test(m[3]) && "0n+" + m[3]) ||
                  m[3]
              ),
              first = test[1] + (test[2] || 1) - 0,
              last = test[3] - 0,
              i = 0,
              rl = r.length;
            rl > i;
            i++
          ) {
            var node = r[i],
              parentNode = node.parentNode,
              id = jQuery.data(parentNode);
            if (!merge[id]) {
              for (var c = 1, n = parentNode.firstChild; n; n = n.nextSibling)
                1 == n.nodeType && (n.nodeIndex = c++);
              merge[id] = !0;
            }
            var add = !1;
            0 == first
              ? node.nodeIndex == last && (add = !0)
              : (node.nodeIndex - last) % first == 0 &&
                (node.nodeIndex - last) / first >= 0 &&
                (add = !0),
              add ^ not && tmp.push(node);
          }
          r = tmp;
        } else {
          var fn = jQuery.expr[m[1]];
          "object" == typeof fn && (fn = fn[m[2]]),
            "string" == typeof fn &&
              (fn = eval("false||function(a,i){return " + fn + ";}")),
            (r = jQuery.grep(
              r,
              function (a, b) {
                return fn(a, b, m, r);
              },
              not
            ));
        }
      }
      return { r: r, t: t };
    },
    dir: function (a, b) {
      for (var c = [], d = a[b]; d && d != document; )
        1 == d.nodeType && c.push(d), (d = d[b]);
      return c;
    },
    nth: function (a, b, c, d) {
      b = b || 1;
      for (var e = 0; a && (1 != a.nodeType || ++e != b); a = a[c]);
      return a;
    },
    sibling: function (a, b) {
      for (var c = []; a; a = a.nextSibling)
        1 == a.nodeType && a != b && c.push(a);
      return c;
    },
  }),
    (jQuery.event = {
      add: function (a, b, c, d) {
        if (3 != a.nodeType && 8 != a.nodeType) {
          if (
            (jQuery.browser.msie && a.setInterval && (a = window),
            c.guid || (c.guid = this.guid++),
            d != undefined)
          ) {
            var e = c;
            (c = this.proxy(e, function () {
              return e.apply(this, arguments);
            })),
              (c.data = d);
          }
          var f = jQuery.data(a, "events") || jQuery.data(a, "events", {}),
            g =
              jQuery.data(a, "handle") ||
              jQuery.data(a, "handle", function () {
                return "undefined" == typeof jQuery || jQuery.event.triggered
                  ? void 0
                  : jQuery.event.handle.apply(arguments.callee.elem, arguments);
              });
          (g.elem = a),
            jQuery.each(b.split(/\s+/), function (b, d) {
              var e = d.split(".");
              (d = e[0]), (c.type = e[1]);
              var h = f[d];
              h ||
                ((h = f[d] = {}),
                (jQuery.event.special[d] &&
                  jQuery.event.special[d].setup.call(a) !== !1) ||
                  (a.addEventListener
                    ? a.addEventListener(d, g, !1)
                    : a.attachEvent && a.attachEvent("on" + d, g))),
                (h[c.guid] = c),
                (jQuery.event.global[d] = !0);
            }),
            (a = null);
        }
      },
      guid: 1,
      global: {},
      remove: function (a, b, c) {
        if (3 != a.nodeType && 8 != a.nodeType) {
          var d,
            e = jQuery.data(a, "events");
          if (e) {
            if (b == undefined || ("string" == typeof b && "." == b.charAt(0)))
              for (var f in e) this.remove(a, f + (b || ""));
            else
              b.type && ((c = b.handler), (b = b.type)),
                jQuery.each(b.split(/\s+/), function (b, f) {
                  var g = f.split(".");
                  if (((f = g[0]), e[f])) {
                    if (c) delete e[f][c.guid];
                    else
                      for (c in e[f])
                        (g[1] && e[f][c].type != g[1]) || delete e[f][c];
                    for (d in e[f]) break;
                    d ||
                      ((jQuery.event.special[f] &&
                        jQuery.event.special[f].teardown.call(a) !== !1) ||
                        (a.removeEventListener
                          ? a.removeEventListener(
                              f,
                              jQuery.data(a, "handle"),
                              !1
                            )
                          : a.detachEvent &&
                            a.detachEvent("on" + f, jQuery.data(a, "handle"))),
                      (d = null),
                      delete e[f]);
                  }
                });
            for (d in e) break;
            if (!d) {
              var g = jQuery.data(a, "handle");
              g && (g.elem = null),
                jQuery.removeData(a, "events"),
                jQuery.removeData(a, "handle");
            }
          }
        }
      },
      trigger: function (a, b, c, d, e) {
        if (((b = jQuery.makeArray(b)), a.indexOf("!") >= 0)) {
          a = a.slice(0, -1);
          var f = !0;
        }
        if (c) {
          if (3 == c.nodeType || 8 == c.nodeType) return undefined;
          var g,
            h,
            i = jQuery.isFunction(c[a] || null),
            j = !b[0] || !b[0].preventDefault;
          j &&
            (b.unshift({
              type: a,
              target: c,
              preventDefault: function () {},
              stopPropagation: function () {},
              timeStamp: now(),
            }),
            (b[0][expando] = !0)),
            (b[0].type = a),
            f && (b[0].exclusive = !0);
          var k = jQuery.data(c, "handle");
          if (
            (k && (g = k.apply(c, b)),
            (!i || (jQuery.nodeName(c, "a") && "click" == a)) &&
              c["on" + a] &&
              c["on" + a].apply(c, b) === !1 &&
              (g = !1),
            j && b.shift(),
            e &&
              jQuery.isFunction(e) &&
              ((h = e.apply(c, null == g ? b : b.concat(g))),
              h !== undefined && (g = h)),
            i &&
              d !== !1 &&
              g !== !1 &&
              (!jQuery.nodeName(c, "a") || "click" != a))
          ) {
            this.triggered = !0;
            try {
              c[a]();
            } catch (l) {}
          }
          this.triggered = !1;
        } else
          this.global[a] && jQuery("*").add([window, document]).trigger(a, b);
        return g;
      },
      handle: function (a) {
        var b, c, d, e, f;
        (a = arguments[0] = jQuery.event.fix(a || window.event)),
          (d = a.type.split(".")),
          (a.type = d[0]),
          (d = d[1]),
          (e = !d && !a.exclusive),
          (f = (jQuery.data(this, "events") || {})[a.type]);
        for (var g in f) {
          var h = f[g];
          (e || h.type == d) &&
            ((a.handler = h),
            (a.data = h.data),
            (c = h.apply(this, arguments)),
            b !== !1 && (b = c),
            c === !1 && (a.preventDefault(), a.stopPropagation()));
        }
        return b;
      },
      fix: function (a) {
        if (1 == a[expando]) return a;
        var b = a;
        a = { originalEvent: b };
        for (
          var c =
              "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target timeStamp toElement type view wheelDelta which".split(
                " "
              ),
            d = c.length;
          d;
          d--
        )
          a[c[d]] = b[c[d]];
        if (
          ((a[expando] = !0),
          (a.preventDefault = function () {
            b.preventDefault && b.preventDefault(), (b.returnValue = !1);
          }),
          (a.stopPropagation = function () {
            b.stopPropagation && b.stopPropagation(), (b.cancelBubble = !0);
          }),
          (a.timeStamp = a.timeStamp || now()),
          a.target || (a.target = a.srcElement || document),
          3 == a.target.nodeType && (a.target = a.target.parentNode),
          !a.relatedTarget &&
            a.fromElement &&
            (a.relatedTarget =
              a.fromElement == a.target ? a.toElement : a.fromElement),
          null == a.pageX && null != a.clientX)
        ) {
          var e = document.documentElement,
            f = document.body;
          (a.pageX =
            a.clientX +
            ((e && e.scrollLeft) || (f && f.scrollLeft) || 0) -
            (e.clientLeft || 0)),
            (a.pageY =
              a.clientY +
              ((e && e.scrollTop) || (f && f.scrollTop) || 0) -
              (e.clientTop || 0));
        }
        return (
          !a.which &&
            (a.charCode || 0 === a.charCode ? a.charCode : a.keyCode) &&
            (a.which = a.charCode || a.keyCode),
          !a.metaKey && a.ctrlKey && (a.metaKey = a.ctrlKey),
          !a.which &&
            a.button &&
            (a.which =
              1 & a.button ? 1 : 2 & a.button ? 3 : 4 & a.button ? 2 : 0),
          a
        );
      },
      proxy: function (a, b) {
        return (b.guid = a.guid = a.guid || b.guid || this.guid++), b;
      },
      special: {
        ready: {
          setup: function () {
            bindReady();
          },
          teardown: function () {},
        },
        mouseenter: {
          setup: function () {
            return jQuery.browser.msie
              ? !1
              : (jQuery(this).bind(
                  "mouseover",
                  jQuery.event.special.mouseenter.handler
                ),
                !0);
          },
          teardown: function () {
            return jQuery.browser.msie
              ? !1
              : (jQuery(this).unbind(
                  "mouseover",
                  jQuery.event.special.mouseenter.handler
                ),
                !0);
          },
          handler: function (a) {
            return withinElement(a, this)
              ? !0
              : ((a.type = "mouseenter"),
                jQuery.event.handle.apply(this, arguments));
          },
        },
        mouseleave: {
          setup: function () {
            return jQuery.browser.msie
              ? !1
              : (jQuery(this).bind(
                  "mouseout",
                  jQuery.event.special.mouseleave.handler
                ),
                !0);
          },
          teardown: function () {
            return jQuery.browser.msie
              ? !1
              : (jQuery(this).unbind(
                  "mouseout",
                  jQuery.event.special.mouseleave.handler
                ),
                !0);
          },
          handler: function (a) {
            return withinElement(a, this)
              ? !0
              : ((a.type = "mouseleave"),
                jQuery.event.handle.apply(this, arguments));
          },
        },
      },
    }),
    jQuery.fn.extend({
      bind: function (a, b, c) {
        return "unload" == a
          ? this.one(a, b, c)
          : this.each(function () {
              jQuery.event.add(this, a, c || b, c && b);
            });
      },
      one: function (a, b, c) {
        var d = jQuery.event.proxy(c || b, function (a) {
          return jQuery(this).unbind(a, d), (c || b).apply(this, arguments);
        });
        return this.each(function () {
          jQuery.event.add(this, a, d, c && b);
        });
      },
      unbind: function (a, b) {
        return this.each(function () {
          jQuery.event.remove(this, a, b);
        });
      },
      trigger: function (a, b, c) {
        return this.each(function () {
          jQuery.event.trigger(a, b, this, !0, c);
        });
      },
      triggerHandler: function (a, b, c) {
        return this[0] && jQuery.event.trigger(a, b, this[0], !1, c);
      },
      toggle: function (a) {
        for (var b = arguments, c = 1; c < b.length; )
          jQuery.event.proxy(a, b[c++]);
        return this.click(
          jQuery.event.proxy(a, function (a) {
            return (
              (this.lastToggle = (this.lastToggle || 0) % c),
              a.preventDefault(),
              b[this.lastToggle++].apply(this, arguments) || !1
            );
          })
        );
      },
      hover: function (a, b) {
        return this.bind("mouseenter", a).bind("mouseleave", b);
      },
      ready: function (a) {
        return (
          bindReady(),
          jQuery.isReady
            ? a.call(document, jQuery)
            : jQuery.readyList.push(function () {
                return a.call(this, jQuery);
              }),
          this
        );
      },
    }),
    jQuery.extend({
      isReady: !1,
      readyList: [],
      ready: function () {
        jQuery.isReady ||
          ((jQuery.isReady = !0),
          jQuery.readyList &&
            (jQuery.each(jQuery.readyList, function () {
              this.call(document);
            }),
            (jQuery.readyList = null)),
          jQuery(document).triggerHandler("ready"));
      },
    });
  var readyBound = !1;
  jQuery.each(
    "blur,focus,load,resize,scroll,unload,click,dblclick,mousedown,mouseup,mousemove,mouseover,mouseout,change,select,submit,keydown,keypress,keyup,error".split(
      ","
    ),
    function (a, b) {
      jQuery.fn[b] = function (a) {
        return a ? this.bind(b, a) : this.trigger(b);
      };
    }
  );
  var withinElement = function (a, b) {
    for (var c = a.relatedTarget; c && c != b; )
      try {
        c = c.parentNode;
      } catch (d) {
        c = b;
      }
    return c == b;
  };
  jQuery(window).bind("unload", function () {
    jQuery("*").add(document).unbind();
  }),
    jQuery.fn.extend({
      _load: jQuery.fn.load,
      load: function (a, b, c) {
        if ("string" != typeof a) return this._load(a);
        var d = a.indexOf(" ");
        if (d >= 0) {
          var e = a.slice(d, a.length);
          a = a.slice(0, d);
        }
        c = c || function () {};
        var f = "GET";
        b &&
          (jQuery.isFunction(b)
            ? ((c = b), (b = null))
            : ((b = jQuery.param(b)), (f = "POST")));
        var g = this;
        return (
          jQuery.ajax({
            url: a,
            type: f,
            dataType: "html",
            data: b,
            complete: function (a, b) {
              ("success" == b || "notmodified" == b) &&
                g.html(
                  e
                    ? jQuery("<div/>")
                        .append(
                          a.responseText.replace(
                            /<script(.|\s)*?\/script>/g,
                            ""
                          )
                        )
                        .find(e)
                    : a.responseText
                ),
                g.each(c, [a.responseText, b, a]);
            },
          }),
          this
        );
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
          .map(function (a, b) {
            var c = jQuery(this).val();
            return null == c
              ? null
              : c.constructor == Array
              ? jQuery.map(c, function (a, c) {
                  return { name: b.name, value: a };
                })
              : { name: b.name, value: c };
          })
          .get();
      },
    }),
    jQuery.each(
      "ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(
        ","
      ),
      function (a, b) {
        jQuery.fn[b] = function (a) {
          return this.bind(b, a);
        };
      }
    );
  var jsc = now();
  jQuery.extend({
    get: function (a, b, c, d) {
      return (
        jQuery.isFunction(b) && ((c = b), (b = null)),
        jQuery.ajax({ type: "GET", url: a, data: b, success: c, dataType: d })
      );
    },
    getScript: function (a, b) {
      return jQuery.get(a, null, b, "script");
    },
    getJSON: function (a, b, c) {
      return jQuery.get(a, b, c, "json");
    },
    post: function (a, b, c, d) {
      return (
        jQuery.isFunction(b) && ((c = b), (b = {})),
        jQuery.ajax({ type: "POST", url: a, data: b, success: c, dataType: d })
      );
    },
    ajaxSetup: function (a) {
      jQuery.extend(jQuery.ajaxSettings, a);
    },
    ajaxSettings: {
      url: location.href,
      global: !0,
      type: "GET",
      timeout: 0,
      contentType: "application/x-www-form-urlencoded",
      processData: !0,
      async: !0,
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
    ajax: function (a) {
      function b() {
        a.success && a.success(f, e),
          a.global && jQuery.event.trigger("ajaxSuccess", [p, a]);
      }
      function c() {
        a.complete && a.complete(p, e),
          a.global && jQuery.event.trigger("ajaxComplete", [p, a]),
          a.global && !--jQuery.active && jQuery.event.trigger("ajaxStop");
      }
      a = jQuery.extend(!0, a, jQuery.extend(!0, {}, jQuery.ajaxSettings, a));
      var d,
        e,
        f,
        g = /=\?(&|$)/g,
        h = a.type.toUpperCase();
      if (
        (a.data &&
          a.processData &&
          "string" != typeof a.data &&
          (a.data = jQuery.param(a.data)),
        "jsonp" == a.dataType &&
          ("GET" == h
            ? a.url.match(g) ||
              (a.url +=
                (a.url.match(/\?/) ? "&" : "?") +
                (a.jsonp || "callback") +
                "=?")
            : (a.data && a.data.match(g)) ||
              (a.data =
                (a.data ? a.data + "&" : "") + (a.jsonp || "callback") + "=?"),
          (a.dataType = "json")),
        "json" == a.dataType &&
          ((a.data && a.data.match(g)) || a.url.match(g)) &&
          ((d = "jsonp" + jsc++),
          a.data && (a.data = (a.data + "").replace(g, "=" + d + "$1")),
          (a.url = a.url.replace(g, "=" + d + "$1")),
          (a.dataType = "script"),
          (window[d] = function (a) {
            (f = a), b(), c(), (window[d] = undefined);
            try {
              delete window[d];
            } catch (e) {}
            l && l.removeChild(m);
          })),
        "script" == a.dataType && null == a.cache && (a.cache = !1),
        a.cache === !1 && "GET" == h)
      ) {
        var i = now(),
          j = a.url.replace(/(\?|&)_=.*?(&|$)/, "$1_=" + i + "$2");
        a.url =
          j + (j == a.url ? (a.url.match(/\?/) ? "&" : "?") + "_=" + i : "");
      }
      a.data &&
        "GET" == h &&
        ((a.url += (a.url.match(/\?/) ? "&" : "?") + a.data), (a.data = null)),
        a.global && !jQuery.active++ && jQuery.event.trigger("ajaxStart");
      var k = /^(?:\w+:)?\/\/([^\/?#]+)/;
      if (
        "script" == a.dataType &&
        "GET" == h &&
        k.test(a.url) &&
        k.exec(a.url)[1] != location.host
      ) {
        var l = document.getElementsByTagName("head")[0],
          m = document.createElement("script");
        if (
          ((m.src = a.url),
          a.scriptCharset && (m.charset = a.scriptCharset),
          !d)
        ) {
          var n = !1;
          m.onload = m.onreadystatechange = function () {
            n ||
              (this.readyState &&
                "loaded" != this.readyState &&
                "complete" != this.readyState) ||
              ((n = !0), b(), c(), l.removeChild(m));
          };
        }
        return l.appendChild(m), undefined;
      }
      var o = !1,
        p = window.ActiveXObject
          ? new ActiveXObject("Microsoft.XMLHTTP")
          : new XMLHttpRequest();
      a.username
        ? p.open(h, a.url, a.async, a.username, a.password)
        : p.open(h, a.url, a.async);
      try {
        a.data && p.setRequestHeader("Content-Type", a.contentType),
          a.ifModified &&
            p.setRequestHeader(
              "If-Modified-Since",
              jQuery.lastModified[a.url] || "Thu, 01 Jan 1970 00:00:00 GMT"
            ),
          p.setRequestHeader("X-Requested-With", "XMLHttpRequest"),
          p.setRequestHeader(
            "Accept",
            a.dataType && a.accepts[a.dataType]
              ? a.accepts[a.dataType] + ", */*"
              : a.accepts._default
          );
      } catch (q) {}
      if (a.beforeSend && a.beforeSend(p, a) === !1)
        return a.global && jQuery.active--, p.abort(), !1;
      a.global && jQuery.event.trigger("ajaxSend", [p, a]);
      var r = function (g) {
        if (!o && p && (4 == p.readyState || "timeout" == g)) {
          if (
            ((o = !0),
            s && (clearInterval(s), (s = null)),
            (e =
              ("timeout" == g && "timeout") ||
              (!jQuery.httpSuccess(p) && "error") ||
              (a.ifModified &&
                jQuery.httpNotModified(p, a.url) &&
                "notmodified") ||
              "success"),
            "success" == e)
          )
            try {
              f = jQuery.httpData(p, a.dataType, a.dataFilter);
            } catch (h) {
              e = "parsererror";
            }
          if ("success" == e) {
            var i;
            try {
              i = p.getResponseHeader("Last-Modified");
            } catch (h) {}
            a.ifModified && i && (jQuery.lastModified[a.url] = i), d || b();
          } else jQuery.handleError(a, p, e);
          c(), a.async && (p = null);
        }
      };
      if (a.async) {
        var s = setInterval(r, 13);
        a.timeout > 0 &&
          setTimeout(function () {
            p && (p.abort(), o || r("timeout"));
          }, a.timeout);
      }
      try {
        p.send(a.data);
      } catch (q) {
        jQuery.handleError(a, p, null, q);
      }
      return a.async || r(), p;
    },
    handleError: function (a, b, c, d) {
      a.error && a.error(b, c, d),
        a.global && jQuery.event.trigger("ajaxError", [b, a, d]);
    },
    active: 0,
    httpSuccess: function (a) {
      try {
        return (
          (!a.status && "file:" == location.protocol) ||
          (a.status >= 200 && a.status < 300) ||
          304 == a.status ||
          1223 == a.status ||
          (jQuery.browser.safari && a.status == undefined)
        );
      } catch (b) {}
      return !1;
    },
    httpNotModified: function (a, b) {
      try {
        var c = a.getResponseHeader("Last-Modified");
        return (
          304 == a.status ||
          c == jQuery.lastModified[b] ||
          (jQuery.browser.safari && a.status == undefined)
        );
      } catch (d) {}
      return !1;
    },
    httpData: function (xhr, type, filter) {
      var ct = xhr.getResponseHeader("content-type"),
        xml = "xml" == type || (!type && ct && ct.indexOf("xml") >= 0),
        data = xml ? xhr.responseXML : xhr.responseText;
      if (xml && "parsererror" == data.documentElement.tagName)
        throw "parsererror";
      return (
        filter && (data = filter(data, type)),
        "script" == type && jQuery.globalEval(data),
        "json" == type && (data = eval("(" + data + ")")),
        data
      );
    },
    param: function (a) {
      var b = [];
      if (a.constructor == Array || a.jquery)
        jQuery.each(a, function () {
          b.push(
            encodeURIComponent(this.name) + "=" + encodeURIComponent(this.value)
          );
        });
      else
        for (var c in a)
          a[c] && a[c].constructor == Array
            ? jQuery.each(a[c], function () {
                b.push(encodeURIComponent(c) + "=" + encodeURIComponent(this));
              })
            : b.push(
                encodeURIComponent(c) +
                  "=" +
                  encodeURIComponent(jQuery.isFunction(a[c]) ? a[c]() : a[c])
              );
      return b.join("&").replace(/%20/g, "+");
    },
  }),
    jQuery.fn.extend({
      show: function (a, b) {
        return a
          ? this.animate(
              { height: "show", width: "show", opacity: "show" },
              a,
              b
            )
          : this.filter(":hidden")
              .each(function () {
                if (
                  ((this.style.display = this.oldblock || ""),
                  "none" == jQuery.css(this, "display"))
                ) {
                  var a = jQuery("<" + this.tagName + " />").appendTo("body");
                  (this.style.display = a.css("display")),
                    "none" == this.style.display &&
                      (this.style.display = "block"),
                    a.remove();
                }
              })
              .end();
      },
      hide: function (a, b) {
        return a
          ? this.animate(
              { height: "hide", width: "hide", opacity: "hide" },
              a,
              b
            )
          : this.filter(":visible")
              .each(function () {
                (this.oldblock = this.oldblock || jQuery.css(this, "display")),
                  (this.style.display = "none");
              })
              .end();
      },
      _toggle: jQuery.fn.toggle,
      toggle: function (a, b) {
        return jQuery.isFunction(a) && jQuery.isFunction(b)
          ? this._toggle.apply(this, arguments)
          : a
          ? this.animate(
              { height: "toggle", width: "toggle", opacity: "toggle" },
              a,
              b
            )
          : this.each(function () {
              jQuery(this)[jQuery(this).is(":hidden") ? "show" : "hide"]();
            });
      },
      slideDown: function (a, b) {
        return this.animate({ height: "show" }, a, b);
      },
      slideUp: function (a, b) {
        return this.animate({ height: "hide" }, a, b);
      },
      slideToggle: function (a, b) {
        return this.animate({ height: "toggle" }, a, b);
      },
      fadeIn: function (a, b) {
        return this.animate({ opacity: "show" }, a, b);
      },
      fadeOut: function (a, b) {
        return this.animate({ opacity: "hide" }, a, b);
      },
      fadeTo: function (a, b, c) {
        return this.animate({ opacity: b }, a, c);
      },
      animate: function (a, b, c, d) {
        var e = jQuery.speed(b, c, d);
        return this[e.queue === !1 ? "each" : "queue"](function () {
          if (1 != this.nodeType) return !1;
          var b,
            c = jQuery.extend({}, e),
            d = jQuery(this).is(":hidden"),
            f = this;
          for (b in a) {
            if (("hide" == a[b] && d) || ("show" == a[b] && !d))
              return c.complete.call(this);
            ("height" == b || "width" == b) &&
              ((c.display = jQuery.css(this, "display")),
              (c.overflow = this.style.overflow));
          }
          return (
            null != c.overflow && (this.style.overflow = "hidden"),
            (c.curAnim = jQuery.extend({}, a)),
            jQuery.each(a, function (b, e) {
              var g = new jQuery.fx(f, c, b);
              if (/toggle|show|hide/.test(e))
                g["toggle" == e ? (d ? "show" : "hide") : e](a);
              else {
                var h = e.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),
                  i = g.cur(!0) || 0;
                if (h) {
                  var j = parseFloat(h[2]),
                    k = h[3] || "px";
                  "px" != k &&
                    ((f.style[b] = (j || 1) + k),
                    (i = ((j || 1) / g.cur(!0)) * i),
                    (f.style[b] = i + k)),
                    h[1] && (j = ("-=" == h[1] ? -1 : 1) * j + i),
                    g.custom(i, j, k);
                } else g.custom(i, e, "");
              }
            }),
            !0
          );
        });
      },
      queue: function (a, b) {
        return (
          (jQuery.isFunction(a) || (a && a.constructor == Array)) &&
            ((b = a), (a = "fx")),
          !a || ("string" == typeof a && !b)
            ? queue(this[0], a)
            : this.each(function () {
                b.constructor == Array
                  ? queue(this, a, b)
                  : (queue(this, a).push(b),
                    1 == queue(this, a).length && b.call(this));
              })
        );
      },
      stop: function (a, b) {
        var c = jQuery.timers;
        return (
          a && this.queue([]),
          this.each(function () {
            for (var a = c.length - 1; a >= 0; a--)
              c[a].elem == this && (b && c[a](!0), c.splice(a, 1));
          }),
          b || this.dequeue(),
          this
        );
      },
    });
  var queue = function (a, b, c) {
    if (a) {
      b = b || "fx";
      var d = jQuery.data(a, b + "queue");
      (!d || c) && (d = jQuery.data(a, b + "queue", jQuery.makeArray(c)));
    }
    return d;
  };
  (jQuery.fn.dequeue = function (a) {
    return (
      (a = a || "fx"),
      this.each(function () {
        var b = queue(this, a);
        b.shift(), b.length && b[0].call(this);
      })
    );
  }),
    jQuery.extend({
      speed: function (a, b, c) {
        var d =
          a && a.constructor == Object
            ? a
            : {
                complete: c || (!c && b) || (jQuery.isFunction(a) && a),
                duration: a,
                easing: (c && b) || (b && b.constructor != Function && b),
              };
        return (
          (d.duration =
            (d.duration && d.duration.constructor == Number
              ? d.duration
              : jQuery.fx.speeds[d.duration]) || jQuery.fx.speeds.def),
          (d.old = d.complete),
          (d.complete = function () {
            d.queue !== !1 && jQuery(this).dequeue(),
              jQuery.isFunction(d.old) && d.old.call(this);
          }),
          d
        );
      },
      easing: {
        linear: function (a, b, c, d) {
          return c + d * a;
        },
        swing: function (a, b, c, d) {
          return (-Math.cos(a * Math.PI) / 2 + 0.5) * d + c;
        },
      },
      timers: [],
      timerId: null,
      fx: function (a, b, c) {
        (this.options = b),
          (this.elem = a),
          (this.prop = c),
          b.orig || (b.orig = {});
      },
    }),
    (jQuery.fx.prototype = {
      update: function () {
        this.options.step && this.options.step.call(this.elem, this.now, this),
          (jQuery.fx.step[this.prop] || jQuery.fx.step._default)(this),
          ("height" == this.prop || "width" == this.prop) &&
            (this.elem.style.display = "block");
      },
      cur: function (a) {
        if (null != this.elem[this.prop] && null == this.elem.style[this.prop])
          return this.elem[this.prop];
        var b = parseFloat(jQuery.css(this.elem, this.prop, a));
        return b && b > -1e4
          ? b
          : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0;
      },
      custom: function (a, b, c) {
        function d(a) {
          return e.step(a);
        }
        (this.startTime = now()),
          (this.start = a),
          (this.end = b),
          (this.unit = c || this.unit || "px"),
          (this.now = this.start),
          (this.pos = this.state = 0),
          this.update();
        var e = this;
        (d.elem = this.elem),
          jQuery.timers.push(d),
          null == jQuery.timerId &&
            (jQuery.timerId = setInterval(function () {
              for (var a = jQuery.timers, b = 0; b < a.length; b++)
                a[b]() || a.splice(b--, 1);
              a.length ||
                (clearInterval(jQuery.timerId), (jQuery.timerId = null));
            }, 13));
      },
      show: function () {
        (this.options.orig[this.prop] = jQuery.attr(
          this.elem.style,
          this.prop
        )),
          (this.options.show = !0),
          this.custom(0, this.cur()),
          ("width" == this.prop || "height" == this.prop) &&
            (this.elem.style[this.prop] = "1px"),
          jQuery(this.elem).show();
      },
      hide: function () {
        (this.options.orig[this.prop] = jQuery.attr(
          this.elem.style,
          this.prop
        )),
          (this.options.hide = !0),
          this.custom(this.cur(), 0);
      },
      step: function (a) {
        var b = now();
        if (a || b > this.options.duration + this.startTime) {
          (this.now = this.end),
            (this.pos = this.state = 1),
            this.update(),
            (this.options.curAnim[this.prop] = !0);
          var c = !0;
          for (var d in this.options.curAnim)
            this.options.curAnim[d] !== !0 && (c = !1);
          if (
            c &&
            (null != this.options.display &&
              ((this.elem.style.overflow = this.options.overflow),
              (this.elem.style.display = this.options.display),
              "none" == jQuery.css(this.elem, "display") &&
                (this.elem.style.display = "block")),
            this.options.hide && (this.elem.style.display = "none"),
            this.options.hide || this.options.show)
          )
            for (var e in this.options.curAnim)
              jQuery.attr(this.elem.style, e, this.options.orig[e]);
          return c && this.options.complete.call(this.elem), !1;
        }
        var f = b - this.startTime;
        return (
          (this.state = f / this.options.duration),
          (this.pos = jQuery.easing[
            this.options.easing || (jQuery.easing.swing ? "swing" : "linear")
          ](this.state, f, 0, 1, this.options.duration)),
          (this.now = this.start + (this.end - this.start) * this.pos),
          this.update(),
          !0
        );
      },
    }),
    jQuery.extend(jQuery.fx, {
      speeds: { slow: 600, fast: 200, def: 400 },
      step: {
        scrollLeft: function (a) {
          a.elem.scrollLeft = a.now;
        },
        scrollTop: function (a) {
          a.elem.scrollTop = a.now;
        },
        opacity: function (a) {
          jQuery.attr(a.elem.style, "opacity", a.now);
        },
        _default: function (a) {
          a.elem.style[a.prop] = a.now + a.unit;
        },
      },
    }),
    (jQuery.fn.offset = function () {
      function border(a) {
        add(
          jQuery.curCSS(a, "borderLeftWidth", !0),
          jQuery.curCSS(a, "borderTopWidth", !0)
        );
      }
      function add(a, b) {
        (left += parseInt(a, 10) || 0), (top += parseInt(b, 10) || 0);
      }
      var results,
        left = 0,
        top = 0,
        elem = this[0];
      if (elem)
        with (jQuery.browser) {
          var parent = elem.parentNode,
            offsetChild = elem,
            offsetParent = elem.offsetParent,
            doc = elem.ownerDocument,
            safari2 =
              safari && parseInt(version) < 522 && !/adobeair/i.test(userAgent),
            css = jQuery.curCSS,
            fixed = "fixed" == css(elem, "position");
          if (elem.getBoundingClientRect) {
            var box = elem.getBoundingClientRect();
            add(
              box.left +
                Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft),
              box.top +
                Math.max(doc.documentElement.scrollTop, doc.body.scrollTop)
            ),
              add(
                -doc.documentElement.clientLeft,
                -doc.documentElement.clientTop
              );
          } else {
            for (add(elem.offsetLeft, elem.offsetTop); offsetParent; )
              add(offsetParent.offsetLeft, offsetParent.offsetTop),
                ((mozilla && !/^t(able|d|h)$/i.test(offsetParent.tagName)) ||
                  (safari && !safari2)) &&
                  border(offsetParent),
                fixed ||
                  "fixed" != css(offsetParent, "position") ||
                  (fixed = !0),
                (offsetChild = /^body$/i.test(offsetParent.tagName)
                  ? offsetChild
                  : offsetParent),
                (offsetParent = offsetParent.offsetParent);
            for (
              ;
              parent && parent.tagName && !/^body|html$/i.test(parent.tagName);

            )
              /^inline|table.*$/i.test(css(parent, "display")) ||
                add(-parent.scrollLeft, -parent.scrollTop),
                mozilla &&
                  "visible" != css(parent, "overflow") &&
                  border(parent),
                (parent = parent.parentNode);
            ((safari2 &&
              (fixed || "absolute" == css(offsetChild, "position"))) ||
              (mozilla && "absolute" != css(offsetChild, "position"))) &&
              add(-doc.body.offsetLeft, -doc.body.offsetTop),
              fixed &&
                add(
                  Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft),
                  Math.max(doc.documentElement.scrollTop, doc.body.scrollTop)
                );
          }
          results = { top: top, left: left };
        }
      return results;
    }),
    jQuery.fn.extend({
      position: function () {
        var a;
        if (this[0]) {
          var b = this.offsetParent(),
            c = this.offset(),
            d = /^body|html$/i.test(b[0].tagName)
              ? { top: 0, left: 0 }
              : b.offset();
          (c.top -= num(this, "marginTop")),
            (c.left -= num(this, "marginLeft")),
            (d.top += num(b, "borderTopWidth")),
            (d.left += num(b, "borderLeftWidth")),
            (a = { top: c.top - d.top, left: c.left - d.left });
        }
        return a;
      },
      offsetParent: function () {
        for (
          var a = this[0].offsetParent;
          a &&
          !/^body|html$/i.test(a.tagName) &&
          "static" == jQuery.css(a, "position");

        )
          a = a.offsetParent;
        return jQuery(a);
      },
    }),
    jQuery.each(["Left", "Top"], function (a, b) {
      var c = "scroll" + b;
      jQuery.fn[c] = function (b) {
        return this[0]
          ? b != undefined
            ? this.each(function () {
                this == window || this == document
                  ? window.scrollTo(
                      a ? jQuery(window).scrollLeft() : b,
                      a ? b : jQuery(window).scrollTop()
                    )
                  : (this[c] = b);
              })
            : this[0] == window || this[0] == document
            ? self[a ? "pageYOffset" : "pageXOffset"] ||
              (jQuery.boxModel && document.documentElement[c]) ||
              document.body[c]
            : this[0][c]
          : void 0;
      };
    }),
    jQuery.each(["Height", "Width"], function (a, b) {
      var c = a ? "Left" : "Top",
        d = a ? "Right" : "Bottom";
      (jQuery.fn["inner" + b] = function () {
        return (
          this[b.toLowerCase()]() +
          num(this, "padding" + c) +
          num(this, "padding" + d)
        );
      }),
        (jQuery.fn["outer" + b] = function (a) {
          return (
            this["inner" + b]() +
            num(this, "border" + c + "Width") +
            num(this, "border" + d + "Width") +
            (a ? num(this, "margin" + c) + num(this, "margin" + d) : 0)
          );
        });
    });
})();
!new (function (a) {
  var b = a.separator || "&",
    c = a.spaces === !1 ? !1 : !0,
    d = (a.suffix === !1 ? "" : "[]", a.prefix === !1 ? !1 : !0),
    e = d ? (a.hash === !0 ? "#" : "?") : "",
    f = a.numbers === !1 ? !1 : !0;
  jQuery.query = new (function () {
    var a = function (a, b) {
        return void 0 != a && null !== a && (b ? a.constructor == b : !0);
      },
      d = function (a) {
        for (
          var b,
            c = /\[([^[]*)\]/g,
            d = /^(\S+?)(\[\S*\])?$/.exec(a),
            e = d[1],
            f = [];
          (b = c.exec(d[2]));

        )
          f.push(b[1]);
        return [e, f];
      },
      g = function (b, c, d) {
        var e = c.shift();
        if (("object" != typeof b && (b = null), "" === e))
          if ((b || (b = []), a(b, Array)))
            b.push(0 == c.length ? d : g(null, c.slice(0), d));
          else if (a(b, Object)) {
            for (var f = 0; null != b[f++]; );
            b[--f] = 0 == c.length ? d : g(b[f], c.slice(0), d);
          } else (b = []), b.push(0 == c.length ? d : g(null, c.slice(0), d));
        else if (e && e.match(/^\s*[0-9]+\s*$/)) {
          var h = parseInt(e, 10);
          b || (b = []), (b[h] = 0 == c.length ? d : g(b[h], c.slice(0), d));
        } else {
          if (!e) return d;
          var h = e.replace(/^\s*|\s*$/g, "");
          if ((b || (b = {}), a(b, Array))) {
            for (var i = {}, f = 0; f < b.length; ++f) i[f] = b[f];
            b = i;
          }
          b[h] = 0 == c.length ? d : g(b[h], c.slice(0), d);
        }
        return b;
      },
      h = function (a) {
        var b = this;
        return (
          (b.keys = {}),
          a.queryObject
            ? jQuery.each(a.get(), function (a, c) {
                b.SET(a, c);
              })
            : jQuery.each(arguments, function () {
                var a = "" + this;
                (a = a.replace(/^[?#]/, "")),
                  (a = a.replace(/[;&]$/, "")),
                  c && (a = a.replace(/[+]/g, " ")),
                  jQuery.each(a.split(/[&;]/), function () {
                    var a = decodeURIComponent(this.split("=")[0]),
                      c = decodeURIComponent(this.split("=")[1]);
                    a &&
                      (f &&
                        (/^[+-]?[0-9]+\.[0-9]*$/.test(c)
                          ? (c = parseFloat(c))
                          : /^[+-]?[0-9]+$/.test(c) && (c = parseInt(c, 10))),
                      (c = c || 0 === c ? c : !0),
                      c !== !1 && c !== !0 && "number" != typeof c && (c = c),
                      b.SET(a, c));
                  });
              }),
          b
        );
      };
    return (
      (h.prototype = {
        queryObject: !0,
        has: function (b, c) {
          var d = this.get(b);
          return a(d, c);
        },
        GET: function (b) {
          if (!a(b)) return this.keys;
          for (
            var c = d(b), e = c[0], f = c[1], g = this.keys[e];
            null != g && 0 != f.length;

          )
            g = g[f.shift()];
          return "number" == typeof g ? g : g || "";
        },
        get: function (b) {
          var c = this.GET(b);
          return a(c, Object)
            ? jQuery.extend(!0, {}, c)
            : a(c, Array)
            ? c.slice(0)
            : c;
        },
        SET: function (b, c) {
          var e = a(c) ? c : null,
            f = d(b),
            h = f[0],
            i = f[1],
            j = this.keys[h];
          return (this.keys[h] = g(j, i.slice(0), e)), this;
        },
        set: function (a, b) {
          return this.copy().SET(a, b);
        },
        REMOVE: function (a) {
          return this.SET(a, null).COMPACT();
        },
        remove: function (a) {
          return this.copy().REMOVE(a);
        },
        EMPTY: function () {
          var a = this;
          return (
            jQuery.each(a.keys, function (b, c) {
              delete a.keys[b];
            }),
            a
          );
        },
        load: function (a) {
          var b = a.replace(/^.*?[#](.+?)(?:\?.+)?$/, "$1"),
            c = a.replace(/^.*?[?](.+?)(?:#.+)?$/, "$1");
          return new h(
            a.length == c.length ? "" : c,
            a.length == b.length ? "" : b
          );
        },
        empty: function () {
          return this.copy().EMPTY();
        },
        copy: function () {
          return new h(this);
        },
        COMPACT: function () {
          function b(c) {
            function d(b, c, d) {
              a(b, Array) ? b.push(d) : (b[c] = d);
            }
            var e = "object" == typeof c ? (a(c, Array) ? [] : {}) : c;
            return (
              "object" == typeof c &&
                jQuery.each(c, function (c, f) {
                  return a(f) ? void d(e, c, b(f)) : !0;
                }),
              e
            );
          }
          return (this.keys = b(this.keys)), this;
        },
        compact: function () {
          return this.copy().COMPACT();
        },
        toString: function () {
          var c = [],
            d = [],
            f = function (b, c, d) {
              if (a(d) && d !== !1) {
                var e = [encodeURIComponent(c)];
                d !== !0 && (e.push("="), e.push(encodeURIComponent(d))),
                  b.push(e.join(""));
              }
            },
            g = function (a, b) {
              var c = function (a) {
                return b && "" != b ? [b, "[", a, "]"].join("") : [a].join("");
              };
              jQuery.each(a, function (a, b) {
                "object" == typeof b ? g(b, c(a)) : f(d, c(a), b);
              });
            };
          return (
            g(this.keys),
            d.length > 0 && c.push(e),
            c.push(d.join(b)),
            c.join("")
          );
        },
      }),
      new h(location.search, location.hash)
    );
  })();
})(jQuery.query || {});
eval(
  (function (a, b, c, d, e, f) {
    if (
      ((e = function (a) {
        return (
          (b > a ? "" : e(parseInt(a / b))) +
          ((a %= b) > 35 ? String.fromCharCode(a + 29) : a.toString(36))
        );
      }),
      !"".replace(/^/, String))
    ) {
      for (; c--; ) f[e(c)] = d[c] || e(c);
      (d = [
        function (a) {
          return f[a];
        },
      ]),
        (e = function () {
          return "\\w+";
        }),
        (c = 1);
    }
    for (; c--; )
      d[c] && (a = a.replace(new RegExp("\\b" + e(c) + "\\b", "g"), d[c]));
    return a;
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
!(function ($) {
  function toIntegersAtLease(a) {
    return 10 > a ? "0" + a : a;
  }
  Date.prototype.toJSON = function (a) {
    return (
      a.getUTCFullYear() +
      "-" +
      toIntegersAtLease(a.getUTCMonth() + 1) +
      "-" +
      toIntegersAtLease(a.getUTCDate())
    );
  };
  var escapeable = /["\\\x00-\x1f\x7f-\x9f]/g,
    meta = {
      "\b": "\\b",
      "	": "\\t",
      "\n": "\\n",
      "\f": "\\f",
      "\r": "\\r",
      '"': '\\"',
      "\\": "\\\\",
    };
  ($.quoteString = function (a) {
    return escapeable.test(a)
      ? '"' +
          a.replace(escapeable, function (a) {
            var b = meta[a];
            return "string" == typeof b
              ? b
              : ((b = a.charCodeAt()),
                "\\u00" +
                  Math.floor(b / 16).toString(16) +
                  (b % 16).toString(16));
          }) +
          '"'
      : '"' + a + '"';
  }),
    ($.toJSON = function (a) {
      var b = typeof a;
      if ("undefined" == b) return "null";
      if ("number" == b || "boolean" == b) return a + "";
      if (null === a) return "null";
      if ("string" == b) return $.quoteString(a);
      if ("object" == b && "function" == typeof a.toJSONObject)
        return $.toJSON(a.toJSONObject());
      if ("function" != b && "number" == typeof a.length) {
        for (var c = [], d = 0; d < a.length; d++) c.push($.toJSON(a[d]));
        return "[" + c.join(", ") + "]";
      }
      if ("function" == b)
        throw new TypeError(
          "Unable to convert object of type 'function' to json."
        );
      c = [];
      for (var e in a) {
        var f,
          b = typeof e;
        if ("number" == b) f = '"' + e + '"';
        else {
          if ("string" != b) continue;
          f = $.quoteString(e);
        }
        (val = $.toJSON(a[e])),
          "string" == typeof val && c.push(f + ": " + val);
      }
      return "{" + c.join(", ") + "}";
    }),
    ($.evalJSON = function (src) {
      return eval("(" + src + ")");
    }),
    ($.secureEvalJSON = function (src) {
      var filtered = src;
      if (
        ((filtered = filtered.replace(/\\["\\\/bfnrtu]/g, "@")),
        (filtered = filtered.replace(
          /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
          "]"
        )),
        (filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, "")),
        /^[\],:{}\s]*$/.test(filtered))
      )
        return eval("(" + src + ")");
      throw new SyntaxError("Error parsing JSON, source is not valid.");
    });
})(jQuery);
function check_applet() {
  var a = "Netscape" == navigator.appName && navigator.appVersion < "5",
    b = "Opera" == navigator.appName;
  BigInt.is_ie = "Microsoft Internet Explorer" == navigator.appName;
  var c =
    BigInt.is_ie ||
    (!a && "Linux" == navigator.platform.substr(0, 5)) ||
    b ||
    "undefined" == typeof java;
  if (c) {
    var d = JSCRYPTO_HOME,
      e =
        '<applet codebase="' +
        d +
        '" mayscript name="bigint" code="bigint.class" width=1 height=1 id="bigint_applet"></applet>';
    $("#applet_div").html(e);
  }
  return c;
}
var USE_SJCL = !0;
if (USE_SJCL) {
  var BigInt = BigInteger;
  (BigInt.TWO = new BigInt("2", 10)),
    (BigInt.setup = function (a, b) {
      a();
    }),
    (BigInt.prototype.toJSONObject = function () {
      return this.toString();
    });
} else
  (BigInt = Class.extend({
    init: function (a, b) {
      if (null == a) throw "null value!";
      if (USE_SJCL) this._java_bigint = new BigInteger(a, b);
      else if (BigInt.use_applet)
        this._java_bigint = BigInt.APPLET.newBigInteger(a, b);
      else
        try {
          this._java_bigint = new java.math.BigInteger(a, b);
        } catch (c) {
          throw TypeError;
        }
    },
    toString: function () {
      return this._java_bigint.toString() + "";
    },
    toJSONObject: function () {
      return this.toString();
    },
    add: function (a) {
      return BigInt._from_java_object(this._java_bigint.add(a._java_bigint));
    },
    bitLength: function () {
      return this._java_bigint.bitLength();
    },
    mod: function (a) {
      return BigInt._from_java_object(this._java_bigint.mod(a._java_bigint));
    },
    equals: function (a) {
      return this._java_bigint.equals(a._java_bigint);
    },
    modPow: function (a, b) {
      return BigInt._from_java_object(
        this._java_bigint.modPow(a._java_bigint, b._java_bigint)
      );
    },
    negate: function () {
      return BigInt._from_java_object(this._java_bigint.negate());
    },
    multiply: function (a) {
      return BigInt._from_java_object(
        this._java_bigint.multiply(a._java_bigint)
      );
    },
    modInverse: function (a) {
      return BigInt._from_java_object(
        this._java_bigint.modInverse(a._java_bigint)
      );
    },
  })),
    (BigInt.ready_p = !1),
    (BigInt._from_java_object = function (a) {
      var b = new BigInt("0", 10);
      return (b._java_bigint = a), b;
    }),
    (BigInt._setup = function () {
      BigInt.use_applet && (BigInt.APPLET = document.applets.bigint);
      try {
        (BigInt.ZERO = new BigInt("0", 10)),
          (BigInt.ONE = new BigInt("1", 10)),
          (BigInt.TWO = new BigInt("2", 10)),
          (BigInt.FORTY_TWO = new BigInt("42", 10)),
          (BigInt.ready_p = !0);
      } catch (a) {
        return (
          null == this.num_invocations && (this.num_invocations = 0),
          (this.num_invocations += 1),
          void (
            this.num_invocations > 5 &&
            (USE_SJCL
              ? (BigInt.setup_interval &&
                  window.clearInterval(BigInt.setup_interval),
                BigInt.setup_fail
                  ? BigInt.setup_fail()
                  : alert("bigint failed!"))
              : ((USE_SJCL = !0),
                (this.num_invocations = 1),
                (BigInt.use_applet = !1)))
          )
        );
      }
      BigInt.setup_interval && window.clearInterval(BigInt.setup_interval),
        BigInt.setup_callback && BigInt.setup_callback();
    }),
    (BigInt.setup = function (a, b) {
      a && (BigInt.setup_callback = a),
        b && (BigInt.setup_fail = b),
        (BigInt.setup_interval = window.setInterval("BigInt._setup()", 1e3));
    });
(BigInt.fromJSONObject = function (a) {
  return new BigInt(a, 10);
}),
  (BigInt.fromInt = function (a) {
    return BigInt.fromJSONObject("" + a);
  }),
  (BigInt.use_applet = !1);
(Random = {}),
  (Random.GENERATOR = null),
  (Random.setupGenerator = function () {}),
  (Random.getRandomInteger = function (a) {
    var b = a.bitLength();
    Random.setupGenerator();
    var c;
    c = sjcl.random.randomWords(b / 32, 0);
    var d = new BigInt(sjcl.codec.hex.fromBits(c), 16);
    return d.mod(a);
  });
(ElGamal = {}),
  (ElGamal.Params = Class.extend({
    init: function (a, b, c) {
      (this.p = a), (this.q = b), (this.g = c);
    },
    generate: function () {
      var a = Random.getRandomInteger(this.q),
        b = this.g.modPow(a, this.p),
        c = new ElGamal.PublicKey(this.p, this.q, this.g, b),
        d = new ElGamal.SecretKey(a, c);
      return d;
    },
    toJSONObject: function () {
      return {
        g: this.g.toJSONObject(),
        p: this.p.toJSONObject(),
        q: this.q.toJSONObject(),
      };
    },
  })),
  (ElGamal.Params.fromJSONObject = function (a) {
    var b = new ElGamal.Params();
    return (
      (b.p = BigInt.fromJSONObject(a.p)),
      (b.q = BigInt.fromJSONObject(a.q)),
      (b.g = BigInt.fromJSONObject(a.g)),
      b
    );
  }),
  (ElGamal.PublicKey = Class.extend({
    init: function (a, b, c, d) {
      (this.p = a), (this.q = b), (this.g = c), (this.y = d);
    },
    toJSONObject: function () {
      return {
        g: this.g.toJSONObject(),
        p: this.p.toJSONObject(),
        q: this.q.toJSONObject(),
        y: this.y.toJSONObject(),
      };
    },
    verifyKnowledgeOfSecretKey: function (a, b) {
      if (null != b && !a.challenge.equals(b(a.commitment))) return !1;
      var c = this.g
        .modPow(a.response, this.p)
        .equals(
          this.y.modPow(a.challenge, this.p).multiply(a.commitment).mod(this.p)
        );
      return c;
    },
    verifyDecryptionFactor: function (a, b, c, d) {
      return c.verify(this.g, a.alpha, this.y, b, this.p, this.q, d);
    },
    multiply: function (a) {
      if (0 == a || 1 == a) return this;
      if (!this.p.equals(a.p)) throw "mismatched params";
      if (!this.g.equals(a.g)) throw "mismatched params";
      var b = new ElGamal.PublicKey(
        this.p,
        this.q,
        this.g,
        this.y.multiply(a.y).mod(this.p)
      );
      return b;
    },
    equals: function (a) {
      return (
        this.p.equals(a.p) &&
        this.q.equals(a.q) &&
        this.g.equals(a.g) &&
        this.y.equals(a.y)
      );
    },
  })),
  (ElGamal.PublicKey.fromJSONObject = function (a) {
    var b = new ElGamal.PublicKey();
    return (
      (b.p = BigInt.fromJSONObject(a.p)),
      (b.q = BigInt.fromJSONObject(a.q)),
      (b.g = BigInt.fromJSONObject(a.g)),
      (b.y = BigInt.fromJSONObject(a.y)),
      b
    );
  }),
  (ElGamal.SecretKey = Class.extend({
    init: function (a, b) {
      (this.x = a), (this.pk = b);
    },
    toJSONObject: function () {
      return { public_key: this.pk.toJSONObject(), x: this.x.toJSONObject() };
    },
    decryptionFactor: function (a) {
      var b = a.alpha.modPow(this.x, this.pk.p);
      return b;
    },
    decrypt: function (a, b) {
      return b || (b = this.decryptionFactor(a)), a.decrypt([b]);
    },
    decryptAndProve: function (a, b) {
      var c = this.decryptionFactorAndProof(a, b),
        d = this.decrypt(a, c.decryption_factor);
      return { plaintext: d, proof: c.decryption_proof };
    },
    decryptionFactorAndProof: function (a, b) {
      var c = this.decryptionFactor(a),
        d = ElGamal.Proof.generate(
          this.pk.g,
          a.alpha,
          this.x,
          this.pk.p,
          this.pk.q,
          b
        );
      return { decryption_factor: c, decryption_proof: d };
    },
    proveKnowledge: function (a) {
      var b = Random.getRandomInteger(this.pk.q),
        c = this.pk.g.modPow(b, this.pk.p),
        d = a(c),
        e = b.add(this.x.multiply(d)).mod(this.pk.q);
      return new ElGamal.DLogProof(c, d, e);
    },
  })),
  (ElGamal.SecretKey.fromJSONObject = function (a) {
    var b = new ElGamal.SecretKey();
    return (
      (b.pk = ElGamal.PublicKey.fromJSONObject(a.public_key)),
      (b.x = BigInt.fromJSONObject(a.x)),
      b
    );
  }),
  (ElGamal.Ciphertext = Class.extend({
    init: function (a, b, c) {
      (this.alpha = a), (this.beta = b), (this.pk = c);
    },
    toString: function () {
      return this.alpha.toString() + "," + this.beta.toString();
    },
    toJSONObject: function () {
      return {
        alpha: this.alpha.toJSONObject(),
        beta: this.beta.toJSONObject(),
      };
    },
    multiply: function (a) {
      return 1 == a
        ? this
        : new ElGamal.Ciphertext(
            this.alpha.multiply(a.alpha).mod(this.pk.p),
            this.beta.multiply(a.beta).mod(this.pk.p),
            this.pk
          );
    },
    decrypt: function (a) {
      var b = this.beta,
        c = this;
      return (
        _(a).each(function (a) {
          b = a.modInverse(c.pk.p).multiply(b).mod(c.pk.p);
        }),
        new ElGamal.Plaintext(b, this.pk, !1)
      );
    },
    generateProof: function (a, b, c) {
      var d = ElGamal.Proof.generate(
        this.pk.g,
        this.pk.y,
        b,
        this.pk.p,
        this.pk.q,
        c
      );
      return d;
    },
    simulateProof: function (a, b) {
      var c = this.beta.multiply(a.m.modInverse(this.pk.p)).mod(this.pk.p);
      return ElGamal.Proof.simulate(
        this.pk.g,
        this.pk.y,
        this.alpha,
        c,
        this.pk.p,
        this.pk.q,
        b
      );
    },
    verifyProof: function (a, b, c) {
      var d = this.beta.multiply(a.m.modInverse(this.pk.p)).mod(this.pk.p);
      return b.verify(
        this.pk.g,
        this.pk.y,
        this.alpha,
        d,
        this.pk.p,
        this.pk.q,
        c
      );
    },
    verifyDecryptionProof: function (a, b, c) {
      var d = this.beta.multiply(a.m.modInverse(this.pk.p)).mod(this.pk.p);
      return b.verify(
        this.pk.g,
        this.alpha,
        this.pk.y,
        d,
        this.pk.p,
        this.pk.q,
        c
      );
    },
    generateDisjunctiveProof: function (a, b, c, d) {
      var e = this,
        f = _(a).map(function (a, c) {
          return c == b ? {} : e.simulateProof(a);
        }),
        g = this.generateProof(a[b], c, function (a) {
          f[b] = { commitment: a };
          var c = _(f).map(function (a) {
              return a.commitment;
            }),
            g = d(c),
            h = g;
          return (
            _(f).each(function (a, c) {
              c != b && (h = h.add(a.challenge.negate()));
            }),
            h.mod(e.pk.q)
          );
        });
      return (f[b] = g), new ElGamal.DisjunctiveProof(f);
    },
    verifyDisjunctiveProof: function (a, b, c) {
      for (var d = b.proofs, e = 0; e < a.length; e++)
        if (!this.verifyProof(a[e], d[e])) return !1;
      var f = _(d).map(function (a) {
          return a.commitment;
        }),
        g = c(f),
        h = new BigInt("0", 10),
        i = this;
      return (
        _(d).each(function (a) {
          h = h.add(a.challenge).mod(i.pk.q);
        }),
        g.equals(h)
      );
    },
    equals: function (a) {
      return this.alpha.equals(a.alpha) && this.beta.equals(a.beta);
    },
  })),
  (ElGamal.Ciphertext.fromJSONObject = function (a, b) {
    return new ElGamal.Ciphertext(
      BigInt.fromJSONObject(a.alpha),
      BigInt.fromJSONObject(a.beta),
      b
    );
  }),
  (ElGamal.Plaintext = Class.extend({
    init: function (a, b, c) {
      if (null == a) return void alert("oy null m");
      if (((this.pk = b), c)) {
        var d = a.add(BigInt.ONE),
          e = d.modPow(b.q, b.p);
        e.equals(BigInt.ONE) ? (this.m = d) : (this.m = d.negate().mod(b.p));
      } else this.m = a;
    },
    getPlaintext: function () {
      var a;
      return (
        (a =
          this.m.compareTo(this.pk.q) < 0
            ? this.m
            : this.m.negate().mod(this.pk.p)),
        a.subtract(BigInt.ONE)
      );
    },
    getM: function () {
      return this.m;
    },
  })),
  (ElGamal.Proof = Class.extend({
    init: function (a, b, c, d) {
      (this.commitment = {}),
        (this.commitment.A = a),
        (this.commitment.B = b),
        (this.challenge = c),
        (this.response = d);
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
    verify: function (a, b, c, d, e, f, g) {
      var h = a
          .modPow(this.response, e)
          .equals(
            c.modPow(this.challenge, e).multiply(this.commitment.A).mod(e)
          ),
        i = b
          .modPow(this.response, e)
          .equals(
            d.modPow(this.challenge, e).multiply(this.commitment.B).mod(e)
          ),
        j = !0;
      return g && (j = this.challenge.equals(g(this.commitment))), h && i && j;
    },
  })),
  (ElGamal.Proof.fromJSONObject = function (a) {
    return new ElGamal.Proof(
      BigInt.fromJSONObject(a.commitment.A),
      BigInt.fromJSONObject(a.commitment.B),
      BigInt.fromJSONObject(a.challenge),
      BigInt.fromJSONObject(a.response)
    );
  }),
  (ElGamal.Proof.generate = function (a, b, c, d, e, f) {
    var g = Random.getRandomInteger(e),
      h = new ElGamal.Proof();
    return (
      (h.commitment.A = a.modPow(g, d)),
      (h.commitment.B = b.modPow(g, d)),
      (h.challenge = f(h.commitment)),
      (h.response = g.add(c.multiply(h.challenge)).mod(e)),
      h
    );
  }),
  (ElGamal.Proof.simulate = function (a, b, c, d, e, f, g) {
    null == g && (g = Random.getRandomInteger(f));
    var h = Random.getRandomInteger(f),
      i = c.modPow(g, e).modInverse(e).multiply(a.modPow(h, e)).mod(e),
      j = d.modPow(g, e).modInverse(e).multiply(b.modPow(h, e)).mod(e);
    return new ElGamal.Proof(i, j, g, h);
  }),
  (ElGamal.DisjunctiveProof = Class.extend({
    init: function (a) {
      this.proofs = a;
    },
    toJSONObject: function () {
      return _(this.proofs).map(function (a) {
        return a.toJSONObject();
      });
    },
  })),
  (ElGamal.DisjunctiveProof.fromJSONObject = function (a) {
    return null == a
      ? null
      : new ElGamal.DisjunctiveProof(
          _(a).map(function (a) {
            return ElGamal.Proof.fromJSONObject(a);
          })
        );
  }),
  (ElGamal.encrypt = function (a, b, c) {
    if (b.getM().equals(BigInt.ZERO)) throw "Can't encrypt 0 with El Gamal";
    c || (c = Random.getRandomInteger(a.q));
    var d = a.g.modPow(c, a.p),
      e = a.y.modPow(c, a.p).multiply(b.m).mod(a.p);
    return new ElGamal.Ciphertext(d, e, a);
  }),
  (ElGamal.DLogProof = Class.extend({
    init: function (a, b, c) {
      (this.commitment = a), (this.challenge = b), (this.response = c);
    },
    toJSONObject: function () {
      return {
        challenge: this.challenge.toJSONObject(),
        commitment: this.commitment.toJSONObject(),
        response: this.response.toJSONObject(),
      };
    },
  })),
  (ElGamal.DLogProof.fromJSONObject = function (a) {
    return new ElGamal.DLogProof(
      BigInt.fromJSONObject(a.commitment || a.s),
      BigInt.fromJSONObject(a.challenge),
      BigInt.fromJSONObject(a.response)
    );
  }),
  (ElGamal.disjunctive_challenge_generator = function (a) {
    var b = [];
    return (
      _(a).each(function (a) {
        (b[b.length] = a.A.toJSONObject()), (b[b.length] = a.B.toJSONObject());
      }),
      new BigInt(hex_sha1(b.join(",")), 16)
    );
  }),
  (ElGamal.fiatshamir_challenge_generator = function (a) {
    return ElGamal.disjunctive_challenge_generator([a]);
  }),
  (ElGamal.fiatshamir_dlog_challenge_generator = function (a) {
    return new BigInt(hex_sha1(a.toJSONObject()), 16);
  });
function hex_sha1(a) {
  return binb2hex(core_sha1(str2binb(a), a.length * chrsz));
}
function b64_sha1(a) {
  return binb2b64(core_sha1(str2binb(a), a.length * chrsz));
}
function str_sha1(a) {
  return binb2str(core_sha1(str2binb(a), a.length * chrsz));
}
function hex_hmac_sha1(a, b) {
  return binb2hex(core_hmac_sha1(a, b));
}
function b64_hmac_sha1(a, b) {
  return binb2b64(core_hmac_sha1(a, b));
}
function str_hmac_sha1(a, b) {
  return binb2str(core_hmac_sha1(a, b));
}
function sha1_vm_test() {
  return "a9993e364706816aba3e25717850c26c9cd0d89d" == hex_sha1("abc");
}
function core_sha1(a, b) {
  (a[b >> 5] |= 128 << (24 - (b % 32))), (a[(((b + 64) >> 9) << 4) + 15] = b);
  for (
    var c = Array(80),
      d = 1732584193,
      e = -271733879,
      f = -1732584194,
      g = 271733878,
      h = -1009589776,
      i = 0;
    i < a.length;
    i += 16
  ) {
    for (var j = d, k = e, l = f, m = g, n = h, o = 0; 80 > o; o++) {
      16 > o
        ? (c[o] = a[i + o])
        : (c[o] = rol(c[o - 3] ^ c[o - 8] ^ c[o - 14] ^ c[o - 16], 1));
      var p = safe_add(
        safe_add(rol(d, 5), sha1_ft(o, e, f, g)),
        safe_add(safe_add(h, c[o]), sha1_kt(o))
      );
      (h = g), (g = f), (f = rol(e, 30)), (e = d), (d = p);
    }
    (d = safe_add(d, j)),
      (e = safe_add(e, k)),
      (f = safe_add(f, l)),
      (g = safe_add(g, m)),
      (h = safe_add(h, n));
  }
  return Array(d, e, f, g, h);
}
function sha1_ft(a, b, c, d) {
  return 20 > a
    ? (b & c) | (~b & d)
    : 40 > a
    ? b ^ c ^ d
    : 60 > a
    ? (b & c) | (b & d) | (c & d)
    : b ^ c ^ d;
}
function sha1_kt(a) {
  return 20 > a
    ? 1518500249
    : 40 > a
    ? 1859775393
    : 60 > a
    ? -1894007588
    : -899497514;
}
function core_hmac_sha1(a, b) {
  var c = str2binb(a);
  c.length > 16 && (c = core_sha1(c, a.length * chrsz));
  for (var d = Array(16), e = Array(16), f = 0; 16 > f; f++)
    (d[f] = 909522486 ^ c[f]), (e[f] = 1549556828 ^ c[f]);
  var g = core_sha1(d.concat(str2binb(b)), 512 + b.length * chrsz);
  return core_sha1(e.concat(g), 672);
}
function safe_add(a, b) {
  var c = (65535 & a) + (65535 & b),
    d = (a >> 16) + (b >> 16) + (c >> 16);
  return (d << 16) | (65535 & c);
}
function rol(a, b) {
  return (a << b) | (a >>> (32 - b));
}
function str2binb(a) {
  for (
    var b = Array(), c = (1 << chrsz) - 1, d = 0;
    d < a.length * chrsz;
    d += chrsz
  )
    b[d >> 5] |= (a.charCodeAt(d / chrsz) & c) << (32 - chrsz - (d % 32));
  return b;
}
function binb2str(a) {
  for (var b = "", c = (1 << chrsz) - 1, d = 0; d < 32 * a.length; d += chrsz)
    b += String.fromCharCode((a[d >> 5] >>> (32 - chrsz - (d % 32))) & c);
  return b;
}
function binb2hex(a) {
  for (
    var b = hexcase ? "0123456789ABCDEF" : "0123456789abcdef", c = "", d = 0;
    d < 4 * a.length;
    d++
  )
    c +=
      b.charAt((a[d >> 2] >> (8 * (3 - (d % 4)) + 4)) & 15) +
      b.charAt((a[d >> 2] >> (8 * (3 - (d % 4)))) & 15);
  return c;
}
function binb2b64(a) {
  for (
    var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      c = "",
      d = 0;
    d < 4 * a.length;
    d += 3
  )
    for (
      var e =
          (((a[d >> 2] >> (8 * (3 - (d % 4)))) & 255) << 16) |
          (((a[(d + 1) >> 2] >> (8 * (3 - ((d + 1) % 4)))) & 255) << 8) |
          ((a[(d + 2) >> 2] >> (8 * (3 - ((d + 2) % 4)))) & 255),
        f = 0;
      4 > f;
      f++
    )
      c +=
        8 * d + 6 * f > 32 * a.length
          ? b64pad
          : b.charAt((e >> (6 * (3 - f))) & 63);
  return c;
}
var hexcase = 0,
  b64pad = "",
  chrsz = 8;
function safe_add(a, b) {
  var c = (65535 & a) + (65535 & b),
    d = (a >> 16) + (b >> 16) + (c >> 16);
  return (d << 16) | (65535 & c);
}
function S(a, b) {
  return (a >>> b) | (a << (32 - b));
}
function R(a, b) {
  return a >>> b;
}
function Ch(a, b, c) {
  return (a & b) ^ (~a & c);
}
function Maj(a, b, c) {
  return (a & b) ^ (a & c) ^ (b & c);
}
function Sigma0256(a) {
  return S(a, 2) ^ S(a, 13) ^ S(a, 22);
}
function Sigma1256(a) {
  return S(a, 6) ^ S(a, 11) ^ S(a, 25);
}
function Gamma0256(a) {
  return S(a, 7) ^ S(a, 18) ^ R(a, 3);
}
function Gamma1256(a) {
  return S(a, 17) ^ S(a, 19) ^ R(a, 10);
}
function Sigma0512(a) {
  return S(a, 28) ^ S(a, 34) ^ S(a, 39);
}
function Sigma1512(a) {
  return S(a, 14) ^ S(a, 18) ^ S(a, 41);
}
function Gamma0512(a) {
  return S(a, 1) ^ S(a, 8) ^ R(a, 7);
}
function Gamma1512(a) {
  return S(a, 19) ^ S(a, 61) ^ R(a, 6);
}
function core_sha256(a, b) {
  var c,
    d,
    e,
    f,
    g,
    h,
    i,
    j,
    k,
    l,
    m,
    n,
    o = new Array(
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
    ),
    p = new Array(
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ),
    q = new Array(64);
  (a[b >> 5] |= 128 << (24 - (b % 32))), (a[(((b + 64) >> 9) << 4) + 15] = b);
  for (var k = 0; k < a.length; k += 16) {
    (c = p[0]),
      (d = p[1]),
      (e = p[2]),
      (f = p[3]),
      (g = p[4]),
      (h = p[5]),
      (i = p[6]),
      (j = p[7]);
    for (var l = 0; 64 > l; l++)
      16 > l
        ? (q[l] = a[l + k])
        : (q[l] = safe_add(
            safe_add(
              safe_add(Gamma1256(q[l - 2]), q[l - 7]),
              Gamma0256(q[l - 15])
            ),
            q[l - 16]
          )),
        (m = safe_add(
          safe_add(safe_add(safe_add(j, Sigma1256(g)), Ch(g, h, i)), o[l]),
          q[l]
        )),
        (n = safe_add(Sigma0256(c), Maj(c, d, e))),
        (j = i),
        (i = h),
        (h = g),
        (g = safe_add(f, m)),
        (f = e),
        (e = d),
        (d = c),
        (c = safe_add(m, n));
    (p[0] = safe_add(c, p[0])),
      (p[1] = safe_add(d, p[1])),
      (p[2] = safe_add(e, p[2])),
      (p[3] = safe_add(f, p[3])),
      (p[4] = safe_add(g, p[4])),
      (p[5] = safe_add(h, p[5])),
      (p[6] = safe_add(i, p[6])),
      (p[7] = safe_add(j, p[7]));
  }
  return p;
}
function core_sha512(a, b) {
  new Array(
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
  ),
    new Array(
      0x6a09e667f3bcc800,
      0xbb67ae8584caa800,
      0x3c6ef372fe94f800,
      0xa54ff53a5f1d3800,
      0x510e527fade68400,
      0x9b05688c2b3e7000,
      0x1f83d9abfb41bd00,
      0x5be0cd19137e2000
    ),
    new Array(80);
}
function str2binb(a) {
  for (
    var b = Array(), c = (1 << chrsz) - 1, d = 0;
    d < a.length * chrsz;
    d += chrsz
  )
    b[d >> 5] |= (a.charCodeAt(d / chrsz) & c) << (24 - (d % 32));
  return b;
}
function binb2str(a) {
  for (var b = "", c = (1 << chrsz) - 1, d = 0; d < 32 * a.length; d += chrsz)
    b += String.fromCharCode((a[d >> 5] >>> (24 - (d % 32))) & c);
  return b;
}
function binb2hex(a) {
  for (
    var b = hexcase ? "0123456789ABCDEF" : "0123456789abcdef", c = "", d = 0;
    d < 4 * a.length;
    d++
  )
    c +=
      b.charAt((a[d >> 2] >> (8 * (3 - (d % 4)) + 4)) & 15) +
      b.charAt((a[d >> 2] >> (8 * (3 - (d % 4)))) & 15);
  return c;
}
function binb2b64(a) {
  for (
    var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      c = "",
      d = 0;
    d < 4 * a.length;
    d += 3
  )
    for (
      var e =
          (((a[d >> 2] >> (8 * (3 - (d % 4)))) & 255) << 16) |
          (((a[(d + 1) >> 2] >> (8 * (3 - ((d + 1) % 4)))) & 255) << 8) |
          ((a[(d + 2) >> 2] >> (8 * (3 - ((d + 2) % 4)))) & 255),
        f = 0;
      4 > f;
      f++
    )
      c +=
        8 * d + 6 * f > 32 * a.length
          ? b64pad
          : b.charAt((e >> (6 * (3 - f))) & 63);
  return c;
}
function hex_sha256(a) {
  return binb2hex(core_sha256(str2binb(a), a.length * chrsz));
}
function b64_sha256(a) {
  return binb2b64(core_sha256(str2binb(a), a.length * chrsz));
}
function str_sha256(a) {
  return binb2str(core_sha256(str2binb(a), a.length * chrsz));
}
var chrsz = 8,
  hexcase = 0;
var UTILS = {};
(UTILS.array_remove_value = function (a, b) {
  var c = [];
  return (
    _(a).each(function (a, d) {
      a != b && c.push(a);
    }),
    c
  );
}),
  (UTILS.select_element_content = function (a) {
    var b;
    if (window.getSelection) {
      var c = window.getSelection();
      (b = document.createRange()),
        b.selectNodeContents(a),
        c.removeAllRanges(),
        c.addRange(b);
    } else
      document.selection.empty(),
        (b = document.body.createTextRange()),
        b.moveToElementText(el),
        b.select();
  }),
  (UTILS.PROGRESS = Class.extend({
    init: function () {
      (this.n_ticks = 0), (this.current_tick = 0);
    },
    addTicks: function (a) {
      this.n_ticks += a;
    },
    tick: function () {
      this.current_tick += 1;
    },
    progress: function () {
      return Math.round((this.current_tick / this.n_ticks) * 100);
    },
  })),
  (UTILS.object_sort_keys = function (a) {
    var b = {};
    return (
      _(_.keys(a)).each(function (c) {
        b[c] = a[c];
      }),
      b
    );
  }),
  (HELIOS = {}),
  (HELIOS.get_bogus_public_key = function () {
    return ElGamal.PublicKey.fromJSONObject(
      JSON.parse(
        '{"g": "14887492224963187634282421537186040801304008017743492304481737382571933937568724473847106029915040150784031882206090286938661464458896494215273989547889201144857352611058572236578734319505128042602372864570426550855201448111746579871811249114781674309062693442442368697449970648232621880001709535143047913661432883287150003429802392229361583608686643243349727791976247247948618930423866180410558458272606627111270040091203073580238905303994472202930783207472394578498507764703191288249547659899997131166130259700604433891232298182348403175947450284433411265966789131024573629546048637848902243503970966798589660808533", "p": "16328632084933010002384055033805457329601614771185955389739167309086214800406465799038583634953752941675645562182498120750264980492381375579367675648771293800310370964745767014243638518442553823973482995267304044326777047662957480269391322789378384619428596446446984694306187644767462460965622580087564339212631775817895958409016676398975671266179637898557687317076177218843233150695157881061257053019133078545928983562221396313169622475509818442661047018436264806901023966236718367204710755935899013750306107738002364137917426595737403871114187750804346564731250609196846638183903982387884578266136503697493474682071", "q": "61329566248342901292543872769978950870633559608669337131139375508370458778917", "y": "8049609819434159960341080485505898805169812475728892670296439571117039276506298996734003515763387841154083296559889658342770776712289026341097211553854451556820509582109412351633111518323196286638684857563764318086496248973278960517204721786711381246407429787246857335714789053255852788270719245108665072516217144567856965465184127683058484847896371648547639041764249621310049114411288049569523544645318180042074181845024934696975226908854019646138985505600641910417380245960080668869656287919893859172484656506039729440079008919716011166605004711585860172862472422362509002423715947870815838511146670204726187094944"}'
      )
    );
  }),
  (HELIOS.Election = Class.extend({
    init: function () {},
    toJSONObject: function () {
      var a = {
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
      return UTILS.object_sort_keys(a);
    },
    get_hash: function () {
      return this.election_hash
        ? this.election_hash
        : b64_sha256(this.toJSON());
    },
    toJSON: function () {
      return JSON.stringify(this.toJSONObject());
    },
  })),
  (HELIOS.Election.fromJSONString = function (a) {
    var b = JSON.parse(a),
      c = HELIOS.Election.fromJSONObject(b);
    return (c.election_hash = b64_sha256(a)), c;
  }),
  (HELIOS.Election.fromJSONObject = function (a) {
    var b = new HELIOS.Election();
    return (
      _.extend(b, a),
      b.questions || (b.questions = []),
      b.public_key
        ? (b.public_key = ElGamal.PublicKey.fromJSONObject(b.public_key))
        : ((b.public_key = HELIOS.get_bogus_public_key()), (b.BOGUS_P = !0)),
      b
    );
  }),
  (HELIOS.Election.setup = function (a) {
    return ELECTION.fromJSONObject(a);
  }),
  (BALLOT = {}),
  (BALLOT.pretty_choices = function (a, b) {
    var c = a.questions,
      d = b.answers,
      e = _(c).map(function (a, b) {
        return _(d[b]).map(function (a) {
          return c[b].answers[a];
        });
      });
    return e;
  }),
  (UTILS.open_window_with_content = function (a, b) {
    b || (b = "text/plain"),
      BigInt.is_ie
        ? ((w = window.open("")),
          w.document.open(b),
          w.document.write(a),
          w.document.close())
        : (w = window.open("data:" + b + "," + encodeURIComponent(a)));
  }),
  (UTILS.generate_plaintexts = function (a, b, c) {
    var d = BigInt.ONE,
      e = [];
    null == b && (b = 0);
    for (var f = 0; c >= f; f++)
      f >= b && e.push(new ElGamal.Plaintext(d, a, !1)),
        (d = d.multiply(a.g).mod(a.p));
    return e;
  }),
  (HELIOS.EncryptedAnswer = Class.extend({
    init: function (a, b, c, d) {
      if (null != a) {
        this.answer = b;
        var e = this.doEncryption(a, b, c, null, d);
        (this.choices = e.choices),
          (this.randomness = e.randomness),
          (this.individual_proofs = e.individual_proofs),
          (this.overall_proof = e.overall_proof);
      }
    },
    doEncryption: function (a, b, c, d, e) {
      var f = [],
        g = [],
        h = null,
        i = null;
      null != a.max && (i = UTILS.generate_plaintexts(c, a.min, a.max));
      var j = UTILS.generate_plaintexts(c, 0, 1),
        k = !1;
      d || ((d = []), (k = !0));
      for (var l = 0, m = 0; m < a.answers.length; m++) {
        var n;
        _(b).include(m) ? ((n = 1), (l += 1)) : (n = 0),
          k && (d[m] = Random.getRandomInteger(c.q)),
          (f[m] = ElGamal.encrypt(c, j[n], d[m])),
          k &&
            (g[m] = f[m].generateDisjunctiveProof(
              j,
              n,
              d[m],
              ElGamal.disjunctive_challenge_generator
            )),
          e && e.tick();
      }
      if (k && null != a.max) {
        for (var o = f[0], p = d[0], m = 1; m < a.answers.length; m++)
          (o = o.multiply(f[m])), (p = p.add(d[m]).mod(c.q));
        var q = l;
        if (
          (a.min && (q -= a.min),
          (h = o.generateDisjunctiveProof(
            i,
            q,
            p,
            ElGamal.disjunctive_challenge_generator
          )),
          e)
        )
          for (var m = 0; m < a.max; m++) e.tick();
      }
      return {
        choices: f,
        randomness: d,
        individual_proofs: g,
        overall_proof: h,
      };
    },
    clearPlaintexts: function () {
      (this.answer = null), (this.randomness = null);
    },
    verifyEncryption: function (a, b) {
      var c = this.doEncryption(a, this.answer, b, this.randomness);
      if (c.choices.length != this.choices.length) return !1;
      for (var d = 0; d < c.choices.length; d++)
        if (!c.choices[d].equals(this.choices[d])) return !1;
      return !0;
    },
    toString: function () {
      var a = _(this.choices).map(function (a) {
        return a.toString();
      });
      return a.join("|");
    },
    toJSONObject: function (a) {
      var b = {
        choices: _(this.choices).map(function (a) {
          return a.toJSONObject();
        }),
        individual_proofs: _(this.individual_proofs).map(function (a) {
          return a.toJSONObject();
        }),
      };
      return (
        null != this.overall_proof
          ? (b.overall_proof = this.overall_proof.toJSONObject())
          : (b.overall_proof = null),
        a &&
          ((b.answer = this.answer),
          (b.randomness = _(this.randomness).map(function (a) {
            return a.toJSONObject();
          }))),
        b
      );
    },
  })),
  (HELIOS.EncryptedAnswer.fromJSONObject = function (a, b) {
    var c = new HELIOS.EncryptedAnswer();
    return (
      (c.choices = _(a.choices).map(function (a) {
        return ElGamal.Ciphertext.fromJSONObject(a, b.public_key);
      })),
      (c.individual_proofs = _(a.individual_proofs).map(function (a) {
        return ElGamal.DisjunctiveProof.fromJSONObject(a);
      })),
      (c.overall_proof = ElGamal.DisjunctiveProof.fromJSONObject(
        a.overall_proof
      )),
      a.randomness &&
        ((c.randomness = _(a.randomness).map(function (a) {
          return BigInt.fromJSONObject(a);
        })),
        (c.answer = a.answer)),
      c
    );
  }),
  (HELIOS.EncryptedVote = Class.extend({
    init: function (a, b, c) {
      if (
        null != a &&
        ((this.election_uuid = a.uuid),
        (this.election_hash = a.get_hash()),
        (this.election = a),
        null != b)
      ) {
        var d = a.questions.length;
        (this.encrypted_answers = []),
          c &&
            (_(a.questions).each(function (a, b) {
              c.addTicks(a.answers.length), null != a.max && c.addTicks(a.max);
            }),
            c.addTicks(0, d));
        for (var e = 0; d > e; e++)
          this.encrypted_answers[e] = new HELIOS.EncryptedAnswer(
            a.questions[e],
            b[e],
            a.public_key,
            c
          );
      }
    },
    toString: function () {
      var a = _(this.encrypted_answers).map(function (a) {
        return a.toString();
      });
      return a.join("//");
    },
    clearPlaintexts: function () {
      _(this.encrypted_answers).each(function (a) {
        a.clearPlaintexts();
      });
    },
    verifyEncryption: function (a, b) {
      var c = !0;
      return (
        _(this.encrypted_answers).each(function (d, e) {
          c = c && d.verifyEncryption(a[e], b);
        }),
        c
      );
    },
    toJSONObject: function (a) {
      var b = _(this.encrypted_answers).map(function (b, c) {
        return b.toJSONObject(a);
      });
      return {
        answers: b,
        election_hash: this.election_hash,
        election_uuid: this.election_uuid,
      };
    },
    get_hash: function () {
      return b64_sha256(JSON.stringify(this.toJSONObject()));
    },
    get_audit_trail: function () {
      return this.toJSONObject(!0);
    },
    verifyProofs: function (a, b) {
      var c = UTILS.generate_plaintexts(a, 0, 1),
        d = !0,
        e = this;
      return (
        _(this.encrypted_answers).each(function (f, g) {
          var h = 1,
            i = e.election.questions[g].max;
          if (
            (_(f.choices).each(function (a, e) {
              var j = a.verifyDisjunctiveProof(
                c,
                f.individual_proofs[e],
                ElGamal.disjunctive_challenge_generator
              );
              b(g, e, j, a), (d = d && j), null != i && (h = a.multiply(h));
            }),
            null != i)
          ) {
            var j = UTILS.generate_plaintexts(
                a,
                e.election.questions[g].min,
                e.election.questions[g].max
              ),
              k = h.verifyDisjunctiveProof(
                j,
                f.overall_proof,
                ElGamal.disjunctive_challenge_generator
              );
            b(g, null, k, null), (d = d && k);
          } else d = d && null == f.overall_proof;
        }),
        d
      );
    },
  })),
  (HELIOS.EncryptedVote.fromJSONObject = function (a, b) {
    if (null == a) return null;
    var c = new HELIOS.EncryptedVote(b);
    return (
      (c.encrypted_answers = _(a.answers).map(function (a) {
        return HELIOS.EncryptedAnswer.fromJSONObject(a, b);
      })),
      (c.election_hash = a.election_hash),
      (c.election_uuid = a.election_uuid),
      c
    );
  }),
  (HELIOS.EncryptedVote.fromEncryptedAnswers = function (a, b) {
    var c = new HELIOS.EncryptedVote(a, null);
    return (
      (c.encrypted_answers = []),
      _(b).each(function (a, b) {
        c.encrypted_answers[b] = a;
      }),
      c
    );
  }),
  (HELIOS.Tally = Class.extend({
    init: function (a, b) {
      (this.tally = a), (this.num_tallied = b);
    },
    toJSONObject: function () {
      var a = _(this.tally).map(function (a) {
        return _(a).map(function (a) {
          return a.toJSONObject();
        });
      });
      return { num_tallied: this.num_tallied, tally: a };
    },
  })),
  (HELIOS.Tally.fromJSONObject = function (a, b) {
    var c = a.num_tallied,
      d = _(a.tally).map(function (a) {
        return _(a).map(function (a) {
          var c = ElGamal.Ciphertext.fromJSONObject(a, b);
          return c;
        });
      });
    return new HELIOS.Tally(d, c);
  }),
  (HELIOS.jsonify_list_of_lists = function (a) {
    return a
      ? _(a).map(function (a) {
          return _(a).map(function (a) {
            return a.toJSONObject();
          });
        })
      : null;
  }),
  (HELIOS.dejsonify_list_of_lists = function (a, b) {
    return a
      ? _(a).map(function (a) {
          return _(a).map(function (a) {
            return b(a);
          });
        })
      : null;
  }),
  (HELIOS.Trustee = Class.extend({
    init: function (a, b, c, d, e, f) {
      (this.uuid = a),
        (this.public_key = b),
        (this.public_key_hash = c),
        (this.pok = d),
        (this.decryption_factors = e),
        (this.decryption_proofs = f);
    },
    toJSONObject: function () {
      return {
        decryption_factors: HELIOS.jsonify_list_of_lists(
          this.decryption_factors
        ),
        decryption_proofs: HELIOS.jsonify_list_of_list(this.decryption_proofs),
        email: this.email,
        name: this.name,
        pok: this.pok.toJSONObject(),
        public_key: this.public_key.toJSONObject(),
      };
    },
  })),
  (HELIOS.Trustee.fromJSONObject = function (a) {
    return new HELIOS.Trustee(
      a.uuid,
      ElGamal.PublicKey.fromJSONObject(a.public_key),
      a.public_key_hash,
      ElGamal.DLogProof.fromJSONObject(a.pok),
      HELIOS.dejsonify_list_of_lists(
        a.decryption_factors,
        BigInt.fromJSONObject
      ),
      HELIOS.dejsonify_list_of_lists(
        a.decryption_proofs,
        ElGamal.Proof.fromJSONObject
      )
    );
  });
