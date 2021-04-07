const root = (new Function('return this'))();
const hexreg = /[^0-9a-f]/i;

function isHex(str) {
  if ('string' !== typeof str) return false;
  if (hexreg.test(str)) return false;
  return true;
}

function BigDesc(...args) {
  if (this === root) return new BigDesc(...args);
  let [bits, value = 0, format = 'auto'] = args;

  // Default data
  this.bits  = Math.ceil(Math.abs(bits)/16)*16;
  this.value = new Array(this.bits/16).fill(0);

  // Format detection
  if (('auto' === format) && isHex(value)               ) format = 'hex';
  if (('auto' === format) && ('number' === typeof value)) format = 'native';
  if (('auto' === format) && ('bigint' === typeof value)) format = 'bigint';
  if (('auto' === format) && (value instanceof BigDesc )) format = 'bigdesc';
  if ( 'auto' === format) throw new Error("Could not detect input type");

  // Parse value
  switch(format) {
    case 'bigdesc':
      const l = this.value.length;
      this.value = value.value.slice();
      while(this.value.length < l) this.value.push(0);
      while(this.value.length > l) this.value.pop();
      break;
    case 'hex':
      let hex   = ('0'.repeat(this.bits/4) + value).substr(0 - (this.bits / 4));
      let parts = [];
      while(hex.length) {
        parts.unshift(hex.slice(0,4));
        hex = hex.slice(4);
      }
      this.value = parts.map(v => parseInt(v,16));
      break;
    case 'native':
      const sign = value < 0;
      value = Math.floor(Math.abs(value));
      for(let i=0; i<this.value.length && value; i++) {
        this.value[i] = value % (2**16);
        value = value >> 16;
      }
      if (sign) {
        this.value = this.inv().add(1).value;
      }
      break;
    default:
      throw new Error(`Unknown or unsupported format: ${format}`);
  }

}

Object.assign(BigDesc.prototype, {

  toString(format = 'hex') {
    switch(format) {
      case 'hex':
        return this.value
          .reverse()
          .map(v => ('0000' + v.toString(16)).toString(-4))
          .join('');
      default:
        throw new Error(`Unknown or unsupported format: ${format}`);
    }
  },

  inv() {
    const ret = new BigDesc(this.bits, this);
    ret.value.forEach((v,i) => {
      ret.value[i] = ((2**16)-1)-v;
    });
    return ret;
  },

  add(value) {
    value = new BigDesc(this.bits, value);
    const ret = new BigDesc(this.bits, this);

    for(let i=0; i<ret.value.length; i++) {
      ret.value[i] += value.value[i];
      if (ret.value[i] > (2**16)) {
        if (i < ret.value.length-1) {
          let t = ret.value[i]>>16;
          ret.value[i+1] += t;
        }
        ret.value[i] = ret.value[i] % (2**16);
      }
    }

    return ret;
  },

  sub(value) {
    return this.inv().add(value).inv();
  },

  isZero() {
    for(let i=0; i<this.value.length; i++) {
      if (this.value[i]) return false;
    }
    return true;
  },

  isNegative() {
    let v = this.value[this.value.length-1];
    return v >= (2**15);
  },

  isPositive() {
    return !(this.isZero() || this.isNegative());
  },

  gt(value) {
    let cmp = new BigDesc(this.bits, value);
    return cmp.sub(this).isNegative();
  },

  lt(value) {
    let cmp = new BigDesc(this.bits, value);
    return this.sub(cmp).isNegative();
  },

  eq(value) {
    let cmp = new BigDesc(this.bits, value);
    return this.sub(cmp).isZero();
  },

});

module.exports = BigDesc;
