/*
 * A dummy version of bigint for Helios
 *
 * no math is done in JavaScript, but the BigInt abstraction exists so that
 * higher-level data structures can be parsed/serialized appropriately.
 */

// A wrapper for java.math.BigInteger with some appropriate extra functions for JSON and
// generally being a nice JavaScript object.


class BigIntDummy {
  constructor(value, radix) {
    if (radix != 10) throw "in dummy, only radix=10, here radix=" + radix;

    this.value = value;
  }

  toString() {
    return this.value;
  }

  toJSONObject() {
    // toString is apparently not overridden in IE, so we reproduce it here.
    return this.value;
  }

  add(other) {
    throw "dummy, no add!";
  }

  bitLength() {
    throw "dummy, nobitlength!";
  }

  mod(modulus) {
    throw "dummy, no mod!";
  }

  equals(other) {
    throw "dummy, no equals!";
  }

  modPow(exp, modulus) {
    throw "dummy, no modpow!";
  }

  negate() {
    throw "dummy, no negate!";
  }

  multiply(other) {
    throw "dummy, no multiply!";
  }

  modInverse(modulus) {
    throw "dummy, no modInverse";
  }
}

BigIntDummy.use_applet = false;

BigIntDummy.is_dummy = true;
BigIntDummy.in_browser = false;

BigIntDummy.fromJSONObject = function (s) {
  return new BigIntDummy(s, 10);
};

BigIntDummy.fromInt = function (i) {
  return BigIntDummy.BigIntDummy("" + i);
};

BigIntDummy.ZERO = new BigIntDummy("0", 10);
BigIntDummy.ONE = new BigIntDummy("1", 10);
BigIntDummy.TWO = new BigIntDummy("2", 10);
BigIntDummy.FORTY_TWO = new BigIntDummy("42", 10);

BigIntDummy.ready_p = true;

BigIntDummy.setup = function (callback, fail_callback) {
  //console.log("using dummy bigint");
  callback();
};

export { BigIntDummy }
